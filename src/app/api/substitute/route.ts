import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { limiter } from "@/lib/rateLimit";

const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const xff = req.headers.get("x-forwarded-for");
    const ip = xff ? xff.split(",")[0].trim() : "127.0.0.1";
    try {
      await limiter.check(10, ip); // 10 substitutes per minute
    } catch {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait a minute." }, { status: 429 });
    }

    const { ingredient } = await req.json();

    if (!ingredient || typeof ingredient !== "string") {
      return NextResponse.json({ error: "Please provide a valid ingredient." }, { status: 400 });
    }

    if (!API_KEY) {
      return NextResponse.json({ error: "API Key is not configured." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `What is a common culinary substitute for "${ingredient}"? Provide a brief, concise answer (under 50 words) suitable for a quick reference tool. Give the best 1-2 options and the ratio.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ substitute: response.text });
  } catch (error) {
    console.error("Error in substitute API:", error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
