// ─── Chat state machine ───────────────────────────────────────────────────────

export type ChatState =
  | "idle"
  | "searching"
  | "connected"
  | "partner-left"
  | "error";

// ─── Chat messages ────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: Date;
}

// ─── Socket.IO event payloads ─────────────────────────────────────────────────

export interface MatchedPayload {
  roomId: string;
  initiator: boolean;
}

export interface SignalPayload {
  signal: RTCSessionDescriptionInit;
}

export interface IceCandidatePayload {
  candidate: RTCIceCandidateInit;
}

export interface ChatMessagePayload {
  message: string;
}

export interface QueueCountPayload {
  count: number;
}

export interface ErrorPayload {
  message: string;
}
