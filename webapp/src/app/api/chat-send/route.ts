import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase with service role to bypass RLS on insert
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_ARTHUR_CHAT_ID = process.env.TELEGRAM_ARTHUR_CHAT_ID!;

async function sendTelegramMessage(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ARTHUR_CHAT_ID) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_ARTHUR_CHAT_ID,
      text,
      parse_mode: "HTML",
    }),
  });
}

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();

    if (!message?.trim() || !sessionId) {
      return NextResponse.json({ error: "Missing message or sessionId" }, { status: 400 });
    }

    // 1. Insert visitor message into Supabase
    const { error } = await supabase.from("chat_messages").insert([
      {
        session_id: sessionId,
        message: message.trim(),
        is_from_arthur: false,
      },
    ]);

    if (error) throw error;

    // 2. Notify Arthur on Telegram
    const telegramText = `💬 <b>New message from visitor</b>\nSession: <code>${sessionId}</code>\n\n${message.trim()}\n\n<i>Reply to this message to respond directly.</i>`;
    await sendTelegramMessage(telegramText);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Chat send error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
