import React from 'react';
import type { Volunteer, Skill } from '../types';
import { MapPin, Star, Briefcase } from 'lucide-react';

interface VolunteerCardProps {
  volunteer: Volunteer;
  hasNoMatches?: boolean;
  unmatchedReasons?: string[];
}

const skillColors: Record<Skill, string> = {
  'First Aid': 'bg-[#fef3f2] text-[#e76f51]',
  'Counseling': 'bg-[#e9f5f3] text-[#2a9d8f]',
  'Logistics': 'bg-[#fef9f0] text-[#f4a261]',
  'Driving': 'bg-gray-100 text-gray-600',
  'Teaching': 'bg-[#e9f5f3] text-[#2a9d8f]',
  'Cooking': 'bg-[#fef9f0] text-[#e76f51]',
  'IT Support': 'bg-gray-100 text-gray-600',
};

const VolunteerCard: React.FC<VolunteerCardProps> = ({
  volunteer,
  hasNoMatches = false,
  unmatchedReasons = []
}) => {
  const taskCount = volunteer.activeTaskCount ?? 0;
  const isBusy = taskCount >= 3;

  return (
    <div className={`warm-card p-5 ${isBusy ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#e9f5f3] flex items-center justify-center text-[#2a9d8f] font-bold text-lg shrink-0">
          {volunteer.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-gray-800 truncate">{volunteer.name}</h4>
            <div className="flex items-center gap-2">
              {taskCount > 0 && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                  isBusy ? 'bg-[#fef9f0] text-[#f4a261]' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Briefcase size={8} />
                  {isBusy ? 'Busy' : `${taskCount} task${taskCount > 1 ? 's' : ''}`}
                </span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {volunteer.availability}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-2.5">
            <div className="flex items-center gap-1 text-gray-400">
              <MapPin size={12} />
              <span className="text-[11px]">{volunteer.location}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Star size={12} className="text-[#f4a261] fill-[#f4a261]" />
              <span className="text-[11px] font-semibold text-gray-600">{volunteer.rating}</span>
            </div>
            <span className="px-2 py-0.5 bg-[#e9f5f3] text-[#2a9d8f] rounded-full text-[9px] font-bold uppercase tracking-wider">
              {Math.round((volunteer.reliabilityScore ?? 0.5) * 100)}% reliable
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {volunteer.skills.map((skill) => {
              const level = volunteer.skillLevels?.[skill] ?? volunteer.skillLevels?.[skill.toLowerCase()] ?? 1;
              return (
                <span key={skill} className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${skillColors[skill] || 'bg-gray-100 text-gray-600'}`}>
                  {skill}
                  <span className="opacity-50 text-[9px]">L{level}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {hasNoMatches && (
        <div className="mt-4 pt-3 border-t border-[#e8dfcf] animate-fadeIn">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">No matching needs</p>
          {unmatchedReasons.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {unmatchedReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-500 font-medium">
                  <span className="text-[#e76f51] shrink-0">•</span>
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
