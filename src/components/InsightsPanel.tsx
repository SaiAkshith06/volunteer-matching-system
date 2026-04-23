import React from 'react';
import { BarChart3, Users, AlertTriangle, Activity } from 'lucide-react';

interface InsightsPanelProps {
  coverageRate: number;
  idleVolunteers: number;
  urgentNeedsPending: number;
  averageMatchScore: number;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({
  coverageRate,
  idleVolunteers,
  urgentNeedsPending,
  averageMatchScore,
}) => {
  const data = [
    { icon: BarChart3, value: `${coverageRate}%`, label: 'Need Coverage', bg: 'bg-[#e9f5f3]', text: 'text-[#2a9d8f]', barColor: 'from-[#2a9d8f] to-[#3ec4b3]', pct: coverageRate },
    { icon: Users, value: idleVolunteers, label: 'Idle Volunteers', bg: 'bg-[#f0f0f7]', text: 'text-[#6b7280]', barColor: 'from-gray-400 to-gray-300', pct: 50 },
    { icon: AlertTriangle, value: urgentNeedsPending, label: 'Urgent Pending', bg: 'bg-[#fef3f2]', text: 'text-[#e76f51]', barColor: 'from-[#e76f51] to-[#f4a261]', pct: Math.min(urgentNeedsPending * 20, 100) },
    { icon: Activity, value: `${averageMatchScore}%`, label: 'Match Accuracy', bg: 'bg-[#fef9f0]', text: 'text-[#f4a261]', barColor: 'from-[#f4a261] to-[#f4c792]', pct: averageMatchScore },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-800 tracking-tight mb-5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#e9f5f3] text-[#2a9d8f] flex items-center justify-center">
          <Activity size={14} />
        </div>
        System Insights
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="warm-card p-5">
              <div className={`w-12 h-12 rounded-full ${item.bg} ${item.text} flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{item.value}</p>
              <p className="text-[11px] font-medium text-gray-400 mt-0.5 uppercase tracking-wider">{item.label}</p>
              {/* Mini gradient progress bar */}
              <div className="h-1 w-full bg-gray-200/50 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.barColor} transition-all duration-700`}
                  style={{ width: `${Math.min(item.pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsPanel;
