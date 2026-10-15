"use client";

import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

// Kelo-style agency footer: stark white, oversized "Let's talk." headline,
// a live Helsinki clock, and four lean text columns. All styles are scoped
// to .kelo-* classes so nothing leaks into the rest of the portfolio.

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function KeloClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Europe/Helsinki",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return <span className="kelo-green">{time}</span>;
}

export function KeloFooter({
  onNavigate,
}: {
  onNavigate?: (tab: string) => void;
}) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

        .kelo-footer {
          grid-column: 1 / -1;
          width: 100%;
          background: #ffffff;
          color: #1a1b1b;
          padding: 44px 24px 32px;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        .kelo-inner { max-width: 1400px; margin: 0 auto; }
        .kelo-divider {
          width: 100%;
          height: 1px;
          background: #e4e4e5;
          margin-bottom: 28px;
        }
        .kelo-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: start;
        }
        .kelo-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 14px;
        }
        .kelo-col.kelo-nav { gap: 8px; }
        .kelo-year { color: #39a068; margin-bottom: 4px; }
        .kelo-green { color: #39a068; }
        .kelo-col a,
        .kelo-col button {
          color: #666767;
          text-decoration: none;
          transition: color 0.2s ease;
          line-height: 1.625;
          background: none;
          border: 0;
          padding: 0;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }
        .kelo-col a:hover,
        .kelo-col button:hover { color: #000000; }
        .kelo-arrow { font-size: 12px; }
        @media (min-width: 640px) {
          .kelo-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 768px) {
          .kelo-footer { padding: 44px 60px 32px; }
        }
        @media (min-width: 1024px) {
          .kelo-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }
          .kelo-right {
            text-align: right;
            align-items: flex-end;
          }
        }
      `}</style>

      <footer className="kelo-footer">
        <motion.div
          className="kelo-inner"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="kelo-divider" />

          <div className="kelo-grid">
            <motion.div className="kelo-col" variants={itemVariants}>
              <span className="kelo-year">© 2026</span>
              <a href="mailto:riyetesh@gmail.com">riyetesh@gmail.com</a>
              <a href="tel:+358415895146">+358 41 589 5146</a>
              <span>
                Local time: <KeloClock /> (EET)
              </span>
            </motion.div>

            <motion.div className="kelo-col kelo-nav" variants={itemVariants}>
              <button onClick={() => onNavigate?.("posts")}>Posts</button>
              <button onClick={() => onNavigate?.("reels")}>Reels</button>
              <button onClick={() => onNavigate?.("about")}>About</button>
              <a href="mailto:riyetesh@gmail.com">
                Contact <span className="kelo-arrow">&#8599;</span>
              </a>
            </motion.div>

            <motion.div className="kelo-col kelo-nav" variants={itemVariants}>
              <a
                href="https://www.linkedin.com/in/theriteshyadav/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/riyetesh"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://theriteshyadav.medium.com/"
                target="_blank"
                rel="noreferrer"
              >
                Medium
              </a>
              <a href="mailto:riyetesh@gmail.com">Email</a>
            </motion.div>

            <motion.div
              className="kelo-col kelo-nav kelo-right"
              variants={itemVariants}
            >
              <a href="/CV-UTU.pdf" target="_blank" rel="noreferrer">
                CV <span className="kelo-arrow">&#8599;</span>
              </a>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Back to top
              </button>
              <span>Espoo, Finland</span>
            </motion.div>
          </div>
        </motion.div>
      </footer>
    </>
  );
}

export default KeloFooter;
