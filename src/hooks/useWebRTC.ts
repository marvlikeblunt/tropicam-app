"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { type Socket } from "socket.io-client";
import { rtcConfig } from "@/lib/webrtc-config";
import { type SignalPayload, type IceCandidatePayload } from "@/types";

interface UseWebRTCReturn {
  remoteStream: MediaStream | null;
  startConnection: (roomId: string, isInitiator: boolean) => Promise<void>;
  cleanup: () => void;
}

export function useWebRTC(
  localStream: MediaStream | null,
  socket: Socket | null
): UseWebRTCReturn {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const currentRoomIdRef = useRef<string | null>(null);
  const socketRef = useRef(socket);
  const localStreamRef = useRef(localStream);

  // Buffer ICE candidates that arrive before setRemoteDescription is called
  const iceCandidateBuffer = useRef<RTCIceCandidateInit[]>([]);
  const remoteDescSet = useRef(false);

  useEffect(() => { socketRef.current = socket; }, [socket]);
  useEffect(() => { localStreamRef.current = localStream; }, [localStream]);

  const cleanup = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.oniceconnectionstatechange = null;
      pcRef.current.close();
      pcRef.current = null;
    }
    currentRoomIdRef.current = null;
    iceCandidateBuffer.current = [];
    remoteDescSet.current = false;
    setRemoteStream(null);
  }, []);

  const startConnection = useCallback(
    async (roomId: string, isInitiator: boolean): Promise<void> => {
      const socket = socketRef.current;
      const localStream = localStreamRef.current;
      if (!socket || !localStream) return;

      // Tear down any previous connection
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      iceCandidateBuffer.current = [];
      remoteDescSet.current = false;
      setRemoteStream(null);

      currentRoomIdRef.current = roomId;

      const pc = new RTCPeerConnection(rtcConfig);
      pcRef.current = pc;

      // Add local tracks
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      // Expose remote stream when tracks arrive
      pc.ontrack = (event: RTCTrackEvent) => {
        const [stream] = event.streams;
        if (stream) setRemoteStream(stream);
      };

      // Relay our ICE candidates to the partner
      pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate && socketRef.current && currentRoomIdRef.current) {
          socketRef.current.emit("ice-candidate", {
            roomId: currentRoomIdRef.current,
            candidate: event.candidate.toJSON(),
          });
        }
      };

      // Restart ICE on failure
      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === "failed") pc.restartIce();
      };

      // Initiator creates the offer
      if (isInitiator) {
        try {
          const offer = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          await pc.setLocalDescription(offer);
          socket.emit("signal", {
            roomId,
            signal: { type: offer.type, sdp: offer.sdp },
          });
        } catch (err) {
          console.error("[WebRTC] Error creating offer:", err);
        }
      }
    },
    []
  );

  // Handle incoming SDP signals and ICE candidates
  useEffect(() => {
    if (!socket) return;

    const handleSignal = async (data: SignalPayload) => {
      const pc = pcRef.current;
      const roomId = currentRoomIdRef.current;
      if (!pc || !roomId) return;

      try {
        if (data.signal.type === "offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(data.signal));
          remoteDescSet.current = true;

          // Drain any buffered ICE candidates now that remote desc is set
          for (const candidate of iceCandidateBuffer.current) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
          iceCandidateBuffer.current = [];

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          if (socketRef.current) {
            socketRef.current.emit("signal", {
              roomId,
              signal: { type: answer.type, sdp: answer.sdp },
            });
          }
        } else if (data.signal.type === "answer") {
          await pc.setRemoteDescription(new RTCSessionDescription(data.signal));
          remoteDescSet.current = true;

          // Drain buffered ICE candidates
          for (const candidate of iceCandidateBuffer.current) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
          iceCandidateBuffer.current = [];
        }
      } catch (err) {
        console.error("[WebRTC] Error handling signal:", err);
      }
    };

    const handleIceCandidate = async (data: IceCandidatePayload) => {
      const pc = pcRef.current;
      if (!pc) return;

      if (!remoteDescSet.current) {
        // Remote description not yet set — buffer the candidate
        iceCandidateBuffer.current.push(data.candidate);
        return;
      }

      try {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (err) {
        console.debug("[WebRTC] ICE candidate error (usually benign):", err);
      }
    };

    socket.on("signal", handleSignal);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("signal", handleSignal);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, [socket]);

  useEffect(() => () => { cleanup(); }, [cleanup]);

  return { remoteStream, startConnection, cleanup };
}
