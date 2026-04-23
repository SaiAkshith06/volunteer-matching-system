import React from 'react';
import { Clock, Cpu, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';

const ComparisonPanel: React.FC = () => {
  return (
    <div className="mb-10">
      <div className="warm-card overflow-hidden !p-0">
        {/* Header */}
        <div className="px-7 py-5" style={{ background: 'linear-gradient(135deg, #2a9d8f, #21867a)' }}>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
            <TrendingUp size={16} />
            Why Smart Matching?
          </h3>
          <p className="text-[11px] text-white/60 mt-0.5">
            AI-powered system vs manual volunteer coordination
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#e8dfcf]/50">
          {/* Manual */}
          <div className="p-7">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full mb-5 inline-block">
              Manual Process
            </span>
            <ul className="space-y-4">
              {[
                { icon: Clock, title: '3–4 hours per cycle', desc: 'Reviewing spreadsheets row by row' },
                { icon: ShieldCheck, title: 'Error-prone matching', desc: 'Skills often overlooked' },
                { icon: TrendingUp, title: 'Low coverage (~40%)', desc: 'Many needs go unfilled' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <item.icon size={14} className="text-gray-300 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-700">{item.title}</p>
                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Smart */}
          <div className="p-7 bg-[#e9f5f3]/20">
            <span className="text-xs font-bold text-[#2a9d8f] uppercase tracking-wider bg-[#e9f5f3] px-3 py-1 rounded-full mb-5 inline-block">
              Smart System
            </span>
            <ul className="space-y-4">
              {[
                { icon: Cpu, title: 'Under 5 seconds', desc: '6-factor scoring in real time' },
                { icon: ShieldCheck, title: 'Data-driven decisions', desc: 'Explainable confidence scores' },
                { icon: TrendingUp, title: '85%+ coverage', desc: 'Auto-assign fills critical gaps' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <item.icon size={14} className="text-[#2a9d8f] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-700">{item.title}</p>
                    <p className="text-[10px] text-[#2a9d8f]">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-7 py-3.5 bg-[#e9f5f3]/30 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#2a9d8f]">
          <span className="text-gray-500">Manual coordination</span>
          <ArrowRight size={12} />
          <span className="font-bold">Intelligent automation</span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPanel;
