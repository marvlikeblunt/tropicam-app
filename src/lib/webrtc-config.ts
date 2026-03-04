export const iceServers: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  // TURN server — configured via environment variables for production
  ...(process.env.NEXT_PUBLIC_TURN_URL
    ? [
        {
          urls: process.env.NEXT_PUBLIC_TURN_URL,
          username: process.env.NEXT_PUBLIC_TURN_USERNAME ?? "",
          credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL ?? "",
        },
      ]
    : []),
];

export const rtcConfig: RTCConfiguration = {
  iceServers,
  iceCandidatePoolSize: 10,
};
