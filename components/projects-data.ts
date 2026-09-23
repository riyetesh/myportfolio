// Project data for the Projects reel and case-study viewer. Every line here is
// grounded in what the portfolio already says (posts, stories, highlights):
// no invented metrics, no fabricated outcomes, no em dashes per site copy.

export type ProjectStage = {
  name: string;
  index: string;
  copy: string;
  points: string[];
};

export type Project = {
  key: string;
  title: string;
  category: string;
  tagline: string;
  role: string;
  problem: string;
  contribution: string;
  technologies: string[];
  outcome: string;
  live?: { label: string; href: string };
  accent: string;
  stageA: string;
  stageB: string;
  stages: ProjectStage[];
  designed: string[];
  developed: string[];
  researched: string[];
  managed: string[];
  techDepth: { label: string; detail: string }[];
  learned: string;
  change: string;
  next: string;
};

// Stage copy stays close to the site's existing wording (stories, captions,
// About section) so nothing here claims more than the portfolio does.
export const PROJECTS: Project[] = [
  {
    key: "hellodoc",
    title: "helloDoc",
    category: "AI Healthcare Platform",
    tagline: "Doctors, patients and predictions in one place.",
    role: "Developer",
    problem:
      "Patients struggle to reach the right doctor, and early disease signals go unnoticed.",
    contribution: "Platform build · AI disease prediction · Prescription flow",
    technologies: ["React", "Node.js", "Python", "MySQL"],
    outcome: "A working platform where doctors connect with patients, predict diseases and prescribe medication.",
    live: { label: "Live app", href: "https://hellodoc-lfx5.onrender.com/" },
    accent: "#3344cd",
    stageA: "Interface fragments",
    stageB: "Model pipeline",
    stages: [
      {
        name: "The Problem",
        index: "01",
        copy: "Healthcare access breaks at the first step: finding the right doctor at the right time.",
        points: [
          "Patients have no single place to reach doctors.",
          "Early disease signals rely on memory, not data.",
          "Prescriptions and history live in separate worlds.",
        ],
      },
      {
        name: "Research",
        index: "02",
        copy: "Mapped how patients and doctors actually find each other and where the flow fails.",
        points: [
          "Traced the patient journey from symptom to prescription.",
          "Studied where AI prediction genuinely helps triage.",
        ],
      },
      {
        name: "Ideation",
        index: "03",
        copy: "One platform holding the whole loop: connect, predict, prescribe.",
        points: [
          "Doctor discovery as the core surface.",
          "Prediction as a quiet assistant, not a gatekeeper.",
        ],
      },
      {
        name: "Design",
        index: "04",
        copy: "Interfaces designed around the shortest path from question to answer.",
        points: [
          "Patient and doctor views kept visually distinct.",
          "Prediction results presented with context, not alarm.",
        ],
      },
      {
        name: "Development",
        index: "05",
        copy: "Built the platform end to end, from auth to the prediction pipeline.",
        points: [
          "Frontend in React, services in Node.js.",
          "Model inference served through the backend.",
        ],
      },
      {
        name: "My Contribution",
        index: "06",
        copy: "I developed the platform and wired the AI prediction into the prescription flow.",
        points: [
          "Designed the data flow between modules.",
          "Implemented the disease prediction interface.",
          "Connected prescriptions to patient history.",
        ],
      },
      {
        name: "Result",
        index: "07",
        copy: "A deployed platform where doctors connect with patients, predict diseases and prescribe medication.",
        points: [
          "Live and reachable at the hosted app.",
          "The full connect, predict, prescribe loop in one place.",
        ],
      },
    ],
    designed: ["Interface structure", "Prediction result views", "Doctor and patient flows"],
    developed: ["Web platform", "AI disease prediction", "Prescription flow"],
    researched: ["Patient and doctor journeys", "AI triage patterns"],
    managed: ["Feature scope", "Deployment pipeline"],
    techDepth: [
      { label: "Architecture", detail: "React frontend with a Node.js service layer; model inference behind the API." },
      { label: "Backend", detail: "Node.js services handle auth, scheduling and the prescription records." },
      { label: "Database", detail: "MySQL holds patients, doctors, predictions and prescriptions." },
      { label: "Key decision", detail: "Prediction runs server-side so the model can improve without frontend changes." },
      { label: "Deployment", detail: "Hosted on Render, reachable from the live link." },
    ],
    learned: "Healthcare UX is mostly about trust: people read every label before they act.",
    change: "I would add doctor-side analytics earlier; it shapes the prediction feedback loop.",
    next: "A symptom history view so predictions improve from real longitudinal data.",
  },
  {
    key: "therapeace",
    title: "Therapeace",
    category: "Digital Well-being Platform",
    tagline: "Calm, co-founded and co-built.",
    role: "Co-founder · CTO",
    problem:
      "Everyday mental wellness support is fragmented and rarely feels approachable.",
    contribution: "Product architecture · UX · Web development",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    outcome: "A working digital mental-wellness platform concept with a clickable prototype.",
    live: { label: "Prototype", href: "https://www.figma.com/proto/r5KpwegP4RYtRIqwgdcT7N/Therapeace" },
    accent: "#2e9e6b",
    stageA: "Product interface",
    stageB: "Flow map",
    stages: [
      {
        name: "The Problem",
        index: "01",
        copy: "Mental wellness tools feel clinical when they should feel human.",
        points: [
          "Support is scattered across apps that don't talk.",
          "The tone of most products adds pressure instead of calm.",
        ],
      },
      {
        name: "Research",
        index: "02",
        copy: "Researched how people actually build and keep small daily habits.",
        points: [
          "Interviews and desk research on digital well-being workflows.",
          "Looked for where existing products lose people.",
        ],
      },
      {
        name: "Ideation",
        index: "03",
        copy: "A calm platform where mindfulness fits into an ordinary day.",
        points: [
          "Small sessions over long programmes.",
          "Progress framed gently, never gamified into guilt.",
        ],
      },
      {
        name: "Design",
        index: "04",
        copy: "Designed the UX and interface structure, from flows to screens.",
        points: [
          "User flows mapped end to end in Figma.",
          "A soft, quiet visual system to match the product's purpose.",
        ],
      },
      {
        name: "Development",
        index: "05",
        copy: "Built the web platform on a modern React stack.",
        points: [
          "Next.js with TypeScript for the app shell.",
          "Tailwind CSS for a consistent, calm design language.",
        ],
      },
      {
        name: "My Contribution",
        index: "06",
        copy: "As co-founder and CTO I owned the product architecture, UX and the web build.",
        points: [
          "Product architecture and technical decisions.",
          "UX and interface structure.",
          "Web development of the platform.",
        ],
      },
      {
        name: "Result",
        index: "07",
        copy: "A working digital mental-wellness platform concept, demonstrated through a clickable prototype.",
        points: [
          "The prototype walks the core mindfulness flow start to finish.",
          "Product direction validated with early users.",
        ],
      },
    ],
    designed: ["Product UX", "Interface structure", "User flows"],
    developed: ["Web platform", "Frontend architecture", "Interactive components"],
    researched: ["User needs", "Digital mental-wellness workflows"],
    managed: ["Product direction", "Technical decisions"],
    techDepth: [
      { label: "Frontend", detail: "Next.js app with TypeScript throughout; Tailwind for the design system." },
      { label: "Prototype", detail: "The Figma prototype mirrors the production flow one to one, so design decisions survived into code." },
      { label: "Key decision", detail: "Prototype-first: the clickable prototype was the test bed for every flow before the build." },
      { label: "Trade-off", detail: "Shipped the concept as a prototype to validate direction before committing to backend scope." },
    ],
    learned: "Tone is a technical feature. The calmest product wins because it lowers the cost of showing up.",
    change: "I would test the onboarding with more first-time users of wellness apps.",
    next: "Native-language sessions so support reaches people where they think.",
  },
  {
    key: "attendsure",
    title: "Attendsure",
    category: "Computer Vision System",
    tagline: "Attendance that runs where the hardware is modest.",
    role: "Developer",
    problem:
      "Attendance capture is slow and error-prone, and most vision systems assume expensive hardware.",
    contribution: "Recognition pipeline · Expression analysis · Optimization",
    technologies: ["Python", "OpenCV", "TensorFlow"],
    outcome: "Facial-recognition attendance with expression analysis, running on low-end hardware.",
    live: { label: "Source", href: "https://github.com/riyetesh/Attendsure" },
    accent: "#c2840a",
    stageA: "Recognition frame",
    stageB: "Dashboard",
    stages: [
      {
        name: "The Problem",
        index: "01",
        copy: "Roll-call wastes class time, and accurate vision systems usually demand hardware classrooms don't have.",
        points: [
          "Manual attendance costs minutes every session.",
          "Cloud vision pipelines fail on low-end machines.",
        ],
      },
      {
        name: "Research",
        index: "02",
        copy: "Studied lightweight recognition models and where expression signals add value.",
        points: [
          "Benchmarked recognition accuracy against inference cost.",
          "Explored expression analysis as a learning signal.",
        ],
      },
      {
        name: "Ideation",
        index: "03",
        copy: "Recognition and engagement in one pass, sized for modest hardware.",
        points: [
          "Single camera frame serves both attendance and expression.",
          "Local-first processing to survive weak connectivity.",
        ],
      },
      {
        name: "Design",
        index: "04",
        copy: "A dashboard that makes the system's decisions visible and correctable.",
        points: [
          "Recognition results shown with confidence context.",
          "Manual override built into the flow.",
        ],
      },
      {
        name: "Development",
        index: "05",
        copy: "Built the recognition pipeline and the analysis layer in Python.",
        points: [
          "OpenCV for capture and face handling.",
          "TensorFlow for expression classification.",
        ],
      },
      {
        name: "My Contribution",
        index: "06",
        copy: "I built the recognition pipeline, tuned it for low-end hardware and added expression analysis.",
        points: [
          "Recognition pipeline end to end.",
          "Optimization passes for modest hardware.",
          "Facial-expression analysis for better learning.",
        ],
      },
      {
        name: "Result",
        index: "07",
        copy: "Facial-recognition attendance that runs on low-end hardware, with expression analysis for better learning.",
        points: [
          "Source available on GitHub.",
          "Runs where more complex systems stall.",
        ],
      },
    ],
    designed: ["Dashboard layout", "Correction flow"],
    developed: ["Recognition pipeline", "Expression analysis", "Performance optimization"],
    researched: ["Lightweight vision models", "Inference cost trade-offs"],
    managed: ["Scope", "Hardware constraints"],
    techDepth: [
      { label: "Stack", detail: "Python, OpenCV for capture and detection, TensorFlow for expression classification." },
      { label: "Optimization", detail: "Frame sampling and model sizing chosen to hold real-time behavior on low-end CPUs." },
      { label: "Challenge", detail: "Keeping recognition accuracy while trimming inference cost was the core trade-off." },
      { label: "Deployment", detail: "Runs locally; no cloud dependency in the recognition path." },
    ],
    learned: "Constraints are a design tool: the hardware budget made every architectural choice clearer.",
    change: "I would add a proper evaluation set so accuracy claims are measurable, not anecdotal.",
    next: "An on-device retraining loop that adapts to changing lighting conditions.",
  },
  {
    key: "connectogram",
    title: "Connectogram",
    category: "Social Platform",
    tagline: "Social connection built around challenges.",
    role: "Developer",
    problem:
      "Social platforms connect people passively; shared challenges create active connection.",
    contribution: "Full-stack build · Shipping end to end",
    technologies: ["React", "Node.js", "MySQL"],
    outcome: "A challenge-based social platform built and shipped end to end.",
    stageA: "Feed interface",
    stageB: "Challenge board",
    accent: "#7a4dcf",
    stages: [
      {
        name: "The Problem",
        index: "01",
        copy: "Feeds breed spectators. Challenges turn an audience into participants.",
        points: [
          "Passive scrolling doesn't create connection.",
          "Shared goals do, but no product was built around them.",
        ],
      },
      {
        name: "Research",
        index: "02",
        copy: "Looked at how challenge communities form and sustain themselves.",
        points: [
          "Studied what makes people return to a challenge.",
          "Mapped the lifecycle from join to finish.",
        ],
      },
      {
        name: "Ideation",
        index: "03",
        copy: "A social platform where the challenge is the content.",
        points: [
          "Challenges as first-class objects, not hashtags.",
          "Progress visible to the people you actually know.",
        ],
      },
      {
        name: "Design",
        index: "04",
        copy: "Interface built around momentum: start, keep going, finish together.",
        points: [
          "Challenge board as the home surface.",
          "Progress updates designed to be quick.",
        ],
      },
      {
        name: "Development",
        index: "05",
        copy: "Built and shipped the platform end to end, solo.",
        points: [
          "React frontend, Node.js services.",
          "MySQL for users, challenges and progress.",
        ],
      },
      {
        name: "My Contribution",
        index: "06",
        copy: "I designed and built the whole platform and shipped it, from schema to interface.",
        points: [
          "Data model and API design.",
          "Frontend and backend implementation.",
          "Deployment and shipping.",
        ],
      },
      {
        name: "Result",
        index: "07",
        copy: "A challenge-based social platform, built and shipped end to end.",
        points: [
          "Working product, not a demo.",
          "Every layer of the stack touched personally.",
        ],
      },
    ],
    designed: ["Challenge board", "Progress flows"],
    developed: ["Full-stack platform", "API and data model", "Deployment"],
    researched: ["Challenge community patterns"],
    managed: ["Scope", "Shipping"],
    techDepth: [
      { label: "Architecture", detail: "React client with Node.js services; MySQL for relational challenge and user data." },
      { label: "Data model", detail: "Challenges, participants and progress modeled relationally for consistent state." },
      { label: "Challenge", detail: "Keeping challenge state consistent across concurrent participants drove most design decisions." },
      { label: "Trade-off", detail: "Chose relational integrity over flexible NoSQL because challenges are transactional by nature." },
    ],
    learned: "Shipping alone teaches the whole stack at once, including the parts nobody applauds.",
    change: "I would add notifications earlier; challenges live or die on momentum.",
    next: "Team challenges with shared streaks to deepen the social loop.",
  },
  {
    key: "gadgetmart",
    title: "Gadget Mart",
    category: "Client Development",
    tagline: "Eight-plus client projects, shipped part-time.",
    role: "Part-time Software Developer",
    problem:
      "A retail business needed working software delivered alongside a real schedule.",
    contribution: "Client software · Multiple deliveries",
    technologies: ["JavaScript", "Node.js", "SQL"],
    outcome: "8+ client software projects shipped as a part-time developer.",
    stageA: "Storefront",
    stageB: "Internal tools",
    accent: "#0a7ea4",
    stages: [
      {
        name: "The Problem",
        index: "01",
        copy: "Client work at a real business has real constraints: time, money and expectations.",
        points: [
          "Each project needed to ship, not demo.",
          "Part-time hours demanded ruthless scope control.",
        ],
      },
      {
        name: "Research",
        index: "02",
        copy: "Every project started with the client's actual workflow.",
        points: [
          "Watched how staff used existing tools.",
          "Let the workflow, not preferences, drive the build.",
        ],
      },
      {
        name: "Ideation",
        index: "03",
        copy: "Small, correct tools that slot into how the business already runs.",
        points: [
          "Ship the smallest useful version first.",
          "Iterate against real usage.",
        ],
      },
      {
        name: "Design",
        index: "04",
        copy: "Practical interfaces for people whose job is not the software.",
        points: [
          "Fewer clicks over clever features.",
          "Errors made obvious and recoverable.",
        ],
      },
      {
        name: "Development",
        index: "05",
        copy: "Eight-plus projects across the stack, delivered one after another.",
        points: [
          "JavaScript and Node.js services.",
          "SQL-backed data for every tool.",
        ],
      },
      {
        name: "My Contribution",
        index: "06",
        copy: "I developed and shipped 8+ client software projects while studying part-time.",
        points: [
          "Requirements gathering directly with the client.",
          "Implementation and delivery.",
          "Support and iteration after launch.",
        ],
      },
      {
        name: "Result",
        index: "07",
        copy: "8+ shipped client software projects, delivered alongside full-time study.",
        points: [
          "Tools still in use after delivery.",
          "A habit of finishing what starts.",
        ],
      },
    ],
    designed: ["Practical interfaces", "Workflow-fit tools"],
    developed: ["8+ client projects", "JavaScript and Node.js tools", "SQL data layers"],
    researched: ["Client workflows"],
    managed: ["Scope and deadlines", "Client expectations"],
    techDepth: [
      { label: "Stack", detail: "JavaScript, Node.js and SQL across the client projects; scope varied per delivery." },
      { label: "Process", detail: "Each project followed gather, build, deliver, iterate, with usage feedback from staff." },
      { label: "Challenge", detail: "Part-time hours forced small, correct increments; large rewrites were never affordable." },
      { label: "Trade-off", detail: "Optimized for maintainability over elegance so tools could be revisited months later." },
    ],
    learned: "Client work teaches listening: the requirement stated is rarely the requirement meant.",
    change: "I would document each delivery more; future me paid a tax for that.",
    next: "A small shared component library to speed up the next eight.",
  },
];
