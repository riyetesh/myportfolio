"use client";

import React from "react";
import { motion } from "framer-motion";

// Orbit-style about section, adapted for Ritesh Yadav.
// Centered mindset headline above two flanking portraits with an oversized
// "8+" stat, a lime CTA pill, and honest copy. All styles scoped to .orbit-*.

export function OrbitAbout() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&display=swap');

        .orbit-section {
          width: 100%;
          background: #ffffff;
          padding: 140px 40px;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #0d0d0d;
          box-sizing: border-box;
        }
        .orbit-section *,
        .orbit-section *::before,
        .orbit-section *::after { box-sizing: border-box; }
        .orbit-inner { max-width: 1200px; margin: 0 auto; }
        .orbit-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 48px;
        }
        .orbit-label-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .orbit-chip {
          width: 28px;
          height: 28px;
          background: #c8f11a;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .orbit-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #111111;
        }
        .orbit-heading {
          margin: 0;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 42px;
          color: #0d0d0d;
          line-height: 1.1;
          letter-spacing: -0.01em;
          max-width: 850px;
        }
        .orbit-cols {
          display: flex;
          flex-direction: column;
          gap: 40px;
          align-items: center;
          margin-top: 48px;
        }
        .orbit-img-left { flex-shrink: 0; width: 100%; }
        .orbit-img-left img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 12px;
          display: block;
        }
        .orbit-img-right { flex-shrink: 0; width: 100%; }
        .orbit-img-right img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 14px;
          display: block;
        }
        .orbit-middle { flex: 1; width: 100%; }
        .orbit-stat-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        .orbit-stat {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 84px;
          line-height: 1;
          color: #0d0d0d;
        }
        .orbit-stat-labels { display: flex; flex-direction: column; justify-content: center; }
        .orbit-stat-labels span {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;
          line-height: 1.25;
          color: #0d0d0d;
        }
        .orbit-divider { height: 1px; background: #e5e6eb; margin: 20px 0; }
        .orbit-copy p {
          margin: 0 0 12px;
          font-size: 14px;
          color: #555555;
          line-height: 1.7;
        }
        .orbit-copy p:last-child { margin-bottom: 0; }
        .orbit-cta-row {
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 20px;
        }
        .orbit-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border-radius: 9999px;
          padding: 6px 6px 6px 20px;
          background: #D5FE3E;
          text-decoration: none;
          transition: background 0.3s ease;
        }
        .orbit-cta-label {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #111111;
          transition: color 0.3s ease;
        }
        .orbit-cta-chip {
          width: 34px;
          height: 34px;
          background: #111111;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: background 0.3s ease, color 0.3s ease;
        }
        .orbit-cta-chip span {
          font-size: 16px;
          font-weight: 700;
          line-height: 1;
          transform: translateX(1px);
        }
        .orbit-cta:hover { background: #111111; }
        .orbit-cta:hover .orbit-cta-label { color: #ffffff; }
        .orbit-cta:hover .orbit-cta-chip { background: #ffffff; color: #111111; }
        .orbit-note {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #555555;
        }
        .orbit-note-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #c8f11a;
          flex-shrink: 0;
        }
        @media (min-width: 1024px) {
          .orbit-cols { flex-direction: row; }
          .orbit-img-left { width: 220px; }
          .orbit-img-right { width: 280px; }
        }
        @media (max-width: 640px) {
          .orbit-section { padding: 90px 20px; }
        }
      `}</style>

      <section className="orbit-section">
        <motion.div
          className="orbit-inner"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="orbit-header">
            <motion.div
              className="orbit-label-row"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="orbit-chip">💻</span>
              <span className="orbit-label">Software Engineer</span>
            </motion.div>
            <motion.h2
              className="orbit-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              I believe software isn&apos;t just about writing code, it&apos;s
              about building a clearer way for people to work.
            </motion.h2>
          </div>

          <div className="orbit-cols">
            <motion.div
              className="orbit-img-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <img
                src="/gallery/1.jpg"
                alt="Ritesh Yadav at work"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.div
              className="orbit-middle"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <div className="orbit-stat-row">
                <span className="orbit-stat">8+</span>
                <span className="orbit-stat-labels">
                  <span>SHIPPED</span>
                  <span>PROJECTS</span>
                </span>
              </div>
              <div className="orbit-divider" />
              <div className="orbit-copy">
                <p>
                  I combine data analytics, full-stack engineering and product
                  thinking to build systems that stay useful long after the
                  launch buzz fades, for clients at Gadget Mart and for my own
                  products like Therapeace.
                </p>
                <p>
                  I don&apos;t just ship features, I ship clarity. From Nepal
                  to Finland, every project has taught me the same lesson:
                  focus on the useful detail and the rest follows.
                </p>
              </div>
              <div className="orbit-cta-row">
                <a className="orbit-cta" href="/CV-UTU.pdf" target="_blank" rel="noreferrer">
                  <span className="orbit-cta-label">OPEN CV</span>
                  <span className="orbit-cta-chip">
                    <span>&raquo;</span>
                  </span>
                </a>
                <div className="orbit-note">
                  <span className="orbit-note-dot" />
                  Open to meaningful software, data and product work.
                </div>
              </div>
            </motion.div>

            <motion.div
              className="orbit-img-right"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <img
                src="/gallery/2.jpg"
                alt="Campus life in Finland"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

export default OrbitAbout;
