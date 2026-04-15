import type { Volunteer, Need, Match, Urgency, Availability, MatchBreakdown } from '../types';

// ─── Weight Constants ────────────────────────────────────────────────────────

const WEIGHT_SKILLS = 0.4;
const WEIGHT_LOCATION = 0.3;
const WEIGHT_AVAILABILITY = 0.2;
const WEIGHT_URGENCY = 0.1;

const MAX_TOP_MATCHES = 10;

// ─── Individual Scoring Functions ────────────────────────────────────────────

/**
 * Calculates the ratio of required skills the volunteer has.
 * Returns a value between 0 and 1.
 */
function calculateSkillsMatch(
  volunteerSkills: string[] = [],
  requiredSkills: string[] = []
): number {
  if (!requiredSkills || requiredSkills.length === 0) return 1;
  if (!volunteerSkills) return 0;

  const normalizedVolunteer = volunteerSkills.map((s) => s?.toLowerCase().trim() || '');
  const normalizedRequired = requiredSkills.map((s) => s?.toLowerCase().trim() || '');

  const matchingCount = normalizedRequired.filter((skill) =>
    normalizedVolunteer.includes(skill)
  ).length;

  return matchingCount / normalizedRequired.length;
}

/**
 * Location matching ratio based on word overlap.
 * Returns a value between 0 and 1.
 */
function calculateLocationMatch(
  volunteerLocation: string = '',
  needLocation: string = ''
): number {
  const vLoc = (volunteerLocation || '').toLowerCase().trim();
  const nLoc = (needLocation || '').toLowerCase().trim();

  if (vLoc === nLoc && vLoc !== '') return 1;
  if (!vLoc || !nLoc) return 0;

  const vWords = vLoc.split(/\s+/).filter(w => w.length > 0);
  const nWords = nLoc.split(/\s+/).filter(w => w.length > 0);

  if (vWords.length === 0 || nWords.length === 0) return 0;

  // Compute overlap ratio relative to need location
  const matchingWords = nWords.filter(w => vWords.includes(w)).length;
  return matchingWords / nWords.length;
}

/**
 * Availability scoring.
 * "Flexible" always matches fully.
 * If need has no timeframe, returns 1.0.
 */
function calculateAvailabilityMatch(volunteerAvailability: string = '', needTimeframe?: string): number {
  const vol = (volunteerAvailability || '').toLowerCase().trim();
  if (!needTimeframe) return 1.0;
  
  if (vol === 'flexible') return 1.0;
  
  const need = needTimeframe.toLowerCase().trim();
  if (vol === need) return 1.0;

  return 0.0;
}

/**
 * Urgency‑based boost.
 * High = 1.0, Medium = 0.5, Low = 0.2
 */
function calculateUrgencyBoost(urgency: Urgency = 'Low'): number {
  const boostMap: Record<string, number> = {
    high: 1.0,
    medium: 0.5,
    low: 0.2,
  };
  const key = (urgency || 'Low').toLowerCase().trim();
  return boostMap[key] ?? 0.2;
}

// ─── Reason Builder ──────────────────────────────────────────────────────────

function buildReasons(
  breakdown: MatchBreakdown,
  urgency: Urgency = 'Low'
): string[] {
  const reasons: string[] = [];

  // Skills
  const skillsPct = Math.round((breakdown.skills || 0) * 100);
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
  const urg = (urgency || '').toLowerCase();
  if (urg === 'high') {
    reasons.push('High priority need');
  } else if (urg === 'medium') {
    reasons.push('Medium priority need');
  }

  return reasons;
}

// ─── Main Scoring Function ───────────────────────────────────────────────────

function scoreMatch(volunteer: Volunteer, need: Need): Match {
  const skillsScore = calculateSkillsMatch(
    volunteer.skills,
    need.requiredSkills
  );
  const locationScore = calculateLocationMatch(
    volunteer.location,
    need.location
  );
  
  const availabilityScore = calculateAvailabilityMatch(volunteer.availability, (need as any).timeframe);
  const urgencyScore = calculateUrgencyBoost(need.urgency);

  const rawScore =
    skillsScore * WEIGHT_SKILLS +
    locationScore * WEIGHT_LOCATION +
    availabilityScore * WEIGHT_AVAILABILITY +
    urgencyScore * WEIGHT_URGENCY;

  const score = Math.max(0, Math.min(100, Math.round(rawScore * 100)));

  const breakdown: MatchBreakdown = {
    skills: skillsScore,
    location: locationScore,
    availability: availabilityScore,
    urgency: urgencyScore,
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
  allMatches.sort((a, b) => (b.score || 0) - (a.score || 0));
  return allMatches.slice(0, MAX_TOP_MATCHES);
}
