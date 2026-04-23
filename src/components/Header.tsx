import React from 'react';
import { LayoutDashboard, Clock } from 'lucide-react';

const Header: React.FC = () => {
  const timestamp = new Date().toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-1 text-emerald-700">
          <LayoutDashboard size={20} />
          <span className="text-sm font-semibold uppercase tracking-wider">Administration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Smart Resource Allocation
        </h1>
        <p className="text-slate-500 mt-1">Volunteer Matching System Overview</p>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm self-start">
        <Clock className="text-slate-400" size={16} />
        <span className="text-xs font-medium text-slate-600">
          Last updated: <span className="text-slate-900">{timestamp}</span>
        </span>
      </div>
    </header>
  );
};

export default Header;
