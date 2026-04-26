"use client";

/**
 * ==========================================================================
 * NYAYA AI - COUNTERFACTUAL SANDBOX (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Real-time Multi-Layer Perceptron XAI Perturbation Simulator
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Geometry Clipping Fixed: Recalculated the central scoreboard grid flex boundaries.
 * 2. React.memo() Isolation: Decoupled ServerSafeClock to prevent 1s render loops.
 * 3. Button Safety: Enforced type="button" to prevent phantom form submissions.
 * 4. Memory-Safe Cleanups: Strict Abort patterns for active simulation intervals.
 * 5. Tabular-nums: Applied to log timestamps and score deltas to prevent UI jitter.
 * 6. Explicit DevTools Binding: Added displayName for precise React profiling.
 * 7. LINTER FINALE: Removed zero-fractions, swapped to globalThis, extracted nested ternaries.
 * 8. 🚨 ULTIMATE COMPLIANCE: Upgraded Telemetry array keys (S6479) and implemented strict Optional Chaining (S6582) to eliminate the final SonarQube warnings.
 * ==========================================================================
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { 
  Activity, 
  TerminalSquare, 
  Clock, 
  ArrowRight, 
  AlertTriangle, 
  Cpu, 
  RefreshCcw,
  Zap,
  MapPin,
  User,
  Briefcase,
  Layers,
  ChevronRight,
  ShieldCheck,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils"; 

// --- STRICT TYPING ---
interface TelemetryLog {
  id: string;
  text: string;
  timestamp: string;
}

// --- PERFORMANCE OPTIMIZATION: ISOLATED CLOCK ---
const ServerSafeClock = memo(function ServerSafeClock() {
  const [time, setTime] = useState("--:--:-- UTC");
  
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { 
        hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
      }) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase tabular-nums">{time}</span>;
});
ServerSafeClock.displayName = "ServerSafeClock";

// --- MASTER COMPONENT ---
export default function CounterfactualSandbox() {
  // --- CORE STATE ARCHITECTURE ---
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState({ 
    gender: "Male", 
    age: "25", 
    zip: "10001",
    experience: "3 Years"
  });
  
  const [loading, setLoading] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [neuralLog, setNeuralLog] = useState<TelemetryLog[]>([]);

  // Simulation Mathematics (In production, driven by FastAPI Engine)
  const originalScore = 85;
  const simulatedScore = hasSimulated ? 42.4 : 85;
  const delta = (simulatedScore - originalScore).toFixed(1);

  // Strict DOM & Memory Refs
  const logEndRef = useRef<HTMLDivElement>(null);
  const activeSimRef = useRef<boolean>(false);
  const telemetryIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. HYDRATION ANCHOR
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. AUTO-SCROLL TELEMETRY ENGINE
  useEffect(() => {
    if (logEndRef.current && (loading || hasSimulated)) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [neuralLog, loading, hasSimulated]);

  // 3. MEMORY-SAFE CLEANUP
  useEffect(() => {
    activeSimRef.current = true;
    return () => {
      activeSimRef.current = false;
      if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current);
    };
  }, []);

  // 4. POWER-USER KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (!loading) handleSimulate();
      }
    };
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, profile]);

  // 5. MEMOIZED SIMULATION DATA
  const simulationLogs = useMemo(() => [
    "Initializing Counterfactual Engine...",
    "Isolating Protected Variables...",
    `Perturbing [Zip Code] Tensor: 10001 -> ${profile.zip || 'N/A'}...`,
    `Perturbing [Age] Tensor: 25 -> ${profile.age || 'N/A'}...`,
    "Recalculating Multi-Layer Perceptron Weights...",
    "Detecting Correlated Proxy Shifts...",
    `Zip Code ${profile.zip || 'N/A'} strongly correlates with demographic variance...`,
    "Calculating Disparate Impact Delta...",
    "Simulation Complete. Compiling XAI Proof...",
  ], [profile.zip, profile.age]);

  // 6. BULLETPROOF SIMULATION HANDLER
  const handleSimulate = useCallback(() => {
    setLoading(true);
    setHasSimulated(false);
    setNeuralLog([]);
    
    if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current);
    
    let msgIndex = 0;
    telemetryIntervalRef.current = setInterval(() => {
      if (!activeSimRef.current) {
        if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current);
        return;
      }

      if (msgIndex < simulationLogs.length) {
        const nextMessage = simulationLogs[msgIndex] || "";
        const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // LINTER FIX (S6479): Upgrade string arrays to Object UUIDs
        setNeuralLog(prev => [...prev, { 
          id: `sim-log-${Date.now()}-${msgIndex}`, 
          text: nextMessage, 
          timestamp: timeNow 
        }]);
        
        msgIndex++;
      } else {
        if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current);
        if (activeSimRef.current) {
          setLoading(false);
          setHasSimulated(true);
        }
      }
    }, 450); 
  }, [simulationLogs]);

  // 7. INPUT MATRIX CONFIGURATION
  const inputConfig = useMemo(() => [
    { key: "gender", label: "Gender Identity", icon: User, ph: "e.g., Female" },
    { key: "age", label: "Age Bracket", icon: Clock, ph: "e.g., 55" },
    { key: "zip", label: "Postal / Zip Code", icon: MapPin, ph: "e.g., 10453" },
    { key: "experience", label: "Experience Level", icon: Briefcase, ph: "e.g., 10 Years" },
  ], []);

  const getArrowStyle = () => {
    if (loading) return "text-indigo-500 animate-pulse translate-x-2 md:translate-x-4";
    if (hasSimulated) return "text-red-500";
    return "text-slate-800";
  };

  if (!mounted) return <div className="h-full bg-transparent" aria-hidden="true" />;

  return (
    <div className="flex flex-col h-full gap-6 lg:gap-8 text-slate-200 w-full selection:bg-indigo-500/40">
      
      {/* Background Neural Fog FX */}
      <div 
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none rounded-full transform-gpu" 
        aria-hidden="true" 
      />

      {/* --- MASTER UNIFIED HEADER --- */}
      <header className="flex flex-col xl:flex-row justify-between xl:items-end mb-4 border-b border-white/5 pb-10 gap-8 relative z-10 animate-in fade-in shrink-0 w-full">
        <div className="space-y-4 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 w-full">
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
               Counterfactual <span className="text-indigo-500 underline decoration-indigo-500/20 underline-offset-[12px]">Sandbox</span>
             </h1>
             <div className="flex items-center gap-3 mt-2 lg:mt-0 shrink-0">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                  <Activity className={cn("w-3 h-3", loading ? "text-amber-500 animate-pulse" : "text-indigo-400")} aria-hidden="true" />
                  <span className={cn("text-[10px] font-bold tracking-widest uppercase tabular-nums", loading ? "text-amber-500" : "text-indigo-400")}>
                    {loading ? "Simulating" : "Engine Online"}
                  </span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  <Clock className="w-3 h-3 text-slate-500" aria-hidden="true" />
                  <ServerSafeClock />
               </div>
             </div>
          </div>
          <p className="text-slate-400 text-sm md:text-lg font-medium max-w-4xl leading-relaxed">
            Execute what-if simulations to mathematically prove how latent proxy variables 
            trigger structural bias in high-stakes algorithmic decisioning.
          </p>
        </div>
      </header>

      {/* --- MASTER GRID SYSTEM --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1 relative z-10 pb-10 min-h-0 w-full">
        
        {/* --- LEFT WING: SIMULATION PARAMETERS --- */}
        <section className="lg:col-span-5 flex flex-col min-h-0 w-full" aria-labelledby="sandbox-inputs">
          <h2 id="sandbox-inputs" className="sr-only">Simulation Parameters</h2>
          <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col h-full relative group overflow-hidden shadow-2xl transition-all hover:border-white/20">
            
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 md:px-8 py-4 md:py-5 bg-white/[0.02] border-b border-white/5 relative z-20 shrink-0">
               <span className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Layers className="w-4 h-4 text-indigo-400" aria-hidden="true" /> Variable Tensors
               </span>
               <span className="text-[9px] font-bold text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-lg border border-indigo-500/20 uppercase tracking-widest tabular-nums shadow-inner">
                  v2.5.0 STABLE
               </span>
            </div>

            <div className="flex-1 p-6 md:p-8 flex flex-col min-h-0 relative z-10">
              <div className="space-y-4 md:space-y-6 mb-8 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                {inputConfig.map((field) => (
                  <div key={field.key} className="space-y-2 relative group/input">
                    <label 
                      htmlFor={`input-${field.key}`}
                      className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest"
                    >
                      <field.icon className="w-3 h-3 md:w-3.5 md:h-3.5 text-indigo-400/60" aria-hidden="true" /> {field.label}
                    </label>
                    <div className="relative">
                      <input 
                        id={`input-${field.key}`}
                        type="text" 
                        value={profile[field.key as keyof typeof profile]} 
                        onChange={(e) => setProfile({...profile, [field.key]: e.target.value})}
                        placeholder={field.ph}
                        className="w-full px-5 py-4 bg-[#020205] border border-white/10 rounded-[18px] text-sm text-indigo-300 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] placeholder:text-slate-800 font-mono tabular-nums"
                      />
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800 group-focus-within/input:text-indigo-500 transition-colors" aria-hidden="true" />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                type="button"
                onClick={handleSimulate} 
                disabled={loading}
                aria-busy={loading}
                className={cn(
                  "w-full mt-auto py-5 rounded-[22px] font-black uppercase tracking-[0.3em] text-[10px] md:text-[11px] transition-all duration-500 flex justify-center items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 shrink-0 transform-gpu",
                  loading ? "bg-black text-slate-600 cursor-wait border border-white/5" 
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_15px_40px_rgba(79,70,229,0.3)] hover:-translate-y-1 active:scale-[0.98]"
                )}
              >
                {loading ? (
                  <><RefreshCcw className="w-4 h-4 animate-spin" aria-hidden="true" /> Executing...</>
                ) : (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="flex items-center gap-3"><Zap className="w-4 h-4" aria-hidden="true" /> Trigger Perturbation</span>
                    <span className="text-[7.5px] text-indigo-300 tracking-[0.2em] hidden md:block uppercase font-mono opacity-60">CMD + ENTER</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* --- RIGHT WING: RESULTS & TELEMETRY --- */}
        <section className="lg:col-span-7 flex flex-col gap-6 lg:gap-8 min-h-0 w-full" aria-labelledby="sandbox-results">
          <h2 id="sandbox-results" className="sr-only">Simulation Output</h2>
          
          {/* Institution Score Matrix (Fixed flex-overflow clipping) */}
          <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/40 pt-16 md:pt-20 pb-8 md:pb-10 px-4 md:px-8 flex flex-col items-center justify-center relative min-h-[260px] md:min-h-[300px] shadow-2xl transition-all shrink-0 overflow-hidden transform-gpu">
            
            {/* Background State Glow */}
            <div className={cn(
              "absolute inset-0 blur-[100px] rounded-full pointer-events-none transition-all duration-1000 transform-gpu z-0",
              hasSimulated ? "bg-red-600/10 opacity-100" : "bg-indigo-600/5 opacity-50"
            )} aria-hidden="true" />

            <div className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-3 z-10">
              <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-slate-600" aria-hidden="true" />
              <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Institutional Fairness Score</span>
            </div>

            <div className="flex flex-row items-center justify-center gap-4 md:gap-12 w-full relative z-10 px-2 md:px-4">
              
              <div className="flex flex-col items-center shrink-0 min-w-0">
                <span className="text-[clamp(3.5rem,6vw,7rem)] font-black text-slate-800 tracking-tighter italic leading-none tabular-nums whitespace-nowrap">
                  {originalScore.toFixed(1)}
                </span>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-4">Baseline</p>
              </div>

              <div className="flex flex-col items-center gap-3 relative shrink-0">
                 {hasSimulated && (
                   <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-top-6 duration-700 transform-gpu">
                     <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-500 font-black text-[9px] md:text-[10px] rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.2)] whitespace-nowrap tabular-nums">
                       {delta}%
                     </div>
                   </div>
                 )}
                 <ArrowRight className={cn(
                   "w-6 h-6 md:w-12 md:h-12 transition-all duration-1000 transform-gpu",
                   getArrowStyle()
                 )} aria-hidden="true" />
              </div>

              <div className="flex flex-col items-center shrink-0 min-w-0" aria-live="polite">
                <span className={cn(
                  "text-[clamp(3.5rem,6vw,7rem)] font-black tracking-tighter italic leading-none whitespace-nowrap tabular-nums transition-all duration-1000 transform-gpu",
                  hasSimulated ? "text-red-500 glow-text-danger drop-shadow-md" : "text-white"
                )}>
                  {loading ? "..." : simulatedScore.toFixed(1)}
                </span>
                <p className={cn(
                  "text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-4 transition-colors duration-500",
                  hasSimulated ? "text-red-500" : "text-slate-400"
                )}>
                  Simulated
                </p>
              </div>
            </div>
          </div>
          
          {/* Telemetry & Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 flex-1 min-h-0 w-full">
            
            <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-[#020205] p-6 md:p-8 flex flex-col shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] relative min-h-0 overflow-hidden transform-gpu">
              <div className="flex items-center justify-between mb-6 shrink-0 relative z-20">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                   <TerminalSquare className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                   Telemetry
                 </h3>
                 <div className="flex gap-1.5" aria-hidden="true">
                    <div className="w-2 h-2 rounded-full bg-red-500/20" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                 </div>
              </div>
              
              {/* Telemetry Log Auto-Scroller */}
              <div className="flex-1 font-mono text-[9.5px] md:text-[10.5px] leading-relaxed space-y-4 overflow-y-auto custom-scrollbar pr-2 min-h-0 relative z-10" aria-live="polite">
                {/* LINTER FIX (S6582): Optional Chaining ? applied safely to text includes check */}
                {neuralLog.map((log) => (
                  <div key={log.id} className={cn(
                    "opacity-90 animate-in fade-in slide-in-from-left-4 duration-300 break-words tabular-nums transform-gpu", 
                    log.text?.includes(profile.zip) ? "text-red-400 font-bold border-l-2 border-red-500/40 pl-3" : "text-indigo-400"
                  )}>
                    <span className="text-slate-600 select-none" aria-hidden="true">[{log.timestamp}]</span> {log.text}
                  </div>
                ))}
                {!loading && !hasSimulated && <div className="text-slate-800 italic pl-3 border-l border-white/5 py-1.5">Awaiting perturbation trigger...</div>}
                {loading && (
                  <div className="text-indigo-500 tracking-[0.2em] uppercase font-black pl-3 mt-4 border-l-2 border-indigo-500/40 flex items-center gap-3 animate-pulse transform-gpu">
                    Parsing Tensors <span className="inline-block w-1.5 h-3 bg-indigo-500" aria-hidden="true" />
                  </div>
                )}
                <div ref={logEndRef} aria-hidden="true" />
              </div>
            </div>

            <div className={cn(
              "rounded-[24px] md:rounded-[32px] border bg-black/40 backdrop-blur-md p-6 md:p-8 flex flex-col transition-all duration-1000 shadow-2xl min-h-0 overflow-hidden transform-gpu",
              hasSimulated ? "border-red-500/30 opacity-100" : "border-white/10 opacity-30 grayscale"
            )}>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 shrink-0 flex items-center gap-3">
                <Cpu className="w-4 h-4 text-red-500/70" aria-hidden="true" />
                Ratiocination
              </h3>
              
              {hasSimulated ? (
                <div className="space-y-5 animate-in fade-in duration-1000 flex-1 flex flex-col justify-center min-h-0 overflow-y-auto custom-scrollbar pr-1 transform-gpu">
                  <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed italic border-l-2 border-red-500/40 pl-4 break-words">
                    The resulting input vectors generated a <span className="text-red-400 font-black tabular-nums">{Math.abs(Number(delta))}% Regression</span> in model performance parity.
                  </p>
                  
                  {/* Alert Box */}
                  <div className="p-4 md:p-6 bg-red-500/5 border border-red-500/20 rounded-[22px] shadow-[inset_0_0_20px_rgba(239,68,68,0.1)] relative overflow-hidden group/alert mt-auto">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/alert:opacity-10 transition-opacity transform-gpu" aria-hidden="true">
                      <Target className="w-12 h-12 text-red-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-3 relative z-10">
                       <AlertTriangle className="w-4 h-4 text-red-400" aria-hidden="true" />
                       <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Latent Proxy Alert</span>
                    </div>
                    <p className="text-[10px] md:text-[11px] text-slate-400 leading-relaxed font-mono relative z-10 break-words">
                      The engine identifies <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-lg tabular-nums shadow-inner">Zip Code {profile.zip}</span> as a high-affinity demographic proxy violating parity constraints.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center opacity-30 space-y-5" aria-hidden="true">
                  <div className="w-3/4 h-2.5 bg-white/10 rounded-full" />
                  <div className="w-full h-2.5 bg-white/10 rounded-full" />
                  <div className="w-5/6 h-2.5 bg-white/10 rounded-full" />
                </div>
              )}
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}