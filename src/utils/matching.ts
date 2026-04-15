/**
 * ─── MATCHING ENGINE (v3) ───────────────────────────────────────────────────
 *
 * Production-quality multi-factor scoring engine.
 *
 * Bug fixes applied in this version:
 *   1. Removed module-level global workload Map — workload is now derived
 *      from `volunteer.activeTaskCount` passed via state.
 *   2. Removed artificial location score floor (0.5) — pure overlap ratio.
 *   3. Uses `need.timeframe` directly instead of unsafe `as any` cast.
 *   4. Hard filter layer (`shouldConsider`) skips impossible matches early.
 *   5. All config pulled from `matchingConfig.ts` — no magic numbers.
 *   6. Returns ALL matches (UI decides how many to show).
 */

import type {
  Volunteer,
  Need,
  Match,
  Urgency,
  MatchBreakdown,
  Assignment,
} from '../types';

import {
  DEFAULT_WEIGHTS,
  SKILL_PRIORITY,
  DEFAULT_SKILL_PRIORITY,
  MAX_RATING,
  MAX_ACTIVE_TASKS,
  PARTIAL_OVERLAP_GROUPS,
} from '../config/matchingConfig';

import type { ScoringWeights } from '../config/matchingConfig';

import { computeLocationScore } from '../services/distanceService';

// ─── Helper: Clamp to [0, 1] ────────────────────────────────────────────────

function safeScore(value: number): number {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
}

// ─── Hard Filter ─────────────────────────────────────────────────────────────

/**
 * Pre-scoring filter. Returns false if the volunteer should NOT be
 * considered for this need, saving computation and avoiding invalid matches.
 *
 * A candidate is rejected if:
 *   - Zero skill overlap with required skills
 *   - At or above maximum active task count
 *   - Availability is completely incompatible (non-flexible + mismatch)
 */
export function shouldConsider(volunteer: Volunteer, need: Need): boolean {
  // 1. Skill overlap check
  const vSkills = volunteer.skills.map((s) => (s ?? '').toLowerCase().trim());
  const rSkills = need.requiredSkills.map((s) => (s ?? '').toLowerCase().trim());

  const hasSkillOverlap = rSkills.some((rs) => vSkills.includes(rs));
  if (!hasSkillOverlap) return false;

  // 2. Workload cap
  if ((volunteer.activeTaskCount ?? 0) >= MAX_ACTIVE_TASKS) return false;

  // 3. Availability hard reject (only when timeframe is specified)
  if (need.timeframe) {
    const vol = (volunteer.availability ?? '').toLowerCase().trim();
    const nTime = need.timeframe.toLowerCase().trim();

    if (vol !== 'flexible' && vol !== nTime) {
      // Check partial groups before rejecting
      const inPartialGroup = PARTIAL_OVERLAP_GROUPS.some(
        (group) => group.includes(vol) && group.includes(nTime)
      );
      if (!inPartialGroup) return false;
    }
  }

  return true;
}

// ─── Individual Scoring Functions ────────────────────────────────────────────

/**
 * Skills match score with priority weighting and optional proficiency levels.
 *
 * If `skillLevels` is provided, each matched skill is weighted by its
 * proficiency level (1–3), normalised against the max level (3).
 */
export function skillsScore(
  volunteerSkills: string[] = [],
  requiredSkills: string[] = [],
  skillLevels?: Record<string, number>
): number {
  if (!requiredSkills || requiredSkills.length === 0) return 1;
  if (!volunteerSkills || volunteerSkills.length === 0) return 0;

  const normalizedVolunteer = volunteerSkills.map(
    (s) => (s ?? '').toLowerCase().trim()
  );
  const normalizedRequired = requiredSkills.map(
    (s) => (s ?? '').toLowerCase().trim()
  );

  const matchedSkills = normalizedRequired.filter((skill) =>
    normalizedVolunteer.includes(skill)
  );
  const rawRatio = matchedSkills.length / normalizedRequired.length;

  // Priority-weighted ratio
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

  // Proficiency bonus (if skill levels available)
  let proficiencyBonus = 0;
  if (skillLevels && matchedSkills.length > 0) {
    const avgProficiency =
      matchedSkills.reduce((sum, skill) => {
        // Try original case and lowered case
        const level = skillLevels[skill] ?? skillLevels[(skill ?? '').toLowerCase()] ?? 1;
        return sum + level;
      }, 0) / matchedSkills.length;
    proficiencyBonus = (avgProficiency / 3) * 0.1; // Up to +0.1 bonus
  }

  const blendedScore = rawRatio * 0.4 + priorityRatio * 0.6 + proficiencyBonus;

  return safeScore(blendedScore);
}

/**
 * Location score — delegates to distanceService.
 */
export function locationScore(
  volunteerLocation: string = '',
  needLocation: string = ''
): number {
  return safeScore(computeLocationScore(volunteerLocation, needLocation));
}

/**
 * Availability matching score using actual timeframe data.
 */
export function availabilityScore(
  volunteerAvailability: string = '',
  needTimeframe?: string
): number {
  const vol = (volunteerAvailability ?? '').toLowerCase().trim();

  if (!needTimeframe) return 1.0;
  if (vol === 'flexible') return 1.0;

  const need = needTimeframe.toLowerCase().trim();
  if (vol === need) return 1.0;

  for (const group of PARTIAL_OVERLAP_GROUPS) {
    if (group.includes(vol) && group.includes(need)) {
      return 0.5;
    }
  }

  return 0.0;
}

/**
 * Urgency-based score.
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
 * Volunteer rating score (0–5 → 0–1).
 */
export function ratingScore(rating: number = 0): number {
  if (typeof rating !== 'number' || Number.isNaN(rating)) return 0;
  return safeScore(Math.max(0, rating) / MAX_RATING);
}

/**
 * Workload score derived from activeTaskCount on the volunteer object.
 * No global state — purely functional.
 *
 *   score = 1 / (1 + activeTaskCount)
 */
export function workloadScore(activeTaskCount: number): number {
  return safeScore(1 / (1 + Math.max(0, activeTaskCount)));
}

/**
 * Reliability score based on assignment outcomes.
 * Returns the volunteer's reliability score or 0.8 as a neutral default
 * for volunteers with no history.
 */
export function reliabilityScore(volunteer: Volunteer): number {
  return safeScore(volunteer.reliabilityScore ?? 0.8);
}

// ─── Reason Builder ──────────────────────────────────────────────────────────

function buildReasons(
  breakdown: MatchBreakdown,
  urgency: Urgency = 'Low'
): string[] {
  const reasons: string[] = [];

  const skillsPct = Math.round((breakdown.skills ?? 0) * 100);
  if (skillsPct === 100) {
    reasons.push('All required skills matched');
  } else if (skillsPct > 0) {
    reasons.push(`Skills match ${skillsPct}%`);
  } else {
    reasons.push('No skills matched');
  }

  if (breakdown.location === 1) {
    reasons.push('Exact location match');
  } else if (breakdown.location > 0) {
    reasons.push('Nearby location');
  }

  if (breakdown.availability === 1) {
    reasons.push('Available during required time');
  } else if (breakdown.availability >= 0.5) {
    reasons.push('Partially available');
  }

  const urg = (urgency ?? '').toLowerCase();
  if (urg === 'high') {
    reasons.push('High priority need');
  } else if (urg === 'medium') {
    reasons.push('Medium priority need');
  }

  if ((breakdown.rating ?? 0) >= 0.9) {
    reasons.push('Top-rated volunteer');
  } else if ((breakdown.rating ?? 0) >= 0.7) {
    reasons.push('Highly rated volunteer');
  }

  if ((breakdown.workload ?? 0) >= 0.8) {
    reasons.push('Low current workload');
  } else if ((breakdown.workload ?? 0) < 0.5) {
    reasons.push('Heavy workload — consider alternatives');
  }

  if ((breakdown.reliability ?? 0) >= 0.9) {
    reasons.push('Excellent track record');
  }

  return reasons;
}

// ─── Main Scoring Function ───────────────────────────────────────────────────

/**
 * Computes the multi-factor match score between a volunteer and a need.
 *
 * All sub-scores are [0, 1]. Final score is an integer [0, 100].
 * Weights are configurable via the `weights` parameter.
 */
function scoreMatch(
  volunteer: Volunteer,
  need: Need,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): Match {
  const skills = skillsScore(
    volunteer.skills,
    need.requiredSkills,
    volunteer.skillLevels
  );
  const location = locationScore(volunteer.location, need.location);
  const availability = availabilityScore(volunteer.availability, need.timeframe);
  const urgency = urgencyScore(need.urgency);
  const rating = ratingScore(volunteer.rating);
  const workload = workloadScore(volunteer.activeTaskCount);
  const reliability = reliabilityScore(volunteer);

  const rawScore =
    skills * weights.skills +
    location * weights.location +
    availability * weights.availability +
    urgency * weights.urgency +
    rating * weights.rating +
    workload * weights.workload +
    reliability * weights.reliability;

  const score = Math.max(0, Math.min(100, Math.round(rawScore * 100)));

  const breakdown: MatchBreakdown = {
    skills,
    location,
    availability,
    urgency,
    rating,
    workload,
    reliability,
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

// ─── Generate Matches ────────────────────────────────────────────────────────

/**
 * Generates ranked matches between all available volunteers and unassigned
 * needs.
 *
 * Changes from v2:
 *   - Uses `shouldConsider()` hard filter to skip impossible pairs.
 *   - Returns ALL qualifying matches (no arbitrary cap).
 *   - Accepts optional `weights` for per-task scoring profiles.
 *
 * Time complexity: O(V × N × log(V × N))
 */
export function generateMatches(
  volunteers: Volunteer[] = [],
  needs: Need[] = [],
  weights: ScoringWeights = DEFAULT_WEIGHTS
): Match[] {
  if (!volunteers || !needs) return [];

  const availableNeeds = needs.filter((n) => n && !n.isAssigned);
  const allMatches: Match[] = [];

  for (const volunteer of volunteers) {
    if (!volunteer) continue;
    for (const need of availableNeeds) {
      if (!need) continue;

      // Hard filter — skip impossible matches early
      if (!shouldConsider(volunteer, need)) continue;

      const match = scoreMatch(volunteer, need, weights);
      if (match.score > 0) {
        allMatches.push(match);
      }
    }
  }

  allMatches.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return allMatches;
}

// ─── Feedback Loop ───────────────────────────────────────────────────────────

/**
 * Computes an updated reliability score for a volunteer based on their
 * assignment outcomes. Call this after recording feedback.
 *
 * Weights: excellent = 1.0, completed = 0.8, no-show = 0.0
 */
export function computeReliability(assignments: Assignment[]): number {
  if (assignments.length === 0) return 0.8; // Neutral default

  const outcomeWeight: Record<string, number> = {
    excellent: 1.0,
    completed: 0.8,
    'no-show': 0.0,
  };

  let total = 0;
  let count = 0;

  for (const a of assignments) {
    if (a.outcome) {
      total += outcomeWeight[a.outcome] ?? 0.5;
      count++;
    }
  }

  return count > 0 ? total / count : 0.8;
}
