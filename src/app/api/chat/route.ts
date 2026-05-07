import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { limiter } from "@/lib/rateLimit";

const API_KEY = process.env.GEMINI_API_KEY;

interface ChatHistoryItem {
  role: "user" | "model";
  text: string;
}

interface ChatRequestBody {
  history?: ChatHistoryItem[];
  message?: string;
  context?: string;
}

export async function POST(req: NextRequest) {
  try {
    const xff = req.headers.get("x-forwarded-for");
    const ip = xff ? xff.split(",")[0].trim() : "127.0.0.1";
    try {
      await limiter.check(15, ip); // 15 chats per minute
    } catch {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait a minute." }, { status: 429 });
    }

    const { history, message, context }: ChatRequestBody = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Please provide a valid message." }, { status: 400 });
    }

    if (!API_KEY) {
      return NextResponse.json({ error: "API Key is not configured." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // Format the history for the prompt
    let chatLog = "";
    if (history && history.length > 0) {
      chatLog = history
        .map((entry) => `${entry.role === "user" ? "User" : "Chef"}: ${entry.text}`)
        .join("\n");
    }

    const prompt = `You are a helpful culinary AI chef. The user has just generated the following recipe:
<recipe>
${context ?? ""}
</recipe>

Here is the conversation history so far:
${chatLog}

User: ${message}
Chef:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "An error occurred while chatting." }, { status: 500 });
  }
}
