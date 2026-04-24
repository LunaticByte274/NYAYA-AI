"use client";

/**
 * ==========================================================================
 * NYAYA AI - SIDEBAR NAVIGATION (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Persistent Layout Shell & Navigation
 * * CORE ENHANCEMENTS APPLIED:
 * 1. React.memo() Isolation: Decouples navigation shell from child page renders.
 * 2. Layout Geometry Locks: Enforced 'min-h-0 flex flex-col h-full' to prevent flexbox collapse.
 * 3. Hardware Acceleration: 'transform-gpu' applied to hover states and progress bars.
 * 4. Lucide Integration: Fixed non-standard Tailwind sizing (w-4.5) to strict [18px] bounds.
 * 5. Tabular Numerics: Enforced on all labels to prevent layout jitter.
 * ==========================================================================
 */

import React, { useMemo, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileText, 
  Database, 
  Eye, 
  Activity, 
  ShieldCheck, 
  TerminalSquare 
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- DATA-DRIVEN CONFIGURATION ---
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: { text: string; variant: "beta" | "dev" };
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAVIGATION_CONFIG: NavSection[] = [
  {
    title: "Intelligence",
    items: [
      {
        label: "Forensic Text Audit",
        href: "/",
        icon: FileText,
      },
      {
        label: "Multimodal Audit",
        href: "/vision",
        badge: { text: "Beta", variant: "beta" },
        icon: Eye,
      },
      {
        label: "Dataset Analysis",
        href: "/auditor",
        icon: Database,
      },
      {
        label: "Counterfactuals",
        href: "/sandbox",
        icon: Activity,
      },
    ],
  },
  {
    title: "System & Governance",
    items: [
      {
        label: "Compliance Logs",
        href: "/compliance",
        icon: ShieldCheck,
      },
      {
        label: "API Ecosystem",
        href: "/developer",
        badge: { text: "Dev", variant: "dev" },
        icon: TerminalSquare,
      },
    ],
  },
];

// --- MICRO-COMPONENT: MEMOIZED NAV LINK ---
// Prevents individual links from re-rendering unless their specific active state changes
const NavLink = memo(function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;
  
  return (
    <li>
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center gap-4 px-5 py-3.5 rounded-2xl border transition-all duration-300 group outline-none focus-visible:ring-2 transform-gpu will-change-transform",
          isActive
            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(79,70,229,0.15)] focus-visible:ring-indigo-500"
            : "text-slate-400 font-medium text-sm tracking-wide border-transparent hover:text-white hover:bg-white/5 hover:border-white/10 focus-visible:ring-slate-400"
        )}
      >
        <Icon
          className={cn(
            "w-[18px] h-[18px] shrink-0 transition-colors duration-300 transform-gpu",
            isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
          )}
          aria-hidden="true"
        />
        
        <span className="truncate whitespace-nowrap shrink-0 tabular-nums flex-1">
          {item.label}
        </span>
        
        {item.badge && (
          <span
            className={cn(
              "ml-auto text-[8.5px] px-2 py-0.5 rounded-lg uppercase font-black tracking-widest border shrink-0 tabular-nums",
              item.badge.variant === "beta"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_10px_rgba(79,70,229,0.1)]"
            )}
          >
            {item.badge.text}
          </span>
        )}
      </Link>
    </li>
  );
});

// --- MASTER SIDEBAR COMPONENT ---
export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();
  
  // Example API Quota (In production, this hooks into a global context or API fetch)
  const apiQuota = 84.2; 

  // Memoize navigation mapping to avoid unnecessary object processing on ticks
  const renderedNavigation = useMemo(() => {
    return NAVIGATION_CONFIG.map((section) => (
      <div key={section.title} className="mb-8">
        <span className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 block">
          {section.title}
        </span>
        <ul className="space-y-1.5 list-none p-0 m-0">
          {section.items.map((item) => (
            <NavLink key={item.href} item={item} isActive={pathname === item.href} />
          ))}
        </ul>
      </div>
    ));
  }, [pathname]);

  return (
    <aside
      className="w-[280px] xl:w-[320px] bg-black/20 backdrop-blur-3xl m-4 flex flex-col hidden md:flex relative z-50 shadow-[0_0_50px_rgba(0,0,0,0.5)] h-[calc(100dvh-32px)] shrink-0 border border-white/5 rounded-[32px] overflow-hidden min-h-0"
      aria-label="Institutional Navigation"
    >
      {/* Branding Area */}
      <header className="p-8 xl:p-10 border-b border-white/5 relative overflow-hidden shrink-0 group cursor-default">
        {/* Ambient Top-Right Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/10 blur-[50px] rounded-full pointer-events-none transition-colors duration-1000 group-hover:bg-indigo-600/20 transform-gpu" aria-hidden="true" />
        
        <div className="flex items-start gap-3 relative z-10 mb-2">
          <h1 className="text-5xl xl:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-500 italic leading-none tabular-nums whitespace-nowrap shrink-0 transition-transform duration-500 group-hover:scale-[1.02] transform-gpu">
            NYAYA
          </h1>
          <div className="flex flex-col gap-1 mt-1">
             <span className="px-2.5 py-1 bg-indigo-500/20 border border-indigo-500/30 text-[9px] font-black text-cyan-400 rounded-lg uppercase tracking-widest tabular-nums whitespace-nowrap shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
               OS
             </span>
          </div>
        </div>
        
        <p className="text-[10px] text-slate-500 font-black tracking-[0.25em] uppercase relative z-10 tabular-nums whitespace-nowrap shrink-0">
          Forensic Audit Systems
        </p>
      </header>

      {/* Scrollable Navigation Content */}
      <nav className="p-5 py-8 flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {renderedNavigation}
      </nav>

      {/* API Quota & System Status Footer */}
      <footer className="p-6 border-t border-white/5 bg-[#020205]/60 shrink-0">
        {/* Metric Card */}
        <section
          className="p-5 bg-black/80 rounded-2xl border border-white/5 shadow-inner tabular-nums whitespace-nowrap shrink-0 relative overflow-hidden group/status"
          aria-labelledby="quota-label"
        >
          <div className="flex justify-between items-center mb-4 relative z-10">
            <span id="quota-label" className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Neural Load
            </span>
            <span className="text-[10px] text-indigo-400 font-mono font-bold tracking-tighter" aria-live="polite">
              {apiQuota}%
            </span>
          </div>
          
          <div 
            className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10" 
            role="progressbar" 
            aria-valuenow={apiQuota} 
            aria-valuemin={0} 
            aria-valuemax={100}
          >
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)] transform-gpu will-change-[width]"
              style={{ width: `${apiQuota}%` }}
            />
          </div>
        </section>

        {/* Global Status Node */}
        <div className="mt-6 flex items-center justify-between px-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" aria-hidden="true" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_#10b981] transform-gpu" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] tabular-nums whitespace-nowrap">
              Core Online
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-600 bg-white/5 px-2 py-1 rounded border border-white/5 select-none tabular-nums">
            v2.5.0
          </span>
        </div>
      </footer>
    </aside>
  );
});