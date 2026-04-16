/**
 * ─── MATCHING ENGINE (v4) ───────────────────────────────────────────────────
 *
 * Production-grade multi-factor scoring engine.
 *
 * Improvements over v3:
 *   1. Time-window availability scoring (overlap %).
 *   2. Lat/lng coordinate-based location scoring via distanceService.
 *   3. Skill proficiency weighting with configurable max level.
 *   4. All sub-scores strictly normalised [0, 1].
 *   5. Hard filter layer enforces workload cap, skill overlap, and
 *      availability compatibility before scoring.
 *   6. Returns ALL matches — UI decides how many to display.
 *   7. No global state — all inputs are function parameters.
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
  MAX_PROFICIENCY,
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

// ─── Time Window Helpers ────────────────────────────────────────────────────

/**
 * Parses an "HH:MM" string into total minutes since midnight.
 * Returns null if the string is invalid.
 */
function parseTimeToMinutes(time: string | undefined): number | null {
  if (!time) return null;
  const match = time.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/**
 * Computes the overlap ratio between two time windows.
 * Returns a value between 0 (no overlap) and 1 (full overlap).
 *
 * The overlap is measured against the need's window, i.e.:
 *   overlap_minutes / need_window_minutes
 */
function timeWindowOverlap(
  vStart: string | undefined,
  vEnd: string | undefined,
  nStart: string | undefined,
  nEnd: string | undefined
): number | null {
  const vs = parseTimeToMinutes(vStart);
  const ve = parseTimeToMinutes(vEnd);
  const ns = parseTimeToMinutes(nStart);
  const ne = parseTimeToMinutes(nEnd);

  // If any value is missing, return null (use keyword fallback)
  if (vs === null || ve === null || ns === null || ne === null) return null;

  const needWindow = ne - ns;
  if (needWindow <= 0) return null;

  const overlapStart = Math.max(vs, ns);
  const overlapEnd = Math.min(ve, ne);
  const overlap = Math.max(0, overlapEnd - overlapStart);

  return overlap / needWindow;
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

  // 3. Time-window hard reject (if structured times provided)
  const timeOverlap = timeWindowOverlap(
    volunteer.availStart,
    volunteer.availEnd,
    need.timeframeStart,
    need.timeframeEnd
  );
  if (timeOverlap !== null && timeOverlap === 0) return false;

  // 4. Keyword availability hard reject (only when timeframe is specified)
  if (need.timeframe && timeOverlap === null) {
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
 * proficiency level (1–MAX_PROFICIENCY), normalised against MAX_PROFICIENCY.
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
        return sum + Math.min(level, MAX_PROFICIENCY);
      }, 0) / matchedSkills.length;
    proficiencyBonus = (avgProficiency / MAX_PROFICIENCY) * 0.1; // Up to +0.1 bonus
  }

  const blendedScore = rawRatio * 0.4 + priorityRatio * 0.6 + proficiencyBonus;

  return safeScore(blendedScore);
}

/**
 * Location score — delegates to distanceService with optional lat/lng.
 */
export function locationScore(
  volunteerLocation: string = '',
  needLocation: string = '',
  volunteerLat?: number,
  volunteerLng?: number,
  needLat?: number,
  needLng?: number
): number {
  return safeScore(
    computeLocationScore(
      volunteerLocation,
      needLocation,
      volunteerLat,
      volunteerLng,
      needLat,
      needLng
    )
  );
}

/**
 * Availability matching score.
 *
 * Strategy:
 *   1. If both parties have time-window data → compute overlap %.
 *   2. Otherwise → fall back to keyword matching.
 */
export function availabilityScore(
  volunteer: Volunteer,
  need: Need
): number {
  // Try time-window overlap first
  const overlap = timeWindowOverlap(
    volunteer.availStart,
    volunteer.availEnd,
    need.timeframeStart,
    need.timeframeEnd
  );
  if (overlap !== null) {
    return safeScore(overlap);
  }

  // Fall back to keyword matching
  const vol = (volunteer.availability ?? '').toLowerCase().trim();

  if (!need.timeframe) return 1.0;
  if (vol === 'flexible') return 1.0;

  const nTime = need.timeframe.toLowerCase().trim();
  if (vol === nTime) return 1.0;

  for (const group of PARTIAL_OVERLAP_GROUPS) {
    if (group.includes(vol) && group.includes(nTime)) {
      return 0.5;
    }
  }

  return 0.0;
}

/**
 * Urgency-based score with optional deadline decay.
 *
 * Base score from urgency label, plus a deadline proximity boost:
 *   - Deadline already passed → +0.3 (maximum urgency)
 *   - < 24 hours remaining   → +0.2
 *   - < 72 hours remaining   → +0.1
 *   - > 72 hours remaining   → +0.0 (no boost)
 *
 * Final result is clamped to [0, 1] via safeScore().
 */
export function urgencyScore(urgency: Urgency = 'Low', deadline?: string): number {
  const scoreMap: Record<string, number> = {
    high: 1.0,
    medium: 0.6,
    low: 0.3,
  };
  const key = (urgency ?? 'Low').toLowerCase().trim();
  let base = scoreMap[key] ?? 0.3;

  // Deadline proximity boost
  if (deadline) {
    const deadlineMs = new Date(deadline).getTime();
    if (!Number.isNaN(deadlineMs)) {
      const hoursRemaining = (deadlineMs - Date.now()) / (1000 * 60 * 60);

      if (hoursRemaining <= 0) {
        // Deadline has passed — maximum urgency
        base += 0.3;
      } else if (hoursRemaining < 24) {
        base += 0.2;
      } else if (hoursRemaining < 72) {
        base += 0.1;
      }
    }
  }

  return safeScore(base);
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
  urgency: Urgency = 'Low',
  deadline?: string
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

  if (deadline) {
    const deadlineMs = new Date(deadline).getTime();
    if (!Number.isNaN(deadlineMs)) {
      const hoursRemaining = (deadlineMs - Date.now()) / (1000 * 60 * 60);
      if (hoursRemaining <= 0) {
        reasons.push('⚠ Deadline has passed');
      } else if (hoursRemaining < 24) {
        reasons.push('Deadline within 24 hours');
      } else if (hoursRemaining < 72) {
        reasons.push('Deadline approaching (< 3 days)');
      }
    }
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
  const location = locationScore(
    volunteer.location,
    need.location,
    volunteer.lat,
    volunteer.lng,
    need.lat,
    need.lng
  );
  const availability = availabilityScore(volunteer, need);
  const urgency = urgencyScore(need.urgency, need.deadline);
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

  const reasons = buildReasons(breakdown, need.urgency, need.deadline);

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
 * Changes from v3:
 *   - Time-window availability scoring.
 *   - Coordinate-based location scoring with Haversine.
 *   - Skill proficiency weighting.
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
 *
 * Uses exponential recency weighting: more recent assignments carry
 * more influence than older ones.
 */
export function computeReliability(assignments: Assignment[]): number {
  if (assignments.length === 0) return 0.8; // Neutral default

  const outcomeWeight: Record<string, number> = {
    excellent: 1.0,
    completed: 0.8,
    'no-show': 0.0,
  };

  // Sort by timestamp ascending (oldest first)
  const sorted = [...assignments]
    .filter((a) => a.outcome)
    .sort((a, b) => {
      const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return ta - tb;
    });

  if (sorted.length === 0) return 0.8;

  // Exponential recency factor — recent outcomes weigh more
  const DECAY = 0.85;
  let weightedSum = 0;
  let weightSum = 0;

  for (let i = 0; i < sorted.length; i++) {
    const recencyWeight = Math.pow(DECAY, sorted.length - 1 - i);
    const score = outcomeWeight[sorted[i].outcome!] ?? 0.5;
    weightedSum += score * recencyWeight;
    weightSum += recencyWeight;
  }

  return weightSum > 0 ? weightedSum / weightSum : 0.8;
}
