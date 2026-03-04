"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface MediaStreamState {
  stream: MediaStream | null;
  isLoading: boolean;
  error: string | null;
  isMuted: boolean;
  isCameraOff: boolean;
  toggleMute: () => void;
  toggleCamera: () => void;
  requestPermissions: () => Promise<void>;
}

export function useMediaStream(): MediaStreamState {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // Keep a ref so cleanup always has the latest stream
  const streamRef = useRef<MediaStream | null>(null);

  const requestPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Stop any previous stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsMuted(false);
      setIsCameraOff(false);
    } catch (err) {
      if (err instanceof Error) {
        switch (err.name) {
          case "NotAllowedError":
          case "PermissionDeniedError":
            setError(
              "Accès à la caméra refusé. Autorise l'accès dans les paramètres de ton navigateur."
            );
            break;
          case "NotFoundError":
          case "DevicesNotFoundError":
            setError("Aucune caméra ou microphone trouvé sur cet appareil.");
            break;
          case "NotReadableError":
          case "TrackStartError":
            setError(
              "Ta caméra est déjà utilisée par une autre application. Ferme-la et réessaie."
            );
            break;
          default:
            setError(`Impossible d'accéder à la caméra : ${err.message}`);
        }
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Request permissions on mount
  useEffect(() => {
    requestPermissions();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [requestPermissions]);

  const toggleMute = useCallback(() => {
    const s = streamRef.current;
    if (!s) return;
    s.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted((prev) => !prev);
  }, []);

  const toggleCamera = useCallback(() => {
    const s = streamRef.current;
    if (!s) return;
    s.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsCameraOff((prev) => !prev);
  }, []);

  return {
    stream,
    isLoading,
    error,
    isMuted,
    isCameraOff,
    toggleMute,
    toggleCamera,
    requestPermissions,
  };
}
