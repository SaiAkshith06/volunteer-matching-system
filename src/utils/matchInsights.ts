/**
 * ─── MATCH INSIGHTS (Layer 2) ───────────────────────────────────────────────
 *
 * UI-facing intelligence layer. Separated from core scoring logic.
 * Provides: confidence, labeling, reasons, smart sorting, auto-assign,
 * and dashboard insight generators.
 *
 * v4 changes:
 *   - Auto-assign uses Hungarian algorithm for globally optimal assignment.
 *   - Greedy fallback retained as `greedyAssignMatches` for comparison.
 */

import type {
  Match,
  MatchBreakdown,
  Volunteer,
  Need,
  Assignment,
  Urgency,
} from '../types';

import { AUTO_ASSIGN_MIN_SCORE } from '../config/matchingConfig';
import { hungarianAssign } from '../services/hungarianService';

// ─── Confidence System ──────────────────────────────────────────────────────

export function getConfidence(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 85) return 'High';
  if (score >= 65) return 'Medium';
  return 'Low';
}

export function getConfidenceColor(score: number): string {
  const confidence = getConfidence(score);
  switch (confidence) {
    case 'High':
      return '#10b981';
    case 'Medium':
      return '#3b82f6';
    default:
      return '#94a3b8';
  }
}

// ─── Reason Generator ───────────────────────────────────────────────────────

export function generateMatchReasons(breakdown: MatchBreakdown): string[] {
  const reasons: string[] = [];
  const THRESHOLD = 0.6;

  if (breakdown.skills > THRESHOLD) {
    const pct = Math.round(breakdown.skills * 100);
    reasons.push(`Strong skill match (${pct}%)`);
  }

  if (breakdown.location >= 0.9) {
    reasons.push('Exact location match');
  } else if (breakdown.location > THRESHOLD) {
    reasons.push('Nearby location');
  }

  if (breakdown.availability > THRESHOLD) {
    reasons.push('Available at required time');
  }

  if (breakdown.urgency > THRESHOLD) {
    reasons.push('High priority need');
  }

  if (breakdown.rating > 0.8) {
    reasons.push('Highly rated volunteer');
  }

  if (breakdown.workload > 0.7) {
    reasons.push('Low current workload');
  }

  if ((breakdown.reliability ?? 0) >= 0.9) {
    reasons.push('Excellent track record');
  }

  return reasons.slice(0, 5);
}

// ─── Match Labeling ─────────────────────────────────────────────────────────

export function getMatchLabel(score: number): string {
  if (score >= 90) return 'Excellent Match';
  if (score >= 75) return 'Strong Match';
  if (score >= 60) return 'Moderate Match';
  return 'Weak Match';
}

// ─── Smart Sorting ──────────────────────────────────────────────────────────

export function sortMatches(matches: Match[]): Match[] {
  const urgencyWeight: Record<Urgency, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  return [...matches].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;

    const urgencyA = urgencyWeight[a.need.urgency] || 0;
    const urgencyB = urgencyWeight[b.need.urgency] || 0;
    if (urgencyB !== urgencyA) return urgencyB - urgencyA;

    const skillA = a.breakdown?.skills || 0;
    const skillB = b.breakdown?.skills || 0;
    return skillB - skillA;
  });
}

// ─── Auto-Assign (Hungarian — Globally Optimal) ─────────────────────────────

/**
 * Globally optimal auto-assignment using the Hungarian algorithm.
 *
 * Uses `AUTO_ASSIGN_MIN_SCORE` from config as the threshold.
 * Guarantees no duplicate volunteer or need assignment.
 *
 * Falls back to greedy if the Hungarian result is empty but greedy would
 * produce results (shouldn't happen in practice).
 */
export function autoAssignMatches(
  matches: Match[],
  threshold: number = AUTO_ASSIGN_MIN_SCORE
): Match[] {
  const result = hungarianAssign(matches, threshold);

  // Fallback: if Hungarian produced nothing, try greedy
  if (result.length === 0) {
    return greedyAssignMatches(matches, threshold);
  }

  return result;
}

// ─── Greedy Fallback (retained for comparison / testing) ────────────────────

/**
 * Greedy one-to-one auto-assignment (legacy approach).
 *
 * Iterates sorted matches top-down, assigning the first available
 * volunteer-need pair. Suboptimal globally but fast.
 */
export function greedyAssignMatches(
  matches: Match[],
  threshold: number = AUTO_ASSIGN_MIN_SCORE
): Match[] {
  const sorted = sortMatches(matches);
  const assignedVolunteers = new Set<string>();
  const assignedNeeds = new Set<string>();
  const results: Match[] = [];

  for (const match of sorted) {
    if (match.score < threshold) continue;

    const vId = match.volunteer.id;
    const nId = match.need.id;

    // Skip if either party is already claimed in this pass
    if (assignedVolunteers.has(vId) || assignedNeeds.has(nId)) continue;

    // Skip if need is already assigned
    if (match.need.isAssigned) continue;

    assignedVolunteers.add(vId);
    assignedNeeds.add(nId);
    results.push(match);
  }

  return results;
}

// ─── Insight Generators ─────────────────────────────────────────────────────

export function getCoverageRate(
  assignments: Assignment[],
  totalNeeds: number
): number {
  if (totalNeeds === 0) return 0;
  return Math.round((assignments.length / totalNeeds) * 100);
}

/**
 * Counts volunteers with zero active tasks.
 * Uses `volunteerId` on Assignment (not names — fixing the identity bug).
 */
export function getIdleVolunteers(
  volunteers: Volunteer[],
  assignments: Assignment[]
): number {
  const assignedIds = new Set(assignments.map((a) => a.volunteerId));
  return volunteers.filter((v) => !assignedIds.has(v.id)).length;
}

export function getUrgentNeedsPending(needs: Need[]): number {
  return needs.filter((n) => n.urgency === 'High' && !n.isAssigned).length;
}

// ─── Enrichment ─────────────────────────────────────────────────────────────

export function enrichMatch(match: Match): Match {
  return {
    ...match,
    confidence: getConfidence(match.score),
    label: getMatchLabel(match.score),
    reasons: match.breakdown
      ? generateMatchReasons(match.breakdown)
      : match.reasons,
  };
}
