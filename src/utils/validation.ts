import type { Skill, Urgency, Availability } from '../types';

export const VALID_SKILLS: Skill[] = [
  'First Aid',
  'Counseling',
  'Logistics',
  'Driving',
  'Teaching',
  'Cooking',
  'IT Support',
];

export const VALID_URGENCIES: Urgency[] = ['High', 'Medium', 'Low'];

export const VALID_AVAILABILITIES: Availability[] = [
  'Weekdays',
  'Weekends',
  'Evenings',
  'Mornings',
  'Flexible',
];

export function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

export function validateSkill(skill: string): Skill | null {
  const result = toTitleCase(skill);
  return VALID_SKILLS.includes(result as Skill) ? (result as Skill) : null;
}

export function validateUrgency(urgency: string): Urgency | null {
  const result = toTitleCase(urgency);
  return VALID_URGENCIES.includes(result as Urgency) ? (result as Urgency) : null;
}

export function validateAvailability(avail: string): Availability {
  const result = toTitleCase(avail);
  return VALID_AVAILABILITIES.includes(result as Availability) ? (result as Availability) : 'Flexible';
}

export function removeDuplicates<T>(items: T[], keyFn: (item: T) => string): T[] {
  if (!items) return [];
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
