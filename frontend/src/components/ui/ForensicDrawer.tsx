"use client";

/**
 * ==========================================================================
 * NYAYA AI - FORENSIC DRAWER (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Slide-over Contextual Audit UI
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Two-Stage Paint Engine: Guarantees Tailwind transitions fire on mount.
 * 2. GPU Acceleration: 'transform-gpu' ensures 60fps sliding without layout thrashing.
 * 3. Safe Scroll Locking: Captures and restores prior overflow states perfectly.
 * 4. CSS Bezier Fix: Replaced invalid inline cubic-bezier with native Tailwind 'ease-out'.
 * 5. Button Safety: Enforced type="button" on action elements to prevent phantom submits.
 * ==========================================================================
 */

import React, { useEffect, useState, memo } from "react";
import { X, ShieldAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Strict Typing: Enforces exact data shapes for the rendering engine
export interface AuditData {
  id: string | undefined;
  proof: string | undefined;
  sdg: string | undefined;
  severity: "low" | "medium" | "high" | "critical" | undefined;
  // Fallbacks mapped for seamless integration with Dashboard 'Finding' types
  category?: string;
  fix?: string;
}

interface ForensicDrawerProps {
  isOpen: boolean;
  audit: AuditData | null;
  onClose: () => void;
}

// 2. Extracted color mapping for robust severity handling (O(1) lookup)
const SEVERITY_COLORS: Record<string, string> = {
  low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  high: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  critical: "text-red-400 bg-red-500/10 border-red-500/20",
};

export const ForensicDrawer = memo(function ForensicDrawer({ 
  isOpen, 
  audit, 
  onClose 
}: ForensicDrawerProps) {
  
  // 3. Two-Stage Mount Engine: Separates DOM insertion from CSS transition triggering
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isOpen) {
      setIsRendered(true);
      // 10ms micro-delay forces browser to calculate DOM insertion before applying opacity/transform
      timeoutId = setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for Tailwind duration (300ms) before ripping node from DOM
      timeoutId = setTimeout(() => setIsRendered(false), 300);
    }

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  // 4. Keyboard Accessibility: Close on 'Escape' key safely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 5. Scroll Lock: Prevent background page from scrolling (Restores original state)
  useEffect(() => {
    if (!isOpen) return;
    
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Don't render anything if it shouldn't be in the DOM or if data is missing
  if (!isRendered || !audit) return null;

  const severityData = audit.severity || "medium";
  const severityStyle = SEVERITY_COLORS[severityData];

  return (
    <>
      {/* Backdrop Overlay (Hardware Accelerated Fade) */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] cursor-pointer transition-opacity duration-300 ease-in-out transform-gpu",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />

      {/* The Drawer (Hardware Accelerated Slide) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={cn(
          "fixed inset-y-0 right-0 w-full max-w-lg bg-[#05050A] border-l border-white/10 z-[100] shadow-[-30px_0_60px_rgba(0,0,0,0.8)] flex flex-col transition-transform duration-300 ease-out transform-gpu will-change-transform",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-8 md:p-10 h-full flex flex-col min-h-0">
          
          {/* Header & Close Button */}
          <div className="flex justify-between items-start mb-10 shrink-0">
            <header>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" /> Internal Case File
              </p>
              <h3 id="drawer-title" className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase break-words">
                {audit.category || audit.id || "Audit Record"}
              </h3>
            </header>

            <button 
              type="button"
              onClick={onClose} 
              aria-label="Close drawer"
              className="p-2.5 text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transform-gpu active:scale-95"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable Content Frame */}
          <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-4 pb-6 min-h-0">
            
            {/* Reasoning Proof Section */}
            <section className="p-6 md:p-8 bg-black/40 rounded-[24px] border border-white/10 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" aria-hidden="true" />
                 Reasoning Proof (XAI)
               </h4>
               <p className="text-sm font-mono leading-[2] md:leading-[2.2] text-slate-300 break-words whitespace-pre-wrap selection:bg-indigo-500/40">
                 {audit.proof || audit.fix || "No explanation provided by Intelligence Core."}
               </p>
            </section>

            {/* Metadata Grid */}
            <section>
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                 Risk Attribution
               </h4>
               <div className="grid grid-cols-2 gap-4">
                  {/* SDG Metric */}
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-[20px] shadow-sm hover:border-white/10 transition-colors">
                     <p className="text-[9px] font-bold text-slate-600 uppercase mb-2 tracking-widest">SDG Metric</p>
                     <p className="text-xs md:text-sm font-black text-indigo-400 tabular-nums break-words">
                       {audit.sdg || "10.3 / Parity"}
                     </p>
                  </div>
                  
                  {/* Severity Badge */}
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-[20px] shadow-sm hover:border-white/10 transition-colors">
                     <p className="text-[9px] font-bold text-slate-600 uppercase mb-2 tracking-widest">Severity</p>
                     <div className={cn(
                       "inline-flex px-3 py-1.5 border rounded-lg", 
                       severityStyle
                     )}>
                       <p className="text-[10px] font-black uppercase tracking-widest">
                         {severityData}
                       </p>
                     </div>
                  </div>
               </div>
            </section>
          </div>

          {/* Fixed Footer Action */}
          <div className="pt-6 mt-auto border-t border-white/10 shrink-0">
            <button 
              type="button"
              onClick={onClose}
              className="w-full py-4 md:py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-[11px] rounded-[16px] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05050A] shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transform-gpu flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              Sign-Off Audit Report
            </button>
          </div>
          
        </div>
      </div>
    </>
  );
});