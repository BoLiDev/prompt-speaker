/** @format */

import { logError } from "./errorUtils";
import { cleanMarkdownFormatting } from "./markdownUtils";
export function copyToClipboard(text: string): void {
  const cleanedText = cleanMarkdownFormatting(text);

  if (!cleanedText) return;

  navigator.clipboard
    .writeText(cleanedText)
    .then(() => {
      // alert("Copied to clipboard");
    })
    .catch((err) => {
      logError("Copy to clipboard failed", err);
    });
}
