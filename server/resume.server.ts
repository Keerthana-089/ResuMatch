// Server-only resume text extraction. Uses unpdf (pure JS, Worker-safe) and mammoth.
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";

export async function extractResumeText(
  base64: string,
  mime: string,
  filename: string,
): Promise<string> {
  const buffer = Buffer.from(base64, "base64");
  const lower = filename.toLowerCase();

  if (mime === "application/pdf" || lower.endsWith(".pdf")) {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return Array.isArray(text) ? text.join("\n") : text;
  }

  if (
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lower.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  // txt / fallback
  return buffer.toString("utf8");
}
