/**
 * ==========================================================================
 * NYAYA AI - POSTCSS CONFIGURATION (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Advanced CSS Compilation & Cross-Browser Polyfilling
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Native CSS Nesting: Injected 'tailwindcss/nesting' to allow SCSS-like 
 * DOM targeting without the massive overhead of a SASS compiler.
 * 2. Execution Order: Strictly ordered nesting BEFORE Tailwind processes utilities.
 * 3. Autoprefixer: Guarantees GPU-accelerated properties ('transform-gpu', 
 * 'will-change') work flawlessly on older versions of Safari and Firefox.
 * ==========================================================================
 */

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // 1. Native Nesting Support (Crucial: Must be declared BEFORE tailwindcss)
    'tailwindcss/nesting': {},
    
    // 2. The Core Utility Engine
    tailwindcss: {},
    
    // 3. Cross-Browser Vendor Prefixing 
    autoprefixer: {},
  },
};

export default config;