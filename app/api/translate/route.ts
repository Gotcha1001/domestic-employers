import * as deepl from "deepl-node";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("Starting POST /api/translate");
    const { text, targetLanguage } = await request.json();
    console.log("Request body:", { text, targetLanguage });

    if (!text || !targetLanguage) {
      console.error("Missing text or targetLanguage in request");
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      );
    }

    if (!process.env.DEEPL_API_KEY) {
      console.error("Missing DEEPL_API_KEY in environment variables");
      return NextResponse.json(
        { error: "DeepL API key is missing" },
        { status: 500 }
      );
    }

    console.log("Initializing DeepL Translator");
    const translator = new deepl.Translator(process.env.DEEPL_API_KEY!);
    console.log("Translating text:", text, "to", targetLanguage);
    const result = await translator.translateText(text, null, targetLanguage);
    console.log("Translation result:", result);

    const translatedText = Array.isArray(result)
      ? result.map((item) => item.text).join(" ")
      : result.text;

    return NextResponse.json({ translatedText });
  } catch (error: unknown) {
    console.error("Detailed error in POST /api/translate:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    if (errorMessage.includes("Quota exceeded")) {
      return NextResponse.json(
        { error: "DeepL API quota exceeded" },
        { status: 429 }
      );
    } else if (errorMessage.includes("Authorization failed")) {
      return NextResponse.json(
        { error: "Invalid DeepL API key" },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log("Starting GET /api/translate");
    if (!process.env.DEEPL_API_KEY) {
      console.error("Missing DEEPL_API_KEY in environment variables");
      return NextResponse.json(
        { error: "DeepL API key is missing" },
        { status: 500 }
      );
    }

    console.log("Initializing DeepL Translator");
    const translator = new deepl.Translator(process.env.DEEPL_API_KEY!);
    console.log("Fetching target languages from DeepL");
    const targetLanguages = await translator.getTargetLanguages();
    console.log("Received target languages:", targetLanguages);

    const supportedLanguages = targetLanguages.map((lang) => ({
      code: lang.code,
      name: lang.name,
    }));

    return NextResponse.json(supportedLanguages);
  } catch (error: unknown) {
    console.error("Detailed error in GET /api/translate:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    if (errorMessage.includes("Quota exceeded")) {
      return NextResponse.json(
        { error: "DeepL API quota exceeded" },
        { status: 429 }
      );
    } else if (errorMessage.includes("Authorization failed")) {
      return NextResponse.json(
        { error: "Invalid DeepL API key" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch supported languages" },
      { status: 500 }
    );
  }
}
