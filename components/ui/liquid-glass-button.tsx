"use client";

import * as React from "react";

// Liquid glass button, ported from the shadcn/Tailwind spec to scoped CSS
// (this project has no Tailwind). The shadow stack, the feTurbulence +
// feDisplacementMap glass filter, and the hover scale are kept verbatim;
// renders an <a> when href is given, otherwise a <button>.

type LiquidButtonProps = {
  children: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

const LIQUID_GLASS_STYLES = `
  .lg-root {
    position: relative;
    isolation: isolate;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 0;
    background: transparent;
    cursor: pointer;
    text-decoration: none;
    font: inherit;
    transition: transform 0.3s ease;
  }
  .lg-root:hover { transform: scale(1.05); }
  .lg-root:active { transform: scale(0.97); }
  .lg-shadow {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    border-radius: 999px;
    box-shadow:
      0 0 6px rgba(0, 0, 0, 0.03),
      0 2px 6px rgba(0, 0, 0, 0.08),
      inset 3px 3px 0.5px -3px rgba(0, 0, 0, 0.9),
      inset -3px -3px 0.5px -3px rgba(0, 0, 0, 0.85),
      inset 1px 1px 1px -0.5px rgba(0, 0, 0, 0.6),
      inset -1px -1px 1px -0.5px rgba(0, 0, 0, 0.6),
      inset 0 0 6px 6px rgba(0, 0, 0, 0.12),
      inset 0 0 2px 2px rgba(0, 0, 0, 0.06),
      0 0 12px rgba(255, 255, 255, 0.15);
    transition: box-shadow 0.3s ease;
  }
  .lg-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -10;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 999px;
    isolation: isolate;
  }
  .lg-content {
    position: relative;
    z-index: 10;
    pointer-events: none;
    display: inline-flex;
    align-items: center;
    gap: inherit;
  }
  .lg-filter-defs {
    position: absolute;
    width: 0;
    height: 0;
    visibility: hidden;
  }
`;

export function LiquidButton({
  children,
  href,
  target,
  rel,
  onClick,
  className,
  ariaLabel,
}: LiquidButtonProps) {
  const filterId = "container-glass-" + React.useId().replace(/:/g, "-");
  const classes = "lg-root" + (className ? " " + className : "");

  const inner = (
    <>
      <div className="lg-shadow" />
      <div
        className="lg-backdrop"
        style={{
          backdropFilter: `url(#${filterId})`,
          WebkitBackdropFilter: `url(#${filterId})`,
        }}
      />
      <div className="lg-content">{children}</div>
      <GlassFilter filterId={filterId} />
    </>
  );

  return (
    <>
      <style>{LIQUID_GLASS_STYLES}</style>
      {href ? (
        <a
          className={classes}
          href={href}
          target={target}
          rel={rel}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {inner}
        </a>
      ) : (
        <button className={classes} onClick={onClick} aria-label={ariaLabel}>
          {inner}
        </button>
      )}
    </>
  );
}

function GlassFilter({ filterId }: { filterId: string }) {
  return (
    <svg className="lg-filter-defs" aria-hidden="true">
      <defs>
        <filter
          id={filterId}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export default LiquidButton;
