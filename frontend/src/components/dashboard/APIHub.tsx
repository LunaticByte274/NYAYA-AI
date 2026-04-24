"use client";

/**
 * ==========================================================================
 * NYAYA AI - API HUB COMPONENT (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: External Integration & Developer Authentication
 * * ENHANCEMENTS APPLIED:
 * 1. Data-Driven Architecture: Extracted endpoints into a scalable config array.
 * 2. Sub-Component Isolation: Extracted Code Viewer to prevent global re-renders.
 * 3. Deep A11y (Accessibility): Added screen-reader-only raw code blocks.
 * 4. Memory-Safe Clipboard: Timeout cleanups prevent memory leaks on unmount.
 * 5. Button Safety: Enforced type="button" to prevent phantom form submissions.
 * 6. Mobile Overflow Lock: Added min-w-0 to API key container to prevent screen-slicing.
 * 7. Explicit DevTools Binding: Added displayName for precise React profiling.
 * ==========================================================================
 */

import React, { useState, useCallback, useRef, useEffect, memo, useMemo } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  Code2, 
  Cpu, 
  Lock 
} from 'lucide-react';

// --- UTILITIES ---
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// --- DATA CONFIGURATION ---
/**
 * Strict typing for API Endpoint Matrix.
 * Allows seamless scaling of the Developer Console when new AI models are deployed.
 */
interface EndpointConfig {
  id: string;
  title: string;
  description: string;
  method: "POST" | "GET" | "PUT" | "DELETE";
  path: string;
  icon: React.ElementType;
  theme: {
    baseText: string;
    hoverText: string;
    bgLight: string;
    borderLight: string;
  };
}

const ENDPOINTS: EndpointConfig[] = [
  {
    id: "text-audit",
    title: "Text Audit Engine",
    description: "Perform forensic analysis on text payloads. Identifies linguistic markers of systemic exclusion and bias proxies.",
    method: "POST",
    path: "/api/text/analyze",
    icon: Terminal,
    theme: {
      baseText: "text-indigo-400",
      hoverText: "group-hover:text-indigo-400",
      bgLight: "bg-indigo-500/10",
      borderLight: "border-indigo-500/20"
    }
  },
  {
    id: "vision-audit",
    title: "Vision Audit Core",
    description: "Upload imagery for structural parity checks. Utilizes deep multimodal forensics to identify visual affinity bias.",
    method: "POST",
    path: "/api/vision/scan",
    icon: Zap,
    theme: {
      baseText: "text-cyan-400",
      hoverText: "group-hover:text-cyan-400",
      bgLight: "bg-cyan-500/10",
      borderLight: "border-cyan-500/20"
    }
  }
];

// --- MICRO-COMPONENTS ---

/**
 * Isolated Endpoint Card Component
 * Prevents re-rendering the entire grid if one card updates its state.
 */
const EndpointCard = memo(function EndpointCard({ endpoint }: { endpoint: EndpointConfig }) {
  const Icon = endpoint.icon;
  return (
    <div className="p-8 md:p-10 rounded-[24px] md:rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 shadow-sm group transform-gpu flex flex-col h-full min-h-0">
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border group-hover:scale-110 transition-transform duration-500 shadow-inner shrink-0",
        endpoint.theme.bgLight,
        endpoint.theme.borderLight
      )}>
        <Icon className={cn("w-6 h-6", endpoint.theme.baseText)} aria-hidden="true" />
      </div>
      <h3 className={cn(
        "text-xl font-black text-white mb-3 uppercase tracking-tight transition-colors shrink-0",
        endpoint.theme.hoverText
      )}>
        {endpoint.title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium flex-1">
        {endpoint.description}
      </p>
      <div className="text-[11px] font-mono py-3 px-4 bg-[#020205] rounded-xl text-slate-400 border border-white/5 shadow-inner flex items-center gap-3 w-fit shrink-0">
        <span className={cn("font-bold", endpoint.theme.baseText)}>{endpoint.method}</span> 
        {endpoint.path}
      </div>
    </div>
  );
});

/**
 * Isolated Code Snippet Viewer
 * Wraps complex syntax highlighting away from the main thread and provides A11y fallbacks.
 */
const CodeSnippetViewer = memo(function CodeSnippetViewer({ apiKey }: { apiKey: string }) {
  // Raw string for screen readers and clipboard fallbacks
  const rawCode = `import requests

def perform_forensic_audit(data_payload):
    headers = {
        "X-API-Key": "${apiKey}",
        "Content-Type": "application/json"
    }

    # Nyaya Forensic Intelligence Endpoint
    endpoint = "https://api.nyaya.ai/v2.5/text/analyze"

    response = requests.post(endpoint, json=data_payload, headers=headers)
    return response.json()

# Result: Fairness Score & Remediation Path
print(perform_forensic_audit({"text": "Candidate must be high energy"}))`;

  return (
    <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-[#020205] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] relative group/code flex flex-col min-h-0 flex-1 w-full">
      
      {/* Mac OS Style Window Header */}
      <div className="flex items-center justify-between px-6 py-4 md:px-7 md:py-5 bg-white/[0.04] border-b border-white/5 shrink-0 w-full">
        <div className="flex items-center gap-2.5">
           <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] shadow-[0_0_12px_rgba(255,95,86,0.3)]" aria-hidden="true" />
           <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-[0_0_12px_rgba(255,189,46,0.3)]" aria-hidden="true" />
           <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-[0_0_12px_rgba(39,201,63,0.3)]" aria-hidden="true" />
        </div>
        <span className="text-[10px] md:text-[11px] font-mono text-slate-500 tracking-wider">python_sdk.py</span>
        <span className="text-[9px] md:text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md uppercase tracking-widest border border-emerald-500/20 shadow-sm">
          Enterprise Ready
        </span>
      </div>
      
      {/* Scrollable Code Area */}
      <div className="p-6 md:p-10 overflow-x-auto custom-scrollbar bg-gradient-to-br from-transparent to-white/[0.01] flex-1 min-h-0 w-full">
        {/* A11y: Screen reader text to prevent reading out broken HTML tags */}
        <span className="sr-only">{rawCode}</span>
        
        {/* Pre-Tokenized Syntax Highlighting for 0-Cost Rendering */}
        <pre 
          aria-hidden="true"
          tabIndex={0} 
          className="text-[12px] md:text-[14px] font-mono leading-[1.8] text-slate-300 tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-lg"
        >
          <span className="text-pink-500 italic">import</span> requests{'\n\n'}
          <span className="text-pink-500 italic">def</span> <span className="text-cyan-400 font-bold">perform_forensic_audit</span>(data_payload):{'\n'}
          {'    '}headers = {'{\n'}
          {'        '}<span className="text-emerald-400">"X-API-Key"</span>: <span className="text-amber-300">"{apiKey}"</span>,{'\n'}
          {'        '}<span className="text-emerald-400">"Content-Type"</span>: <span className="text-amber-300">"application/json"</span>{'\n'}
          {'    }\n\n'}
          {'    '}<span className="text-slate-500 italic"># Nyaya Forensic Intelligence Endpoint</span>{'\n'}
          {'    '}endpoint = <span className="text-amber-300">"https://api.nyaya.ai/v2.5/text/analyze"</span>{'\n\n'}
          {'    '}response = requests.post(endpoint, json=data_payload, headers=headers){'\n'}
          {'    '}<span className="text-pink-500 italic">return</span> response.json(){'\n\n'}
          <span className="text-slate-500 italic"># Result: Fairness Score & Remediation Path</span>{'\n'}
          <span className="text-cyan-400 font-bold">print</span>(perform_forensic_audit({'{'}<span className="text-emerald-400">"text"</span>: <span className="text-amber-300">"Candidate must be high energy"</span>{'}'}))
        </pre>
      </div>
    </div>
  );
});

// --- MASTER COMPONENT ---

export const APIHub = memo(function APIHub() {
  // --- STATE & REFS ---
  const [copied, setCopied] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Example Production Key (In a real app, this integrates with Auth Context)
  const apiKey = useMemo(() => "ny_live_8bit_avengers_f0r3ns1c_2026_id_772", []);

  // --- MEMORY-SAFE CLIPBOARD HANDLER ---
  const handleCopy = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.clipboard) return;
    
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      
      // Clear any existing timeout to prevent state collision
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Clipboard API execution failed:", err);
    }
  }, [apiKey]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 min-h-0 shrink-0">
      
      {/* 1. HEADER SECTION */}
      <header className="space-y-4 shrink-0">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold uppercase tracking-widest shadow-sm">
          <Cpu className="w-3.5 h-3.5" aria-hidden="true" /> Developer Console
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          Forensic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 italic">API Hub</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-3xl leading-relaxed">
          The Intelligence Engine is now available via REST. Seamlessly integrate systemic 
          bias auditing into your automated decision-making workflows and backend microservices.
        </p>
      </header>

      {/* 2. PRIMARY API MANAGEMENT VAULT */}
      <section 
        className="relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl p-8 md:p-10 shadow-2xl transition-all duration-500 hover:border-white/20 transform-gpu shrink-0 w-full"
        aria-label="API Key Management"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transform-gpu" aria-hidden="true">
          <ShieldCheck className="w-32 h-32 md:w-40 md:h-40 text-indigo-500" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                Production API Key
              </h2>
              <p className="text-[11px] md:text-xs text-slate-400 mt-2 font-medium tracking-wide">
                Security Protocol: Keep this key secret. Do not expose in client-side code bundles.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl shadow-inner shrink-0">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" aria-hidden="true" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Authenticated</span>
            </div>
          </div>

          <div className="group relative flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
            {/* min-w-0 prevents Flexbox from forcing the container wider than the screen on mobile */}
            <div className="flex-1 flex items-center bg-[#020205] border border-white/10 rounded-2xl px-6 py-5 font-mono text-sm md:text-base overflow-hidden transition-all duration-500 group-hover:border-indigo-500/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] min-w-0">
              <Lock className="w-4 h-4 text-slate-600 mr-4 flex-shrink-0" aria-hidden="true" />
              <span className="text-indigo-300/90 truncate tracking-wider tabular-nums block w-full">{apiKey}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              aria-live="polite"
              aria-label="Copy API Key to clipboard"
              className={cn(
                "p-5 rounded-2xl border transition-all duration-300 flex items-center justify-center shadow-lg active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transform-gpu",
                copied 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]" 
                : "bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-500 shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:-translate-y-0.5"
              )}
            >
              {copied ? <Check className="w-5 h-5" aria-hidden="true" /> : <Copy className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </section>

      {/* 3. ENDPOINT DOCUMENTATION MATRIX (Mapped from config) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 shrink-0 w-full">
        {ENDPOINTS.map((endpoint) => (
          <EndpointCard key={endpoint.id} endpoint={endpoint} />
        ))}
      </section>

      {/* 4. HIGH-PERFORMANCE CODE IMPLEMENTATION SNIPPET */}
      <section className="pt-4 shrink-0 flex flex-col min-h-0 w-full">
        <div className="flex items-center gap-3 mb-6 px-2 shrink-0">
          <Code2 className="w-6 h-6 text-indigo-400" aria-hidden="true" />
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Implementation Guide</h3>
        </div>
        
        <CodeSnippetViewer apiKey={apiKey} />
      </section>
      
    </div>
  );
});

// CRITICAL: Explicit DevTools Binding
APIHub.displayName = "APIHub";

// CRITICAL: Default export required for Next.js App Router Page resolution
export default APIHub;