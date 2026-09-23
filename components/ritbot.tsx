"use client";

// RitBot, the site mascot: a small floating robot companion rendered as a
// dependency-free animated SVG. The character is a state-driven system:
// a mood picks the face and arm pose, CSS handles idle physics (float,
// blink, glow) and the brain hook drives gaze, head tilt and body lean via
// CSS custom properties. Reduced motion is respected by the global media
// query, which freezes every cycle.

import type { ReactElement } from "react";

export type RitbotMood =
  | "idle"
  | "attentive"
  | "curious"
  | "surprised"
  | "sleepy"
  | "waving"
  | "excited"
  | "thinking"
  | "typing"
  | "success"
  | "confused"
  | "goodbye";

const EYES: Record<RitbotMood, ReactElement> = {
  idle: (
    <>
      <circle className="ritbot-eye" cx="41" cy="46" r="5.2" />
      <circle className="ritbot-eye" cx="61" cy="46" r="5.2" />
      <circle className="ritbot-eye-spark" cx="42.6" cy="44.4" r="1.5" />
      <circle className="ritbot-eye-spark" cx="62.6" cy="44.4" r="1.5" />
    </>
  ),
  attentive: (
    <>
      <circle className="ritbot-eye" cx="41" cy="45.5" r="5.8" />
      <circle className="ritbot-eye" cx="61" cy="45.5" r="5.8" />
      <circle className="ritbot-eye-spark" cx="42.8" cy="43.6" r="1.7" />
      <circle className="ritbot-eye-spark" cx="62.8" cy="43.6" r="1.7" />
    </>
  ),
  curious: (
    <>
      <circle className="ritbot-eye" cx="40.5" cy="44" r="6.2" />
      <circle className="ritbot-eye" cx="62" cy="47" r="4.6" />
      <circle className="ritbot-eye-spark" cx="42.4" cy="42.2" r="1.7" />
      <circle className="ritbot-eye-spark" cx="63.4" cy="45.6" r="1.3" />
    </>
  ),
  surprised: (
    <>
      <circle className="ritbot-eye" cx="41" cy="45" r="7" />
      <circle className="ritbot-eye" cx="61" cy="45" r="7" />
      <circle className="ritbot-eye-spark" cx="43.4" cy="42.6" r="1.9" />
      <circle className="ritbot-eye-spark" cx="63.4" cy="42.6" r="1.9" />
    </>
  ),
  sleepy: (
    <>
      <path className="ritbot-eye-line" d="M36.5 46.5h9" />
      <path className="ritbot-eye-line" d="M56.5 46.5h9" />
    </>
  ),
  waving: (
    <>
      <path className="ritbot-eye-line" d="M36 47c2.6-4.4 7.4-4.4 10 0" />
      <path className="ritbot-eye-line" d="M56 47c2.6-4.4 7.4-4.4 10 0" />
    </>
  ),
  excited: (
    <>
      <path className="ritbot-eye-line" d="M36 47c2.6-4.4 7.4-4.4 10 0" />
      <path className="ritbot-eye-line" d="M56 47c2.6-4.4 7.4-4.4 10 0" />
    </>
  ),
  thinking: (
    <>
      <circle className="ritbot-eye" cx="41" cy="43.5" r="5" />
      <path className="ritbot-eye-line" d="M56.5 45.5h9" />
    </>
  ),
  typing: (
    <>
      <circle className="ritbot-eye" cx="41" cy="48" r="5" />
      <circle className="ritbot-eye" cx="61" cy="48" r="5" />
    </>
  ),
  success: (
    <>
      <path className="ritbot-eye-line" d="M36.5 47.5 41 42l4.5 5.5" />
      <path className="ritbot-eye-line" d="M56.5 47.5 61 42l4.5 5.5" />
    </>
  ),
  confused: (
    <>
      <circle className="ritbot-eye" cx="41" cy="46" r="6" />
      <path className="ritbot-eye-line" d="M56.5 46.5h9" />
    </>
  ),
  goodbye: (
    <>
      <path className="ritbot-eye-line" d="M36 47c2.6-4.4 7.4-4.4 10 0" />
      <path className="ritbot-eye-line" d="M56 47c2.6-4.4 7.4-4.4 10 0" />
    </>
  ),
};

const MOUTHS: Record<RitbotMood, ReactElement> = {
  idle: <path className="ritbot-mouth" d="M44 58c3 2.6 9 2.6 12 0" />,
  attentive: <path className="ritbot-mouth" d="M45 58.5h10" />,
  curious: <path className="ritbot-mouth" d="M45.5 58.5c2 1.6 5 1.6 7 0" />,
  surprised: <ellipse className="ritbot-mouth-o" cx="50" cy="59" rx="3.4" ry="4.2" />,
  sleepy: <path className="ritbot-mouth" d="M46 59h8" />,
  waving: <path className="ritbot-mouth" d="M42 56c4 5 12 5 16 0" />,
  excited: <path className="ritbot-mouth" d="M42 56c4 6 12 6 16 0" />,
  thinking: <path className="ritbot-mouth" d="M45 58.5h10" />,
  typing: <path className="ritbot-mouth" d="M46 58h8" />,
  success: <path className="ritbot-mouth" d="M42 55c4 7.5 12 7.5 16 0" />,
  confused: <path className="ritbot-mouth" d="M44 59c2-2 4 2 6 0s4-2 6 0" />,
  goodbye: <path className="ritbot-mouth" d="M44 58c3 2.6 9 2.6 12 0" />,
};

export function RitbotFace({
  mood = "idle",
  size = 44,
  className = "",
}: {
  mood?: RitbotMood;
  size?: number;
  className?: string;
}) {
  const leftArm =
    mood === "excited" || mood === "success"
      ? "ritbot-arm ritbot-arm-up"
      : "ritbot-arm";
  const rightArm =
    mood === "waving" || mood === "goodbye"
      ? "ritbot-arm ritbot-arm-wave"
      : mood === "excited" || mood === "success"
        ? "ritbot-arm ritbot-arm-up"
        : "ritbot-arm";
  const sleeping = mood === "sleepy";

  return (
    <svg
      className={`ritbot ritbot-${mood} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {/* ground shadow: shrinks as the bot floats up */}
      <ellipse className="ritbot-shadow" cx="51" cy="96" rx="17" ry="3.4" />
      {/* whole-body layer: hop, tilt, lean are applied here */}
      <g className="ritbot-all">
        {/* hover ring under the floating body */}
        <ellipse className="ritbot-hover-ring" cx="51" cy="92.5" rx="12" ry="2.6" />
        {/* antenna + LED */}
        <line className="ritbot-stem" x1="51" y1="14" x2="51" y2="22" />
        <circle className="ritbot-led" cx="51" cy="11.5" r="3.2" />
        {/* head group: tilts independently of the body */}
        <g className="ritbot-head-group">
          <rect className="ritbot-head" x="26" y="22" width="50" height="44" rx="15" />
          <rect className="ritbot-head-seam" x="30" y="23.4" width="42" height="2" rx="1" />
          {/* screen */}
          <rect className="ritbot-screen" x="31.5" y="27.5" width="39" height="33" rx="11" />
          <rect className="ritbot-screen-glare" x="35" y="30" width="7" height="28" rx="3.5" />
          <g className="ritbot-look">
            {EYES[mood]}
            {MOUTHS[mood]}
          </g>
          {/* ears */}
          <rect className="ritbot-ear" x="19" y="38" width="6" height="12" rx="3" />
          <rect className="ritbot-ear" x="77" y="38" width="6" height="12" rx="3" />
        </g>
        {/* body + core */}
        <rect className="ritbot-body" x="34" y="68" width="34" height="18" rx="9" />
        <rect className="ritbot-body-seam" x="36" y="68" width="30" height="1.6" rx="0.8" />
        <circle className="ritbot-core" cx="51" cy="77" r="4" />
        {/* arms with simple hands */}
        <g className={leftArm + "-group"}>
          <path className={leftArm} d="M33 72c-5 1-8 4-9 8" />
          <circle className="ritbot-hand" cx="24" cy="80.5" r="3" />
        </g>
        <g className={rightArm + "-group"}>
          <path className={rightArm} d="M69 72c5 1 8 4 9 8" />
          <circle className="ritbot-hand" cx="78" cy="80.5" r="3" />
        </g>
        {/* floating lower body: thruster glow instead of legs */}
        <path
          className="ritbot-thruster"
          d="M43 86.5c2.2 2.6 4.6 3.9 8 3.9s5.8-1.3 8-3.9"
        />
      </g>
      {sleeping && (
        <text className="ritbot-zzz" x="74" y="24" textAnchor="middle">
          z
        </text>
      )}
    </svg>
  );
}
