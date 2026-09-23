"use client";

import React from "react";
import { LogoMarquee, type Logo } from "./logo-marquee";

// Ritesh's real stack, straight from the Skills highlight. Logos come from
// the Simple Icons CDN; the marquee pauses on hover so they are readable.

const logos: Logo[] = [
  { src: "https://cdn.simpleicons.org/python/3776AB", alt: "Python" },
  { src: "https://cdn.simpleicons.org/react/61DAFB", alt: "React" },
  { src: "https://cdn.simpleicons.org/javascript/F7DF1E", alt: "JavaScript" },
  { src: "https://cdn.simpleicons.org/typescript/3178C6", alt: "TypeScript" },
  { src: "https://cdn.simpleicons.org/nodedotjs/5FA04E", alt: "Node.js" },
  { src: "https://cdn.simpleicons.org/django/44B78B", alt: "Django" },
  { src: "https://cdn.simpleicons.org/flask/000000", alt: "Flask" },
  { src: "https://cdn.simpleicons.org/pandas/150458", alt: "Pandas" },
  { src: "https://cdn.simpleicons.org/scikitlearn/F7931E", alt: "scikit-learn" },
  { src: "https://cdn.simpleicons.org/tensorflow/FF6F00", alt: "TensorFlow" },
  { src: "https://cdn.simpleicons.org/mysql/4479A1", alt: "MySQL" },
  { src: "https://cdn.simpleicons.org/git/F05032", alt: "Git" },
  { src: "https://cdn.simpleicons.org/cplusplus/00599C", alt: "C++" },
  { src: "https://cdn.simpleicons.org/amazonwebservices/FF9900", alt: "AWS" },
];

export function TechStack() {
  return (
    <>
      <style>{`
        .stack-marquee {
          max-width: 1200px;
          margin: 0 auto;
          overflow: hidden;
          padding: 8px 0 4px;
          -webkit-mask-image: linear-gradient(to right, transparent, black 25%, black 75%, transparent);
          mask-image: linear-gradient(to right, transparent, black 25%, black 75%, transparent);
        }
        .marquee-overflow { overflow: hidden; }
        .marquee-track {
          display: flex;
          width: max-content;
          align-items: center;
        }
        .marquee-logo {
          pointer-events: none;
          user-select: none;
          height: 22px;
          width: auto;
          display: block;
          opacity: 0.75;
          transition: opacity 0.2s ease;
        }
        .marquee-logo:hover { opacity: 1; }
      `}</style>
      <LogoMarquee logos={logos} />
    </>
  );
}

export default TechStack;
