/** @format */

import { logError } from "./errorUtils";

export function copyToClipboard(text: string): void {
  if (!text) return;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Copied to clipboard");
    })
    .catch((err) => {
      logError("Copy to clipboard failed", err);
    });
}
