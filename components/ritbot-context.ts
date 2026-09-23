"use client";

// RitBot's contextual vocabulary. Every line is grounded in the portfolio's
// real data: post captions, story page titles, and highlight labels. RitBot
// never claims anything the site does not support. No em dashes, per the
// site's copy rule.

import type { RitbotMood } from "./ritbot";

export type ContextReaction = {
  key: string;
  line: string;
  mood: RitbotMood;
};

type Rule = {
  match: string;
  lines: string[];
  mood: RitbotMood;
};

// Post / case-study reactions, keyed by words that actually appear in the
// caption or title. Several variants each so repeats feel natural.
const RULES: Rule[] = [
  {
    match: "hellodoc",
    lines: [
      "Interesting choice. This one goes deep.",
      "AI triage, predictions, prescriptions. Want the technical version?",
      "Doctors and patients in one flow. Ritesh shipped this end to end.",
    ],
    mood: "attentive",
  },
  {
    match: "attendsure",
    lines: [
      "Facial recognition on low-end hardware. Look at the interaction details.",
      "This one marks attendance from a face. Ritesh spent quite a bit of time on it.",
    ],
    mood: "curious",
  },
  {
    match: "therapeace",
    lines: [
      "Interesting choice. He co-founded this one.",
      "Mindfulness in native languages. The Figma flow is worth a look.",
    ],
    mood: "attentive",
  },
  {
    match: "connectogram",
    lines: [
      "Built and shipped end to end. Look at the interaction details.",
      "A social platform around challenges. Want the technical version?",
    ],
    mood: "curious",
  },
  {
    match: "gadget mart",
    lines: [
      "Eight plus client projects from this one desk.",
      "This is where the shipping habit started.",
    ],
    mood: "attentive",
  },
  {
    match: "aws",
    lines: ["Certified, both semesters. Cloud fundamentals locked in."],
    mood: "attentive",
  },
  {
    match: "turku",
    lines: ["Campus days. The MSc happens here."],
    mood: "curious",
  },
  {
    match: "kiit",
    lines: ["Fully funded scholarship. CGPA 8.62."],
    mood: "attentive",
  },
  {
    match: "rotaract",
    lines: ["Volunteer leadership. The other kind of team building."],
    mood: "curious",
  },
  {
    match: "notebook",
    lines: ["Now we're getting into the numbers."],
    mood: "curious",
  },
  {
    match: "campus",
    lines: ["Campus days at Turku. Good light for photos too."],
    mood: "curious",
  },
];

// Skill-tag reactions for the Skills highlight. Keys match tags exactly.
const SKILL_LINES: Record<string, string[]> = {
  Python: ["Used this in several projects.", "The notebook workhorse."],
  SQL: ["Now we're getting into the numbers."],
  "Power BI": ["Dashboards live here."],
  TensorFlow: ["Where helloDoc learned to predict."],
  "scikit-learn": ["Quietly does a lot of work on this site's projects."],
  Django: ["His backend of choice at Gadget Mart."],
  Flask: ["Small services, shipped fast."],
  React: ["You're looking at it. This site runs on it."],
  "Node.js": ["Glue for half his projects."],
  Git: ["Every project starts with a repo."],
  AWS: ["Certified, both semesters."],
};

// Fallback lines when nothing specific matches.
const GENERIC_LINES: string[] = [
  "Worth a look.",
  "Ritesh spent quite a bit of time on this one.",
  "This is one of the good parts.",
];

// Section ambience: short, rare, never a demand for attention.
export const SECTION_LINES: Record<string, string> = {
  posts: "Nine posts, all real work.",
  reels: "Reels. The quick version of everything.",
  about: "The long story lives here.",
  gallery: "Life between the projects.",
};

export const CASE_STUDY_LINE = "This is the important part.";

export function pickLine(lines: string[]): string {
  return lines[Math.floor(Math.random() * lines.length)];
}

export function reactToContext(
  text: string,
  kind: "post" | "skill"
): ContextReaction {
  const haystack = text.toLowerCase();
  if (kind === "skill") {
    const exact = SKILL_LINES[text];
    if (exact) return { key: `skill:${text}`, line: pickLine(exact), mood: "curious" };
  }
  for (const rule of RULES) {
    if (haystack.includes(rule.match)) {
      return { key: rule.match, line: pickLine(rule.lines), mood: rule.mood };
    }
  }
  return { key: "generic", line: pickLine(GENERIC_LINES), mood: "curious" };
}

export function reactToStoryPage(title: string): ContextReaction {
  return reactToContext(title, "post");
}
