'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ChevronRight, Activity } from 'lucide-react';
import { Match, Team } from '@/types';
import { formatDate, formatTime } from '@/lib/utils';

interface FixturesListProps {
  matches: Match[];
  teams: Team[];
  isOrganizer?: boolean;
}

export function FixturesList({ matches, teams, isOrganizer }: FixturesListProps) {
  const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'live'>('all');

  const teamsMap = new Map(teams.map((t) => [t.id, t]));

  // Get unique rounds
  const rounds = Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);

  // Filter matches
  const filteredMatches = matches.filter((match) => {
    if (selectedRound !== 'all' && match.round !== selectedRound) return false;
    if (statusFilter !== 'all' && match.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedRound('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedRound === 'all'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            All Rounds
          </button>
          {rounds.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRound(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedRound === r
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Round {r}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1">
          {(['all', 'scheduled', 'live', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-zinc-700 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Match Cards */}
      {filteredMatches.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-zinc-400">
          <p className="text-sm font-medium">No matches found for the selected filters.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredMatches.map((match) => {
            const home = teamsMap.get(match.home_team_id);
            const away = teamsMap.get(match.away_team_id);
            const isCompleted = match.status === 'completed';
            const isLive = match.status === 'live';

            return (
              <div
                key={match.id}
                className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-800/50"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Match Metadata: Round, Date, Venue */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 w-full sm:w-auto">
                    <span className="rounded-md bg-zinc-800 px-2 py-0.5 font-bold text-zinc-300">
                      R{match.round}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                      {formatDate(match.scheduled_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-zinc-500" />
                      {formatTime(match.scheduled_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                      {match.venue}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isLive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[11px] font-bold text-rose-400 border border-rose-500/30 animate-pulse">
                        <Activity className="h-3 w-3" /> LIVE
                      </span>
                    )}
                    {isCompleted && (
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-semibold text-zinc-400">
                        Full Time
                      </span>
                    )}
                    {match.status === 'scheduled' && (
                      <span className="rounded-full bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>

                {/* Scoreboard line */}
                <div className="mt-3 grid grid-cols-7 items-center gap-2 py-2">
                  {/* Home Team */}
                  <div className="col-span-3 flex items-center justify-end gap-2 text-right">
                    <Link
                      href={`/teams/${match.home_team_id}`}
                      className="text-sm sm:text-base font-semibold text-white hover:text-emerald-400 transition-colors truncate"
                    >
                      {home?.name || 'Home Team'}
                    </Link>
                    <span className="text-2xl flex-shrink-0">{home?.crest_url || '⚽'}</span>
                  </div>

                  {/* Score or VS */}
                  <div className="col-span-1 flex flex-col items-center justify-center">
                    {isCompleted || isLive ? (
                      <div className="flex items-center gap-2 rounded-lg bg-zinc-950/80 px-3 py-1 border border-zinc-800 font-mono text-lg font-black text-white">
                        <span>{match.home_score}</span>
                        <span className="text-zinc-500">-</span>
                        <span>{match.away_score}</span>
                      </div>
                    ) : (
                      <div className="rounded-md bg-zinc-800/80 px-2.5 py-1 text-xs font-bold text-zinc-400">
                        VS
                      </div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="col-span-3 flex items-center justify-start gap-2">
                    <span className="text-2xl flex-shrink-0">{away?.crest_url || '⚽'}</span>
                    <Link
                      href={`/teams/${match.away_team_id}`}
                      className="text-sm sm:text-base font-semibold text-white hover:text-emerald-400 transition-colors truncate"
                    >
                      {away?.name || 'Away Team'}
                    </Link>
                  </div>
                </div>

                {/* Footer Action Links */}
                <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                  <span className="truncate max-w-[200px] sm:max-w-md text-[11px] text-zinc-500 italic">
                    {match.notes || `Referee: ${match.referee || 'Instaleague Official'}`}
                  </span>
                  <div className="flex items-center gap-2">
                    {isOrganizer && (
                      <Link
                        href={`/admin/matches/${match.id}`}
                        className="text-xs text-emerald-400 hover:underline font-semibold"
                      >
                        Update Score / Events →
                      </Link>
                    )}
                    <Link
                      href={`/matches/${match.id}`}
                      className="inline-flex items-center gap-1 font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Match Center <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
