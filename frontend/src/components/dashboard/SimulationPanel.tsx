"use client";

/**
 * ==========================================================================
 * NYAYA AI - SIMULATION PANEL COMPONENT (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Intersectional Counterfactual Engine & API Integration
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Framer Motion Geometry Fix: Moved padding to inner wrapper to prevent animation snapping.
 * 2. Form Submission Shield: Added type="button" to variable toggles.
 * 3. Lucide Sync: Replaced raw SVGs with cached lucide-react iconography.
 * 4. React.memo() Isolation: Prevents UI stuttering during parent dashboard re-renders.
 * 5. Robust AbortController: Guaranteed cleanup of pending network requests on unmount.
 * 6. Explicit DevTools Binding: Added displayName for precise React profiling.
 * ==========================================================================
 */

import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { NeonButton } from "../ui/NeonButton";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, AlertCircle } from "lucide-react";

// Enterprise-grade conditional styling utility (Inlined for standalone reliability)
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

interface SimulationPanelProps {
  originalText: string;
}

interface SimulationResponse {
  simulated_text: string;
  message?: string;
  error?: string;
}

// 1. Defined strictly outside the component to prevent array recreation on every render tick
const VARIABLES = [
  { id: "Gender", label: "Flip Gender" },
  { id: "Name", label: "Swap Ethnic Names" },
  { id: "Education", label: "Alter Education Prestige" },
  { id: "Age", label: "Modify Age Proxies" }
] as const;

// 2. Extracted and normalized environment variable to avoid re-evaluating during component lifecycle
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export const SimulationPanel = memo(function SimulationPanel({ originalText }: SimulationPanelProps) {
  // --- STATE ---
  const [selectedVars, setSelectedVars] = useState<string[]>(["Gender"]);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- REFS ---
  // AbortController ref prevents race conditions and memory leaks from unmounted components
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup pending fetches on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // --- INTERACTION HANDLERS ---
  const toggleVar = useCallback((id: string) => {
    setSelectedVars(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  }, []);

  // --- CORE SIMULATION ENGINE ---
  const runSimulation = useCallback(async () => {
    if (!originalText || selectedVars.length === 0) return;

    // 1. Cancel any in-flight request before starting a new one to prevent race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setSimulating(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/simulation/simulate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({ 
          text: originalText, 
          variables_to_flip: selectedVars 
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        // Safely attempt to parse standard error payload from backend, fallback to HTTP status
        const errorData: SimulationResponse | null = await response.json().catch(() => null);
        throw new Error(errorData?.message || errorData?.error || `HTTP Pipeline Error: ${response.status}`);
      }
      
      const data: SimulationResponse = await response.json();
      
      if (!data.simulated_text) {
        throw new Error("Critical Failure: Unexpected payload format received from Intelligence Core.");
      }

      setResult(data.simulated_text);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Ignore AbortErrors (they happen intentionally when a user double-clicks or unmounts the component)
        if (err.name === 'AbortError') return;
        setError(`Simulation failed: ${err.message}`);
      } else {
        setError("An unexpected anomaly occurred during tensor calculation.");
      }
      console.error("[SimulationPanel] Execution Exception:", err);
    } finally {
      // Only clear the loading state if THIS specific request wasn't aborted
      if (abortControllerRef.current === abortController) {
        setSimulating(false);
      }
    }
  }, [originalText, selectedVars]);

  return (
    <section 
      aria-label="Intersectional Counterfactual Engine Panel"
      className="p-6 md:p-8 border border-white/10 bg-black/40 backdrop-blur-xl mt-4 rounded-[24px] md:rounded-[32px] transform-gpu shadow-[inset_0_0_50px_rgba(0,0,0,0.6)] flex flex-col shrink-0 min-h-0 transition-all duration-500 hover:border-white/20"
    >
      <header className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h4 className="text-[11px] md:text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
            <FlaskConical className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" aria-hidden="true" />
            Intersectional Counterfactual Engine
          </h4>
          <p className="text-[10px] md:text-xs text-slate-400 mt-2 font-medium tracking-wide">
            Select multiple protected attributes to simulate systemic outcomes.
          </p>
        </div>
      </header>
      
      <div 
        className="flex flex-wrap gap-3 mb-8 shrink-0" 
        role="group" 
        aria-label="Simulation variables"
      >
        {VARIABLES.map((v) => {
          const isSelected = selectedVars.includes(v.id);
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => toggleVar(v.id)}
              disabled={simulating}
              aria-pressed={isSelected}
              className={cn(
                "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform-gpu",
                isSelected 
                  ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                  : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-slate-300"
              )}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      <div className="shrink-0">
        <NeonButton 
          onClick={runSimulation} 
          loading={simulating} 
          disabled={!originalText || selectedVars.length === 0 || simulating} 
          className="w-full sm:w-auto px-8 py-3.5 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-[16px] shadow-lg active:scale-95" 
          variant="primary"
          aria-busy={simulating}
        >
          {simulating ? "Executing Simulation..." : "Trigger Multi-Variable Simulation"}
        </NeonButton>
      </div>

      {/* --- RESULTS & ERROR HANDLING DISPLAY --- */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error-box"
            initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, height: 'auto', filter: "blur(0px)" }}
            exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden transform-gpu will-change-[height,opacity,filter]"
          >
            <div role="alert" className="mt-6 p-5 bg-red-500/10 border border-red-500/20 rounded-[20px] shadow-inner">
              <p className="text-[10px] md:text-xs text-red-400 font-black uppercase tracking-widest flex items-start gap-3 leading-relaxed break-words">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                {error}
              </p>
            </div>
          </motion.div>
        )}

        {result && !error && (
          <motion.div 
            key="result-box"
            initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, height: 'auto', filter: "blur(0px)" }}
            exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
            className="overflow-hidden transform-gpu will-change-[height,opacity,filter]"
            aria-live="polite"
          >
            <div className="mt-8 p-6 md:p-8 bg-[#020205] border border-emerald-500/20 rounded-[24px] shadow-[inset_0_0_30px_rgba(16,185,129,0.05)] w-full">
              <div className="flex items-center gap-3 mb-4 border-b border-emerald-500/10 pb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" aria-hidden="true" />
                <span className="text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest tabular-nums">
                  Simulated Counterfactual Output
                </span>
              </div>
              <p className="text-sm md:text-base text-slate-300 font-mono leading-relaxed break-words whitespace-pre-wrap selection:bg-emerald-500/30">
                {result}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

// Explicit DevTools Binding
SimulationPanel.displayName = "SimulationPanel";