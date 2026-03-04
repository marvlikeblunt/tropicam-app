import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tropicam — Rencontre vidéo pour les DROM-COM",
  description:
    "La première plateforme de rencontre vidéo aléatoire pour les habitants et la diaspora des DROM-COM. Guadeloupe, Martinique, Réunion, Guyane, Mayotte et plus. Gratuit, anonyme, sans inscription.",
  keywords: [
    "DROM-COM",
    "Antilles",
    "vidéo chat",
    "rencontre",
    "Guadeloupe",
    "Martinique",
    "Réunion",
    "Guyane",
    "Mayotte",
    "Polynésie",
    "Nouvelle-Calédonie",
    "Tropicam",
  ],
  authors: [{ name: "Tropicam" }],
  openGraph: {
    title: "Tropicam — Rencontre vidéo pour les DROM-COM",
    description:
      "Connecte-toi en vidéo avec des personnes des DROM-COM du monde entier.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tropicam — Rencontre vidéo pour les DROM-COM",
    description:
      "Connecte-toi en vidéo avec des personnes des DROM-COM du monde entier.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1fa86f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
