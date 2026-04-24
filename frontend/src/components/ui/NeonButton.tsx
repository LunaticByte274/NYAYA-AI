"use client";

/**
 * ==========================================================================
 * NYAYA AI - NEON BUTTON PRIMITIVE (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Hardware-Accelerated Interactive UI
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Form Submission Shield: Defaulted to type="button" to prevent phantom page reloads.
 * 2. React.memo() Isolation: Decouples rendering from parent layout updates.
 * 3. GPU Acceleration: 'transform-gpu' and 'will-change' applied to hover/active states.
 * 4. ForwardRef Architecture: Safe for Framer Motion and Tooltip references.
 * 5. Shimmer Fix: Injected missing 'group' class to activate 'group-hover' sweep.
 * 6. Tabular Numerics: Enforced on typography to prevent layout shifts during loading.
 * ==========================================================================
 */

import React, { forwardRef, useMemo, memo } from "react";
import { cn } from "@/lib/utils";

// 1. Strict Typing: Extending native button attributes ensures full flexibility
export interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "danger" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
}

// 2. Wrap in memo and forwardRef. Allows parent components to attach refs without wasteful re-renders.
export const NeonButton = memo(
  forwardRef<HTMLButtonElement, NeonButtonProps>(
    ({ children, loading, variant = "primary", size = "md", className, disabled, type = "button", ...props }, ref) => {
      
      // 3. Memoized Styles: Prevents re-calculating style strings on every render tick
      const variantStyles = useMemo(() => {
        const styles: Record<NonNullable<NeonButtonProps["variant"]>, string> = {
          primary: "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:bg-indigo-500 border border-transparent",
          danger: "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:bg-red-500 border border-transparent",
          success: "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:bg-emerald-500 border border-transparent",
          ghost: "bg-transparent border border-white/10 text-white hover:bg-white/10 shadow-none",
        };
        return styles[variant];
      }, [variant]);

      // 4. Memoized Size Geometry
      const sizeStyles = useMemo(() => {
        const sizes: Record<NonNullable<NeonButtonProps["size"]>, string> = {
          sm: "py-2.5 px-5 text-[10px]",
          md: "py-3.5 px-8 text-[11px] md:text-xs",
          lg: "py-5 px-10 text-sm md:text-base",
        };
        return sizes[size];
      }, [size]);

      const isInteractionDisabled = loading || disabled;

      return (
        <button
          ref={ref}
          type={type}
          disabled={isInteractionDisabled}
          // 5. ARIA Support: Crucial for screen readers to understand the loading state
          aria-busy={loading}
          aria-live="polite"
          className={cn(
            // Base Core Geometry
            "group relative flex items-center justify-center rounded-[16px] font-black uppercase tracking-[0.2em] transition-all duration-300 transform-gpu tabular-nums shrink-0",
            
            // Interaction Physics & Focus Rings
            "active:scale-95 overflow-hidden ring-offset-[#05050A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 will-change-transform",
            
            sizeStyles,
            
            // Conditional States
            !isInteractionDisabled 
              ? [variantStyles, "hover:-translate-y-0.5"] 
              : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed opacity-70 shadow-none hover:translate-y-0",
              
            className
          )}
          {...props}
        >
          {/* 6. Visual "Shimmer" Overlay: Adds a premium light sweep effect on hover (GPU Accelerated) */}
          {!isInteractionDisabled && (
            <span 
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none transform-gpu" 
              aria-hidden="true"
            />
          )}

          {/* Label / Loader Renderer */}
          {loading ? (
            <span className="flex items-center gap-3">
              <svg 
                className="animate-spin h-4 w-4 text-current transform-gpu" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="opacity-90 tracking-widest uppercase tabular-nums">Processing...</span>
            </span>
          ) : (
            <span className="relative z-10 flex items-center justify-center gap-2 tabular-nums">{children}</span>
          )}
        </button>
      );
    }
  )
);

// 7. Provide a strict display name for flawless debugging in React DevTools
NeonButton.displayName = "NeonButton";