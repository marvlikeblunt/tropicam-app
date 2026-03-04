"use client";

import { motion } from "framer-motion";
import { Camera, Search, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: Camera,
    number: "01",
    title: "Autorise ta caméra",
    description:
      "Donne l'accès à ta caméra et à ton micro. Tes données ne sont jamais stockées ni enregistrées.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: Search,
    number: "02",
    title: "On te trouve quelqu'un",
    description:
      "Notre algorithme te connecte instantanément avec une autre personne des DROM-COM, partout dans le monde.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
  },
  {
    icon: MessageSquare,
    number: "03",
    title: "Discute et amuse-toi !",
    description:
      "Échange en vidéo et par messages texte. Passe au suivant quand tu veux — sans prise de tête.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-bg-elevated border border-white/10 text-sm text-text-secondary mb-4 font-dm-sans">
            Simple comme bonjou
          </span>
          <h2 className="font-outfit text-3xl md:text-5xl font-bold text-text-primary">
            Comment ça marche ?
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              {/* Connector line between steps on desktop */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-10 left-full w-full h-px z-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)",
                  }}
                  aria-hidden="true"
                />
              )}

              <div
                className={`relative z-10 p-8 rounded-3xl bg-bg-card border ${step.border} hover:border-opacity-60 transition-all duration-300 group`}
                style={{
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
              >
                {/* Step number */}
                <span className="absolute top-4 right-6 font-outfit text-5xl font-bold text-white/5">
                  {step.number}
                </span>

                {/* Icon */}
                <div
                  className={`w-14 h-14 ${step.bg} ${step.border} border rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <step.icon className={step.color} size={26} />
                </div>

                {/* Content */}
                <h3 className="font-outfit text-xl font-bold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="font-dm-sans text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-text-secondary text-sm mt-12 font-dm-sans"
        >
          100% anonyme • Aucune inscription requise • Aucune donnée stockée
        </motion.p>
      </div>
    </section>
  );
}
