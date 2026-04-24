"use client";

import React, { useMemo, memo } from "react";
import type { Finding } from "@/types";
import { cn } from "@/lib/utils";

/**
 * ==========================================================================
 * NYAYA AI - LIVE HIGHLIGHTER (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Forensic Text Heatmap & Overlap-Safe Parsing
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Z-Index Stacking Fixed: Tooltips now safely overlap adjacent highlights.
 * 2. Severity Expansion: Added support for 'critical' tier risk mappings.
 * 3. React.memo() Isolation: Decouples rendering from parent dashboard ticks.
 * 4. O(N log N) Overlap Shield: Safely clamps overlapping tensor indices.
 * 5. A11y & Keyboard Nav: Full ARIA dialog hooks + Tab/Enter/Space controls.
 * 6. Explicit DevTools Binding: Added displayName for precise profiling.
 * ==========================================================================
 */

interface LiveHighlighterProps {
  text: string;
  findings: Finding[];
  onClickFinding?: (finding: Finding) => void;
}

export const LiveHighlighter = memo(function LiveHighlighter({ 
  text, 
  findings,
  onClickFinding 
}: LiveHighlighterProps) {
  
  // Memoize the parsing logic to prevent expensive string manipulations on every re-render
  const elements = useMemo(() => {
    if (!text) return null;
    
    // Fast path: No findings, just render the text normally
    if (!findings || findings.length === 0) {
      return (
        <span className="text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
          {text}
        </span>
      );
    }

    const result: React.ReactNode[] = [];
    let lastIndex = 0;

    // Sort by start index. If they start at the same place, prioritize the longest match.
    const sorted = [...findings].sort((a, b) => {
      if (a.startIndex === b.startIndex) {
        return (b.endIndex - b.startIndex) - (a.endIndex - a.startIndex);
      }
      return a.startIndex - b.startIndex;
    });

    sorted.forEach((finding, idx) => {
      // OVERLAP PROTECTION: If a finding overlaps with the previous one, clamp its start index.
      // This prevents negative slicing which results in missing text or application crashes.
      const actualStart = Math.max(lastIndex, finding.startIndex);
      
      // If the finding is completely swallowed by the previous one, skip it safely.
      if (actualStart >= finding.endIndex) return;

      // 1. Add unhighlighted text before this finding
      if (actualStart > lastIndex) {
        result.push(
          <span key={`text-${idx}-${lastIndex}-${actualStart}`} className="opacity-70 transition-opacity duration-300 hover:opacity-100">
            {text.slice(lastIndex, actualStart)}
          </span>
        );
      }

      // 2. Add the highlighted interactive text node
      // Expansion: Safely catch both high and critical severity levels
      const isHighRisk = finding.severity === "high" || finding.severity === "critical";
      
      const colorClass = isHighRisk 
        ? "bg-red-500/20 text-red-300 border-red-500/50 shadow-[0_2px_10px_rgba(239,68,68,0.15)]" 
        : "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_2px_10px_rgba(245,158,11,0.15)]";
      
      const findingText = text.slice(actualStart, finding.endIndex);
      
      result.push(
        <mark 
          key={`mark-${idx}-${actualStart}-${finding.endIndex}`} 
          tabIndex={0}
          role="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-describedby={`tooltip-${idx}`}
          onClick={() => onClickFinding?.(finding)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClickFinding?.(finding);
            }
          }}
          className={cn(
            colorClass,
            // Base geometry & interactions
            "border-b px-1.5 py-0.5 mx-0.5 rounded-md cursor-pointer relative group transition-all duration-300 hover:bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020205]",
            // Focus ring color mapping
            isHighRisk ? "focus:ring-red-500 hover:border-red-400" : "focus:ring-amber-500 hover:border-amber-400",
            // CRITICAL Z-INDEX FIX: Ensures tooltips don't get trapped under adjacent highlighted words
            "z-10 hover:z-[60] focus:z-[60]"
          )}
        >
          {findingText}

          {/* Floating Diagnostic Tooltip */}
          <span 
            id={`tooltip-${idx}`}
            role="tooltip"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[280px] p-4 bg-black/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] text-white text-xs rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 transform-gpu translate-y-2 group-hover:translate-y-0 group-focus:translate-y-0"
          >
            <span className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
              <span 
                aria-hidden="true" 
                className={cn(
                  "w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]", 
                  isHighRisk ? "bg-red-500 text-red-500 animate-pulse" : "bg-amber-500 text-amber-500"
                )} 
              />
              <strong className="text-slate-200 tracking-[0.2em] uppercase text-[10px]">
                {finding.category || "Forensic Flag"}
              </strong>
            </span>
            <span className="text-slate-400 leading-relaxed block break-words whitespace-normal">
               Recommended Fix: <span className="text-emerald-400 font-mono bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">{finding.fix || "Redact variable"}</span>
            </span>
            
            {/* Click to open indicator */}
            <span className="block mt-3 text-[9px] text-indigo-400 uppercase tracking-widest font-black opacity-80">
              Click to view deep analysis →
            </span>
          </span>
        </mark>
      );
      
      lastIndex = finding.endIndex;
    });

    // 3. Append any remaining text after the final finding
    if (lastIndex < text.length) {
      result.push(
        <span key={`text-end-${lastIndex}`} className="opacity-70 transition-opacity duration-300 hover:opacity-100">
          {text.slice(lastIndex)}
        </span>
      );
    }
    
    return result;
  }, [text, findings, onClickFinding]);

  if (!text) return null;

  return (
    <div className="font-mono text-sm md:text-base leading-[2.2] text-slate-200 whitespace-pre-wrap selection:bg-indigo-500/40">
      {elements}
    </div>
  );
});

// Explicit DevTools Binding
LiveHighlighter.displayName = "LiveHighlighter";