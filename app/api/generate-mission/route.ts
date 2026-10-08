import { GoogleGenAI } from "@google/genai";

import { OutdoorMission } from "@/types/mission";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MAX_ATTEMPTS = 2;

type AIContent = {
  title: string;
  tagline: string;
  summary: string;
  step1: string;
  step2: string;
  step3: string;
  natureChallenge: string;
  phoneFreeTip: string;
  whyThisMission: string;
};

const contentSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
    },
    tagline: {
      type: "string",
    },
    summary: {
      type: "string",
    },
    step1: {
      type: "string",
    },
    step2: {
      type: "string",
    },
    step3: {
      type: "string",
    },
    natureChallenge: {
      type: "string",
    },
    phoneFreeTip: {
      type: "string",
    },
    whyThisMission: {
      type: "string",
    },
  },
  required: [
    "title",
    "tagline",
    "summary",
    "step1",
    "step2",
    "step3",
    "natureChallenge",
    "phoneFreeTip",
    "whyThisMission",
  ],
};

function getStepDurations(duration: string) {
  const normalized = duration.toLowerCase().trim();

  if (normalized.includes("10 hours")) {
    return ["3 hours", "3 hours", "4 hours"];
  }

  if (normalized.includes("5 hours")) {
    return ["1 hour 30 minutes", "1 hour 30 minutes", "2 hours"];
  }

  if (normalized.includes("3 hours")) {
    return ["1 hour", "1 hour", "1 hour"];
  }

  if (normalized.includes("1 hour")) {
    return ["20 minutes", "20 minutes", "20 minutes"];
  }

  return ["20 minutes", "20 minutes", "20 minutes"];
}

function getDifficulty(duration: string): OutdoorMission["difficulty"] {
  const normalized = duration.toLowerCase().trim();

  if (
    normalized.includes("10 hours") ||
    normalized.includes("5 hours") ||
    normalized.includes("3 hours")
  ) {
    return "Moderate";
  }

  return "Easy";
}

function getPreparation(activity: string): string[] {
  const normalized = activity.toLowerCase();

  if (normalized.includes("cycling")) {
    return [
      "Check your bike and wear a helmet.",
      "Carry water and a small snack.",
    ];
  }

  if (normalized.includes("hiking")) {
    return [
      "Wear comfortable shoes with good grip.",
      "Carry water and check the weather.",
    ];
  }

  if (normalized.includes("photography")) {
    return [
      "Charge your camera or phone before leaving.",
      "Wear comfortable shoes for walking.",
    ];
  }

  if (normalized.includes("nature")) {
    return [
      "Wear comfortable shoes for outdoor walking.",
      "Carry water and check the weather.",
    ];
  }

  return [
    "Wear comfortable shoes for walking.",
    "Carry water and check the weather.",
  ];
}

function getSafetyTips(activity: string): string[] {
  const normalized = activity.toLowerCase();

  if (normalized.includes("cycling")) {
    return [
      "Wear a helmet and follow traffic rules.",
      "Stay aware of vehicles and other people.",
    ];
  }

  if (normalized.includes("hiking")) {
    return [
      "Stay on safe paths and watch your footing.",
      "Turn back if weather conditions become unsafe.",
    ];
  }

  return [
    "Stay aware of your surroundings.",
    "Avoid unsafe areas and changing weather.",
  ];
}

function isValidText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasCorruptedText(value: string): boolean {
  const text = value.toLowerCase();

  const blockedFragments = [
    "description_error",
    "json_error",
    "placeholder",
    "undefined",
    "null",
    "error_error",
    "<li>",
    "<tr>",
    "\\text",
    "textit",
  ];

  if (blockedFragments.some((fragment) => text.includes(fragment))) {
    return true;
  }

  const words = text
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z0-9-]/gi, "").toLowerCase())
    .filter(Boolean);

  if (words.length < 2) {
    return false;
  }

  let repeatedCount = 1;

  for (let index = 1; index < words.length; index++) {
    if (words[index] === words[index - 1]) {
      repeatedCount += 1;

      if (repeatedCount >= 5) {
        return true;
      }
    } else {
      repeatedCount = 1;
    }
  }

  return false;
}

function isValidAIContent(value: unknown): value is AIContent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const content = value as Record<string, unknown>;

  const fields: Array<keyof AIContent> = [
    "title",
    "tagline",
    "summary",
    "step1",
    "step2",
    "step3",
    "natureChallenge",
    "phoneFreeTip",
    "whyThisMission",
  ];

  for (const field of fields) {
    if (!isValidText(content[field])) {
      return false;
    }

    if (hasCorruptedText(content[field])) {
      return false;
    }
  }

  const stepDescriptions = [
    content.step1,
    content.step2,
    content.step3,
  ].map((step) => String(step).trim().toLowerCase());

  if (
    new Set(stepDescriptions).size !== stepDescriptions.length
  ) {
    return false;
  }

  return true;
}

function parseAIContent(text: string): AIContent | null {
  const cleanedText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleanedText.indexOf("{");
  const end = cleanedText.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      cleanedText.slice(start, end + 1),
    );

    return isValidAIContent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function buildPrompt(
  userRequest: string,
  activity: string,
  duration: string,
  retry: boolean,
) {
  return `
You create short outdoor missions for TrailMate.

User request:
${userRequest}

Activity:
${activity}

Available time:
${duration}

Generate ONLY the creative text for one outdoor mission.

Return exactly one JSON object with these 8 fields:
title
tagline
summary
step1
step2
step3
natureChallenge
phoneFreeTip
whyThisMission: briefly explain why this mission fits the user's request, selected activity, and available duration.

Rules:
- Use simple natural English.
- Keep every field short.
- Make all three steps different.
- Step descriptions must be practical outdoor actions.
- Encourage movement, observation, exploration, or connection with nature.
- Make the mission safe and realistic.
- Do not invent specific locations.
- Do not require expensive equipment.
- Do not disturb wildlife or plants.
- Do not mention AI, JSON, prompts, schemas, or instructions.
- Never use placeholder text.
- Never use error text.
- Never repeat words excessively.
- Never output HTML, Markdown, LaTeX, foreign-language text, or symbols as filler.
- Do not include durations in the step descriptions.
- The application will add step durations separately.
- Generate a concise whyThisMission sentence explaining how the mission was personalized for the user's request, activity, and available time.

${
  retry
    ? "The previous response was invalid. Generate a completely fresh response with short clean English sentences."
    : ""
}
`;
}

async function generateAIContent(
  userRequest: string,
  activity: string,
  duration: string,
): Promise<AIContent> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemma-4-26b-a4b-it",
        contents: buildPrompt(
          userRequest,
          activity,
          duration,
          attempt > 1,
        ),
        config: {
          temperature: 0.2,
          maxOutputTokens: 700,
          responseMimeType: "application/json",
          responseSchema: contentSchema,
        },
      });

      const text = response.text ?? "";

      const content = parseAIContent(text);

      if (content) {
        return content;
      }

      console.warn(
        `Invalid AI content on attempt ${attempt}.`,
      );
    } catch (error) {
      console.error(
        `AI generation attempt ${attempt} failed:`,
        error,
      );
    }
  }

  throw new Error(
    "The AI could not generate valid mission content.",
  );
}

function buildMission(
  content: AIContent,
  activity: string,
  duration: string,
): OutdoorMission {
  const stepDurations = getStepDurations(duration);

  return {
    title: content.title.trim(),
    whyThisMission: content.whyThisMission,
    tagline: content.tagline.trim(),
    activity: activity.trim(),
    duration: duration.trim(),
    difficulty: getDifficulty(duration),
    summary: content.summary.trim(),
    preparation: getPreparation(activity),
    steps: [
      {
        title: "Step One",
        description: content.step1.trim(),
        duration: stepDurations[0],
      },
      {
        title: "Step Two",
        description: content.step2.trim(),
        duration: stepDurations[1],
      },
      {
        title: "Step Three",
        description: content.step3.trim(),
        duration: stepDurations[2],
      },
    ],
    natureChallenge: content.natureChallenge.trim(),
    phoneFreeTip: content.phoneFreeTip.trim(),
    safetyTips: getSafetyTips(activity),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const userRequest = body.userRequest;
    const activity = body.activity;
    const duration = body.duration;

    if (
      typeof userRequest !== "string" ||
      typeof activity !== "string" ||
      typeof duration !== "string" ||
      !userRequest.trim() ||
      !activity.trim() ||
      !duration.trim()
    ) {
      return Response.json(
        {
          error: "Missing required mission details.",
        },
        {
          status: 400,
        },
      );
    }

    const content = await generateAIContent(
      userRequest.trim(),
      activity.trim(),
      duration.trim(),
    );

    const mission = buildMission(
      content,
      activity,
      duration,
    );

    return Response.json({ mission });
  } catch (error) {
    console.error("Mission generation error:", error);

    return Response.json(
      {
        error:
          "Unable to create your outdoor mission right now. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}