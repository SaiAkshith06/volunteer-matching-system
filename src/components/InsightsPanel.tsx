import React from 'react';
import {
  BarChart3,
  Users,
  AlertTriangle,
  Activity,
} from 'lucide-react';

interface InsightsPanelProps {
  coverageRate: number;
  idleVolunteers: number;
  urgentNeedsPending: number;
  totalMatches: number;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({
  coverageRate,
  idleVolunteers,
  urgentNeedsPending,
  totalMatches,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
          <Activity size={18} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">System Insights</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Coverage Rate */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <BarChart3 size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">{coverageRate}%</p>
          <p className="text-[11px] font-medium text-emerald-600 mt-0.5">Need Coverage</p>
        </div>

        {/* Idle Volunteers */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-blue-700">{idleVolunteers}</p>
          <p className="text-[11px] font-medium text-blue-600 mt-0.5">Idle Volunteers</p>
        </div>

        {/* Urgent Needs Pending */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-2xl border border-rose-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-rose-700">{urgentNeedsPending}</p>
          <p className="text-[11px] font-medium text-rose-600 mt-0.5">Urgent Pending</p>
        </div>

        {/* Total Match Pairs */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-2xl border border-violet-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
              <Activity size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-violet-700">{totalMatches}</p>
          <p className="text-[11px] font-medium text-violet-600 mt-0.5">Match Pairs</p>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
