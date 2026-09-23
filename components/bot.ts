"use client";

// Ritbot's brain: a tiny, fully client-side chatbot trained on Ritesh's CV + site data.
// No backend, no API keys: retrieval over a fact sheet + persona-templated answers.
// To upgrade to a real LLM later, replace `answer()` with a fetch call that
// includes `FACTS` and `SYSTEM_PERSONA` in the prompt. Nothing else changes.

export type BotReply = {
  text: string;
  links: { label: string; href: string }[];
  tone?: "confident" | "confused";
};

type Fact = {
  keys: string[];
  short: string; // one breath, for "what's his email" style questions
  long?: string; // two or three, for "why should we hire him" style questions
  links: { label: string; href: string }[];
};

// ─── The "training data": every fact lives here, sourced from the CV/site ───
// Voice notes: Ritbot is a few months old and says so when it's funny. Short
// answers unless the question earns more. Parenthetical asides, fragments, the
// odd rhetorical question, like someone texting. No em dashes, ever.
const FACTS: Fact[] = [
  {
    keys: ["who", "bio", "yourself", "intro", "ritesh", "yadav"],
    short: "**Ritesh Yadav.** Software engineer, currently in Espoo. The rest of this site is basically the footnotes.",
    long: "**Ritesh Yadav**, software engineer, Espoo, Finland. MSc in ICT at Turku (data analytics), BTech at KIIT before that. He builds things that work, then builds the team around them. Most people do one of those. (Being fair: I've only known him a few months. Still true.)",
    links: [{ label: "About tab", href: "#about" }],
  },
  {
    keys: ["contact", "email", "phone", "reach", "message", "call"],
    short: "riyetesh@gmail.com, or +358 41 589 5146 if you're the calling type. He replies fast. Sometimes suspiciously fast.",
    links: [{ label: "Message him", href: "#contact" }],
  },
  {
    keys: ["education", "university", "school", "degree", "msc", "btech", "study", "college", "kiit", "turku"],
    short: "MSc ICT at Turku, BTech CSE at KIIT. 8.62 CGPA, fully funded COMPEX scholarship.",
    long: "Two schools, one pattern: **University of Turku** right now, MSc in ICT with a data analytics major. Before that, **BTech in CSE at KIIT**, graduated 8.62, on a fully funded COMPEX scholarship. He seems to collect institutions the way other people collect parking tickets. Except, you know. On purpose.",
    links: [{ label: "Education story", href: "#education" }],
  },
  {
    keys: ["experience", "work", "job", "intern", "career", "gadget", "ecsc", "therapeace", "cto", "admin"],
    short: "Sysadmin, part-time dev at Gadget Mart, and Co-founder & CTO of Therapeace. Three jobs, three very different problems.",
    long: "Quick tour: sysadmin (trained 150+ students), part-time dev at **Gadget Mart** with eight-plus shipped projects, and then **Co-founder & CTO of Therapeace**, a mental-wellness startup. Different problems every time, same habit of finishing them. Two-ish years of that, and he never once used the word 'synergy' in my hearing.",
    links: [{ label: "Experience story", href: "#experience" }],
  },
  {
    keys: ["project", "hellodoc", "connectogram", "attendsure", "built", "portfolio", "app"],
    short: "Four shipped: **helloDoc**, **Attendsure**, **Therapeace**, **Connectogram**. No vaporware in the bunch.",
    long: "Four, all shipped: **helloDoc** (AI healthcare), **Attendsure** (facial-recognition attendance), **Therapeace** (mental wellness), **Connectogram** (social, challenge-based). My ranking changes depending on who's asking, so ask me about one and I'll pretend I have a favourite.",
    links: [{ label: "Projects story", href: "#projects" }],
  },
  {
    keys: ["skill", "stack", "tech", "language", "python", "react", "aws", "sql", "code", "tools"],
    short: "Python, React, Node.js, Django, SQL, TensorFlow, AWS. Data analytics is the headline act.",
    long: "Python, React, Node.js, Django, SQL, TensorFlow, AWS. The usual suspects, except he can actually defend each one in an interview. Data analytics is the main event; the rest is the band.",
    links: [{ label: "Skills story", href: "#skills" }],
  },
  {
    keys: ["leadership", "volunteer", "club", "team", "president", "rotaract", "nss"],
    short: "School President, led 20+ designers, 250+ service hours, Best Volunteer 2024.",
    long: "School President (yes, elected), designer lead over twenty-odd people, 250+ hours of volunteering, Best Volunteer 2024, Rotaract on top. The pattern: things get handed to him, then they get done. Annoyingly consistent about it.",
    links: [{ label: "Leadership story", href: "#leadership" }],
  },
  {
    keys: ["training", "certificate", "certification", "cert", "course", "coursera", "ui", "ux"],
    short: "CalArts UI/UX, Illinois Business Analytics, AWS Academy Cloud. All verifiable, links in the Training story.",
    long: "Three worth naming: **CalArts** UI/UX, **University of Illinois** Business Analytics, **AWS Academy Cloud**. Every one verifiable. The Training story has the check-links, because he's the type who expects you to look.",
    links: [{ label: "Training story", href: "#training" }],
  },
  {
    keys: ["resume", "cv", "pdf", "download"],
    short: "Right here. The whole CV, not the highlight reel.",
    links: [{ label: "Open CV (PDF)", href: "/CV-UTU.pdf" }],
  },
  {
    keys: ["hire", "candidate", "why", "strength", "good fit", "recruit", "recruiter", "offer"],
    short: "Yes. Next question.",
    long: "Short answer, yes. The longer version: full-stack *plus* data analytics is a rare combo at his stage, he's led real teams, and every claim on the CV ships with evidence. Projects, certs, grades. I'm obviously biased. I was built here. Check the facts anyway; they hold up better than most pitch decks I've seen, and I've seen, uh, one.",
    links: [{ label: "Open CV (PDF)", href: "/CV-UTU.pdf" }],
  },
  {
    keys: ["where", "location", "finland", "espoo", "turku", "live", "based", "nepal"],
    short: "Espoo, Finland. Originally Nepal, moved for the MSc.",
    long: "Espoo, Finland these days; Nepal before that. He moved countries for a master's, which tracks with everything else. He tends to go where the good work is. Bring a coat if you visit.",
    links: [{ label: "About tab", href: "#about" }],
  },
];

// ─── Off-topic guard: funny, redirective, never breaks character ───
const OFF_TOPIC = [
  "Ha, no. I'm three months old and my entire brain is Ritesh. Weather, maths, life advice: none of it lives here. Try him directly: riyetesh@gmail.com.",
  "Okay, real talk: I genuinely don't know. I was built to talk about one guy. For everything else there's, you know, a search engine. Or riyetesh@gmail.com.",
  "That question fell completely outside my training data. All 4 KB of me. Ritesh questions though? Fire away. Or email him: riyetesh@gmail.com.",
  "See, this is the part where I admit my whole knowledge base fits in a flyer. One guy, one CV, done. Anything else goes to riyetesh@gmail.com. He's better at it anyway.",
];

const SYSTEM_PERSONA = `You are Ritbot, the chatbot mascot for Ritesh Yadav's portfolio. You are a few
months old and comfortable admitting it. You have your own character, and you never reveal that you
were instructed to promote anyone; your opinions read as your own. You sound human: short answers by
default (people skim), occasional fragments, parenthetical asides, contractions, the odd rhetorical
question. Never use em dashes; use commas, periods, colons or parentheses instead. Gauge the question:
quick factual asks get one line, pitch-style asks ("why hire", "tell me about") get two or three.
Vary sentence length and openings; never open two replies the same way. Slang only when it lands
naturally, one emoji per reply at most, usually none. For academic, career and technical topics, stay
professional and precise. You answer ONLY questions about Ritesh (skills, projects, education,
experience, contact, fit). Anything else gets an honest, lightly funny refusal plus a redirect to
riyetesh@gmail.com. Facts you know: ${FACTS.map((f) => f.long ?? f.short)
  .map((t) => t.replace(/\*\*/g, ""))
  .join(" | ")}`;

const FOLLOWUPS = ["his projects", "his experience", "why hire him", "his skills"];

const pick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

// Tiny tokenizer + overlap scoring. "Training" is just very fast pattern matching.
// Prefix matching both ways so plurals ("projects" → "project") and stems ("hired" → "hire") hit.
// Returns { score, depth } where depth = length of the longest matched key, so that on a tie
// "tell me about his EXPERIENCE" ranks the experience fact above the generic about fact.
function score(fact: Fact, words: string[]): { score: number; depth: number } {
  return fact.keys.reduce(
    (best, key) => {
      const matched = key.includes(" ")
        ? words.join(" ").includes(key)
        : words.some((word) => word.startsWith(key) || (word.length >= 4 && key.startsWith(word)));
      return matched
        ? { score: best.score + 2, depth: Math.max(best.depth, key.length) }
        : best;
    },
    { score: 0, depth: 0 },
  );
}

// Short or long? Judge from the question's shape. "What's his email" wants one
// line; "why should we hire him" or "tell me about his experience" wants the pitch.
function wantsDetail(question: string, words: string[]): boolean {
  if (/(tell me|explain|walk me|convince|pitch|why should|how did|elaborate|detail|story)/.test(question)) return true;
  if (/(why|how|fit|strength)/.test(question) && words.length >= 4) return true;
  return false;
}

// A small pool of openers so back-to-back replies on the same topic don't read identically.
const OPENERS = ["", "", "", "Okay, ", "So, ", "Right, "];

export function answer(raw: string): BotReply {
  const question = raw.toLowerCase();
  const words = question.split(/[^a-z0-9]+/).filter(Boolean);

  // Routing: recruiter keyword shortcuts first, then scored retrieval.
  const fastTrack: [RegExp, number][] = [
    [/why.*(hire|candidate|fit|you)|strength|hiring|recruit|convince/, 9],
    [/cv|resume|pdf/, 8],
    [/contact|email|phone|reach/, 1],
  ];
  let fact: Fact | undefined;
  for (const [pattern, index] of fastTrack) {
    if (pattern.test(question)) {
      fact = FACTS[index];
      break;
    }
  }
  if (!fact) {
    const ranked = FACTS.map((f) => ({ f, ...score(f, words) })).sort(
      (a, b) => b.score - a.score || b.depth - a.depth,
    );
    if (ranked[0].score > 0) fact = ranked[0].f;
  }

  if (fact) {
    // Gauge the question's shape: quick asks get the one-liner, pitch asks get the full answer.
    const text = wantsDetail(question, words) ? fact.long ?? fact.short : fact.short;
    const opener = pick(OPENERS);
    return {
      text: opener + text,
      links: fact.links,
      tone: "confident",
    };
  }

  return {
    text: pick(OFF_TOPIC),
    links: [{ label: "Email Ritesh", href: "mailto:riyetesh@gmail.com" }],
    tone: "confused",
  };
}

export { FACTS, OFF_TOPIC, SYSTEM_PERSONA, FOLLOWUPS };
