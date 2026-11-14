'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Trophy,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Activity,
  PlusCircle,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const {
    tournaments,
    teams,
    registrations,
    matches,
    currentUser,
    setCurrentUser,
    profiles,
    updateRegistrationStatus,
  } = useStore();

  const isOrganizer = currentUser?.role === 'organizer';
  const organizerProfile = profiles.find((p) => p.role === 'organizer') || profiles[0];

  const pendingRegistrations = registrations.filter((r) => r.status === 'pending');
  const ongoingTournaments = tournaments.filter((t) => t.status === 'ongoing');
  const scheduledMatches = matches.filter((m) => m.status === 'scheduled');

  const teamsMap = new Map(teams.map((t) => [t.id, t]));
  const tournamentsMap = new Map(tournaments.map((t) => [t.id, t]));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      {/* Role Banner if not organizer */}
      {!isOrganizer && (
        <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-950/30 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-white">Organizer Preview Mode:</span> You are currently viewing as &quot;{currentUser?.full_name || 'Guest'}&quot;. Switch to the organizer persona to test full admin controls.
            </div>
          </div>
          <button
            onClick={() => setCurrentUser(organizerProfile)}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors whitespace-nowrap"
          >
            Switch to Marcus Vance (Organizer)
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Shield className="h-4 w-4" />
            Organizer Central Command
          </div>
          <h1 className="text-3xl font-black text-white mt-1">Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage football tournaments, approve team applications, generate fair schedules, and log live match results.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/tournaments"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-md"
          >
            <PlusCircle className="h-4 w-4" />
            Create Tournament
          </Link>
          <Link
            href="/admin/fixtures"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white font-semibold text-xs hover:bg-zinc-700 transition-colors"
          >
            <Calendar className="h-4 w-4 text-emerald-400" />
            Generate Fixtures
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/tournaments"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 hover:border-zinc-700 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Tournaments
            </span>
            <Trophy className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{tournaments.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {ongoingTournaments.length} active currently
          </div>
        </Link>

        <Link
          href="/admin/applications"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 hover:border-zinc-700 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Pending Apps
            </span>
            <Clock className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-amber-400 mt-2">
            {pendingRegistrations.length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Requires organizer review</div>
        </Link>

        <Link
          href="/teams"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 hover:border-zinc-700 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Registered Clubs
            </span>
            <Users className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{teams.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Affiliated clubs</div>
        </Link>

        <Link
          href="/admin/matches"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 hover:border-zinc-700 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Scheduled Matches
            </span>
            <Calendar className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {scheduledMatches.length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Ready for result logging</div>
        </Link>
      </div>

      {/* Main Grid: Pending Applications & Matches needing results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Applications Review */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Pending Team Applications</h3>
              {pendingRegistrations.length > 0 && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400 font-bold">
                  {pendingRegistrations.length}
                </span>
              )}
            </div>
            <Link
              href="/admin/applications"
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              All Applications →
            </Link>
          </div>

          {pendingRegistrations.length === 0 ? (
            <div className="py-10 text-center text-xs text-zinc-500">
              No pending applications at this time. All caught up!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRegistrations.slice(0, 4).map((reg) => {
                const team = teamsMap.get(reg.team_id);
                const tour = tournamentsMap.get(reg.tournament_id);

                return (
                  <div
                    key={reg.id}
                    className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span>{team?.crest_url}</span>
                        <span>{team?.name}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        Applying for: <strong className="text-zinc-200">{tour?.name}</strong>
                      </div>
                      {reg.notes && (
                        <div className="text-[10px] text-zinc-500 italic mt-0.5">
                          &quot;{reg.notes}&quot;
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateRegistrationStatus(reg.id, 'approved')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 font-bold text-[11px] text-zinc-950 hover:bg-emerald-400 transition-colors shadow-sm"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => updateRegistrationStatus(reg.id, 'rejected')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 font-bold text-[11px] hover:bg-rose-950/40 transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Fixtures & Score Updater shortcut */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Match Score Input Queue</h3>
            </div>
            <Link
              href="/admin/matches"
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              All Matches →
            </Link>
          </div>

          <div className="space-y-3">
            {matches.slice(0, 4).map((match) => {
              const home = teamsMap.get(match.home_team_id);
              const away = teamsMap.get(match.away_team_id);
              const isCompleted = match.status === 'completed';

              return (
                <div
                  key={match.id}
                  className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="text-[10px] text-zinc-500">
                      Round {match.round} • {formatDate(match.scheduled_at)}
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <span>{home?.crest_url} {home?.name}</span>
                      <span className="font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-zinc-900">
                        {isCompleted ? `${match.home_score} - ${match.away_score}` : 'vs'}
                      </span>
                      <span>{away?.crest_url} {away?.name}</span>
                    </div>
                  </div>

                  <Link
                    href={`/admin/matches/${match.id}`}
                    className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 font-semibold text-xs hover:bg-emerald-950/80 transition-colors whitespace-nowrap"
                  >
                    Edit Result →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Quick Action Hub */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Organizer Administrative Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/tournaments"
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-emerald-500/40 transition-all space-y-1.5 group"
          >
            <div className="font-bold text-white group-hover:text-emerald-400 flex items-center justify-between">
              <span>Tournament Creation</span>
              <ArrowRight className="h-4 w-4" />
            </div>
            <p className="text-xs text-zinc-400">
              Set formats (round-robin / knockout), entry fees, prize pools, and venues.
            </p>
          </Link>

          <Link
            href="/admin/applications"
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-emerald-500/40 transition-all space-y-1.5 group"
          >
            <div className="font-bold text-white group-hover:text-emerald-400 flex items-center justify-between">
              <span>Application Approvals</span>
              <ArrowRight className="h-4 w-4" />
            </div>
            <p className="text-xs text-zinc-400">
              Review captain roster sheets, enforce squad caps, and accept clubs.
            </p>
          </Link>

          <Link
            href="/admin/fixtures"
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-emerald-500/40 transition-all space-y-1.5 group"
          >
            <div className="font-bold text-white group-hover:text-emerald-400 flex items-center justify-between">
              <span>Automated Fixture Generator</span>
              <ArrowRight className="h-4 w-4" />
            </div>
            <p className="text-xs text-zinc-400">
              Run Berger polygon algorithm to pair approved clubs with automated venue allocation.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
