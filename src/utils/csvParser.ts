import Papa from 'papaparse';
import type {
  Volunteer,
  Need,
  VolunteerCsvRow,
  NeedCsvRow,
  ParseResult,
  Skill,
  Urgency,
  Availability,
} from '../types';
import {
  VALID_SKILLS,
  validateSkill,
  validateUrgency,
  validateAvailability,
  removeDuplicates,
} from './validation';

// ─── Validation Helpers ──────────────────────────────────────────────────────

/**
 * Parses a skills string that supports optional proficiency levels.
 *
 * Supported formats:
 *   - "First Aid;Driving"           → levels default to 1
 *   - "First Aid:3;Driving:2"       → levels parsed from suffix
 *   - "First Aid:expert;Driving:2"  → named levels mapped
 *
 * @returns A tuple of [skills[], skillLevels Record]
 */
function parseSkillsWithLevels(
  raw: string
): { skills: Skill[]; skillLevels: Record<string, number> } {
  const skills: Skill[] = [];
  const skillLevels: Record<string, number> = {};

  const NAMED_LEVELS: Record<string, number> = {
    basic: 1,
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 3,
  };

  const parts = raw.split(/[,;|]/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Check for "Skill:level" format
    const colonIndex = trimmed.lastIndexOf(':');
    let skillName: string;
    let level = 1;

    if (colonIndex > 0) {
      skillName = trimmed.substring(0, colonIndex).trim();
      const levelStr = trimmed.substring(colonIndex + 1).trim().toLowerCase();

      // Try numeric first, then named
      const numLevel = parseInt(levelStr, 10);
      if (!isNaN(numLevel) && numLevel >= 1 && numLevel <= 3) {
        level = numLevel;
      } else if (NAMED_LEVELS[levelStr] !== undefined) {
        level = NAMED_LEVELS[levelStr];
      }
    } else {
      skillName = trimmed;
    }

    const validated = validateSkill(skillName);
    if (validated) {
      skills.push(validated);
      skillLevels[validated.toLowerCase()] = level;
    }
  }

  return { skills, skillLevels };
}

/** Legacy skill parser (no levels) — kept for backward compat */
function parseSkillsString(raw: string): Skill[] {
  return raw
    .split(/[,;|]/)
    .map((s) => validateSkill(s.trim()))
    .filter((s): s is Skill => s !== null);
}

function parseUrgency(raw: string): Urgency | null {
  return validateUrgency(raw);
}

function parseAvailability(raw: string): Availability {
  return validateAvailability(raw);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function getInitials(name: string): string {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Safely parse a float, returning undefined if invalid */
function safeParseFloat(val: string | undefined): number | undefined {
  if (!val || val.trim() === '') return undefined;
  const num = parseFloat(val);
  return isNaN(num) ? undefined : num;
}

/** Safely parse an int >= 1, returning undefined if invalid */
function safeParsePositiveInt(val: string | undefined): number | undefined {
  if (!val || val.trim() === '') return undefined;
  const num = parseInt(val, 10);
  return isNaN(num) || num < 1 ? undefined : num;
}

/** Validate an HH:MM time string */
function isValidTime(time: string | undefined): boolean {
  if (!time) return false;
  return /^\d{1,2}:\d{2}$/.test(time.trim());
}

// ─── Volunteer CSV Parser ────────────────────────────────────────────────────

const REQUIRED_VOLUNTEER_FIELDS = [
  'name',
  'skills',
  'location',
  'availability',
  'rating',
] as const;

export function parseVolunteersCsv(file: File): Promise<ParseResult<Volunteer>> {
  return new Promise((resolve) => {
    Papa.parse<VolunteerCsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase().replace(/\s+/g, '_'),
      complete: (results) => {
        const errors: string[] = [];
        const data: Volunteer[] = [];

        // Validate that all required columns exist
        const headers = results.meta.fields ?? [];
        const normalizedHeaders = headers.map((h) => h.replace(/_/g, ''));
        const missingCols = REQUIRED_VOLUNTEER_FIELDS.filter(
          (f) => !normalizedHeaders.includes(f) && !headers.includes(f)
        );

        if (missingCols.length > 0) {
          resolve({
            data: [],
            errors: [`Missing required columns: ${missingCols.join(', ')}`],
          });
          return;
        }

        const rawRows = results.data as unknown as Record<string, string>[];

        rawRows.forEach((row, index) => {
          const rowNum = index + 2; // +2 for 1-based + header row

          const name = row['name']?.trim();
          if (!name) {
            errors.push(`Row ${rowNum}: Missing volunteer name`);
            return;
          }

          const skillsRaw = row['skills']?.trim();
          if (!skillsRaw) {
            errors.push(`Row ${rowNum}: Missing skills for "${name}"`);
            return;
          }

          // Parse skills with optional proficiency levels
          const { skills, skillLevels } = parseSkillsWithLevels(skillsRaw);
          if (skills.length === 0) {
            errors.push(
              `Row ${rowNum}: No valid skills found for "${name}". Valid skills: ${VALID_SKILLS.join(', ')}`
            );
            return;
          }

          const rating = parseFloat(row['rating'] ?? '');
          if (isNaN(rating) || rating < 0 || rating > 5) {
            errors.push(
              `Row ${rowNum}: Invalid rating for "${name}" — must be 0‑5`
            );
            return;
          }

          // Optional fields
          const lat = safeParseFloat(row['lat']);
          const lng = safeParseFloat(row['lng']);
          const availStart = isValidTime(row['avail_start']) ? row['avail_start']!.trim() : undefined;
          const availEnd = isValidTime(row['avail_end']) ? row['avail_end']!.trim() : undefined;

          const volunteer: Volunteer = {
            id: generateId(),
            name,
            skills,
            skillLevels: Object.keys(skillLevels).length > 0 ? skillLevels : undefined,
            location: row['location']?.trim() || 'Unknown',
            lat,
            lng,
            availability: parseAvailability(row['availability'] ?? ''),
            availStart,
            availEnd,
            rating: Math.round(rating * 10) / 10,
            avatar: getInitials(name),
            activeTaskCount: 0,
          };

          data.push(volunteer);
        });

        // Remove duplicates by name
        const uniqueData = removeDuplicates(data, (v) => v.name.toLowerCase());
        
        // Include papaparse errors
        results.errors.forEach((err) => {
          errors.push(`Parse error at row ${(err.row ?? 0) + 2}: ${err.message}`);
        });

        resolve({ data: uniqueData, errors });
      },
      error: (err: Error) => {
        resolve({ data: [], errors: [`Failed to read file: ${err.message}`] });
      },
    });
  });
}

// ─── Needs CSV Parser ────────────────────────────────────────────────────────

const REQUIRED_NEED_FIELDS = [
  'title',
  'requiredskills',
  'location',
  'urgency',
] as const;

export function parseNeedsCsv(file: File): Promise<ParseResult<Need>> {
  return new Promise((resolve) => {
    Papa.parse<NeedCsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase().replace(/\s+/g, ''),
      complete: (results) => {
        const errors: string[] = [];
        const data: Need[] = [];

        const headers = results.meta.fields ?? [];
        const missingCols = REQUIRED_NEED_FIELDS.filter(
          (f) => !headers.includes(f)
        );

        if (missingCols.length > 0) {
          resolve({
            data: [],
            errors: [
              `Missing required columns: ${missingCols.join(', ')}. Found: ${headers.join(', ')}`,
            ],
          });
          return;
        }

        results.data.forEach((row, index) => {
          const rowNum = index + 2;

          // Access using normalized keys
          const rawRow = row as unknown as Record<string, string>;
          const title = rawRow['title']?.trim();
          const requiredSkills = rawRow['requiredskills']?.trim();
          const location = rawRow['location']?.trim();
          const urgencyRaw = rawRow['urgency']?.trim();
          const timeframe = rawRow['timeframe']?.trim() || undefined;

          // Optional enhanced fields
          const lat = safeParseFloat(rawRow['lat']);
          const lng = safeParseFloat(rawRow['lng']);
          const timeframeStart = isValidTime(rawRow['timeframestart'] ?? rawRow['timeframe_start'])
            ? (rawRow['timeframestart'] ?? rawRow['timeframe_start'])!.trim()
            : undefined;
          const timeframeEnd = isValidTime(rawRow['timeframeend'] ?? rawRow['timeframe_end'])
            ? (rawRow['timeframeend'] ?? rawRow['timeframe_end'])!.trim()
            : undefined;
          const deadline = rawRow['deadline']?.trim() || undefined;
          const teamSizeNeeded = safeParsePositiveInt(rawRow['teamsize'] ?? rawRow['team_size'] ?? rawRow['teamsizeneeded']);

          if (!title) {
            errors.push(`Row ${rowNum}: Missing need title`);
            return;
          }

          if (!requiredSkills) {
            errors.push(`Row ${rowNum}: Missing required skills for "${title}"`);
            return;
          }

          const skills = parseSkillsString(requiredSkills);
          if (skills.length === 0) {
            errors.push(
              `Row ${rowNum}: No valid skills for "${title}". Valid: ${VALID_SKILLS.join(', ')}`
            );
            return;
          }

          const urgency = parseUrgency(urgencyRaw || '');
          if (!urgency) {
            errors.push(
              `Row ${rowNum}: Invalid urgency for "${title}" — must be High/Medium/Low`
            );
            return;
          }

          data.push({
            id: generateId(),
            title,
            requiredSkills: skills,
            location: location || 'Unknown',
            lat,
            lng,
            urgency,
            timeframe,
            timeframeStart,
            timeframeEnd,
            deadline,
            teamSizeNeeded,
            dateAdded: 'Just now',
            isAssigned: false,
          });
        });

        // Remove duplicates by title
        const uniqueData = removeDuplicates(data, (n) => n.title.toLowerCase());
        
        results.errors.forEach((err) => {
          errors.push(`Parse error at row ${(err.row ?? 0) + 2}: ${err.message}`);
        });

        resolve({ data: uniqueData, errors });
      },
      error: (err: Error) => {
        resolve({ data: [], errors: [`Failed to read file: ${err.message}`] });
      },
    });
  });
}
