import React from 'react';
import {
  Users,
  AlertTriangle,
  ClipboardCheck,
  BarChart3,
  Activity,
  MapPin,
  Clock,
  LayoutDashboard,
  Map as MapIcon,
} from 'lucide-react';

interface HeroDashboardProps {
  volunteerCount: number;
  activeNeedsCount: number;
  assignmentCount: number;
  coverageRate: number;
  averageMatchScore: number;
  viewMode: 'dashboard' | 'map';
  onViewModeChange: (mode: 'dashboard' | 'map') => void;
}

const HeroDashboard: React.FC<HeroDashboardProps> = ({
  volunteerCount,
  activeNeedsCount,
  assignmentCount,
  coverageRate,
  averageMatchScore,
  viewMode,
  onViewModeChange,
}) => {
  const timestamp = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="mb-8">
      {/* Hero Card */}
      <div className="warm-card !rounded-[28px] overflow-hidden mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">

          {/* LEFT: City Image (3 cols) */}
          <div className="lg:col-span-3 relative min-h-[320px] group overflow-hidden">
            <img
              src="/bangalore-skyline.png"
              alt="Bangalore cityscape"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

            <div className="relative z-10 flex flex-col justify-end h-full p-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#2a9d8f] animate-pulse" />
                <span className="text-[11px] font-bold text-[#2a9d8f] uppercase tracking-[0.2em]">
                  Live System
                </span>
              </div>
              <h1 className="text-3xl md:text-[42px] font-extrabold text-white tracking-tight leading-[1.05] mb-2">
                Smart Resource<br />Allocation
              </h1>
              <p className="text-[15px] text-white/60 max-w-md leading-relaxed">
                Real-time volunteer coordination powered by intelligent matching
              </p>

              <div className="flex items-center gap-3 mt-6">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-medium text-white/90">
                  <MapPin size={10} />
                  Bangalore, India
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-medium text-white/90">
                  <Clock size={10} />
                  {timestamp}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Stats Panel (2 cols) */}
          <div className="lg:col-span-2 bg-[#f8f4ec]/60 p-5 flex flex-col gap-3">

            {/* Top 3 stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Users size={18} />, value: volunteerCount, label: 'Volunteers', bg: 'bg-[#e9f5f3]', text: 'text-[#2a9d8f]' },
                { icon: <AlertTriangle size={18} />, value: activeNeedsCount, label: 'Active Needs', bg: 'bg-[#fef3f2]', text: 'text-[#e76f51]' },
                { icon: <ClipboardCheck size={18} />, value: assignmentCount, label: 'Assigned', bg: 'bg-[#f0fdf4]', text: 'text-[#2a9d8f]' },
              ].map((stat) => (
                <div key={stat.label} className="glass-stat p-4 text-center">
                  <div className={`w-10 h-10 mx-auto rounded-full ${stat.bg} ${stat.text} flex items-center justify-center mb-2`}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                  <p className="text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Coverage + Quality */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="glass-stat p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#e9f5f3] text-[#2a9d8f] flex items-center justify-center">
                    <BarChart3 size={18} />
                  </div>
                  <span className="text-[9px] font-bold text-[#2a9d8f] uppercase tracking-[0.15em] bg-[#e9f5f3] px-2.5 py-0.5 rounded-full">
                    Coverage
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{coverageRate}%</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Needs fulfilled</p>
                <div className="h-1.5 w-full bg-gray-200/60 rounded-full mt-3 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#2a9d8f] to-[#3ec4b3]" style={{ width: `${Math.min(coverageRate, 100)}%` }} />
                </div>
              </div>

              <div className="glass-stat p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#fef3f2] text-[#e76f51] flex items-center justify-center">
                    <Activity size={18} />
                  </div>
                  <span className="text-[9px] font-bold text-[#e76f51] uppercase tracking-[0.15em] bg-[#fef3f2] px-2.5 py-0.5 rounded-full">
                    Quality
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{averageMatchScore}%</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Match accuracy</p>
                <div className="h-1.5 w-full bg-gray-200/60 rounded-full mt-3 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#e76f51] to-[#f4a261]" style={{ width: `${Math.min(averageMatchScore, 100)}%` }} />
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-white/30 rounded-full p-1">
              <button
                onClick={() => onViewModeChange('dashboard')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  viewMode === 'dashboard'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </button>
              <button
                onClick={() => onViewModeChange('map')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  viewMode === 'map'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MapIcon size={14} />
                Map View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDashboard;
