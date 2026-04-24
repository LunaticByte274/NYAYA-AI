"use client";

/**
 * ==========================================================================
 * NYAYA AI - FAIRNESS GAUGE KERNEL (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Hardware-Accelerated Data Visualization & Parity Tracking
 * * CORE ENHANCEMENTS APPLIED:
 * 1. SVG ViewBox Lock: Prevented responsive distortion across mobile devices.
 * 2. Geometric Pivot Fix: Rotated SVG starting coordinate to 9 O'Clock position.
 * 3. Component wrapped in React.memo() to decouple from Dashboard updates.
 * 4. Math Engine Memoization: Prevents recalculation of circumferences on ticks.
 * 5. GPU Acceleration: 'transform-gpu' and 'will-change' added to needle and strokes.
 * 6. Tabular Numerics: Enforced on the final text readout to prevent jitter.
 * ==========================================================================
 */

import React, { useEffect, useState, useMemo, useId, memo } from "react";
import { cn } from "@/lib/utils";

interface FairnessGaugeProps {
  score: number;
  className?: string;
  label?: string;
}

// 1. Math constants hoisted outside to prevent recalculation on every render tick
// Based on container width 192px (w-48), center 96px, padding for stroke-width 12px
const RADIUS = 84; 
const HALF_CIRCUMFERENCE = Math.PI * RADIUS; // ~263.89

export const FairnessGauge = memo(function FairnessGauge({ 
  score, 
  className, 
  label = "Fairness Score" 
}: FairnessGaugeProps) {
  
  // 2. Unique IDs prevent SVG gradient clashing if multiple gauges render simultaneously
  const gradientId = useId();

  // 3. Data Integrity: Protects against NaN, negative numbers, or numbers > 100
  const clampedScore = useMemo(() => {
    if (typeof score !== "number" || isNaN(score)) return 0;
    return Math.max(0, Math.min(100, score));
  }, [score]);

  // 4. Mount Animation State: Allows the gauge to "fill up" smoothly on component load
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Slight delay ensures the CSS engine registers the initial 0 state before updating the DOM
    const timer = setTimeout(() => setAnimatedScore(clampedScore), 50);
    return () => clearTimeout(timer);
  }, [clampedScore]);

  // 5. Hardware-optimized mathematics (Calculates exactly once per score change)
  const rotation = useMemo(() => {
    return (animatedScore / 100) * 180 - 90;
  }, [animatedScore]);

  const strokeDashoffset = useMemo(() => {
    return HALF_CIRCUMFERENCE - (animatedScore / 100) * HALF_CIRCUMFERENCE;
  }, [animatedScore]);

  // 6. Dynamic color interpolation for typography based on threshold severity
  const scoreColor = useMemo(() => {
    if (animatedScore < 40) return "text-red-500";
    if (animatedScore < 75) return "text-amber-500";
    return "text-emerald-500";
  }, [animatedScore]);

  return (
    <div 
      className={cn(
        "relative w-48 h-24 flex items-end justify-center whitespace-nowrap shrink-0 tabular-nums overflow-hidden transform-gpu", 
        className
      )}
      // Accessibility (A11y): Vital for screen readers interpreting data visualizations
      role="meter"
      aria-label={label}
      aria-valuenow={clampedScore}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Gauge Background Track (Fixed border-b-0 to prevent bottom bleed) */}
      <div 
        className="absolute inset-0 border-[12px] border-b-0 border-white/5 rounded-t-full pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Dynamic Progress Indicator (GPU Accelerated SVG) */}
      {/* viewBox locked to 192x96 (w-48 h-24) to prevent responsive scaling distortion */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none transform-gpu will-change-transform"
        viewBox="0 0 192 96"
        aria-hidden="true" 
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />   {/* Red (High Risk) */}
            <stop offset="50%" stopColor="#f59e0b" />  {/* Amber (Warning) */}
            <stop offset="100%" stopColor="#10b981" /> {/* Green (Parity) */}
          </linearGradient>
        </defs>
        
        {/* rotate(-180 96 96) forces the SVG to start drawing from the left (9 o'clock) instead of right (3 o'clock) */}
        <circle
          cx="96" 
          cy="96" 
          r={RADIUS}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="12"
          strokeDasharray={HALF_CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-180 96 96)"
          className="transition-all duration-1000 ease-out transform-gpu"
          style={{ willChange: "stroke-dashoffset" }}
        />
      </svg>

      {/* The Neural Needle */}
      <div 
        className="absolute bottom-0 w-1 h-20 bg-white origin-bottom transition-transform duration-1000 ease-out z-10 transform-gpu"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          willChange: "transform" 
        }}
        aria-hidden="true"
      >
        {/* Geometric Pivot Base */}
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
      </div>

      {/* Typography Readout Overlay */}
      <div className="absolute bottom-0 text-center z-20 pb-1 pointer-events-none">
        <span className={cn("text-2xl font-black tracking-tighter tabular-nums drop-shadow-md transition-colors duration-1000", scoreColor)}>
          {Math.round(animatedScore)}%
        </span>
      </div>
    </div>
  );
});