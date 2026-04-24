"use client";

/**
 * ==========================================================================
 * NYAYA AI - DEBOUNCE AUDIT HOOK (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: API Rate-Limiting & Telemetry Optimization
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Cross-Environment Typing: Used ReturnType<typeof setTimeout> to prevent 
 * NodeJS vs Window namespace clashing in Next.js edge/server environments.
 * 2. Strict Delay Bounding: Ensures the JS event loop doesn't crash on negative inputs.
 * 3. Zero-Dependency: Pure React implementation for maximum execution speed.
 * ==========================================================================
 */

import { useState, useEffect } from "react";

/**
 * useDebounceAudit
 * A high-performance, type-safe hook that delays updating a value until a 
 * specified timeout has elapsed. Essential for preventing rate-limiting 
 * on expensive forensic analysis API calls during rapid user typing.
 * * @template T - The type of the value being debounced (string, object, etc).
 * @param {T} value - The input value to debounce.
 * @param {number} [delay=1000] - Delay in milliseconds. Defaults to 1000ms.
 * @returns {T} - The safely debounced value.
 */
export function useDebounceAudit<T>(value: T, delay: number = 1000): T {
  // 1. Initialize state with the initial value to ensure the first render is synchronous
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 2. Data Validation: Clamp delay to 0 to prevent Event Loop exceptions
    const safeDelay = Math.max(0, delay);

    // 3. Register the timeout with safe cross-platform typing
    const timerId: ReturnType<typeof setTimeout> = setTimeout(() => {
      setDebouncedValue(value);
    }, safeDelay);

    // 4. Memory & Performance Cleanup
    // This strictly clears the active timer if:
    // A) The user triggers a new value change before `safeDelay` finishes.
    // B) The parent component unmounts (e.g., the user changes pages).
    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]); // Only re-run the effect if the value reference or delay changes

  return debouncedValue;
}