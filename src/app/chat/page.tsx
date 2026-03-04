import type { Metadata } from "next";
import VideoChat from "@/components/chat/VideoChat";

export const metadata: Metadata = {
  title: "Chat vidéo — Tropicam",
  description: "Rencontre en vidéo avec des personnes des DROM-COM.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChatPage() {
  return <VideoChat />;
}
