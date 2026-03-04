interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = {
  sm: { svg: 32, text: "text-xl" },
  md: { svg: 42, text: "text-2xl" },
  lg: { svg: 52, text: "text-3xl md:text-4xl" },
};

export default function Logo({ size = "lg", className = "" }: LogoProps) {
  const { svg: svgSize, text: textSize } = SIZE[size];
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Camera SVG with tropical palette */}
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logoGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(24,85%,60%)" />
            <stop offset="100%" stopColor="hsl(15,80%,70%)" />
          </linearGradient>
          <linearGradient id="logoGradAction" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(152,69%,43%)" />
            <stop offset="100%" stopColor="hsl(140,50%,45%)" />
          </linearGradient>
        </defs>
        {/* Camera body */}
        <rect x="4" y="14" width="36" height="26" rx="5" fill="url(#logoGradMain)" />
        {/* Lens outer */}
        <circle cx="22" cy="27" r="9" fill="white" fillOpacity="0.25" />
        {/* Lens inner */}
        <circle cx="22" cy="27" r="6" fill="url(#logoGradAction)" />
        <circle cx="22" cy="27" r="3" fill="white" fillOpacity="0.4" />
        {/* Viewfinder */}
        <path d="M40 20L48 16V38L40 34" fill="url(#logoGradMain)" />
        {/* Flash / notch */}
        <rect x="17" y="10" width="10" height="5" rx="2" fill="url(#logoGradMain)" />
        {/* Tropical leaf dot */}
        <circle cx="10" cy="18" r="2.5" fill="hsl(140,50%,45%)" />
      </svg>

      {/* Brand name */}
      <span
        className={`font-nunito font-extrabold tracking-tight ${textSize}`}
        style={{
          background: "linear-gradient(90deg, hsl(24,85%,60%), hsl(15,80%,70%), hsl(140,50%,45%))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Tropicam
      </span>
    </div>
  );
}
