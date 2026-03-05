/**
 * Standalone Socket.IO server — deploy this on Railway / Render / Fly.io
 * The Next.js frontend (on Vercel) connects to this server via
 * the NEXT_PUBLIC_SOCKET_URL env var.
 */

import { createServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const port = parseInt(process.env.PORT || "4000", 10);

// ─── Allowed origins ──────────────────────────────────────────────────────────
// Add your Vercel URL here, or use "*" for open access during dev
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["*"];

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
  if (entry.count >= RATE_LIMIT) return true;
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
  return typeof message === "string" && message.length > 0 && message.length <= 500;
}

interface SdpSignal {
  type: "offer" | "answer";
  sdp: string;
}

function isValidSignal(signal: unknown): signal is SdpSignal {
  if (typeof signal !== "object" || signal === null) return false;
  const s = signal as Record<string, unknown>;
  return (s.type === "offer" || s.type === "answer") && typeof s.sdp === "string";
}

function isValidIceCandidate(candidate: unknown): boolean {
  return typeof candidate === "object" && candidate !== null;
}

// ─── Room helpers ─────────────────────────────────────────────────────────────

function cleanupRoom(roomId: string, io: SocketServer): void {
  const room = rooms.get(roomId);
  if (!room) return;
  room.users.forEach((userId) => {
    socketToRoom.delete(userId);
    io.sockets.sockets.get(userId)?.leave(roomId);
  });
  rooms.delete(roomId);
}

function removeFromQueue(socketId: string): void {
  const idx = waitingQueue.findIndex((u) => u.socketId === socketId);
  if (idx !== -1) waitingQueue.splice(idx, 1);
}

// ─── Server ───────────────────────────────────────────────────────────────────

const httpServer = createServer((req, res) => {
  // Health check endpoint for Railway / Render
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", queue: waitingQueue.length, rooms: rooms.size }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const io = new SocketServer(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS.includes("*") ? "*" : ALLOWED_ORIGINS,
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
  console.log(`[+] ${socket.id} connected (total: ${io.engine.clientsCount})`);
  broadcastOnlineCount();

  socket.on("join-queue", () => {
    if (isRateLimited(socket.id)) return;
    if (socketToRoom.has(socket.id)) return;
    if (waitingQueue.some((u) => u.socketId === socket.id)) return;

    while (waitingQueue.length > 0) {
      const partner = waitingQueue.shift()!;
      const partnerSocket = io.sockets.sockets.get(partner.socketId);
      if (!partnerSocket?.connected) continue;

      const roomId = uuidv4();
      rooms.set(roomId, { users: [partner.socketId, socket.id], createdAt: Date.now() });
      socketToRoom.set(partner.socketId, roomId);
      socketToRoom.set(socket.id, roomId);
      partnerSocket.join(roomId);
      socket.join(roomId);
      partnerSocket.emit("matched", { roomId, initiator: true });
      socket.emit("matched", { roomId, initiator: false });
      console.log(`[match] ${partner.socketId} <-> ${socket.id} in ${roomId}`);
      return;
    }

    waitingQueue.push({ socketId: socket.id, joinedAt: Date.now() });
    console.log(`[queue] ${socket.id} waiting. Queue: ${waitingQueue.length}`);
  });

  socket.on("leave-queue", () => removeFromQueue(socket.id));

  socket.on("signal", (data: { roomId: unknown; signal: unknown }) => {
    if (isRateLimited(socket.id)) return;
    if (!isValidRoomId(data.roomId) || !isValidSignal(data.signal)) return;
    const room = rooms.get(data.roomId);
    if (!room?.users.includes(socket.id)) return;
    socket.to(data.roomId).emit("signal", { signal: data.signal });
  });

  socket.on("ice-candidate", (data: { roomId: unknown; candidate: unknown }) => {
    if (isRateLimited(socket.id)) return;
    if (!isValidRoomId(data.roomId) || !isValidIceCandidate(data.candidate)) return;
    const room = rooms.get(data.roomId);
    if (!room?.users.includes(socket.id)) return;
    socket.to(data.roomId).emit("ice-candidate", { candidate: data.candidate });
  });

  socket.on("chat-message", (data: { roomId: unknown; message: unknown }) => {
    if (isRateLimited(socket.id)) return;
    if (!isValidRoomId(data.roomId) || !isValidMessage(data.message)) return;
    const room = rooms.get(data.roomId);
    if (!room?.users.includes(socket.id)) return;
    socket.to(data.roomId).emit("chat-message", { message: data.message });
  });

  socket.on("skip", (data: { roomId: unknown }) => {
    if (isRateLimited(socket.id)) return;
    if (!isValidRoomId(data.roomId)) return;
    const room = rooms.get(data.roomId);
    if (!room?.users.includes(socket.id)) return;
    socket.to(data.roomId).emit("partner-disconnected");
    cleanupRoom(data.roomId, io);
    if (!waitingQueue.some((u) => u.socketId === socket.id)) {
      waitingQueue.push({ socketId: socket.id, joinedAt: Date.now() });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`[-] ${socket.id} disconnected (${reason})`);
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
  console.log(`▲ Tropicam Socket.IO server ready on port ${port}`);
});
