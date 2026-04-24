import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * ==========================================================================
 * NYAYA AI - CORE UTILITIES (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Memory-Safe Formatting & Tailwind Class Resolution
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Global Intl Caching: Upgraded Date and Number formatters to use cached instances.
 * 2. Strict Fallbacks: Bulletproof NaN and undefined handling across all parsers.
 * 3. Safe JSON Engine: Generic type-safe parser prevents runtime application crashes.
 * ==========================================================================
 */

/**
 * --- UI: TAILWIND CLASS MERGER ---
 * Optimized merger that resolves Tailwind CSS conflicts.
 * Uses twMerge to ensure the last-defined style wins (essential for dynamic themes).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- CACHED FORMATTING ENGINES (V8 Optimization) ---
// Instantiating Intl formatters is expensive. We cache them globally for O(1) reuse.
const PERCENT_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

/**
 * --- MATH: PRECISION FORMATTER ---
 * Robust number formatting with NaN protection. Uses cached V8 Intl engine.
 * @param value - The number to format
 */
export function formatNumber(value: number | string | null | undefined): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  
  if (num === null || num === undefined || isNaN(num)) return "0.00";

  return NUMBER_FORMATTER.format(num);
}

/**
 * --- MATH: PERCENTAGE CONVERTER ---
 * Optimized for Fairness Gauges and Progress Bars.
 * @param value - Value as percentage (e.g., 84.5)
 */
export function formatPercent(value: number | string | null | undefined): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num === null || num === undefined || isNaN(num)) return "0.0%";
  
  return PERCENT_FORMATTER.format(num / 100);
}

/**
 * --- DATA: DATE & LOG FORMATTER ---
 * Handles various date formats with a robust fallback.
 * Uses cached DateTimeFormat for high-performance table rendering.
 * Example output: "Apr 04, 01:48 PM"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  // Guard against "Invalid Date" objects
  if (isNaN(d.getTime())) return "Invalid Date";

  return DATE_FORMATTER.format(d);
}

/**
 * --- FORENSIC: ID TRUNCATION ---
 * Enhanced with "Middle Truncation" support, common in audit logs and blockchain.
 * @param str - The string to truncate
 * @param length - Maximum visible characters
 * @param middle - If true, truncates middle (e.g., "0x123...abcd")
 */
export function truncate(str: string | null | undefined, length: number = 12, middle: boolean = false): string {
  if (!str) return "";
  if (str.length <= length) return str;

  if (middle) {
    const charsToShow = length - 3;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return str.substring(0, frontChars) + "..." + str.substring(str.length - backChars);
  }

  return str.slice(0, length) + "...";
}

/**
 * --- SIMULATION: ASYNC DELAY ---
 * Promisified timeout for simulated AI "thinking" states.
 */
export const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

/**
 * --- CURRENCY: BANKING DOMAIN ---
 * Uses cached formatter for high-speed table rendering.
 */
export function formatCurrency(value: number | string | null | undefined): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num === null || num === undefined || isNaN(num)) return "$0.00";
  
  return CURRENCY_FORMATTER.format(num);
}

/**
 * --- STORAGE: SAFE JSON PARSER ---
 * Generic, type-safe JSON parser that prevents application crashes.
 */
export function safeJsonParse<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error(`[JSON Parse Error]: Fallback triggered.`, error);
    return fallback;
  }
}

/**
 * --- SYSTEM: ERROR EXTRACTOR ---
 * Safely extracts error messages from unknown catch blocks.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) return String(error.message);
  return String(error);
}