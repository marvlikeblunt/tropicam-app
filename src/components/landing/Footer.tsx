import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo size="sm" />
            <p className="text-xs text-text-secondary font-dm-sans">
              Fait avec ❤️ depuis les DROM-COM
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {[
              { label: "Confidentialité", href: "#" },
              { label: "Conditions d'utilisation", href: "#" },
              { label: "Contact", href: "#" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 font-dm-sans"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary font-dm-sans">
            © {new Date().getFullYear()} Tropicam. Tous droits réservés.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "Guadeloupe",
              "Martinique",
              "Réunion",
              "Guyane",
              "Mayotte",
              "Polynésie",
              "Nouvelle-Calédonie",
            ].map((territory) => (
              <span
                key={territory}
                className="text-xs px-2 py-0.5 rounded-full bg-bg-elevated text-text-secondary"
              >
                {territory}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
