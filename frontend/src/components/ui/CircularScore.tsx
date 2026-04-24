"use client";

/**
 * ==========================================================================
 * NYAYA AI - CIRCULAR SCORE INDICATOR (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Hardware-Accelerated KPI Visualization
 * * CORE ENHANCEMENTS APPLIED:
 * 1. React.memo() Isolation: Prevents UI stuttering during parent re-renders.
 * 2. GPU Acceleration: 'transform-gpu' and 'will-change' applied to SVG strokes.
 * 3. Memoized Math: Calculates circumference offsets and colors strictly once.
 * 4. Tabular Numerics: Enforced on the score text to prevent layout jitter.
 * 5. A11y Standardized: ARIA meter roles strictly defined for screen readers.
 * 6. Dynamic Color Interpolation: Tied color engine to animated state for smooth fade.
 * 7. DevTools Shield: Injected explicit displayName for React Profiler tracking.
 * ==========================================================================
 */

import React, { useEffect, useState, useMemo, memo } from "react";
import { cn } from "@/lib/utils";

interface CircularScoreProps {
  score: number;
  label?: string;
  className?: string; // Allows safe styling overrides from parent grids
}

// 1. Extracted constants outside the component so they aren't recalculated on every render tick
// Based on viewBox 80x80, center at 40x40. Radius 36 + stroke 3 = 39 (safely inside the 40 bounds)
const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const CircularScore = memo(function CircularScore({ 
  score, 
  label = "Risk Score", 
  className 
}: CircularScoreProps) {
  
  // 2. Data Integrity: Clamp the score strictly between 0 and 100 to prevent SVG breakage
  const clampedScore = useMemo(() => Math.min(100, Math.max(0, score)), [score]);
  
  // 3. Mount Animation State: Start at 0, then animate to the actual score for fluid UI mounting
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Delaying the state update slightly ensures the CSS hardware transition catches the change on mount
    const timer = setTimeout(() => setAnimatedScore(clampedScore), 50);
    return () => clearTimeout(timer);
  }, [clampedScore]);

  // 4. Memoized Physics Math (Calculates exactly once per score change)
  const strokeDashoffset = useMemo(() => {
    return CIRCUMFERENCE - (animatedScore / 100) * CIRCUMFERENCE;
  }, [animatedScore]);
  
  // 5. Memoized Color Computation (Emerald -> Amber -> Red routing)
  // Tied to 'animatedScore' so CSS can natively interpolate the hex codes during the fill animation
  const color = useMemo(() => {
    return animatedScore > 60 ? "#EF4444" : animatedScore > 30 ? "#F59E0B" : "#10B981";
  }, [animatedScore]);

  return (
    <div 
      className={cn("relative flex items-center justify-center w-28 h-28 group transform-gpu shrink-0", className)}
      // 6. Accessibility (a11y): Explicitly define this as a meter for screen readers
      role="meter"
      aria-label={label}
      aria-valuenow={clampedScore}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg 
        className="absolute inset-0 transform -rotate-90 w-full h-full drop-shadow-xl pointer-events-none will-change-transform" 
        viewBox="0 0 80 80"
        aria-hidden="true" // Hide raw SVG from screen readers since the parent div handles a11y bounds
      >
        {/* Background Track Circle */}
        <circle 
          cx="40" 
          cy="40" 
          r={RADIUS} 
          stroke="rgba(255,255,255,0.05)" 
          strokeWidth="6" 
          fill="none" 
        />
        {/* Animated Progress Circle (GPU Accelerated) */}
        <circle 
          cx="40" 
          cy="40" 
          r={RADIUS} 
          stroke={color} 
          strokeWidth="6" 
          fill="none" 
          strokeDasharray={CIRCUMFERENCE} 
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out transform-gpu"
          style={{ 
            // Hex + 80 appends 50% opacity to the drop shadow matching the exact stroke color
            filter: `drop-shadow(0 0 6px ${color}80)`,
            willChange: "stroke-dashoffset, stroke" 
          }}
        />
      </svg>
      
      {/* Centered Typography Unit */}
      <div className="absolute flex flex-col items-center justify-center z-10 pointer-events-none">
        <span 
          className="text-3xl font-black leading-none tracking-tighter transition-colors duration-1000 tabular-nums drop-shadow-md" 
          style={{ color }}
        >
          {clampedScore}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-1 group-hover:text-slate-400 transition-colors duration-300">
          {label}
        </span>
      </div>
    </div>
  );
});

// 7. Explicit DevTools Binding
CircularScore.displayName = "CircularScore";