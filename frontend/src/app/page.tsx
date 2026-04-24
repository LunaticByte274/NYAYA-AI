"use client";

/**
 * =========================================================================================
 * NYAYA AI - SYSTEM KERNEL GATEWAY (APEX LTS v2.5.0)
 * =========================================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Root Authentication, Diagnostics, & Deep Initialization Handshake
 * * CORE ARCHITECTURAL FEATURES:
 * 1. Micro-Component Architecture: 
 * - Strict React.memo isolation for sub-components (AmbientCosmos, MasterLogo, etc.).
 * - Guarantees high-FPS rendering during the rapid telemetry log pumping interval.
 * 2. Hardware-Accelerated SVG Matrix Background:
 * - Uses will-change-transform and will-change-opacity on radial blooms.
 * 3. Custom Hooks (Logic Abstraction):
 * - `useCryptoHash`: Generates simulated cryptographic hashes safely outside render.
 * - `useHardwareMetrics`: Provides stable, decoupled interval simulation.
 * 4. Hydration Mismatch Shield: 
 * - `useServerSafeClock` safely delays mounting the timestamp to match server state.
 * 5. Strict Height-Locking (Anti-Clipping) Geometry:
 * - Pervasive `min-h-0` container constraints to stop Flexbox from collapsing.
 * 6. Tabular-nums Geometry:
 * - Eliminated horizontal digit jitter during live progress bar counts.
 * 7. 100% Memory-Safe Interval & Timeout Cleanup on Unmount.
 * =========================================================================================
 */

import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useRef, 
  memo
} from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Power, 
  Cpu, 
  Fingerprint, 
  Target, 
  Globe,
  ShieldAlert,
  Lock,
  ChevronRight,
  Activity,
  TerminalSquare,
  Database,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// --- GLOBAL KERNEL INTERFACES & TYPES
// ============================================================================

/**
 * Represents a single line output in the simulated boot terminal.
 */
export interface TelemetryLog {
  id: string;
  timestamp: string;
  message: string;
  status: "pending" | "processing" | "success" | "warning";
  latency: number;
}

/**
 * Real-time hardware diagnostic representation for the pre-flight dashboard.
 */
export interface SystemMetrics {
  cpuLoad: number;
  cpuHistory: number[];
  memoryUsage: number;
  memHistory: number[];
  activeNodes: number;
  networkLatency: number;
}

// ============================================================================
// --- IMMUTABLE FORENSIC SEQUENCE DATA
// ============================================================================

/**
 * The array of messages piped to the initialization terminal during boot.
 * These simulate a deep compliance and algorithmic parity check.
 */
const KERNEL_SEQUENCE = [
  "Mounting Nyaya AI OS Core Architecture (v2.5.0)...",
  "Initializing Hardware Acceleration (GPU Target: Active)...",
  "Connecting to Global Semantic Tensor Grid...",
  "Loading Pre-trained Fairness Transformers...",
  "Establishing Secure 4096-bit Encryption Handshake...",
  "Syncing with Compliance Vectors & Regulatory Datasets...",
  "Validating EU AI Act Article 10 Standards (High Risk)...",
  "Mapping UN SDG 10.3 Inequity Tensors (Parity Protocols)...",
  "Isolating Protected Demographic Proxies (Race/Gender/Zip)...",
  "Calibrating Disparate Impact Ratio Engine (4/5ths Rule)...",
  "Checking NYC LL144 AEDT Audit Protocols...",
  "Verifying Counterfactual Perturbation Logic...",
  "Testing Multi-Layer Perceptron (MLP) Weights...",
  "Securing Biometric Hash Ledgers via AES-256...",
  "Neural Parity Calibration: 99.8% Optimized.",
  "System Integrity Verified. Handshake Complete."
];

// ============================================================================
// --- CUSTOM REACT HOOKS (LOGIC ABSTRACTION)
// ============================================================================

/**
 * Hook: useServerSafeClock
 * @description Provides a monotonically safe UTC clock string to prevent hydration mismatch.
 * @returns {string} The formatted current time.
 */
function useServerSafeClock(): string {
  const [time, setTime] = useState<string>("SYNCING CLOCK...");
  
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return time;
}

/**
 * Hook: useCryptoHash
 * @description Rotates a simulated cryptographic session hash every 2.5 seconds.
 * @param {string} prefix The prefix attached to the generated hash.
 * @returns {string} The active cryptographic hash string.
 */
function useCryptoHash(prefix = "NY-"): string {
  const [hash, setHash] = useState<string>(`${prefix}X902-CORE`);

  useEffect(() => {
    const interval = setInterval(() => {
      const chars = "ABCDEF0123456789";
      let res = prefix;
      for (let i = 0; i < 8; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setHash(res);
    }, 2500);
    return () => clearInterval(interval);
  }, [prefix]);

  return hash;
}

/**
 * Hook: useHardwareMetrics
 * @description Simulates real-time system metrics (CPU, Memory, Nodes, Latency) 
 * with history tracking for rendering procedural sparklines.
 * @returns {SystemMetrics} The current hardware diagnostic state.
 */
function useHardwareMetrics(): SystemMetrics {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuLoad: 12.4,
    cpuHistory: Array(20).fill(12.4),
    memoryUsage: 4.2,
    memHistory: Array(20).fill(4.2),
    activeNodes: 1024,
    networkLatency: 12
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newCpu = Math.max(5, Math.min(95, prev.cpuLoad + (Math.random() * 10 - 5)));
        const newMem = Math.max(2, Math.min(32, prev.memoryUsage + (Math.random() * 2 - 1)));
        return {
          cpuLoad: newCpu,
          cpuHistory: [...prev.cpuHistory.slice(1), newCpu],
          memoryUsage: newMem,
          memHistory: [...prev.memHistory.slice(1), newMem],
          activeNodes: 1024 + Math.floor(Math.random() * 12),
          networkLatency: Math.max(5, Math.min(150, prev.networkLatency + (Math.random() * 20 - 10)))
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return metrics;
}

// ============================================================================
// --- MICRO-COMPONENTS (STRICTLY MEMOIZED)
// ============================================================================

/**
 * AmbientCosmos
 * @description Renders the GPU-accelerated background grid, the radial super-bloom, 
 * and the top-down scan line during initialization.
 * @param {boolean} isInitializing Whether the system is currently booting.
 */
const AmbientCosmos = memo(function AmbientCosmos({ isInitializing }: { isInitializing: boolean }): React.ReactElement {
  return (
    <div className="absolute inset-0 pointer-events-none transform-gpu" aria-hidden="true">
      {/* Precision Particle Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
      
      {/* Central Super-Bloom Effect (GPU Promoted) */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] rounded-full blur-[150px] transition-all duration-[3000ms] ease-in-out will-change-transform will-change-opacity",
        isInitializing ? "bg-indigo-600/20 scale-[1.3] animate-pulse" : "bg-indigo-600/10 scale-100"
      )} />
      
      {/* Initialization Top-Down Scanner (Uses animate-scan-line from tailwind config) */}
      {isInitializing && (
        <div className="absolute top-0 left-0 w-full h-[35vh] bg-gradient-to-b from-indigo-500/15 to-transparent animate-scan-line opacity-60 will-change-transform" />
      )}
    </div>
  );
});
AmbientCosmos.displayName = "AmbientCosmos";

/**
 * TopStatusBar
 * @description Renders the top-level telemetry data (System Hash & UTC Clock).
 * Hidden on mobile breakpoints for spatial efficiency.
 * @param {string} systemHash The active cryptographic hash string.
 */
const TopStatusBar = memo(function TopStatusBar({ systemHash }: { systemHash: string }): React.ReactElement {
  const time = useServerSafeClock();
  return (
    <div className="absolute top-8 left-8 right-8 hidden md:flex items-start justify-between opacity-50 shrink-0 pointer-events-none z-30">
       <div className="flex flex-col text-left gap-1">
         <div className="flex items-center gap-2">
           <Cpu className="w-4 h-4 text-slate-400" aria-hidden="true" />
           <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-slate-400 tabular-nums">SYS_HASH: {systemHash}</span>
         </div>
         <span className="text-[9px] font-black text-slate-600 tracking-[0.3em] uppercase ml-6">Encrypted Channel</span>
       </div>
       
       <div className="flex flex-col text-right gap-1">
         <div className="flex items-center justify-end gap-2">
           <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-slate-400 tabular-nums">{time}</span>
           <Globe className="w-4 h-4 text-slate-400" aria-hidden="true" />
         </div>
         <span className="text-[9px] font-black text-slate-600 tracking-[0.3em] uppercase mr-6">Global Parity Net</span>
       </div>
    </div>
  );
});
TopStatusBar.displayName = "TopStatusBar";

/**
 * MasterLogo
 * @description The central interactive artifact representing the Nyaya AI Core.
 * Responds to hover events and initialization states dynamically.
 */
const MasterLogo = memo(function MasterLogo({ 
  isInitializing, 
  hovered, 
  setHovered 
}: { 
  isInitializing: boolean, 
  hovered: boolean, 
  setHovered: (v: boolean) => void 
}): React.ReactElement {
  return (
    <div 
      className="group relative mb-12 md:mb-16 shrink-0 mt-10 md:mt-0 z-40"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="img"
      aria-label="Nyaya AI Secure Handshake Core"
    >
      <div className={cn(
        "absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full transition-all duration-1000 pointer-events-none will-change-transform will-change-opacity",
        hovered || isInitializing ? "opacity-100 scale-150" : "opacity-0 scale-100"
      )} aria-hidden="true" />
      
      <div className={cn(
        "relative w-40 h-40 md:w-56 md:h-56 rounded-[48px] md:rounded-[64px] bg-[#020205] border-2 border-white/10 flex items-center justify-center transition-all duration-1000 shadow-[0_0_80px_rgba(0,0,0,0.6)] z-10 will-change-transform",
        isInitializing ? "border-indigo-400/80 rotate-[360deg] scale-90" : "hover:border-white/30 hover:scale-105 hover:-translate-y-2"
      )}>
         {isInitializing && (
           <div className="absolute inset-0 rounded-[48px] md:rounded-[64px] border border-indigo-400/50 animate-ping opacity-20 pointer-events-none" aria-hidden="true" />
         )}
         
         <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-400/80 shadow-[0_0_20px_#6366f1] animate-scan-line z-20 pointer-events-none will-change-transform" aria-hidden="true" />
         
         <ShieldCheck className={cn(
           "w-16 h-16 md:w-24 md:h-24 transition-all duration-1000 drop-shadow-2xl",
           isInitializing ? "text-indigo-400 scale-110" : "text-white"
         )} aria-hidden="true" />
         
         <div className="absolute top-5 right-5 pointer-events-none">
            <Target className={cn("w-4 h-4 md:w-5 md:h-5 text-indigo-500/50 transition-opacity duration-500", hovered ? "opacity-100" : "opacity-0")} aria-hidden="true" />
         </div>
         <div className="absolute bottom-5 left-5 pointer-events-none">
            <TerminalSquare className={cn("w-4 h-4 md:w-5 md:h-5 text-indigo-500/50 transition-opacity duration-500", hovered ? "opacity-100" : "opacity-0")} aria-hidden="true" />
         </div>
      </div>

      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-black/90 border border-white/10 rounded-full shadow-2xl backdrop-blur-xl group-hover:border-indigo-500/50 transition-colors z-20 whitespace-nowrap">
         <span className="text-[9px] md:text-[11px] font-black text-indigo-400 tracking-[0.4em] uppercase tabular-nums">Kernel v2.5.0-LTS</span>
      </div>
    </div>
  );
});
MasterLogo.displayName = "MasterLogo";

/**
 * DiagnosticBadge
 * @description Sub-component for individual hardware metrics displaying a value and a sparkline.
 */
const DiagnosticBadge = memo(function DiagnosticBadge({ 
  icon: Icon, 
  label, 
  value, 
  status, 
  history = [] 
}: { 
  icon: React.ElementType, 
  label: string, 
  value: string, 
  status: "ok" | "warn" | "danger",
  history?: number[]
}): React.ReactElement {
  // Generate a procedural SVG sparkline path
  const maxVal = Math.max(...history, 100);
  const sparklinePath = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * 40;
    const y = 16 - ((val / maxVal) * 16);
    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col p-3 md:p-4 bg-white/[0.02] border border-white/5 rounded-2xl shadow-inner gap-2 group hover:border-indigo-500/30 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-3.5 h-3.5 md:w-4 md:h-4", status === "ok" ? "text-indigo-400" : "text-amber-400")} aria-hidden="true" />
          <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
         <span className="text-[10px] md:text-[12px] font-mono font-bold text-white tabular-nums tracking-wider">{value}</span>
         {history.length > 0 && (
           <svg width="40" height="16" className="opacity-40 group-hover:opacity-80 transition-opacity" aria-hidden="true">
             <path d={sparklinePath} fill="none" stroke="currentColor" className="text-indigo-400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
           </svg>
         )}
      </div>
    </div>
  );
});
DiagnosticBadge.displayName = "DiagnosticBadge";

/**
 * ComplianceFooter
 * @description Static regulatory and tracking bar rendered at the bottom of the gateway.
 */
const ComplianceFooter = memo(function ComplianceFooter(): React.ReactElement {
  return (
    <div className="mt-12 md:mt-auto pt-8 border-t border-white/5 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 shrink-0 z-30">
       <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 md:gap-10">
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">NYC LL144</span>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">EU AI ACT</span>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">GDPR COMPLIANT</span>
       </div>
       <div className="flex items-center gap-3">
          <ShieldAlert className="w-4 h-4 text-slate-400" aria-hidden="true" />
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] italic underline decoration-white/20 underline-offset-4 text-slate-400">Institutional Integrity Verification Active</span>
       </div>
    </div>
  );
});
ComplianceFooter.displayName = "ComplianceFooter";

// ============================================================================
// --- MASTER ENTRY POINT (GATEWAY COMPONENT)
// ============================================================================

export default function NeuralGateway() {
  const router = useRouter();
  
  // High-Level Global State
  const [mounted, setMounted] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [hovered, setHovered] = useState<boolean>(false);
  
  // Telemetry & Hardware State (Driven by Custom Hooks)
  const systemHash = useCryptoHash("NY-");
  const metrics = useHardwareMetrics();
  const [activeLogs, setActiveLogs] = useState<TelemetryLog[]>([]);

  // Strict Memory Management Refs (Prevents memory leaks across navigation)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const logIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const routingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // 1. HYDRATION ANCHOR
  useEffect(() => {
    setMounted(true);
    // Safety cleanup on global unmount
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (logIntervalRef.current) clearInterval(logIntervalRef.current);
      if (routingTimeoutRef.current) clearTimeout(routingTimeoutRef.current);
    };
  }, []);

  // 2. TERMINAL AUTO-SCROLL
  useEffect(() => {
    if (terminalEndRef.current && isInitializing) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeLogs, isInitializing]);

  // 3. MASTER INITIALIZATION SEQUENCE ENGINE
  const handleLaunchSequence = useCallback(() => {
    setIsInitializing(true);
    setActiveLogs([]);
    setProgress(0);
    
    let currentStep = 0;
    let currentProgress = 0;

    // Phase A: Telemetry Log Pumping
    logIntervalRef.current = setInterval(() => {
      if (currentStep < KERNEL_SEQUENCE.length) {
        const newLog: TelemetryLog = {
          id: `log-${Date.now()}-${currentStep}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, second: '2-digit' }),
          message: KERNEL_SEQUENCE[currentStep]!,
          status: currentStep === KERNEL_SEQUENCE.length - 1 ? "success" : "pending",
          latency: Math.floor(Math.random() * 40) + 10
        };
        
        setActiveLogs(prev => [...prev, newLog]);
        currentStep++;
      } else {
        if (logIntervalRef.current) clearInterval(logIntervalRef.current);
      }
    }, 400);

    // Phase B: Non-Linear Progress Simulation
    progressIntervalRef.current = setInterval(() => {
      const remaining = 100 - currentProgress;
      const stepIncrease = Math.max(1, Math.floor(Math.random() * (remaining / 5)));
      
      currentProgress += stepIncrease;
      
      // Prevent hitting 100% until logs are completely finished
      if (currentProgress >= 99 && currentStep < KERNEL_SEQUENCE.length) {
        currentProgress = 99;
      }
      
      // Completion Handler
      if (currentProgress >= 100 || (currentProgress >= 99 && currentStep >= KERNEL_SEQUENCE.length)) {
        currentProgress = 100;
        setProgress(100);
        
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        if (logIntervalRef.current) clearInterval(logIntervalRef.current);
        
        // Secure Handshake Route Transfer (Memory Safe)
        routingTimeoutRef.current = setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setProgress(currentProgress);
      }
    }, 150);

  }, [router]);

  // Prevent SSR Hydration Mismatch by returning a solid background before mounting
  if (!mounted) return <div className="fixed inset-0 bg-[#05050A]" aria-hidden="true" />;

  return (
    // Scoped overflow-hidden prevents scrolling during animation without breaking global CSS
    <div className="fixed inset-0 z-[500] bg-[#05050A] flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-indigo-500/40 min-h-0">
      
      <AmbientCosmos isInitializing={isInitializing} />

      {/* --- KERNEL INTERFACE --- */}
      <div className="relative z-40 flex flex-col items-center w-full max-w-7xl px-6 md:px-12 text-center h-full max-h-[1000px] justify-center min-h-0 py-10">
        
        <TopStatusBar systemHash={systemHash} />

        <MasterLogo 
          isInitializing={isInitializing} 
          hovered={hovered} 
          setHovered={setHovered} 
        />

        {/* TYPOGRAPHY HERO */}
        <div className="space-y-6 mb-16 md:mb-20 animate-in fade-in zoom-in-95 duration-1000 delay-200 shrink-0 w-full z-30 relative">
           <h1 className="text-[clamp(4.5rem,12vw,12rem)] font-black text-white tracking-tighter uppercase italic leading-none transition-all drop-shadow-2xl">
             Nyaya <span className="text-indigo-500">AI</span>
           </h1>
           <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mt-6">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" aria-hidden="true" />
                 <span className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] md:tracking-[0.6em]">Institutional Fairness</span>
              </div>
              <div className="hidden md:block w-px h-5 bg-white/15" aria-hidden="true" />
              <div className="flex items-center gap-3">
                 <Database className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                 <span className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] md:tracking-[0.6em]">Forensic Audit Engine</span>
              </div>
           </div>
        </div>

        {/* INTERACTION / DIAGNOSTIC CORE */}
        <div className="w-full max-w-4xl flex flex-col justify-center min-h-[220px] md:min-h-[280px] shrink-0 relative z-40">
           {!isInitializing ? (
             
             /* IDLE STATE: Diagnostics & Launch */
             <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full relative z-40">
                
                {/* Advanced Diagnostic Readouts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-80 pointer-events-none">
                  <DiagnosticBadge icon={Cpu} label="CPU Core" value={`${metrics.cpuLoad.toFixed(1)}%`} status="ok" history={metrics.cpuHistory} />
                  <DiagnosticBadge icon={Activity} label="Memory" value={`${metrics.memoryUsage.toFixed(1)} GB`} status="ok" history={metrics.memHistory} />
                  <DiagnosticBadge icon={Server} label="Nodes" value={metrics.activeNodes.toString()} status="ok" />
                  <DiagnosticBadge icon={Zap} label="Latency" value={`${metrics.networkLatency.toFixed(0)} ms`} status="ok" />
                </div>

                <button 
                  type="button"
                  onClick={handleLaunchSequence}
                  aria-label="Initialize Nyaya AI System"
                  className="group relative w-full py-6 md:py-8 bg-white/[0.03] hover:bg-indigo-600 border border-white/10 hover:border-indigo-400 rounded-[28px] md:rounded-[32px] transition-all duration-500 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center justify-center gap-5 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 z-50 cursor-pointer"
                >
                    {/* Ensure gradient sweep uses shimmer animation from config safely */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none will-change-transform" aria-hidden="true" />
                    
                    <Power className="w-6 h-6 md:w-8 md:h-8 text-slate-500 group-hover:text-white transition-colors" aria-hidden="true" />
                    <span className="text-sm md:text-lg font-black text-white uppercase tracking-[0.4em] md:tracking-[0.6em] group-hover:scale-105 transition-transform will-change-transform">Initialize System</span>
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-slate-500 group-hover:text-white group-hover:translate-x-2 transition-all will-change-transform" aria-hidden="true" />
                </button>
                
                {/* Pre-flight Security Status */}
                <div className="flex items-center justify-center gap-6 md:gap-12 opacity-50 pointer-events-none">
                   <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                      <span className="text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest">Biometric Validated</span>
                   </div>
                   <div className="w-1 h-1 rounded-full bg-white/30 hidden md:block" aria-hidden="true" />
                   <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
                      <span className="text-[9px] md:text-[10px] font-black text-amber-400 uppercase tracking-widest">Awaiting Tensor Mount</span>
                   </div>
                </div>
             </div>

           ) : (

             /* ACTIVE STATE: High-Density Terminal & Boot Progress */
             <div className="space-y-8 md:space-y-10 animate-in fade-in zoom-in-95 duration-500 text-left w-full h-full flex flex-col justify-end">
                
                {/* FORENSIC BOOT TERMINAL */}
                <div className="bg-[#020205] rounded-[24px] md:rounded-[32px] border border-white/10 p-6 md:p-8 font-mono text-[10px] md:text-xs h-48 md:h-64 overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,1)] relative flex flex-col min-h-0">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-20" aria-hidden="true" />
                    
                    <div className="space-y-3 relative z-10 flex-1 flex flex-col justify-end min-h-0 custom-scrollbar pr-2">
                      {activeLogs.map((log, i) => {
                        const isLatest = i === activeLogs.length - 1;
                        return (
                          <div key={log.id} className={cn(
                            "flex gap-4 items-start animate-in fade-in slide-in-from-left-4 duration-300",
                            isLatest ? "text-indigo-400" : "text-slate-600"
                          )}>
                            <span className="shrink-0 opacity-50 select-none tabular-nums" aria-hidden="true">[{log.timestamp}]</span>
                            <span className="shrink-0 w-12 text-right opacity-30 select-none tabular-nums hidden sm:block" aria-hidden="true">{log.latency}ms</span>
                            <p className="leading-relaxed flex-1 break-words">{log.message}</p>
                            {isLatest && log.status === "success" && (
                               <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-2" aria-hidden="true" />
                            )}
                          </div>
                        );
                      })}
                      {/* Terminal Cursor Simulation */}
                      <div className="flex items-center gap-4 mt-2 h-4 shrink-0">
                        <span className="shrink-0 opacity-0 select-none tabular-nums w-[80px] sm:w-[130px]" aria-hidden="true">Placeholder</span>
                        <div className="w-2 h-4 md:h-5 bg-indigo-500 animate-pulse shrink-0" aria-hidden="true" />
                      </div>
                      <div ref={terminalEndRef} aria-hidden="true" />
                    </div>
                </div>

                {/* PROGRESS CORE BAR */}
                <div className="space-y-5 bg-white/[0.02] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/5 shadow-2xl backdrop-blur-xl">
                   <div className="flex justify-between items-end px-2">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] md:text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] animate-pulse">Bootstrapping Matrices</span>
                        <span className="text-[10px] md:text-[11px] font-mono text-slate-500 uppercase tracking-widest tabular-nums flex items-center gap-2">
                          <Lock className="w-3 h-3 text-slate-600" aria-hidden="true" />
                          {systemHash}-SECURE
                        </span>
                      </div>
                      <span className="text-4xl md:text-5xl font-black font-mono text-white tabular-nums italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        {progress}%
                      </span>
                   </div>
                   
                   <div className="h-3 w-full bg-[#020205] rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.8)] relative overflow-hidden will-change-[width]"
                        style={{ width: `${progress}%` }}
                      >
                         {/* Secure shimmer effect tied directly to tailwind utility */}
                         <div className="absolute inset-0 bg-white/20 animate-shimmer will-change-transform" aria-hidden="true" />
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>

        <ComplianceFooter />
      </div>
    </div>
  );
}