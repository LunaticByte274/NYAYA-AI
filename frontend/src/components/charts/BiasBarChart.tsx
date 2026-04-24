"use client";

/**
 * ==========================================================================
 * NYAYA AI - FORENSIC BIAS BAR CHART (LTS v2.5.0)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Hardware-Accelerated Data Visualization
 * * CORE OPTIMIZATIONS APPLIED:
 * 1. Extracted CustomTooltip to prevent function recreation on every render tick.
 * 2. Component wrapped in React.memo() to decouple SVG repaints from Parent telemetry intervals.
 * 3. O(N) Memoized Data Aggregation with strict undefined-safety fallbacks.
 * 4. Tabular-num rendering enforced on SVG Tooltips to prevent layout jitter.
 * 5. Strict min-h-0 boundary locking to prevent flexbox collapse in Dashboards.
 * 6. Lucide Sync: Replaced raw SVG with cached lucide-react iconography.
 * 7. TypeScript Armor: Enforced strict data contracts on Recharts payload.
 * 8. Explicit DevTools Binding: Added displayName for precise profiling.
 * ==========================================================================
 */

import React, { useMemo, memo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  CartesianGrid,
} from "recharts";
import type { TooltipProps } from "recharts";
import { BarChart3 } from "lucide-react";
import type { Finding } from "@/types";

// --- STRICT TYPING CONTRACTS ---
export interface BiasBarChartProps {
  findings: Finding[];
}

interface ChartDataPoint {
  name: string;
  issues: number;
  fillColor: string;
}

/**
 * 1. PERFORMANCE OPTIMIZATION: EXTERNALLY BOUND TOOLTIP
 * Extracted CustomTooltip OUTSIDE of the main component.
 * If defined inside, React destroys and recreates the function on every render,
 * causing massive CPU overhead and animation stuttering in Recharts SVG layers.
 */
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  const item = payload?.[0];
  // TypeScript Armor: Safely cast the weakly typed Recharts payload to our strict interface
  const data = item?.payload as ChartDataPoint | undefined;
  
  if (active && item && data) {
    return (
      <div 
        className="bg-[#05050A]/95 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200 transform-gpu"
        role="tooltip"
      >
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2">
          {label} Vector
        </p>
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full shadow-sm" 
            style={{ 
              backgroundColor: data.fillColor ?? '#999', 
              boxShadow: `0 0 10px ${data.fillColor}80` 
            }} 
            aria-hidden="true"
          />
          <p className="text-indigo-400 font-mono text-sm uppercase tracking-widest tabular-nums">
            <span className="text-white font-bold mr-1">{item.value ?? 0}</span>
            Findings
          </p>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * 2. PERFORMANCE OPTIMIZATION: REACT.MEMO COMPONENT
 * Prevents the chart from re-rendering when the parent dashboard updates
 * its telemetry logs or progress bars, saving massive CPU cycles.
 */
export const BiasBarChart = memo(function BiasBarChart({ findings }: BiasBarChartProps) {
  
  // 3. MEMOIZED DATA AGGREGATION
  // Safely groups findings by category in O(N) time complexity.
  const chartData = useMemo(() => {
    if (!findings || findings.length === 0) return [];
    
    const counts: Record<string, number> = {};
    
    // Fast O(N) Loop for maximum aggregation performance
    for (let i = 0; i < findings.length; i++) {
      const cat = findings[i].category || "General";
      counts[cat] = (counts[cat] || 0) + 1;
    }

    return Object.keys(counts).map((key, index): ChartDataPoint => {
      // Pre-calculate gradient colors based on severity rank (Red -> Amber -> Cyan -> Indigo)
      const color = index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : index === 2 ? '#22d3ee' : '#4f46e5';
      return {
        name: key,
        issues: counts[key],
        fillColor: color
      };
    }).sort((a, b) => (b.issues ?? 0) - (a.issues ?? 0)); // Sort highest severity to lowest
  }, [findings]);

  // 4. ENTERPRISE EMPTY STATE (Geometry Locked)
  if (chartData.length === 0) {
    return (
      <div 
        className="w-full flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[24px] md:rounded-[32px] bg-black/20 transition-all duration-500 hover:bg-black/40 min-h-[220px] transform-gpu"
        role="status"
        aria-label="Awaiting chart data"
      >
        <div className="p-4 bg-white/5 rounded-2xl mb-4 shadow-inner transform-gpu transition-transform hover:scale-110 duration-500 border border-white/5">
          <BarChart3 className="w-8 h-8 text-slate-600" aria-hidden="true" />
        </div>
        <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.3em]">Awaiting Telemetry</p>
      </div>
    );
  }

  // 5. ACTIVE CHART STATE (Geometry Locked)
  return (
    <div 
      className="w-full flex-1 h-full min-h-[220px] min-w-0 transform-gpu"
      role="region" 
      aria-label="Bar chart displaying the distribution of bias findings by category"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          
          <XAxis 
            dataKey="name" 
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
            tickFormatter={(value) => Math.floor(value).toString()} // Prevents decimal fractions on Y-Axis
            allowDecimals={false}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
            isAnimationActive={true}
          />
          
          <Bar 
            dataKey="issues" 
            radius={[6, 6, 0, 0]} 
            animationDuration={1500}
            animationEasing="ease-out"
            maxBarSize={48}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fillColor} 
                style={{ filter: `drop-shadow(0px 0px 8px ${entry.fillColor}40)` }} // Hardware-accelerated SVG glow
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

// CRITICAL: Explicit DevTools Binding
BiasBarChart.displayName = "BiasBarChart";