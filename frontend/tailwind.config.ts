/**
 * ==========================================================================
 * NYAYA AI - TAILWIND COMPILER CONFIGURATION (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: JIT CSS Generation & Design System Tokens
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Shimmer Physics Fixed: Added 0% start state for continuous looping.
 * 2. Syntax Hardening: Converted CSS keyframe properties to JS camelCase.
 * 3. Forensic Animations: Registered 'scan-line' for data analysis visuals.
 * 4. Content Paths: Added 'lib' directory to catch utility-based class definitions.
 * ==========================================================================
 */

import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  // 1. Performance: Optimized JIT paths ensure fast builds and minimal CSS bundles
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}", // CRITICAL: Catches classes inside utils.ts
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  // 2. Accessibility: Enabling Dark Mode by default for a forensic audit aesthetic
  darkMode: ["class"],

  theme: {
    // 3. Container Optimization: Ensures dashboards look consistent across enterprise displays
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"],
      },
      
      // 4. Color Palette: Unified Design Tokens
      // Note: In globals.css, these MUST be raw RGB channels (e.g., `--primary: 79 70 229;`)
      colors: {
        nyaya: {
          bgBase: "rgb(var(--bg-base) / <alpha-value>)",
          primary: "rgb(var(--primary) / <alpha-value>)",
          accent: "rgb(var(--accent) / <alpha-value>)",
          success: "rgb(var(--success, 16 185 129) / <alpha-value>)", 
          warning: "rgb(var(--warning, 245 158 11) / <alpha-value>)",
          danger: "rgb(var(--danger, 239 68 68) / <alpha-value>)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },

      // 5. High-Performance Hardware-Accelerated Keyframes
      keyframes: {
        "gradient-x": {
          "0%, 100%": { backgroundSize: "200% 200%", backgroundPosition: "left center" },
          "50%": { backgroundSize: "200% 200%", backgroundPosition: "right center" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Powers the premium "shimmer" sweep effect on NeonButtons
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        // Data analysis scanning visual
        "scan-move": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        // Essential for the ForensicDrawer entry/exit via Radix/Tailwind-Animate
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      // 6. Global Animation Registration
      animation: {
        "gradient-x": "gradient-x 3s ease infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        shimmer: "shimmer 2s infinite linear",
        "scan-line": "scan-move 2s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      // 7. Data Visualization Specifics
      boxShadow: {
        "nyaya-neon": "0 0 20px rgba(79, 70, 229, 0.3)",
        "nyaya-neon-hover": "0 0 35px rgba(79, 70, 229, 0.5)",
      },
    },
  },

  // 8. Plugin Pipeline
  plugins: [animate, typography],
};

export default config;