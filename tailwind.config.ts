import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E8443A",
          dark: "#C4362E",
        },
        secondary: {
          DEFAULT: "#1DB48D",
          dark: "#179474",
        },
        accent: "#F5A623",
        "bg-dark": "#0F1419",
        "bg-card": "#1A2028",
        "bg-elevated": "#242D38",
        "text-primary": "#F7F7F7",
        "text-secondary": "#8B95A5",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        "dm-sans": ["DM Sans", "sans-serif"],
      },
      backgroundImage: {
        "gradient-tropical": "linear-gradient(135deg, #E8443A, #F5A623)",
        "gradient-dark": "linear-gradient(180deg, #0F1419, #1A2028)",
      },
      animation: {
        "wave-slow": "wave 8s ease-in-out infinite",
        "wave-medium": "wave 6s ease-in-out infinite reverse",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "radar-ping": "radarPing 2s ease-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-5%)" },
        },
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(232, 68, 58, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 20px 10px rgba(232, 68, 58, 0.1)",
          },
        },
        radarPing: {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      boxShadow: {
        "glow-primary": "0 0 30px rgba(232, 68, 58, 0.3)",
        "glow-secondary": "0 0 30px rgba(29, 180, 141, 0.3)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
