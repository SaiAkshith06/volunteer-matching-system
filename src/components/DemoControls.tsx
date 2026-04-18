import React from 'react';
import {
  Droplets,
  GraduationCap,
  Stethoscope,
  Sparkles,
  Zap,
  RotateCcw,
} from 'lucide-react';

interface DemoControlsProps {
  onLoadScenario: (scenario: 'flood' | 'education' | 'medical') => void;
  onAutoAssign: () => void;
  onReset: () => void;
  matchCount: number;
  isLoading: boolean;
}

const DemoControls: React.FC<DemoControlsProps> = ({
  onLoadScenario,
  onAutoAssign,
  onReset,
  matchCount,
  isLoading,
}) => {
  return (
    <div className="mb-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-yellow-400/20 flex items-center justify-center">
          <Sparkles size={16} className="text-yellow-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Demo Scenarios</h3>
          <p className="text-[10px] text-slate-400">
            Load pre-built scenarios to showcase the matching engine
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Scenario Buttons */}
        <button
          onClick={() => onLoadScenario('flood')}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50"
        >
          <Droplets size={14} />
          Flood Relief
        </button>
        <button
          onClick={() => onLoadScenario('education')}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50"
        >
          <GraduationCap size={14} />
          Education Outreach
        </button>
        <button
          onClick={() => onLoadScenario('medical')}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50"
        >
          <Stethoscope size={14} />
          Medical Emergency
        </button>

        {/* Divider */}
        <div className="hidden md:block w-px h-9 bg-slate-600 self-center" />

        {/* Auto-Assign */}
        <button
          onClick={onAutoAssign}
          disabled={isLoading || matchCount === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <Zap size={14} className="relative z-10 group-hover:scale-110 transition-transform" />
          <span className="relative z-10">Auto Assign Optimal Matches</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>
  );
};

export default DemoControls;
