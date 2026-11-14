'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TournamentStatus } from '@/types';

export default function TournamentsDirectoryPage() {
  const { tournaments, registrations } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TournamentStatus>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 'round_robin' | 'knockout'>('all');

  // Filtered tournaments
  const filteredTournaments = tournaments.filter((tournament) => {
    if (statusFilter !== 'all' && tournament.status !== statusFilter) return false;
    if (formatFilter !== 'all' && tournament.format !== formatFilter) return false;
    if (
      searchQuery &&
      !tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !tournament.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Competitions Hub
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Football Tournaments</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Browse active leagues, register your team for upcoming cups, and check historical results.
          </p>
        </div>

        <Link
          href="/admin/tournaments"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 font-semibold text-xs hover:bg-emerald-950/70 transition-colors"
        >
          <Shield className="h-4 w-4 text-emerald-400" />
          Host / Create Tournament
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tournament name, venue, or location..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'ongoing', 'upcoming', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Filter className="h-3.5 w-3.5 text-zinc-500" />
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value as 'all' | 'round_robin' | 'knockout')}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="all">All Formats</option>
            <option value="round_robin">Round-Robin League</option>
            <option value="knockout">Knockout Cup</option>
          </select>
        </div>
      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center text-zinc-400 space-y-3">
          <Trophy className="mx-auto h-10 w-10 text-zinc-600" />
          <h3 className="text-base font-semibold text-white">No tournaments matched your criteria</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search terms or status filter, or check back later for newly announced leagues.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => {
            const approvedTeamsCount = registrations.filter(
              (r) => r.tournament_id === tournament.id && r.status === 'approved'
            ).length;

            return (
              <div
                key={tournament.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all shadow-xl"
              >
                <div>
                  {/* Banner Header Image */}
                  <div className="relative h-44 w-full bg-zinc-800 overflow-hidden">
                    {tournament.banner_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tournament.banner_url}
                        alt={tournament.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                        <Trophy className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          tournament.status === 'ongoing'
                            ? 'bg-emerald-500 text-zinc-950'
                            : tournament.status === 'upcoming'
                            ? 'bg-blue-500 text-zinc-950'
                            : 'bg-zinc-700 text-zinc-200'
                        }`}
                      >
                        {tournament.status}
                      </span>

                      <span className="rounded-full bg-zinc-900/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        Prize: {formatCurrency(tournament.prize_pool)}
                      </span>
                    </div>

                    {/* Format Pill bottom */}
                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-md bg-zinc-900/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-zinc-300 border border-zinc-700 uppercase">
                        {tournament.format.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {tournament.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {tournament.description}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-zinc-800/80 text-xs text-zinc-300">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
                        <span className="truncate">{tournament.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Calendar className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
                        <span>
                          {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1.5 text-zinc-400">
                          <Users className="h-3.5 w-3.5 text-zinc-500" />
                          Slots:
                        </span>
                        <span className="font-semibold text-zinc-200">
                          {approvedTeamsCount} / {tournament.max_teams} Teams
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <Link
                    href={`/tournaments/${tournament.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 font-bold text-xs text-white transition-all shadow-md group/btn"
                  >
                    View Tournament Hub
                    <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
