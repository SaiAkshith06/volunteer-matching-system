import React from 'react';
import { Clock, Cpu, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';

const ComparisonPanel: React.FC = () => {
  return (
    <div className="mb-10">
      <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-2xl border border-indigo-100 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp size={16} />
            Why Smart Matching?
          </h3>
          <p className="text-[11px] text-indigo-200 mt-0.5">
            See how our AI-powered system compares to manual volunteer coordination
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-indigo-100">
          {/* Manual Side */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                Manual Process
              </span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Clock size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-700">3–4 hours per cycle</p>
                  <p className="text-[10px] text-slate-400">Reviewing spreadsheets row by row</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-700">Error-prone matching</p>
                  <p className="text-[10px] text-slate-400">Skills often overlooked or mismapped</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <TrendingUp size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-700">Low coverage (~40%)</p>
                  <p className="text-[10px] text-slate-400">Many needs go unfilled</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Smart System Side */}
          <div className="p-6 bg-white/50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                Smart System
              </span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Cpu size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-700">Under 5 seconds</p>
                  <p className="text-[10px] text-emerald-600">6-factor scoring in real time</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-700">Data-driven decisions</p>
                  <p className="text-[10px] text-emerald-600">Explainable confidence scores</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <TrendingUp size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-700">85%+ coverage</p>
                  <p className="text-[10px] text-emerald-600">Auto-assign fills critical gaps</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-6 py-3 bg-indigo-50 flex items-center justify-center gap-2 text-[11px] font-semibold text-indigo-600">
          <span>Manual coordination</span>
          <ArrowRight size={12} />
          <span className="text-indigo-800">Intelligent automation</span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPanel;
