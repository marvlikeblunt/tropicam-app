"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";

interface SearchingOverlayProps {
  onCancel: () => void;
}

export default function SearchingOverlay({ onCancel }: SearchingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-bg-dark/95 backdrop-blur-sm z-20"
    >
      {/* Radar animation */}
      <div className="relative w-28 h-28 mb-8" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-primary"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeOut",
            }}
          />
        ))}
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-10 h-10 rounded-full"
            style={{
              background: "linear-gradient(135deg, #E8443A, #F5A623)",
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-outfit text-2xl font-bold text-text-primary mb-2"
      >
        Recherche en cours...
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-dm-sans text-text-secondary mb-8 text-center px-4"
      >
        On te trouve quelqu&apos;un des DROM-COM
        <br />
        <span className="text-sm">Ça ne devrait pas tarder !</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={16} />
          Annuler
        </Button>
      </motion.div>
    </motion.div>
  );
}
