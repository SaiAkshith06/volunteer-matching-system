import Header from './components/Header';
import MetricCard from './components/MetricCard';
import VolunteerCard from './components/VolunteerCard';
import NeedCard from './components/NeedCard';
import MatchCard from './components/MatchCard';
import CsvUpload from './components/CsvUpload';
import EmptyState from './components/EmptyState';
import ToastContainer from './components/ToastContainer';
import InsightsPanel from './components/InsightsPanel';
import DemoControls from './components/DemoControls';
import ComparisonPanel from './components/ComparisonPanel';
import AssignmentsList from './components/AssignmentsList';
import MapView from './components/MapView'; // ✅ ADDED

import { useVolunteerMatch } from './hooks/useVolunteerMatch';
import { mockVolunteers, mockNeeds } from './data/mockData';
import { textLocationScore } from './services/distanceService';

import {
  floodVolunteers,
  floodNeeds,
  educationVolunteers,
  educationNeeds,
  medicalVolunteers,
  medicalNeeds,
} from './data/demoScenarios';

import {
  Users,
  Heart,
  Sparkles,
  Download,
  ClipboardCheck,
  AlertTriangle,
  Target,
  Map as MapIcon, // ✅ icon
  LayoutDashboard // ✅ icon
} from 'lucide-react';

import { useState } from 'react';

function App() {
  const [matchSort, setMatchSort] = useState<'score' | 'urgency' | 'skills'>('score');
  const [matchFilter, setMatchFilter] = useState<'all' | 'high_urgency' | 'high_score'>('all');

  const [viewMode, setViewMode] = useState<'dashboard' | 'map'>('dashboard'); // ✅ ADDED

  const {
    volunteers,
    needs,
    assignments,
    topMatches,
    isLoading,
    toasts,
    coverageRate,
    idleVolunteerCount,
    urgentPendingCount,
    averageMatchScore,
    handleVolunteerCsvUpload,
    handleNeedsCsvUpload,
    handleAssign,
    handleAutoAssign,
    handleExport,
    handleLoadScenario,
    handleReset,
    handleRecordOutcome,
    dismissToast,
  } = useVolunteerMatch(mockVolunteers, mockNeeds);

  const activeNeeds = needs.filter((n) => !n.isAssigned);

  const loadScenario = (scenario: 'flood' | 'education' | 'medical') => {
    switch (scenario) {
      case 'flood':
        handleLoadScenario(floodVolunteers, floodNeeds);
        break;
      case 'education':
        handleLoadScenario(educationVolunteers, educationNeeds);
        break;
      case 'medical':
        handleLoadScenario(medicalVolunteers, medicalNeeds);
        break;
    }
  };

  const getUnmatchedReasons = (volunteer: typeof volunteers[0]) => {
    if (activeNeeds.length === 0) return ['No active needs in the system'];

    const reasons: string[] = [];

    const hasSkillMatch = activeNeeds.some(n =>
      n.requiredSkills.some(s => volunteer.skills.includes(s))
    );
    if (!hasSkillMatch) reasons.push('No required skills match current needs');

    const hasLocationMatch = activeNeeds.some(n =>
      textLocationScore(volunteer.location, n.location) > 0.3
    );
    if (!hasLocationMatch) reasons.push('Location mismatch with current needs');

    if (reasons.length === 0)
      reasons.push('Availability or rating does not meet current thresholds');

    return reasons;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <Header />

        {/* ✅ VIEW TOGGLE */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${viewMode === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-white border text-slate-600'
              }`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${viewMode === 'map'
                ? 'bg-blue-600 text-white'
                : 'bg-white border text-slate-600'
              }`}
          >
            <MapIcon size={16} />
            Map View
          </button>
        </div>

        {/* ✅ MAP VIEW */}
        {viewMode === 'map' ? (
          <MapView
            volunteers={volunteers}
            needs={needs}
            assignments={assignments}
          />
        ) : (
          <>
            <DemoControls
              onLoadScenario={loadScenario}
              onAutoAssign={handleAutoAssign}
              onReset={handleReset}
              matchCount={topMatches.length}
              isLoading={isLoading}
            />

            <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white/70 rounded-2xl border shadow-sm">
              <div className="flex items-center gap-2 mr-auto">
                <Sparkles size={16} />
                <span className="text-sm font-bold text-slate-700">
                  Import Data
                </span>
              </div>

              <CsvUpload label="Upload Volunteers CSV" isLoading={isLoading} onFileSelect={handleVolunteerCsvUpload} />
              <CsvUpload label="Upload Needs CSV" isLoading={isLoading} onFileSelect={handleNeedsCsvUpload} />

              {assignments.length > 0 && (
                <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-lg">
                  Export ({assignments.length})
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <MetricCard title="Total Volunteers" value={volunteers.length} icon={<Users />} color="blue" />
              <MetricCard title="Active Needs" value={activeNeeds.length} icon={<AlertTriangle />} color="rose" />
              <MetricCard title="Assignments Made" value={assignments.length} icon={<ClipboardCheck />} color="emerald" />
            </div>

            <InsightsPanel
              coverageRate={coverageRate}
              idleVolunteers={idleVolunteerCount}
              urgentNeedsPending={urgentPendingCount}
              averageMatchScore={averageMatchScore}
            />

            <AssignmentsList assignments={assignments} onRecordOutcome={handleRecordOutcome} />

            <ComparisonPanel />
          </>
        )}
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow">
            Processing...
          </div>
        </div>
      )}
    </div>
  );
}

export default App;