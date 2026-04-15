import type { Volunteer, Need, Match, Urgency, MatchBreakdown } from '../types';

// ─── Weight Constants (sum = 1.0) ────────────────────────────────────────────
// Multi-factor scoring weights calibrated for balanced, realistic matching.
// Skills dominate because skill‑fit is the strongest predictor of success.

const WEIGHT_SKILLS = 0.35;
const WEIGHT_LOCATION = 0.25;
const WEIGHT_AVAILABILITY = 0.15;
const WEIGHT_URGENCY = 0.10;
const WEIGHT_RATING = 0.10;
const WEIGHT_WORKLOAD = 0.05;

const MAX_TOP_MATCHES = 10;

// Maximum volunteer rating (used for normalization)
const MAX_RATING = 5;

// ─── Skill Priority Map ─────────────────────────────────────────────────────
// High-priority skills receive a boost when matched, reflecting real-world
// demand where healthcare and logistics volunteers are harder to find.

const SKILL_PRIORITY: Record<string, number> = {
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

const DEFAULT_SKILL_PRIORITY = 0.6;

// ─── Workload Tracker ────────────────────────────────────────────────────────
// Tracks how many tasks each volunteer has been assigned in the current
// matching pass, used to discourage overloading a single volunteer.

const volunteerTaskCount = new Map<string, number>();

/**
 * Resets the workload tracker. Should be called at the start of each
 * full matching cycle to ensure counts reflect only current assignments.
 */
export function resetWorkloadTracker(): void {
  volunteerTaskCount.clear();
}

/**
 * Records an assignment for workload tracking purposes.
 */
export function recordAssignment(volunteerId: string): void {
  const current = volunteerTaskCount.get(volunteerId) ?? 0;
  volunteerTaskCount.set(volunteerId, current + 1);
}

// ─── Helper: Safe Number ─────────────────────────────────────────────────────
// Guarantees a valid number in [0, 1], replacing NaN / undefined with 0.

function safeScore(value: number): number {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
}

// ─── Individual Scoring Functions ────────────────────────────────────────────

/**
 * Calculates the skills match score between a volunteer and a need.
 *
 * Algorithm:
 * 1. Normalize all skill strings (lowercase, trim).
 * 2. Compute the raw overlap ratio: matched / required.
 * 3. Apply priority weighting — high-priority skills that match receive
 *    an additive boost, making domain-critical matches rank higher.
 * 4. The final score is the average of the raw ratio and the
 *    priority-weighted ratio, clamped to [0, 1].
 *
 * @returns A value between 0 and 1.
 */
export function skillsScore(
  volunteerSkills: string[] = [],
  requiredSkills: string[] = []
): number {
  if (!requiredSkills || requiredSkills.length === 0) return 1;
  if (!volunteerSkills || volunteerSkills.length === 0) return 0;

  const normalizedVolunteer = volunteerSkills.map(
    (s) => (s ?? '').toLowerCase().trim()
  );
  const normalizedRequired = requiredSkills.map(
    (s) => (s ?? '').toLowerCase().trim()
  );

  // Raw overlap ratio
  const matchedSkills = normalizedRequired.filter((skill) =>
    normalizedVolunteer.includes(skill)
  );
  const rawRatio = matchedSkills.length / normalizedRequired.length;

  // Priority-weighted score: sum of priorities for matched skills divided
  // by sum of priorities for all required skills.
  const totalRequiredPriority = normalizedRequired.reduce(
    (sum, skill) => sum + (SKILL_PRIORITY[skill] ?? DEFAULT_SKILL_PRIORITY),
    0
  );
  const matchedPriority = matchedSkills.reduce(
    (sum, skill) => sum + (SKILL_PRIORITY[skill] ?? DEFAULT_SKILL_PRIORITY),
    0
  );
  const priorityRatio =
    totalRequiredPriority > 0 ? matchedPriority / totalRequiredPriority : 0;

  // Blend raw and priority-weighted scores (60/40 split favoring priority)
  const blendedScore = rawRatio * 0.4 + priorityRatio * 0.6;

  return safeScore(blendedScore);
}

/**
 * Location matching score based on normalized word overlap.
 *
 * Algorithm:
 * 1. Normalize both strings (lowercase, trim).
 * 2. If exact match → 1.0.
 * 3. Split into words and compute Jaccard-like overlap against the
 *    need's location words.
 * 4. Partial word matches (≥ 1 overlapping word) score ≥ 0.5
 *    to reward "nearby" locations.
 *
 * @returns A value between 0 and 1.
 */
export function locationScore(
  volunteerLocation: string = '',
  needLocation: string = ''
): number {
  const vLoc = (volunteerLocation ?? '').toLowerCase().trim();
  const nLoc = (needLocation ?? '').toLowerCase().trim();

  if (vLoc === nLoc && vLoc !== '') return 1;
  if (!vLoc || !nLoc) return 0;

  const vWords = vLoc.split(/\s+/).filter((w) => w.length > 0);
  const nWords = nLoc.split(/\s+/).filter((w) => w.length > 0);

  if (vWords.length === 0 || nWords.length === 0) return 0;

  // Count overlapping words
  const matchingWords = nWords.filter((w) => vWords.includes(w)).length;

  if (matchingWords === 0) return 0;

  const overlapRatio = matchingWords / nWords.length;

  // Boost partial matches to at least 0.5 so "nearby" still scores
  return safeScore(overlapRatio < 1 ? Math.max(0.5, overlapRatio) : 1);
}

/**
 * Availability matching score.
 *
 * Rules:
 * - If the need has no timeframe constraint → 1.0 (any volunteer fits).
 * - If the volunteer is "flexible" → 1.0.
 * - Exact match → 1.0.
 * - Partial overlap (e.g., "weekdays" vs "mornings") → 0.5.
 * - No match → 0.0.
 *
 * @returns A value between 0 and 1.
 */
export function availabilityScore(
  volunteerAvailability: string = '',
  needTimeframe?: string
): number {
  const vol = (volunteerAvailability ?? '').toLowerCase().trim();

  // No constraint on timing — everyone qualifies
  if (!needTimeframe) return 1.0;

  // Flexible volunteers can always work
  if (vol === 'flexible') return 1.0;

  const need = needTimeframe.toLowerCase().trim();

  // Exact match
  if (vol === need) return 1.0;

  // Partial overlap heuristic — time ranges that partially intersect
  const PARTIAL_GROUPS: string[][] = [
    ['weekdays', 'mornings', 'evenings'],
    ['weekends', 'mornings', 'evenings'],
  ];

  for (const group of PARTIAL_GROUPS) {
    if (group.includes(vol) && group.includes(need)) {
      return 0.5;
    }
  }

  return 0.0;
}

/**
 * Urgency-based score.
 *
 * Maps urgency labels to numeric importance scores.
 * High-urgency needs receive maximum priority so they surface first.
 *
 * @returns A value between 0 and 1.
 */
export function urgencyScore(urgency: Urgency = 'Low'): number {
  const scoreMap: Record<string, number> = {
    high: 1.0,
    medium: 0.6,
    low: 0.3,
  };
  const key = (urgency ?? 'Low').toLowerCase().trim();
  return safeScore(scoreMap[key] ?? 0.3);
}

/**
 * Volunteer rating score.
 *
 * Normalizes the volunteer's 0–5 rating to a 0–1 scale.
 * Higher-rated volunteers are preferred when other factors are equal.
 *
 * @returns A value between 0 and 1.
 */
export function ratingScore(rating: number = 0): number {
  if (typeof rating !== 'number' || Number.isNaN(rating)) return 0;
  return safeScore(Math.max(0, rating) / MAX_RATING);
}

/**
 * Workload balancing score.
 *
 * Uses an inverse function to penalize volunteers who already have
 * many assignments, encouraging even distribution:
 *
 *   score = 1 / (1 + tasksAssigned)
 *
 * A volunteer with 0 tasks scores 1.0, with 1 task scores 0.5, etc.
 *
 * @returns A value between 0 and 1.
 */
export function workloadScore(volunteerId: string): number {
  const tasksAssigned = volunteerTaskCount.get(volunteerId) ?? 0;
  return safeScore(1 / (1 + tasksAssigned));
}

// ─── Reason Builder ──────────────────────────────────────────────────────────
// Generates human-readable explanations for each factor, displayed in the UI.

function buildReasons(
  breakdown: MatchBreakdown,
  urgency: Urgency = 'Low'
): string[] {
  const reasons: string[] = [];

  // Skills
  const skillsPct = Math.round((breakdown.skills ?? 0) * 100);
  if (skillsPct === 100) {
    reasons.push('All required skills matched');
  } else if (skillsPct > 0) {
    reasons.push(`Skills match ${skillsPct}%`);
  } else {
    reasons.push('No skills matched');
  }

  // Location
  if (breakdown.location === 1) {
    reasons.push('Exact location match');
  } else if (breakdown.location > 0) {
    reasons.push('Nearby location');
  }

  // Availability
  if (breakdown.availability === 1) {
    reasons.push('Available during required time');
  } else if (breakdown.availability >= 0.5) {
    reasons.push('Partially available');
  }

  // Urgency
  const urg = (urgency ?? '').toLowerCase();
  if (urg === 'high') {
    reasons.push('High priority need');
  } else if (urg === 'medium') {
    reasons.push('Medium priority need');
  }

  // Rating
  if ((breakdown.rating ?? 0) >= 0.9) {
    reasons.push('Top-rated volunteer');
  } else if ((breakdown.rating ?? 0) >= 0.7) {
    reasons.push('Highly rated volunteer');
  }

  // Workload
  if ((breakdown.workload ?? 0) >= 0.8) {
    reasons.push('Low current workload');
  } else if ((breakdown.workload ?? 0) < 0.5) {
    reasons.push('Heavy workload — consider alternatives');
  }

  return reasons;
}

// ─── Main Scoring Function ───────────────────────────────────────────────────

/**
 * Computes the multi-factor match score between a volunteer and a need.
 *
 * Final score formula:
 *   score = (skills × 0.35) + (location × 0.25) + (availability × 0.15)
 *         + (urgency × 0.10) + (rating × 0.10) + (workload × 0.05)
 *
 * Each sub-score is a float in [0, 1].
 * The final score is an integer in [0, 100].
 */
function scoreMatch(volunteer: Volunteer, need: Need): Match {
  const skills = skillsScore(volunteer.skills, need.requiredSkills);
  const location = locationScore(volunteer.location, need.location);

  // Needs may carry a timeframe; fall back gracefully if absent
  const timeframe = (need as Record<string, unknown>).timeframe as
    | string
    | undefined;
  const availability = availabilityScore(volunteer.availability, timeframe);
  const urgency = urgencyScore(need.urgency);
  const rating = ratingScore(volunteer.rating);
  const workload = workloadScore(volunteer.id);

  // Weighted sum
  const rawScore =
    skills * WEIGHT_SKILLS +
    location * WEIGHT_LOCATION +
    availability * WEIGHT_AVAILABILITY +
    urgency * WEIGHT_URGENCY +
    rating * WEIGHT_RATING +
    workload * WEIGHT_WORKLOAD;

  // Normalize to 0–100 integer
  const score = Math.max(0, Math.min(100, Math.round(rawScore * 100)));

  const breakdown: MatchBreakdown = {
    skills,
    location,
    availability,
    urgency,
    rating,
    workload,
  };

  const reasons = buildReasons(breakdown, need.urgency);

  return {
    id: `${volunteer.id}-${need.id}`,
    volunteer,
    need,
    score,
    breakdown,
    reasons,
  };
}

// ─── Generate Top Matches ────────────────────────────────────────────────────

/**
 * Generates ranked matches between all available volunteers and unassigned needs.
 *
 * Process:
 * 1. Filter out already-assigned needs.
 * 2. Score every (volunteer, need) pair.
 * 3. Sort descending by score.
 * 4. Return the top N matches.
 *
 * Time complexity: O(V × N × log(V × N)) where V = volunteers, N = needs.
 */
export function generateMatches(
  volunteers: Volunteer[] = [],
  needs: Need[] = []
): Match[] {
  if (!volunteers || !needs) return [];

  const availableNeeds = needs.filter((n) => n && !n.isAssigned);
  const allMatches: Match[] = [];

  for (const volunteer of volunteers) {
    if (!volunteer) continue;
    for (const need of availableNeeds) {
      if (!need) continue;
      const match = scoreMatch(volunteer, need);
      if (match.score > 0) {
        allMatches.push(match);
      }
    }
  }

  // Sort descending by score, keep top N
  allMatches.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return allMatches.slice(0, MAX_TOP_MATCHES);
}
