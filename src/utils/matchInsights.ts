import type { 
  Match, 
  MatchBreakdown, 
  Volunteer, 
  Need, 
  Assignment, 
  Urgency 
} from '../types';

/**
 * ─── PART 1: CONFIDENCE SYSTEM ──────────────────────────────────────────────
 */

export function getConfidence(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 85) return 'High';
  if (score >= 65) return 'Medium';
  return 'Low';
}

export function getConfidenceColor(score: number): string {
  const confidence = getConfidence(score);
  switch (confidence) {
    case 'High': return '#10b981'; // green-500
    case 'Medium': return '#3b82f6'; // blue-500
    default: return '#94a3b8'; // slate-400
  }
}

/**
 * ─── PART 2: MATCH REASON GENERATOR ─────────────────────────────────────────
 */

export function generateMatchReasons(breakdown: MatchBreakdown): string[] {
  const reasons: string[] = [];
  const THRESHOLD = 0.6;

  // 1. Skills match
  if (breakdown.skills > THRESHOLD) {
    const pct = Math.round(breakdown.skills * 100);
    reasons.push(`Strong skill match (${pct}%)`);
  }

  // 2. Location proximity
  if (breakdown.location >= 0.9) {
    reasons.push('Exact location match');
  } else if (breakdown.location > THRESHOLD) {
    reasons.push('Nearby location');
  }

  // 3. Availability overlap
  if (breakdown.availability > THRESHOLD) {
    reasons.push('Available at required time');
  }

  // 4. Critical urgency
  if (breakdown.urgency > THRESHOLD) {
    reasons.push('High priority need');
  }

  // 5. High ratings
  if (breakdown.rating && breakdown.rating > 0.8) {
    reasons.push('Highly rated volunteer');
  }

  // 6. Healthy workload
  if (breakdown.workload && breakdown.workload > 0.7) {
    reasons.push('Low current workload');
  }

  // Limit to most meaningful reasons
  return reasons.slice(0, 5);
}

/**
 * ─── PART 3: MATCH LABELING SYSTEM ──────────────────────────────────────────
 */

export function getMatchLabel(score: number): string {
  if (score >= 90) return 'Excellent Match';
  if (score >= 75) return 'Strong Match';
  if (score >= 60) return 'Moderate Match';
  return 'Weak Match';
}

/**
 * ─── PART 4: SMART SORTING ──────────────────────────────────────────────────
 */

export function sortMatches(matches: Match[]): Match[] {
  const urgencyWeight: Record<Urgency, number> = {
    High: 3,
    Medium: 2,
    Low: 1
  };

  return [...matches].sort((a, b) => {
    // 1. Primary: Score (Descending)
    if (b.score !== a.score) return b.score - a.score;

    // 2. Secondary: Urgency (Higher first)
    const urgencyA = urgencyWeight[a.need.urgency] || 0;
    const urgencyB = urgencyWeight[b.need.urgency] || 0;
    if (urgencyB !== urgencyA) return urgencyB - urgencyA;

    // 3. Tertiary: Skills score (Higher first)
    const skillA = a.breakdown?.skills || 0;
    const skillB = b.breakdown?.skills || 0;
    return skillB - skillA;
  });
}

/**
 * ─── PART 5: AUTO-ASSIGN FEATURE ────────────────────────────────────────────
 */

export function autoAssignMatches(
  matches: Match[], 
  threshold = 80
): Match[] {
  const sorted = sortMatches(matches);
  const assignedVolunteers = new Set<string>();
  const assignedNeeds = new Set<string>();
  const results: Match[] = [];

  for (const match of sorted) {
    if (match.score < threshold) continue;

    const vId = match.volunteer.id;
    const nId = match.need.id;

    if (!assignedVolunteers.has(vId) && !assignedNeeds.has(nId)) {
      assignedVolunteers.add(vId);
      assignedNeeds.add(nId);
      results.push(match);
    }
  }

  return results;
}

/**
 * ─── PART 6: INSIGHT GENERATORS ─────────────────────────────────────────────
 */

export function getCoverageRate(
  assignments: Assignment[], 
  totalNeeds: number
): number {
  if (totalNeeds === 0) return 0;
  return Math.round((assignments.length / totalNeeds) * 100);
}

export function getIdleVolunteers(
  volunteers: Volunteer[], 
  assignments: Assignment[]
): number {
  const assignedNames = new Set(assignments.map(a => a.volunteerName));
  return volunteers.filter(v => !assignedNames.has(v.name)).length;
}

export function getUrgentNeedsPending(needs: Need[]): number {
  return needs.filter(n => n.urgency === 'High' && !n.isAssigned).length;
}

/**
 * ─── PART 7: ENRICHMENT ─────────────────────────────────────────────────────
 * Helper to transform a Layer 1 Match into a Layer 2 Intelligent Match
 */

export function enrichMatch(match: Match): Match {
  const score = match.score;
  const breakdown = match.breakdown;

  return {
    ...match,
    confidence: getConfidence(score),
    label: getMatchLabel(score),
    reasons: breakdown ? generateMatchReasons(breakdown) : match.reasons
  };
}
