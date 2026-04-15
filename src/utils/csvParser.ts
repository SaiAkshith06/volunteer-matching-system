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
  toTitleCase,
  validateSkill,
  validateUrgency,
  validateAvailability,
  removeDuplicates,
} from './validation';

// ─── Validation Helpers ──────────────────────────────────────────────────────

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
      transformHeader: (header: string) => header.trim().toLowerCase(),
      complete: (results) => {
        const errors: string[] = [];
        const data: Volunteer[] = [];

        // Validate that all required columns exist
        const headers = results.meta.fields ?? [];
        const missingCols = REQUIRED_VOLUNTEER_FIELDS.filter(
          (f) => !headers.includes(f)
        );

        if (missingCols.length > 0) {
          resolve({
            data: [],
            errors: [`Missing required columns: ${missingCols.join(', ')}`],
          });
          return;
        }

        results.data.forEach((row, index) => {
          const rowNum = index + 2; // +2 for 1-based + header row

          if (!row.name?.trim()) {
            errors.push(`Row ${rowNum}: Missing volunteer name`);
            return;
          }

          if (!row.skills?.trim()) {
            errors.push(`Row ${rowNum}: Missing skills for "${row.name}"`);
            return;
          }

          const skills = parseSkillsString(row.skills);
          if (skills.length === 0) {
            errors.push(
              `Row ${rowNum}: No valid skills found for "${row.name}". Valid skills: ${VALID_SKILLS.join(', ')}`
            );
            return;
          }

          const rating = parseFloat(row.rating);
          if (isNaN(rating) || rating < 0 || rating > 5) {
            errors.push(
              `Row ${rowNum}: Invalid rating for "${row.name}" — must be 0‑5`
            );
            return;
          }

          data.push({
            id: generateId(),
            name: row.name.trim(),
            skills,
            location: row.location?.trim() || 'Unknown',
            availability: parseAvailability(row.availability),
            rating: Math.round(rating * 10) / 10,
            avatar: getInitials(row.name),
            activeTaskCount: 0,
          });
        });

        // Remove duplicates by name
        const uniqueData = removeDuplicates(data, (v) => v.name.toLowerCase());
        
        // Include papaparse errors
        results.errors.forEach((err) => {
          errors.push(`Parse error at row ${err.row + 2}: ${err.message}`);
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
            urgency,
            timeframe,
            dateAdded: 'Just now',
            isAssigned: false,
          });
        });

        // Remove duplicates by title
        const uniqueData = removeDuplicates(data, (n) => n.title.toLowerCase());
        
        results.errors.forEach((err) => {
          errors.push(`Parse error at row ${err.row + 2}: ${err.message}`);
        });

        resolve({ data: uniqueData, errors });
      },
      error: (err: Error) => {
        resolve({ data: [], errors: [`Failed to read file: ${err.message}`] });
      },
    });
  });
}
