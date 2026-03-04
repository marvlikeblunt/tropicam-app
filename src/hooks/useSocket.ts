"use client";

import { useState, useEffect, useRef } from "react";
import { type Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";
import { type QueueCountPayload } from "@/types";

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  onlineCount: number;
}

export function useSocket(): UseSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [, forceUpdate] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const onConnect = () => {
      setIsConnected(true);
      forceUpdate((n) => n + 1);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onQueueCount = (data: QueueCountPayload) => {
      setOnlineCount(data.count);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("queue-count", onQueueCount);

    // Sync with current state
    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("queue-count", onQueueCount);
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    onlineCount,
  };
}
