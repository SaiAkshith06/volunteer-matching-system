import React from 'react';
import { TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string; // tailwind color class like 'emerald' | 'rose' | 'teal'
}

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    iconBg: 'bg-emerald-100',
  },
  teal: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    iconBg: 'bg-teal-100',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    iconBg: 'bg-rose-100',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    iconBg: 'bg-amber-100',
  },
  slate: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    iconBg: 'bg-slate-100',
  },
  // Legacy aliases for backward compatibility
  blue: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    iconBg: 'bg-emerald-100',
  },
  violet: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    iconBg: 'bg-teal-100',
  },
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  const colors = colorMap[color] || colorMap.emerald;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl ${colors.iconBg} ${colors.text} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
        >
          {icon}
        </div>
        <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingUp size={12} />
          <span>Live</span>
        </div>
      </div>
      <h3 className="text-3xl font-extrabold text-slate-900 mb-1">
        {value.toLocaleString()}
      </h3>
      <p className="text-sm font-medium text-slate-500">{title}</p>
    </div>
  );
};

export default MetricCard;
