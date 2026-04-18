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
} from 'lucide-react';

import { useState } from 'react';

function App() {
  const [matchSort, setMatchSort] = useState<'score' | 'urgency'>('score');
  const [matchFilter, setMatchFilter] = useState<'all' | 'high_urgency' | 'high_score'>('all');

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

  // ── Scenario loader callback ──────────────────────────────────────────────
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
    const hasSkillMatch = activeNeeds.some(n => n.requiredSkills.some(s => volunteer.skills.includes(s)));
    if (!hasSkillMatch) reasons.push('No required skills match current needs');
    
    // Use proper textLocationScore instead of naive string matching
    const hasLocationMatch = activeNeeds.some(n => textLocationScore(volunteer.location, n.location) > 0);
    if (!hasLocationMatch) reasons.push('Location mismatch with current needs');

    // If none of the above, just general mismatch
    if (reasons.length === 0) reasons.push('Availability or rating does not meet current thresholds');
    
    return reasons;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ─── Header ──────────────────────────────────────────────────────── */}
        <Header />

        {/* ─── Demo Controls ───────────────────────────────────────────────── */}
        <DemoControls
          onLoadScenario={loadScenario}
          onAutoAssign={handleAutoAssign}
          onReset={handleReset}
          matchCount={topMatches.length}
          isLoading={isLoading}
        />

        {/* ─── CSV Upload Strip ────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mr-auto">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles size={16} />
            </div>
            <span className="text-sm font-bold text-slate-700">
              Import Data
            </span>
          </div>
          <CsvUpload
            label="Upload Volunteers CSV"
            isLoading={isLoading}
            onFileSelect={handleVolunteerCsvUpload}
          />
          <CsvUpload
            label="Upload Needs CSV"
            isLoading={isLoading}
            onFileSelect={handleNeedsCsvUpload}
          />
          {assignments.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <Download size={16} />
              Export Assignments ({assignments.length})
            </button>
          )}
        </div>

        {/* ─── Dynamic Metric Cards ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard
            title="Total Volunteers"
            value={volunteers.length}
            icon={<Users size={20} />}
            color="blue"
          />
          <MetricCard
            title="Active Needs"
            value={activeNeeds.length}
            icon={<AlertTriangle size={20} />}
            color="rose"
          />
          <MetricCard
            title="Assignments Made"
            value={assignments.length}
            icon={<ClipboardCheck size={20} />}
            color="emerald"
          />
        </div>

        {/* ─── System Insights Panel ───────────────────────────────────────── */}
        <InsightsPanel
          coverageRate={coverageRate}
          idleVolunteers={idleVolunteerCount}
          urgentNeedsPending={urgentPendingCount}
          averageMatchScore={averageMatchScore}
        />

        {/* ─── Assignments Panel ───────────────────────────────────────────── */}
        <AssignmentsList assignments={assignments} onRecordOutcome={handleRecordOutcome} />

        {/* ─── Before vs After Comparison ──────────────────────────────────── */}
        <ComparisonPanel />

        {/* ─── Top Recommended Matches ─────────────────────────────────────── */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                <Target size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Top Recommended Matches
              </h2>
              <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {topMatches.length} match{topMatches.length !== 1 ? 'es' : ''}
              </span>
            </div>

            {/* Match Controls (Part 4.3) */}
            <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
              <select
                value={matchSort}
                onChange={(e) => setMatchSort(e.target.value as 'score' | 'urgency')}
                className="text-xs text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer w-24 pl-2"
              >
                <option value="score">Sort: Score</option>
                <option value="urgency">Sort: Urgency</option>
              </select>
              <div className="w-px h-4 bg-slate-200" />
              <select
                value={matchFilter}
                onChange={(e) => setMatchFilter(e.target.value as 'all' | 'high_urgency' | 'high_score')}
                className="text-xs text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer pl-2"
              >
                <option value="all">Filter: All</option>
                <option value="high_urgency">Filter: High Urgency</option>
                <option value="high_score">Filter: Score &gt; 80</option>
              </select>
            </div>
          </div>

          {topMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {topMatches
                .filter(m => matchFilter === 'all' || (matchFilter === 'high_urgency' && m.need.urgency === 'High') || (matchFilter === 'high_score' && m.score > 80))
                .sort((a, b) => matchSort === 'score' ? b.score - a.score : (b.need.urgency === 'High' ? 1 : -1) - (a.need.urgency === 'High' ? 1 : -1))
                .map((match, index) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onAssign={handleAssign}
                  isTopMatch={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100">
              <EmptyState
                icon={<Sparkles size={24} />}
                title="No Matches Yet"
                description="Upload volunteer and needs data or load a demo scenario to generate intelligent match recommendations."
              />
            </div>
          )}
        </section>

        {/* ─── Two-Column: Volunteers + Needs ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Volunteers */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Users size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Available Volunteers
              </h2>
              <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {volunteers.length} Active
              </span>
            </div>
            <div className="space-y-4">
              {volunteers.length > 0 ? (
                volunteers.map((v) => {
                  const isMatched = topMatches.some(m => m.volunteer.id === v.id);
                  const hasNoMatches = !isMatched && !v.activeTaskCount;
                  return (
                    <VolunteerCard 
                      key={v.id} 
                      volunteer={v} 
                      hasNoMatches={hasNoMatches}
                      unmatchedReasons={hasNoMatches ? getUnmatchedReasons(v) : []}
                    />
                  );
                })
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100">
                  <EmptyState
                    icon={<Users size={24} />}
                    title="No Volunteers"
                    description="All volunteers have been assigned. Upload more via CSV or wait for new registrations."
                  />
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Community Needs */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                <Heart size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Community Needs
              </h2>
              <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {activeNeeds.length} Pending
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {needs.length > 0 ? (
                needs.map((need) => <NeedCard key={need.id} need={need} />)
              ) : (
                <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100">
                  <EmptyState
                    icon={<Heart size={24} />}
                    title="No Needs"
                    description="Upload community needs via CSV to start matching with volunteers."
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ─── Toast Notifications ──────────────────────────────────────────── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* ─── Loading Overlay ──────────────────────────────────────────────── */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 border border-slate-100">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-700">
              Processing...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
