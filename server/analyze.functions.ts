import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { extractResumeText } from "./resume.server";
import { JOB_ROLES, getRole } from "@/lib/jobRoles";

const AnalyzeInput = z.object({
  fileBase64: z.string().min(1).max(15_000_000),
  fileName: z.string().min(1).max(255),
  mime: z.string().max(120),
  roleId: z.string().min(1).max(64),
});

export type AnalyzeResult = {
  score: number;
  breakdown: {
    keywordMatch: number;
    structure: number;
    formatting: number;
    readability: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  extractedKeywords: string[];
  summary: {
    headline: string;
    skills: string[];
    experience: string[];
    achievements: string[];
  };
  suggestions: { title: string; detail: string; impact: "high" | "medium" | "low" }[];
  roleTitle: string;
  wordCount: number;
};

const SCHEMA = {
  type: "object",
  properties: {
    extractedKeywords: { type: "array", items: { type: "string" }, maxItems: 40 },
    summary: {
      type: "object",
      properties: {
        headline: { type: "string" },
        skills: { type: "array", items: { type: "string" }, maxItems: 12 },
        experience: { type: "array", items: { type: "string" }, maxItems: 6 },
        achievements: { type: "array", items: { type: "string" }, maxItems: 6 },
      },
      required: ["headline", "skills", "experience", "achievements"],
      additionalProperties: false,
    },
    suggestions: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          impact: { type: "string", enum: ["high", "medium", "low"] },
        },
        required: ["title", "detail", "impact"],
        additionalProperties: false,
      },
    },
    structureScore: { type: "number", minimum: 0, maximum: 100 },
    readabilityScore: { type: "number", minimum: 0, maximum: 100 },
  },
  required: [
    "extractedKeywords",
    "summary",
    "suggestions",
    "structureScore",
    "readabilityScore",
  ],
  additionalProperties: false,
} as const;

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function formattingScore(text: string): number {
  let score = 100;
  const lines = text.split(/\r?\n/);
  const longLines = lines.filter((l) => l.length > 180).length;
  if (longLines > 5) score -= 15;
  // Bullet usage
  const bullets = (text.match(/^[\s]*[•\-\*]/gm) || []).length;
  if (bullets < 5) score -= 20;
  // Tables / weird chars
  if (/[\|]{3,}/.test(text)) score -= 10;
  // Length sanity
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 200) score -= 25;
  if (words > 1500) score -= 10;
  return clamp(score);
}

function keywordOverlap(text: string, keywords: string[]) {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];
  for (const kw of keywords) {
    const re = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(lower)) matched.push(kw);
    else missing.push(kw);
  }
  return { matched, missing };
}

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalyzeInput.parse(input))
  .handler(async ({ data }): Promise<AnalyzeResult> => {
    const role = getRole(data.roleId) ?? JOB_ROLES[0];
    const text = await extractResumeText(data.fileBase64, data.mime, data.fileName);
    if (!text || text.trim().length < 40) {
      throw new Error("Could not extract enough text from this resume. Try a different file.");
    }

    const truncated = text.slice(0, 16000);
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    const { matched, missing } = keywordOverlap(text, role.keywords);
    const keywordMatch = clamp((matched.length / role.keywords.length) * 100);
    const formatting = formattingScore(text);

    // Call Lovable AI Gateway
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("Lovable AI is not configured. Please contact support.");
    }

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an expert ATS resume reviewer. Analyze resumes precisely and return ONLY structured data via the provided tool.",
          },
          {
            role: "user",
            content: `Target role: ${role.title}\nRole keywords: ${role.keywords.join(", ")}\n\nResume:\n${truncated}\n\nTasks:\n1. Extract up to 40 important keywords/skills/tools present in this resume.\n2. Write a concise headline (1 sentence) plus skills, experience bullets (most recent first), and key achievements.\n3. Score structure (0-100) — sections present (Summary, Experience, Education, Skills), clear headings.\n4. Score readability (0-100) — concise bullets, action verbs, quantified results.\n5. Provide 4-6 actionable suggestions to improve ATS score for the target role.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_analysis",
              description: "Return structured resume analysis",
              parameters: SCHEMA,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_analysis" } },
      }),
    });

    if (!aiRes.ok) {
      const body = await aiRes.text();
      if (aiRes.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      if (aiRes.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
      throw new Error(`AI analysis failed (${aiRes.status}): ${body.slice(0, 200)}`);
    }

    const json = await aiRes.json();
    const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("AI returned an unexpected response shape.");
    }
    const parsed = JSON.parse(toolCall.function.arguments) as {
      extractedKeywords: string[];
      summary: AnalyzeResult["summary"];
      suggestions: AnalyzeResult["suggestions"];
      structureScore: number;
      readabilityScore: number;
    };

    const structure = clamp(parsed.structureScore);
    const readability = clamp(parsed.readabilityScore);
    const score = clamp(
      keywordMatch * 0.4 + structure * 0.25 + formatting * 0.15 + readability * 0.2,
    );

    return {
      score,
      breakdown: { keywordMatch, structure, formatting, readability },
      matchedKeywords: matched,
      missingKeywords: missing,
      extractedKeywords: parsed.extractedKeywords,
      summary: parsed.summary,
      suggestions: parsed.suggestions,
      roleTitle: role.title,
      wordCount,
    };
  });
