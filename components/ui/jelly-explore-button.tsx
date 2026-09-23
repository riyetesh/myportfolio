"use client";

import React, { useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

interface JellyExploreButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  color?: string;
  width?: number;
  height?: number;
  fontSize?: number;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function JellyExploreButton({
  children,
  onClick,
  className = "",
  disabled = false,
  color = '#3344cd',
  width = 190,
  height = 58,
  fontSize = 20,
}: JellyExploreButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20 };
  
  const blobX = useSpring(mouseX, springConfig);
  const blobY = useSpring(mouseY, springConfig);

  const BLOB_SIZE = 70;

  const bodyX = useTransform(blobX, [-100, 0, 100], [-2, 0, 2]);
  const bodyY = useTransform(blobY, [-50, 0, 50], [-1, 0, 1]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleClick = () => {
    if (!disabled && onClick) onClick();
  };

  const scaleValue = isPressed ? 0.94 : isHovered ? 1.02 : 1;

  const uniqueId = React.useId().replace(/:/g, '-');
  const filterId = `gooey-${uniqueId}`;

  return (
    <>
      <style>{`
        .suede-hitbox-${uniqueId} {
          position: relative;
          width: ${width}px;
          height: ${height}px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: ${disabled ? 'not-allowed' : 'pointer'};
          opacity: ${disabled ? 0.5 : 1};
          z-index: 20;
        }

        .gooey-container-${uniqueId} {
          filter: url(#${filterId});
          position: absolute;
          inset: -80px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .shadow-${uniqueId} {
          position: absolute;
          width: 90%;
          height: 80%;
          background: rgba(0,0,0,0.8);
          filter: blur(25px);
          border-radius: 9999px;
          z-index: -1;
          transform: translateY(12px);
          opacity: 0.6;
        }

        .label-${uniqueId} {
          color: white;
          font-weight: 700;
          font-size: ${fontSize}px;
          letter-spacing: -0.02em;
          z-index: 20;
          user-select: none;
          pointer-events: none;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
      `}</style>

      <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div 
        className={`suede-hitbox-${uniqueId} ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => !disabled && setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={handleClick}
      >
        <div className={`shadow-${uniqueId}`} />

        <div className={`gooey-container-${uniqueId}`}>
          <motion.div
            style={{
              x: bodyX,
              y: bodyY,
              width: width,
              height: height,
              borderRadius: '9999px',
              backgroundColor: color,
              position: 'absolute'
            }}
            animate={{ scale: scaleValue }}
            transition={springConfig}
          />

          {isHovered && (
            <motion.div
              className="absolute rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                width: BLOB_SIZE,
                height: BLOB_SIZE,
                backgroundColor: color,
                x: blobX,
                y: blobY,
              }}
            />
          )}
        </div>

        <motion.div
          className="absolute overflow-hidden pointer-events-none z-10"
          style={{
            x: bodyX,
            y: bodyY,
            width: width,
            height: height,
            borderRadius: '9999px',
            backgroundColor: color,
          }}
          animate={{ scale: scaleValue }}
          transition={springConfig}
        />

        <motion.span 
          className={`label-${uniqueId}`}
          style={{ 
            x: useTransform(blobX, (v) => v * 0.05),
            y: useTransform(blobY, (v) => v * 0.05)
          }}
          animate={{ scale: isPressed ? 0.96 : 1 }}
          transition={springConfig}
        >
          {children}
        </motion.span>
      </div>
    </>
  );
}

export default JellyExploreButton;
