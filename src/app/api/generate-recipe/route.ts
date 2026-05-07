import { NextRequest, NextResponse } from "next/server";
import { limiter } from "@/lib/rateLimit";
import { validateIngredientInput } from "@/lib/ingredientValidation";

const API_KEY = process.env.GEMINI_API_KEY;

interface RecipePreferences {
  dietary: string;
  cuisine: string;
  spiceLevel: string;
  servings: number;
}

interface GenerateRecipeRequestBody {
  ingredients?: string;
  prefs?: RecipePreferences;
}

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const xff = req.headers.get("x-forwarded-for");
    const ip = xff ? xff.split(",")[0].trim() : "127.0.0.1";
    try {
      await limiter.check(5, ip); // 5 recipes per minute
    } catch {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait a minute." }, { status: 429 });
    }

    const { ingredients, prefs }: GenerateRecipeRequestBody = await req.json();

    if (!ingredients || typeof ingredients !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid list of ingredients." },
        { status: 400 }
      );
    }

    const validationResult = validateIngredientInput(ingredients);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      console.error("GEMINI_API_KEY is not set.");
      return NextResponse.json(
        { error: "API Key is not configured." },
        { status: 500 }
      );
    }

    let prefsText = "";
    if (prefs) {
      prefsText = `\nDietary Restrictions: ${prefs.dietary !== "None" ? prefs.dietary : "None"}
Cuisine Type: ${prefs.cuisine !== "Any" ? prefs.cuisine : "Any"}
Spice Level: ${prefs.spiceLevel}
Serving Size: ${prefs.servings} people\n`;
    }

    const prompt = `You are a world-class culinary chef. A user has given you the following input for ingredients:
"${ingredients}"${prefsText}

If the ingredients are valid, please create a delicious, creative, and easy-to-follow recipe using mostly these ingredients (you can assume they have basic pantry staples like salt, pepper, olive oil, and water). If an ingredient is missing to make a cohesive dish, explicitly suggest common substitutes from their kitchen or note what needs to be bought.

The recipe MUST strictly respect the dietary restrictions, cuisine type, spice level, and serving size provided.

Format your response exactly as follows:
# [Creative Name of the Dish]

**Preparation Time:** [time]
**Cooking Time:** [time]
**Servings:** ${prefs?.servings || 2}

## Ingredients
- [List of ingredients with measurements calculated for the serving size]

## Instructions
1. [Step 1]
2. [Step 2]
(etc...)

Make the instructions clear and engaging!`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data: GeminiGenerateContentResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data.error?.message || "The recipe generator failed to create a recipe.",
        },
        { status: response.status }
      );
    }

    const text = data.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!text) {
      return NextResponse.json(
        { error: "The recipe generator returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ recipe: text });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the recipe." },
      { status: 500 }
    );
  }
}
