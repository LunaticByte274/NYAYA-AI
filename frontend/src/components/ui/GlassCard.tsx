"use client";

/**
 * ==========================================================================
 * NYAYA AI - GLASS CARD PRIMITIVE (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Hardware-Accelerated Container UI
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Stacking Context Shield: Added 'isolate' to prevent WebKit backdrop-blur bleeding.
 * 2. React.memo() Isolation: Decouples rendering from parent layout updates.
 * 3. GPU Acceleration: 'transform-gpu' and 'will-change' applied to glow states.
 * 4. ForwardRef Architecture: Safe for Framer Motion and IntersectionObservers.
 * 5. Flex Bounds Fixed: Enforced flex-col min-h-0 on content wrapper.
 * 6. Design Parity: Synchronized border radii and deep-glass styling.
 * ==========================================================================
 */

import React, { forwardRef, memo } from "react";
import { cn } from "@/lib/utils";

// 1. Strict Typing: Extend standard HTML div attributes so the card can natively accept onClick, id, aria-labels, etc.
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

// 2. Wrap in memo() and forwardRef(). 
// - forwardRef allows parent components to attach observers or animation libraries directly to the DOM node.
// - memo prevents unnecessary SVG/blur repaints during high-frequency parent state changes.
export const GlassCard = memo(
  forwardRef<HTMLDivElement, GlassCardProps>(
    ({ children, className, glow = false, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            // Base Glassmorphic Geometry & Strict Stacking Context (isolate)
            "relative isolate bg-[#020205]/60 backdrop-blur-2xl border border-white/5 rounded-[24px] md:rounded-[32px] p-6 md:p-8 transition-all duration-500 transform-gpu min-h-0 shrink-0",
            
            // Deep Ambient Shadow
            "shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_15px_40px_rgba(0,0,0,0.6)]",
            
            // 3. Dynamic Glow & Hover State (Group targeted for internal child reactivity)
            glow && "group hover:border-indigo-500/40 hover:shadow-[0_0_40px_rgba(79,70,229,0.15)] will-change-[box-shadow,border-color]",
            
            // Custom Layout Overrides
            className
          )}
          // 4. Spread remaining props so the component is fully extensible for A11y and events
          {...props}
        >
          {/* Ambient Inner Glow (Hardware Accelerated) */}
          {glow && (
            <div 
              className="absolute -inset-[1px] rounded-[24px] md:rounded-[32px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform-gpu will-change-[opacity]" 
              aria-hidden="true" // Hide purely visual decoration from screen readers
            />
          )}
          
          {/* Safe Content Wrapper */}
          <div className="relative z-10 flex flex-col flex-1 min-h-0 h-full w-full">
            {children}
          </div>
        </div>
      );
    }
  )
);

// 5. Provide a strict display name for flawless debugging in React DevTools
GlassCard.displayName = "GlassCard";