"use client";

import { useState } from "react";
import Link from "next/link";
import { Video, Zap, Globe, Shield, HelpCircle, ChevronDown } from "lucide-react";
import Logo from "@/components/ui/Logo";

/* ── FAQ data ──────────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    question: "Est-ce que Tropicam est vraiment gratuit ?",
    answer:
      "Oui ! Les fonctionnalités de base (chat vidéo, chat texte, passer au suivant) sont 100% gratuites. Des options premium sont disponibles pour ceux qui veulent plus de fonctionnalités comme les filtres de région.",
  },
  {
    question: "Dois-je créer un compte pour utiliser Tropicam ?",
    answer:
      "Non, tu peux commencer à discuter immédiatement sans inscription. Un compte est optionnel et te permet d'accéder aux fonctionnalités premium et de sauvegarder tes préférences.",
  },
  {
    question: "Comment fonctionne le chat vidéo ?",
    answer:
      "C'est simple ! Clique sur « C'est parti », accepte les règles, autorise ta caméra et ton micro, et tu seras connecté(e) à une personne au hasard. Tu peux passer au suivant à tout moment.",
  },
  {
    question: "Tropicam est-il sécurisé ?",
    answer:
      "Oui ! Nous avons un système de signalement facile et une modération active. Les comportements inappropriés peuvent être signalés en un clic et sont traités rapidement.",
  },
  {
    question: "Pourquoi Tropicam est dédié aux outre-mer ?",
    answer:
      "Tropicam est la première plateforme de chat vidéo créée spécialement pour la communauté des DROM-COM. Notre but est de connecter les Antillais, Réunionnais, Guyanais, Mahorais et tous les ultramarins entre eux ! 🌴",
  },
  {
    question: "Puis-je utiliser Tropicam sur mobile ?",
    answer:
      "Absolument ! Tropicam fonctionne sur ordinateur, tablette et smartphone. Il te suffit d'un navigateur web moderne et d'une connexion internet.",
  },
];

/* ── FAQ accordion item ─────────────────────────────────────────────────── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/50 last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between py-4 text-sm md:text-base text-foreground hover:text-primary transition-colors"
      >
        <span>{question}</span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm md:text-base text-muted-foreground">
          {answer}
        </p>
      )}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tropical-sand via-background to-tropical-coral-light/30 flex flex-col overflow-hidden relative">

      {/* ── Floating tropical emojis ──────────────────────────────────────── */}
      <div className="absolute top-20 left-10 text-6xl animate-wave opacity-60 pointer-events-none select-none" aria-hidden="true">🌴</div>
      <div className="absolute top-40 right-16 text-4xl animate-float opacity-50 pointer-events-none select-none" style={{ animationDelay: "0.5s" }} aria-hidden="true">🥥</div>
      <div className="absolute bottom-32 left-20 text-5xl animate-wave opacity-40 pointer-events-none select-none" style={{ animationDelay: "1s" }} aria-hidden="true">🌺</div>
      <div className="absolute bottom-20 right-10 text-4xl animate-float opacity-50 pointer-events-none select-none" style={{ animationDelay: "1.5s" }} aria-hidden="true">☀️</div>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="relative px-6 py-6 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <Logo />
        </div>
      </header>

      {/* ── Main hero ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">

          {/* Heading + subtitle */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight font-nunito">
              <span className="bg-gradient-to-r from-primary via-tropical-coral to-accent bg-clip-text text-transparent">
                Le chat des outre-mer 🌴
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              🌴 Rencontre de nouvelles personnes de la Guadeloupe, Martinique,
              Guyane, Réunion, Mayotte et tous les territoires d'outre-mer en
              chat vidéo{" "}
              <span className="font-bold text-foreground">gratuit</span> ! 🎥🥥
            </p>
          </div>

          {/* CTA button */}
          <div className="pt-4">
            <Link href="/chat">
              <button className="inline-flex items-center px-12 h-16 text-xl font-bold rounded-full bg-tropical-action hover:bg-tropical-action/90 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 animate-pulse-glow">
                <Video className="w-6 h-6 mr-3" />
                C&apos;est parti ! 🎉
              </button>
            </Link>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 max-w-4xl mx-auto">

            {/* Card 1 — Connexion instantanée */}
            <div className="p-6 bg-card/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/50 transition-all group hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-tropical-coral/20 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Connexion instantanée ⚡</h3>
              <p className="text-muted-foreground text-sm">
                Rencontre de nouvelles personnes en quelques secondes, aucune
                inscription requise pour les fonctionnalités de base
              </p>
            </div>

            {/* Card 2 — Communauté DROM-COM */}
            <div className="p-6 bg-card/80 backdrop-blur-sm border border-border rounded-2xl hover:border-accent/50 transition-all group hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-tropical-palm-light/20 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Communauté DROM-COM 🏝️</h3>
              <p className="text-muted-foreground text-sm">
                Plateforme dédiée aux territoires d'outre-mer français,
                rassemblez-vous !
              </p>
            </div>

            {/* Card 3 — Sûr et modéré */}
            <div className="p-6 bg-card/80 backdrop-blur-sm border border-border rounded-2xl hover:border-tropical-ocean/50 transition-all group hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-tropical-ocean/20 to-accent/20 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-tropical-ocean" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Sûr et modéré 🛡️</h3>
              <p className="text-muted-foreground text-sm">
                Signalement facile et modération active pour une expérience
                sécurisée
              </p>
            </div>
          </div>

          {/* FAQ section */}
          <div className="pt-12 max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-tropical-coral/20 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground font-nunito">
                Questions fréquentes 🤔
              </h2>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4 md:p-6 text-left">
              {FAQ_ITEMS.map((item) => (
                <FaqItem key={item.question} {...item} />
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="pt-8 pb-4 max-w-2xl mx-auto w-full text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-tropical-coral bg-clip-text text-transparent font-nunito leading-tight">
              Prêt(e) à faire des rencontres ? 🌴
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Des personnes des outre-mer t'attendent ! Lance-toi dans un chat
              vidéo gratuit et découvre de nouveaux amis 🎥
            </p>
            <Link href="/chat">
              <button className="inline-flex items-center w-full sm:w-auto justify-center h-12 sm:h-14 px-10 text-base sm:text-lg font-bold rounded-full bg-tropical-action hover:bg-tropical-action/90 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <Video className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                C&apos;est parti ! 🎉
              </button>
            </Link>
          </div>

        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative px-6 py-6 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground space-y-3">
          <p className="font-semibold text-foreground">Tropicam © 2026</p>
          <p>Plateforme communautaire pour les territoires d'outre-mer</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="/terms" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
              Conditions d'utilisation
            </a>
            <a href="/privacy" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
