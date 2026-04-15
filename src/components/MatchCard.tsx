import React from 'react';
import type { Match } from '../types';
import type { Urgency } from '../types';
import { Target, Zap, ChevronRight } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onAssign: (match: Match) => void;
}

const urgencyColors: Record<Urgency, string> = {
  High: 'text-rose-600 bg-rose-50',
  Medium: 'text-amber-600 bg-amber-50',
  Low: 'text-emerald-600 bg-emerald-50',
};

function getScoreColor(score: number): string {
  if (score >= 90) return 'from-emerald-500 to-emerald-600';
  if (score >= 75) return 'from-blue-500 to-blue-600';
  if (score >= 60) return 'from-orange-500 to-orange-600';
  return 'from-slate-400 to-slate-500';
}

function getScoreBg(score: number): string {
  if (score >= 90) return 'bg-emerald-50 border-emerald-200';
  if (score >= 75) return 'bg-blue-50 border-blue-200';
  if (score >= 60) return 'bg-orange-50 border-orange-200';
  return 'bg-slate-50 border-slate-200';
}

function getConfidenceLabel(score: number): string {
  if (score >= 90) return 'Strong Match';
  if (score >= 75) return 'Good Match';
  if (score >= 60) return 'Moderate Match';
  return 'Weak Match';
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onAssign }) => {
  if (!match || !match.volunteer || !match.need) {
    console.warn('MatchCard: Invalid match data', match);
    return null;
  }

  const breakdown = match.breakdown || { skills: 0, location: 0, availability: 0, urgency: 0 };
  
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden">
      {/* Score Badge */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {getConfidenceLabel(match.score)}
        </span>
        <div
          className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center shadow-sm ${getScoreBg(match.score)}`}
        >
          <span
            className={`text-lg font-extrabold bg-gradient-to-b ${getScoreColor(match.score)} bg-clip-text text-transparent`}
          >
            {match.score}%
          </span>
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
            Score
          </span>
        </div>
      </div>

      <div className="p-5 pr-20">
        {/* Volunteer Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
            {match.volunteer.avatar}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              {match.volunteer.name}
            </h4>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {match.volunteer.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-50 text-blue-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center gap-2 mb-3 text-slate-300">
          <ChevronRight size={14} />
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Need Info */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 border border-rose-100">
            <Target size={18} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm leading-tight">
              {match.need.title}
            </h4>
            <span
              className={`inline-flex items-center gap-0.5 mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${urgencyColors[match.need.urgency]}`}
            >
              <Zap size={8} />
              {match.need.urgency}
            </span>
          </div>
        </div>

        {/* Reasons */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {match.reasons.map((reason, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-medium rounded-full border border-slate-100"
            >
              {reason}
            </span>
          ))}
        </div>

        {/* Breakdown */}
        {match.breakdown && (
          <div className="mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-500">
            <div className="flex flex-col items-center">
              <span className="text-slate-400 uppercase text-[8px] mb-0.5">Skills</span>
              <span className="text-slate-700">{Math.round(match.breakdown.skills * 100)}%</span>
            </div>
            <div className="w-px h-5 bg-slate-200"></div>
            <div className="flex flex-col items-center">
              <span className="text-slate-400 uppercase text-[8px] mb-0.5">Location</span>
              <span className="text-slate-700">{Math.round(match.breakdown.location * 100)}%</span>
            </div>
            <div className="w-px h-5 bg-slate-200"></div>
            <div className="flex flex-col items-center">
              <span className="text-slate-400 uppercase text-[8px] mb-0.5">Time</span>
              <span className="text-slate-700">{Math.round(match.breakdown.availability * 100)}%</span>
            </div>
            <div className="w-px h-5 bg-slate-200"></div>
            <div className="flex flex-col items-center">
              <span className="text-slate-400 uppercase text-[8px] mb-0.5">Urgency</span>
              <span className="text-slate-700">+{Math.round(match.breakdown.urgency * 10)}</span>
            </div>
          </div>
        )}

        {/* Assign Button */}
        <button
          onClick={() => onAssign(match)}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          Assign Match
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
