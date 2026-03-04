"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, RefreshCw, AlertTriangle, MessageSquare, X } from "lucide-react";
import Link from "next/link";

import { useMediaStream } from "@/hooks/useMediaStream";
import { useSocket } from "@/hooks/useSocket";
import { useWebRTC } from "@/hooks/useWebRTC";

import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";
import ChatControls from "./ChatControls";
import TextChat from "./TextChat";
import SearchingOverlay from "./SearchingOverlay";
import ConnectionStatus from "./ConnectionStatus";

import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

import {
  type ChatState,
  type ChatMessage,
  type MatchedPayload,
  type ChatMessagePayload,
} from "@/types";

export default function VideoChat() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [chatState, setChatState] = useState<ChatState>("idle");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false); // Mobile chat drawer

  const roomIdRef = useRef<string | null>(null);

  // ── Hooks ──────────────────────────────────────────────────────────────────
  const {
    stream: localStream,
    isLoading: isMediaLoading,
    error: mediaError,
    isMuted,
    isCameraOff,
    toggleMute,
    toggleCamera,
    requestPermissions,
  } = useMediaStream();

  const { socket, isConnected: isSocketConnected } = useSocket();

  const { remoteStream, startConnection, cleanup: cleanupWebRTC } = useWebRTC(
    localStream,
    socket
  );

  // Keep roomId ref in sync
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  // When remote stream arrives, transition to connected state
  useEffect(() => {
    if (remoteStream) {
      setChatState("connected");
    }
  }, [remoteStream]);

  // ── Socket event handlers ──────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleMatched = async (data: MatchedPayload) => {
      setRoomId(data.roomId);
      setMessages([]);
      // Start WebRTC negotiation
      await startConnection(data.roomId, data.initiator);
    };

    const handlePartnerDisconnected = () => {
      cleanupWebRTC();
      setRoomId(null);
      setChatState("partner-left");
    };

    const handleChatMessage = (data: ChatMessagePayload) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: data.message,
          isMine: false,
          timestamp: new Date(),
        },
      ]);
    };

    socket.on("matched", handleMatched);
    socket.on("partner-disconnected", handlePartnerDisconnected);
    socket.on("chat-message", handleChatMessage);

    return () => {
      socket.off("matched", handleMatched);
      socket.off("partner-disconnected", handlePartnerDisconnected);
      socket.off("chat-message", handleChatMessage);
    };
  }, [socket, startConnection, cleanupWebRTC]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const startSearch = useCallback(() => {
    if (!socket || !localStream) return;
    setChatState("searching");
    socket.emit("join-queue");
  }, [socket, localStream]);

  const handleSkip = useCallback(() => {
    const currentRoomId = roomIdRef.current;
    if (!socket || !currentRoomId) return;

    // Notify server (server will notify partner + re-queue us)
    socket.emit("skip", { roomId: currentRoomId });

    cleanupWebRTC();
    setRoomId(null);
    setMessages([]);
    // Stay in searching state — server has already re-queued us
    setChatState("searching");
  }, [socket, cleanupWebRTC]);

  const handleStop = useCallback(() => {
    if (!socket) return;

    const currentRoomId = roomIdRef.current;
    if (currentRoomId) {
      // Notify partner, server re-queues us
      socket.emit("skip", { roomId: currentRoomId });
      // Then immediately leave the queue
      socket.emit("leave-queue");
    } else if (chatState === "searching") {
      socket.emit("leave-queue");
    }

    cleanupWebRTC();
    setRoomId(null);
    setMessages([]);
    setChatState("idle");
  }, [socket, chatState, cleanupWebRTC]);

  const handleCancelSearch = useCallback(() => {
    if (!socket) return;
    socket.emit("leave-queue");
    setChatState("idle");
  }, [socket]);

  const sendMessage = useCallback(
    (text: string) => {
      const currentRoomId = roomIdRef.current;
      if (!socket || !currentRoomId || !text.trim()) return;

      socket.emit("chat-message", { roomId: currentRoomId, message: text.trim() });

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: text.trim(),
          isMine: true,
          timestamp: new Date(),
        },
      ]);
    },
    [socket]
  );

  // ── Render helpers ─────────────────────────────────────────────────────────

  if (isMediaLoading) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-text-secondary font-dm-sans">
          Accès à la caméra en cours...
        </p>
      </div>
    );
  }

  if (mediaError) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center px-4 text-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <AlertTriangle size={36} className="text-primary" />
        </div>
        <div>
          <h2 className="font-outfit text-2xl font-bold text-text-primary mb-2">
            Caméra inaccessible
          </h2>
          <p className="text-text-secondary font-dm-sans max-w-sm">{mediaError}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" onClick={requestPermissions}>
            <RefreshCw size={16} />
            Réessayer
          </Button>
          <Link href="/">
            <Button variant="ghost">Retour</Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Main layout ────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-bg-dark overflow-hidden">
      {/* Navbar */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5 bg-bg-dark/80 backdrop-blur-sm z-30 shrink-0">
        <Link href="/">
          <Logo size="sm" />
        </Link>

        <ConnectionStatus
          chatState={chatState}
          isSocketConnected={isSocketConnected}
        />

        {/* Chat toggle (all screens) */}
        <button
          className="flex items-center gap-1.5 text-sm text-text-secondary px-3 py-1.5 rounded-xl bg-bg-elevated border border-white/10"
          onClick={() => setIsChatOpen((prev) => !prev)}
        >
          <MessageSquare size={15} />
          <span>Chat</span>
          {messages.filter((m) => !m.isMine).length > 0 && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
        </button>
      </header>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Video area (left / full on mobile) ── */}
        <div className="relative flex-1 bg-black overflow-hidden">
          {/* Remote video */}
          <RemoteVideo stream={remoteStream} />

          {/* Local video PiP */}
          <LocalVideo stream={localStream} isCameraOff={isCameraOff} />

          {/* Searching overlay */}
          <AnimatePresence>
            {chatState === "searching" && (
              <SearchingOverlay onCancel={handleCancelSearch} />
            )}
          </AnimatePresence>

          {/* Partner-left overlay */}
          <AnimatePresence>
            {chatState === "partner-left" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-bg-dark/90 backdrop-blur-sm z-20 gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-white/10 flex items-center justify-center">
                  <Camera size={28} className="text-text-secondary" />
                </div>
                <p className="font-outfit text-xl font-bold text-text-primary">
                  Votre partenaire est parti
                </p>
                <p className="text-text-secondary text-sm font-dm-sans">
                  Tu veux rencontrer quelqu&apos;un d&apos;autre ?
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Idle overlay — before first search */}
          <AnimatePresence>
            {chatState === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-bg-dark/70 backdrop-blur-sm z-20 gap-4"
              >
                <p className="font-outfit text-lg font-semibold text-text-secondary">
                  Prêt à rencontrer quelqu&apos;un ?
                </p>
                <p className="text-text-secondary text-sm font-dm-sans opacity-70">
                  Clique sur &ldquo;Lancer la recherche&rdquo; ci-dessous
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls bar */}
          <ChatControls
            chatState={chatState}
            isMuted={isMuted}
            isCameraOff={isCameraOff}
            onToggleMute={toggleMute}
            onToggleCamera={toggleCamera}
            onSkip={handleSkip}
            onStop={handleStop}
            onStartSearch={startSearch}
          />
        </div>

        {/* ── Text chat panel (right on desktop) ── */}
        {isChatOpen && (
          <div className="hidden md:flex flex-col w-80 lg:w-96 shrink-0 border-l border-white/5">
            <TextChat
              messages={messages}
              onSendMessage={sendMessage}
              isConnected={chatState === "connected"}
            />
          </div>
        )}
      </div>

      {/* ── Mobile chat drawer ── */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setIsChatOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 h-[70vh] bg-bg-card rounded-t-3xl border-t border-white/10 z-50 md:hidden flex flex-col"
            >
              {/* Drag handle + close */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="absolute right-4 top-4 text-text-secondary hover:text-text-primary"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <TextChat
                  messages={messages}
                  onSendMessage={sendMessage}
                  isConnected={chatState === "connected"}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
