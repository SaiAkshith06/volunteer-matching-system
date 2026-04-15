import Papa from 'papaparse';
import type { Assignment } from '../types';

interface ExportRow {
  volunteer_name: string;
  skills: string;
  need_title: string;
  location: string;
  match_score: number;
  assigned_at: string;
}

export function exportAssignmentsCsv(assignments: Assignment[]): void {
  const rows: ExportRow[] = assignments.map((a) => ({
    volunteer_name: a.volunteerName,
    skills: a.volunteerSkills,
    need_title: a.needTitle,
    location: a.location,
    match_score: a.matchScore,
    assigned_at: a.assignedAt,
  }));

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `assignments_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
