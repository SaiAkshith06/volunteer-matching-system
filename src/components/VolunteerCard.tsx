import React from 'react';
import type { Volunteer } from '../types';
import type { Skill } from '../types';
import { MapPin, Star } from 'lucide-react';

interface VolunteerCardProps {
  volunteer: Volunteer;
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

const VolunteerCard: React.FC<VolunteerCardProps> = ({ volunteer }) => {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-200">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-100 shrink-0">
        {volunteer.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-slate-900 truncate">{volunteer.name}</h4>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {volunteer.availability}
          </span>
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
        </div>
        <div className="flex flex-wrap gap-1.5">
          {volunteer.skills.map((skill) => (
            <span
              key={skill}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${skillColors[skill] || 'bg-slate-100 text-slate-600'}`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerCard;
