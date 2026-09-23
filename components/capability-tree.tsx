"use client";

// The Capability Tree: Ritesh's skills as a living digital tree. Root, five
// branches (Product, Design, Technology, Data, Research), leaves as skills.
// Grows when scrolled into view, brightens a branch on hover, and on click
// shows the evidence: which real projects used that skill. Scoped CSS only.

import { useEffect, useMemo, useRef, useState } from "react";

type Leaf = {
  id: string;
  label: string;
  x: number;
  y: number;
  usedFor: string[];
  projects: { title: string; note: string }[];
};

type Branch = {
  id: string;
  name: string;
  path: string;
  side: "left" | "right" | "center";
  leaves: Leaf[];
};

// Coordinates live in a 900x520 viewBox. Paths curve organically from the
// trunk crown (450, 320) outward; leaves sit along each curve.
const BRANCHES: Branch[] = [
  {
    id: "product",
    name: "Product",
    side: "left",
    path: "M450 330 C 400 320, 330 300, 285 250 S 210 170, 175 150",
    leaves: [
      {
        id: "product-development",
        label: "Product Development",
        x: 380,
        y: 312,
        usedFor: ["Turning ideas into shipped software", "Scoping what to build first"],
        projects: [
          { title: "Therapeace", note: "Product direction and architecture as co-founder" },
          { title: "helloDoc", note: "Platform scoped and shipped end to end" },
        ],
      },
      {
        id: "product-strategy",
        label: "Product Strategy",
        x: 322,
        y: 282,
        usedFor: ["Deciding what not to build", "Prototype-first validation"],
        projects: [{ title: "Therapeace", note: "Clickable prototype validated direction before backend scope" }],
      },
      {
        id: "problem-solving",
        label: "Problem Solving",
        x: 252,
        y: 236,
        usedFor: ["Breaking vague asks into buildable pieces"],
        projects: [{ title: "Gadget Mart", note: "8+ client projects scoped from real workflows" }],
      },
      {
        id: "tech-innovation",
        label: "Technology Innovation",
        x: 196,
        y: 186,
        usedFor: ["Applying new tools where they earn their keep"],
        projects: [{ title: "Attendsure", note: "Vision attendance sized for low-end hardware" }],
      },
    ],
  },
  {
    id: "design",
    name: "Design",
    side: "left",
    path: "M450 300 C 420 270, 370 220, 345 165 S 320 95, 305 78",
    leaves: [
      {
        id: "ux-ui",
        label: "UX / UI",
        x: 428,
        y: 282,
        usedFor: ["Interfaces around the shortest path", "Calm, readable product tone"],
        projects: [
          { title: "Therapeace", note: "UX and interface structure" },
          { title: "Attendsure", note: "Dashboard with confidence context and override" },
        ],
      },
      {
        id: "figma",
        label: "Figma",
        x: 386,
        y: 238,
        usedFor: ["Flows, wireframes, clickable prototypes"],
        projects: [{ title: "Therapeace", note: "Prototype mirroring the production flow one to one" }],
      },
      {
        id: "prototyping",
        label: "Prototyping",
        x: 356,
        y: 182,
        usedFor: ["Testing flows before committing to code"],
        projects: [{ title: "Therapeace", note: "The prototype was the test bed for every flow" }],
      },
      {
        id: "interaction-design",
        label: "Interaction Design",
        x: 332,
        y: 132,
        usedFor: ["Momentum, feedback and correction flows"],
        projects: [{ title: "Connectogram", note: "Challenge board built around momentum" }],
      },
      {
        id: "design-systems",
        label: "Design Systems",
        x: 312,
        y: 88,
        usedFor: ["Consistent, calm visual language"],
        projects: [{ title: "Therapeace", note: "A soft, quiet system matching the product's purpose" }],
      },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    side: "center",
    path: "M450 320 C 448 260, 446 190, 448 120 S 450 70, 452 56",
    leaves: [
      {
        id: "python",
        label: "Python",
        x: 436,
        y: 268,
        usedFor: ["Data analytics", "Machine learning", "Automation", "Project development"],
        projects: [
          { title: "Attendsure", note: "Recognition pipeline and expression analysis" },
          { title: "helloDoc", note: "AI disease prediction" },
        ],
      },
      {
        id: "javascript-typescript",
        label: "JavaScript / TypeScript",
        x: 444,
        y: 206,
        usedFor: ["Web frontends and services"],
        projects: [
          { title: "Gadget Mart", note: "JavaScript tools across client deliveries" },
          { title: "Therapeace", note: "Next.js app in TypeScript" },
        ],
      },
      {
        id: "react",
        label: "React",
        x: 452,
        y: 152,
        usedFor: ["Component-driven frontends"],
        projects: [
          { title: "helloDoc", note: "Patient and doctor interfaces" },
          { title: "Connectogram", note: "Challenge board frontend" },
        ],
      },
      {
        id: "node",
        label: "Node.js",
        x: 447,
        y: 102,
        usedFor: ["Services, APIs and the glue between them"],
        projects: [
          { title: "helloDoc", note: "Auth, scheduling, prescriptions" },
          { title: "Connectogram", note: "Challenge services" },
        ],
      },
      {
        id: "aws-linux",
        label: "AWS · Linux",
        x: 453,
        y: 58,
        usedFor: ["Deployment and systems administration"],
        projects: [{ title: "Gadget Mart", note: "Deployment and support after launch" }],
      },
    ],
  },
  {
    id: "data",
    name: "Data",
    side: "right",
    path: "M450 300 C 480 270, 530 220, 555 165 S 580 95, 595 78",
    leaves: [
      {
        id: "data-analytics",
        label: "Data Analytics",
        x: 472,
        y: 282,
        usedFor: ["Reading real workflows through numbers"],
        projects: [{ title: "Gadget Mart", note: "SQL data layers behind every client tool" }],
      },
      {
        id: "sql",
        label: "SQL",
        x: 514,
        y: 238,
        usedFor: ["Relational modeling that keeps state honest"],
        projects: [
          { title: "helloDoc", note: "MySQL for patients, predictions, prescriptions" },
          { title: "Connectogram", note: "Relational challenge and user data" },
        ],
      },
      {
        id: "visualization",
        label: "Visualization",
        x: 544,
        y: 182,
        usedFor: ["Making the system's decisions visible"],
        projects: [{ title: "Attendsure", note: "Recognition dashboard" }],
      },
      {
        id: "machine-learning",
        label: "Machine Learning",
        x: 568,
        y: 132,
        usedFor: ["Models that help quietly, not gatekeep"],
        projects: [
          { title: "Attendsure", note: "TensorFlow expression classification" },
          { title: "helloDoc", note: "Disease prediction" },
        ],
      },
      {
        id: "opencv",
        label: "OpenCV",
        x: 588,
        y: 88,
        usedFor: ["Capture, detection and face handling"],
        projects: [{ title: "Attendsure", note: "The whole recognition path" }],
      },
    ],
  },
  {
    id: "research",
    name: "Research",
    side: "right",
    path: "M450 330 C 500 320, 570 300, 615 250 S 690 170, 725 150",
    leaves: [
      {
        id: "user-research",
        label: "User Research",
        x: 520,
        y: 312,
        usedFor: ["Watching how people actually work"],
        projects: [{ title: "Gadget Mart", note: "Staff workflows drove every build" }],
      },
      {
        id: "ux-research",
        label: "UX Research",
        x: 578,
        y: 282,
        usedFor: ["Interviews and desk research on real habits"],
        projects: [{ title: "Therapeace", note: "How people build and keep small habits" }],
      },
      {
        id: "digital-health",
        label: "Digital Health",
        x: 648,
        y: 236,
        usedFor: ["Where software meets care"],
        projects: [
          { title: "Therapeace", note: "Mental well-being platform" },
          { title: "helloDoc", note: "Doctor, patient, prediction loop" },
        ],
      },
      {
        id: "academic-research",
        label: "Academic Research",
        x: 704,
        y: 186,
        usedFor: ["MSc in ICT, data analytics major"],
        projects: [{ title: "Attendsure", note: "Benchmarked accuracy against inference cost" }],
      },
    ],
  },
];

const TOTAL_LEAVES = BRANCHES.reduce((sum, branch) => sum + branch.leaves.length, 0);

export function CapabilityTree() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const rootRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const activeLeaf = useMemo(() => {
    const id = hovered ?? pinned;
    for (const branch of BRANCHES) {
      const leaf = branch.leaves.find((item) => item.id === id);
      if (leaf) return { leaf, branch };
    }
    return null;
  }, [hovered, pinned]);

  const branchOf = (id: string | null) => {
    if (!id) return null;
    if (BRANCHES.some((branch) => branch.id === id)) return id;
    for (const branch of BRANCHES) {
      if (branch.leaves.some((leaf) => leaf.id === id)) return branch.id;
    }
    return null;
  };

  const activeBranch = branchOf(hovered ?? pinned);

  // Cursor-follow glow inside the tree, written straight to the SVG for zero
  // re-renders while the mouse moves.
  const moveGlow = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.pointerType !== "mouse") return;
    const svg = rootRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    svg.style.setProperty("--gx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    svg.style.setProperty("--gy", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <section
      ref={sectionRef}
      className={`ctree-root${visible ? " grown" : ""}`}
      aria-label="Capability tree"
    >
      <style>{CTREE_CSS}</style>
      <div className="ctree-head">
        <p className="eyebrow">Capability Tree</p>
        <h2>One root, five branches, every leaf shipped somewhere.</h2>
        <p className="ctree-lede">
          Hover a leaf to see where a skill is used. Click it to see the projects that prove it.
        </p>
      </div>

      <div className="ctree-stage">
        <svg
          ref={rootRef}
          viewBox="0 0 900 520"
          className="ctree-svg"
          onPointerMove={moveGlow}
          role="img"
          aria-label="Tree of Ritesh's skills connected to real projects"
        >
          <defs>
            <linearGradient id="ctree-trunk" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#4a3b2a" />
              <stop offset="100%" stopColor="#6b5638" />
            </linearGradient>
          </defs>

          {/* ground + particles */}
          <ellipse className="ctree-ground" cx="450" cy="492" rx="190" ry="14" />
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} className={`ctree-mote ctree-mote-${i % 3}`} cx={170 + i * 70} cy={470 - (i % 3) * 26} r={2 + (i % 2)} />
          ))}

          {/* trunk */}
          <path
            className="ctree-trunk"
            d="M450 490 C 444 430, 452 380, 450 330 C 448 300, 450 280, 450 262"
            fill="none"
            stroke="url(#ctree-trunk)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            className="ctree-root-flare"
            d="M450 490 C 436 486, 418 480, 404 470 M450 490 C 464 486, 482 480, 496 470"
            fill="none"
            stroke="#4a3b2a"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* branches + leaves */}
          {BRANCHES.map((branch, branchIndex) => {
            const dim = activeBranch !== null && activeBranch !== branch.id;
            return (
              <g
                key={branch.id}
                className={`ctree-branch${dim ? " dimmed" : ""}${activeBranch === branch.id ? " lit" : ""}`}
                style={{ "--bi": branchIndex } as React.CSSProperties}
              >
                <path
                  className="ctree-branch-path"
                  d={branch.path}
                  fill="none"
                  stroke="#6b5638"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {branch.leaves.map((leaf, leafIndex) => {
                  const isActive = (hovered ?? pinned) === leaf.id;
                  return (
                    <g
                      key={leaf.id}
                      className={`ctree-leaf${isActive ? " active" : ""}`}
                      style={{ "--li": branchIndex * 2 + leafIndex } as React.CSSProperties}
                      transform={`translate(${leaf.x} ${leaf.y})`}
                      onPointerEnter={() => setHovered(leaf.id)}
                      onPointerLeave={() => setHovered(null)}
                      onClick={() => setPinned((current) => (current === leaf.id ? null : leaf.id))}
                      role="button"
                      tabIndex={0}
                      aria-label={`${leaf.label}. Used for ${leaf.usedFor.join(", ")}`}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setPinned((current) => (current === leaf.id ? null : leaf.id));
                        }
                      }}
                    >
                      <circle className="ctree-leaf-hit" r="17" />
                      <path
                        className="ctree-leaf-shape"
                        d="M0 -9 C 7 -6, 9 2, 0 10 C -9 2, -7 -6, 0 -9 Z"
                        transform={`rotate(${(leafIndex % 2 === 0 ? -35 : 35) + branchIndex * 14})`}
                      />
                      <circle className="ctree-leaf-core" r="2.4" />
                      <text className="ctree-leaf-label" x="0" y="26" textAnchor="middle">
                        {leaf.label}
                      </text>
                    </g>
                  );
                })}
                <text
                  className="ctree-branch-name"
                  x={branch.side === "left" ? 168 : branch.side === "right" ? 732 : 452}
                  y={branch.side === "center" ? 26 : 118}
                  textAnchor="middle"
                >
                  {branch.name.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* the root itself */}
          <g className="ctree-root-label">
            <circle cx="450" cy="462" r="17" />
            <text x="450" y="467" textAnchor="middle">R</text>
          </g>
        </svg>

        {/* evidence panel */}
        <aside className={`ctree-panel${activeLeaf ? " open" : ""}`} aria-live="polite">
          {activeLeaf ? (
            <>
              <small style={{ color: "var(--ctree-accent)" }}>{activeLeaf.branch.name} branch</small>
              <h3>{activeLeaf.leaf.label}</h3>
              <p className="ctree-panel-sub">Used for</p>
              <ul>
                {activeLeaf.leaf.usedFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="ctree-panel-sub">Projects where it shows up</p>
              <ul className="ctree-evidence">
                {activeLeaf.leaf.projects.map((project) => (
                  <li key={project.title}>
                    <b>{project.title}</b>
                    <span>{project.note}</span>
                  </li>
                ))}
              </ul>
              {pinned && (
                <button className="ctree-unpin" onClick={() => setPinned(null)}>
                  Close evidence
                </button>
              )}
            </>
          ) : (
            <p className="ctree-panel-empty">
              {TOTAL_LEAVES} skills on {BRANCHES.length} branches. Every leaf links to work, not claims.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}

const CTREE_CSS = `
.ctree-root {
  --ctree-accent: #2e7d4f;
  padding: 34px 20px 22px; border-top: 1px solid var(--line); margin-top: 30px;
}
.ctree-head h2 { margin: 4px 0 6px; font-size: 1.4rem; letter-spacing: -0.02em; }
.ctree-lede { color: #666; font-size: 0.84rem; margin: 0 0 10px; }
.ctree-stage { display: grid; gap: 12px; grid-template-columns: minmax(0, 1fr); align-items: start; }
.ctree-svg { width: 100%; height: auto; display: block; --gx: 50%; --gy: 40%; }

.ctree-ground { fill: #e9e5dc; opacity: 0; transition: opacity 900ms 200ms; }
.grown .ctree-ground { opacity: 1; }

.ctree-trunk { stroke-dasharray: 480; stroke-dashoffset: 480; transition: stroke-dashoffset 1400ms cubic-bezier(0.4, 0, 0.2, 1) 150ms; }
.grown .ctree-trunk { stroke-dashoffset: 0; }
.ctree-root-flare { opacity: 0; transition: opacity 700ms 900ms; }
.grown .ctree-root-flare { opacity: 1; }

.ctree-branch-path { stroke-dasharray: 420; stroke-dashoffset: 420; transition: stroke-dashoffset 1200ms cubic-bezier(0.4, 0, 0.2, 1); transition-delay: calc(650ms + var(--bi) * 160ms); }
.grown .ctree-branch-path { stroke-dashoffset: 0; }
.ctree-branch-name { font-size: 11px; font-weight: 800; letter-spacing: 0.16em; fill: #9a938a; opacity: 0; transition: opacity 700ms calc(1200ms + var(--bi) * 160ms); }
.grown .ctree-branch-name { opacity: 1; }

.ctree-leaf { cursor: pointer; outline: none; }
.ctree-leaf-shape { fill: #7fc08f; stroke: #4e8a5f; stroke-width: 1; opacity: 0; transform: scale(0.2); transform-box: fill-box; transform-origin: center; transition: opacity 500ms, transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1), fill 250ms, stroke 250ms; transition-delay: calc(1250ms + var(--li) * 110ms), calc(1250ms + var(--li) * 110ms), 0ms, 0ms; }
.grown .ctree-leaf-shape { opacity: 0.92; transform: scale(1); }
.ctree-leaf-core { fill: #2e7d4f; opacity: 0; transition: opacity 400ms calc(1400ms + var(--li) * 110ms); }
.grown .ctree-leaf-core { opacity: 0.7; }
.ctree-leaf-hit { fill: transparent; }
.ctree-leaf-label { font-size: 10.5px; font-weight: 600; fill: #555; opacity: 0; transition: opacity 600ms calc(1500ms + var(--li) * 110ms), fill 200ms; }
.grown .ctree-leaf-label { opacity: 0.85; }
.ctree-leaf:hover .ctree-leaf-shape, .ctree-leaf:focus-visible .ctree-leaf-shape, .ctree-leaf.active .ctree-leaf-shape { fill: #2e7d4f; stroke: #1d5c38; opacity: 1; transform: scale(1.25); }
.ctree-leaf:hover .ctree-leaf-label, .ctree-leaf.active .ctree-leaf-label { fill: #1d5c38; opacity: 1; font-weight: 800; }
.ctree-branch.dimmed { opacity: 0.38; transition: opacity 300ms; }
.ctree-branch.lit .ctree-branch-path { stroke: #2e7d4f; transition: stroke 250ms; }
.ctree-branch { transition: opacity 300ms; }

.ctree-mote { fill: #b8c9a8; opacity: 0; }
.grown .ctree-mote { animation: ctree-float 7s ease-in-out infinite; }
.ctree-mote-0 { animation-delay: 0.4s; }
.ctree-mote-1 { animation-delay: 2.1s; }
.ctree-mote-2 { animation-delay: 3.7s; }
@keyframes ctree-float { 0%, 100% { opacity: 0; transform: translateY(0); } 20% { opacity: 0.55; } 80% { opacity: 0.1; } 50% { transform: translateY(-14px); } }

.ctree-root-label circle { fill: #4a3b2a; opacity: 0; transition: opacity 600ms 1000ms; }
.ctree-root-label text { fill: #f4efe6; font-size: 13px; font-weight: 800; opacity: 0; transition: opacity 600ms 1050ms; }
.grown .ctree-root-label circle, .grown .ctree-root-label text { opacity: 1; }

.ctree-panel {
  border: 1px solid var(--line); border-radius: 16px; padding: 14px 16px; background: #fff;
  min-height: 120px; opacity: 0.75; transition: opacity 250ms, border-color 250ms;
}
.ctree-panel.open { opacity: 1; border-color: #cfe3d5; }
.ctree-panel small { font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 800; }
.ctree-panel h3 { margin: 4px 0 8px; font-size: 1.05rem; }
.ctree-panel-sub { font-size: 0.6rem; letter-spacing: 0.13em; text-transform: uppercase; color: #999; margin: 10px 0 4px; }
.ctree-panel ul { margin: 0; padding-left: 15px; display: grid; gap: 3px; }
.ctree-panel li { font-size: 0.78rem; color: #444; line-height: 1.4; }
.ctree-evidence li { display: grid; gap: 1px; padding: 4px 0; border-bottom: 1px dashed #eee; }
.ctree-evidence li:last-child { border-bottom: none; }
.ctree-evidence b { font-size: 0.78rem; color: #111; }
.ctree-evidence span { font-size: 0.72rem; color: #666; }
.ctree-unpin { margin-top: 10px; border: 1px solid var(--line); background: #fff; border-radius: 999px; padding: 6px 12px; font-size: 0.72rem; font-weight: 700; cursor: pointer; }
.ctree-panel-empty { color: #888; font-size: 0.78rem; margin: 0; line-height: 1.5; }

@media (min-width: 900px) {
  .ctree-stage { grid-template-columns: minmax(0, 1.7fr) minmax(240px, 1fr); }
  .ctree-panel { position: sticky; top: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .ctree-trunk, .ctree-branch-path, .ctree-leaf-shape, .ctree-leaf-core, .ctree-leaf-label, .ctree-root-label circle, .ctree-root-label text, .ctree-ground { transition: none !important; stroke-dashoffset: 0 !important; opacity: 1 !important; transform: scale(1) !important; }
  .grown .ctree-mote { animation: none !important; opacity: 0.3; }
}
`;
