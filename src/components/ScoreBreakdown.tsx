import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { Match } from '../types';

interface ScoreBreakdownProps {
  breakdown: NonNullable<Match['breakdown']>;
  show: boolean;
  onToggle: () => void;
}

const bars = [
  { key: 'skills', label: 'Skills', color: 'from-[#2a9d8f] to-[#3ec4b3]' },
  { key: 'location', label: 'Location', color: 'from-[#2a9d8f] to-[#4aaf9e]' },
  { key: 'availability', label: 'Availability', color: 'from-[#f4a261] to-[#f4c792]' },
  { key: 'urgency', label: 'Urgency', color: 'from-[#e76f51] to-[#f4a261]' },
  { key: 'rating', label: 'Rating', color: 'from-[#f4a261] to-[#f4c792]' },
  { key: 'workload', label: 'Workload', color: 'from-[#2a9d8f] to-[#3ec4b3]' },
  { key: 'reliability', label: 'Reliability', color: 'from-[#2a9d8f] to-[#4aaf9e]' },
] as const;

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown, show, onToggle }) => {
  return (
    <div className="mb-4">
      <button onClick={onToggle} className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-[#2a9d8f] transition-colors mb-2" aria-expanded={show}>
        <ChevronDown size={12} className={`transition-transform duration-200 ${show ? 'rotate-180' : ''}`} />
        {show ? 'HIDE BREAKDOWN' : 'VIEW SCORE BREAKDOWN'}
      </button>

      {show && (
        <div className="bg-white/40 p-4 rounded-[16px] border border-[#e8dfcf] animate-fadeIn space-y-2.5">
          {bars.map((bar) => {
            const value = breakdown[bar.key as keyof typeof breakdown];
            if (value === undefined) return null;
            const pct = Math.round(value * 100);
            return (
              <div key={bar.key}>
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  <span>{bar.label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200/40 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${bar.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScoreBreakdown;
