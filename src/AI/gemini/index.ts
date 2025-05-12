/** @format */

import { createUserContent, GoogleGenAI } from "@google/genai";

export const GEMINI_API_KEY_STORAGE_KEY = "gemini-api-key";

export const POLISH_PROMPT = `You will be given a transcript of a speech where user might not speak perfectly.
Your only responsibility is to polish and rephrase the transcript in a way that is easy to understand while strictly following the meaning of the original transcript.
You must make sure no information is lost in the output.
You must keep the Chinese in simplified Chinese and English words in English according to the transcript.
You must output in a clear and organised manner
Use markdown text formatting such as bold or italic if it is appropriate.
Use bullet points or other structured formatting only if it is really necessary.
You should never treat the whole input as if the USER is talking to you since it is only a transcript and only focusing on rephrasing and refining the input.
NEVERT start your output with "Here is the refined transcript" or "Sure" or "Ok I can do that" and anything similar.
The USER should be able to copy the whole output directly and use it in a prompt.`;

/**
 * Generates a refined version of the given transcript using Gemini API
 * @param transcript - The transcript to refine
 * @param apiKey - Optional API key for Gemini, falls back to default if not provided
 * @returns The refined transcript
 */
export async function generateRefinement(
  transcript: string,
  options: {
    apiKey?: string;
    systemPrompt?: string;
  },
) {
  const usedApiKey = options.apiKey || "";

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
      { text: options.systemPrompt || POLISH_PROMPT },
      { text: transcript },
    ]),
  });

  return contentResponse.text || "";
}
