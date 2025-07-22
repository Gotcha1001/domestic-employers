import * as deepl from "deepl-node";

if (!process.env.DEEPL_API_KEY) {
  console.error("Missing DEEPL_API_KEY in environment variables");
  throw new Error("Missing DeepL API key in environment variables");
}

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  if (!text || !targetLanguage) {
    console.error("Missing text or target language:", { text, targetLanguage });
    throw new Error("Text or target language is missing");
  }

  try {
    console.log("Translating text:", text, "to", targetLanguage);
    const result = await translator.translateText(
      text,
      null,
      targetLanguage as deepl.TargetLanguageCode
    );
    console.log("Translation result:", result.text);
    return result.text;
  } catch (error: unknown) {
    console.error("Detailed DeepL translation error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    ) {
      const message = (error as { message: string }).message;
      if (message.includes("Quota exceeded")) {
        throw new Error("Translation quota exceeded");
      } else if (message.includes("Invalid target language")) {
        throw new Error("Invalid target language");
      }
    }
    throw new Error("Failed to translate text");
  }
}
