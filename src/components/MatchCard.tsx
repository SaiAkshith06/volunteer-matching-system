import React from 'react';
import type { Match, Urgency } from '../types';
import {
  Target,
  Zap,
  ChevronRight,
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
import { ScoreBreakdown } from './ScoreBreakdown';

interface MatchCardProps {
  match: Match;
  onAssign: (match: Match) => void;
  isTopMatch?: boolean;
}

const urgencyColors: Record<Urgency, string> = {
  High: 'text-[#e76f51] bg-[#fef3f2]',
  Medium: 'text-[#f4a261] bg-[#fef9f0]',
  Low: 'text-[#2a9d8f] bg-[#e9f5f3]',
};

function getScoreGradient(score: number): string {
  if (score >= 90) return 'from-[#2a9d8f] to-[#3ec4b3]';
  if (score >= 75) return 'from-[#2a9d8f] to-[#4aaf9e]';
  if (score >= 60) return 'from-[#f4a261] to-[#f4c792]';
  return 'from-gray-400 to-gray-300';
}

function getConfidenceBadge(conf: 'High' | 'Medium' | 'Low'): string {
  switch (conf) {
    case 'High': return 'bg-[#e9f5f3] text-[#2a9d8f]';
    case 'Medium': return 'bg-[#fef9f0] text-[#f4a261]';
    default: return 'bg-gray-100 text-gray-500';
  }
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onAssign, isTopMatch = false }) => {
  const [showBreakdown, setShowBreakdown] = React.useState(false);

  if (!match?.volunteer || !match?.need) return null;

  const breakdown = match.breakdown || { skills: 0, location: 0, availability: 0, urgency: 0, rating: 0, workload: 0 };
  const confidence = getConfidence(match.score);
  const confidenceColor = getConfidenceColor(match.score);
  const label = getMatchLabel(match.score);
  const reasons = generateMatchReasons(breakdown);

  // Circular score indicator
  const circumference = 2 * Math.PI * 22;
  const offset = circumference - (match.score / 100) * circumference;

  return (
    <div
      className={`warm-card group relative overflow-hidden hover:-translate-y-1 ${
        isTopMatch ? 'ring-2 ring-[#2a9d8f]/20' : ''
      }`}
    >
      {isTopMatch && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2a9d8f] to-[#3ec4b3]" />
      )}

      {/* Score + Confidence (top-right) */}
      <div className="absolute top-5 right-5 flex flex-col items-end gap-2">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${getConfidenceBadge(confidence)}`}>
          <Shield size={8} />
          {confidence}
        </span>
        {/* Circular score */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="none" stroke="#e8dfcf" strokeWidth="3" />
            <circle
              cx="24" cy="24" r="22"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className={`transition-all duration-700`}
              style={{
                stroke: match.score >= 75 ? '#2a9d8f' : match.score >= 60 ? '#f4a261' : '#9ca3af',
                strokeDasharray: circumference,
                strokeDashoffset: offset,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-gray-900">{match.score}%</span>
          </div>
        </div>
      </div>

      <div className="p-6 pr-24">
        {/* Label */}
        <div className="flex items-center gap-1.5 mb-3">
          <Star size={12} className="text-[#f4a261]" fill="currentColor" />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: confidenceColor }}>
            {label}
          </span>
        </div>

        {/* Volunteer */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#e9f5f3] flex items-center justify-center text-[#2a9d8f] font-bold text-sm">
            {match.volunteer.avatar}
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">{match.volunteer.name}</h4>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {match.volunteer.skills.map((skill) => (
                <span key={skill} className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#e9f5f3] text-[#2a9d8f]">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 text-gray-300">
          <ChevronRight size={14} />
          <div className="flex-1 h-px bg-[#e8dfcf]" />
        </div>

        {/* Need */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#fef3f2] flex items-center justify-center text-[#e76f51] shrink-0">
            <Target size={18} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm leading-tight">{match.need.title}</h4>
            <span className={`inline-flex items-center gap-0.5 mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${urgencyColors[match.need.urgency]}`}>
              <Zap size={8} />
              {match.need.urgency}
            </span>
          </div>
        </div>

        {reasons.length > 0 && (
          <div className="space-y-1.5 mb-4">
            {reasons.slice(0, 4).map((reason, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <CheckCircle2 size={12} className="text-[#2a9d8f] shrink-0" />
                <span className="font-medium">{reason}</span>
              </div>
            ))}
          </div>
        )}

        {match.breakdown && (
          <ScoreBreakdown breakdown={match.breakdown} show={showBreakdown} onToggle={() => setShowBreakdown(!showBreakdown)} />
        )}

        <button onClick={() => onAssign(match)} className="btn-teal w-full">
          Assign Match
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
