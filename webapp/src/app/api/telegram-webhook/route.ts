import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service Role Key to bypass RLS and insert Arthur's messages
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message || !message.text) {
      return NextResponse.json({ status: "ignored — no text message" });
    }

    // We need to extract the session_id from Arthur's reply.
    // The notification sent to Arthur contains: "Session: <code>session_xxx</code>"
    // When Arthur replies to that Telegram message, the original text is in message.reply_to_message.text
    let sessionId: string | null = null;

    if (message.reply_to_message?.text) {
      // Parse session ID from the original forwarded message
      const match = message.reply_to_message.text.match(/Session:\s*([a-zA-Z0-9_]+)/);
      if (match?.[1]) {
        sessionId = match[1];
      }
    }

    if (!sessionId) {
      console.warn("Webhook: Could not extract session_id from reply. Message ignored.");
      console.log("Raw message text:", message.text);
      console.log("Reply to text:", message.reply_to_message?.text ?? "(none)");
      return NextResponse.json({ status: "ignored — missing session_id" });
    }

    const { error } = await supabase.from("chat_messages").insert([
      {
        session_id: sessionId,
        message: message.text,
        is_from_arthur: true,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, sessionId });
  } catch (err: any) {
    console.error("Webhook handler error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
