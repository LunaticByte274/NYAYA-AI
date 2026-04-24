"use client";

/**
 * ==========================================================================
 * NYAYA AI - FAIRNESS JOURNEY DASHBOARD (LTS v2.5.0)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Longitudinal Parity Analysis & Epoch Telemetry
 * * CORE ARCHITECTURAL FEATURES:
 * 1. Hardware-Accelerated Recharts Rendering (transform-gpu).
 * 2. Strict Layout Height-Locking (min-h-0) preventing UI scale bloat.
 * 3. Synchronized 8xl Italic Master Header Typography.
 * 4. Tabular-num mapping for all dynamically updating forensic scores.
 * 5. TypeScript Armor: Replaced 'any' with strict Recharts TooltipProps.
 * 6. React.memo() Isolation: Applied to sub-components to save CPU cycles on hover.
 * 7. Explicit DevTools Binding: Added displayName for precise profiling.
 * ==========================================================================
 */

import React, { useState, useEffect, memo } from "react";
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  CartesianGrid,
  TooltipProps
} from 'recharts';

import { 
  TrendingUp, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Target, 
  Zap,
  Milestone,
  ArrowUpRight,
  Fingerprint
} from "lucide-react";

import { cn } from "@/lib/utils";

// --- STRICT TYPING CONTRACTS ---
interface PerformanceDataPoint {
  epoch: string;
  score: number;
  phase: string;
  color: string;
}

// --- FORENSIC ML EPOCH DATA (Immutable Simulation) ---
const PERFORMANCE_DATA: PerformanceDataPoint[] = [
  { epoch: 'Epoch 1', score: 42.0, phase: "Baseline (Biased)", color: "#ef4444" },
  { epoch: 'Epoch 2', score: 48.5, phase: "Initial Detection", color: "#f59e0b" },
  { epoch: 'Epoch 3', score: 55.2, phase: "Forensic Analysis", color: "#f59e0b" },
  { epoch: 'Epoch 4', score: 88.4, phase: "SMOTE Remediation", color: "#10b981" },
  { epoch: 'Epoch 5', score: 94.1, phase: "Parity Reached", color: "#10b981" },
  { epoch: 'Epoch 6', score: 96.8, phase: "Optimization Lock", color: "#22d3ee" },
];

// --- SUB-COMPONENT: GLASSMORPHIC TOOLTIP ---
/**
 * Renders an OLED-optimized tooltip for the Recharts instance.
 * Eliminates native Recharts white background defaults and uses strict typing.
 */
const CustomTooltip = memo(function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    // Safely cast the weakly typed Recharts payload to our strict data contract
    const data = payload[0].payload as PerformanceDataPoint;
    
    return (
      <div 
        className="bg-[#050508]/90 backdrop-blur-2xl border border-white/10 p-5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-200 transform-gpu"
        role="tooltip"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 flex items-center gap-2">
          <Fingerprint className="w-3 h-3" aria-hidden="true" /> {label}
        </p>
        <div className="flex items-center gap-4">
          <span 
            className="text-4xl font-black text-white italic tracking-tighter tabular-nums" 
            style={{ textShadow: `0 0 20px ${data.color}40` }}
          >
            {data.score}%
          </span>
          <div className="flex flex-col">
            <span 
              className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border whitespace-nowrap" 
              style={{ color: data.color, borderColor: `${data.color}30`, backgroundColor: `${data.color}10` }}
            >
              {data.phase}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
});
CustomTooltip.displayName = "CustomTooltip";

// --- SUB-COMPONENT: SERVER-SAFE MONOTONIC CLOCK ---
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

// --- MAIN DASHBOARD COMPONENT ---
export default function FairnessJourney() {
  const [mounted, setMounted] = useState<boolean>(false);

  // Hydration synchronization
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full bg-transparent" aria-hidden="true" />;

  return (
    <div className="flex flex-col h-full gap-6 lg:gap-8 text-slate-200 min-h-0 w-full selection:bg-cyan-500/40">
      
      {/* Background Ambience FX */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/5 blur-[150px] pointer-events-none rounded-full transform-gpu" aria-hidden="true" />

      {/* --- MASTER UNIFIED HEADER (8XL SYNC) --- */}
      <header className="flex flex-col xl:flex-row justify-between xl:items-end mb-4 border-b border-white/5 pb-10 gap-8 relative z-10 animate-in fade-in shrink-0 w-full">
        <div className="space-y-4 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 w-full">
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-none shrink-0">
               Fairness <span className="text-cyan-400 underline decoration-cyan-500/20 underline-offset-[12px]">Journey</span>
             </h1>
             <div className="flex items-center gap-3 mt-2 lg:mt-0 shrink-0">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                  <TrendingUp className="w-3 h-3 text-cyan-400" aria-hidden="true" />
                  <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Predictive Telemetry</span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  <Clock className="w-3 h-3 text-slate-500" aria-hidden="true" />
                  <ServerSafeClock />
               </div>
             </div>
          </div>
          <p className="text-slate-400 text-sm md:text-lg font-medium max-w-4xl leading-relaxed">
            Forensic tracking of institutional algorithmic progress. Monitor the transition from baseline bias 
            to mathematical parity across ML training epochs.
          </p>
        </div>
      </header>

      {/* --- TELEMETRY KPI OVERVIEW GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 shrink-0 w-full">
        {[
          { label: "Historical Baseline", val: "42.0%", icon: Activity, color: "text-red-400", bg: "hover:border-red-500/30", status: "Critical" },
          { label: "Current Parity Peak", val: "96.8%", icon: ShieldCheck, color: "text-emerald-400", bg: "hover:border-emerald-500/30", status: "Optimal" },
          { label: "Institutional Growth", val: "+54.8%", icon: Target, color: "text-cyan-400", bg: "hover:border-cyan-500/30", status: "Net Delta" }
        ].map((kpi, i) => (
          <div key={i} className={cn("bg-black/40 backdrop-blur-md rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col border border-white/5 transition-all shadow-2xl group min-h-[180px] md:min-h-[200px] transform-gpu", kpi.bg)}>
             <div className="flex items-center justify-between mb-6 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{kpi.label}</span>
                <kpi.icon className={cn("w-4 h-4 md:w-5 md:h-5 opacity-80", kpi.color)} aria-hidden="true" />
             </div>
             <div className="flex flex-wrap items-end gap-3 md:gap-4 mt-auto">
                <span className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter italic tabular-nums leading-none">{kpi.val}</span>
                <span className={cn("text-[9px] md:text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest mb-1 shadow-sm whitespace-nowrap", kpi.color, "border-current/20 bg-current/5")}>
                  {kpi.status}
                </span>
             </div>
          </div>
        ))}
      </div>

      {/* --- MASTER LAYOUT GRID (HEIGHT LOCKED) --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 flex-1 relative z-10 pb-10 min-h-0 w-full">
        
        {/* --- LEFT WING: CHART DASHBOARD --- */}
        <section className="xl:col-span-8 flex flex-col min-h-0 w-full" aria-labelledby="chart-title">
          <h2 id="chart-title" className="sr-only">Aggregated Parity Chart</h2>
          <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/60 backdrop-blur-xl p-6 md:p-10 h-full flex flex-col relative shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] overflow-hidden min-h-[350px]">
            
            <div className="flex justify-between items-center mb-8 md:mb-10 shrink-0 relative z-10">
              <div className="flex items-center gap-3 md:gap-4">
                 <div className="p-2.5 md:p-3 bg-cyan-500/10 rounded-xl md:rounded-2xl border border-cyan-500/20 shadow-inner shrink-0">
                   <Zap className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 animate-pulse transform-gpu" aria-hidden="true" />
                 </div>
                 <div>
                   <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none mb-1.5">Fairness Performance Index</h3>
                   <p className="text-[8px] md:text-[9px] font-bold text-slate-600 uppercase tracking-widest">Aggregated Parity (Epoch 1-6)</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-black border border-white/10 rounded-xl shrink-0">
                 <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-500 animate-ping transform-gpu" aria-hidden="true" />
                 <span className="text-[8px] md:text-[9px] font-black tracking-[0.2em] text-cyan-400 uppercase">Live Feed</span>
              </div>
            </div>

            {/* CRITICAL SVG CONTAINER: GPU ACCELERATED + MIN-H-0 */}
            <div 
              className="flex-1 w-full relative z-10 min-h-0 transform-gpu"
              role="region"
              aria-label="Area chart showing parity score progression across 6 training epochs"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="epoch" 
                    stroke="#475569" 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800, letterSpacing: '0.05em' }} 
                    tickLine={false}
                    axisLine={false}
                    dy={15}
                  />
                  <YAxis 
                    stroke="#475569" 
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace', fontWeight: 600 }} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ stroke: 'rgba(34,211,238,0.2)', strokeWidth: 2 }} 
                    isAnimationActive={true}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#22d3ee" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    animationDuration={2000}
                    activeDot={{ r: 8, fill: '#050508', stroke: '#22d3ee', strokeWidth: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* --- RIGHT WING: MILESTONE TIMELINE --- */}
        <section className="xl:col-span-4 flex flex-col min-h-0 w-full" aria-labelledby="timeline-title">
          <h2 id="timeline-title" className="sr-only">Optimization Timeline</h2>
          <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-md p-6 md:p-10 h-full flex flex-col relative shadow-2xl overflow-hidden min-h-[400px]">
            
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none transform-gpu" aria-hidden="true" />

            <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10 shrink-0 relative z-10 border-b border-white/5 pb-5 md:pb-6">
               <Milestone className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" aria-hidden="true" />
               <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Parity Milestones</h3>
            </div>

            <div className="flex-1 relative z-10 overflow-y-auto custom-scrollbar pr-2 min-h-0">
              <div className="space-y-8 md:space-y-10 pb-6">
                {PERFORMANCE_DATA.map((data, index) => (
                  <div key={index} className="flex gap-4 md:gap-6 group relative items-start">
                    
                    {/* Visual Connector Line */}
                    {index !== PERFORMANCE_DATA.length - 1 && (
                      <div className="absolute left-[11px] top-8 w-[2px] h-full bg-white/5 group-hover:bg-white/10 transition-colors" aria-hidden="true" />
                    )}
                    
                    {/* Graph Node */}
                    <div className="relative mt-1 md:mt-1.5 shrink-0">
                      <div 
                        className="w-5 h-5 md:w-6 md:h-6 rounded-full border-[3px] border-[#050508] z-10 relative flex items-center justify-center transition-all duration-500 group-hover:scale-125 shadow-lg transform-gpu" 
                        style={{ backgroundColor: data.color }}
                        aria-hidden="true"
                      >
                         {index === PERFORMANCE_DATA.length - 1 && (
                           <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-ping transform-gpu" aria-hidden="true" />
                         )}
                      </div>
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 min-w-0 group-hover:translate-x-1 transition-transform duration-300 transform-gpu">
                      <p className="text-[9px] md:text-[10px] font-mono text-slate-500 mb-1 md:mb-1.5 tracking-widest uppercase">{data.epoch}</p>
                      <h4 className="text-sm md:text-base font-black text-white mb-2 break-words leading-tight uppercase italic tracking-tight">
                        {data.phase}
                      </h4>
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1.5 px-2 md:px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 shadow-inner shrink-0">
                           <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500">Parity</span>
                           <span className="text-[10px] md:text-xs font-black tabular-nums" style={{ color: data.color }}>{data.score}%</span>
                         </div>
                         <ArrowUpRight className="w-3 h-3 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 transform-gpu" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Institutional Signature */}
            <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-white/5 flex items-center justify-between shrink-0 relative z-10">
               <div className="flex items-center gap-2 opacity-50">
                  <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-500" aria-hidden="true" />
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Kernel Verified</span>
               </div>
               <span className="text-[7.5px] md:text-[8px] font-mono text-slate-700 uppercase font-bold tabular-nums">Build v2.5.0-LTS</span>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}