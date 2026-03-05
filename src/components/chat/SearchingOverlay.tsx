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
      {/* Dots animation */}
      <div className="flex items-center gap-2 mb-8" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-text-secondary"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
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
