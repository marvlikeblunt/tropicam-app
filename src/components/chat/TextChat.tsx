"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, MessageSquare } from "lucide-react";
import { type ChatMessage } from "@/types";

interface TextChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isConnected: boolean;
}

// Simple HTML escaping to prevent XSS (React handles it in JSX, but explicit for clarity)
function escapeText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TextChat({
  messages,
  onSendMessage,
  isConnected,
}: TextChatProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !isConnected) return;
    onSendMessage(text);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-card border-l border-white/5">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3.5 border-b border-white/5">
        <MessageSquare size={16} className="text-text-secondary" />
        <span className="text-sm font-semibold text-text-primary font-outfit">
          Messages
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary py-8">
            <MessageSquare size={32} className="mb-3 opacity-30" />
            <p className="text-sm font-dm-sans">
              {isConnected
                ? "Dis bonjour !"
                : "Les messages s'affichent ici une fois connecté"}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm font-dm-sans break-words ${
                  msg.isMine
                    ? "bg-gradient-to-br from-primary to-accent text-white rounded-br-sm"
                    : "bg-bg-elevated text-text-primary border border-white/5 rounded-bl-sm"
                }`}
              >
                {/* Text rendered safely without dangerouslySetInnerHTML */}
                <span>{escapeText(msg.text)}</span>
                <span
                  className={`block text-[10px] mt-1 ${
                    msg.isMine ? "text-white/60 text-right" : "text-text-secondary"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 bg-bg-elevated rounded-2xl border border-white/10 pr-2 pl-4 py-2 focus-within:border-primary/40 transition-colors duration-200">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? "Écris un message..." : "Connecte-toi d'abord"}
            disabled={!isConnected}
            maxLength={500}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none font-dm-sans disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!isConnected || !input.trim()}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
            style={{
              background:
                isConnected && input.trim()
                  ? "linear-gradient(135deg, #E8443A, #F5A623)"
                  : "transparent",
            }}
          >
            <Send
              size={15}
              className={isConnected && input.trim() ? "text-white" : "text-text-secondary"}
            />
          </button>
        </div>
        {input.length > 400 && (
          <p className="text-xs text-text-secondary mt-1 text-right">
            {input.length}/500
          </p>
        )}
      </div>
    </div>
  );
}
