import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_ARTHUR_CHAT_ID = process.env.TELEGRAM_ARTHUR_CHAT_ID!;

export async function POST(req: Request) {
  try {
    const { sessionId, mode } = await req.json();

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ARTHUR_CHAT_ID) {
      return NextResponse.json({ status: "no telegram config" });
    }

    const modeLabel: Record<string, string> = {
      hr: "👔 HR/Recruiter",
      lead_dev: "💻 Lead Developer",
      curieux: "✨ Curious Visitor",
    };

    const text = `👁 <b>New visitor on your portfolio!</b>\n\nMode: ${modeLabel[mode] ?? mode}\nSession: <code>${sessionId}</code>\n\n<i>They haven't messaged yet. You can initiate the conversation by writing here — they'll receive it in the chat widget.</i>`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_ARTHUR_CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    // Silent fail — visitor should never see this error
    console.error("Visit notify error:", err.message);
    return NextResponse.json({ success: false });
  }
}
