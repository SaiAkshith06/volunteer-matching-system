import React from 'react';
import type { Assignment } from '../types';
import { CheckCircle2, XCircle, Star, Clock } from 'lucide-react';

interface AssignmentsListProps {
  assignments: Assignment[];
  onRecordOutcome: (assignmentId: string, outcome: 'completed' | 'no-show' | 'excellent') => void;
}

const outcomeColors = {
  completed: 'bg-emerald-100 text-emerald-700',
  'no-show': 'bg-rose-100 text-rose-700',
  excellent: 'bg-amber-100 text-amber-700',
};

const AssignmentsList: React.FC<AssignmentsListProps> = ({ assignments, onRecordOutcome }) => {
  if (assignments.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <Clock size={20} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Recent Assignments</h2>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Volunteer</th>
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4 text-center">Match Score</th>
                <th className="px-6 py-4">Assigned Time</th>
                <th className="px-6 py-4 text-center">Feedback / Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{a.volunteerName}</td>
                  <td className="px-6 py-4 font-medium">{a.needTitle}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-blue-50 text-blue-700 font-bold text-xs">
                      {a.matchScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs whitespace-nowrap">{a.assignedAt}</td>
                  <td className="px-6 py-4">
                    {a.outcome ? (
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${outcomeColors[a.outcome]}`}>
                          {a.outcome}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onRecordOutcome(a.id, 'excellent')}
                          className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                          title="Excellent"
                        >
                          <Star size={16} />
                        </button>
                        <button
                          onClick={() => onRecordOutcome(a.id, 'completed')}
                          className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                          title="Completed"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          onClick={() => onRecordOutcome(a.id, 'no-show')}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                          title="No-Show"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsList;
