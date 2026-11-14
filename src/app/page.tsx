'use client';

import React from 'react';
import Link from 'next/link';
import {
  Trophy,
  Users,
  Calendar,
  Shield,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { StandingsTable } from '@/components/tournament/StandingsTable';
import { FixturesList } from '@/components/tournament/FixturesList';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function HomePage() {
  const {
    tournaments,
    teams,
    matches,
    matchEvents,
    getTournamentStandings,
    getTournamentScorers,
  } = useStore();

  const ongoingTournament =
    tournaments.find((t) => t.status === 'ongoing') || tournaments[0];
  const upcomingTournaments = tournaments.filter((t) => t.status === 'upcoming');

  const standings = ongoingTournament
    ? getTournamentStandings(ongoingTournament.id).slice(0, 5)
    : [];
  const topScorers = ongoingTournament
    ? getTournamentScorers(ongoingTournament.id).slice(0, 3)
    : [];
  const recentMatches = matches
    .filter((m) => m.tournament_id === ongoingTournament?.id)
    .slice(0, 4);

  const totalGoals = matchEvents.filter((e) => e.event_type === 'goal').length;
  const completedMatches = matches.filter((m) => m.status === 'completed').length;

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 py-16 sm:py-24">
        {/* Glow ambient circle */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Football League & Tournament Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Competitive Football, <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Elevated to the Pro Stage.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Instaleague connects football clubs with curated tournaments. Team captains register squads, organizers schedule fixtures with algorithmic fairness, and players track live points tables, goals, and golden boot races.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/tournaments"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 group"
            >
              Explore Tournaments
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/teams/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-900/80 text-white font-semibold text-sm hover:bg-zinc-800 transition-colors"
            >
              <Users className="h-4 w-4 text-emerald-400" />
              Register a Team
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 font-semibold text-sm hover:bg-emerald-950/60 transition-colors"
            >
              <Shield className="h-4 w-4 text-emerald-400" />
              Organizer Dashboard
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-2xl font-black text-white">{tournaments.length}</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">Tournaments Hosted</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-2xl font-black text-emerald-400">{teams.length}</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">Clubs Registered</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-2xl font-black text-white">{completedMatches}</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">Matches Played</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-2xl font-black text-emerald-400">{totalGoals}</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">Tournament Goals</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tournament Showcase */}
      {ongoingTournament && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Flame className="h-4 w-4" />
                Featured Competition
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {ongoingTournament.name}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {ongoingTournament.location} • Prize Pool:{' '}
                <strong className="text-emerald-400">
                  {formatCurrency(ongoingTournament.prize_pool)}
                </strong>
              </p>
            </div>

            <Link
              href={`/tournaments/${ongoingTournament.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
            >
              Full Tournament Hub <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Standings Table (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <StandingsTable standings={standings} />
              <div className="text-right">
                <Link
                  href={`/tournaments/${ongoingTournament.id}`}
                  className="text-xs text-emerald-400 hover:underline font-semibold"
                >
                  View full table and stats →
                </Link>
              </div>
            </div>

            {/* Golden Boot & Quick Scorers widget */}
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-400" />
                    Golden Boot Leaders
                  </h3>
                  <span className="text-[11px] text-zinc-400">Goals</span>
                </div>

                <div className="mt-4 divide-y divide-zinc-800/60">
                  {topScorers.length === 0 ? (
                    <div className="py-6 text-center text-xs text-zinc-500">
                      Matches underway, waiting for goal records.
                    </div>
                  ) : (
                    topScorers.map((scorer, i) => (
                      <div
                        key={scorer.player_id}
                        className="py-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-6 w-6 rounded text-xs font-black flex items-center justify-center ${
                              i === 0
                                ? 'bg-amber-400 text-zinc-950'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            {i + 1}
                          </span>
                          <div>
                            <Link
                              href={`/players/${scorer.player_id}`}
                              className="text-xs font-semibold text-white hover:text-emerald-400"
                            >
                              {scorer.player_name}
                            </Link>
                            <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                              <span>{scorer.team_crest}</span>
                              <span>{scorer.team_name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-base font-black text-emerald-400 font-mono">
                          {scorer.goals}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 text-center">
                  <Link
                    href={`/tournaments/${ongoingTournament.id}?tab=leaderboards`}
                    className="text-xs text-zinc-400 hover:text-emerald-400 font-medium"
                  >
                    View All Player Leaderboards →
                  </Link>
                </div>
              </div>

              {/* Tournament Format Card */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Tournament Format
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {ongoingTournament.description}
                </p>
                <div className="space-y-1.5 pt-1 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Format: Round-Robin League</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Squad Limit: 22 registered players</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Venue: {ongoingTournament.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Match Results & Upcoming Fixtures */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-400" />
              Match Center & Fixtures
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Scheduled fixtures and verified referee scores
            </p>
          </div>
          <Link
            href="/tournaments/tour-premier-2026?tab=fixtures"
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            All Fixtures →
          </Link>
        </div>

        <FixturesList matches={recentMatches} teams={teams} />
      </section>

      {/* Upcoming Tournaments Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-emerald-400" />
            Upcoming Competitions
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Register your team early before slots fill up
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTournaments.map((tour) => (
            <div
              key={tour.id}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all hover:bg-zinc-800/40"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30 uppercase">
                    {tour.format.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    Prize: {formatCurrency(tour.prize_pool)}
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {tour.name}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                    {tour.description}
                  </p>
                </div>

                <div className="text-xs text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-800/60">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Kickoff:</span>
                    <span className="text-zinc-200">{formatDate(tour.start_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Entry Fee:</span>
                    <span className="text-zinc-200">{formatCurrency(tour.entry_fee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Venue:</span>
                    <span className="text-zinc-200 truncate max-w-[180px]">{tour.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={`/tournaments/${tour.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 font-semibold text-xs text-white transition-all"
                >
                  View Details & Register
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Organizer Call to Action */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-zinc-900 p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Host Your Own Football League
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Are you a Tournament Organizer?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Instaleague provides complete administrative control: create round-robin or knockout formats, review club applications, generate fixture schedules automatically, and input live match scores that update standings in real-time.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/admin/tournaments"
                className="px-6 py-3 rounded-xl bg-emerald-500 font-bold text-xs sm:text-sm text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Create New Tournament
              </Link>
              <Link
                href="/admin"
                className="px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-900 font-semibold text-xs sm:text-sm text-white hover:bg-zinc-800 transition-colors"
              >
                Go to Organizer Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
