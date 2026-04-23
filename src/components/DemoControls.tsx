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
    <div className="warm-card mb-8 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-[#fef3f2] text-[#e76f51] flex items-center justify-center">
          <Sparkles size={16} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-800 tracking-tight">Demo Scenarios</h3>
          <p className="text-[11px] text-gray-400">
            Load pre-built scenarios to showcase the matching engine
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onLoadScenario('flood')}
          disabled={isLoading}
          className="btn-soft flex items-center gap-2 disabled:opacity-50"
        >
          <Droplets size={14} />
          Flood Relief
        </button>
        <button
          onClick={() => onLoadScenario('education')}
          disabled={isLoading}
          className="btn-soft flex items-center gap-2 disabled:opacity-50"
        >
          <GraduationCap size={14} />
          Education Outreach
        </button>
        <button
          onClick={() => onLoadScenario('medical')}
          disabled={isLoading}
          className="btn-soft flex items-center gap-2 disabled:opacity-50"
        >
          <Stethoscope size={14} />
          Medical Emergency
        </button>

        <div className="hidden md:block w-px h-8 bg-[#e8dfcf] self-center mx-1" />

        <button
          onClick={onAutoAssign}
          disabled={isLoading || matchCount === 0}
          className="btn-teal flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap size={14} />
          Auto Assign Optimal
        </button>

        <button
          onClick={onReset}
          disabled={isLoading}
          className="btn-soft flex items-center gap-2 disabled:opacity-50"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>
  );
};

export default DemoControls;
