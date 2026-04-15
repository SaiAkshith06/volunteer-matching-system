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
  availability: Availability;
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
  urgency: Urgency;
  /** Time window required (e.g. "Weekdays", "Mornings") */
  timeframe?: string;
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
}

export interface NeedCsvRow {
  title: string;
  requiredSkills: string;
  location: string;
  urgency: string;
  timeframe?: string;
}

// ─── Parsing Result ──────────────────────────────────────────────────────────

export interface ParseResult<T> {
  data: T[];
  errors: string[];
}
