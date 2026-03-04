import Link from "next/link";
import { Video } from "lucide-react";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";
import Logo from "@/components/ui/Logo";
import WaveBackground from "@/components/ui/WaveBackground";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-bg-dark flex flex-col">
      {/* Fixed navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4">
        <div
          className="absolute inset-0 backdrop-blur-md border-b border-white/5"
          style={{ background: "rgba(15,20,25,0.8)" }}
          aria-hidden="true"
        />
        <div className="relative flex items-center justify-between w-full max-w-6xl mx-auto">
          <Logo size="md" />
          <Link
            href="/chat"
            className="
              inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl
              font-semibold text-sm text-white transition-all duration-200
              hover:shadow-glow-primary hover:scale-[1.03] active:scale-[0.98]
            "
            style={{ background: "linear-gradient(135deg, #E8443A, #F5A623)" }}
          >
            <Video size={16} />
            Commencer
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">
        <Hero />
        <HowItWorks />
      </main>

      {/* Wave decoration */}
      <div className="relative">
        <WaveBackground />
      </div>

      <Footer />
    </div>
  );
}
