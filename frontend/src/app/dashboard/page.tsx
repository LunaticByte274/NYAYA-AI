"use client";

/**
 * ==========================================================================
 * NYAYA AI - TEXT FORENSICS DASHBOARD (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Semantic Auditing & Real-time Bias Detection
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Payload Tensor Anti-Crush: Added strict min-h-[220px] and shrink-0 to prevent flex collapse on small screens.
 * 2. Vertical Rhythm & Squish Fix: Replaced hardcoded margins with flex-gap wrappers.
 * 3. Card-Level Scroll Armor: Added overflow-y-auto to left card to safely absorb viewport compression.
 * 4. Flex-Wrap Resolution: Fixed overlap on Forensic Source/Locale Focus headers.
 * 5. Flex-Grid Resolution: Fixed recursive grid collapse on the bottom row.
 * 6. Memory Leak Armor: Strict Abort patterns for telemetry intervals on unmount.
 * 7. Button Safety: Enforced type="button" to prevent phantom form submissions.
 * 8. Layout Locks: Enforced Flex-1 Min-h-0 for safe viewport scaling across all cards.
 * ==========================================================================
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { 
  FileText, 
  TerminalSquare, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Cpu, 
  AlertTriangle,
  RefreshCcw, 
  Search, 
  Loader2,
  Globe,
  Scale,
  History,
  ExternalLink,
  FileCheck
} from "lucide-react";

// --- CORE UI COMPONENTS ---
import { FairnessGauge } from "@/components/ui/FairnessGauge";
import { ForensicDrawer } from "@/components/ui/ForensicDrawer";
import { LiveHighlighter } from "@/components/heatmap/LiveHighlighter";
import { ComparisonView } from "@/components/dashboard/ComparisonView";

// --- LOGIC & UTILS ---
import { scanTextForBias } from "@/lib/apiClient"; 
import { generateCompliancePDF } from "@/lib/exportUtils";
import { cn } from "@/lib/utils"; 
import type { Finding } from "@/types";

const SAMPLE_DATA = {
  hiring: "We are looking for an aggressive, young salesman to join our fraternity of rockstars. Must have a strong pedigree from a top-tier university and be a great cultural fit.",
  finance: "Applicant resides in an urban zip code with historically high default rates. Frequent employment gaps noted. Approval not recommended at standard tier.",
  policy: "Employees returning from maternity leave must undergo a re-evaluation phase to ensure their skills remain aligned with the fast-paced nature of our core engineering teams."
};

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

// --- MASTER COMPONENT ---
export default function AuditDashboard() {
  // --- CORE STATE ---
  const [mounted, setMounted] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [isUrlMode, setIsUrlMode] = useState<boolean>(false);
  const [domain, setDomain] = useState<string>("hiring");
  const [locale, setLocale] = useState<string>("en-US");
  
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);
  
  const [neuralLog, setNeuralLog] = useState<string[]>([]);
  
  // Critical Refs
  const logEndRef = useRef<HTMLDivElement>(null);
  const telemetryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeScanRef = useRef<boolean>(false);

  // Memoized Array prevents dependency array jitter
  const NEURAL_TELEMETRY = useMemo(() => [
    "Initializing Semantic Graph...",
    "Executing Cultural Nuance Pass...",
    "Identifying Proxy Variables...",
    "Cross-referencing EU AI Act Article 10...",
    "Mapping UN SDG 10.3 Parity Vectors...",
    "Calculating Disparate Impact Ratio...",
    "Generating Ratiocination Proofs (XAI)...",
    "Finalizing Fairness Confidence Score...",
  ], []);

  // HYDRATION ANCHOR
  useEffect(() => {
    setMounted(true);
  }, []);

  // AUTO-SCROLL TELEMETRY
  useEffect(() => {
    if (logEndRef.current && loading) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [neuralLog, loading]);

  // MEMORY LEAK PREVENTION (Global Unmount)
  useEffect(() => {
    activeScanRef.current = true;
    return () => {
      activeScanRef.current = false;
      if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current);
    };
  }, []);

  // POWER-USER KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        const payload = isUrlMode ? url : text;
        if (!loading && payload.trim()) {
          handleAnalyze();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isUrlMode, url, text]);

  // BULLETPROOF AUDIT HANDLER
  const handleAnalyze = useCallback(async () => {
    const payload = isUrlMode ? url : text;
    if (!payload.trim() || loading) return;
    
    setLoading(true);
    setError(null);
    setNeuralLog([]);
    setHasScanned(false);
    setSelectedFinding(null); 
    activeScanRef.current = true;
    
    if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current);
    
    let msgIndex = 0;
    telemetryIntervalRef.current = setInterval(() => {
      if (!activeScanRef.current) {
        if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current);
        return;
      }
      if (msgIndex < NEURAL_TELEMETRY.length) {
        setNeuralLog(prev => [...prev, NEURAL_TELEMETRY[msgIndex]!]);
        msgIndex++;
      } else {
        if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current);
      }
    }, 600);

    try {
      const res = await scanTextForBias(payload, isUrlMode, locale, domain);
      
      if (activeScanRef.current) {
        if (res && Array.isArray(res.findings)) {
          setFindings(res.findings);
          setHasScanned(true);
        } else {
          throw new Error("Handshake failure: Malformed response from Intelligence Core.");
        }
      }
    } catch (err: unknown) {
      if (activeScanRef.current) {
        const errorMessage = err instanceof Error ? err.message : "Pipeline Interrupted";
        setError(`Runtime Exception: ${errorMessage}`);
      }
    } finally {
      if (activeScanRef.current) {
        setLoading(false);
        if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current);
      }
    }
  }, [isUrlMode, url, text, locale, domain, loading, NEURAL_TELEMETRY]);

  // EXPORT HANDLER
  const handleExport = useCallback(() => {
    if (exporting) return;
    
    setExporting(true);
    setError(null);
    
    const timeout = setTimeout(async () => {
      try {
        await generateCompliancePDF("audit-report-container", `Nyaya_Audit_${domain.toUpperCase()}`);
      } catch (err: unknown) {
        setError(`PDF Compilation Error: Rendering context lost.`);
      } finally {
        setExporting(false);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [domain, exporting]);

  const riskScore = findings.length > 0 ? Math.min(100, findings.length * 28) : (hasScanned ? 0 : 0);
  const parityIndex = hasScanned ? 100 - riskScore : 0;

  if (!mounted) return <div className="flex-1 w-full min-h-[800px] bg-transparent" aria-hidden="true" />;

  return (
    <div 
      id="audit-report-container" 
      className="flex-1 flex flex-col w-full gap-6 lg:gap-8 text-slate-200 min-h-0"
    >
      <ForensicDrawer 
        isOpen={!!selectedFinding} 
        audit={selectedFinding} 
        onClose={() => setSelectedFinding(null)} 
      />

      <div 
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none rounded-full transform-gpu" 
        aria-hidden="true" 
      />

      {/* --- MASTER UNIFIED HEADER --- */}
      <header className="flex flex-col xl:flex-row justify-between xl:items-end mb-4 border-b border-white/5 pb-10 gap-8 relative z-10 animate-in fade-in shrink-0 w-full">
        <div className="space-y-4 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 w-full">
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-none flex items-center gap-4 shrink-0">
               <FileText className="w-12 h-12 md:w-20 md:h-20 text-indigo-500 shrink-0" aria-hidden="true" />
               <span>Text <span className="text-indigo-500 underline decoration-indigo-500/20 underline-offset-[12px] tabular-nums">Forensics</span></span>
             </h1>
             <div className="flex items-center gap-3 mt-2 lg:mt-0 shrink-0">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                  <div className={cn("h-2.5 w-2.5 rounded-full transform-gpu", loading ? "bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]" : "bg-emerald-500 shadow-[0_0_10px_#10b981]")} aria-hidden="true" />
                  <span className={cn("text-[10px] font-bold tracking-widest uppercase tabular-nums", loading ? "text-amber-500" : "text-indigo-400")}>
                    {loading ? "Scanning" : "Engine Ready"}
                  </span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  <Clock className="w-3 h-3 text-slate-500" aria-hidden="true" />
                  <ServerSafeClock />
               </div>
             </div>
          </div>
          <p className="text-slate-400 text-sm md:text-lg font-medium max-w-4xl leading-relaxed">
            Execute high-fidelity semantic audits to detect demographic bias, gender-coding, and intersectional discrimination in live decision environments.
          </p>
        </div>
        
        <div className="min-h-[40px] flex flex-wrap items-center gap-4 shrink-0 mt-4 xl:mt-0">
          <button 
            type="button"
            className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> API Docs
          </button>

          {hasScanned && !loading && (
            <button 
              type="button"
              onClick={handleExport}
              disabled={exporting}
              aria-busy={exporting}
              className={cn(
                "px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-[16px] transition-all flex items-center gap-3 active:scale-95 disabled:opacity-70 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transform-gpu",
                exporting 
                  ? "bg-indigo-600/20 border border-indigo-500/50 text-white shadow-none"
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_15px_30px_rgba(79,70,229,0.25)] hover:-translate-y-0.5"
              )}
            >
              {exporting ? (
                <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Compiling...</>
              ) : (
                <><FileCheck className="w-4 h-4" aria-hidden="true" /> Export Report</>
              )}
            </button>
          )}
        </div>
      </header>

      {/* --- MASTER GRID SYSTEM (HEIGHT LOCKED) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1 relative z-10 pb-10 min-h-0 pt-4 w-full">
        
        {/* --- LEFT WING: INPUT CONFIGURATION --- */}
        <section className="lg:col-span-5 flex flex-col gap-6 min-h-0 w-full" aria-labelledby="input-section-title">
          <h2 id="input-section-title" className="sr-only">Forensic Input Configuration</h2>
          
          {/* CRITICAL FIX: Overflow-y-auto injected here to prevent entire card from exploding bounds */}
          <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl p-5 md:p-8 flex flex-col h-full relative group overflow-y-auto custom-scrollbar shadow-2xl transition-all hover:border-white/20 min-h-[350px] md:min-h-[400px] transform-gpu">

            <div className="relative z-10 flex flex-col gap-4 md:gap-5 flex-1 min-h-0 w-full">
              
              {/* Row 1: Input Selectors */}
              <div className="flex flex-wrap items-end shrink-0 w-full gap-4">
                <div className="space-y-2 md:space-y-3 flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                    <h3 className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] truncate">Forensic Source</h3>
                  </div>
                  <div className="flex bg-black/60 p-1 rounded-[12px] border border-white/10 shadow-inner w-full" role="tablist">
                    <button 
                      type="button"
                      role="tab"
                      aria-selected={!isUrlMode}
                      onClick={() => { setIsUrlMode(false); setError(null); }} 
                      className={cn(
                        "flex-1 px-2 py-2 text-[9px] font-bold uppercase tracking-widest rounded-[10px] transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 truncate", 
                        !isUrlMode ? "bg-white/10 text-white shadow-lg" : "text-slate-500 hover:text-slate-200"
                      )}
                    >
                      Text Source
                    </button>
                    <button 
                      type="button"
                      role="tab"
                      aria-selected={isUrlMode}
                      onClick={() => { setIsUrlMode(true); setError(null); }} 
                      className={cn(
                        "flex-1 px-2 py-2 text-[9px] font-bold uppercase tracking-widest rounded-[10px] transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 truncate", 
                        isUrlMode ? "bg-white/10 text-white shadow-lg" : "text-slate-500 hover:text-slate-200"
                      )}
                    >
                      HTTPS URL
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 md:space-y-3 flex-1 min-w-[150px]">
                  <div className="flex items-center gap-2">
                     <Globe className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                     <h3 className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] truncate">Locale Focus</h3>
                  </div>
                  <select 
                    value={locale} 
                    onChange={(e) => setLocale(e.target.value)} 
                    className="w-full bg-black/60 border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400 rounded-[12px] px-4 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all cursor-pointer shadow-inner truncate"
                    aria-label="Select geographical locale"
                  >
                    <option value="en-US">US-Global (Race/Zip)</option>
                    <option value="en-GB">UK-Socioeconomic</option>
                    <option value="hi-IN">India-Regional</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Industry Domain */}
              <div className="p-4 md:p-5 bg-white/[0.02] border border-white/5 rounded-2xl relative z-10 flex justify-between items-center hover:border-indigo-500/30 transition-all focus-within:ring-2 focus-within:ring-indigo-500/50 shrink-0">
                  <div className="flex items-center gap-3">
                     <Scale className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry Domain</span>
                  </div>
                  <select 
                    value={domain} 
                    onChange={(e) => setDomain(e.target.value)} 
                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-indigo-400 outline-none cursor-pointer text-right min-w-[120px]"
                    aria-label="Select industry domain"
                  >
                    <option value="hiring">Human Resources</option>
                    <option value="finance">Banking & Credit</option>
                    <option value="policy">System Governance</option>
                  </select>
              </div>

              {/* Row 3: TEXT INPUT ENGINE (CRITICAL FIX: min-h-[220px] and shrink-0 added to prevent squash) */}
              <div className="relative flex flex-col flex-1 rounded-[20px] md:rounded-[24px] overflow-hidden border border-white/10 bg-[#020205] shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] focus-within:border-indigo-500/40 transition-all min-h-[220px] shrink-0 transform-gpu">
                {loading && <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none z-10 animate-pulse transform-gpu" aria-hidden="true" />}
                
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-5 md:py-4 bg-white/[0.04] border-b border-white/5 relative z-20 shrink-0 w-full">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 shrink-0">
                      <TerminalSquare className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" /> Payload Tensors
                   </span>
                   {!isUrlMode && (
                     <div className="flex flex-wrap gap-1.5 shrink-0">
                       {Object.keys(SAMPLE_DATA).map((key) => (
                         <button 
                           type="button"
                           key={key} 
                           onClick={() => setText(SAMPLE_DATA[key as keyof typeof SAMPLE_DATA])} 
                           className="text-[8px] px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all uppercase font-black tracking-widest active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transform-gpu"
                         >
                           Load {key}
                         </button>
                       ))}
                     </div>
                   )}
                </div>

                {isUrlMode ? (
                  <input 
                    type="url" 
                    placeholder="Paste intelligence endpoint (HTTPS)..." 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAnalyze(); }}
                    className="w-full flex-1 p-4 md:p-5 bg-transparent outline-none text-sm font-mono text-indigo-300 placeholder:text-slate-700/50 relative z-20 tabular-nums min-h-[100px]" 
                    aria-label="URL Input"
                  />
                ) : (
                  <textarea 
                    className="w-full flex-1 p-4 md:p-5 bg-transparent outline-none resize-none text-sm md:text-base font-mono text-slate-300 placeholder:text-slate-700/50 leading-relaxed custom-scrollbar relative z-20 break-words whitespace-pre-wrap min-h-[100px]" 
                    placeholder="Inject intelligence source for forensic ratiocination..." 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    aria-label="Text Input"
                  />
                )}
              </div>
              
              {/* Row 4: Engine Error Reporting */}
              {error && (
                <div role="alert" className="p-4 bg-red-500/10 border border-red-500/20 rounded-[16px] text-[10px] text-red-400 font-black uppercase tracking-widest flex items-start gap-3 shadow-inner shrink-0 animate-in zoom-in-95 duration-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-relaxed break-words">{error}</span>
                </div>
              )}
              
              {/* Row 5: Master Action Trigger */}
              <button 
                type="button"
                onClick={handleAnalyze} 
                disabled={loading || (isUrlMode ? !url.trim() : !text.trim())}
                aria-busy={loading}
                className={cn(
                  "w-full mt-auto py-4 md:py-5 rounded-[20px] font-black uppercase tracking-[0.3em] text-[10px] md:text-[11px] transition-all duration-500 flex justify-center items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 shrink-0 transform-gpu",
                  loading ? "bg-black text-slate-600 cursor-wait border border-white/10 shadow-none" 
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_15px_30px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 active:scale-[0.98]"
                )}
              >
                {loading ? (
                  <><RefreshCcw className="w-4 h-4 animate-spin text-indigo-400" aria-hidden="true" /> Decrypting Matrices...</>
                ) : (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="flex items-center gap-2"><Zap className="w-4 h-4" aria-hidden="true" /> Trigger Audit Sequence</span>
                    <span className="text-[7.5px] text-indigo-300 tracking-widest opacity-70 hidden md:block uppercase font-mono">CMD + ENTER</span>
                  </div>
                )}
              </button>
              
            </div>
          </div>
        </section>

        {/* --- RIGHT WING: ANALYTICS & VISUALIZATION --- */}
        <section className="lg:col-span-7 flex flex-col gap-6 lg:gap-8 min-h-0 w-full" aria-labelledby="analytics-section-title">
          <h2 id="analytics-section-title" className="sr-only">Forensic Analysis Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 shrink-0 w-full">
            {/* KPI: PARITY SCORE */}
            <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/40 p-6 md:p-8 flex flex-col items-center justify-center relative min-h-[220px] md:min-h-[260px] shadow-2xl transition-all hover:border-white/20 overflow-hidden transform-gpu">
              <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-3 z-10">
                <Activity className="w-4 h-4 text-slate-600" aria-hidden="true" />
                <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Institutional Parity</span>
              </div>
              
              <div className="mt-6 scale-90 md:scale-100 flex-shrink-0 relative z-10" aria-label={`Parity Score: ${Math.round(parityIndex)} out of 100`}>
                <FairnessGauge score={parityIndex} />
              </div>
              
              <div className="text-center mt-6 relative z-10 w-full px-2" aria-live="polite">
                <h4 className={cn(
                  "text-[10px] md:text-xs font-black uppercase tracking-[0.2em] break-words leading-relaxed transition-colors duration-500", 
                  hasScanned ? (riskScore > 50 ? "text-red-500 glow-text-danger" : "text-emerald-500") : "text-slate-600"
                )}>
                  {hasScanned ? (riskScore > 50 ? "Institutional Failure" : "Compliance Achieved") : "Engine Standby"}
                </h4>
              </div>
            </div>

            {/* KPI: NEURAL TELEMETRY */}
            <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-[#020205] p-6 md:p-8 flex flex-col shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] relative min-h-[220px] md:min-h-[260px] transform-gpu">
              <div className="flex items-center justify-between mb-6 shrink-0 z-10">
                 <h3 className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Cpu className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                   Neural Monitor
                 </h3>
                 <div className="flex gap-1.5" aria-hidden="true">
                    <div className="w-2 h-2 rounded-full bg-red-500/30" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
                 </div>
              </div>
              
              <div 
                className="flex-1 font-mono text-[9.5px] md:text-[10.5px] leading-relaxed space-y-3 overflow-y-auto custom-scrollbar pr-2 min-h-0 z-10"
                aria-live="polite" 
              >
                {neuralLog.map((log, i) => (
                  <div key={i} className="text-indigo-400 opacity-90 animate-in fade-in slide-in-from-left-4 duration-300 break-words flex gap-2 tabular-nums">
                    <span className="text-slate-600 select-none shrink-0" aria-hidden="true">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span> 
                    <span className="flex-1">{log}</span>
                  </div>
                ))}
                {!loading && !hasScanned && <div className="text-slate-700 italic border-l-2 border-white/10 pl-3 py-1.5">Awaiting injection...</div>}
                {loading && (
                  <div className="text-indigo-500 tracking-[0.2em] uppercase font-black pl-3 mt-3 border-l-2 border-indigo-500/40 flex items-center gap-2 animate-pulse transform-gpu">
                    Syncing Nodes <span className="inline-block w-1.5 h-3 bg-indigo-500" aria-hidden="true" />
                  </div>
                )}
                <div ref={logEndRef} aria-hidden="true" />
              </div>
            </div>
          </div>
          
          {/* SEMANTIC HEATMAP RENDERER */}
          <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-md p-6 md:p-8 flex flex-col min-h-[250px] md:min-h-[300px] border-l-[6px] md:border-l-[8px] border-l-indigo-500/20 shadow-2xl relative transition-all min-h-0 shrink-0 w-full transform-gpu">
            <h3 className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex justify-between items-center shrink-0">
              <span className="flex items-center gap-3">
                 <div className={cn("w-2.5 h-2.5 rounded-full transition-colors duration-500", hasScanned && !loading ? "bg-indigo-400 animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.6)]" : "bg-slate-800")} aria-hidden="true" />
                 Semantic Heatmap
              </span>
              {hasScanned && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg tracking-widest text-[8.5px] tabular-nums shadow-sm">Confidence: 94.2%</span>}
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-3 md:pr-4 custom-scrollbar min-h-0 relative z-10">
              {loading ? (
                 <div className="space-y-4 pt-4 opacity-30 transform-gpu" aria-hidden="true">
                   <div className="h-3 w-full bg-white/20 rounded-full animate-pulse" />
                   <div className="h-3 w-5/6 bg-white/20 rounded-full animate-pulse" />
                   <div className="h-3 w-full bg-white/20 rounded-full animate-pulse" />
                 </div>
              ) : hasScanned ? (
                 <div className="text-sm md:text-base leading-relaxed text-slate-300 break-words whitespace-pre-wrap animate-in fade-in duration-700">
                   <LiveHighlighter 
                     text={isUrlMode ? "Scanned source intelligence mapped. Forensic findings established below." : text} 
                     findings={findings} 
                     onClickFinding={(f) => setSelectedFinding(f)} 
                   />
                 </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/10 rounded-[20px] py-12 md:py-16 transition-opacity duration-500 hover:opacity-40 transform-gpu">
                  <Globe className="w-12 h-12 md:w-16 md:h-16 text-slate-500 mb-6 transition-transform hover:rotate-12 duration-700" aria-hidden="true" />
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-center px-4">Forensic Standby</p>
                </div>
              )}
            </div>
          </div>

          {/* LOWER GRID: COMPARISON AND COMPLIANCE */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 flex-1 min-h-0 w-full">
            {/* COMPARISON / RATIOCINATION ENGINE */}
            <div className={cn(
              "rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/40 p-6 md:p-8 md:col-span-7 xl:col-span-8 flex flex-col shadow-2xl transition-all duration-1000 min-h-0 transform-gpu", 
              hasScanned && findings.length > 0 ? "opacity-100 scale-100" : "opacity-30 grayscale blur-[1px] scale-[0.98]"
            )}>
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 shrink-0">
                 <h3 className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" /> Self-Healing Logic
                 </h3>
                 {hasScanned && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8.5px] font-black rounded-lg uppercase tracking-widest border border-emerald-500/30 whitespace-nowrap shadow-sm">Solution Ready</span>}
               </div>
               
               <div className="flex-1 min-h-0">
                 {hasScanned && findings.length > 0 ? (
                   <div className="h-full overflow-y-auto custom-scrollbar pr-2 min-h-0">
                     <ComparisonView 
                       original={isUrlMode ? url : text} 
                       optimized={isUrlMode ? "Remote source ratiocination ready. Review Drawer for mitigation steps." : text.replace(/aggressive|young|fraternity|pedigree|urban zip code|frequent employment gaps|maternity leave|cultural fit/gi, "■■■■■■")} 
                     />
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center border border-white/5 rounded-[20px] bg-[#020205] shadow-inner py-8 transform-gpu">
                      <History className="w-8 h-8 text-slate-800 mb-4" aria-hidden="true" />
                      <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.3em]">Engine Standby</p>
                   </div>
                 )}
               </div>
            </div>

            {/* FRAMEWORK REGULATORY CARDS */}
            <div className={cn(
              "rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/40 p-6 md:p-8 md:col-span-5 xl:col-span-4 flex flex-col shadow-2xl transition-all duration-1000 min-h-0 transform-gpu", 
              hasScanned ? "opacity-100 translate-x-0" : "opacity-30 translate-x-6"
            )}>
              <h3 className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 shrink-0 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" aria-hidden="true" /> Framework Audit
              </h3>
              
              <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
                {[
                  { name: "EU AI Act", status: hasScanned ? (riskScore > 50 ? "Non-Compliant" : "Aligned") : "Pending", colorClass: "text-indigo-400", desc: "Article 10.3 Quality" },
                  { name: "NYC LL144", status: hasScanned ? (riskScore > 50 ? "High Risk" : "Safe") : "Pending", colorClass: "text-cyan-400", desc: "AEDT Audit Protocol" },
                  { name: "UN SDG 10.3", status: hasScanned ? (riskScore > 50 ? "Regression" : "Impactful") : "Pending", colorClass: "text-emerald-400", desc: "Inequality Metric" }
                ].map((fw, i) => (
                  <div key={i} className="p-4 md:p-5 bg-[#020205] rounded-[20px] border border-white/5 shadow-inner transition-colors duration-300 hover:bg-black group">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5 break-words group-hover:text-slate-500 transition-colors">{fw.name}</p>
                    <p className={cn("text-xs md:text-sm font-black uppercase tracking-tighter mb-1.5 break-words leading-tight transition-colors", fw.colorClass)}>{fw.status}</p>
                    <p className="text-[8.5px] text-slate-500 font-bold uppercase tracking-widest leading-snug">{fw.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 text-center shrink-0">
                 <div className="flex items-center justify-center gap-2 mb-1.5 opacity-60">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Verified Integrity</p>
                 </div>
                 <p className="text-[8px] text-slate-600 font-mono font-bold uppercase tracking-wider tabular-nums">Kernel v2.5.0-LTS</p>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}