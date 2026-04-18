import React from 'react';
import type { Need } from '../types';
import type { Urgency } from '../types';
import { MapPin, Calendar } from 'lucide-react';

interface NeedCardProps {
  need: Need;
}

const urgencyStyles: Record<Urgency, string> = {
  High: 'bg-rose-100 text-rose-700 border-rose-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const NeedCard: React.FC<NeedCardProps> = ({ need }) => {
  return (
    <div
      className={`p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 ${
        need.isAssigned
          ? 'border-emerald-200 opacity-60'
          : 'border-slate-100 hover:border-blue-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-bold text-slate-900 leading-tight text-sm">
          {need.title}
        </h4>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border shrink-0 ${urgencyStyles[need.urgency]}`}
        >
          {need.isAssigned ? '✓ Assigned' : need.urgency}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {need.requiredSkills.map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-100"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-500">
          <MapPin size={14} className="shrink-0" />
          <span className="text-xs truncate">{need.location}</span>
        </div>
        {(need.timeframe || (need.timeframeStart && need.timeframeEnd)) && (
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar size={14} className="shrink-0" />
            <span className="text-[11px] truncate">
              {need.timeframe || `${need.timeframeStart} - ${need.timeframeEnd}`}
            </span>
          </div>
        )}
        {need.deadline && (
          <div className="flex items-center gap-1.5 text-rose-500">
            <span className="font-bold text-[10px] shrink-0">DUE</span>
            <span className="text-[11px]">{new Date(need.deadline).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="font-bold text-[10px] shrink-0">TEAM</span>
          <span className="text-[11px]">
            {need.assignedCount || 0} / {need.teamSizeNeeded || 1} volunteers
          </span>
        </div>
      </div>
    </div>
  );
};

export default NeedCard;
