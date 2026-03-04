"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Video, Users, Zap } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { getSocket } from "@/lib/socket";
import { type QueueCountPayload } from "@/types";

export default function Hero() {
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    let socket: ReturnType<typeof getSocket> | null = null;
    try {
      socket = getSocket();
      socket.on("queue-count", (data: QueueCountPayload) => {
        setOnlineCount(data.count);
      });
    } catch {
      // Socket not available during SSR
    }
    return () => {
      socket?.off("queue-count");
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-32 overflow-hidden">
      {/* Madras-inspired subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, #E8443A 0px, #E8443A 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, #1DB48D 0px, #1DB48D 1px, transparent 1px, transparent 20px)
          `,
        }}
        aria-hidden="true"
      />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(232,68,58,0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(29,180,141,0.07) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Online indicator badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-card border border-white/10 text-sm text-text-secondary mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
          </span>
          <span>
            {onlineCount > 0
              ? `${onlineCount} personne${onlineCount > 1 ? "s" : ""} en ligne`
              : "Connecte-toi maintenant"}
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-outfit text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Rencontre{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #E8443A, #F5A623)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            les nôtres
          </span>
          <br />
          en vidéo
        </motion.h1>

        {/* Creole tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-outfit text-xl md:text-2xl text-accent font-medium mb-4 italic"
        >
          &ldquo;Konekte épi tout moun&rdquo;
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="font-dm-sans text-base text-text-secondary mb-10 max-w-2xl mx-auto"
        >
          La première plateforme de rencontre vidéo aléatoire pour les habitants
          et la diaspora des DROM-COM — Guadeloupe, Martinique, Réunion, Guyane,
          Mayotte et bien plus.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/chat">
            <Button size="lg" variant="primary" className="animate-pulse-glow">
              <Video size={20} />
              Commencer — C&apos;est gratuit
              <ArrowRight size={18} />
            </Button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-text-secondary"
        >
          {[
            { icon: Video, label: "Vidéo HD" },
            { icon: Users, label: "Sans inscription" },
            { icon: Zap, label: "Connexion instantanée" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={16} className="text-secondary" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
