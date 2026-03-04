"use client";

export default function WaveBackground() {
  return (
    <div
      className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 160"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full block"
        preserveAspectRatio="none"
      >
        {/* Wave 1 — slowest */}
        <path
          d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,160 L0,160 Z"
          fill="rgba(232, 68, 58, 0.06)"
          style={{ animation: "waveMove 12s ease-in-out infinite" }}
        />
        {/* Wave 2 — medium */}
        <path
          d="M0,100 C360,50 720,150 1080,100 C1260,75 1380,110 1440,100 L1440,160 L0,160 Z"
          fill="rgba(29, 180, 141, 0.05)"
          style={{ animation: "waveMove 8s ease-in-out infinite reverse" }}
        />
        {/* Wave 3 — fastest */}
        <path
          d="M0,120 C180,90 360,150 540,120 C720,90 900,150 1080,120 C1260,90 1380,140 1440,120 L1440,160 L0,160 Z"
          fill="rgba(245, 166, 35, 0.04)"
          style={{ animation: "waveMove 5s ease-in-out infinite" }}
        />
      </svg>

      {/* waveMove keyframe is defined in globals.css */}
    </div>
  );
}
