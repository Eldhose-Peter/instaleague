'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Filter,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { MatchStatus } from '@/types';

export default function AdminMatchesListPage() {
  const { matches, teams, tournaments } = useStore();

  const [selectedTourId, setSelectedTourId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | MatchStatus>('all');

  const teamsMap = new Map(teams.map((t) => [t.id, t]));
  const tournamentsMap = new Map(tournaments.map((t) => [t.id, t]));

  const filteredMatches = matches.filter((m) => {
    if (selectedTourId !== 'all' && m.tournament_id !== selectedTourId) return false;
    if (selectedStatus !== 'all' && m.status !== selectedStatus) return false;
    return true;
  });

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
            Referee & Match Commissioner Console
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Live Match Score Updater</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Input verified full-time scores, log goalscorers, assists, and disciplinary cards. Updates standings automatically.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="h-4 w-4 text-zinc-400" />
          <span className="font-semibold text-zinc-300">Tournament:</span>
          <select
            value={selectedTourId}
            onChange={(e) => setSelectedTourId(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="all">All Tournaments</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'scheduled', 'live', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                selectedStatus === status
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      <div className="space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center text-xs text-zinc-500">
            No matches found matching criteria.
          </div>
        ) : (
          filteredMatches.map((m) => {
            const home = teamsMap.get(m.home_team_id);
            const away = teamsMap.get(m.away_team_id);
            const tour = tournamentsMap.get(m.tournament_id);
            const isCompleted = m.status === 'completed';
            const isLive = m.status === 'live';

            return (
              <div
                key={m.id}
                className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="space-y-1.5 w-full sm:w-auto">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <span className="font-bold text-emerald-400">{tour?.name}</span>
                    <span>•</span>
                    <span className="rounded bg-zinc-800 px-1.5 py-0.2 font-semibold">
                      Round {m.round}
                    </span>
                    <span>•</span>
                    <span>{formatDate(m.scheduled_at)}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm sm:text-base font-bold text-white">
                    <span>{home?.crest_url} {home?.name}</span>
                    <span className="font-mono text-emerald-400 px-2 py-0.5 rounded bg-zinc-950 font-black">
                      {isCompleted || isLive ? `${m.home_score} - ${m.away_score}` : 'vs'}
                    </span>
                    <span>{away?.crest_url} {away?.name}</span>
                  </div>

                  <div className="text-[11px] text-zinc-500">
                    Pitch: {m.venue} • Referee: {m.referee || 'Assigned Official'}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      isLive
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                        : isCompleted
                        ? 'bg-zinc-800 text-zinc-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {m.status}
                  </span>

                  <Link
                    href={`/admin/matches/${m.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm"
                  >
                    Update Scores & Events
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
