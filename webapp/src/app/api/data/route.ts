import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// WMO Weather code to description mapping
const WMO_CODES: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Depositing rime fog",
  51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
  61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
  71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
  80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
  95: "Thunderstorm", 99: "Thunderstorm with hail",
};

export async function GET() {
  try {
    // 1. Fetch BTC from CoinGecko (free, no API key needed)
    const btcRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      { next: { revalidate: 60 } }
    );
    if (!btcRes.ok) throw new Error(`CoinGecko error: ${btcRes.status}`);
    const btcJson = await btcRes.json();
    const btcPrice: number = btcJson.bitcoin.usd;

    // 2. Fetch Weather (OpenMeteo — Paris, no API key needed)
    const weatherRes = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current_weather=true",
      { next: { revalidate: 60 } }
    );
    if (!weatherRes.ok) throw new Error(`OpenMeteo error: ${weatherRes.status}`);
    const weatherJson = await weatherRes.json();
    const temp: number = weatherJson.current_weather.temperature;
    const weatherCode: number = weatherJson.current_weather.weathercode;
    const weatherDesc = WMO_CODES[weatherCode] ?? "Unknown";

    // 3. LLM Insight via Vercel AI SDK (uses OPENAI_API_KEY from env)
    let insight = `${weatherDesc} in Paris today (${temp}°C). Bitcoin is trading at $${btcPrice.toLocaleString("en-US")}. Systems nominal.`;

    // The OPENAI_API_KEY env var is auto-picked by @ai-sdk/openai
    if (process.env.OPENAI_API_KEY) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o-mini"),
          system:
            "You are a sarcastic senior developer. Write exactly ONE punchy sentence (max 20 words) connecting today's Paris weather and the current Bitcoin price. Be dry and witty.",
          prompt: `Paris weather: ${weatherDesc}, ${temp}°C. Bitcoin: $${btcPrice.toLocaleString("en-US")}.`,
          maxOutputTokens: 60,
          temperature: 0.9,
        });
        if (text) insight = text.trim();
      } catch (llmError) {
        console.error("LLM generation failed:", llmError);
        // Fallback gracefully — already set above
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        btc: btcPrice,
        temp,
        weatherDesc,
        insight,
        location: "Paris, France",
      },
    });
  } catch (error: any) {
    console.error("API Orchestration error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
