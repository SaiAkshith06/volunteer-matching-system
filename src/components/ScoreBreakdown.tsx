import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { Match } from '../types';

interface ScoreBreakdownProps {
  breakdown: NonNullable<Match['breakdown']>;
  show: boolean;
  onToggle: () => void;
}

const ProgressBar = ({ label, percentage, colorClass }: { label: string; percentage: number; colorClass: string }) => {
  return (
    <div className="flex flex-col gap-1 mb-2">
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown, show, onToggle }) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors mb-2"
        aria-expanded={show}
      >
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${show ? 'rotate-180' : ''}`}
        />
        {show ? 'HIDE BREAKDOWN' : 'VIEW SCORE BREAKDOWN'}
      </button>
      
      {show && (
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 animate-fadeIn space-y-1">
          <ProgressBar 
            label="Skills" 
            percentage={Math.round(breakdown.skills * 100)} 
            colorClass="bg-blue-500" 
          />
          <ProgressBar 
            label="Location" 
            percentage={Math.round(breakdown.location * 100)} 
            colorClass="bg-emerald-500" 
          />
          <ProgressBar 
            label="Availability" 
            percentage={Math.round(breakdown.availability * 100)} 
            colorClass="bg-purple-500" 
          />
          <ProgressBar 
            label="Urgency" 
            percentage={Math.round(breakdown.urgency * 100)} 
            colorClass="bg-rose-500" 
          />
          {breakdown.rating !== undefined && (
            <ProgressBar 
              label="Rating" 
              percentage={Math.round(breakdown.rating * 100)} 
              colorClass="bg-amber-500" 
            />
          )}
          {breakdown.workload !== undefined && (
            <ProgressBar 
              label="Workload" 
              percentage={Math.round(breakdown.workload * 100)} 
              colorClass="bg-indigo-500" 
            />
          )}
          {breakdown.reliability !== undefined && (
            <ProgressBar 
              label="Reliability" 
              percentage={Math.round(breakdown.reliability * 100)} 
              colorClass="bg-teal-500" 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreBreakdown;
