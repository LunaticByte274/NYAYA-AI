/**
 * ==========================================================================
 * NYAYA AI - TYPESCRIPT ASSET DECLARATIONS (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Strict Type Safety for Non-TS Assets & CSS Modules
 * * CORE ENHANCEMENTS APPLIED:
 * 1. CSS Modules: Added strict string-mapping for *.module.css to prevent 'any' leakage.
 * 2. Readonly Modifiers: Enforced immutability on imported style objects to protect React state.
 * 3. Preprocessor Support: Added SCSS/SASS declarations for future-proof scaling.
 * 4. SVG Component Support: Added strict typings for SVGR React component imports.
 * ==========================================================================
 */

// 1. Standard Global CSS (Imported for side-effects, e.g., import './globals.css')
declare module "*.css";
declare module "*.scss";
declare module "*.sass";

// 2. Strict CSS Modules (Imported as immutable objects, e.g., import styles from './ui.module.css')
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// 3. Strict SCSS/SASS Modules
declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// 4. SVG Media & React Components (Supports Next.js + SVGR setups)
declare module "*.svg" {
  import React = require("react");
  
  // Exposes the SVG as a strict React component (e.g., import { ReactComponent as Icon } from './icon.svg')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  
  // Exposes the default string path for standard <img> and <Image> tags
  const src: string;
  export default src;
}

// 5. Generic Media Assets (Strictly typed as static URL strings)
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.jpeg" {
  const src: string;
  export default src;
}
declare module "*.gif" {
  const src: string;
  export default src;
}
declare module "*.webp" {
  const src: string;
  export default src;
}