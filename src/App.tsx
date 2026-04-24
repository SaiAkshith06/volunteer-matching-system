import HeroDashboard from './components/HeroDashboard';
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
import MapView from './components/MapView';

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
  Sparkles,
} from 'lucide-react';

import { useState } from 'react';

function App() {
  const [matchSort, setMatchSort] = useState<'score' | 'urgency' | 'skills'>('score');
  const [matchFilter, setMatchFilter] = useState<'all' | 'high_urgency' | 'high_score'>('all');

  const [viewMode, setViewMode] = useState<'dashboard' | 'map'>('dashboard');

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
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Glass Shell Container */}
      <div className="glass-shell max-w-7xl mx-auto p-6 md:p-8">

        <HeroDashboard
          volunteerCount={volunteers.length}
          activeNeedsCount={activeNeeds.length}
          assignmentCount={assignments.length}
          coverageRate={coverageRate}
          averageMatchScore={averageMatchScore}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {viewMode === 'map' ? (
          <div className="warm-card !p-0 overflow-hidden">
            <MapView
              volunteers={volunteers}
              needs={needs}
              assignments={assignments}
            />
          </div>
        ) : (
          <>
            <DemoControls
              onLoadScenario={loadScenario}
              onAutoAssign={handleAutoAssign}
              onReset={handleReset}
              matchCount={topMatches.length}
              isLoading={isLoading}
            />

            {/* Import Data Bar */}
            <div className="warm-card flex flex-wrap items-center gap-4 mb-8 p-5">
              <div className="flex items-center gap-2 mr-auto">
                <Sparkles size={16} className="text-[#e76f51]" />
                <span className="text-sm font-semibold text-gray-600">
                  Import Data
                </span>
              </div>

              <CsvUpload label="Upload Volunteers CSV" isLoading={isLoading} onFileSelect={handleVolunteerCsvUpload} />
              <CsvUpload label="Upload Needs CSV" isLoading={isLoading} onFileSelect={handleNeedsCsvUpload} />

              {assignments.length > 0 && (
                <button onClick={handleExport} className="btn-coral">
                  Export ({assignments.length})
                </button>
              )}
            </div>

            <InsightsPanel
              coverageRate={coverageRate}
              idleVolunteers={idleVolunteerCount}
              urgentNeedsPending={urgentPendingCount}
              averageMatchScore={averageMatchScore}
            />

            <div className="max-h-64 overflow-y-auto mb-8 rounded-lg border border-gray-100 shadow-sm">
              <AssignmentsList assignments={assignments} onRecordOutcome={handleRecordOutcome} />
            </div>

            <ComparisonPanel />

            {/* Matches + Volunteers + Needs */}
            {topMatches.length > 0 && (() => {
              let processedMatches = [...topMatches];
              
              if (matchFilter === 'high_urgency') {
                processedMatches = processedMatches.filter(m => m.need.urgency === 'High');
              } else if (matchFilter === 'high_score') {
                processedMatches = processedMatches.filter(m => m.score > 80);
              }

              processedMatches.sort((a, b) => {
                if (matchSort === 'score') return b.score - a.score;
                if (matchSort === 'skills') return b.breakdown.skills - a.breakdown.skills;
                if (matchSort === 'urgency') {
                  const uMap = { High: 3, Medium: 2, Low: 1 };
                  const uA = uMap[a.need.urgency] || 0;
                  const uB = uMap[b.need.urgency] || 0;
                  return uB - uA;
                }
                return 0;
              });

              return (
                <div className="mb-10">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-5 gap-4">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                      Top Matches
                    </h2>
                    <div className="flex gap-4">
                      <select 
                        className="bg-white/70 border border-white/40 text-gray-700 text-sm py-1.5 px-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                        value={matchSort}
                        onChange={e => setMatchSort(e.target.value as any)}
                      >
                        <option value="score">Sort: Score</option>
                        <option value="urgency">Sort: Urgency</option>
                        <option value="skills">Sort: Skills</option>
                      </select>
                      <select 
                        className="bg-white/70 border border-white/40 text-gray-700 text-sm py-1.5 px-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                        value={matchFilter}
                        onChange={e => setMatchFilter(e.target.value as any)}
                      >
                        <option value="all">Filter: All</option>
                        <option value="high_urgency">Filter: High Urgency</option>
                        <option value="high_score">Filter: High Score (>80)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {processedMatches.slice(0, 12).map((match, i) => (
                      <MatchCard
                        key={`${match.volunteer.id}-${match.need.id}`}
                        match={match}
                        onAssign={handleAssign}
                        isTopMatch={i === 0}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Volunteers */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 tracking-tight mb-5">
                  Volunteers ({volunteers.length})
                </h2>
                {volunteers.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {volunteers.map((v) => {
                      const hasMatches = topMatches.some(m => m.volunteer.id === v.id);
                      return (
                        <VolunteerCard
                          key={v.id}
                          volunteer={v}
                          hasNoMatches={!hasMatches}
                          unmatchedReasons={!hasMatches ? getUnmatchedReasons(v) : []}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState title="No Volunteers" description="Upload a CSV or load a demo scenario" />
                )}
              </div>

              {/* Needs */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 tracking-tight mb-5">
                  Community Needs ({needs.length})
                </h2>
                {needs.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {needs.map((n) => (
                      <NeedCard key={n.id} need={n} />
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No Needs" description="Upload a CSV or load a demo scenario" />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
          <div className="glass-stat px-10 py-6 text-center">
            <div className="w-8 h-8 mx-auto mb-3 border-3 border-gray-200 border-t-[#2a9d8f] rounded-full animate-spin" />
            <p className="text-sm font-semibold text-gray-600">Processing…</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;