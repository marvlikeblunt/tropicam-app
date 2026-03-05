import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (typeof window === "undefined") {
    throw new Error("Socket.IO can only be used in the browser");
  }

  if (!socket) {
    // In production, NEXT_PUBLIC_SOCKET_URL points to the Railway/Render server.
    // In local dev (custom server), leave it empty to connect to the same origin.
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "";

    socket = io(url, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
