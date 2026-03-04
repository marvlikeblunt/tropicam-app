import { createServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import next from "next";
import { v4 as uuidv4 } from "uuid";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// ─── Types ────────────────────────────────────────────────────────────────────

interface WaitingUser {
  socketId: string;
  joinedAt: number;
}

interface Room {
  users: [string, string];
  createdAt: number;
}

// ─── In-memory state ──────────────────────────────────────────────────────────

const waitingQueue: WaitingUser[] = [];
const rooms = new Map<string, Room>();
const socketToRoom = new Map<string, string>();

// ─── Rate limiting ────────────────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 1000;

function isRateLimited(socketId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(socketId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(socketId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count++;
  return false;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidRoomId(roomId: unknown): roomId is string {
  return typeof roomId === "string" && UUID_REGEX.test(roomId);
}

function isValidMessage(message: unknown): message is string {
  return (
    typeof message === "string" &&
    message.length > 0 &&
    message.length <= 500
  );
}

interface SdpSignal {
  type: "offer" | "answer";
  sdp: string;
}

interface IceCandidateInit {
  candidate?: string;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
}

function isValidSignal(signal: unknown): signal is SdpSignal {
  if (typeof signal !== "object" || signal === null) return false;
  const s = signal as Record<string, unknown>;
  return (
    (s.type === "offer" || s.type === "answer") &&
    typeof s.sdp === "string"
  );
}

function isValidIceCandidate(candidate: unknown): candidate is IceCandidateInit {
  if (typeof candidate !== "object" || candidate === null) return false;
  return true; // Basic object check — the browser validates the candidate
}

// ─── Room helpers ─────────────────────────────────────────────────────────────

function cleanupRoom(roomId: string, io: SocketServer): void {
  const room = rooms.get(roomId);
  if (!room) return;

  room.users.forEach((userId) => {
    socketToRoom.delete(userId);
    const userSocket = io.sockets.sockets.get(userId);
    userSocket?.leave(roomId);
  });

  rooms.delete(roomId);
}

function removeFromQueue(socketId: string): void {
  const idx = waitingQueue.findIndex((u) => u.socketId === socketId);
  if (idx !== -1) {
    waitingQueue.splice(idx, 1);
  }
}

// ─── Server bootstrap ─────────────────────────────────────────────────────────

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const broadcastOnlineCount = () => {
    io.emit("queue-count", { count: io.engine.clientsCount });
  };

  io.on("connection", (socket: Socket) => {
    console.log(`[+] Connected: ${socket.id} (total: ${io.engine.clientsCount})`);
    broadcastOnlineCount();

    // ── join-queue ──────────────────────────────────────────────────────────

    socket.on("join-queue", () => {
      if (isRateLimited(socket.id)) {
        socket.emit("error-event", { message: "Rate limit exceeded" });
        return;
      }

      // Already in a room — do nothing
      if (socketToRoom.has(socket.id)) return;

      // Already in queue — do nothing
      if (waitingQueue.some((u) => u.socketId === socket.id)) return;

      // Try to match with a waiting user
      while (waitingQueue.length > 0) {
        const partner = waitingQueue.shift()!;
        const partnerSocket = io.sockets.sockets.get(partner.socketId);

        // Partner may have disconnected — try the next one
        if (!partnerSocket || !partnerSocket.connected) continue;

        const roomId = uuidv4();
        rooms.set(roomId, {
          users: [partner.socketId, socket.id],
          createdAt: Date.now(),
        });
        socketToRoom.set(partner.socketId, roomId);
        socketToRoom.set(socket.id, roomId);

        partnerSocket.join(roomId);
        socket.join(roomId);

        partnerSocket.emit("matched", { roomId, initiator: true });
        socket.emit("matched", { roomId, initiator: false });

        console.log(`[match] ${partner.socketId} <-> ${socket.id} in room ${roomId}`);
        return;
      }

      // No one waiting — add to queue
      waitingQueue.push({ socketId: socket.id, joinedAt: Date.now() });
      console.log(`[queue] ${socket.id} waiting. Queue size: ${waitingQueue.length}`);
    });

    // ── leave-queue ─────────────────────────────────────────────────────────

    socket.on("leave-queue", () => {
      removeFromQueue(socket.id);
    });

    // ── signal (SDP offer/answer relay) ────────────────────────────────────

    socket.on("signal", (data: { roomId: unknown; signal: unknown }) => {
      if (isRateLimited(socket.id)) return;
      if (!isValidRoomId(data.roomId)) return;
      if (!isValidSignal(data.signal)) return;

      const room = rooms.get(data.roomId);
      if (!room || !room.users.includes(socket.id)) return;

      socket.to(data.roomId).emit("signal", { signal: data.signal });
    });

    // ── ice-candidate relay ─────────────────────────────────────────────────

    socket.on("ice-candidate", (data: { roomId: unknown; candidate: unknown }) => {
      if (isRateLimited(socket.id)) return;
      if (!isValidRoomId(data.roomId)) return;
      if (!isValidIceCandidate(data.candidate)) return;

      const room = rooms.get(data.roomId);
      if (!room || !room.users.includes(socket.id)) return;

      socket.to(data.roomId).emit("ice-candidate", { candidate: data.candidate });
    });

    // ── chat-message relay ──────────────────────────────────────────────────

    socket.on("chat-message", (data: { roomId: unknown; message: unknown }) => {
      if (isRateLimited(socket.id)) return;
      if (!isValidRoomId(data.roomId)) return;
      if (!isValidMessage(data.message)) return;

      const room = rooms.get(data.roomId);
      if (!room || !room.users.includes(socket.id)) return;

      socket.to(data.roomId).emit("chat-message", { message: data.message });
    });

    // ── skip ────────────────────────────────────────────────────────────────

    socket.on("skip", (data: { roomId: unknown }) => {
      if (isRateLimited(socket.id)) return;
      if (!isValidRoomId(data.roomId)) return;

      const roomId = data.roomId;
      const room = rooms.get(roomId);
      if (!room || !room.users.includes(socket.id)) return;

      // Notify partner before cleanup
      socket.to(roomId).emit("partner-disconnected");

      cleanupRoom(roomId, io);

      // Re-queue the skipper (they want another partner)
      if (!waitingQueue.some((u) => u.socketId === socket.id)) {
        waitingQueue.push({ socketId: socket.id, joinedAt: Date.now() });
        console.log(`[queue] ${socket.id} re-queued after skip. Queue size: ${waitingQueue.length}`);
      }
    });

    // ── disconnect ──────────────────────────────────────────────────────────

    socket.on("disconnect", (reason) => {
      console.log(`[-] Disconnected: ${socket.id} (reason: ${reason})`);

      removeFromQueue(socket.id);

      const roomId = socketToRoom.get(socket.id);
      if (roomId) {
        socket.to(roomId).emit("partner-disconnected");
        cleanupRoom(roomId, io);
      }

      rateLimitMap.delete(socket.id);
      broadcastOnlineCount();
    });
  });

  httpServer.listen(port, () => {
    console.log(`▲ Tropicam ready on http://${hostname}:${port}`);
  });
});
