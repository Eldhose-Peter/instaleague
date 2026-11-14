'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function PlayerProfilePage() {
  const params = useParams();
  const playerId = params?.id as string;

  const {
    profiles,
    teams,
    teamMembers,
    matches,
    matchEvents,
    getPlayerStats,
  } = useStore();

  const profile = profiles.find((p) => p.id === playerId);

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Player not found</h2>
        <Link
          href="/teams"
          className="inline-block px-4 py-2 rounded-lg bg-emerald-500 font-semibold text-xs text-zinc-950"
        >
          Browse Teams
        </Link>
      </div>
    );
  }

  // Current team membership
  const membership = teamMembers.find((m) => m.user_id === profile.id);
  const currentTeam = membership ? teams.find((t) => t.id === membership.team_id) : undefined;

  // Aggregate stats
  const stats = getPlayerStats(profile.id);

  // Player individual events
  const playerEvents = matchEvents
    .filter((e) => e.player_id === profile.id || e.assist_player_id === profile.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <Link
        href={currentTeam ? `/teams/${currentTeam.id}` : '/teams'}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {currentTeam?.name || 'Teams'}
      </Link>

      {/* Player Profile Header Card */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-zinc-800 border-2 border-zinc-700 overflow-hidden flex-shrink-0 shadow-xl">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-zinc-400">
                  {profile.full_name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    (membership?.position || profile.position) === 'GK'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : (membership?.position || profile.position) === 'DEF'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : (membership?.position || profile.position) === 'MID'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {membership?.position || profile.position || 'MID'}
                </span>

                <span className="font-mono text-xs font-bold text-zinc-400">
                  #{membership?.jersey_number ?? profile.jersey_number ?? 0}
                </span>

                {membership?.role === 'captain' && (
                  <span className="rounded-full bg-amber-950 text-amber-300 border border-amber-700 px-2 py-0.5 text-[9px] uppercase font-bold">
                    Team Captain
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
                {profile.full_name}
              </h1>

              {currentTeam && (
                <Link
                  href={`/teams/${currentTeam.id}`}
                  className="flex items-center gap-2 text-xs text-zinc-300 hover:text-emerald-400 mt-2 transition-colors"
                >
                  <span className="text-xl">{currentTeam.crest_url}</span>
                  <span className="font-semibold">{currentTeam.name}</span>
                </Link>
              )}
            </div>
          </div>

          <div className="text-xs text-zinc-400 space-y-1">
            <p className="max-w-xs">{profile.bio || 'Competitive amateur football player.'}</p>
            <p className="text-[11px] text-zinc-500">Member since {new Date(profile.created_at).getFullYear()}</p>
          </div>
        </div>

        {/* Core Stats Grid */}
        <div className="mt-8 pt-6 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-6 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-center">
            <div className="text-[10px] uppercase font-bold text-zinc-500">Appearances</div>
            <div className="text-2xl font-black text-white mt-0.5">{stats.appearances}</div>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Goals</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{stats.goals}</div>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-950/20 p-3 text-center">
            <div className="text-[10px] uppercase font-bold text-teal-300">Assists</div>
            <div className="text-2xl font-black text-teal-300 mt-0.5">{stats.assists}</div>
          </div>
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3 text-center">
            <div className="text-[10px] uppercase font-bold text-blue-300">Clean Sheets</div>
            <div className="text-2xl font-black text-blue-300 mt-0.5">{stats.cleanSheets}</div>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-center">
            <div className="text-[10px] uppercase font-bold text-amber-400">Yellows</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5">{stats.yellowCards}</div>
          </div>
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-center">
            <div className="text-[10px] uppercase font-bold text-rose-400">Reds</div>
            <div className="text-2xl font-black text-rose-400 mt-0.5">{stats.redCards}</div>
          </div>
        </div>
      </div>

      {/* Performance & Events Log */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-400" />
          Individual Match Events & Highlights
        </h3>

        {playerEvents.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No individual goals, assists, or cards logged yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {playerEvents.map((ev) => {
              const match = matches.find((m) => m.id === ev.match_id);
              const home = teams.find((t) => t.id === match?.home_team_id);
              const away = teams.find((t) => t.id === match?.away_team_id);
              const isGoal = ev.player_id === profile.id && ev.event_type === 'goal';
              const isAssist = ev.assist_player_id === profile.id;

              return (
                <div
                  key={ev.id}
                  className="py-3.5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-zinc-800 text-emerald-400">
                      {ev.minute}&apos;
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        {isGoal && (
                          <span className="text-emerald-400 font-bold">⚽ Scored Goal</span>
                        )}
                        {isAssist && (
                          <span className="text-teal-300 font-bold">🎯 Provided Assist</span>
                        )}
                        {ev.event_type === 'yellow_card' && (
                          <span className="text-amber-400 font-bold">🟨 Yellow Card</span>
                        )}
                        {ev.event_type === 'red_card' && (
                          <span className="text-rose-400 font-bold">🟥 Red Card</span>
                        )}
                        {match && (
                          <span className="text-zinc-400 font-normal">
                            in {home?.name} vs {away?.name}
                          </span>
                        )}
                      </div>
                      {ev.notes && (
                        <p className="text-[11px] text-zinc-400 mt-0.5 italic">
                          &quot;{ev.notes}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  {match && (
                    <Link
                      href={`/matches/${match.id}`}
                      className="text-xs text-emerald-400 hover:underline font-semibold"
                    >
                      View Match →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
