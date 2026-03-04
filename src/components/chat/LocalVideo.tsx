"use client";

import { useEffect, useRef } from "react";
import { VideoOff } from "lucide-react";

interface LocalVideoProps {
  stream: MediaStream | null;
  isCameraOff: boolean;
}

export default function LocalVideo({ stream, isCameraOff }: LocalVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="absolute bottom-20 right-3 md:bottom-20 md:right-4 w-28 h-20 md:w-44 md:h-28 rounded-2xl overflow-hidden border-2 border-white/20 shadow-card z-10 bg-bg-card">
      {isCameraOff || !stream ? (
        <div className="w-full h-full flex items-center justify-center bg-bg-elevated">
          <VideoOff className="text-text-secondary" size={20} />
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
      )}
    </div>
  );
}
