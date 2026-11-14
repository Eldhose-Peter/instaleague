'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Activity,
  ArrowLeft,
  Shield,
  UserCheck,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDate, formatTime } from '@/lib/utils';

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params?.id as string;

  const {
    matches,
    teams,
    tournaments,
    matchEvents,
    profiles,
    teamMembers,
    currentUser,
  } = useStore();

  const match = matches.find((m) => m.id === matchId);

  if (!match) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Match not found</h2>
        <Link
          href="/tournaments"
          className="inline-block px-4 py-2 rounded-lg bg-emerald-500 font-semibold text-xs text-zinc-950"
        >
          Return to Tournaments
        </Link>
      </div>
    );
  }

  const tournament = tournaments.find((t) => t.id === match.tournament_id);
  const homeTeam = teams.find((t) => t.id === match.home_team_id);
  const awayTeam = teams.find((t) => t.id === match.away_team_id);

  // Events for this match sorted by minute ASC
  const events = matchEvents
    .filter((e) => e.match_id === match.id)
    .sort((a, b) => a.minute - b.minute);

  const profilesMap = new Map(profiles.map((p) => [p.id, p]));

  // Rosters
  const homeRoster = teamMembers
    .filter((m) => m.team_id === match.home_team_id)
    .map((m) => ({
      ...m,
      profile: profilesMap.get(m.user_id),
    }))
    .sort((a, b) => a.jersey_number - b.jersey_number);

  const awayRoster = teamMembers
    .filter((m) => m.team_id === match.away_team_id)
    .map((m) => ({
      ...m,
      profile: profilesMap.get(m.user_id),
    }))
    .sort((a, b) => a.jersey_number - b.jersey_number);

  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';
  const isOrganizer = currentUser?.role === 'organizer';

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href={`/tournaments/${tournament?.id || ''}`}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {tournament?.name || 'Tournament'}
        </Link>

        {isOrganizer && (
          <Link
            href={`/admin/matches/${match.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/60 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 transition-colors"
          >
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            Organizer Edit Score & Events
          </Link>
        )}
      </div>

      {/* Scoreboard Card */}
      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/80 shadow-2xl">
        <div className="p-4 sm:p-6 bg-zinc-950/60 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-emerald-400" />
            <span className="font-bold text-white">{tournament?.name}</span>
            <span className="text-zinc-600">•</span>
            <span className="rounded bg-zinc-800 px-2 py-0.5 font-semibold text-zinc-300">
              Round {match.round}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isLive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/30 animate-pulse">
                <Activity className="h-3 w-3" /> MATCH IN PROGRESS
              </span>
            )}
            {isCompleted && (
              <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-300">
                Full-Time Verified
              </span>
            )}
            {match.status === 'scheduled' && (
              <span className="rounded-full bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                Scheduled
              </span>
            )}
          </div>
        </div>

        {/* Big Score Board */}
        <div className="p-6 sm:p-10">
          <div className="grid grid-cols-7 items-center gap-4">
            {/* Home Team */}
            <div className="col-span-3 flex flex-col items-center sm:items-end text-center sm:text-right space-y-2">
              <span className="text-4xl sm:text-6xl">{homeTeam?.crest_url || '⚽'}</span>
              <Link
                href={`/teams/${homeTeam?.id}`}
                className="text-lg sm:text-2xl font-black text-white hover:text-emerald-400 transition-colors"
              >
                {homeTeam?.name}
              </Link>
              <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">
                Home Club
              </span>
            </div>

            {/* Score / VS Center */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              {isCompleted || isLive ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-3 rounded-2xl bg-zinc-950 px-4 py-2 border border-zinc-800 font-mono text-3xl sm:text-5xl font-black text-white shadow-inner">
                    <span>{match.home_score}</span>
                    <span className="text-zinc-600">:</span>
                    <span>{match.away_score}</span>
                  </div>
                  {match.penalty_home_score !== undefined && match.penalty_away_score !== undefined && (
                    <div className="mt-2 text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 whitespace-nowrap">
                      ({match.penalty_home_score} - {match.penalty_away_score} pens)
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl bg-zinc-800 px-4 py-2 text-sm sm:text-base font-black text-zinc-400">
                  VS
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="col-span-3 flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
              <span className="text-4xl sm:text-6xl">{awayTeam?.crest_url || '⚽'}</span>
              <Link
                href={`/teams/${awayTeam?.id}`}
                className="text-lg sm:text-2xl font-black text-white hover:text-emerald-400 transition-colors"
              >
                {awayTeam?.name}
              </Link>
              <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">
                Away Club
              </span>
            </div>
          </div>

          {/* Match Venue & Kickoff Details */}
          <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-emerald-400" />
              {formatDate(match.scheduled_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-400" />
              {formatTime(match.scheduled_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-400" />
              {match.venue}
            </span>
            <span className="flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              Referee: {match.referee || 'Instaleague Official'}
            </span>
          </div>
        </div>
      </div>

      {/* Match Timeline / Events */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-400" />
          Official Match Timeline
        </h3>

        {events.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            {isCompleted
              ? 'No individual goals or cards logged for this match.'
              : 'Match events will appear here in real time once kickoff commences.'}
          </div>
        ) : (
          <div className="space-y-3 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-zinc-800">
            {events.map((ev) => {
              const isHomeEvent = ev.team_id === match.home_team_id;
              const player = profilesMap.get(ev.player_id || '');
              const assistPlayer = profilesMap.get(ev.assist_player_id || '');

              return (
                <div
                  key={ev.id}
                  className={`relative flex items-center ${
                    isHomeEvent ? 'justify-start pr-1/2' : 'justify-end pl-1/2'
                  }`}
                >
                  {/* Central Minute Badge */}
                  <div className="absolute left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border-2 border-emerald-500 font-mono text-xs font-bold text-emerald-400 z-10">
                    {ev.minute}&apos;
                  </div>

                  {/* Event Bubble */}
                  <div
                    className={`w-[42%] p-3 rounded-xl border border-zinc-800 bg-zinc-900 shadow-md ${
                      isHomeEvent ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 justify-end">
                      {ev.event_type === 'goal' && (
                        <span className="text-sm font-bold text-emerald-400">⚽ GOAL!</span>
                      )}
                      {ev.event_type === 'penalty' && (
                        <span className="text-sm font-bold text-teal-400">🎯 PENALTY GOAL!</span>
                      )}
                      {ev.event_type === 'own_goal' && (
                        <span className="text-sm font-bold text-rose-400">🤦 OWN GOAL</span>
                      )}
                      {ev.event_type === 'yellow_card' && (
                        <span className="h-4 w-3 rounded-xs bg-amber-400 inline-block shadow-sm" />
                      )}
                      {ev.event_type === 'red_card' && (
                        <span className="h-4 w-3 rounded-xs bg-rose-600 inline-block shadow-sm" />
                      )}
                    </div>

                    <div className="font-semibold text-xs text-white mt-1">
                      {player ? (
                        <Link
                          href={`/players/${player.id}`}
                          className="hover:text-emerald-400 transition-colors"
                        >
                          {player.full_name}
                        </Link>
                      ) : (
                        'Player'
                      )}
                    </div>

                    {assistPlayer && (
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        Assist: {assistPlayer.full_name}
                      </div>
                    )}

                    {ev.notes && (
                      <div className="text-[10px] text-zinc-500 italic mt-1">
                        &quot;{ev.notes}&quot;
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Team Lineups / Squads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home Lineup */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{homeTeam?.crest_url}</span>
              <span>{homeTeam?.name} Lineup</span>
            </h4>
            <span className="text-[11px] text-zinc-400">{homeRoster.length} Players</span>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {homeRoster.map((m) => (
              <div key={m.id} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center font-mono font-bold text-zinc-500">
                    {m.jersey_number}
                  </span>
                  <Link
                    href={`/players/${m.user_id}`}
                    className="font-medium text-zinc-200 hover:text-emerald-400"
                  >
                    {m.profile?.full_name || 'Squad Member'}
                  </Link>
                </div>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-400">
                  {m.position}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Away Lineup */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{awayTeam?.crest_url}</span>
              <span>{awayTeam?.name} Lineup</span>
            </h4>
            <span className="text-[11px] text-zinc-400">{awayRoster.length} Players</span>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {awayRoster.map((m) => (
              <div key={m.id} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center font-mono font-bold text-zinc-500">
                    {m.jersey_number}
                  </span>
                  <Link
                    href={`/players/${m.user_id}`}
                    className="font-medium text-zinc-200 hover:text-emerald-400"
                  >
                    {m.profile?.full_name || 'Squad Member'}
                  </Link>
                </div>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-400">
                  {m.position}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
