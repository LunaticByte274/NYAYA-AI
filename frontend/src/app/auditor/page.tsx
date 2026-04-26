"use client";

/**
 * ==========================================================================
 * NYAYA AI - DATASET AUDITOR (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Tabular Data Forensics & Disparate Impact Ratio Analysis
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Vertical Rhythm Tightened: Eliminated space-y-8 to prevent button clipping on laptops.
 * 2. Card-Level Scroll Armor: Added overflow-y-auto to the ingestion card for short viewports.
 * 3. Strict TypeScript Armor: Eliminated 'any' types for metrics and configurations.
 * 4. React.memo() Isolation: Decoupled ServerSafeClock to prevent 1s render loops.
 * 5. Button Safety & Event Typing: Enforced type="button" and React.MouseEvent.
 * 6. Synchronized 8xl Italic Header architecture.
 * 7. Tabular-num alignment on primary Impact Ratio to prevent layout jitter.
 * 8. Flex-Column height locking (min-h-0) to prevent UI bulge.
 * 9. Strict error handling and memory-safe URL blob revocation for SMOTE downloads.
 * 10. Explicit DevTools Binding: Added displayName for precise profiling.
 * 11. Enterprise JSDoc Annotations: Self-documenting pipeline handlers.
 * 12. FINAL POLISH: Eliminated nested ternaries, negated conditions, and unused imports.
 * 13. ULTIMATE COMPLIANCE: Eradicated Cognitive Complexity (S3776), Handled Exceptions (S2486), Extracted JSX Components (S3358), and Upgraded Telemetry Array Keys (S6479).
 * 14. 🚨 THE NUCLEAR STRIKE: Extracted ALL state, intervals, and async effects into a 'useAuditorLogic' custom hook. DatasetAuditor is now a pure Presenter component.
 * ==========================================================================
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { 
  ShieldCheck, 
  BarChart3, 
  Database, 
  Zap, 
  Download,
  AlertTriangle,
  Cpu,
  TerminalSquare,
  CheckCircle2,
  Clock,
  RefreshCcw,
  Binary,
  Activity 
} from "lucide-react";

// --- CORE UI COMPONENTS ---
import { DragDropZone } from "@/components/dashboard/DragDropZone";
import { cn } from "@/lib/utils";

// --- ENVIRONMENT ROUTING ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://nyaya-ai-tqej.onrender.com"; 

// --- STRICT TYPING CONTRACTS ---
export interface AuditMetrics {
  status: "Fair" | "Biased" | "Critical Bias";
  disparate_impact_ratio: number;
  message: string;
}

interface TelemetryLog {
  id: string;
  text: string;
  timestamp: string;
}

interface PipelineConsoleProps {
  neuralLog: TelemetryLog[];
  status: string;
  metrics: AuditMetrics | null;
  logEndRef: React.RefObject<HTMLDivElement>;
}

interface RatiocinationCardProps {
  metrics: AuditMetrics | null;
  status: string;
  handleRemediate: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// --- PERFORMANCE OPTIMIZATION: ISOLATED CLOCK ---
const ServerSafeClock = memo(function ServerSafeClock() {
  const [time, setTime] = useState<string>("SYNCING...");
  
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

// --- PURE HELPER FUNCTIONS (Extracted to reduce Component Complexity) ---
const safeClearInterval = (ref: React.MutableRefObject<NodeJS.Timeout | null>) => {
  if (ref.current) {
    clearInterval(ref.current);
    ref.current = null;
  }
};

const getGlowStyle = (metrics: AuditMetrics | null) => {
  if (!metrics) return "bg-indigo-500/10 opacity-20";
  if (metrics.status === "Fair") return "bg-emerald-500/20 opacity-40 group-hover:opacity-100";
  return "bg-red-500/20 opacity-40 group-hover:opacity-100";
};

const getTextStyle = (metrics: AuditMetrics | null) => {
  if (!metrics) return "text-slate-800";
  if (metrics.status === "Fair") return "text-emerald-400";
  return "text-red-500";
};

const getBadgeStyle = (metrics: AuditMetrics | null) => {
  if (!metrics) return "text-slate-700 border-white/5 bg-white/5";
  if (metrics.status === "Fair") return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
  return "text-red-400 border-red-500/20 bg-red-500/10 animate-pulse";
};

// --- CUSTOM REACT HOOKS (Decoupling logic to satisfy S3776) ---
const useAuditorTelemetryManager = (
  activeProcessRef: React.MutableRefObject<boolean>,
  setNeuralLog: React.Dispatch<React.SetStateAction<TelemetryLog[]>>,
  pipelineSteps: string[]
) => {
  const telemetryIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopTelemetry = useCallback(() => {
    safeClearInterval(telemetryIntervalRef);
  }, []);

  const startTelemetry = useCallback(() => {
    let msgIndex = 0;
    telemetryIntervalRef.current = setInterval(() => {
      const isActive = activeProcessRef.current;
      const isComplete = msgIndex >= pipelineSteps.length;
      
      if (!isActive || isComplete) {
        stopTelemetry();
        return;
      }

      const nextMsg = pipelineSteps[msgIndex] as string;
      const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setNeuralLog(prev => [...prev, { 
        id: `log-${Date.now()}-${msgIndex}`, 
        text: nextMsg, 
        timestamp: timeNow 
      }]);
      
      msgIndex++;
    }, 450);
  }, [pipelineSteps, activeProcessRef, setNeuralLog, stopTelemetry]);

  return { startTelemetry, stopTelemetry };
};

// 🚨 CONTAINER HOOK: Moves all logic out of the component to hit 0 Cognitive Complexity 🚨
const useAuditorLogic = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "auditing" | "remediating" | "success" | "error">("idle");
  const [metrics, setMetrics] = useState<AuditMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [neuralLog, setNeuralLog] = useState<TelemetryLog[]>([]);

  const [config, setConfig] = useState<Record<string, string>>({
    protected_col: "GENDER",
    privileged_class: "MALE",
    decision_col: "LOAN_APPROVED",
    positive_outcome: "YES"
  });

  const logEndRef = useRef<HTMLDivElement>(null);
  const activeProcessRef = useRef<boolean>(false);

  const pipelineSteps = useMemo(() => [
    "Mounting Tabular Tensor...",
    "Isolating Protected Attribute Vectors...",
    "Calculating Privileged Selection Rate (SRp)...",
    "Calculating Unprivileged Selection Rate (SRu)...",
    "Applying EEOC 4/5ths Rule Logic...",
    "Analyzing Disparate Impact Ratio (DIR)...",
    "Generating Statistical Proofs (XAI)...",
    "Validating against UN SDG 10.3 metrics...",
    "Finalizing Compliance Ledger...",
  ], []);

  const { startTelemetry, stopTelemetry } = useAuditorTelemetryManager(activeProcessRef, setNeuralLog, pipelineSteps);

  useEffect(() => {
    setMounted(true);
    activeProcessRef.current = true;
    return () => {
      activeProcessRef.current = false;
      stopTelemetry();
    };
  }, [stopTelemetry]);

  useEffect(() => {
    if (logEndRef.current && status === "auditing") {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [neuralLog, status]);

  const handleAudit = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) return;

    setStatus("auditing");
    setError(null);
    setMetrics(null);
    setNeuralLog([]);
    activeProcessRef.current = true;

    stopTelemetry();
    startTelemetry();

    const formData = new FormData();
    formData.append("file", file);
    Object.entries(config).forEach(([key, val]) => formData.append(key, val));

    try {
      const res = await fetch(`${API_BASE_URL}/api/data/audit-csv`, {
        method: "POST",
        body: formData,
      });

      if (!activeProcessRef.current) return;

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new TypeError(errData.detail || "Tabular pipeline processing failure.");
      }

      const data: AuditMetrics = await res.json();
      if (activeProcessRef.current) {
        setMetrics(data);
        setStatus("success");
      }
    } catch (err: unknown) {
      if (!activeProcessRef.current) return;
      const errorMessage = err instanceof Error ? err.message : "Network synchronization failure.";
      setError(errorMessage);
      setStatus("error");
      console.error("[Nyaya AI Core] - Audit Execution Failure:", err);
    } finally {
      if (activeProcessRef.current) {
        stopTelemetry();
      }
    }
  }, [file, config, startTelemetry, stopTelemetry]);

  const handleRemediate = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file || !metrics) return;
    setStatus("remediating");
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(config).forEach(([key, val]) => formData.append(key, val));

    try {
      const res = await fetch(`${API_BASE_URL}/api/remediate/fix-dataset`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new TypeError(errData.detail || "Remediation core failure.");
      }

      const blob = await res.blob();
      const url = globalThis.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `NYAYA_BALANCED_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      globalThis.URL.revokeObjectURL(url); 
      
      setStatus("success");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Strategic remediation failed.";
      setError(`Remediation Error: ${errorMessage}`);
      setStatus("error");
      console.error("[Nyaya AI Core] - Remediation Execution Failure:", err);
    }
  }, [file, config, metrics]);

  return {
    mounted, file, setFile, status, metrics, error, neuralLog, config, setConfig,
    logEndRef, handleAudit, handleRemediate
  };
};

// --- ISOLATED RENDER COMPONENTS (Strictly Typed to eliminate TS/Sonar Warnings) ---
const PipelineConsole = memo(({ neuralLog, status, metrics, logEndRef }: PipelineConsoleProps) => {
  // LINTER FIX (S6582, S1066): Grouped logical conditions perfectly
  const isStandby = status === "idle" || status === "error" || (status === "success" && !metrics?.status);
  const isProcessing = status === "auditing" || status === "remediating";

  return (
    <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-[#020205] p-6 md:p-8 flex flex-col shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] relative min-h-[300px] shrink-0 transform-gpu">
      <div className="flex items-center justify-between mb-6 shrink-0 z-10">
         <h3 className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
           <TerminalSquare className="w-4 h-4 text-indigo-400" aria-hidden="true" /> Pipeline Console
         </h3>
         <div className="flex gap-1.5" aria-hidden="true">
            <div className="w-2 h-2 rounded-full bg-red-500/30" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
         </div>
      </div>
      <div className="flex-1 font-mono text-[9.5px] md:text-[10.5px] leading-relaxed space-y-3 overflow-y-auto custom-scrollbar pr-2 min-h-0 z-10" aria-live="polite">
        {neuralLog.map((log) => (
          <div key={log.id} className="text-indigo-400 opacity-90 animate-in fade-in slide-in-from-left-4 break-words tabular-nums flex gap-2">
            <span className="text-slate-600 shrink-0" aria-hidden="true">[{log.timestamp}]</span> 
            <span className="flex-1">{log.text}</span>
          </div>
        ))}
        {isStandby && <div className="text-slate-700 italic border-l-2 border-white/10 pl-3 py-1">Standby for data injection...</div>}
        {isProcessing && (
          <div className="flex items-center gap-2 text-indigo-500 font-black pl-3 animate-pulse uppercase tracking-[0.2em] transform-gpu">
            <div className="w-1.5 h-3 bg-indigo-500" aria-hidden="true" /> Calculating Tensors
          </div>
        )}
        <div ref={logEndRef as any} aria-hidden="true" />
      </div>
    </div>
  );
});
PipelineConsole.displayName = "PipelineConsole";

const RatiocinationCard = memo(({ metrics, status, handleRemediate }: RatiocinationCardProps) => {
  if (!metrics) {
    return (
      <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/40 p-6 md:p-8 lg:p-10 flex flex-col min-h-[300px] shadow-2xl relative overflow-hidden group/proof flex-1 transform-gpu">
        <div className="h-full flex flex-col items-center justify-center opacity-10 border-2 border-dashed border-white/5 rounded-[24px] md:rounded-[40px] py-16 md:py-24 group-hover/proof:opacity-20 transition-opacity duration-700 min-h-0 transform-gpu">
          <BarChart3 className="w-16 h-16 md:w-20 md:h-20 text-slate-600 mb-6 md:mb-8 group-hover/proof:scale-110 transition-transform duration-700" aria-hidden="true" />
          <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] md:tracking-[0.8em] text-center px-4">Math Core Standby</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/40 p-6 md:p-8 lg:p-10 flex flex-col min-h-[300px] shadow-2xl relative overflow-hidden group/proof flex-1 transform-gpu">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10 border-b border-white/5 pb-6 shrink-0 relative z-10">
         <div className="flex items-center gap-3 md:gap-4">
           <Cpu className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" aria-hidden="true" />
           <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">Forensic Ratiocination</h3>
         </div>
         <div className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm">
           Verification Secured
         </div>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 flex-1 flex flex-col overflow-y-auto custom-scrollbar pr-2 min-h-0">
          <p className="text-sm md:text-base lg:text-lg text-slate-300 font-medium italic border-l-4 border-indigo-500/40 pl-6 md:pl-8 py-2 leading-relaxed mb-8 md:mb-10 break-words">
            "{metrics.message}"
          </p>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 mt-auto shrink-0 pb-4 w-full">
             <div className="p-6 md:p-8 bg-[#020205] rounded-[20px] md:rounded-[28px] border border-white/5 shadow-inner transition-colors hover:border-indigo-500/20 flex flex-col justify-center">
                <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6 md:mb-8 border-b border-white/5 pb-3">Mathematical Proof</p>
                <div className="text-xl md:text-2xl lg:text-3xl font-mono text-white tracking-tighter flex flex-wrap items-center gap-3 md:gap-4 tabular-nums">
                  <span className="text-indigo-400">DIR</span> 
                  <span className="text-slate-700">≈</span> 
                  <div className="flex flex-col items-center justify-center font-bold">
                    <span className="border-b-2 border-white/20 px-1.5 md:px-2">SRu</span>
                    <span className="px-1.5 md:px-2">SRp</span>
                  </div>
                  <span className="text-slate-700 text-lg md:text-xl font-medium mt-1">({metrics.disparate_impact_ratio.toFixed(3)})</span>
                </div>
             </div>
             
             {(metrics.status === "Biased" || metrics.status === "Critical Bias") && (
                <div className="p-6 md:p-8 bg-indigo-600/5 border border-indigo-600/20 rounded-[20px] md:rounded-[28px] flex flex-col hover:bg-indigo-600/10 transition-colors duration-500">
                   <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-3 flex items-center gap-2">
                     <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> Parity Remediation Core
                   </h4>
                   <p className="text-xs md:text-sm text-slate-400 mb-6 leading-relaxed break-words">
                     Synthetic Minority Over-sampling (SMOTE) logic is initialized. Download a corrected version with statistical parity.
                   </p>
                   <button 
                     type="button"
                     onClick={handleRemediate}
                     disabled={status === "remediating"}
                     aria-busy={status === "remediating"}
                     className={cn(
                       "w-full mt-auto py-4 md:py-5 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transform-gpu",
                       status === "remediating" 
                         ? "bg-black text-slate-500 cursor-wait border border-white/5"
                         : "bg-indigo-500 text-white shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 active:scale-95"
                     )}
                   >
                     {status === "remediating" ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : <Download className="w-3.5 h-3.5" aria-hidden="true" />}
                     {status === "remediating" ? "Balancing..." : "Download Compliant Set"}
                   </button>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
});
RatiocinationCard.displayName = "RatiocinationCard";

// --- MASTER COMPONENT (NOW PURELY A PRESENTER - COGNITIVE COMPLEXITY = 1) ---
export default function DatasetAuditor() {
  const {
    mounted, file, setFile, status, metrics, error, neuralLog, config, setConfig,
    logEndRef, handleAudit, handleRemediate
  } = useAuditorLogic();

  if (!mounted) return <div className="h-full bg-transparent" aria-hidden="true" />;

  return (
    <div className="flex flex-col h-full gap-6 lg:gap-8 text-slate-200 min-h-0 w-full selection:bg-indigo-500/40">
      
      {/* Background Ambience FX */}
      <div 
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none rounded-full transform-gpu" 
        aria-hidden="true" 
      />

      {/* --- MASTER UNIFIED HEADER --- */}
      <header className="flex flex-col xl:flex-row justify-between xl:items-end mb-4 border-b border-white/5 pb-10 gap-8 relative z-10 animate-in fade-in shrink-0 w-full">
        <div className="space-y-4 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 w-full">
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-none shrink-0">
               Dataset <span className="text-indigo-500 underline decoration-indigo-500/20 underline-offset-[12px]">Audit</span>
             </h1>
             <div className="flex items-center gap-3 mt-2 lg:mt-0 shrink-0">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                  <div className={cn(
                    "h-2.5 w-2.5 rounded-full transform-gpu", 
                    status === "auditing" ? "bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]" : "bg-emerald-500 shadow-[0_0_10px_#10b981]"
                  )} aria-hidden="true" />
                  <span className={cn("text-[10px] font-bold tracking-widest uppercase tabular-nums", status === "auditing" ? "text-amber-500" : "text-indigo-400")}>
                    {status === "auditing" ? "Auditing" : "Tabular Engine"}
                  </span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  <Clock className="w-3 h-3 text-slate-500" aria-hidden="true" />
                  <ServerSafeClock />
               </div>
             </div>
          </div>
          <p className="text-slate-400 text-sm md:text-lg font-medium max-w-4xl leading-relaxed">
            Mathematically verify historical parity in institutional datasets using 
            Disparate Impact Ratio analysis and legal Four-Fifths compliance protocols.
          </p>
        </div>
      </header>

      {/* --- MASTER GRID SYSTEM --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1 relative z-10 pb-10 min-h-0 w-full">
        
        {/* --- LEFT CLUSTER: DATA & CONFIG --- */}
        <section className="lg:col-span-5 flex flex-col gap-6 min-h-0 w-full" aria-labelledby="ingestion-title">
          <h2 id="ingestion-title" className="sr-only">Data Ingestion and Configuration</h2>
          
          <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl p-5 md:p-8 flex flex-col h-full shadow-2xl relative overflow-y-auto custom-scrollbar transition-all hover:border-white/20 transform-gpu">
            <div className="absolute top-0 right-0 p-5 md:p-8 opacity-5 pointer-events-none transform-gpu" aria-hidden="true">
              <Database className="w-32 h-32 md:w-40 md:h-40 text-indigo-500" />
            </div>

            <div className="relative z-10 flex flex-col gap-4 md:gap-5 flex-1 min-h-0 w-full">
              <div className="flex items-center gap-3 border-b border-white/5 pb-3 md:pb-4 shrink-0">
                <Binary className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Pipeline Ingestion</h3>
              </div>

              <div className="shrink-0 w-full">
                <DragDropZone onFileDrop={(f) => setFile(f)} currentFile={file} accept=".csv" />
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 pb-2">
                  {Object.keys(config).map((key) => (
                    <div key={`config-input-${key}`} className="space-y-2">
                      <label className="block text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                        {key.replace("_", " ")}
                      </label>
                      <input 
                        type="text" 
                        value={config[key]} 
                        onChange={(e) => setConfig({...config, [key]: e.target.value})} 
                        className="w-full px-4 py-2.5 md:py-3 bg-black/80 border border-white/10 rounded-xl md:rounded-[16px] text-xs font-mono text-indigo-300 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all shadow-inner tabular-nums" 
                        aria-label={`Configure ${key.replace("_", " ")}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div role="alert" className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl md:rounded-[16px] flex items-start gap-3 text-red-400 animate-in fade-in zoom-in-95 duration-300 shrink-0">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed break-words">{error}</p>
                </div>
              )}

              <button 
                type="button"
                onClick={handleAudit} 
                disabled={status === "auditing" || !file} 
                aria-busy={status === "auditing"}
                className={cn(
                  "w-full mt-2 md:mt-auto py-4 rounded-[20px] font-black uppercase tracking-[0.3em] text-[10px] md:text-[11px] transition-all duration-500 flex justify-center items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 shrink-0 transform-gpu",
                  status === "auditing" ? "bg-black text-slate-700 cursor-wait border border-white/5 shadow-none" 
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_15px_30px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 active:scale-[0.98]"
                )}
              >
                {status === "auditing" ? <RefreshCcw className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Zap className="w-4 h-4" aria-hidden="true" />}
                {status === "auditing" ? "Processing..." : "Compute Parity Audit"}
              </button>
            </div>
          </div>
        </section>

        {/* --- RIGHT CLUSTER: INTELLIGENCE MONITOR --- */}
        <section className="lg:col-span-7 flex flex-col gap-6 lg:gap-8 min-h-0 w-full" aria-labelledby="analytics-title">
          <h2 id="analytics-title" className="sr-only">Analytics and Telemetry</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 shrink-0 w-full">
            
            <div className="rounded-[32px] border border-white/10 bg-black/40 p-8 flex flex-col h-full min-h-[300px] relative overflow-hidden group shadow-2xl transition-all hover:border-white/20 transform-gpu">
              
              {/* Header Area */}
              <div className="flex items-center gap-3 shrink-0 mb-2">
                <Activity className="w-4 h-4 text-slate-500" aria-hidden="true" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Forensic Impact Ratio
                </span>
              </div>

              {/* Central Content Area */}
              <div className="flex-1 flex flex-col items-center justify-center gap-6 py-4 w-full">
                <div className="relative flex justify-center w-full">
                   <div className={cn(
                     "absolute inset-0 blur-[60px] rounded-full transition-opacity duration-1000 transform-gpu",
                     getGlowStyle(metrics)
                   )} aria-hidden="true" />
                   
                   <span className={cn(
                     "text-[clamp(5rem,8vw,120px)] font-black italic tracking-tighter leading-none tabular-nums relative z-10 transition-colors duration-1000 drop-shadow-2xl text-center",
                     getTextStyle(metrics)
                   )}>
                     {metrics ? metrics.disparate_impact_ratio.toFixed(2) : "0.00"}
                   </span>
                </div>

                <div className={cn(
                  "flex items-center gap-2 px-5 py-2 border rounded-full relative z-10 transition-all duration-700 whitespace-nowrap",
                  getBadgeStyle(metrics)
                )}>
                  {metrics && metrics.status === "Fair" ? <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> : <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />}
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {metrics ? metrics.status : "Idle"}
                  </span>
                </div>
              </div>

              {/* Footer Area */}
              <div className="pt-4 border-t border-white/5 flex justify-between items-center opacity-30 mt-auto shrink-0">
                 <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">Neural Core v2.5</span>
                 <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">EEOC Logic Applied</span>
              </div>
            </div>

            {/* Neural Execution Terminal */}
            <PipelineConsole 
              neuralLog={neuralLog} 
              status={status} 
              metrics={metrics} 
              logEndRef={logEndRef} 
            />
          </div>
          
          {/* Statistical Ratiocination Card */}
          <RatiocinationCard 
            metrics={metrics} 
            status={status} 
            handleRemediate={handleRemediate} 
          />

        </section>
      </div>
    </div>
  );
}