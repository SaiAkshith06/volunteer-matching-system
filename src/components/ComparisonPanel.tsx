import React from 'react';
import { Clock, Cpu, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';

const ComparisonPanel: React.FC = () => {
  return (
    <div className="mb-10">
      <div className="warm-card !p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e9f5f3] to-white shadow-sm flex items-center justify-center text-[#2a9d8f] border border-[#2a9d8f]/20">
              <TrendingUp size={22} className="opacity-90" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                Why Smart Matching?
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                AI-powered system vs manual volunteer coordination
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Connecting Arrow (Desktop) */}
          <div className="hidden md:flex absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-slate-100 items-center justify-center text-[#2a9d8f] z-10 transition-transform hover:scale-110">
            <ArrowRight size={16} />
          </div>

          {/* Manual Process Box */}
          <div className="p-6 rounded-2xl bg-white/40 border border-slate-200/60 relative overflow-hidden transition-all hover:bg-white/60">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50"></div>
            
            <div className="flex items-center gap-2 mb-6 relative">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg shadow-sm border border-slate-200/50">
                Manual Process
              </span>
            </div>

            <ul className="space-y-5 relative cursor-default">
              {[
                { icon: Clock, title: '3–4 hours per cycle', desc: 'Reviewing spreadsheets row by row' },
                { icon: ShieldCheck, title: 'Error-prone matching', desc: 'Skills often overlooked' },
                { icon: TrendingUp, title: 'Low coverage (~40%)', desc: 'Many needs go unfilled' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/50 transition-colors group-hover:bg-slate-200 group-hover:border-slate-300 transition-all duration-300">
                    <item.icon size={14} className="text-slate-400" />
                  </div>
                  <div className="mt-0.5">
                    <p className="text-sm font-semibold text-slate-700">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Smart System Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#e9f5f3]/80 to-white border border-[#2a9d8f]/20 shadow-[0_4px_20px_rgba(42,157,143,0.06)] relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(42,157,143,0.12)] hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2a9d8f]/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#e76f51]/5 rounded-full blur-2xl -ml-10 -mb-10"></div>
            
            <div className="flex items-center gap-2 mb-6 relative">
              <span className="text-[10px] font-bold text-[#2a9d8f] uppercase tracking-wider bg-white px-3 py-1.5 rounded-lg shadow-sm border border-[#2a9d8f]/15 relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full animate-shimmer"></span>
                Smart System
              </span>
              <div className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#2a9d8f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2a9d8f]"></span>
              </div>
            </div>

            <ul className="space-y-5 relative cursor-default">
              {[
                { icon: Cpu, title: 'Under 5 seconds', desc: '6-factor scoring in real time' },
                { icon: ShieldCheck, title: 'Data-driven decisions', desc: 'Explainable confidence scores' },
                { icon: TrendingUp, title: '85%+ coverage', desc: 'Auto-assign fills critical gaps' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#2a9d8f]/20 shadow-[0_2px_8px_rgba(42,157,143,0.08)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_4px_12px_rgba(42,157,143,0.15)] group-hover:border-[#2a9d8f]/40">
                    <item.icon size={14} className="text-[#2a9d8f]" />
                  </div>
                  <div className="mt-0.5">
                    <p className="text-sm font-bold text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-[#2a9d8f] font-medium mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPanel;
