import React from 'react';
import type { Assignment } from '../types';
import { CheckCircle2, XCircle, Star, Clock } from 'lucide-react';

interface AssignmentsListProps {
  assignments: Assignment[];
  onRecordOutcome: (assignmentId: string, outcome: 'completed' | 'no-show' | 'excellent') => void;
}

const outcomeColors = {
  completed: 'bg-[#e9f5f3] text-[#2a9d8f]',
  'no-show': 'bg-[#fef3f2] text-[#e76f51]',
  excellent: 'bg-[#fef9f0] text-[#f4a261]',
};

const AssignmentsList: React.FC<AssignmentsListProps> = ({ assignments, onRecordOutcome }) => {
  if (assignments.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold text-gray-800 tracking-tight mb-5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#e9f5f3] text-[#2a9d8f] flex items-center justify-center">
          <Clock size={14} />
        </div>
        Recent Assignments
      </h2>

      <div className="warm-card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#f8f4ec]/60 text-xs uppercase text-gray-400 font-bold">
              <tr>
                <th className="px-6 py-4">Volunteer</th>
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4 text-center">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfcf]/50">
              {assignments.map((a) => (
                <tr key={a.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">{a.volunteerName}</td>
                  <td className="px-6 py-4 font-medium">{a.needTitle}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-[#e9f5f3] text-[#2a9d8f] font-bold text-xs">
                      {a.matchScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">{a.assignedAt}</td>
                  <td className="px-6 py-4">
                    {a.outcome ? (
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${outcomeColors[a.outcome]}`}>
                          {a.outcome}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => onRecordOutcome(a.id, 'excellent')} className="p-1.5 text-gray-300 hover:text-[#f4a261] hover:bg-[#fef9f0] rounded-full transition-all duration-200 hover:scale-110" title="Excellent">
                          <Star size={16} />
                        </button>
                        <button onClick={() => onRecordOutcome(a.id, 'completed')} className="p-1.5 text-gray-300 hover:text-[#2a9d8f] hover:bg-[#e9f5f3] rounded-full transition-all duration-200 hover:scale-110" title="Completed">
                          <CheckCircle2 size={16} />
                        </button>
                        <button onClick={() => onRecordOutcome(a.id, 'no-show')} className="p-1.5 text-gray-300 hover:text-[#e76f51] hover:bg-[#fef3f2] rounded-full transition-all duration-200 hover:scale-110" title="No-Show">
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
