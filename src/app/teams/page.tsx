'use client';

import React from 'react';
import Link from 'next/link';
import { Users, PlusCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function TeamsDirectoryPage() {
  const { teams, teamMembers, profiles } = useStore();
  const profilesMap = new Map(profiles.map((p) => [p.id, p]));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Registered Clubs
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Teams Directory</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Browse all affiliated football clubs, inspect squads, and view match history.
          </p>
        </div>

        <Link
          href="/teams/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 font-bold text-xs text-zinc-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Team
        </Link>
      </div>

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const roster = teamMembers.filter((m) => m.team_id === team.id);
          const captain = profilesMap.get(team.captain_id);

          return (
            <div
              key={team.id}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 flex flex-col justify-between hover:border-zinc-700 hover:bg-zinc-800/40 transition-all shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {team.crest_url || '⚽'}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {team.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Capt: {captain?.full_name || 'Captain'}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {team.bio || 'Registered Instaleague club.'}
                </p>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-zinc-500" />
                    Squad:
                  </span>
                  <span className="font-semibold text-zinc-200">
                    {roster.length} / {team.squad_limit} Players
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={`/teams/${team.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 font-bold text-xs text-white transition-all shadow-md group/btn"
                >
                  View Team & Roster
                  <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
