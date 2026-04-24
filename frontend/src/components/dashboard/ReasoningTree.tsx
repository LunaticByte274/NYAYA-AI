"use client";

import React, { useMemo, memo } from "react";
import { motion, Variants } from "framer-motion";
import { Search, Network, Globe, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReasoningTree as ReasoningTreeType } from "@/types";

/**
 * ==========================================================================
 * NYAYA AI - EXPLAINABLE AI (XAI) REASONING TREE (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Forensic Logic Visualization & XAI Transparency
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Timeline Geometry Fix: Recalculated absolute positioning for pixel-perfect line/node intersection.
 * 2. React.memo() Isolation: Prevents timeline re-rendering during parent state changes.
 * 3. Extracted Animation Variants: Moved Framer Motion variants outside component to save CPU cycles.
 * 4. Strict Typings: Replaced 'any' with 'Variants' from framer-motion.
 * 5. GPU Acceleration: Added 'transform-gpu' and 'will-change' to animated nodes safely.
 * 6. Accessibility: Enforced proper ARIA list hierarchies.
 * 7. Explicit DevTools Binding: Added displayName for precise React profiling.
 * ==========================================================================
 */

interface ReasoningTreeProps {
  data?: ReasoningTreeType | null;
}

// 1. HARDWARE-ACCELERATED ANIMATION VARIANTS (EXTRACTED)
// Moving these outside prevents object recreation on every React tick, ensuring smooth 60fps springs
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20, filter: "blur(4px)" },
  show: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 14 
    } 
  }
};

export const ReasoningTree = memo(function ReasoningTree({ data }: ReasoningTreeProps) {
  
  // 2. MEMOIZED DATA TRANSFORMATION
  // Safely maps the incoming data payload to the visual node structure
  const steps = useMemo(() => {
    if (!data) return [];
    
    return [
      { 
        label: "Classification", 
        val: data.type, 
        icon: Search, 
        textColor: "text-cyan-400", 
        nodeColor: "border-cyan-400", 
        glow: "shadow-[0_0_12px_rgba(34,211,238,0.5)]" 
      },
      { 
        label: "Root Cause Engine", 
        val: data.cause, 
        icon: Network, 
        textColor: "text-slate-200", 
        nodeColor: "border-indigo-500", 
        glow: "shadow-[0_0_12px_rgba(79,70,229,0.5)]" 
      },
      { 
        label: "Societal Impact", 
        val: data.impact, 
        icon: Globe, 
        textColor: "text-red-400", 
        nodeColor: "border-red-500", 
        glow: "shadow-[0_0_12px_rgba(239,68,68,0.5)]" 
      }
    ];
  }, [data]);

  // 3. ENTERPRISE EMPTY STATE
  if (!data || steps.length === 0) {
    return (
      <div 
        className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-slate-500 mt-6 shrink-0 transform-gpu"
        role="status"
        aria-label="XAI Reasoning Data Unavailable"
      >
        <AlertTriangle className="w-4 h-4 opacity-50" aria-hidden="true" />
        <span className="text-[10px] font-mono uppercase tracking-widest">XAI Ratiocination Unavailable</span>
      </div>
    );
  }

  // 4. ACTIVE RENDER TREE
  return (
    <motion.div 
      // Geometric Lock: pl-8 (32px padding) sets up the exact grid for the child absolute nodes
      className="mt-8 space-y-8 relative pl-8 transform-gpu will-change-[opacity]"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      role="list"
      aria-label="AI Reasoning Steps"
    >
      {/* Ambient Animated Connection Line */}
      {/* Geometric Lock: left-[15px] places the exact 1px center of this line at 16px */}
      <div 
        className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-cyan-400 via-indigo-500 to-red-500 opacity-30 rounded-full"
        aria-hidden="true"
      />
      
      {steps.map((step, i) => (
        <motion.div 
          key={i}
          variants={itemVariants}
          className="flex flex-col gap-2 relative group transform-gpu will-change-[opacity,transform]"
          role="listitem"
        >
          {/* Glowing Neural Node */}
          {/* Geometric Lock: -left-[22px] exactly offsets the 32px padding to land the 12px node center directly on the 16px line */}
          <div 
            className={cn(
              "absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-[#05050A] border-[3px] z-10 transition-transform duration-300 group-hover:scale-125 shadow-lg",
              step.nodeColor,
              step.glow
            )}
            aria-hidden="true"
          />
          
          {/* Step Header */}
          <div className="flex items-center gap-2.5">
            <step.icon className={cn("w-3.5 h-3.5", step.textColor)} aria-hidden="true" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
              {step.label}
            </span>
          </div>
          
          {/* Step Output */}
          <p className={cn("text-sm font-medium leading-relaxed mt-1 break-words whitespace-pre-wrap", step.textColor)}>
            {step.val}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
});

// Explicit DevTools Binding
ReasoningTree.displayName = "ReasoningTree";