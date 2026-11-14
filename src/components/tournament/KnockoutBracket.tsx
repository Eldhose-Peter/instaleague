'use client';

import React from 'react';
import Link from 'next/link';
import { Match, Team } from '@/types';
import { formatDate } from '@/lib/utils';

interface KnockoutBracketProps {
  matches: Match[];
  teams: Team[];
}

export function KnockoutBracket({ matches, teams }: KnockoutBracketProps) {
  const teamsMap = new Map(teams.map((t) => [t.id, t]));

  // Separate stages: quarter_final, semi_final, final
  const quarters = matches.filter((m) => m.stage === 'quarter_final');
  const semis = matches.filter((m) => m.stage === 'semi_final');
  const finals = matches.filter((m) => m.stage === 'final');

  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="min-w-[680px] grid grid-cols-3 gap-6">
        {/* Column 1: Quarter Finals */}
        <div className="space-y-4">
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-400 pb-2 border-b border-zinc-800">
            Quarter Finals ({quarters.length || 4} Matches)
          </div>
          <div className="space-y-4">
            {(quarters.length > 0 ? quarters : [1, 2, 3, 4]).map((item, idx) => {
              const match = typeof item === 'object' ? item : null;
              const home = match ? teamsMap.get(match.home_team_id) : null;
              const away = match ? teamsMap.get(match.away_team_id) : null;

              return (
                <div
                  key={match ? match.id : idx}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 shadow-md space-y-2 text-xs"
                >
                  <div className="text-[10px] text-zinc-500 flex justify-between">
                    <span>Match Q{idx + 1}</span>
                    <span>{match ? formatDate(match.scheduled_at) : 'TBD'}</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-zinc-950/50">
                    <span className="font-semibold text-zinc-200 truncate">
                      {home ? `${home.crest_url} ${home.name}` : `Seed ${idx * 2 + 1}`}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {match?.status === 'completed' ? match.home_score : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-zinc-950/50">
                    <span className="font-semibold text-zinc-200 truncate">
                      {away ? `${away.crest_url} ${away.name}` : `Seed ${idx * 2 + 2}`}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {match?.status === 'completed' ? match.away_score : '-'}
                    </span>
                  </div>
                  {match && (
                    <Link
                      href={`/matches/${match.id}`}
                      className="block text-[10px] text-center text-emerald-400 hover:underline pt-1"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Semi Finals */}
        <div className="space-y-4">
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-400 pb-2 border-b border-zinc-800">
            Semi Finals
          </div>
          <div className="space-y-8 pt-6">
            {(semis.length > 0 ? semis : [1, 2]).map((item, idx) => {
              const match = typeof item === 'object' ? item : null;
              const home = match ? teamsMap.get(match.home_team_id) : null;
              const away = match ? teamsMap.get(match.away_team_id) : null;

              return (
                <div
                  key={match ? match.id : idx}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 shadow-md space-y-2 text-xs"
                >
                  <div className="text-[10px] text-zinc-500 flex justify-between">
                    <span>Semi Final {idx + 1}</span>
                    <span>{match ? formatDate(match.scheduled_at) : 'TBD'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-zinc-950/50">
                    <span className="font-semibold text-zinc-200 truncate">
                      {home ? `${home.crest_url} ${home.name}` : `Winner Q${idx * 2 + 1}`}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {match?.status === 'completed' ? match.home_score : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-zinc-950/50">
                    <span className="font-semibold text-zinc-200 truncate">
                      {away ? `${away.crest_url} ${away.name}` : `Winner Q${idx * 2 + 2}`}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {match?.status === 'completed' ? match.away_score : '-'}
                    </span>
                  </div>
                  {match && (
                    <Link
                      href={`/matches/${match.id}`}
                      className="block text-[10px] text-center text-emerald-400 hover:underline pt-1"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: The Grand Final */}
        <div className="space-y-4">
          <div className="text-xs uppercase font-bold tracking-wider text-amber-400 pb-2 border-b border-zinc-800">
            🏆 The Grand Final
          </div>
          <div className="pt-16">
            {(() => {
              const match = finals[0] || null;
              const home = match ? teamsMap.get(match.home_team_id) : null;
              const away = match ? teamsMap.get(match.away_team_id) : null;

              return (
                <div className="rounded-xl border-2 border-amber-500/40 bg-zinc-900 p-4 shadow-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                    <span>Championship Match</span>
                    <span>{match ? formatDate(match.scheduled_at) : 'Grand Final'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-zinc-950 font-semibold text-white">
                    <span>{home ? `${home.crest_url} ${home.name}` : 'Finalist 1'}</span>
                    <span className="font-mono font-black text-amber-400 text-sm">
                      {match?.status === 'completed' ? match.home_score : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-zinc-950 font-semibold text-white">
                    <span>{away ? `${away.crest_url} ${away.name}` : 'Finalist 2'}</span>
                    <span className="font-mono font-black text-amber-400 text-sm">
                      {match?.status === 'completed' ? match.away_score : '-'}
                    </span>
                  </div>
                  <div className="text-center pt-1 text-[11px] text-zinc-400">
                    Winner takes trophy & prize pool!
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
