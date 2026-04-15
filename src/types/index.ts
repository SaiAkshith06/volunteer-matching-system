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

// ─── Domain Models ───────────────────────────────────────────────────────────

export interface Volunteer {
  id: string;
  name: string;
  skills: Skill[];
  location: string;
  availability: Availability;
  rating: number; // 0‑5
  avatar: string;
}

export interface Need {
  id: string;
  title: string;
  requiredSkills: Skill[];
  location: string;
  urgency: Urgency;
  dateAdded: string;
  isAssigned: boolean;
}

export interface MatchBreakdown {
  skills: number;
  location: number;
  availability: number;
  urgency: number;
  rating?: number;     // 0–1 normalized volunteer rating
  workload?: number;   // 0–1 workload balancing factor
}

export interface Match {
  id: string;
  volunteer: Volunteer;
  need: Need;
  score: number; // 0‑100
  breakdown?: MatchBreakdown;
  reasons: string[];
  confidence?: 'High' | 'Medium' | 'Low';
  label?: string;
}

export interface Assignment {
  id: string;
  volunteerName: string;
  volunteerSkills: string;
  needTitle: string;
  location: string;
  matchScore: number;
  assignedAt: string;
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
}

// ─── Parsing Result ──────────────────────────────────────────────────────────

export interface ParseResult<T> {
  data: T[];
  errors: string[];
}
