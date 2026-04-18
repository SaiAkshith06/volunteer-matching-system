import React from 'react';
import type { Volunteer } from '../types';
import type { Skill } from '../types';
import { MapPin, Star, Briefcase } from 'lucide-react';

interface VolunteerCardProps {
  volunteer: Volunteer;
  hasNoMatches?: boolean;
  unmatchedReasons?: string[];
}

const skillColors: Record<Skill, string> = {
  'First Aid': 'bg-blue-100 text-blue-700',
  'Counseling': 'bg-purple-100 text-purple-700',
  'Logistics': 'bg-orange-100 text-orange-700',
  'Driving': 'bg-slate-100 text-slate-700',
  'Teaching': 'bg-indigo-100 text-indigo-700',
  'Cooking': 'bg-rose-100 text-rose-700',
  'IT Support': 'bg-cyan-100 text-cyan-700',
};

const VolunteerCard: React.FC<VolunteerCardProps> = ({ 
  volunteer, 
  hasNoMatches = false, 
  unmatchedReasons = [] 
}) => {
  const taskCount = volunteer.activeTaskCount ?? 0;
  const isBusy = taskCount >= 3;

  return (
    <div className={`flex flex-col p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 ${
      isBusy ? 'border-amber-200 opacity-75' : 'border-slate-100 hover:border-blue-200'
    }`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-100 shrink-0">
          {volunteer.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-slate-900 truncate">{volunteer.name}</h4>
            <div className="flex items-center gap-2">
              {/* Active tasks badge */}
              {taskCount > 0 && (
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  isBusy
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-50 text-slate-500 border border-slate-200'
                }`}>
                  <Briefcase size={8} />
                  {isBusy ? 'Busy' : `${taskCount} task${taskCount > 1 ? 's' : ''}`}
                </span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {volunteer.availability}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1 text-slate-500">
              <MapPin size={12} />
              <span className="text-[11px]">{volunteer.location}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-semibold text-slate-600">
                {volunteer.rating}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="px-1.5 py-0.5 ml-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded text-[9px] font-bold uppercase tracking-wider">
                Reliability: {Math.round((volunteer.reliabilityScore ?? 0.5) * 100)}%
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {volunteer.skills.map((skill) => {
              const level = volunteer.skillLevels?.[skill] ?? volunteer.skillLevels?.[skill.toLowerCase()] ?? 1;
              return (
                <span
                  key={skill}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 ${skillColors[skill] || 'bg-slate-100 text-slate-600'}`}
                >
                  {skill} 
                  <span className="opacity-75 text-[9px]">Lvl {level}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {hasNoMatches && (
        <div className="mt-4 pt-3 border-t border-slate-100 animate-fadeIn">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            No matching needs found
          </p>
          {unmatchedReasons.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {unmatchedReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-500 font-medium">
                  <span className="text-rose-400 shrink-0">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default VolunteerCard;
