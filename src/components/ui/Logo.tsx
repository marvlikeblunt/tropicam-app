interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export default function Logo({ size = "md", showTagline = false }: LogoProps) {
  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex flex-col items-start">
      <div className={`font-outfit font-bold ${textSizes[size]} flex items-center gap-1`}>
        {/* Camera icon SVG */}
        <svg
          width={size === "lg" ? 40 : size === "md" ? 28 : 20}
          height={size === "lg" ? 40 : size === "md" ? 28 : 20}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8443A" />
              <stop offset="100%" stopColor="#F5A623" />
            </linearGradient>
          </defs>
          {/* Camera body */}
          <rect x="2" y="10" width="28" height="20" rx="4" fill="url(#logoGrad)" />
          {/* Lens */}
          <circle cx="16" cy="20" r="6" fill="#0F1419" />
          <circle cx="16" cy="20" r="4" fill="url(#logoGrad)" opacity="0.6" />
          {/* Viewfinder notch */}
          <path d="M30 16L38 12V28L30 24" fill="url(#logoGrad)" />
          {/* Tropical leaf accent */}
          <circle cx="7" cy="14" r="2" fill="#1DB48D" opacity="0.9" />
        </svg>

        {/* Text with gradient */}
        <span
          style={{
            background: "linear-gradient(90deg, #E8443A, #F5A623)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Tropicam
        </span>
      </div>

      {showTagline && (
        <span className="text-xs text-text-secondary font-dm-sans tracking-wider mt-0.5">
          DROM-COM • Rencontre vidéo
        </span>
      )}
    </div>
  );
}
