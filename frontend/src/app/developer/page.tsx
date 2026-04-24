"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { 
  Key, 
  Copy, 
  Check, 
  TerminalSquare, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  RefreshCcw,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Code2,
  FileCode,
  Lock
} from "lucide-react";

/**
 * ==========================================================================
 * NYAYA AI - DEVELOPER PORTAL (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Authentication Keys & CI/CD Pipeline Integration
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Flex-Wrap Resolution: Fixed overlap on Cryptographic Core header/toggles.
 * 2. Layout Locks: Applied overflow-y-auto to left card to prevent vertical squishing.
 * 3. Typographic Scaling: Adjusted tracking to prevent text from breaking boundaries.
 * 4. Synchronized 8xl Italic Header architecture.
 * 5. Integrated ServerSafeClock with tabular-num rendering & memoization.
 * 6. Extended Forensic CI/CD Terminal with GPU-accelerated syntax highlighting.
 * 7. Button Safety: Enforced type="button" across all interactive elements.
 * 8. Explicit DevTools Binding: Added displayName for precise React profiling.
 * ==========================================================================
 */

import { cn } from "@/lib/utils";

// --- PERFORMANCE OPTIMIZATION: ISOLATED CLOCK ---
// Memoized to prevent 1000ms state updates from re-rendering the heavy parent layout
const ServerSafeClock = memo(function ServerSafeClock() {
  const [time, setTime] = useState<string>("--:--:-- UTC");
  
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

// Custom Brand Icons (Memoized)
const BrandGithub = memo(function BrandGithub({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
});
BrandGithub.displayName = "BrandGithub";

// --- STRICT TYPING CONTRACTS ---
type EnvironmentMode = "live" | "test";
type CopyState = "key" | "code" | null;

// --- MASTER COMPONENT ---
export default function DeveloperPage() {
  // --- CORE STATE ARCHITECTURE ---
  const [mounted, setMounted] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("nya_live_8ba_4992_xf02_core");
  const [envMode, setEnvMode] = useState<EnvironmentMode>("live");
  const [copyFeedback, setCopyFeedback] = useState<CopyState>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // 1. HYDRATION ANCHOR
  useEffect(() => setMounted(true), []);

  // 2. CRYPTOGRAPHIC ROLL SIMULATION (Memory Safe)
  const generateKey = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const prefix = envMode === "live" ? "nya_live_" : "nya_test_";
      // Generate a structurally sound random hash
      const randomStr = Array.from({ length: 16 }, () => 
        Math.random().toString(36).charAt(2)
      ).join('').toUpperCase();
      
      setApiKey(`${prefix}${randomStr}`);
      setIsGenerating(false);
    }, 850);
  }, [envMode]);

  // 3. ATOMIC CLIPBOARD HANDLER
  const performCopy = useCallback((text: string, label: CopyState) => {
    if (typeof window === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  }, []);

  // 4. MEMOIZED WORKFLOW SNIPPET
  // Extracted to prevent massive string recreation on every component tick
  const workflowYAML = useMemo(() => `name: Nyaya Bias Audit
on: [pull_request]

jobs:
  forensic_check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Nyaya Semantic Audit
        uses: nyaya-ai/action-scanner@v2.5.0
        env:
          NYAYA_API_KEY: \${{ secrets.NYAYA_API_KEY }}
        with:
          fail_on_critical: true
          threshold: 0.85`, []);

  if (!mounted) return <div className="h-full bg-transparent" aria-hidden="true" />;

  return (
    <div className="flex flex-col h-full gap-6 lg:gap-8 text-slate-200 min-h-0 w-full selection:bg-indigo-500/40">
      
      {/* Background Neural Fog FX */}
      <div 
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] pointer-events-none rounded-full transform-gpu" 
        aria-hidden="true" 
      />

      {/* --- MASTER UNIFIED HEADER --- */}
      <header className="flex flex-col xl:flex-row justify-between xl:items-end mb-4 border-b border-white/5 pb-10 gap-8 relative z-10 animate-in fade-in shrink-0 w-full">
        <div className="space-y-4 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 w-full">
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-none shrink-0">
               Developer <span className="text-indigo-500 underline decoration-indigo-500/20 underline-offset-[14px]">API</span>
             </h1>
             <div className="flex items-center gap-3 mt-2 lg:mt-0 shrink-0">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                  <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase tabular-nums">Stable v2.5.0</span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  <ServerSafeClock />
               </div>
             </div>
          </div>
          <p className="text-slate-400 text-sm md:text-lg font-medium max-w-3xl leading-relaxed">
            Scalable forensic infrastructure for institutional fairness. Connect your backend services 
            directly to the Nyaya Intelligence Matrix via secured REST gateways.
          </p>
        </div>
        <div className="flex items-center gap-4 mb-2 shrink-0 mt-4 xl:mt-0">
          <button 
            type="button"
            className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-white transition-all uppercase tracking-widest active:scale-95 shadow-xl whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Open API Documentation"
          >
            <ExternalLink className="w-4 h-4 text-indigo-400" aria-hidden="true" /> API Docs
          </button>
        </div>
      </header>

      {/* --- MASTER GRID SYSTEM (HEIGHT LOCKED) --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 flex-1 relative z-10 pb-10 min-h-0 w-full">
        
        {/* --- LEFT CLUSTER: AUTHENTICATION --- */}
        <section className="xl:col-span-5 flex flex-col gap-6 lg:gap-8 min-h-0 w-full">
          
          {/* CRITICAL FIX: overflow-y-auto ensures layout doesn't compress or overflow on tight screens */}
          <div className="group relative rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-8 lg:p-10 shadow-2xl transition-all duration-500 hover:border-white/20 flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar transform-gpu">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none transform-gpu" aria-hidden="true">
              <ShieldCheck className="w-32 h-32 md:w-40 md:h-40 text-indigo-500" />
            </div>

            {/* CRITICAL FIX: flex-wrap + justify-between + safe min-width ensures items scale perfectly */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 md:mb-8 relative z-10 shrink-0 w-full">
               <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-500 flex items-center gap-3 shrink-0 min-w-[200px]">
                 <Lock className="w-4 h-4 text-indigo-400" aria-hidden="true" /> Cryptographic Core
               </h2>
               
               <div className="flex bg-black/80 p-1 rounded-xl border border-white/10 shadow-inner shrink-0" role="tablist">
                  <button 
                    type="button"
                    role="tab"
                    aria-selected={envMode === "test"}
                    onClick={() => setEnvMode("test")} 
                    className={cn(
                      "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50", 
                      envMode === "test" ? "bg-white/10 text-white shadow-lg" : "text-slate-500 hover:text-slate-200"
                    )}
                  >Sandbox</button>
                  <button 
                    type="button"
                    role="tab"
                    aria-selected={envMode === "live"}
                    onClick={() => setEnvMode("live")} 
                    className={cn(
                      "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-500/50", 
                      envMode === "live" ? "bg-red-500/20 text-red-400 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "text-slate-500 hover:text-slate-200"
                    )}
                  >Production</button>
                </div>
            </div>

            <div className="relative z-10 mb-6 md:mb-8 space-y-4 shrink-0">
              <div className="flex items-start gap-4 bg-red-500/10 border border-red-500/20 p-5 rounded-2xl shadow-inner">
                 <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                 <div>
                   <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Strict Security Protocol</p>
                   <p className="text-[10px] text-red-400/80 leading-relaxed font-medium">Never expose this key in client-side bundles. Revoke immediately if compromised.</p>
                 </div>
              </div>
            </div>
            
            {/* Bearer Token Area */}
            <div className="relative flex flex-col rounded-[20px] md:rounded-[28px] overflow-hidden border border-white/10 bg-[#020205] mb-6 md:mb-8 shadow-2xl group/key shrink-0 min-h-[120px] md:min-h-[140px]">
              <div className="flex items-center justify-between px-6 py-4 md:py-5 bg-white/[0.02] border-b border-white/5 shrink-0">
                 <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Bearer Authorization Token</span>
                 <button 
                   type="button"
                   onClick={() => performCopy(apiKey, 'key')}
                   className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-400 transition-colors w-[90px] justify-end outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
                   aria-label="Copy API Key"
                 >
                   {copyFeedback === 'key' ? <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                   <span className="tabular-nums">{copyFeedback === 'key' ? "Verified" : "Copy"}</span>
                 </button>
              </div>
              <div className="p-6 md:p-8 flex items-center justify-center flex-1 overflow-y-auto custom-scrollbar">
                <code className={cn(
                  "font-mono text-lg md:text-xl lg:text-2xl tracking-[0.1em] md:tracking-[0.15em] transition-colors duration-500 break-all text-center selection:bg-indigo-500/40 tabular-nums",
                  envMode === "live" ? "text-red-500 glow-text-danger" : "text-indigo-400"
                )}>
                  {apiKey}
                </code>
              </div>
            </div>

            <button 
              type="button"
              onClick={generateKey} 
              disabled={isGenerating}
              aria-busy={isGenerating}
              className={cn(
                "w-full py-5 md:py-6 rounded-[20px] md:rounded-[24px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-[11px] transition-all duration-500 flex justify-center items-center gap-4 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 transform-gpu mt-auto",
                isGenerating ? "bg-black text-slate-700 cursor-wait border border-white/5 shadow-none" 
                : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_20px_50px_rgba(79,70,229,0.25)] hover:-translate-y-1 active:scale-[0.98]"
              )}
            >
              {isGenerating ? (
                <><RefreshCcw className="w-4 h-4 animate-spin" aria-hidden="true" /> Rolling Sequence...</>
              ) : (
                <><RefreshCcw className="w-4 h-4" aria-hidden="true" /> Reset {envMode.toUpperCase()} Key</>
              )}
            </button>
          </div>

          {/* Micro-Telemetry Grid (Fixed Height Stacking) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 shrink-0 w-full">
             <div className="rounded-3xl p-6 md:p-8 bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                  <Cpu className="w-6 h-6 text-slate-600 group-hover:text-indigo-400 transition-colors" aria-hidden="true" />
                  <ChevronRight className="w-4 h-4 text-slate-800" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Endpoint Hub</p>
                  <p className="text-sm font-mono text-indigo-400/90 tracking-tight tabular-nums">api.nyaya.ai/v2.5</p>
                </div>
             </div>
             <div className="rounded-3xl p-6 md:p-8 bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                  <Activity className="w-6 h-6 text-slate-600 group-hover:text-emerald-400 transition-colors" aria-hidden="true" />
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded uppercase tracking-widest tabular-nums">Active</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Network Health</p>
                  <p className="text-sm font-mono text-white tracking-tight tabular-nums">99.98% Parity</p>
                </div>
             </div>
          </div>
        </section>

        {/* --- RIGHT CLUSTER: CI/CD PIPELINE --- */}
        <section className="xl:col-span-7 flex flex-col gap-10 min-h-0 w-full" aria-labelledby="pipeline-section">
          <h2 id="pipeline-section" className="sr-only">CI/CD Pipeline Integration</h2>
          
          <div className="rounded-[24px] md:rounded-[40px] border border-white/10 bg-black/40 backdrop-blur-md p-6 md:p-10 flex flex-col h-full shadow-2xl relative overflow-hidden transition-all hover:border-white/20 min-h-0">
            
            <div className="flex flex-wrap justify-between items-center mb-6 md:mb-8 border-b border-white/5 pb-6 md:pb-8 shrink-0 relative z-10 gap-4">
              <div className="flex items-center gap-4 md:gap-6">
                 <div className="p-3 md:p-4 bg-white/5 rounded-2xl md:rounded-3xl border border-white/10 shadow-inner">
                   <BrandGithub className="w-8 h-8 text-white" />
                 </div>
                 <div>
                   <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">Guardrails</h3>
                   <p className="text-[10px] md:text-[11px] font-black text-slate-600 uppercase tracking-widest mt-1">Automated Semantic Audit Pipeline</p>
                 </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Build</span>
              </div>
            </div>

            <p className="text-sm md:text-lg text-slate-400 leading-relaxed mb-6 md:mb-8 max-w-2xl shrink-0 relative z-10">
              Integrate forensic auditing directly into your repository. Automatically block Pull Requests 
              if institutional bias markers are detected in documentation or job listings.
            </p>

            {/* Simulated Code Terminal (High Contrast) */}
            <div className="flex-1 flex flex-col rounded-[20px] md:rounded-[33px] overflow-hidden border border-white/10 bg-[#020205] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative group/code min-h-0 z-10">
               
               <div className="flex items-center justify-between px-6 py-4 md:px-7 md:py-6 bg-white/[0.04] border-b border-white/5 shrink-0">
                  <div className="flex items-center gap-2.5">
                     <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] shadow-[0_0_12px_rgba(255,95,86,0.3)]" aria-hidden="true" />
                     <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-[0_0_12px_rgba(255,189,46,0.3)]" aria-hidden="true" />
                     <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-[0_0_12px_rgba(39,201,63,0.3)]" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span className="text-[10px] md:text-[11px] font-mono text-slate-600 tracking-tight">nyaya-audit-workflow.yml</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => performCopy(workflowYAML, 'code')}
                    className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-indigo-400 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="Copy workflow code"
                  >
                    {copyFeedback === 'code' ? <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                  </button>
               </div>

               <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-br from-transparent to-white/[0.01] min-h-0">
                 {/* A11y: Raw string for screen readers */}
                 <span className="sr-only">{workflowYAML}</span>
                 
                 {/* Pre-Tokenized Visual Syntax */}
                 <pre aria-hidden="true" tabIndex={0} className="text-[12px] md:text-[14px] font-mono leading-relaxed md:leading-[1.8] text-slate-400 whitespace-pre-wrap break-words tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-lg">
                    <span className="text-pink-500 italic">name:</span> Nyaya Bias Audit{'\n'}
                    <span className="text-pink-500 italic">on:</span> [pull_request]{'\n\n'}
                    <span className="text-pink-500 italic">jobs:</span>{'\n'}
                    {'  '}<span className="text-cyan-400 font-bold underline decoration-indigo-400/30 underline-offset-4">forensic_check:</span>{'\n'}
                    {'    '}<span className="text-pink-500 italic">runs-on:</span> ubuntu-latest{'\n'}
                    {'    '}<span className="text-pink-500 italic">steps:</span>{'\n'}
                    {'      '}- <span className="text-pink-500 italic">uses:</span> actions/checkout@v3{'\n\n'}
                    {'      '}<span className="text-slate-600 italic"># Initialize Nyaya Semantic Scanner Core</span>{'\n'}
                    {'      '}- <span className="text-pink-500 italic">name:</span> Nyaya Semantic Audit{'\n'}
                    {'        '}<span className="text-pink-500 italic">uses:</span> nyaya-ai/action-scanner@v2.5.0{'\n'}
                    {'        '}<span className="text-pink-500 italic">env:</span>{'\n'}
                    {'          '}<span className="text-emerald-400 font-bold">NYAYA_API_KEY:</span> ${`{{ secrets.NYAYA_API_KEY }}`}{'\n'}
                    {'        '}<span className="text-pink-500 italic">with:</span>{'\n'}
                    {'          '}<span className="text-emerald-400 font-bold">fail_on_critical:</span> true{'\n'}
                    {'          '}<span className="text-emerald-400 font-bold">threshold:</span> <span className="text-indigo-500 font-black tracking-widest">0.85</span>{'\n'}
                 </pre>
               </div>
            </div>

            <div className="mt-6 md:mt-8 flex items-center justify-between px-2 shrink-0 relative z-10">
               <div className="flex items-center gap-3">
                 <TerminalSquare className="w-4 h-4 text-slate-700" aria-hidden="true" />
                 <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">
                   Security Context: GitHub Encrypted Secrets Store
                 </p>
               </div>
               <div className="text-[9px] font-black text-slate-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5 tracking-widest uppercase tabular-nums shadow-inner hidden sm:block">
                 LTS Release v2.5.0
               </div>
            </div>

          </div>

        </section>
      </div>
    </div>
  );
}