/** @format */

import { createUserContent, GoogleGenAI } from "@google/genai";

export const GEMINI_API_KEY_STORAGE_KEY = "gemini-api-key";

const POLISH_PROMPT = `
  You will be given a transcript of a speech where user might not speak perfectly.
  Your need to polish and rephrase the transcript in a way that is easy to understand while strictly following the meaning of the original transcript.
  You must make sure no information is lost in the output.
  You must output in simplified chinese and he output should be in a clear and organized manner. Use bullet points and other formatting options if needed.
`;

/**
 * Generates a refined version of the given transcript using Gemini API
 * @param transcript - The transcript to refine
 * @param apiKey - Optional API key for Gemini, falls back to default if not provided
 * @returns The refined transcript
 */
export async function generateRefinement(transcript: string, apiKey?: string) {
  const usedApiKey =
    apiKey || localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) || "";

  if (!usedApiKey) {
    throw new Error(
      "Gemini API key is not set. Please configure it in the settings.",
    );
  }

  const ai = new GoogleGenAI({
    apiKey: usedApiKey,
  });

  const contentResponse = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: createUserContent([
      { text: POLISH_PROMPT },
      { text: transcript },
    ]),
  });

  return contentResponse.text || "";
}
