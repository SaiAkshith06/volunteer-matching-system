import { useState, useMemo, useCallback, useRef } from 'react';
import type { Volunteer, Need, Match, Assignment } from '../types';
import { generateMatches } from '../utils/matching';
import { parseVolunteersCsv, parseNeedsCsv } from '../utils/csvParser';
import { exportAssignmentsCsv } from '../utils/exportCsv';

// ─── Toast Notification ──────────────────────────────────────────────────────

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// ─── Hook Return Type ────────────────────────────────────────────────────────

interface UseVolunteerMatchReturn {
  // State
  volunteers: Volunteer[];
  needs: Need[];
  assignments: Assignment[];
  topMatches: Match[];
  isLoading: boolean;
  toasts: Toast[];

  // Actions
  handleVolunteerCsvUpload: (file: File) => Promise<void>;
  handleNeedsCsvUpload: (file: File) => Promise<void>;
  handleAssign: (match: Match) => void;
  handleExport: () => void;
  dismissToast: (id: string) => void;
}

// ─── Generate unique id ──────────────────────────────────────────────────────

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useVolunteerMatch(
  initialVolunteers: Volunteer[] = [],
  initialNeeds: Need[] = []
): UseVolunteerMatchReturn {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);
  const [needs, setNeeds] = useState<Need[]>(initialNeeds);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Auto-dismiss timer refs
  const toastTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // ── Toast helpers ─────────────────────────────────────────────────────────

  const addToast = useCallback(
    (message: string, type: Toast['type'] = 'info') => {
      const id = uid();
      setToasts((prev) => [...prev, { id, message, type }]);
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        toastTimers.current.delete(id);
      }, 4000);
      toastTimers.current.set(id, timer);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  // ── Memoized matches ──────────────────────────────────────────────────────

  const topMatches = useMemo(
    () => generateMatches(volunteers, needs),
    [volunteers, needs]
  );

  // ── CSV Upload Handlers ───────────────────────────────────────────────────

  const handleVolunteerCsvUpload = useCallback(
    async (file: File) => {
      setIsLoading(true);
      try {
        const result = await parseVolunteersCsv(file);

        if (result.errors.length > 0) {
          result.errors.forEach((err) => addToast(err, 'error'));
        }

        if (result.data.length > 0) {
          setVolunteers((prev) => [...prev, ...result.data]);
          addToast(
            `Successfully imported ${result.data.length} volunteer(s)`,
            'success'
          );
        } else if (result.errors.length === 0) {
          addToast('No valid volunteer records found in CSV', 'error');
        }
      } catch {
        addToast('Unexpected error parsing volunteer CSV', 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [addToast]
  );

  const handleNeedsCsvUpload = useCallback(
    async (file: File) => {
      setIsLoading(true);
      try {
        const result = await parseNeedsCsv(file);

        if (result.errors.length > 0) {
          result.errors.forEach((err) => addToast(err, 'error'));
        }

        if (result.data.length > 0) {
          setNeeds((prev) => [...prev, ...result.data]);
          addToast(
            `Successfully imported ${result.data.length} need(s)`,
            'success'
          );
        } else if (result.errors.length === 0) {
          addToast('No valid need records found in CSV', 'error');
        }
      } catch {
        addToast('Unexpected error parsing needs CSV', 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [addToast]
  );

  // ── Assignment ────────────────────────────────────────────────────────────

  const handleAssign = useCallback(
    (match: Match) => {
      const newAssignment: Assignment = {
        id: uid(),
        volunteerName: match.volunteer.name,
        volunteerSkills: match.volunteer.skills.join(', '),
        needTitle: match.need.title,
        location: match.need.location,
        matchScore: match.score,
        assignedAt: new Date().toLocaleString(),
      };

      setAssignments((prev) => [...prev, newAssignment]);

      // Remove volunteer from available list
      setVolunteers((prev) =>
        prev.filter((v) => v.id !== match.volunteer.id)
      );

      // Mark need as assigned
      setNeeds((prev) =>
        prev.map((n) =>
          n.id === match.need.id ? { ...n, isAssigned: true } : n
        )
      );

      addToast(
        `Assigned ${match.volunteer.name} → ${match.need.title}`,
        'success'
      );
    },
    [addToast]
  );

  // ── Export ────────────────────────────────────────────────────────────────

  const handleExport = useCallback(() => {
    if (assignments.length === 0) {
      addToast('No assignments to export', 'info');
      return;
    }
    exportAssignmentsCsv(assignments);
    addToast(`Exported ${assignments.length} assignment(s) to CSV`, 'success');
  }, [assignments, addToast]);

  return {
    volunteers,
    needs,
    assignments,
    topMatches,
    isLoading,
    toasts,
    handleVolunteerCsvUpload,
    handleNeedsCsvUpload,
    handleAssign,
    handleExport,
    dismissToast,
  };
}
