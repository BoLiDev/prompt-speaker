/** @format */

import removeMarkdown from "remove-markdown";

/**
 * 清除文本中的 Markdown 格式标记
 * 移除常见的 Markdown 格式化标记，使文本更适合粘贴到不支持 Markdown 的地方
 * 但保留列表标记（如 - 项目 或 1. 项目）
 *
 * @param text 包含 Markdown 格式的文本
 * @returns 清除了 Markdown 格式的纯文本，但保留列表标记
 */
export function cleanMarkdownFormatting(text: string): string {
  if (!text) return text;

  return removeMarkdown(text);
}
