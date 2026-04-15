import { useState, useMemo, useCallback, useRef } from 'react';
import type { Volunteer, Need, Match, Assignment } from '../types';
import { generateMatches } from '../utils/matching';
import {
  sortMatches,
  enrichMatch,
  autoAssignMatches,
  getCoverageRate,
  getIdleVolunteers,
  getUrgentNeedsPending,
} from '../utils/matchInsights';
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

  // Insights
  coverageRate: number;
  idleVolunteerCount: number;
  urgentPendingCount: number;

  // Actions
  handleVolunteerCsvUpload: (file: File) => Promise<void>;
  handleNeedsCsvUpload: (file: File) => Promise<void>;
  handleAssign: (match: Match) => void;
  handleAutoAssign: () => void;
  handleExport: () => void;
  handleLoadScenario: (volunteers: Volunteer[], needs: Need[]) => void;
  handleReset: () => void;
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

  // ── Memoized matches with Layer 2 enrichment ──────────────────────────────

  const topMatches = useMemo(() => {
    const rawMatches = generateMatches(volunteers, needs);
    const sorted = sortMatches(rawMatches);
    return sorted.map(enrichMatch);
  }, [volunteers, needs]);

  // ── Insight metrics ───────────────────────────────────────────────────────

  const coverageRate = useMemo(
    () => getCoverageRate(assignments, needs.length),
    [assignments, needs]
  );

  const idleVolunteerCount = useMemo(
    () => getIdleVolunteers(volunteers, assignments),
    [volunteers, assignments]
  );

  const urgentPendingCount = useMemo(
    () => getUrgentNeedsPending(needs),
    [needs]
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

  // ── Auto-Assign ───────────────────────────────────────────────────────────

  const handleAutoAssign = useCallback(() => {
    const toAssign = autoAssignMatches(topMatches, 30);
    if (toAssign.length === 0) {
      addToast('No matches above threshold for auto-assignment', 'info');
      return;
    }

    // Process each assignment
    const newAssignments: Assignment[] = [];
    const assignedVolunteerIds = new Set<string>();
    const assignedNeedIds = new Set<string>();

    for (const match of toAssign) {
      newAssignments.push({
        id: uid(),
        volunteerName: match.volunteer.name,
        volunteerSkills: match.volunteer.skills.join(', '),
        needTitle: match.need.title,
        location: match.need.location,
        matchScore: match.score,
        assignedAt: new Date().toLocaleString(),
      });
      assignedVolunteerIds.add(match.volunteer.id);
      assignedNeedIds.add(match.need.id);
    }

    setAssignments((prev) => [...prev, ...newAssignments]);
    setVolunteers((prev) =>
      prev.filter((v) => !assignedVolunteerIds.has(v.id))
    );
    setNeeds((prev) =>
      prev.map((n) =>
        assignedNeedIds.has(n.id) ? { ...n, isAssigned: true } : n
      )
    );

    addToast(
      `Auto-assigned ${toAssign.length} volunteer${toAssign.length !== 1 ? 's' : ''} successfully`,
      'success'
    );
  }, [topMatches, addToast]);

  // ── Demo Scenario Loader ──────────────────────────────────────────────────

  const handleLoadScenario = useCallback(
    (scenarioVolunteers: Volunteer[], scenarioNeeds: Need[]) => {
      setVolunteers(scenarioVolunteers);
      setNeeds(scenarioNeeds);
      setAssignments([]);
      addToast(
        `Loaded ${scenarioVolunteers.length} volunteers and ${scenarioNeeds.length} needs`,
        'success'
      );
    },
    [addToast]
  );

  // ── Reset ─────────────────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    setVolunteers(initialVolunteers);
    setNeeds(initialNeeds);
    setAssignments([]);
    addToast('System reset to default state', 'info');
  }, [initialVolunteers, initialNeeds, addToast]);

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
    coverageRate,
    idleVolunteerCount,
    urgentPendingCount,
    handleVolunteerCsvUpload,
    handleNeedsCsvUpload,
    handleAssign,
    handleAutoAssign,
    handleExport,
    handleLoadScenario,
    handleReset,
    dismissToast,
  };
}
