/**
 * ==========================================================================
 * NYAYA.AI CORE TYPE DEFINITIONS (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Immutable, Type-Safe API Data Contracts
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Strict Immutability: Enforced `readonly` on all fields to prevent React state mutation bugs.
 * 2. Deep Array Locking: Prevented array mutations via `readonly Type[]`.
 * 3. Component Sync: Integrated missing fields (`id`, `sdg`) required by UI Data Drawers.
 * 4. JSDoc Enrichment: Expanded documentation for flawless IDE intellisense.
 * ==========================================================================
 */

/**
 * Severity levels for identified bias findings.
 * "critical" triggers immediate systemic remediation protocols.
 */
export type Severity = "critical" | "high" | "medium" | "low";

/**
 * High-level status for dataset fairness and parity evaluation.
 */
export type FairnessStatus = "Fair" | "Biased" | "Inconclusive";

/**
 * Represents a specific forensic finding within a text or document audit.
 * Locked as strictly immutable to ensure safe propagation through memoized React components.
 */
export interface Finding {
  /** Unique cryptographic or UUID identifier for the specific flag */
  readonly id?: string;

  /** The unique category of bias (e.g., "Gender Proxy", "Linguistic Exclusion") */
  readonly category: string;
  
  /** The exact string snippet identified as problematic */
  readonly quote?: string;

  /** The zero-based start index of the finding in the original text */
  readonly startIndex: number;

  /** The zero-based end index of the finding in the original text */
  readonly endIndex: number;

  /** The risk level associated with this finding */
  readonly severity: Severity;

  /** Suggested remediation or structurally neutral alternative phrasing */
  readonly fix: string;

  /** The XAI (Explainable AI) reasoning behind this specific flag */
  readonly proof?: string;

  /** The corresponding United Nations Sustainable Development Goal metric (e.g., "10.3") */
  readonly sdg?: string;
}

/**
 * The standard response shape for the Text Forensics API.
 */
export interface TextAuditResponse {
  /** Strictly immutable array of identified bias instances */
  readonly findings: readonly Finding[];
  
  /** Telemetry metadata for the audit session */
  readonly metadata?: {
    readonly scanTimeMs: number;
    readonly wordCount: number;
    readonly engineVersion: string;
  };
}

/**
 * Metrics generated from structured dataset analysis (CSV/JSON/SQL).
 */
export interface DatasetMetrics {
  /** * Disparate Impact Ratio (DIR). 
   * Ideally between 0.8 and 1.25 (The EEOC 4/5ths Rule). 
   */
  readonly disparate_impact_ratio: number;
  
  /** The binary or ternary structural fairness status */
  readonly status: FairnessStatus;
  
  /** Human-readable summary of the metric outcome */
  readonly message: string;

  /** ISO-8601 Timestamp of when this metric was calculated */
  readonly timestamp?: string;
}

/**
 * Represents the payload for intersectional counterfactual simulations.
 */
export interface SimulationResult {
  readonly original_text: string;
  readonly simulated_text: string;
  readonly active_variables: readonly string[];
  readonly delta_impact: number;
}

/**
 * Generic API Error structure for Nyaya Forensic Services.
 */
export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly detail?: string;
  readonly traceId?: string;
}

/**
 * Lightweight shape for explainable reasoning trees used in the XAI UI components.
 */
export interface ReasoningTree {
  readonly type: string;
  readonly cause: string;
  readonly impact: string;
}