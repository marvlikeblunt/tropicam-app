"use client";

import { useEffect, useRef } from "react";
import { Video } from "lucide-react";

interface RemoteVideoProps {
  stream: MediaStream | null;
}

export default function RemoteVideo({ stream }: RemoteVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full bg-bg-dark flex items-center justify-center">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-4 text-text-secondary">
          <div className="w-20 h-20 rounded-full bg-bg-elevated flex items-center justify-center">
            <Video size={36} className="text-text-secondary" />
          </div>
          <p className="text-sm font-dm-sans">En attente de connexion...</p>
        </div>
      )}
    </div>
  );
}
