'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Settings,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDate, formatTime } from '@/lib/utils';

export default function AdminFixturesPage() {
  const {
    tournaments,
    teams,
    registrations,
    matches,
    generateFixturesForTournament,
  } = useStore();

  const [selectedTourId, setSelectedTourId] = useState<string>(
    tournaments[0]?.id || ''
  );
  const [startDate, setStartDate] = useState('2026-12-01');
  const [daysBetweenRounds, setDaysBetweenRounds] = useState(7);
  const [venuesStr, setVenuesStr] = useState('Pitch 1 (Grandstand), Pitch 2 (Floodlit)');
  const [kickoffTimesStr, setKickoffTimesStr] = useState('14:00, 16:30, 19:00');
  const [successMessage, setSuccessMessage] = useState('');

  const tournament = tournaments.find((t) => t.id === selectedTourId);

  // Participating approved teams
  const approvedTeamIds = registrations
    .filter((r) => r.tournament_id === selectedTourId && r.status === 'approved')
    .map((r) => r.team_id);

  const participatingTeams = teams.filter((t) => approvedTeamIds.includes(t.id));

  // Current existing tournament matches
  const currentMatches = matches.filter((m) => m.tournament_id === selectedTourId);
  const teamsMap = new Map(teams.map((t) => [t.id, t]));

  const handleGenerate = () => {
    setSuccessMessage('');
    if (participatingTeams.length < 2) {
      alert('You need at least 2 approved teams in this tournament to generate fixtures.');
      return;
    }

    const venues = venuesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const kickoffTimes = kickoffTimesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    generateFixturesForTournament(selectedTourId, {
      startDate,
      daysBetweenRounds: Number(daysBetweenRounds),
      venues: venues.length > 0 ? venues : ['Main Pitch'],
      kickoffTimes: kickoffTimes.length > 0 ? kickoffTimes : ['15:00'],
    });

    setSuccessMessage(
      `Generated & published official matches across rounds!`
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Algorithmic Scheduler
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Fixture Generator</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Automate round-robin or knockout tournament scheduling with mathematically balanced home/away pairings and venue allocation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-5 h-fit shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Settings className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Generator Configuration</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Select Tournament
            </label>
            <select
              value={selectedTourId}
              onChange={(e) => {
                setSelectedTourId(e.target.value);
                setSuccessMessage('');
              }}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.format})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 text-xs text-zinc-400 space-y-1">
            <div className="flex justify-between">
              <span>Approved Clubs:</span>
              <strong className="text-emerald-400">{participatingTeams.length} Teams</strong>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <strong className="text-zinc-200 uppercase">{tournament?.format}</strong>
            </div>
          </div>

          {participatingTeams.length < 2 && (
            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-950/30 text-amber-300 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>
                Need at least 2 approved teams. Head to <Link href="/admin/applications" className="underline font-bold">Applications</Link> to approve teams first.
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Opening Kickoff Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Days Between Matchdays
            </label>
            <input
              type="number"
              min={1}
              max={14}
              value={daysBetweenRounds}
              onChange={(e) => setDaysBetweenRounds(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Pitches / Venues (comma-separated)
            </label>
            <input
              type="text"
              value={venuesStr}
              onChange={(e) => setVenuesStr(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Kickoff Slots (comma-separated times)
            </label>
            <input
              type="text"
              value={kickoffTimesStr}
              onChange={(e) => setKickoffTimesStr(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={participatingTeams.length < 2}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 font-bold text-xs text-zinc-950 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="h-4 w-4" />
            Generate & Publish Fixtures
          </button>

          {successMessage && (
            <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Existing / Generated Matches List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-400" />
              Tournament Schedule ({currentMatches.length} Fixtures)
            </h3>
            {tournament && (
              <Link
                href={`/tournaments/${tournament.id}?tab=fixtures`}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                View on Public Hub →
              </Link>
            )}
          </div>

          {currentMatches.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center text-xs text-zinc-500">
              No matches generated for this tournament yet. Configure settings on the left and click &quot;Generate &amp; Publish Fixtures&quot;.
            </div>
          ) : (
            <div className="space-y-2.5">
              {currentMatches.map((m) => {
                const home = teamsMap.get(m.home_team_id);
                const away = teamsMap.get(m.away_team_id);
                const isCompleted = m.status === 'completed';

                return (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-zinc-800 px-2 py-1 font-mono font-bold text-zinc-300">
                        R{m.round}
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 font-bold text-white">
                          <span>{home?.crest_url} {home?.name}</span>
                          <span className="font-mono text-emerald-400 px-1 rounded bg-zinc-950">
                            {isCompleted ? `${m.home_score} - ${m.away_score}` : 'vs'}
                          </span>
                          <span>{away?.crest_url} {away?.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(m.scheduled_at)} at {formatTime(m.scheduled_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {m.venue}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/admin/matches/${m.id}`}
                      className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 font-semibold text-xs hover:bg-emerald-950/80 transition-colors"
                    >
                      Score / Events →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
