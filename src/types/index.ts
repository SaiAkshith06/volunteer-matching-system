// ─── Core Enums & Literals ───────────────────────────────────────────────────

export type Skill =
  | 'First Aid'
  | 'Counseling'
  | 'Logistics'
  | 'Driving'
  | 'Teaching'
  | 'Cooking'
  | 'IT Support';

export type Urgency = 'High' | 'Medium' | 'Low';

export type Availability =
  | 'Weekdays'
  | 'Weekends'
  | 'Evenings'
  | 'Mornings'
  | 'Flexible';

/** Feedback outcome recorded after an assignment completes */
export type AssignmentOutcome = 'completed' | 'no-show' | 'excellent';

// ─── Domain Models ───────────────────────────────────────────────────────────

export interface Volunteer {
  id: string;
  name: string;
  skills: Skill[];
  /** Proficiency level per skill (1 = basic, 2 = intermediate, 3 = expert) */
  skillLevels?: Record<string, number>;
  location: string;
  /** Latitude for distance-based matching */
  lat?: number;
  /** Longitude for distance-based matching */
  lng?: number;
  availability: Availability;
  /** ISO time string for availability window start (e.g. "09:00") */
  availStart?: string;
  /** ISO time string for availability window end (e.g. "17:00") */
  availEnd?: string;
  rating: number; // 0‑5
  avatar: string;
  /** Number of tasks currently assigned to this volunteer */
  activeTaskCount: number;
  /** Reliability score derived from assignment outcomes (0–1) */
  reliabilityScore?: number;
}

export interface Need {
  id: string;
  title: string;
  requiredSkills: Skill[];
  location: string;
  /** Latitude for distance-based matching */
  lat?: number;
  /** Longitude for distance-based matching */
  lng?: number;
  urgency: Urgency;
  /** Time window required (e.g. "Weekdays", "Mornings") */
  timeframe?: string;
  /** ISO time string for need window start (e.g. "08:00") */
  timeframeStart?: string;
  /** ISO time string for need window end (e.g. "16:00") */
  timeframeEnd?: string;
  /** Deadline for the need (ISO date string) */
  deadline?: string;
  /** Number of volunteers needed for this task (default: 1) */
  teamSizeNeeded?: number;
  dateAdded: string;
  isAssigned: boolean;
}

export interface MatchBreakdown {
  skills: number;
  location: number;
  availability: number;
  urgency: number;
  rating: number;
  workload: number;
  reliability?: number;
}

export interface Match {
  id: string;
  volunteer: Volunteer;
  need: Need;
  score: number; // 0‑100
  breakdown: MatchBreakdown;
  reasons: string[];
  confidence?: 'High' | 'Medium' | 'Low';
  label?: string;
}

export interface Assignment {
  id: string;
  volunteerId: string;
  volunteerName: string;
  volunteerSkills: string;
  needId: string;
  needTitle: string;
  location: string;
  matchScore: number;
  assignedAt: string;
  /** ISO timestamp of when the assignment was created */
  timestamp: string;
  /** Feedback provided after assignment completion */
  outcome?: AssignmentOutcome;
}

// ─── CSV Row Shapes (raw parsed data) ────────────────────────────────────────

export interface VolunteerCsvRow {
  name: string;
  skills: string;
  location: string;
  availability: string;
  rating: string;
  lat?: string;
  lng?: string;
  avail_start?: string;
  avail_end?: string;
}

export interface NeedCsvRow {
  title: string;
  requiredSkills: string;
  location: string;
  urgency: string;
  timeframe?: string;
  lat?: string;
  lng?: string;
  timeframe_start?: string;
  timeframe_end?: string;
  deadline?: string;
  team_size?: string;
}

// ─── Parsing Result ──────────────────────────────────────────────────────────

export interface ParseResult<T> {
  data: T[];
  errors: string[];
}
