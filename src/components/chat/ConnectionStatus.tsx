"use client";

import { Wifi, WifiOff } from "lucide-react";
import { type ChatState } from "@/types";

interface ConnectionStatusProps {
  chatState: ChatState;
  isSocketConnected: boolean;
}

const STATE_CONFIG: Record<
  ChatState,
  { label: string; color: string; dot: string }
> = {
  idle: {
    label: "Prêt",
    color: "text-text-secondary",
    dot: "bg-text-secondary",
  },
  searching: {
    label: "Recherche...",
    color: "text-accent",
    dot: "bg-accent animate-pulse",
  },
  connected: {
    label: "Connecté",
    color: "text-secondary",
    dot: "bg-secondary",
  },
  "partner-left": {
    label: "Partenaire parti",
    color: "text-primary",
    dot: "bg-primary",
  },
  error: {
    label: "Erreur",
    color: "text-primary",
    dot: "bg-primary",
  },
};

export default function ConnectionStatus({
  chatState,
  isSocketConnected,
}: ConnectionStatusProps) {
  const config = STATE_CONFIG[chatState];

  return (
    <div className="flex items-center gap-3">
      {/* Socket connectivity */}
      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
        {isSocketConnected ? (
          <Wifi size={12} className="text-secondary" />
        ) : (
          <WifiOff size={12} className="text-primary" />
        )}
        <span className="hidden sm:inline">
          {isSocketConnected ? "En ligne" : "Hors ligne"}
        </span>
      </div>

      <div className="w-px h-4 bg-white/10" />

      {/* Chat state */}
      <div className={`flex items-center gap-1.5 text-xs ${config.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span>{config.label}</span>
      </div>
    </div>
  );
}
