import React from 'react';
import type { Need, Urgency } from '../types';
import { MapPin, Calendar } from 'lucide-react';

interface NeedCardProps {
  need: Need;
}

const urgencyStyles: Record<Urgency, { badge: string; bar: string }> = {
  High: { badge: 'bg-[#fef3f2] text-[#e76f51]', bar: 'bg-[#e76f51]' },
  Medium: { badge: 'bg-[#fef9f0] text-[#f4a261]', bar: 'bg-[#f4a261]' },
  Low: { badge: 'bg-[#e9f5f3] text-[#2a9d8f]', bar: 'bg-[#2a9d8f]' },
};

const NeedCard: React.FC<NeedCardProps> = ({ need }) => {
  const style = urgencyStyles[need.urgency];

  return (
    <div className={`warm-card relative p-5 pl-6 overflow-hidden ${need.isAssigned ? 'opacity-50' : ''}`}>
      {!need.isAssigned && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bar} rounded-l-[24px]`} />
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-bold text-gray-800 leading-tight text-sm">{need.title}</h4>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${style.badge}`}>
          {need.isAssigned ? '✓ Assigned' : need.urgency}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {need.requiredSkills.map((skill) => (
          <span key={skill} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/60 text-gray-600">
            {skill}
          </span>
        ))}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-gray-400">
          <MapPin size={13} className="shrink-0" />
          <span className="text-xs truncate">{need.location}</span>
        </div>
        {(need.timeframe || (need.timeframeStart && need.timeframeEnd)) && (
          <div className="flex items-center gap-1.5 text-gray-400">
            <Calendar size={13} className="shrink-0" />
            <span className="text-[11px] truncate">{need.timeframe || `${need.timeframeStart} - ${need.timeframeEnd}`}</span>
          </div>
        )}
        {need.deadline && (() => {
          const isOverdue = new Date(need.deadline).getTime() < Date.now();
          return (
            <div className="flex items-center gap-1.5 text-[#e76f51]">
              <span className="font-bold text-[10px]">{isOverdue ? "OVERDUE" : "DUE"}</span>
              <span className="text-[11px]">
                {isOverdue ? "Overdue — immediate action required" : new Date(need.deadline).toLocaleDateString()}
              </span>
            </div>
          );
        })()}
        <div className="flex flex-col gap-1.5 text-gray-400 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[10px]">TEAM</span>
            <span className="text-[11px]">{need.assignedCount || 0} / {need.teamSizeNeeded || 1} volunteers</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#2a9d8f] transition-all duration-300"
              style={{ width: `${Math.min(100, ((need.assignedCount || 0) / (need.teamSizeNeeded || 1)) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeedCard;
