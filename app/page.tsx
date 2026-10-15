"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { highlightImagePath, highlightLogoPath } from "../components/highlights";
import { JellyExploreButton } from "../components/ui/jelly-explore-button";
import { KeloFooter } from "../components/kelo-footer";
import { OrbitAbout } from "../components/orbit-about";
import { TechStack } from "../components/tech-stack";
import { answer as askBot, FOLLOWUPS } from "../components/bot";

// Ritbot opens differently each visit: one voice, several moods.
const GREETINGS = [
  "Hey, I'm Ritbot. I know a slightly concerning amount about Ritesh: projects, experience, whether he's worth hiring. (He is.) What are you here for?",
  "Oh, hi. I'm Ritbot, three months old, fully employed, and my entire job is telling you about Ritesh Yadav. Ask away.",
  "Welcome. Ritbot, resident expert on exactly one person. Projects, skills, the hire case. Where do we start?",
  "I'm Ritbot. Think of me as Ritesh's CV that talks back. What do you want to know?",
];
import { RitbotFace, type RitbotMood } from "../components/ritbot";
import { CapabilityTree } from "../components/capability-tree";
import { EggHint, KonamiOverlay, TerminalOverlay, useKonami } from "../components/easter-eggs";
import { useRitbotBrain } from "../components/use-ritbot-brain";
import { useRitbotSpeech } from "../components/use-ritbot-speech";
import { reactToContext, reactToStoryPage, CASE_STUDY_LINE } from "../components/ritbot-context";

type Post = {
  caption: string;
  place: string;
  time: string;
  appreciations: number;
  image: string;
};

type Story = {
  label: string;
  symbol: string;
  pages: StoryPage[];
};

type StoryPage = {
  title: string;
  copy: string;
  tone: string;
  tags?: string[];
  details?: string[];
  link?: string;
  actionLabel?: string;
};

type Reel = {
  caption: string;
  video: string;
  poster: string;
  views: number; // real plays only, no fake seed counts
  likes: number; // real likes only
  time: string;
};

type CvItem = {
  title: string;
  meta: string;
  copy: string;
  link?: string;
};

// To add a post: append one entry here. The grid, viewer, likes and comments all
// update automatically. Photos live in public/posts and are named after their
// caption, so "Started my Master's at the Turun yliopisto - University of Turku"
// is served from /posts/started-my-masters-at-turun-yliopisto.jpg — keep the file
// name in step with image: below. Leave image: "" to show the placeholder tile.
// place and time are only rendered when set, so they can stay empty.
const posts: Post[] = [
  {
    caption: "Started my Master's at the Turun yliopisto - University of Turku",
    place: "",
    time: "",
    appreciations: 0, // real likes only, starts at 0, +1 per like, no fake seed counts
    image: "/posts/started-my-masters-at-turun-yliopisto.jpg",
  },
  {
    caption: "Sayonara NSS!! Grateful for the experiences, the lessons, and the friendships.",
    place: "",
    time: "",
    appreciations: 0, // real likes only
    image: "/posts/sayonara-nss.jpg",
  },
  {
    caption: "I am officially an Enginner now! Gradudated in Computer Science Engineering from KIIT",
    place: "",
    time: "",
    appreciations: 0, // real likes only
    image: "/posts/i-am-officially-an-engineer-now.jpg",
  },
  {
    caption: "Best volunteer award.",
    place: "",
    time: "",
    appreciations: 0, // real likes only
    image: "/posts/best-volunteer-award.jpg",
  },
  {
    caption: "Heritage Walk with international friends.",
    place: "",
    time: "",
    appreciations: 0, // real likes only
    image: "/posts/heritage-walk-with-international-friends.jpg",
  },
  {
    caption: "Not me but you.",
    place: "",
    time: "",
    appreciations: 0, // real likes only
    image: "/posts/not-me-but-you.jpg",
  },
];

const stories: Story[] = [
  {
    label: "Profile",
    symbol: "R",
    pages: [
      {
        title: "Ritesh Yadav",
        copy: "Software Engineer · Information and Communication Technology",
        tone: "profile",
        details: [
          "Email: riyetesh@gmail.com",
          "MSc ICT: Data Analytics · Minor in Automation Engineering",
          "Espoo, Finland · +358415895146",
        ],
      },
    ],
  },
  {
    label: "Education",
    symbol: "E",
    pages: [
      {
        title: "MSc Information and Communication Technology",
        copy: "University of Turku · 08/2026-present · Turku, Finland",
        tone: "process",
        details: ["Data Analytics · Minor in Automation Engineering"],
        link: "https://www.utu.fi/en",
      },
      {
        title: "BTech Computer Science and Engineering",
        copy: "Kalinga Institute of Industrial Technology · 06/2021-06/2025 · Bhubaneswar, India",
        tone: "process",
        details: ["Final grade: CGPA 8.62/10"],
        link: "https://kiit.ac.in/",
      },
      {
        title: "High School Diploma",
        copy: "Everest English Boarding Secondary School · Nepal",
        tone: "process",
        details: ["Final grade: 88%"],
        link: "https://everest.edu.np/",
      },
    ],
  },
  {
    label: "Experience",
    symbol: "X",
    pages: [
      {
        title: "System Administrator",
        copy: "Lumbini Institute of Technical Sciences · 10/2025-06/2026 · Butwal, Nepal",
        tone: "work",
        details: [
          "Managed IT infrastructure and trained 150+ diploma students",
        ],
      },
      {
        title: "Software Developer, part-time",
        copy: "Gadget Mart (formerly ECSC Group) · 09/2024-08/2025 · Nepal",
        tone: "work",
        details: [
          "Built 8+ responsive, user-friendly software projects",
        ],
        link: "https://computersc.com.np/",
      },
      {
        title: "Co-founder and CTO",
        copy: "Therapeace · 11/2024-10/2025 · Remote",
        tone: "work",
        details: [
          "Launched and led product, design, development, and operations",
        ],
        link: "https://therapeace.framer.ai/",
      },
      {
        title: "Research and Development Intern",
        copy: "Himalayan Capital Limited · 06/2023-10/2023 · Kathmandu, Nepal",
        tone: "work",
        details: [
          "Supported mutual-fund research, market analysis, and stakeholder reporting",
        ],
        link: "https://himalayancapital.com/",
      },
    ],
  },
  {
    label: "Projects",
    symbol: "P",
    pages: [
      {
        title: "helloDoc",
        copy: "AI healthcare platform",
        tone: "notes",
        details: ["AI healthcare platform for patient connections, disease prediction, and prescriptions."],
        link: "https://hellodoc-lfx5.onrender.com/",
        actionLabel: "Read More",
      },
      {
        title: "Connectogram",
        copy: "Challenge-based social media platform",
        tone: "notes",
        details: ["Challenge-based social platform for interactive connections."],
      },
      {
        title: "Therapeace",
        copy: "Digital well-being app",
        tone: "notes",
        details: ["Digital well-being app promoting mindfulness and mental health."],
        link: "https://www.figma.com/proto/r5KpwegP4RYtRIqwgdcT7N/Therapeace",
        actionLabel: "Read More",
      },
      {
        title: "Attendsure",
        copy: "Facial recognition attendance software",
        tone: "notes",
        details: ["Facial-recognition attendance with facial-expression analysis for better learning."],
        link: "https://github.com/riyetesh/Attendsure",
        actionLabel: "Read More",
      },
    ],
  },
  {
    label: "Skills",
    symbol: "K",
    pages: [
      {
        title: "Data and Analytics",
        copy: "Tools I use to turn data into useful decisions.",
        tone: "notes",
        tags: [
          "Python",
          "C",
          "C++",
          "Power BI",
          "SQL",
          "Pandas",
          "scikit-learn",
          "TensorFlow",
          "Excel",
          "Data Visualisation",
          "Windows/Linux",
          "AWS Cloud",
          "Networking",
          "Git",
          "Java",
          "JavaScript",
          "React",
          "Node.js",
          "Django",
          "Flask",
          "MySQL",
        ],
      },
      {
        title: "Systems and Cloud",
        copy: "Infrastructure, collaboration and reliable foundations.",
        tone: "work",
        tags: [
          "Windows/Linux Administration",
          "AWS Cloud Fundamentals",
          "Networking Basics",
          "Git",
          "SQL",
          "Excel",
        ],
      },
      {
        title: "Development",
        copy: "From responsive interfaces to data-connected services.",
        tone: "elsewhere",
        tags: [
          "Java",
          "C/C++",
          "JavaScript",
          "React",
          "Node.js",
          "Django",
          "Flask",
          "MySQL",
        ],
      },
      {
        title: "Languages",
        copy: "Communication across people, places and disciplines.",
        tone: "process",
        tags: ["English · fluent · PTE 90/90", "Nepali", "Hindi"],
      },
    ],
  },
  {
    label: "Training",
    symbol: "T",
    pages: [
      {
        title: "UI / UX Design",
        copy: "The California Institute of the Arts · 10/2024-11/2024",
        tone: "process",
        details: [
          "Visual UI design, UX fundamentals, information architecture, and prototyping",
        ],
        link: "https://coursera.org/share/02bc1ad94e440395664c5893e6a544d5",
      },
      {
        title: "Introduction to Business Analytics: Communicating with Data",
        copy: "20/09/2024-28/10/2024",
        tone: "process",
        details: ["University of Illinois Urbana-Champaign"],
        link: "https://coursera.org/verify/HHQHWHQBVZU0",
      },
      {
        title: "Academy Introduction to Cloud",
        copy: "Amazon Web Services · 04/2024-08/2024",
        tone: "process",
        details: ["Semester 1 & 2"],
        link: "https://www.credly.com/go/12pbJg1i",
      },
    ],
  },
  {
    label: "Leadership",
    symbol: "L",
    pages: [
      {
        title: "Volunteer",
        copy: "Rotaract Club of Butwal · 08/2025-current",
        tone: "elsewhere",
        details: [
          "Led volunteer teams and supported community programmes",
        ],
      },
      {
        title: "Program Coordinator",
        copy: "Rural Self-Reliance Campaign · 2024",
        tone: "elsewhere",
        details: [
          "Organized a three-day AI education bootcamp for rural students",
        ],
      },
      {
        title: "Designer Lead",
        copy: "National Service Scheme · 01/2022-04/2024",
        tone: "elsewhere",
        details: [
          "Led 20+ designers, completed 250+ service hours, and won Best Volunteer 2024",
        ],
      },
      {
        title: "Creative Team",
        copy: "Microsoft Learn Student Ambassadors · 03/2022-10/2023",
        tone: "elsewhere",
        details: [
          "Organized workshops, hackathons, and webinars for 300+ students",
        ],
      },
      {
        title: "Intern",
        copy: "KIIT E-CELL · 01/2022-01/2023",
        tone: "elsewhere",
        details: [
          "Built entrepreneur support systems and helped conduct Hult Prize KIIT",
        ],
      },
      {
        title: "School President",
        copy: "Everest STEM Club · 2019-2020",
        tone: "elsewhere",
        details: [
          "Coordinated programs, a CAN Science Expo, and inter-school STEM collaboration",
        ],
      },
    ],
  },
];

// To add a reel: drop the video at public/reels/<n>.mp4 (plus an optional poster
// image) and append one entry here. Grid, viewer and counts update automatically.
const reels: Reel[] = [
  {
    caption: "helloDoc in 30 seconds: AI triage, predictions and prescriptions.",
    video: "/reels/1.mp4",
    poster: "/highlights/projects/1.jpg",
    views: 0, // counts a real play when the video actually runs
    likes: 0,
    time: "2 DAYS AGO",
  },
  {
    caption: "Attendsure marking attendance with facial recognition, live.",
    video: "/reels/2.mp4",
    poster: "/highlights/projects/2.jpg",
    views: 0,
    likes: 0,
    time: "5 DAYS AGO",
  },
  {
    caption: "Therapeace, the mindfulness flow, start to finish.",
    video: "/reels/3.mp4",
    poster: "/highlights/projects/3.jpg",
    views: 0,
    likes: 0,
    time: "1 WEEK AGO",
  },
  {
    caption: "Data analytics: from raw CSV to insight in one notebook.",
    video: "/reels/4.mp4",
    poster: "/highlights/training/1.jpg",
    views: 0,
    likes: 0,
    time: "2 WEEKS AGO",
  },
  {
    caption: "Campus days at University of Turku.",
    video: "/reels/5.mp4",
    poster: "/highlights/education/1.jpg",
    views: 0,
    likes: 0,
    time: "3 WEEKS AGO",
  },
  {
    caption: "AWS Cloud Foundations, what Semester 2 actually covers.",
    video: "/reels/6.mp4",
    poster: "/highlights/training/2.jpg",
    views: 0,
    likes: 0,
    time: "1 MONTH AGO",
  },
];

const education: CvItem[] = [
  {
    title: "MSc Information and Communication Technology",
    meta: "University of Turku · 2025-current · Turku, Finland",
    copy: "Information and Communication Technologies.",
    link: "https://www.utu.fi/en",
  },
  {
    title: "BTech Computer Science and Engineering",
    meta: "Kalinga Institute of Industrial Technology · 2021-2025 · CGPA 8.62/10",
    copy: "Bhubaneswar, India.",
    link: "https://kiit.ac.in/",
  },
  {
    title: "UI / UX Design",
    meta: "California Institute of the Arts · Oct-Nov 2024",
    copy: "Visual elements, UX fundamentals, web strategy, wireframes and prototypes.",
    link: "https://coursera.org/share/02bc1ad94e440395664c5893e6a544d5",
  },
  {
    title: "Introduction to Business Analytics: Communicating with Data",
    meta: "University of Illinois Urbana-Champaign · Sep-Oct 2024",
    copy: "Business analytics and communicating insights with data.",
    link: "https://coursera.org/verify/HHQHWHQBVZU0",
  },
  {
    title: "Academy Introduction to Cloud",
    meta: "Amazon Web Services · Apr-Aug 2024",
    copy: "Semester 1 & 2.",
    link: "https://www.credly.com/go/12pbJg1i",
  },
  {
    title: "COMPEX Scholarship 2021",
    meta: "Embassy of India, Kathmandu · 2021-current",
    copy: "Fully funded merit-based scholarship with stipend for BTech Computer Science and Engineering at KIIT, awarded to top-performing candidates.",
  },
  {
    title: "High School Diploma",
    meta: "Everest English Boarding Secondary School · Nepal · 88%",
    copy: "Science and technology foundation.",
    link: "https://everest.edu.np/",
  },
];

const experience: CvItem[] = [
  {
    title: "System Administrator",
    meta: "Lumbini Institute of Technical Sciences · Oct 2025-Jul 2026 · Butwal, Nepal",
    copy: "Oversaw the IT department and delivered computer science training to 150+ diploma students.",
  },
  {
    title: "PTE Instructor",
    meta: "Landmark Education Consultancy · Jan-Aug 2026 · Nepal",
    copy: "Scored 90/90 in PTE and trained students for the examination.",
  },
  {
    title: "Co-founder & CTO",
    meta: "Therapeace · Nov 2024-Oct 2025",
    copy: "Led development, product design, technical strategy and accessibility for an affordable native-language mental wellness platform.",
    link: "https://therapeace.framer.ai/",
  },
  {
    title: "Software Developer, part-time",
    meta: "Gadget Mart (formerly ECSC Group) · Sep 2024-Aug 2025 · Nepal",
    copy: "Designed and developed 8+ software projects with responsive, user-friendly interfaces.",
    link: "https://computersc.com.np/",
  },
  {
    title: "Research & Development Intern",
    meta: "Himalayan Capital Limited · Jun-Oct 2023 · Kathmandu, Nepal",
    copy: "Supported the launch of the Himalayan 80-20 mutual fund worth NRS 100 crore and improved online marketing strategy.",
    link: "https://himalayancapital.com/",
  },
  {
    title: "Product Designer",
    meta: "Nepal Organic Coffee Products · Nov 2020-Dec 2021 · Kathmandu, Nepal",
    copy: "Led the online debut, enabling domestic and international sales, and increased brand engagement by 30%+.",
    link: "https://www.nocp.com.np/",
  },
];

const projects: CvItem[] = [
  {
    title: "helloDoc",
    meta: "AI healthcare platform",
    copy: "An AI-based platform helping doctors connect with patients, predict diseases and prescribe medications.",
    link: "https://hellodoc-lfx5.onrender.com/",
  },
  {
    title: "Connectogram",
    meta: "Challenge-based social media platform",
    copy: "A challenge-based social media platform designed to connect people socially and interactively.",
  },
  {
    title: "Therapeace",
    meta: "Digital well-being app",
    copy: "A digital well-being app designed to promote mindfulness in today's technology-driven society, where mental health truly matters.",
    link: "https://www.figma.com/proto/r5KpwegP4RYtRIqwgdcT7N/Therapeace",
  },
  {
    title: "Attendsure",
    meta: "Facial recognition attendance software",
    copy: "Facial recognition software designed to take student attendance seamlessly and promote better learning through facial-expression analysis.",
    link: "https://github.com/riyetesh/Attendsure",
  },
];

const skills = [
  "C",
  "C++",
  "Java",
  "Python",
  "JavaScript",
  "React",
  "React Native",
  "Node.js",
  "Django",
  "Flask",
  "MySQL",
  "TensorFlow",
  "AWS",
  "Git",
  "GitHub",
  "Figma",
  "Adobe Creative Cloud",
  "Flutter",
  "HTML",
  "CSS",
  "Tkinter",
  "CustomTkinter",
  "Notion",
  "UI/UX Design",
  "User Research",
  "Wireframing",
  "Prototyping",
  "Product Strategy",
  "SEO",
  "SEM",
  "Digital Content",
];

const leadership: CvItem[] = [
  {
    title: "Volunteer",
    meta: "Rotaract Club of Butwal · Aug 2025-current",
    copy: "Led and coordinated volunteer teams for community programmes.",
  },
  {
    title: "Program Coordinator",
    meta: "Rural Self-Reliance Campaign · 2024",
    copy: "Organized a three-day AI for Education bootcamp for rural students.",
  },
  {
    title: "Designer Lead",
    meta: "National Service Scheme · Jan 2022-Apr 2024",
    copy: "Led 20+ designers, completed 250+ hours of service, and received Best Volunteer Award 2024.",
  },
  {
    title: "Creative Team",
    meta: "Microsoft Learn Student Ambassadors · Mar 2022-Oct 2023",
    copy: "Organized an ML game development workshop, hackathons and webinars for 300+ students.",
  },
  {
    title: "Intern",
    meta: "KIIT E-CELL · Jan 2022-Jan 2023",
    copy: "Built support systems for aspiring entrepreneurs and helped conduct Hult Prize KIIT.",
  },
  {
    title: "School President",
    meta: "Everest STEM Club · 2019-2020",
    copy: "Coordinated programs and a Science Expo with the Computer Association of Nepal.",
  },
];

let soundContext: AudioContext | null = null;

function playUiSound(kind: "click" | "reaction") {
  if (typeof window === "undefined") return;
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) return;
  soundContext ??= new AudioContextConstructor();
  const context = soundContext;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const frequency = kind === "reaction" ? 740 : 520;
  oscillator.type = kind === "reaction" ? "sine" : "triangle";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.18, now + 0.08);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(kind === "reaction" ? 0.045 : 0.025, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
  oscillator.connect(gain);
  gain.connect(context.destination);
  void context.resume();
  oscillator.start(now);
  oscillator.stop(now + 0.12);
}

const icons: Record<string, ReactNode> = {
  home: (
    <path d="M3 10.8 12 3l9 7.8v8.7a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 19.5z" />
  ),
  play: <path d="M8 5.5v13l11-6.5z" />,
  muted: (
    <>
      <path d="M11 5 6.5 9H3v6h3.5L11 19z" />
      <path d="m16 9.5 5 5m0-5-5 5" />
    </>
  ),
  sound: (
    <>
      <path d="M11 5 6.5 9H3v6h3.5L11 19z" />
      <path d="M14.5 8.5a5 5 0 0 1 0 7" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m16 16 4.2 4.2" />
    </>
  ),
  heart: (
    <path d="M20.8 8.9c0 5.8-8.8 10.7-8.8 10.7S3.2 14.7 3.2 8.9A4.7 4.7 0 0 1 12 6.5a4.7 4.7 0 0 1 8.8 2.4Z" />
  ),
  mark: <path d="M6 3.5h12v17l-6-3.7-6 3.7z" />,
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  send: <path d="m21 3-7.2 18-3.9-7.1L3 10.2zM10 14l4.4-4.3" />,
  message: (
    <>
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3.4-.7L4 20l1.7-3.5A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
    </>
  ),
  linkedin: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 10v6M8 7.5v.01M12 16v-3.2a2.8 2.8 0 0 1 5.6 0V16M12 10v6" /></>,
  github: <path d="M9 19c-4 .9-4-2-5.5-2.5M14.5 21v-2.8a2.4 2.4 0 0 0-.7-1.8c2.3-.3 4.7-1.1 4.7-5a3.9 3.9 0 0 0-1-2.7 3.6 3.6 0 0 0-.1-2.7s-.8-.3-2.8 1a9.5 9.5 0 0 0-5.1 0c-2-1.3-2.8-1-2.8-1a3.6 3.6 0 0 0-.1 2.7 3.9 3.9 0 0 0-1 2.7c0 3.9 2.4 4.7 4.7 5a2.4 2.4 0 0 0-.7 1.8V21" />,
  medium: <path d="M4 7.5h2.2l2.7 6.8 2.7-6.8H14v9h-2v-5.8L9.8 16H8.2L6 10.7v5.8H4zM16 10h4v6h-4z" />,
  email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  camera: (
    <>
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7H7l1.6-2h6.8L17 7h2.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.4" />
    </>
  ),
};

function I({ n, on = false }: { n: string; on?: boolean }) {
  return (
    <svg
      className={`icon${on ? " on" : ""}`}
      viewBox="0 0 24 24"
      fill={on ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[n]}
    </svg>
  );
}

function Avatar({ small = false }: { small?: boolean }) {
  return <i className={`avatar${small ? " mini" : ""}`}><img src="/profilepic.jpg" alt="Ritesh Yadav" /></i>;
}

// Wrap emojis in a white chip so they stay crisp on dark bubbles (Windows renders
// them flat; a plain dark background makes them hard to read).
const EMOJI_PATTERN = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu;

function RichText({ text }: { text: string }) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, outerIndex) => {
        const segments = part.split(EMOJI_PATTERN);
        const emojis = part.match(EMOJI_PATTERN) ?? [];
        return (
          <span key={outerIndex}>
            {segments.map((segment, innerIndex) => (
              <span key={innerIndex}>
                {segment}
                {emojis[innerIndex] !== undefined && (
                  <span className="emoji-chip">{emojis[innerIndex]}</span>
                )}
              </span>
            ))}
          </span>
        );
      })}
    </>
  );
}

function ReelSlide({
  reel,
  active,
  activeViewer,
  muted,
  liked,
  views,
  onToggleLike,
  onToggleMute,
  onShare,
  onPlayed,
}: {
  reel: Reel;
  active: boolean;
  activeViewer: boolean;
  muted: boolean;
  liked: boolean;
  views: number;
  onToggleLike: () => void;
  onToggleMute: () => void;
  onShare: () => void;
  onPlayed: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false); // one view per open, only when playback actually starts

  // Autoplay only the in-view slide; pause everything else.
  useEffect(() => {
    const video = videoRef.current;
    const slide = slideRef.current;
    if (!video || !slide || !activeViewer) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(slide);
    return () => observer.disconnect();
  }, [activeViewer]);

  // Jump-to-reel: when opened from the grid, nudge this slide into view.
  useEffect(() => {
    if (!active || !activeViewer) return;
    slideRef.current?.scrollIntoView({ block: "center" });
  }, [active, activeViewer]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <div className="reel-slide" ref={slideRef}>
      <div className="reel-stage" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={reel.video}
          poster={reel.poster}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          onPlay={() => {
            if (!playedRef.current) {
              playedRef.current = true;
              onPlayed();
            }
          }}
        />
        <div className="reel-meta">
          <span className="reel-user">
            <Avatar small />
            <b>riteshyadav</b>
          </span>
          <p>{reel.caption}</p>
          <small>{reel.time}</small>
        </div>
        <button
          className="reel-mute"
          onClick={onToggleMute}
          aria-label={muted ? "Unmute reel" : "Mute reel"}
        >
          <I n={muted ? "muted" : "sound"} />
        </button>
      </div>
      <aside className="reel-rail">
        <button onClick={onToggleLike} aria-label={liked ? "Unlike reel" : "Like reel"}>
          <I n="heart" on={liked} />
          <small>{reel.likes + (liked ? 1 : 0)}</small>
        </button>
        <button onClick={onShare} aria-label="Share reel">
          <I n="send" />
          <small>Share</small>
        </button>
      </aside>
    </div>
  );
}

function CvCard({ item }: { item: CvItem }) {
  return (
    <article className="cv-card">
      <div>
        <h4>{item.title}</h4>
        <p className="cv-meta">{item.meta}</p>
        <p>{item.copy}</p>
      </div>
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${item.title} link`}
        >
          ↗
        </a>
      )}
    </article>
  );
}

export default function Home() {
  const [liked, setLiked] = useState<number[]>([]);
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [activeStoryPage, setActiveStoryPage] = useState(0);
  const [storyReply, setStoryReply] = useState("");
  const [storyReaction, setStoryReaction] = useState<string | null>(null);
  const [profileStoryViewed, setProfileStoryViewed] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [eggHintOpen, setEggHintOpen] = useState(false);
  const [eggsFound, setEggsFound] = useState<string[]>([]);
  const [konamiOpen, setKonamiOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [ritbotSecret, setRitbotSecret] = useState(false);
  const [profileClicks, setProfileClicks] = useState(0);
  const markEgg = (name: string) =>
    setEggsFound((found) => (found.includes(name) ? found : [...found, name]));
  const [searchOpen, setSearchOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [viewerPost, setViewerPost] = useState<number | null>(null);
  const [viewerReel, setViewerReel] = useState<number | null>(null);
  const [reelMuted, setReelMuted] = useState(true);
  const [reelLiked, setReelLiked] = useState<number[]>([]);
  const [reelViews, setReelViews] = useState<number[]>(reels.map(() => 0)); // real plays, one per session per reel
  const [saved, setSaved] = useState<number[]>([]);
  const [burstFor, setBurstFor] = useState<number | null>(null);
  const [postComments, setPostComments] = useState<Record<number, { author: string; text: string }[]>>({});
  const [commentingFor, setCommentingFor] = useState<number | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [brokenImages, setBrokenImages] = useState<number[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTyping, setChatTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ from: "bot" | "user"; text: string }[]>(() => [
    { from: "bot", text: GREETINGS[Math.floor(Math.random() * GREETINGS.length)] },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [activeFollowups, setActiveFollowups] = useState<string[]>(FOLLOWUPS);
  const [ritbotMood, setRitbotMood] = useState<RitbotMood>("idle");
  const [ritbotPeeking, setRitbotPeeking] = useState(false);
  const [fabHovering, setFabHovering] = useState(false);
  const chatLogRef = useRef<HTMLDivElement>(null);
  const { bubble: ritbotBubble, say: ritbotSay, clear: ritbotClearSpeech } = useRitbotSpeech({ chatOpen });

  const openStory = (storyIndex: number) => {
    if (storyIndex === 0) setProfileStoryViewed(true);
    setActiveStory(storyIndex);
    setActiveStoryPage(0);
  };
  // RitBot comments when a post (project) is opened, grounded in its caption.
  const openPost = (index: number) => {
    setViewerPost(index);
    const post = posts[index];
    if (post) {
      const reaction = reactToContext(post.caption, "post");
      ritbotSay(reaction.line, reaction.mood, `post:${reaction.key}`);
    }
  };
  const closeStory = () => {
    setActiveStory(null);
    setActiveStoryPage(0);
    setStoryReply("");
    setStoryReaction(null);
  };
  // RitBot reacts to the story page being opened: case studies make it attentive.
  useEffect(() => {
    if (activeStory === null) return;
    const page = stories[activeStory]?.pages[activeStoryPage];
    if (!page) return;
    if (page.actionLabel === "Read More") {
      ritbotSay(CASE_STUDY_LINE, "attentive", `case:${page.title}`);
    } else {
      const reaction = reactToStoryPage(page.title);
      ritbotSay(reaction.line, reaction.mood, `story:${reaction.key}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStory, activeStoryPage]);
  const moveStory = (direction: number) => {
    if (activeStory === null) return;
    const pageCount = stories[activeStory].pages.length;
    if (direction > 0 && activeStoryPage < pageCount - 1) {
      setActiveStoryPage((page) => page + 1);
      return;
    }
    if (direction < 0 && activeStoryPage > 0) {
      setActiveStoryPage((page) => page - 1);
      return;
    }
    // Edge reached: next past the last page closes the highlight, Instagram-style.
    // Previous on the first page simply stays put.
    if (direction > 0) closeStory();
  };
  const sendStoryReply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitReply();
  };
  const toggle = (
    id: number,
    setter: React.Dispatch<React.SetStateAction<number[]>>,
  ) =>
    setter((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  const announce = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2400);
  };
  const handleInterfaceClick = (event: React.MouseEvent<HTMLElement>) => {
    const control = (event.target as HTMLElement).closest("button, a");
    if (!control) return;
    playUiSound(control.closest(".story-reactions") ? "reaction" : "click");
  };
  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      announce("Profile link copied");
    } catch {
      announce("Profile link ready to share");
    }
  };
  // Double-tap the photo: like + big heart burst (never unlikes, like Instagram).
  const doubleClickLike = (index: number) => {
    if (!liked.includes(index)) toggle(index, setLiked);
    setBurstFor(index);
    window.setTimeout(() => setBurstFor((current) => (current === index ? null : current)), 900);
  };
  const sharePost = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      announce("Post link copied");
    } catch {
      announce("Post link ready to share");
    }
  };
  const addComment = (index: number, text: string) =>
    setPostComments((current) => ({
      ...current,
      [index]: [...(current[index] ?? []), { author: "you", text }],
    }));
  const submitComment = (index: number) => {
    const text = commentDraft.trim();
    if (!text) return;
    addComment(index, text);
    setCommentDraft("");
  };

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitContact();
  };

  // Jelly buttons fire onClick without an event, so form submits and chip asks route through these.
  const submitContact = () => {
    const subject = `Portfolio enquiry from ${contactName}`;
    const body = `Name: ${contactName}\nEmail: ${contactEmail}\n\n${contactMessage}`;
    window.location.href = `mailto:riyetesh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const submitReply = () => {
    if (!storyReply.trim()) return;
    announce("Reply sent");
    setStoryReply("");
  };
  const askFromChip = (chip: string) => {
    setChatMessages((messages) => [...messages, { from: "user", text: chip }]);
    setActiveFollowups([]);
    setChatTyping(true);
    window.setTimeout(() => {
      const reply = askBot(chip);
      setChatMessages((messages) => [...messages, { from: "bot", text: reply.text }]);
      setChatTyping(false);
      setActiveFollowups(FOLLOWUPS);
    }, 650);
  };
  const handleChatNav = (href: string) => {
    setChatOpen(false);
    const storyLabels = ["Education", "Experience", "Skills", "Projects", "Training", "Leadership"];
    const label = storyLabels.find((l) => href === `#${l.toLowerCase()}`);
    if (label) {
      openStory(stories.findIndex((story) => story.label === label));
      return;
    }
    if (href === "#about") {
      setActiveTab("about");
      document.getElementById("feed")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (href === "#contact") {
      setMessageOpen(true);
      return;
    }
    if (href.startsWith("/")) {
      window.open(href, "_blank", "noreferrer");
    }
  };

  const sendChat = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = chatInput.trim();
    if (!question || chatTyping) return;
    setChatMessages((messages) => [...messages, { from: "user", text: question }]);
    setChatInput("");
    setActiveFollowups([]);
    setChatTyping(true);
    setRitbotMood("thinking");
    window.setTimeout(() => setRitbotMood("idle"), 600);
    window.setTimeout(() => {
      const reply = askBot(question);
      setChatMessages((messages) => [...messages, { from: "bot", text: reply.text }]);
      setChatTyping(false);
      setRitbotMood(reply.tone === "confused" ? "confused" : "success");
      setActiveFollowups(FOLLOWUPS.filter((f) => !reply.text.includes(f.replace(/[^a-z]/gi, ""))));
      window.setTimeout(() => setRitbotMood("idle"), 1600);
    }, 650 + Math.random() * 500);
  };
  const openChat = () => {
    setFabHovering(false);
    setChatOpen(true);
    setRitbotMood("excited");
    window.setTimeout(() => setRitbotMood("idle"), 1200);
  };
  // Easter egg triggers. RitBot five clicks: freeze, glitch, playful spin.
  // The FAB opens the chat as normal; the chat header face keeps counting,
  // and the fifth click closes the chat into the glitch animation.
  const ritbotClickCount = useRef(0);
  const ritbotClickTimer = useRef(0);
  const handleFabClick = (openChatOnClick = true) => {
    ritbotClickCount.current += 1;
    window.clearTimeout(ritbotClickTimer.current);
    ritbotClickTimer.current = window.setTimeout(() => {
      ritbotClickCount.current = 0;
    }, 2500);
    if (ritbotClickCount.current >= 5) {
      ritbotClickCount.current = 0;
      markEgg("RitBot glitch");
      setRitbotSecret(true);
      setRitbotMood("surprised");
      setChatOpen(false);
      window.setTimeout(() => setRitbotMood("idle"), 2600);
      window.setTimeout(() => setRitbotSecret(false), 2600);
      return;
    }
    if (openChatOnClick) openChat();
  };
  useKonami(() => {
    markEgg("Developer mode");
    setKonamiOpen(true);
  });
  // The terminal hides behind the hint panel's last line.
  const openTerminal = () => {
    markEgg("Terminal");
    setEggHintOpen(false);
    setTerminalOpen(true);
  };
  const [viewerClosing, setViewerClosing] = useState(false);
  const closeViewerSmoothly = (which: "post" | "reel") => {
    setViewerClosing((already) => {
      if (already) return already;
      window.setTimeout(() => {
        if (which === "post") setViewerPost(null);
        else setViewerReel(null);
        setViewerClosing(false);
      }, 350);
      return true;
    });
  };
  const closeChat = () => {
    setRitbotMood("goodbye");
    window.setTimeout(() => {
      setChatOpen(false);
      setRitbotMood("idle");
    }, 900);
  };

  useEffect(() => {
    chatLogRef.current?.scrollTo({
      top: chatLogRef.current.scrollHeight,
    });
  }, [chatMessages, chatTyping]);

  // Ritbot peeks out of its button now and then, unless reduced motion is on.
  useEffect(() => {
    if (chatOpen) {
      setRitbotPeeking(false);
      return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setRitbotPeeking(true);
        window.setTimeout(() => setRitbotPeeking(false), 1800);
        schedule();
      }, 9000 + Math.random() * 9000);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [chatOpen]);

  // RitBot's brain: one state-driven system for gaze, mood and posture.
  const ritbotBrain = useRitbotBrain({
    chatOpen,
    chatTyping,
    baseMood: ritbotMood,
    fabHovering,
  });

  useEffect(() => {
    if (viewerPost === null) return;
    const feed = feedRef.current;
    if (!feed) return;
    // The .post-viewer overlay is the scrolling element; cards are positioned within it.
    const scroller = feed.closest<HTMLDivElement>(".post-viewer") ?? feed;
    const target = feed.querySelector<HTMLElement>(`[data-index="${viewerPost}"]`);
    if (target) scroller.scrollTop = target.offsetTop - 14;
  }, [viewerPost]);

  // Instagram-style edge close: keep scrolling up past the first post or down past
  // the last and the viewer fades away. Gesture-based, so resting at an edge never closes.
  useEffect(() => {
    if (viewerPost === null) return;
    const scroller = document.querySelector<HTMLDivElement>(".post-viewer");
    if (!scroller) return;
    let edgeDelta = 0;
    const handleWheel = (event: WheelEvent) => {
      const atTop = scroller.scrollTop <= 0;
      const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
      const pullingUp = event.deltaY < 0 && atTop;
      const pullingDown = event.deltaY > 0 && atBottom;
      if (pullingUp || pullingDown) {
        edgeDelta += Math.abs(event.deltaY);
        if (edgeDelta > 120) closeViewerSmoothly("post");
      } else {
        edgeDelta = 0;
      }
    };
    scroller.addEventListener("wheel", handleWheel, { passive: true });
    return () => scroller.removeEventListener("wheel", handleWheel);
  }, [viewerPost]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeStory();
        setSearchOpen(false);
        setMessageOpen(false);
        if (viewerPost !== null) closeViewerSmoothly("post");
        setViewerReel(null);
        setCommentingFor(null);
        setChatOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const currentStory = activeStory === null ? null : stories[activeStory];
  const currentStoryPage = currentStory?.pages[activeStoryPage] ?? null;

  return (
    <main className="app" onClick={handleInterfaceClick}>
      <section className="feed" id="feed">
        <header className="topnav">
          <a className="logo" href="#profile">Riteshfolio</a>
          <nav>
            <a className="active" href="#feed">
              <I n="home" on />
              <span>Home</span>
            </a>
            <button onClick={() => setMessageOpen(true)}>
              <I n="message" />
              <span>Message</span>
            </button>
          </nav>
        </header>
        <header className="mobile topbar">
          <b className="logo">
            Riteshfolio
          </b>
          <button onClick={() => setSearchOpen(true)} aria-label="Search">
            <I n="search" />
          </button>
          <button onClick={() => setMessageOpen(true)} aria-label="Messages">
            <I n="message" />
          </button>
        </header>

        <section className="profile" id="profile">
          <button
            className={`avatar profilepic story-trigger${profileStoryViewed ? " story-viewed" : ""}${ritbotSecret ? " egg-jolt" : ""}`}
            onClick={() => {
              setProfileClicks((clicks) => {
                const next = clicks + 1;
                if (next >= 3) {
                  markEgg("Avatar jolt");
                  setRitbotMood("curious");
                  ritbotSay("You found the avatar easter egg. Nice.", "curious", "avatar-egg");
                  window.setTimeout(() => setRitbotMood("idle"), 2200);
                  return 0;
                }
                return next;
              });
              openStory(0);
            }}
            aria-label="Open profile story"
          >
            <img src="/profilepic.jpg" alt="Ritesh Yadav" />
          </button>
          <div className="profile-info">
            <div className="title">
              <h1>riteshyadav</h1>
              <a
                className="verified"
                href="https://www.flaticon.com/free-icons/blue-tick"
                title="blue tick icons"
                target="_blank"
                rel="noreferrer"
                aria-label="Blue tick icons created by Anggara - Flaticon"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/8358/8358886.png"
                  alt="Blue tick icons created by Anggara - Flaticon"
                />
              </a>
            </div>
            <div className="profile-actions">
              <JellyExploreButton color="var(--blue)" width={84} height={30} fontSize={12} onClick={() => window.open("/CV-UTU.pdf", "_blank", "noopener")}>Resume</JellyExploreButton>
              <JellyExploreButton color="var(--blue)" width={84} height={30} fontSize={12} onClick={() => setMessageOpen(true)}>Message</JellyExploreButton>
              <button
                className="icon-button"
                onClick={() => void copyProfileLink()}
              >
                •••
              </button>
            </div>
            <p className="stats">
              <span><b>0</b> followers</span>
              <span><b>0</b> following</span>
            </p>
            <p className="profile-bio">
              Software Engineer focused on data analytics
              <br />
              and thoughtful digital products.
            </p>
            <p className="profile-contact">
              Espoo, Finland · <a href="tel:+358415895146">+358 41 589 5146</a>
            </p>
            <div className="profile-socials" aria-label="Social links">
              <a href="https://www.linkedin.com/in/theriteshyadav/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><I n="linkedin" /><span>LinkedIn</span></a>
              <a href="https://github.com/riyetesh" target="_blank" rel="noreferrer" aria-label="GitHub"><I n="github" /><span>GitHub</span></a>
              <a href="https://theriteshyadav.medium.com/" target="_blank" rel="noreferrer" aria-label="Medium"><I n="medium" /><span>Medium</span></a>
              <a href="mailto:riyetesh@gmail.com" aria-label="Email"><I n="email" /><span>Email</span></a>
            </div>
          </div>
        </section>

        <div className="stories">
          {["Education", "Experience", "Skills", "Projects", "Training", "Leadership"].map((label) => {
            const storyIndex = stories.findIndex((story) => story.label === label);
            const story = stories[storyIndex];
            return (
              <button key={story.label} onClick={() => openStory(storyIndex)}>
                <i className={`story-ring ${story.pages[0].tone}`}>
                  <img src={highlightLogoPath(story.label)} alt="" />
                </i>
                <span>{story.label}</span>
              </button>
            );
          })}
        </div>

        <div className="feed-tabs" role="tablist">
          <button
            className={activeTab === "posts" ? "selected" : ""}
            onClick={() => setActiveTab("posts")}
            role="tab"
          >
            <span className="grid-icon" />
            Posts
          </button>
          <button
            className={activeTab === "reels" ? "selected" : ""}
            onClick={() => setActiveTab("reels")}
            role="tab"
          >
            <I n="play" />
            Reels
          </button>
          <button
            className={activeTab === "about" ? "selected" : ""}
            onClick={() => setActiveTab("about")}
            role="tab"
          >
            <span className="about-icon">i</span>About
          </button>
        </div>

{activeTab === "posts" ? (
          <>
            <section className="post-grid">
            {posts.map((post, index) => {
              const showPlaceholder = !post.image || brokenImages.includes(index);
              return (
                <button
                  className="grid-tile"
                  key={post.caption}
                  onClick={() => openPost(index)}
                  aria-label={`Open post: ${post.caption}`}
                >
                  {showPlaceholder ? (
                    <span className="post-media-empty">
                      <I n="camera" />
                      <small>Photo coming soon</small>
                    </span>
                  ) : (
                    <img
                      src={post.image}
                      alt=""
                      onError={() =>
                        setBrokenImages((current) =>
                          current.includes(index) ? current : [...current, index],
                        )
                      }
                    />
                  )}
                </button>
              );
            })}
            </section>
          </>
        ) : activeTab === "reels" ? (
          <section className="reels-grid">
            {reels.map((reel, index) => (
              <button
                className="reel-tile"
                key={reel.caption}
                onClick={() => setViewerReel(index)}
                aria-label={`Play reel: ${reel.caption}`}
              >
                <img src={reel.poster} alt="" />
                {reel.views + reelViews[index] > 0 && (
                  <span className="reel-views">
                    <I n="play" />
                    {reel.views + reelViews[index]}
                  </span>
                )}
              </button>
            ))}
          </section>
        ) : activeTab === "about" ? (
          <section className="about-panel">
            <OrbitAbout />
            <TechStack />
            <CapabilityTree />
          </section>
        ) : (
          <section className="post-grid">
            {posts.map((post, index) => {
              const showPlaceholder = !post.image || brokenImages.includes(index);
              return (
                <button
                  className="grid-tile"
                  key={post.caption}
                  onClick={() => openPost(index)}
                  aria-label={`Open post: ${post.caption}`}
                >
                  {showPlaceholder ? (
                    <span className="post-media-empty">
                      <I n="camera" />
                      <small>Photo coming soon</small>
                    </span>
                  ) : (
                    <img
                      src={post.image}
                      alt=""
                      onError={() =>
                        setBrokenImages((current) =>
                          current.includes(index) ? current : [...current, index],
                        )
                      }
                    />
                  )}
                </button>
              );
            })}
          </section>
        )}
      </section>

      <KeloFooter onNavigate={(tab) => setActiveTab(tab as typeof activeTab)} />

      {activeStory !== null && currentStory && currentStoryPage && (
        <div
          className="story-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${currentStory.label} story`}
          onClick={closeStory}
        >
          <div
            className={`story-viewer story-${currentStoryPage.tone}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="story-progress">
              {currentStory.pages.map((page, index) => (
                <span
                  className={
                    index === activeStoryPage
                      ? "current"
                      : index < activeStoryPage
                        ? "seen"
                        : ""
                  }
                  key={page.title}
                />
              ))}
            </div>
            <header>
              <span>
                <Avatar small />
                <b>riteshyadav</b>
                <small>{currentStory.label}</small>
              </span>
              <button onClick={closeStory} aria-label="Close story">
                ×
              </button>
            </header>
            <div className="story-copy">
              <section className="story-heading">
                <h2>{currentStoryPage.title}</h2>
              </section>
              <section className="story-body">
                <div className="story-image">
                  <img
                    src={highlightImagePath(currentStory.label, activeStoryPage + 1)}
                    alt=""
                  />
                </div>
                <p>{currentStoryPage.copy}</p>
              </section>
              <section className="story-content">
                {currentStoryPage.details && (
                  <p className="story-details">
                    {currentStoryPage.details.join(" · ")}
                  </p>
                )}
                {currentStoryPage.tags && (
                  <div className="story-tags">
                    {currentStoryPage.tags.map((tag) => (
                      <span
                        key={tag}
                        onMouseEnter={() => {
                          const reaction = reactToContext(tag, "skill");
                          if (reaction.key.startsWith("skill:")) {
                            ritbotSay(reaction.line, reaction.mood, reaction.key);
                          }
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {currentStoryPage.link && (
                  <a
                    className="story-link"
                    href={currentStoryPage.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${currentStoryPage.actionLabel ?? "Verify"} ${currentStoryPage.title}`}
                  >
                    {currentStoryPage.actionLabel === "Read More" ? "Read More ↗" : <><span className="verify-mark">✓</span> Verify</>}
                  </a>
                )}
              </section>
            </div>
            <button
              className="story-prev"
              onClick={() => moveStory(-1)}
              aria-label="Previous story page"
            >
              ‹
            </button>
            <button
              className="story-next"
              onClick={() => moveStory(1)}
              aria-label="Next story page"
            >
              ›
            </button>
            <div className="story-reactions" aria-label="Story reactions">
              {["❤️", "😂", "😮", "😢", "🔥"].map((emoji) => (
                <button
                  className={storyReaction === emoji ? "reacted" : ""}
                  key={emoji}
                  onClick={() => setStoryReaction(emoji)}
                  aria-label={`React ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <footer>
              <form className="story-reply" onSubmit={sendStoryReply}>
                <input
                  value={storyReply}
                  onChange={(event) => setStoryReply(event.target.value)}
                  placeholder="Reply to story"
                  aria-label="Reply to story"
                />
                <JellyExploreButton color="var(--blue)" width={44} height={44} fontSize={20} onClick={submitReply}>
                  <I n="send" />
                </JellyExploreButton>
              </form>
            </footer>
          </div>
        </div>
      )}
      {searchOpen && (
        <div className="overlay" onClick={() => setSearchOpen(false)}>
          <section
            className="dialog search-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="dialog-close"
              onClick={() => setSearchOpen(false)}
            >
              ×
            </button>
            <p className="eyebrow">Discover</p>
            <h2>Search</h2>
            <input autoFocus placeholder='Try "Therapeace", "Turku", "AWS"...' />
            <div className="search-suggestions">
              <JellyExploreButton color="var(--blue)" width={200} height={46} fontSize={15} onClick={() => { setSearchOpen(false); setActiveTab("posts"); }}>Jump to Posts ↗</JellyExploreButton>
              <JellyExploreButton color="var(--blue)" width={200} height={46} fontSize={15} onClick={() => { setSearchOpen(false); setActiveTab("about"); }}>Jump to About ↗</JellyExploreButton>
            </div>
          </section>
        </div>
      )}
      {messageOpen && (
        <div className="overlay" onClick={() => setMessageOpen(false)}>
          <section
            className="dialog message-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="dialog-close"
              onClick={() => setMessageOpen(false)}
            >
              ×
            </button>
            <Avatar />
            <p className="eyebrow">Contact Ritesh</p>
            <h2>Send a message</h2>
            <form onSubmit={sendMessage}>
              <input
                required
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                placeholder="Your name"
              />
              <input
                required
                type="email"
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
                placeholder="Your email"
              />
              <textarea
                required
                value={contactMessage}
                onChange={(event) => setContactMessage(event.target.value)}
                placeholder="Your message"
              />
              <JellyExploreButton color="var(--blue)" width={200} height={48} fontSize={16} onClick={submitContact}>Send message</JellyExploreButton>
            </form>
          </section>
        </div>
      )}
      {viewerReel !== null && (
        <div className="reel-viewer">
          <div className="reel-track">
            {reels.map((reel, index) => (
              <ReelSlide
                key={reel.caption}
                reel={reel}
                active={index === viewerReel}
                activeViewer={viewerReel !== null}
                muted={reelMuted}
                liked={reelLiked.includes(index)}
                views={reel.views + reelViews[index]}
                onToggleLike={() => toggle(index, setReelLiked)}
                onToggleMute={() => setReelMuted((m) => !m)}
                onShare={() => void sharePost()}
                onPlayed={() =>
                  setReelViews((current) =>
                    current[index] === 0 ? current.map((v, i) => (i === index ? 1 : v)) : current,
                  )
                }
              />
            ))}
          </div>
          <button
            className="reel-viewer-close"
            onClick={() => setViewerReel(null)}
            aria-label="Close reels"
          >
            ×
          </button>
        </div>
      )}
      {viewerPost !== null && (
        <div
          className={`post-viewer${viewerClosing ? " closing" : ""}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeViewerSmoothly("post");
          }}
        >
          <div className="post-feed" ref={feedRef}>
            {posts.map((post, index) => {
              const isLiked = liked.includes(index);
              const isSaved = saved.includes(index);
              const showPlaceholder = !post.image || brokenImages.includes(index);
              const comments = postComments[index] ?? [];
              return (
                <article className="post-card" data-index={index} key={post.caption}>
                  <header className="post-card-head">
                    <Avatar small />
                    <div className="post-card-id">
                      <b>riteshyadav</b>
                      {post.place && <small>{post.place}</small>}
                    </div>
                    <button
                      className="post-card-more"
                      onClick={() => void sharePost()}
                      aria-label="Copy post link"
                    >
                      •••
                    </button>
                  </header>
                  <div
                    className="post-media"
                    onDoubleClick={() => doubleClickLike(index)}
                  >
                    {showPlaceholder ? (
                      <div className="post-media-empty">
                        <I n="camera" />
                        <small>Photo coming soon</small>
                      </div>
                    ) : (
                      <img
                        src={post.image}
                        alt={post.caption}
                        onError={() =>
                          setBrokenImages((current) =>
                            current.includes(index) ? current : [...current, index],
                          )
                        }
                      />
                    )}
                    {burstFor === index && (
                      <span className="like-burst" aria-hidden="true">
                        <I n="heart" on />
                      </span>
                    )}
                  </div>
                  <div className="post-actions">
                    <div>
                      <button
                        onClick={() => toggle(index, setLiked)}
                        aria-label={isLiked ? "Unlike" : "Like"}
                      >
                        <I n="heart" on={isLiked} />
                      </button>
                      <button
                        onClick={() =>
                          setCommentingFor(commentingFor === index ? null : index)
                        }
                        aria-label="Comment"
                      >
                        <I n="message" />
                      </button>
                      <button onClick={() => void sharePost()} aria-label="Share post">
                        <I n="send" />
                      </button>
                    </div>
                    <button
                      onClick={() => toggle(index, setSaved)}
                      aria-label={isSaved ? "Remove from saved" : "Save post"}
                    >
                      <I n="mark" on={isSaved} />
                    </button>
                  </div>
                  {/* Like counts stay hidden on posts: the heart still fills and
                      bursts, but no "0 likes" line is displayed. */}
                  <p className="post-caption">
                    <b>riteshyadav</b> {post.caption}
                  </p>
                  {comments.length > 0 && (
                    <div className="post-comments">
                      {comments.map((comment, commentIndex) => (
                        <p key={commentIndex}>
                          <b>{comment.author}</b> {comment.text}
                        </p>
                      ))}
                    </div>
                  )}
                  <small className="post-time">{post.time}</small>
                  {commentingFor === index && (                      <form
                        className="post-add-comment"
                        onSubmit={(event) => {
                          event.preventDefault();
                          submitComment(index);
                        }}
                      >
                      <input
                        value={commentDraft}
                        onChange={(event) => setCommentDraft(event.target.value)}
                        placeholder="Add a comment..."
                        aria-label="Add a comment"
                        autoFocus
                      />
                      <JellyExploreButton color="var(--blue)" width={84} height={34} fontSize={12} onClick={() => submitComment(index)}>Post</JellyExploreButton>
                    </form>
                  )}
                </article>
              );
            })}
          </div>
          <button
            className="post-viewer-close"
            onClick={() => closeViewerSmoothly("post")}
            aria-label="Close posts"
          >
            ×
          </button>
        </div>
      )}
      {notice && <div className="toast">{notice}</div>}

      {ritbotBubble && !chatOpen && (
        <div className={`ritbot-bubble ritbot-bubble-${ritbotBubble.mood}`} role="status">
          {ritbotBubble.line}
        </div>
      )}

      {chatOpen && (
        <section className="chatbot" role="dialog" aria-label="Chat with Ritbot">
          <header className="chatbot-head">
            <span className="chatbot-id">
              <button
                type="button"
                className="chatbot-face"
                onClick={() => handleFabClick(false)}
                aria-label="Poke Ritbot"
              >
                <RitbotFace
                  mood={
                    ritbotMood === "thinking"
                      ? "thinking"
                      : chatTyping
                        ? "typing"
                        : ritbotMood
                  }
                  size={34}
                />
              </button>
              <b>
                Ritbot
                <small>Ask me about Ritesh</small>
              </b>
            </span>
            <button onClick={closeChat} aria-label="Close chat">
              ×
            </button>
          </header>
          <div className="chatbot-log" ref={chatLogRef}>
            {chatMessages.map((message, index) => (
              <div className={`chat-msg ${message.from}`} key={`${message.from}-${index}`}>
                {message.from === "bot" ? (
                  <>
                    <p>
                      <RichText text={message.text} />
                    </p>
                    {index === chatMessages.length - 1 && activeFollowups.length > 0 && (
                      <div className="chat-chips">
                        {activeFollowups.map((chip) => (
                          <JellyExploreButton
                            key={chip}
                            color="#0a0a0a"
                            width={Math.max(120, 13 + chip.length * 7.4)}
                            height={38}
                            fontSize={13}
                            onClick={() => askFromChip(chip)}
                          >
                            {chip}
                          </JellyExploreButton>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p>{message.text}</p>
                )}
              </div>
            ))}
            {chatTyping && (
              <div className="chat-msg bot typing" aria-label="Ritesh-bot is typing">
                <p>
                  <i />
                  <i />
                  <i />
                </p>
              </div>
            )}
          </div>
          <form className="chatbot-input" onSubmit={sendChat}>
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="ask about Ritesh..."
              aria-label="Ask Ritesh-bot about Ritesh"
            />
            <button type="submit" aria-label="Send question">
              <I n="send" />
            </button>
          </form>
        </section>
      )}
      {!chatOpen && (
        <button
          className={`chatbot-fab${ritbotPeeking ? " peeking" : ""} ritbot-fab-${ritbotBrain.mood}${ritbotSecret ? " ritbot-glitch" : ""}`}
          onClick={() => handleFabClick(true)}
          onMouseEnter={() => setFabHovering(true)}
          onMouseLeave={() => setFabHovering(false)}
          aria-label="Chat with Ritbot"
          style={{
            "--look-x": `${ritbotBrain.lookX}px`,
            "--look-y": `${ritbotBrain.lookY}px`,
          } as React.CSSProperties}
        >
          <RitbotFace mood={ritbotBrain.mood} size={40} />
          <span className="chatbot-fab-label">Ritbot</span>
        </button>
      )}

      <EggHint
        open={eggHintOpen}
        onToggle={() => setEggHintOpen((value) => !value)}
        found={eggsFound}
        onTerminal={openTerminal}
      />
      <KonamiOverlay open={konamiOpen} onClose={() => setKonamiOpen(false)} />
      <TerminalOverlay
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onEggCommand={(command) => {
          if (chatOpen) return;
          setRitbotMood(command === "coffee" ? "excited" : "surprised");
          ritbotSay(
            command === "coffee"
              ? "Coffee detected. Energy levels nominal."
              : "You rang? I live here, you know.",
            command === "coffee" ? "excited" : "surprised",
            `terminal:${command}`,
          );
          window.setTimeout(() => setRitbotMood("idle"), 2400);
        }}
      />
    </main>
  );
}
