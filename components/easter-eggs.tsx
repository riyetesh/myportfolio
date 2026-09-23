"use client";

// Easter eggs that reward curiosity without ever getting in the way. One
// small "Something unexpected?" control opens a hint list; the rest are
// discovered: a hidden terminal, a Konami developer mode, RitBot clicks.
// Nothing here hides essential information or blocks navigation.

import { useEffect, useRef, useState } from "react";

export const TERMINAL_LINES: { command: string; lines: string[] }[] = [
  { command: "whoami", lines: ["Ritesh Yadav"] },
  { command: "projects", lines: ["helloDoc · Therapeace · Attendsure · Connectogram · Gadget Mart"] },
  { command: "skills", lines: ["Product · Design · Technology · Data · Research"] },
  {
    command: "stack",
    lines: [
      "Python · JavaScript/TypeScript · React · Node.js · Next.js",
      "SQL · TensorFlow · OpenCV · AWS · Linux · Figma",
    ],
  },
  { command: "contact", lines: ["riyetesh@gmail.com · +358 41 589 5146 · Espoo, Finland"] },
  { command: "help", lines: ["Commands: whoami · projects · skills · stack · contact · ritbot · coffee · clear"] },
];

export function useKonami(onUnlock: () => void) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const sequence = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
    ];
    let progress = 0;
    const handleKey = (event: KeyboardEvent) => {
      if (done) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.key === sequence[progress]) {
        progress += 1;
        if (progress === sequence.length) {
          progress = 0;
          setDone(true);
          onUnlock();
        }
      } else {
        progress = event.key === sequence[0] ? 1 : 0;
        progress = 0;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [done, onUnlock]);
  return done;
}

export function useLongPress(onUnlock: () => void) {
  const timer = useRef<number | null>(null);
  const clear = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };
  useEffect(() => clear, []);
  return {
    onPointerDown: () => {
      clear();
      timer.current = window.setTimeout(onUnlock, 1600);
    },
    onPointerUp: clear,
    onPointerLeave: clear,
  };
}

export function EggHint({
  open,
  onToggle,
  found,
  onTerminal,
}: {
  open: boolean;
  onToggle: () => void;
  found: string[];
  onTerminal?: () => void;
}) {
  return (
    <div className="egg-hint-root">
      <button className="egg-hint-btn" onClick={onToggle} aria-expanded={open}>
        Something unexpected?
      </button>
      {open && (
        <div className="egg-hint-panel" role="dialog" aria-label="Hidden discoveries">
          <b>Hidden in here</b>
          <p>
            A few things on this site only appear if you go looking. Hints, in order of
            subtlety:
          </p>
          <ul>
            <li>RitBot does not like being poked five times in a row.</li>
            <li>An old cheat code still works in some places.</li>
            <li>Hold a project card and it tells you what it is made of.</li>
            <li>The profile photo knows it is a profile photo.</li>
            <li>
              {onTerminal ? (
                <button className="egg-terminal-link" onClick={onTerminal}>
                  And somewhere, a very small terminal.
                </button>
              ) : (
                <>And somewhere, a very small terminal.</>
              )}
            </li>
          </ul>
          {found.length > 0 && (
            <p className="egg-found">Discovered so far: {found.join(" · ")}</p>
          )}
        </div>
      )}
    </div>
  );}

export function KonamiOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const output = [
    "ritesh@portfolio:~$ whoami",
    "> Ritesh Yadav",
    "> ICT / Data Analytics",
    "> Product · Technology · UX",
  ];
  useEffect(() => {
    if (!open) return setStep(0);
    if (step >= output.length) return;
    const timer = window.setTimeout(() => setStep((value) => value + 1), step === 0 ? 500 : 350);
    return () => window.clearTimeout(timer);
  }, [open, step, output.length]);
  if (!open) return null;
  return (
    <div className="egg-overlay" role="dialog" aria-label="Developer mode" onClick={onClose}>
      <div className="egg-devmode" onClick={(event) => event.stopPropagation()}>
        {output.slice(0, step).map((line, index) => (
          <p key={line} className={index === 0 ? "egg-prompt" : "egg-out"}>
            {line}
          </p>
        ))}
        <button className="egg-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export function TerminalOverlay({
  open,
  onClose,
  onEggCommand,
}: {
  open: boolean;
  onClose: () => void;
  onEggCommand?: (command: string) => void;
}) {
  const [history, setHistory] = useState<string[]>([
    "ritesh@portfolio:~$ help",
    "Commands: whoami · projects · skills · stack · contact · ritbot · coffee · clear",
  ]);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [history]);
  const run = (raw: string) => {
    const command = raw.trim().toLowerCase();
    const entry = TERMINAL_LINES.find((item) => item.command === command);
    const next = [`ritesh@portfolio:~$ ${command}`];
    if (command === "clear") {
      setHistory([]);
      return;
    }
    if (entry) next.push(...entry.lines);
    else if (command === "sudo") next.push("Nice try. This portfolio runs on honesty, not sudo.");
    else if (command === "coffee" || command === "ritbot") {
      next.push(
        command === "coffee"
          ? "Brewing... RitBot is now 12% more energetic."
          : "RitBot wakes up, looks around, and pretends this was planned.",
      );
      onEggCommand?.(command);
    } else if (command) next.push(`command not found: ${command} (try 'help')`);
    setHistory((current) => [...current, ...next]);
  };
  if (!open) return null;
  return (
    <div className="egg-overlay" role="dialog" aria-label="Portfolio terminal" onClick={onClose}>
      <div className="egg-terminal" onClick={(event) => event.stopPropagation()}>
        <div className="egg-terminal-head" aria-hidden="true">ritesh@portfolio</div>
        <div className="egg-terminal-body" ref={listRef}>
          {history.map((line, index) => (
            <p key={index} className={line.startsWith("ritesh@") ? "egg-prompt" : "egg-out"}>
              {line}
            </p>
          ))}
        </div>
        <form
          className="egg-terminal-form"
          onSubmit={(event) => {
            event.preventDefault();
            run(value);
            setValue("");
          }}
        >
          <span aria-hidden="true">$</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-label="Terminal command"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="egg-close" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
}
