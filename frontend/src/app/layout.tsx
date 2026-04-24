import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import { 
  FileText, 
  Database, 
  Eye, 
  Activity, 
  ShieldCheck, 
  TrendingUp, 
  TerminalSquare,
  Menu,
  Cpu,
  Fingerprint,
  Lock,
  ChevronRight
} from "lucide-react";

/**
 * ==========================================================================
 * NYAYA AI - ROOT LAYOUT ARCHITECTURE (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Persistent Global Shell & Navigation
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Navigation Sync: Points Text Forensics to /dashboard for the Neural Gate flow.
 * 2. Icon Integration: Integrated Cpu, Fingerprint, Lock, & ChevronRight cleanly.
 * 3. Brand Scaling: Scaled side-branding to text-6xl for high-density UI alignment.
 * 4. Geometry Locking: Forced absolute horizontal visibility to prevent numeric clipping.
 * 5. Deep Hydration Shielding: Applied suppressHydrationWarning to core structural blocks.
 * 6. Viewport Optimization: Enforced 100dvh to prevent mobile Safari layout jumping.
 * 7. Tailwind Geometry Armor: Locked non-standard w-4.5 to strict w-[18px] coordinates.
 * 8. Metadata Safety: Enforced strict URL object fallback for Next.js CI/CD pipelines.
 * ==========================================================================
 */

// --- ENTERPRISE FONT OPTIMIZATION ---
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter", 
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "900"]
});

const mono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono", 
  display: "swap",
  weight: ["400", "500", "700"]
});

// --- ADVANCED INSTITUTIONAL METADATA ---
export const metadata: Metadata = {
  // Safety Fallback: Prevents CI/CD build crashes if the ENV var is missing during compilation
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nyaya.ai"),
  title: {
    default: "Nyaya AI | Global Fairness Engine",
    template: "%s | Nyaya AI"
  },
  description: "Enterprise-grade bias detection, forensic dataset auditing, and ethical AI compliance system.",
  authors: [{ name: "Nyaya Systems", url: "https://nyaya.ai" }],
  openGraph: {
    title: "Nyaya AI | Forensic Fairness Engine",
    description: "Mathematically verify historical data and structural policies for systemic bias.",
    type: "website",
    siteName: "Nyaya AI",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#05050A",
};

// --- NAVIGATION HIERARCHY ---
const NAV_CATEGORIES = [
  {
    title: "Intelligence Suite",
    links: [
      { name: "Text Forensics", href: "/dashboard", icon: FileText }, 
      { name: "Dataset Audit", href: "/auditor", icon: Database },
      { name: "Vision Audit", href: "/vision", icon: Eye },
      { name: "Counterfactuals", href: "/sandbox", icon: Activity },
    ]
  },
  {
    title: "Governance & Analytics",
    links: [
      { name: "Compliance Logs", href: "/compliance", icon: ShieldCheck },
      { name: "Fairness Journey", href: "/journey", icon: TrendingUp },
    ]
  },
  {
    title: "System",
    links: [
      { name: "Developer API", href: "/developer", icon: TerminalSquare },
    ]
  }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${inter.variable} ${mono.variable}`}
    >
      <body 
        suppressHydrationWarning 
        className="font-sans flex flex-col md:flex-row h-[100dvh] w-full overflow-hidden bg-[#05050A] text-slate-200 selection:bg-indigo-500/40 selection:text-white antialiased"
      >
        
        {/* A11y: Skip link for screen readers */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-indigo-600 focus:text-white font-black uppercase tracking-widest outline-none transition-all"
        >
          Skip to main content
        </a>

        {/* Ambient GPU-Accelerated Backdrop */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.12] transform-gpu" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        {/* --- MOBILE NAVIGATION HEADER --- */}
        <header suppressHydrationWarning className="md:hidden flex items-center justify-between p-4 bg-black/40 backdrop-blur-xl border-b border-white/5 relative z-50 m-2 rounded-2xl shadow-xl shrink-0 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              <Fingerprint className="text-white w-5 h-5" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-black tracking-widest text-white italic tabular-nums whitespace-nowrap">NYAYA</h1>
          </div>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Toggle Menu" type="button">
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        {/* --- ENTERPRISE SIDEBAR SHELL (DESKTOP) --- */}
        <aside 
          suppressHydrationWarning
          className="w-[280px] xl:w-[320px] bg-black/20 backdrop-blur-3xl m-4 flex-col hidden md:flex relative z-50 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all h-[calc(100vh-32px)] shrink-0 border border-white/5 rounded-[32px] overflow-hidden min-h-0" 
          aria-label="Institutional Navigation"
        >
          
          {/* Logo & Branding Area */}
          <div className="p-10 border-b border-white/5 relative overflow-hidden shrink-0 group cursor-default">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-indigo-600/20 transition-colors duration-1000 transform-gpu" aria-hidden="true" />
            <div className="flex items-start gap-3 relative z-10 mb-2">
              <h1 className="text-5xl xl:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-500 italic leading-none tabular-nums whitespace-nowrap shrink-0 transition-transform duration-500 group-hover:scale-[1.02] transform-gpu">NYAYA</h1>
              <div className="flex flex-col gap-1">
                 <span className="px-2.5 py-1 bg-indigo-500/20 border border-indigo-500/30 text-[9px] font-black text-cyan-400 rounded-lg uppercase tracking-widest tabular-nums whitespace-nowrap shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]">OS</span>
                 <Fingerprint className="w-4 h-4 text-indigo-500/40 mt-1" aria-hidden="true" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-black tracking-[0.25em] uppercase relative z-10 tabular-nums whitespace-nowrap shrink-0">Forensic Audit Systems</p>
          </div>
          
          {/* Nav Categories */}
          <nav suppressHydrationWarning className="px-5 py-8 space-y-10 flex-1 overflow-y-auto custom-scrollbar min-h-0" role="navigation">
            {NAV_CATEGORIES.map((category, idx) => (
              <div key={idx} suppressHydrationWarning className="shrink-0">
                <h2 className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-5 block tabular-nums whitespace-nowrap shrink-0">
                  {category.title}
                </h2>
                <ul className="space-y-1.5 list-none p-0 m-0">
                  {category.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 font-bold text-[14px] tracking-wide border border-transparent hover:text-white hover:bg-white/[0.03] hover:border-white/10 transition-all group focus:ring-1 focus:ring-indigo-500/50 outline-none tabular-nums whitespace-nowrap shrink-0 transform-gpu"
                      >
                        <link.icon className="w-[18px] h-[18px] text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" aria-hidden="true" />
                        <span className="flex-1 truncate">{link.name}</span>
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity shrink-0" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Engine Status & API Health Unit */}
          <div className="p-6 border-t border-white/5 bg-[#020205]/60 shrink-0">
            <div 
              className="p-5 bg-black/80 rounded-2xl border border-white/5 shadow-inner tabular-nums whitespace-nowrap shrink-0 relative overflow-hidden group/status" 
              role="meter" 
              aria-label="API Quota"
              aria-valuenow={84} 
              aria-valuemin={0}
              aria-valuemax={100}
            >
               <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/status:opacity-30 transition-opacity pointer-events-none transform-gpu">
                  <Cpu className="w-10 h-10 text-white" aria-hidden="true" />
               </div>
               <div className="flex justify-between items-center mb-4 relative z-10">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Load</span>
                 <span className="text-[10px] text-indigo-400 font-mono font-bold tracking-tighter">84.2%</span>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                 <div className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 w-[84.2%] rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)] transform-gpu will-change-[width]" />
               </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between px-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" aria-hidden="true" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_#10b981] transform-gpu" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] tabular-nums whitespace-nowrap">Core Online</span>
                <Lock className="w-3 h-3 text-slate-700 ml-1 shrink-0" aria-hidden="true" />
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-600 bg-white/5 px-2 py-1 rounded border border-white/5 shrink-0">v2.5.0</span>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT FRAME --- */}
        <main 
          id="main-content" 
          className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar w-full scroll-smooth flex flex-col min-h-0"
        >
          <div className="w-full max-w-[1600px] mx-auto relative flex-1 flex flex-col pb-10 min-h-0">
             {children}
          </div>
        </main>
        
      </body>
    </html>
  );
}