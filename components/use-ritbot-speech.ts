"use client";

// Speech bubble state for RitBot, with anti-annoyance rules baked in:
// a global cooldown between lines, per-key cooldowns so the same context
// never repeats back to back, auto-hide after 1 to 3 seconds, and a
// queue slot so reactions never stack.

import { useCallback, useRef, useState } from "react";
import type { RitbotMood } from "./ritbot";

export type Bubble = {
  line: string;
  mood: RitbotMood;
};

export function useRitbotSpeech(options: {
  chatOpen: boolean;
  reduced?: boolean;
}) {
  const { chatOpen } = options;

  const [bubble, setBubble] = useState<Bubble | null>(null);
  const hideTimer = useRef(0);
  const lastGlobal = useRef(0);
  const lastKey = useRef("");
  const keyCount = useRef<Record<string, number>>({});

  const say = useCallback(
    (line: string, mood: RitbotMood, key = "generic") => {
      const now = Date.now();
      // Chat is open: RitBot goes quiet so the conversation leads.
      if (chatOpen) return;
      // Global cooldown: at most one line every 12 seconds.
      if (now - lastGlobal.current < 12000) return;
      // Never the same line twice in a row.
      if (key === lastKey.current && key !== "generic") return;
      // Same context key maxes out at 2 lines per session.
      if ((keyCount.current[key] ?? 0) >= 2 && key !== "generic") return;

      lastGlobal.current = now;
      lastKey.current = key;
      keyCount.current[key] = (keyCount.current[key] ?? 0) + 1;

      setBubble({ line, mood });
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setBubble(null), 1600 + Math.random() * 1400);
    },
    [chatOpen]
  );

  const clear = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    setBubble(null);
  }, []);

  return { bubble, say, clear };
}
