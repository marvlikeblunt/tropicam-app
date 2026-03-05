"use client";

import { Mic, MicOff, Video, VideoOff, SkipForward, Square } from "lucide-react";
import { motion } from "framer-motion";
import { type ChatState } from "@/types";

interface ChatControlsProps {
  chatState: ChatState;
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onSkip: () => void;
  onStop: () => void;
  onStartSearch: () => void;
}

export default function ChatControls({
  chatState,
  isMuted,
  isCameraOff,
  onToggleMute,
  onToggleCamera,
  onSkip,
  onStop,
  onStartSearch,
}: ChatControlsProps) {
  const isConnected = chatState === "connected";
  const isSearching = chatState === "searching";

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 md:gap-4 p-4 z-30">
      {/* Background blur */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: "linear-gradient(to top, rgba(15,20,25,0.9), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-3 md:gap-4">
        {/* Mute toggle */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleMute}
          disabled={!isConnected && chatState !== "searching"}
          title={isMuted ? "Activer le micro" : "Couper le micro"}
          className={`
            w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center
            border transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none
            ${isMuted
              ? "bg-primary/20 border-primary/40 text-primary"
              : "bg-white/10 border-white/20 text-text-primary hover:bg-white/20"
            }
          `}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </motion.button>

        {/* Camera toggle */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleCamera}
          disabled={!isConnected && chatState !== "searching"}
          title={isCameraOff ? "Activer la caméra" : "Couper la caméra"}
          className={`
            w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center
            border transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none
            ${isCameraOff
              ? "bg-primary/20 border-primary/40 text-primary"
              : "bg-white/10 border-white/20 text-text-primary hover:bg-white/20"
            }
          `}
        >
          {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
        </motion.button>

        {/* Main action button */}
        {chatState === "idle" || chatState === "partner-left" ? (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(29,180,141,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartSearch}
            className="px-6 py-3 md:px-8 md:py-4 rounded-2xl font-semibold text-white text-sm md:text-base transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #1DB48D, #179474)" }}
          >
            {chatState === "partner-left" ? "Chercher quelqu'un d'autre" : "Lancer la recherche"}
          </motion.button>
        ) : (
          <>
            {/* Skip button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(232,68,58,0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onSkip}
              disabled={isSearching}
              title="Partenaire suivant"
              className="
                flex items-center gap-2 px-5 py-3 md:px-6 md:py-3.5 rounded-2xl font-semibold
                text-white text-sm md:text-base transition-all duration-200
                disabled:opacity-50 disabled:pointer-events-none
              "
              style={{ background: "linear-gradient(135deg, #E8443A, #F5A623)" }}
            >
              <SkipForward size={18} />
              <span className="hidden sm:inline">Suivant</span>
            </motion.button>

            {/* Stop button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStop}
              title="Arrêter"
              className="
                w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center
                bg-white/10 border border-white/20 text-text-primary
                hover:bg-primary/20 hover:border-primary/40 hover:text-primary
                transition-all duration-200
              "
            >
              <Square size={18} />
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
