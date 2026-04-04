"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioMode } from "@/store/useThemeStore";
import { supabase } from "@/utils/supabaseClient";

// ─── Session ID ───────────────────────────────────────────────────────────────
function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  const key = "portfolio_chat_session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

type Message = {
  id?: string;
  session_id: string;
  message: string;
  is_from_arthur: boolean;
  created_at?: string;
};

// ─── Theme helpers ─────────────────────────────────────────────────────────────
const THEME = {
  lead_dev: {
    fab: "bg-emerald-900 text-emerald-300 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]",
    wrap: "bg-black border-emerald-700 text-emerald-400 font-mono",
    header: "border-emerald-800 bg-emerald-950/40",
    footer: "border-emerald-800 bg-black",
    input: "bg-transparent border border-emerald-900 focus:border-emerald-500 placeholder-emerald-900 text-emerald-400",
    send: "bg-emerald-700 hover:bg-emerald-600 text-white",
    bubbleSelf: "bg-black border border-emerald-500 text-emerald-300",
    bubbleOther: "bg-emerald-900/40 border border-emerald-800 text-emerald-200",
    placeholder: "> send_message --to arthur",
    title: "arthur@portfolio:~$ chat",
    notice: "text-emerald-600",
  },
  curieux: {
    fab: "bg-gradient-to-br from-fuchsia-500 to-orange-500 text-white border-white/20 shadow-2xl",
    wrap: "bg-white border-fuchsia-300 text-slate-800",
    header: "border-fuchsia-100 bg-fuchsia-50",
    footer: "border-fuchsia-100 bg-white",
    input: "bg-slate-50 border border-fuchsia-200 focus:border-fuchsia-400 placeholder-slate-400 text-slate-800",
    send: "bg-gradient-to-r from-fuchsia-500 to-orange-500 text-white",
    bubbleSelf: "bg-gradient-to-r from-fuchsia-500 to-orange-500 text-white",
    bubbleOther: "bg-slate-100 text-slate-800",
    placeholder: "Votre message...",
    title: "Discutons ! ✨",
    notice: "text-slate-400",
  },
  hr: {
    fab: "bg-blue-600 text-white border-white/20 shadow-lg hover:bg-blue-700",
    wrap: "bg-white border-slate-200 text-slate-800",
    header: "border-slate-100 bg-slate-50",
    footer: "border-slate-100 bg-white",
    input: "bg-slate-100 border-transparent focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400 text-slate-800",
    send: "bg-blue-600 hover:bg-blue-700 text-white",
    bubbleSelf: "bg-blue-600 text-white",
    bubbleOther: "bg-slate-100 text-slate-800",
    placeholder: "Votre message...",
    title: "Parlez à Arthur 💬",
    notice: "text-slate-400",
  },
};

// ─── Intro messages per mode ───────────────────────────────────────────────────
const INTRO: Record<PortfolioMode, { lines: string[] }> = {
  lead_dev: {
    lines: [
      "// Secure channel established.",
      "// This widget connects you directly to Arthur.",
      "// Write a message — he'll receive it on Telegram and reply here in real time.",
    ],
  },
  curieux: {
    lines: [
      "Salut ! 👋 Je suis Arthur.",
      "Ce chat est un lien direct avec moi. Envoyez-moi un message ici, je le reçois sur mon téléphone et je vous réponds en direct !",
    ],
  },
  hr: {
    lines: [
      "Bonjour ! Je suis Arthur Soghoyan.",
      "Ce chat vous connecte directement à moi. Dès que vous m'envoyez un message, je reçois une notification et vous réponds en temps réel.",
      "N'hésitez pas à me poser vos questions.",
    ],
  },
};

// ─── Component ─────────────────────────────────────────────────────────────────
export default function Chatbot({ mode }: { mode: PortfolioMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sessionId] = useState<string>(() => getSessionId());

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasSubscribed = useRef(false);
  const hasNotified = useRef(false);

  const t = THEME[mode] ?? THEME.hr;
  const intro = INTRO[mode] ?? INTRO.hr;

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // ── Silent visitor notification to Arthur ───────────────────────────────────
  // Fires once when the component mounts (i.e. visitor lands on the portfolio)
  useEffect(() => {
    if (hasNotified.current) return;
    hasNotified.current = true;

    fetch("/api/notify-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, mode }),
    }).catch(() => {
      // Silent fail — never show errors to visitor
    });
  }, [sessionId, mode]);

  // ── Load history + subscribe to Realtime ────────────────────────────────────
  useEffect(() => {
    if (!isOpen || hasSubscribed.current) return;
    hasSubscribed.current = true;

    // Load existing messages for this session
    supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data?.length) setMessages(data as Message[]);
      });

    // Subscribe to new inserts (for both visitor and Arthur's replies)
    const channel = supabase
      .channel(`chat_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Deduplicate by ID (avoids any double-render edge cases)
            const newMsg = payload.new as Message;
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, sessionId]);

  // ── Send handler (NO optimistic update — Realtime handles display) ──────────
  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isSending) return;
    const text = inputValue.trim();
    setInputValue(""); // Clear input immediately for UX
    setIsSending(true);

    try {
      await fetch("/api/chat-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId }),
      });
      // The Realtime subscription will add the message to state automatically
    } catch (err) {
      console.error("Chat send failed:", err);
      // Could show a toast here in the future
    } finally {
      setIsSending(false);
    }
  }, [inputValue, isSending, sessionId]);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        {/* ── FAB Button ── */}
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center backdrop-blur-lg border-2 ${t.fab}`}
          >
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">
                {messages.filter(m => m.is_from_arthur).length}
              </span>
            )}
            <MessageSquare size={28} />
          </motion.button>
        )}

        {/* ── Chat Window ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className={`absolute bottom-0 right-0 w-80 md:w-96 rounded-2xl shadow-2xl border-2 overflow-hidden flex flex-col ${t.wrap}`}
              style={{ maxHeight: "540px" }}
            >
              {/* Header */}
              <div className={`p-4 flex justify-between items-center border-b flex-shrink-0 ${t.header}`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {t.title}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 p-4 overflow-y-auto flex flex-col gap-3"
                style={{ minHeight: "240px", maxHeight: "340px" }}
              >
                {/* ── Intro / Explanation messages (static, always shown) ── */}
                <div className="flex flex-col gap-2 mb-2">
                  {intro.lines.map((line, i) => (
                    <div
                      key={i}
                      className={`self-start text-xs leading-relaxed opacity-70 ${t.notice} ${mode === "lead_dev" ? "font-mono" : ""}`}
                    >
                      {line}
                    </div>
                  ))}
                </div>

                {/* ── Real conversation ── */}
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id ?? idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm leading-relaxed ${
                      msg.is_from_arthur
                        ? `self-start rounded-tl-sm ${t.bubbleOther}`
                        : `self-end rounded-tr-sm ${t.bubbleSelf}`
                    }`}
                  >
                    {msg.message}
                  </motion.div>
                ))}

                {/* Sending indicator */}
                {isSending && (
                  <div className={`self-end flex items-center gap-1.5 text-xs opacity-50 ${t.notice}`}>
                    <Loader2 size={12} className="animate-spin" />
                    Envoi...
                  </div>
                )}
              </div>

              {/* Input */}
              <div className={`p-3 border-t flex gap-2 items-center flex-shrink-0 ${t.footer}`}>
                <input
                  type="text"
                  placeholder={t.placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  disabled={isSending}
                  className={`flex-1 px-4 py-2 rounded-full outline-none text-sm transition-all ${t.input}`}
                />
                <button
                  onClick={handleSend}
                  disabled={isSending || !inputValue.trim()}
                  className={`p-2.5 rounded-full flex items-center justify-center transition-all disabled:opacity-40 ${t.send}`}
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
