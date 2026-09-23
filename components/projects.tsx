"use client";

// The Projects reel: a horizontal discovery strip that expands into full case
// studies. Discovery flows discover, preview, interact, open, understand,
// verify. Hover stages information progressively, the cursor scrubs between
// two visual scenes, and clicking expands the card into the case-study hero
// with a connected FLIP transition. Everything is scoped CSS and transform
// based; prefers-reduced-motion flattens all of it.

import { useCallback, useEffect, useRef, useState } from "react";
import { PROJECTS, type Project } from "./projects-data";

const STAGE_STEPS = [
  "Problem discovered",
  "Research",
  "Early concept",
  "Wireframe",
  "Prototype",
  "Technical implementation",
  "Iteration",
  "Final product",
] as const;

function Scene({ project, alt }: { project: Project; alt?: boolean }) {
  const a = project.accent;
  const kind = alt ? project.stageB : project.stageA;
  const common = { className: "preel-scene", "aria-hidden": true } as const;
  if (kind === "Model pipeline" || kind === "Flow map") {
    return (
      <svg {...common} viewBox="0 0 300 240" style={{ background: `linear-gradient(160deg, ${a}14, ${a}05)` }}>
        <g stroke={a} strokeWidth="1.4" fill="none" opacity="0.75">
          <path d="M40 60 H110" strokeDasharray="4 5" />
          <path d="M170 60 H240" strokeDasharray="4 5" />
          <path d="M40 150 H240" strokeDasharray="4 5" />
        </g>
        {[
          [40, 60], [140, 60], [240, 60], [40, 150], [140, 150], [240, 150],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 16} y={y - 11} width="32" height="22" rx="7" fill="#fff" stroke={a} strokeWidth="1.2" />
            <circle cx={x} cy={y} r="3.4" fill={a} opacity={0.5 + (i % 3) * 0.25} />
          </g>
        ))}
        <rect x="92" y="96" width="116" height="26" rx="13" fill={a} opacity="0.12" />
        <text x="150" y="113" textAnchor="middle" fontSize="10" fontWeight="700" fill={a}>
          {project.title}
        </text>
      </svg>
    );
  }
  if (kind === "Recognition frame" || kind === "Dashboard") {
    return (
      <svg {...common} viewBox="0 0 300 240" style={{ background: `linear-gradient(160deg, ${a}14, ${a}05)` }}>
        {kind === "Recognition frame" ? (
          <g fill="none" stroke={a} strokeWidth="1.6" opacity="0.85">
            <path d="M55 45 h28 M55 45 v22" />
            <path d="M245 45 h-28 M245 45 v22" />
            <path d="M55 195 h28 M55 195 v-22" />
            <path d="M245 195 h-28 M245 195 v-22" />
            <ellipse cx="150" cy="118" rx="42" ry="54" strokeDasharray="5 6" />
            <circle cx="135" cy="106" r="4" fill={a} stroke="none" />
            <circle cx="165" cy="106" r="4" fill={a} stroke="none" />
            <path d="M132 140 q18 14 36 0" strokeDasharray="3 4" />
          </g>
        ) : (
          <g fill={a}>
            {[52, 84, 40, 96, 66].map((h, i) => (
              <rect key={i} x={52 + i * 40} y={196 - h} width="22" height={h} rx="5" opacity={0.35 + i * 0.14} />
            ))}
            <rect x="46" y="204" width="208" height="3" rx="1.5" opacity="0.5" />
          </g>
        )}
        <rect x="96" y="18" width="108" height="20" rx="10" fill="#fff" stroke={a} strokeWidth="1.2" />
        <circle cx="109" cy="28" r="3.6" fill={a} />
        <text x="156" y="32" textAnchor="middle" fontSize="9" fontWeight="700" fill={a}>
          {kind === "Recognition frame" ? "RECOGNIZED" : "WEEKLY"}
        </text>
      </svg>
    );
  }
  if (kind === "Challenge board" || kind === "Internal tools") {
    return (
      <svg {...common} viewBox="0 0 300 240" style={{ background: `linear-gradient(160deg, ${a}14, ${a}05)` }}>
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const x = 44 + (i % 3) * 74;
            const y = 52 + Math.floor(i / 3) * 78;
            return (
              <g key={i}>
                <rect x={x} y={y} width="62" height="66" rx="9" fill="#fff" stroke={a} strokeWidth="1.1" opacity="0.92" />
                <rect x={x + 9} y={y + 10} width={26 + ((i * 9) % 24)} height="7" rx="3.5" fill={a} opacity="0.65" />
                <rect x={x + 9} y={y + 25} width="44" height="5" rx="2.5" fill={a} opacity="0.28" />
                <rect x={x + 9} y={y + 36} width={34 + ((i * 13) % 20)} height="5" rx="2.5" fill={a} opacity="0.28" />
                <rect x={x + 9} y={y + 51} width="24" height="8" rx="4" fill={a} opacity="0.4" />
              </g>
            );
          })}
        </g>
      </svg>
    );
  }
  if (kind === "Storefront") {
    return (
      <svg {...common} viewBox="0 0 300 240" style={{ background: `linear-gradient(160deg, ${a}14, ${a}05)` }}>
        <g fill={a}>
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={52 + col * 54}
                y={58 + row * 54}
                width="40"
                height="38"
                rx="8"
                opacity={0.3 + ((row * 4 + col) % 5) * 0.14}
              />
            )),
          )}
        </g>
        <rect x="52" y="206" width="196" height="4" rx="2" fill={a} opacity="0.4" />
      </svg>
    );
  }
  // "Interface fragments", "Product interface", "Feed interface", fallback.
  return (
    <svg {...common} viewBox="0 0 300 240" style={{ background: `linear-gradient(160deg, ${a}14, ${a}05)` }}>
      <rect x="60" y="34" width="180" height="176" rx="12" fill="#fff" stroke={a} strokeWidth="1.2" opacity="0.95" />
      <rect x="60" y="34" width="180" height="26" rx="12" fill={a} opacity="0.14" />
      <circle cx="76" cy="47" r="4" fill={a} opacity="0.6" />
      <circle cx="89" cy="47" r="4" fill={a} opacity="0.4" />
      <rect x="76" y="78" width="98" height="9" rx="4.5" fill={a} opacity="0.55" />
      <rect x="76" y="96" width="148" height="6" rx="3" fill={a} opacity="0.25" />
      <rect x="76" y="110" width="120" height="6" rx="3" fill={a} opacity="0.25" />
      {kind === "Product interface" ? (
        <circle cx="150" cy="164" r="24" fill="none" stroke={a} strokeWidth="3" opacity="0.55" className="preel-breathe" />
      ) : (
        <>
          <rect x="76" y="132" width="64" height="56" rx="9" fill={a} opacity="0.16" />
          <rect x="152" y="132" width="72" height="26" rx="13" fill={a} opacity="0.3" />
          <rect x="152" y="166" width="52" height="22" rx="11" fill={a} opacity="0.2" />
        </>
      )}
    </svg>
  );
}

export function Projects({
  onOpenProject,
  onHoverProject,
  onReachContribution,
  onReachResult,
  holdHandlers,
  techUnlocked,
}: {
  onOpenProject?: (project: Project, kind: "open" | "contribution" | "result") => void;
  onHoverProject?: (project: Project | null) => void;
  onReachContribution?: (project: Project) => void;
  onReachResult?: (project: Project) => void;
  holdHandlers?: {
    onPointerDown?: (event: React.PointerEvent<HTMLButtonElement>) => void;
    onPointerUp?: (event: React.PointerEvent<HTMLButtonElement>) => void;
    onPointerLeave?: (event: React.PointerEvent<HTMLButtonElement>) => void;
  };
  techUnlocked?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [techOpen, setTechOpen] = useState(false);
  const techSeen = useRef(false);
  // When technical mode is unlocked, case studies open with depth expanded once.
  useEffect(() => {
    if (openIndex !== null && techUnlocked && !techSeen.current) {
      setTechOpen(true);
      techSeen.current = true;
    }
    if (openIndex === null) techSeen.current = false;
  }, [openIndex, techUnlocked]);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stageMilestone = useRef({ contribution: false, result: false });

  const project = openIndex === null ? null : PROJECTS[openIndex];

  const close = useCallback(() => {
    if (openIndex === null) return;
    setClosing(true);
    window.setTimeout(() => {
      setOpenIndex(null);
      setClosing(false);
      setTechOpen(false);
      stageMilestone.current = { contribution: false, result: false };
    }, 340);
  }, [openIndex]);

  const open = useCallback(
    (index: number) => {
      const card = cardRefs.current[index];
      const hero = heroRef.current;
      if (card && hero) {
        // FLIP: start the case-study hero at the card's exact rectangle, then
        // release it to full bleed so the card visibly becomes the page.
        const from = card.getBoundingClientRect();
        hero.style.transition = "none";
        hero.style.transformOrigin = "top left";
        hero.style.transform = `translate(${from.left}px, ${from.top}px) scale(${from.width / window.innerWidth}, ${from.height / window.innerHeight})`;
        hero.style.borderRadius = "24px";
        const release = () => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              hero.style.transition = "transform 560ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 560ms cubic-bezier(0.22, 1, 0.36, 1)";
              hero.style.transform = "translate(0, 0) scale(1, 1)";
              hero.style.borderRadius = "0px";
            });
          });
        };
        setOpenIndex(index);
        setActiveStage(0);
        stageMilestone.current = { contribution: false, result: false };
        requestAnimationFrame(release);
      } else {
        setOpenIndex(index);
        setActiveStage(0);
        stageMilestone.current = { contribution: false, result: false };
      }
      onOpenProject?.(PROJECTS[index], "open");
    },
    [onOpenProject],
  );

  const gotoProject = useCallback(
    (index: number) => {
      const bounded = (index + PROJECTS.length) % PROJECTS.length;
      setOpenIndex(bounded);
      setActiveStage(0);
      setTechOpen(false);
      stageMilestone.current = { contribution: false, result: false };
      onOpenProject?.(PROJECTS[bounded], "open");
    },
    [onOpenProject],
  );

  // Escape closes; the timeline tracks the dominant stage on scroll.
  useEffect(() => {
    if (openIndex === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKey);
    const timeline = timelineRef.current;
    let frame = 0;
    const onScroll = () => {
      if (frame || !timeline) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!timeline) return;
        const children = Array.from(timeline.children) as HTMLElement[];
        const center = timeline.scrollLeft + timeline.clientWidth / 2;
        let nearest = 0;
        let best = Infinity;
        children.forEach((child, i) => {
          const childCenter = child.offsetLeft + child.offsetWidth / 2;
          const distance = Math.abs(childCenter - center);
          if (distance < best) {
            best = distance;
            nearest = i;
          }
        });
        setActiveStage(nearest);
      });
    };
    timeline?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKey);
      timeline?.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [openIndex, close]);

  // Fire RitBot's contribution and result reactions once per open case study.
  useEffect(() => {
    if (!project) return;
    if (activeStage === 5 && !stageMilestone.current.contribution) {
      stageMilestone.current.contribution = true;
      onOpenProject?.(project, "contribution");
    }
    if (activeStage === 6 && !stageMilestone.current.result) {
      stageMilestone.current.result = true;
      onOpenProject?.(project, "result");
    }
  }, [activeStage, project, onReachContribution, onReachResult]);

  // Parallax + scrub live on CSS custom properties written straight to the
  // card element: no React state, no re-renders while the cursor moves.
  const moveCard = (event: React.PointerEvent<HTMLButtonElement>, index: number) => {
    if (event.pointerType !== "mouse") return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const mx = (event.clientX - rect.left) / rect.width;
    const my = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--mx", mx.toFixed(3));
    card.style.setProperty("--my", my.toFixed(3));
    card.style.setProperty("--scrub", mx < 0.5 ? "0" : "1");
  };

  const leaveCard = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--mx", "0.5");
    event.currentTarget.style.setProperty("--my", "0.5");
    event.currentTarget.style.setProperty("--scrub", "0");
  };

  return (
    <section className="preel-root" aria-label="Projects">
      <style>{PROJECTS_CSS}</style>
      <div className="preel-intro">
        <p className="eyebrow">Projects</p>
        <h2>Built, shipped, repeat.</h2>
        <p className="preel-lede">
          Hover to look closer. Click to step inside a project.
        </p>
      </div>

      <div className="preel-track" role="list">
        {PROJECTS.map((item, index) => {
          const focused = focusedKey === item.key;
          return (
            <button
              key={item.key}
              role="listitem"
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="preel-card"
              onMouseEnter={() => {
                setFocusedKey(item.key);
                onHoverProject?.(item);
              }}
              onMouseLeave={() => {
                setFocusedKey(null);
                onHoverProject?.(null);
              }}
              onFocus={() => setFocusedKey(item.key)}
              onBlur={() => setFocusedKey(null)}
              onPointerMove={(event) => moveCard(event, index)}
              onPointerLeave={(event) => {
                leaveCard(event);
                holdHandlers?.onPointerLeave?.(event);
              }}
              onPointerDown={(event) => holdHandlers?.onPointerDown?.(event)}
              onPointerUp={(event) => holdHandlers?.onPointerUp?.(event)}
              onClick={() => open(index)}
              style={{ "--accent": item.accent } as React.CSSProperties}
              aria-label={`${item.title}, ${item.category}. Open case study`}
            >
              <span className="preel-visual" aria-hidden="true">
                <span className="preel-layer preel-layer-a">
                  <Scene project={item} />
                </span>
                <span className="preel-layer preel-layer-b">
                  <Scene project={item} alt />
                </span>
                <span className="preel-glow" />
              </span>
              <span className="preel-shade" aria-hidden="true" />
              <span className="preel-head">
                <strong>{item.title}</strong>
                <small>{item.category}</small>
              </span>
              <span className="preel-stage preel-stage-1">
                <b>{item.role}</b>
                <em>{item.technologies.join(" · ")}</em>
              </span>
              <span className="preel-stage preel-stage-2">
                <b>Problem</b>
                <em>{item.problem}</em>
                <b>Outcome</b>
                <em>{item.outcome}</em>
              </span>
              <span className="preel-open" aria-hidden="true">
                Open case study →
              </span>
              {focused && <span className="preel-focus-ring" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <p className="preel-hint">Scroll sideways to browse · every card opens a full case study</p>

      {project && (
        <div
          className={`preel-page${closing ? " closing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} case study`}
        >
          <div className="preel-sheet" ref={heroRef}>
            <button className="preel-close" onClick={close} aria-label="Close case study">
              ×
            </button>

            <header className="preel-hero" style={{ "--accent": project.accent } as React.CSSProperties}>
              <div className="preel-hero-art" aria-hidden="true">
                <Scene project={project} />
              </div>
              <div className="preel-hero-copy">
                <small>{project.category}</small>
                <h2>{project.title}</h2>
                <p className="preel-tagline">{project.tagline}</p>
                <div className="preel-first-screen">
                  <div>
                    <b>What is it?</b>
                    <span>{project.outcome}</span>
                  </div>
                  <div>
                    <b>Why does it matter?</b>
                    <span>{project.problem}</span>
                  </div>
                  <div>
                    <b>What did Ritesh do?</b>
                    <span>{project.contribution}</span>
                  </div>
                </div>
                <p className="preel-roleline">
                  Role · {project.role}
                  {project.live && (
                    <a href={project.live.href} target="_blank" rel="noreferrer">
                      {project.live.label} ↗
                    </a>
                  )}
                </p>
              </div>
            </header>

            <div className="preel-body">
              <div className="preel-section-head">
                <h3>The narrative</h3>
                <div className="preel-progress" aria-hidden="true">
                  {project.stages.map((stage, i) => (
                    <i key={stage.name} className={i <= activeStage ? "on" : ""} />
                  ))}
                </div>
                <span className="preel-progress-label">
                  {String(activeStage + 1).padStart(2, "0")} / {String(project.stages.length).padStart(2, "0")}
                </span>
              </div>
              <div className="preel-timeline" ref={timelineRef} aria-label="Project narrative stages">
                {project.stages.map((stage, i) => (
                  <article
                    key={stage.name}
                    className={`preel-stagecard${i === activeStage ? " dominant" : ""}`}
                    aria-current={i === activeStage ? "step" : undefined}
                  >
                    <span className="preel-stageindex">{stage.index}</span>
                    <h4>{stage.name}</h4>
                    <p>{stage.copy}</p>
                    <ul>
                      {stage.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <section className="preel-behind">
                <h3>Behind the project</h3>
                <ol className="preel-evolution">
                  {STAGE_STEPS.map((step) => (
                    <li key={step}>
                      <i aria-hidden="true" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="preel-contribution">
                <h3>My contribution</h3>
                <div className="preel-columns">
                  {[
                    { label: "I designed", items: project.designed },
                    { label: "I developed", items: project.developed },
                    { label: "I researched", items: project.researched },
                    { label: "I managed", items: project.managed },
                  ]
                    .filter((column) => column.items.length > 0)
                    .map((column) => (
                      <div key={column.label}>
                        <b>{column.label}</b>
                        <ul>
                          {column.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
                <div className="preel-chain">
                  {[
                    { verb: "Designed", result: "a structure users can navigate without instructions" },
                    { verb: "Developed", result: "working software, not a mockup" },
                    { verb: "Researched", result: "requirements grounded in real workflows" },
                    { verb: "Managed", result: "scope that actually shipped" },
                  ].map((row) => (
                    <p key={row.verb}>
                      <b>{row.verb}</b>
                      <span>→ {row.result}</span>
                    </p>
                  ))}
                </div>
              </section>

              <section className="preel-tech">
                <button
                  className="preel-tech-toggle"
                  onClick={() => setTechOpen((value) => !value)}
                  aria-expanded={techOpen}
                >
                  {techOpen ? "Hide technical depth" : "Show technical depth"} →
                </button>
                {techOpen && (
                  <dl className="preel-tech-grid">
                    {project.techDepth.map((row) => (
                      <div key={row.label}>
                        <dt>{row.label}</dt>
                        <dd>{row.detail}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>

              <section className="preel-end">
                <div className="preel-end-grid">
                  <div>
                    <b>What I learned</b>
                    <p>{project.learned}</p>
                  </div>
                  <div>
                    <b>What I would change</b>
                    <p>{project.change}</p>
                  </div>
                  <div>
                    <b>What I would build next</b>
                    <p>{project.next}</p>
                  </div>
                </div>
                <nav className="preel-nav">
                  <button onClick={() => gotoProject(openIndex! - 1)}>← Previous project</button>
                  <button onClick={close}>All projects</button>
                  <button onClick={() => gotoProject(openIndex! + 1)}>Next project →</button>
                </nav>
              </section>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const PROJECTS_CSS = `
.preel-root { padding: 26px 0 8px; }
.preel-intro { padding: 0 20px; }
.preel-intro h2 { margin: 4px 0 6px; font-size: 1.5rem; letter-spacing: -0.02em; }
.preel-lede { color: #666; font-size: 0.85rem; margin: 0 0 18px; }
.preel-track {
  display: flex; gap: 14px; overflow-x: auto; padding: 10px 20px 18px;
  scroll-snap-type: x mandatory; scrollbar-width: none;
}
.preel-track::-webkit-scrollbar { display: none; }
.preel-card {
  position: relative; flex: 0 0 300px; height: 400px; border: 1px solid var(--line);
  border-radius: 22px; overflow: hidden; padding: 0; background: #fff; cursor: pointer;
  scroll-snap-align: center; text-align: left; isolation: isolate;
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms, opacity 420ms;
  --mx: 0.5; --my: 0.5; --scrub: 0;
}
.preel-track:hover .preel-card:not(:hover) { opacity: 0.55; transform: scale(0.965); }
.preel-card:hover, .preel-card:focus-visible {
  transform: scale(1.03); box-shadow: 0 24px 48px -24px rgba(0, 0, 0, 0.35); z-index: 2;
}
.preel-visual { position: absolute; inset: 0; display: block; }
.preel-layer { position: absolute; inset: 0; transition: opacity 300ms; }
.preel-layer svg { width: 100%; height: 100%; display: block; }
.preel-layer-b { opacity: var(--scrub, 0); }
.preel-layer-a { opacity: calc(1 - var(--scrub, 0)); }
.preel-glow {
  position: absolute; inset: -40%; opacity: 0; transition: opacity 420ms;
  background: radial-gradient(40% 34% at calc(var(--mx) * 100%) calc(var(--my) * 100%), color-mix(in srgb, var(--accent) 26%, transparent), transparent 70%);
  pointer-events: none;
}
.preel-card:hover .preel-glow { opacity: 1; }
.preel-scene { filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.08)); }
.preel-breathe { animation: preel-breathe 5.5s ease-in-out infinite; transform-origin: 150px 164px; }
@keyframes preel-breathe { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.12); opacity: 0.75; } }
.preel-shade {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.18) 42%, transparent 66%);
}
.preel-head, .preel-stage, .preel-open { position: absolute; left: 18px; right: 18px; color: #fff; display: block; }
.preel-head { bottom: 108px; transition: transform 380ms cubic-bezier(0.22, 1, 0.36, 1); }
.preel-head strong { font-size: 1.35rem; letter-spacing: -0.02em; display: block; text-shadow: 0 1px 8px rgba(0,0,0,0.35); }
.preel-head small { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.85; }
.preel-stage { opacity: 0; transform: translateY(10px); transition: opacity 300ms, transform 380ms cubic-bezier(0.22, 1, 0.36, 1); }
.preel-stage b { display: block; font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.75; margin-top: 7px; }
.preel-stage em { display: block; font-style: normal; font-size: 0.74rem; line-height: 1.4; }
.preel-stage-1 { bottom: 64px; transition-delay: 70ms; }
.preel-stage-2 { bottom: 34px; transition-delay: 150ms; }
.preel-stage-2 em { font-size: 0.68rem; opacity: 0.9; }
.preel-card:hover .preel-stage, .preel-card:focus-visible .preel-stage { opacity: 1; transform: translateY(0); }
.preel-card:hover .preel-head { transform: translateY(-6px); }
.preel-open {
  bottom: 16px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em;
  opacity: 0; transform: translateY(8px); transition: opacity 300ms 220ms, transform 380ms 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.preel-card:hover .preel-open, .preel-card:focus-visible .preel-open { opacity: 0.95; transform: translateY(0); }
.preel-focus-ring { position: absolute; inset: 0; border-radius: 22px; box-shadow: inset 0 0 0 2px var(--accent); pointer-events: none; }
.preel-hint { text-align: center; color: #999; font-size: 0.68rem; margin: 2px 0 6px; }

/* Case study page */
.preel-page {
  position: fixed; inset: 0; z-index: 90; background: rgba(0, 0, 0, 0.45);
  overflow-y: auto; overscroll-behavior: contain;
  animation: preel-fade 260ms ease;
}
.preel-page.closing { animation: preel-fade-out 320ms ease forwards; }
@keyframes preel-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes preel-fade-out { to { opacity: 0; } }
.preel-sheet { position: relative; min-height: 100%; background: var(--paper, #fafafa); }
.preel-close {
  position: fixed; top: 16px; right: 16px; z-index: 5; width: 38px; height: 38px;
  border-radius: 50%; border: 1px solid var(--line); background: #fff; font-size: 1.15rem;
  cursor: pointer; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}
.preel-hero {
  position: relative; overflow: hidden; padding: 64px 26px 30px;
  background: linear-gradient(165deg, color-mix(in srgb, var(--accent) 14%, #fff), #fff 62%);
}
.preel-hero-art { position: absolute; right: -40px; top: -20px; width: 340px; opacity: 0.5; pointer-events: none; }
.preel-hero-art svg { width: 100%; height: auto; }
.preel-hero-copy { position: relative; max-width: 620px; }
.preel-hero-copy small { letter-spacing: 0.16em; text-transform: uppercase; font-size: 0.64rem; color: var(--accent); font-weight: 700; }
.preel-hero-copy h2 { font-size: clamp(2rem, 6vw, 3.2rem); margin: 6px 0 4px; letter-spacing: -0.03em; }
.preel-tagline { color: #555; margin: 0 0 16px; }
.preel-first-screen { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 14px; }
.preel-first-screen b { display: block; font-size: 0.62rem; letter-spacing: 0.13em; text-transform: uppercase; color: #999; margin-bottom: 3px; }
.preel-first-screen span { font-size: 0.82rem; line-height: 1.45; color: #222; }
.preel-roleline { font-size: 0.8rem; color: #444; display: flex; gap: 14px; flex-wrap: wrap; align-items: center; margin: 0; }
.preel-roleline a { color: var(--accent); font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
.preel-body { padding: 22px 26px 60px; max-width: 980px; }
.preel-section-head { display: flex; align-items: baseline; gap: 14px; margin-bottom: 12px; }
.preel-section-head h3 { font-size: 1.05rem; margin: 0; }
.preel-progress { display: flex; gap: 5px; flex: 1; }
.preel-progress i { height: 3px; flex: 1; border-radius: 2px; background: #e2e2e2; transition: background 300ms; }
.preel-progress i.on { background: var(--accent); }
.preel-progress-label { font-size: 0.66rem; color: #999; font-variant-numeric: tabular-nums; }
.preel-timeline {
  display: flex; gap: 14px; overflow-x: auto; padding: 8px 4px 18px;
  scroll-snap-type: x mandatory; scrollbar-width: none;
}
.preel-timeline::-webkit-scrollbar { display: none; }
.preel-stagecard {
  flex: 0 0 min(76vw, 400px); scroll-snap-align: center; background: #fff;
  border: 1px solid var(--line); border-radius: 18px; padding: 20px;
  opacity: 0.6; transform: scale(0.97);
  transition: opacity 320ms, transform 380ms cubic-bezier(0.22, 1, 0.36, 1), border-color 320ms;
}
.preel-stagecard.dominant { opacity: 1; transform: scale(1); border-color: var(--accent); box-shadow: 0 16px 36px -22px rgba(0, 0, 0, 0.3); }
.preel-stageindex { font-size: 0.66rem; font-weight: 800; letter-spacing: 0.16em; color: var(--accent); }
.preel-stagecard h4 { margin: 6px 0 8px; font-size: 1.08rem; letter-spacing: -0.01em; }
.preel-stagecard p { font-size: 0.82rem; color: #444; line-height: 1.5; margin: 0 0 10px; }
.preel-stagecard ul { margin: 0; padding-left: 16px; display: grid; gap: 5px; }
.preel-stagecard li { font-size: 0.76rem; color: #555; line-height: 1.45; }
.preel-behind h3, .preel-contribution h3 { font-size: 1.05rem; margin: 26px 0 12px; }
.preel-evolution { list-style: none; margin: 0; padding: 0 0 0 6px; display: grid; gap: 0; position: relative; }
.preel-evolution li { display: flex; align-items: center; gap: 12px; position: relative; padding: 7px 0; }
.preel-evolution li:not(:last-child)::before {
  content: ""; position: absolute; left: 7px; top: 24px; bottom: -8px; width: 2px; background: linear-gradient(var(--accent), color-mix(in srgb, var(--accent) 30%, transparent));
  opacity: 0.5;
}
.preel-evolution i { width: 12px; height: 12px; border-radius: 50%; background: #fff; border: 2.5px solid var(--accent); flex: 0 0 auto; }
.preel-evolution span { font-size: 0.82rem; color: #333; }
.preel-columns { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
.preel-columns b { display: block; font-size: 0.66rem; letter-spacing: 0.13em; text-transform: uppercase; color: var(--accent); margin-bottom: 7px; }
.preel-columns ul { margin: 0; padding-left: 15px; display: grid; gap: 4px; }
.preel-columns li { font-size: 0.78rem; color: #444; line-height: 1.4; }
.preel-chain { margin-top: 18px; display: grid; gap: 7px; border-top: 1px solid var(--line); padding-top: 14px; }
.preel-chain p { margin: 0; font-size: 0.8rem; display: flex; gap: 8px; flex-wrap: wrap; }
.preel-chain b { min-width: 86px; color: #111; }
.preel-chain span { color: #555; }
.preel-tech { margin-top: 28px; }
.preel-tech-toggle {
  border: 1px solid var(--line); background: #fff; border-radius: 999px; padding: 9px 16px;
  font-size: 0.78rem; font-weight: 700; cursor: pointer; color: #111;
}
.preel-tech-toggle:hover { background: #f5f5f5; }
.preel-tech-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin: 16px 0 0; }
.preel-tech-grid dt { font-size: 0.64rem; letter-spacing: 0.13em; text-transform: uppercase; color: #999; margin-bottom: 3px; }
.preel-tech-grid dd { margin: 0; font-size: 0.78rem; color: #333; line-height: 1.5; }
.preel-end { margin-top: 34px; border-top: 1px solid var(--line); padding-top: 20px; }
.preel-end-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.preel-end-grid b { display: block; font-size: 0.66rem; letter-spacing: 0.13em; text-transform: uppercase; color: var(--accent); margin-bottom: 5px; }
.preel-end-grid p { margin: 0; font-size: 0.8rem; color: #444; line-height: 1.55; }
.preel-nav { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 26px; }
.preel-nav button {
  border: 1px solid var(--line); background: #fff; border-radius: 999px;
  padding: 10px 18px; font-size: 0.8rem; font-weight: 700; cursor: pointer; color: #111;
}
.preel-nav button:hover { background: #f5f5f5; }

@media (max-width: 640px) {
  .preel-card { flex-basis: 262px; height: 360px; }
  .preel-hero { padding: 56px 18px 24px; }
  .preel-hero-art { opacity: 0.28; width: 260px; }
  .preel-body { padding: 18px 18px 48px; }
}
@media (prefers-reduced-motion: reduce) {
  .preel-card, .preel-stage, .preel-stagecard, .preel-head, .preel-open, .preel-page { transition: none !important; animation: none !important; }
  .preel-breathe { animation: none !important; }
  .preel-track:hover .preel-card:not(:hover) { transform: none; opacity: 1; }
  .preel-sheet { transition: none !important; transform: none !important; }
}
`;
