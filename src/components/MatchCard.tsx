import React from 'react';
import type { Match } from '../types';
import type { Urgency } from '../types';
import {
  Target,
  Zap,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Star,
  Shield,
} from 'lucide-react';
import {
  getConfidence,
  getConfidenceColor,
  getMatchLabel,
  generateMatchReasons,
} from '../utils/matchInsights';

interface MatchCardProps {
  match: Match;
  onAssign: (match: Match) => void;
  isTopMatch?: boolean;
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

function getScoreRingColor(score: number): string {
  if (score >= 90) return 'ring-emerald-300';
  if (score >= 75) return 'ring-blue-300';
  if (score >= 60) return 'ring-orange-300';
  return 'ring-slate-300';
}

function getConfidenceBadgeClasses(conf: 'High' | 'Medium' | 'Low'): string {
  switch (conf) {
    case 'High':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Medium':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200';
  }
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onAssign,
  isTopMatch = false,
}) => {
  const [showBreakdown, setShowBreakdown] = React.useState(false);

  if (!match || !match.volunteer || !match.need) {
    console.warn('MatchCard: Invalid match data', match);
    return null;
  }

  const breakdown = match.breakdown || {
    skills: 0,
    location: 0,
    availability: 0,
    urgency: 0,
  };

  const confidence = getConfidence(match.score);
  const confidenceColor = getConfidenceColor(match.score);
  const label = getMatchLabel(match.score);
  const reasons = generateMatchReasons(breakdown);

  return (
    <div
      className={`group relative bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
        isTopMatch
          ? 'border-emerald-200 ring-2 ring-emerald-100 shadow-emerald-50'
          : 'border-slate-100 hover:border-blue-200'
      }`}
    >
      {/* Top Match Ribbon */}
      {isTopMatch && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />
      )}

      {/* Score Badge */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
        {/* Confidence Tag */}
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getConfidenceBadgeClasses(
            confidence
          )}`}
        >
          <Shield size={8} />
          {confidence}
        </span>
        {/* Score Circle */}
        <div
          className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center shadow-sm ring-2 ${getScoreBg(
            match.score
          )} ${getScoreRingColor(match.score)}`}
        >
          <span
            className={`text-lg font-extrabold bg-gradient-to-b ${getScoreColor(
              match.score
            )} bg-clip-text text-transparent`}
          >
            {match.score}%
          </span>
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
            Score
          </span>
        </div>
      </div>

      <div className="p-5 pr-24">
        {/* Match Label */}
        <div className="flex items-center gap-1.5 mb-3">
          <Star
            size={12}
            className="text-amber-400"
            fill="currentColor"
          />
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: confidenceColor }}
          >
            {label}
          </span>
        </div>

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
              className={`inline-flex items-center gap-0.5 mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                urgencyColors[match.need.urgency]
              }`}
            >
              <Zap size={8} />
              {match.need.urgency}
            </span>
          </div>
        </div>

        {/* Reasons — the key explainability feature */}
        {reasons.length > 0 && (
          <div className="space-y-1 mb-3">
            {reasons.slice(0, 4).map((reason, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[11px] text-slate-600"
              >
                <CheckCircle2
                  size={12}
                  className="text-emerald-500 shrink-0"
                />
                <span className="font-medium">{reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Expandable Breakdown */}
        {match.breakdown && (
          <div className="mb-4">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-slate-600 transition-colors mb-1.5"
              aria-expanded={showBreakdown}
            >
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  showBreakdown ? 'rotate-180' : ''
                }`}
              />
              {showBreakdown ? 'Hide Breakdown' : 'View Breakdown'}
            </button>
            {showBreakdown && (
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 grid grid-cols-3 gap-1 text-[10px] font-semibold text-slate-500 animate-fadeIn">
                <div className="flex flex-col items-center py-1">
                  <span className="text-slate-400 uppercase text-[8px] mb-0.5">
                    Skills
                  </span>
                  <span className="text-slate-700">
                    {Math.round(match.breakdown.skills * 100)}%
                  </span>
                </div>
                <div className="flex flex-col items-center py-1">
                  <span className="text-slate-400 uppercase text-[8px] mb-0.5">
                    Location
                  </span>
                  <span className="text-slate-700">
                    {Math.round(match.breakdown.location * 100)}%
                  </span>
                </div>
                <div className="flex flex-col items-center py-1">
                  <span className="text-slate-400 uppercase text-[8px] mb-0.5">
                    Time
                  </span>
                  <span className="text-slate-700">
                    {Math.round(match.breakdown.availability * 100)}%
                  </span>
                </div>
                <div className="flex flex-col items-center py-1">
                  <span className="text-slate-400 uppercase text-[8px] mb-0.5">
                    Urgency
                  </span>
                  <span className="text-slate-700">
                    {Math.round(match.breakdown.urgency * 100)}%
                  </span>
                </div>
                {match.breakdown.rating !== undefined && (
                  <div className="flex flex-col items-center py-1">
                    <span className="text-slate-400 uppercase text-[8px] mb-0.5">
                      Rating
                    </span>
                    <span className="text-slate-700">
                      {Math.round(match.breakdown.rating * 100)}%
                    </span>
                  </div>
                )}
                {match.breakdown.workload !== undefined && (
                  <div className="flex flex-col items-center py-1">
                    <span className="text-slate-400 uppercase text-[8px] mb-0.5">
                      Workload
                    </span>
                    <span className="text-slate-700">
                      {Math.round(match.breakdown.workload * 100)}%
                    </span>
                  </div>
                )}
              </div>
            )}
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
