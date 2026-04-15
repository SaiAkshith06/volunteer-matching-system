/**
 * ─── MATCHING CONFIGURATION ─────────────────────────────────────────────────
 *
 * Centralised config for the matching engine. All tuneable constants live
 * here so they can be adjusted per deployment or task type without touching
 * scoring logic.
 */

// ─── Scoring Weights (must sum to 1.0) ──────────────────────────────────────

export interface ScoringWeights {
  skills: number;
  location: number;
  availability: number;
  urgency: number;
  rating: number;
  workload: number;
  reliability: number;
}

/** Default balanced weights */
export const DEFAULT_WEIGHTS: ScoringWeights = {
  skills: 0.30,
  location: 0.20,
  availability: 0.15,
  urgency: 0.10,
  rating: 0.10,
  workload: 0.05,
  reliability: 0.10,
};

/** Emergency-biased weights — prioritise urgency and skills */
export const EMERGENCY_WEIGHTS: ScoringWeights = {
  skills: 0.35,
  location: 0.15,
  availability: 0.10,
  urgency: 0.20,
  rating: 0.05,
  workload: 0.05,
  reliability: 0.10,
};

// ─── Skill Priority Map ─────────────────────────────────────────────────────
// Reflects real-world scarcity: healthcare > logistics > general

export const SKILL_PRIORITY: Record<string, number> = {
  'first aid': 1.0,
  healthcare: 1.0,
  counseling: 0.95,
  logistics: 0.9,
  driving: 0.85,
  teaching: 0.8,
  'it support': 0.75,
  cooking: 0.7,
  general: 0.6,
};

export const DEFAULT_SKILL_PRIORITY = 0.6;

// ─── Thresholds ─────────────────────────────────────────────────────────────

/** Minimum score for auto-assignment (0–100 integer) */
export const AUTO_ASSIGN_MIN_SCORE = 70;

/** Maximum tasks a single volunteer can hold before being filtered out */
export const MAX_ACTIVE_TASKS = 3;

/** Maximum volunteer rating (for normalisation) */
export const MAX_RATING = 5;

// ─── Availability Partial-Overlap Groups ────────────────────────────────────
// Pairs of time keywords that partially overlap score 0.5

export const PARTIAL_OVERLAP_GROUPS: string[][] = [
  ['weekdays', 'mornings', 'evenings'],
  ['weekends', 'mornings', 'evenings'],
];
