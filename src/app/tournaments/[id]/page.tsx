'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Shield,
  FileText,
  Activity,
  PlusCircle,
  Share2,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { StandingsTable } from '@/components/tournament/StandingsTable';
import { FixturesList } from '@/components/tournament/FixturesList';
import { LeaderboardsView } from '@/components/tournament/LeaderboardsView';
import { KnockoutBracket } from '@/components/tournament/KnockoutBracket';
import { RegistrationModal } from '@/components/tournament/RegistrationModal';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function TournamentDetailPage() {
  const params = useParams();
  const tournamentId = params?.id as string;

  const {
    tournaments,
    teams,
    registrations,
    matches,
    currentUser,
    getTournamentStandings,
    getTournamentScorers,
    getTournamentAssists,
    getTournamentCleanSheets,
    getTournamentDisciplinary,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'standings' | 'fixtures' | 'leaderboards' | 'teams' | 'rules'
  >('standings');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const tournament = tournaments.find((t) => t.id === tournamentId || t.slug === tournamentId);

  if (!tournament) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <Trophy className="mx-auto h-12 w-12 text-zinc-600" />
        <h2 className="text-xl font-bold text-white">Tournament not found</h2>
        <p className="text-xs text-zinc-400">
          The requested tournament could not be located.
        </p>
        <Link
          href="/tournaments"
          className="inline-block px-4 py-2 rounded-lg bg-emerald-500 font-semibold text-xs text-zinc-950"
        >
          Back to Tournaments
        </Link>
      </div>
    );
  }

  // Approved participating teams
  const approvedRegistrations = registrations.filter(
    (r) => r.tournament_id === tournament.id && r.status === 'approved'
  );
  const participatingTeams = teams.filter((t) =>
    approvedRegistrations.some((r) => r.team_id === t.id)
  );

  // Tournament matches
  const tournamentMatches = matches.filter((m) => m.tournament_id === tournament.id);

  // Standings & Leaderboards
  const standings = getTournamentStandings(tournament.id);
  const scorers = getTournamentScorers(tournament.id);
  const assists = getTournamentAssists(tournament.id);
  const cleanSheets = getTournamentCleanSheets(tournament.id);
  const disciplinary = getTournamentDisciplinary(tournament.id);

  const isKnockout = tournament.format === 'knockout';
  const isOrganizer = currentUser?.role === 'organizer';

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Header Banner */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-900/60">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-950">
          {tournament.banner_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tournament.banner_url}
              alt={tournament.name}
              className="h-full w-full object-cover opacity-40 blur-xs scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

          {/* Banner Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${
                    tournament.status === 'ongoing'
                      ? 'bg-emerald-500 text-zinc-950'
                      : tournament.status === 'upcoming'
                      ? 'bg-blue-500 text-zinc-950'
                      : 'bg-zinc-700 text-zinc-200'
                  }`}
                >
                  {tournament.status}
                </span>

                <span className="rounded-full bg-zinc-900/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-zinc-300 border border-zinc-700 uppercase">
                  {tournament.format.replace('_', ' ')}
                </span>

                <span className="rounded-full bg-emerald-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/40">
                  Prize Pool: {formatCurrency(tournament.prize_pool)}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                    {tournament.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mt-2 leading-relaxed">
                    {tournament.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900/80 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    {copiedLink ? 'Copied Link!' : 'Share'}
                  </button>

                  <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 font-bold text-xs text-zinc-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Register Team
                  </button>

                  {isOrganizer && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 transition-colors"
                    >
                      <Shield className="h-4 w-4 text-emerald-400" />
                      Organizer Console
                    </Link>
                  )}
                </div>
              </div>

              {/* Quick Info Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  {tournament.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-emerald-400" />
                  {participatingTeams.length} / {tournament.max_teams} Teams Enrolled
                </span>
                <span className="text-zinc-300 font-medium">
                  Entry Fee: {formatCurrency(tournament.entry_fee)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('standings')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'standings'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Trophy className="h-4 w-4" />
            {isKnockout ? 'Knockout Bracket' : 'Standings & Table'}
          </button>

          <button
            onClick={() => setActiveTab('fixtures')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'fixtures'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Fixtures & Results ({tournamentMatches.length})
          </button>

          <button
            onClick={() => setActiveTab('leaderboards')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'leaderboards'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="h-4 w-4" />
            Leaderboards & Golden Boot
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'teams'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            Clubs ({participatingTeams.length})
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'rules'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            Rules & Prizes
          </button>
        </div>

        {/* Tab 1: Standings or Knockout Bracket */}
        {activeTab === 'standings' && (
          <div className="space-y-6">
            {tournament.format === 'knockout' ? (
              <KnockoutBracket matches={tournamentMatches} teams={participatingTeams} />
            ) : tournament.format === 'group_knockout' ? (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30 uppercase">
                      Stage 1
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                      Group Stage Standings &amp; Points Table
                    </h3>
                  </div>
                  <StandingsTable standings={standings} tournamentName={tournament.name} />
                </div>
                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30 uppercase">
                      Stage 2
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                      Championship Knockout Bracket
                    </h3>
                  </div>
                  <KnockoutBracket matches={tournamentMatches} teams={participatingTeams} />
                </div>
              </div>
            ) : (
              <StandingsTable
                standings={standings}
                tournamentName={tournament.name}
              />
            )}
          </div>
        )}

        {/* Tab 2: Fixtures & Results */}
        {activeTab === 'fixtures' && (
          <FixturesList
            matches={tournamentMatches}
            teams={participatingTeams}
            isOrganizer={isOrganizer}
          />
        )}

        {/* Tab 3: Leaderboards */}
        {activeTab === 'leaderboards' && (
          <LeaderboardsView
            scorers={scorers}
            assists={assists}
            cleanSheets={cleanSheets}
            disciplinary={disciplinary}
          />
        )}

        {/* Tab 4: Teams List */}
        {activeTab === 'teams' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Approved Clubs Enrolled ({participatingTeams.length})
              </span>
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                + Register Another Team
              </button>
            </div>

            {participatingTeams.length === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-xs text-zinc-400">
                No approved teams yet. Captains can register using the button above.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {participatingTeams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/teams/${team.id}`}
                    className="group rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {team.crest_url || '⚽'}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {team.name}
                        </h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          {team.bio || 'Registered Club'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-zinc-500 group-hover:text-emerald-400">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Rules & Prize Info */}
        {activeTab === 'rules' && (
          <div className="max-w-3xl space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                Prize Structure
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-center">
                  <div className="text-[11px] uppercase font-bold text-amber-400">1st Place (Champions)</div>
                  <div className="text-xl font-black text-white mt-1">
                    {formatCurrency(tournament.prize_pool * 0.7)}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Trophy + Medals + Cash</div>
                </div>
                <div className="p-4 rounded-xl border border-zinc-700 bg-zinc-800/40 text-center">
                  <div className="text-[11px] uppercase font-bold text-zinc-300">2nd Place (Runners-Up)</div>
                  <div className="text-xl font-black text-white mt-1">
                    {formatCurrency(tournament.prize_pool * 0.3)}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Silver Medals</div>
                </div>
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-center">
                  <div className="text-[11px] uppercase font-bold text-emerald-400">Golden Boot & Glove</div>
                  <div className="text-xl font-black text-white mt-1">Individual Silverware</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Custom Commemorative Plaque</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" />
                Tournament Rules & Guidelines
              </h3>
              <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
                {tournament.rules || 'Standard Instaleague competition rules apply.'}
              </div>
              <div className="pt-2">
                <Link
                  href="/rules"
                  className="text-xs text-emerald-400 hover:underline font-semibold"
                >
                  View full official Instaleague rulebook & code of conduct →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        tournament={tournament}
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}
