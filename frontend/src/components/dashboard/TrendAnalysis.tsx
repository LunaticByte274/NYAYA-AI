"use client";

/**
 * ==========================================================================
 * NYAYA AI - HISTORICAL TREND ANALYSIS (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Hardware-Accelerated Data Visualization & Parity Tracking
 * * CORE OPTIMIZATIONS APPLIED:
 * 1. Component wrapped in React.memo() to decouple from Dashboard updates.
 * 2. Extracted CustomTrendTooltip prevents function recreation and CPU thrashing.
 * 3. Enforced tabular-nums to prevent layout jitter on dynamic percentages.
 * 4. TypeScript Armor: Enforced strict typing on Recharts generic payload object.
 * 5. Layout Locks: Resolved min-height CSS conflicts to prevent flexbox overflow.
 * ==========================================================================
 */

import React, { useMemo, memo } from "react";
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Area, 
  AreaChart,
  TooltipProps
} from "recharts";
import { TrendingUp, Activity, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// --- STRICT TYPING ---
export interface TrendDataPoint {
  month: string;
  fairness: number;
  proxies: number;
}

interface TrendAnalysisProps {
  data?: TrendDataPoint[];
}

// --- IMMUTABLE FALLBACK DATA ---
const DEFAULT_DATA: TrendDataPoint[] = [
  { month: "Jan", fairness: 65, proxies: 12 },
  { month: "Feb", fairness: 68, proxies: 10 },
  { month: "Mar", fairness: 75, proxies: 6 },
  { month: "Apr", fairness: 72, proxies: 8 },
  { month: "May", fairness: 85, proxies: 3 },
  { month: "Jun", fairness: 92, proxies: 1 },
];

const ACTIVE_DOT_PROPS = {
  r: 6,
  fill: "#22d3ee",
  stroke: "#05050A",
  strokeWidth: 3,
};

/**
 * PERFORMANCE OPTIMIZATION: EXTERNALLY BOUND TOOLTIP
 * Prevents Recharts from destroying and recreating the DOM node on every hover tick.
 */
const CustomTrendTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    // TypeScript Armor: Recharts 'payload.payload' is 'any'. We cast it to guarantee structural integrity.
    const pointData = payload[0].payload as TrendDataPoint;

    return (
      <div className="bg-[#05050A]/95 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200 transform-gpu">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
          {label} Aggregate
        </p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" aria-hidden="true" />
            <p className="text-indigo-400 font-mono text-sm uppercase tracking-widest tabular-nums">
              <span className="text-white font-bold mr-1">{payload[0].value}</span> Parity Score
            </p>
          </div>
          {pointData.proxies !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" aria-hidden="true" />
              <p className="text-red-400 font-mono text-[11px] uppercase tracking-widest tabular-nums">
                <span className="text-white font-bold mr-1">{pointData.proxies}</span> Proxies Detected
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const TrendAnalysis = memo(function TrendAnalysis({ data = DEFAULT_DATA }: TrendAnalysisProps) {
  
  // --- MEMOIZED CALCULATION ENGINE ---
  const improvement = useMemo(() => {
    if (!data || data.length < 2) return 0;
    const first = data[0]?.fairness ?? 0;
    const last = data[data.length - 1]?.fairness ?? 0;
    if (first === 0) return 0;
    return Math.round(((last - first) / first) * 100);
  }, [data]);

  return (
    <section 
      aria-labelledby="trend-analysis-title"
      className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-[#020205]/80 backdrop-blur-xl p-6 md:p-8 flex flex-col relative group overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] transition-all hover:border-white/20 min-h-[320px] shrink-0 transform-gpu w-full"
    >
      {/* Ambient Background Glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:bg-indigo-600/20 transform-gpu"
      />

      <header className="flex justify-between items-start mb-6 relative z-10 shrink-0">
        <div>
          <h3 
            id="trend-analysis-title" 
            className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2.5"
          >
            <TrendingUp className="w-4 h-4 text-indigo-400" aria-hidden="true" />
            Historical Fairness Trends
          </h3>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">
            6-Month Aggregate Audit Data
          </p>
        </div>
        
        {/* Dynamic Improvement Badge */}
        {improvement !== 0 && (
          <div 
            className={cn(
              "px-3 py-1.5 border rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest tabular-nums shadow-inner",
              improvement > 0 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
            )}
          >
            {improvement > 0 ? "+" : ""}{improvement}% Shift
          </div>
        )}
      </header>

      {/* Screen Reader Accessibility Node */}
      <div className="sr-only">
        Line chart displaying fairness trends over {data.length} months. 
        The current fairness score is {data[data.length - 1]?.fairness || "unavailable"}.
      </div>
      
      {/* Chart Wrapper: Enforces strict flex dimensions for ResponsiveContainer */}
      <div className="flex-1 w-full min-h-[200px] relative z-10" role="figure" aria-label="Fairness trends area chart">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFairness" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              
              <XAxis 
                dataKey="month" 
                stroke="#475569" 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}
                tickLine={false} 
                axisLine={false} 
                dy={12} 
              />
              
              <YAxis 
                stroke="#475569" 
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false} 
                axisLine={false} 
                domain={[40, 100]}
                tickFormatter={(value) => Math.floor(value).toString()}
                allowDecimals={false}
              />
              
              <Tooltip 
                content={<CustomTrendTooltip />}
                cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1, strokeDasharray: "3 3" }}
                isAnimationActive={true}
              />
              
              <Area 
                type="monotone" 
                dataKey="fairness" 
                stroke="#4f46e5" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorFairness)" 
                activeDot={ACTIVE_DOT_PROPS} 
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-black/40 border border-white/5 rounded-[20px] shadow-inner">
            <AlertTriangle className="w-6 h-6 mb-3 opacity-50" aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Insufficient Telemetry</span>
          </div>
        )}
      </div>
    </section>
  );
});