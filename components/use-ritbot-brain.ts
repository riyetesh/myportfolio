"use client";

// The RitBot brain. A single state-driven system that turns cursor, scroll
// and inactivity signals into one mood + gaze values. Performance rules:
// one rAF-throttled mousemove listener, CSS custom properties instead of
// layout-triggering writes, all timers cleared on unmount, everything
// frozen under prefers-reduced-motion.

import { useEffect, useRef, useState } from "react";
import type { RitbotMood } from "./ritbot";

export type BrainState = {
  mood: RitbotMood;
  lookX: number;
  lookY: number;
  tilt: number;
  lean: number;
};

type Phase =
  | "idle"
  | "attentive"
  | "tracking"
  | "curious"
  | "surprised"
  | "hover"
  | "sleepy";

const PHASE_TIMEOUTS: Record<Phase, number> = {
  idle: 0,
  attentive: 2600,
  tracking: 2200,
  curious: 3000,
  surprised: 900,
  hover: 0,
  sleepy: 0,
};

export function useRitbotBrain(options: {
  chatOpen: boolean;
  chatTyping: boolean;
  baseMood: RitbotMood;
  fabHovering: boolean;
  onSurprise?: () => void;
}): BrainState {
  const { chatOpen, chatTyping, baseMood, fabHovering, onSurprise } = options;

  const [state, setState] = useState<BrainState>({
    mood: "idle",
    lookX: 0,
    lookY: 0,
    tilt: 0,
    lean: 0,
  });

  // Mutable signals, read inside the rAF loop.
  const mouse = useRef({ x: 0, y: 0, inside: false });
  const raf = useRef(0);
  const lastFrame = useRef(0);
  const smoothed = useRef({ x: 0, y: 0, tilt: 0, lean: 0 });
  const phase = useRef<Phase>("idle");
  const phaseTimer = useRef(0);
  const lastActivity = useRef(Date.now());
  const surprisedAt = useRef(0);
  const curiousTimer = useRef(0);
  const scrollTimer = useRef(0);
  const scrollDir = useRef(0);
  const reduced = useRef(false);
  const brainDisabled = useRef(false);

  // External inputs land in refs so the rAF loop reads fresh values.
  const inputs = useRef({ chatOpen, chatTyping, baseMood, fabHovering });
  inputs.current = { chatOpen, chatTyping, baseMood, fabHovering };

  const setPhase = (next: Phase) => {
    if (phase.current === next) return;
    phase.current = next;
    window.clearTimeout(phaseTimer.current);
    const timeout = PHASE_TIMEOUTS[next];
    if (timeout > 0) {
      phaseTimer.current = window.setTimeout(() => {
        if (phase.current === next) phase.current = "idle";
      }, timeout);
    }
  };

  useEffect(() => {
    brainDisabled.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (brainDisabled.current) return;

    const FAB_CENTER = () => {
      const fab = document.querySelector<HTMLElement>(".chatbot-fab");
      if (!fab) return null;
      const box = fab.getBoundingClientRect();
      return { x: box.left + box.width / 2, y: box.top + box.height / 2, w: box.width };
    };

    const tick = (now: number) => {
      raf.current = requestAnimationFrame(tick);
      // Throttle to ~30fps: plenty for organic motion, half the CPU cost.
      if (now - lastFrame.current < 33) return;
      lastFrame.current = now;

      const host = document.querySelector<SVGGElement>(".chatbot-fab .ritbot-look");
      const tiltTarget = document.querySelector<SVGGElement>(".chatbot-fab .ritbot-head-group");
      if (!host) return;

      const fab = FAB_CENTER();
      const s = smoothed.current;
      const inp = inputs.current;

      // Mood resolution: typing/thinking win, then hover, then phase moods.
      let mood: RitbotMood = inp.baseMood !== "idle" ? inp.baseMood : "idle";
      if (inp.chatTyping || inp.baseMood === "thinking") mood = inp.baseMood === "thinking" ? "thinking" : "typing";
      else if (inp.fabHovering) mood = "waving";
      else if (phase.current === "surprised") mood = "surprised";
      else if (phase.current === "curious") mood = "curious";
      else if (phase.current === "sleepy") mood = "sleepy";
      else if (phase.current === "attentive") mood = "attentive";

      // Gaze: dead zone of 14px, then a laggy spring toward the cursor.
      let targetX = 0;
      let targetY = 0;
      let tiltTarget2 = 0;
      let leanTarget = 0;
      if (fab && mouse.current.inside && !inp.chatOpen) {
        const dx = mouse.current.x - fab.x;
        const dy = mouse.current.y - fab.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 14) {
          const gx = Math.max(-2.6, Math.min(2.6, dx / 110));
          const gy = Math.max(-2.2, Math.min(2.2, dy / 110));
          targetX = gx;
          targetY = gy;
          tiltTarget2 = Math.max(-7, Math.min(7, dx / 40));
          leanTarget = dist < 90 ? Math.max(-2, Math.min(2, dx / 60)) : 0;
        }
        // Surprise: cursor just appeared very close after being far.
        if (dist < 60 && now - surprisedAt.current > 6000 && phase.current !== "hover") {
          surprisedAt.current = now;
          setPhase("surprised");
          onSurprise?.();
        }
      } else if (!mouse.current.inside) {
        // No cursor: the occasional curious look-around handled below.
      }

      // Inactivity: 45s of nothing makes RitBot drowsy; any activity wakes it.
      if (now - lastActivity.current > 45000 && phase.current !== "sleepy") {
        setPhase("sleepy");
      }
      if (phase.current === "sleepy") {
        targetX *= 0.3;
        targetY *= 0.3;
        tiltTarget2 *= 0.4;
      }

      // Scroll: glance in the scroll direction, stabilize the body.
      if (scrollDir.current !== 0) {
        targetY += scrollDir.current * 1.1;
      }

      // Spring-follow with a small lag so tracking feels physical.
      s.x += (targetX - s.x) * 0.11;
      s.y += (targetY - s.y) * 0.11;
      s.tilt += (tiltTarget2 - s.tilt) * 0.08;
      s.lean += (leanTarget - s.lean) * 0.09;

      host.style.setProperty("--look-x", s.x.toFixed(2) + "px");
      host.style.setProperty("--look-y", s.y.toFixed(2) + "px");
      if (tiltTarget) {
        tiltTarget.style.setProperty("--head-tilt", s.tilt.toFixed(2) + "deg");
      }
      const all = document.querySelector<SVGGElement>(".chatbot-fab .ritbot-all");
      if (all) all.style.setProperty("--body-lean", s.lean.toFixed(2) + "px");

      setState((prev) => {
        if (prev.mood !== mood) return { ...prev, mood };
        return prev;
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
      mouse.current.inside = true;
      lastActivity.current = Date.now();
      if (phase.current === "sleepy") setPhase("idle");
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    };
    const handleActivity = () => {
      lastActivity.current = Date.now();
    };
    const handleLeave = () => {
      mouse.current.inside = false;
    };
    const handleScroll = () => {
      lastActivity.current = Date.now();
      // Glance opposite the scroll travel, as if watching the content flow.
      scrollDir.current = 1;
      window.clearTimeout(scrollTimer.current);
      scrollTimer.current = window.setTimeout(() => {
        scrollDir.current = 0;
      }, 450);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("wheel", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity);
    document.addEventListener("mouseleave", handleLeave);
    raf.current = requestAnimationFrame(tick);

    // Occasional curious look-around while idle (15-45s cadence).
    const scheduleCurious = () => {
      curiousTimer.current = window.setTimeout(() => {
        if (!inputs.current.fabHovering && !inputs.current.chatOpen && phase.current === "idle") {
          setPhase("curious");
        }
        scheduleCurious();
      }, 15000 + Math.random() * 30000);
    };
    scheduleCurious();

    // Pause everything when the tab is hidden.
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf.current);
        raf.current = 0;
      } else if (!raf.current) {
        raf.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(raf.current);
      window.clearTimeout(phaseTimer.current);
      window.clearTimeout(curiousTimer.current);
      window.clearTimeout(scrollTimer.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleActivity);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleActivity);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [onSurprise]);

  return state;
}
