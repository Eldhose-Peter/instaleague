'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trophy, Award, ShieldAlert, Sparkles } from 'lucide-react';
import {
  CleanSheetRow,
  DisciplinaryRow,
  TopAssistRow,
  TopScorerRow,
} from '@/types';

interface LeaderboardsViewProps {
  scorers: TopScorerRow[];
  assists: TopAssistRow[];
  cleanSheets: CleanSheetRow[];
  disciplinary: DisciplinaryRow[];
}

export function LeaderboardsView({
  scorers,
  assists,
  cleanSheets,
  disciplinary,
}: LeaderboardsViewProps) {
  const [tab, setTab] = useState<'goals' | 'assists' | 'cleansheets' | 'cards'>('goals');

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 max-w-fit">
        <button
          onClick={() => setTab('goals')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            tab === 'goals'
              ? 'bg-emerald-500 text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Trophy className="h-4 w-4" />
          Golden Boot (Goals)
        </button>
        <button
          onClick={() => setTab('assists')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            tab === 'assists'
              ? 'bg-emerald-500 text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Top Playmakers (Assists)
        </button>
        <button
          onClick={() => setTab('cleansheets')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            tab === 'cleansheets'
              ? 'bg-emerald-500 text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Award className="h-4 w-4" />
          Golden Glove (Clean Sheets)
        </button>
        <button
          onClick={() => setTab('cards')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            tab === 'cards'
              ? 'bg-emerald-500 text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          Discipline & Cards
        </button>
      </div>

      {/* Tab 1: Goals */}
      {tab === 'goals' && (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70">
          <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950/40 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Golden Boot Leaderboard
            </span>
            <span className="text-xs text-zinc-500">Sorted by Goals scored</span>
          </div>

          {scorers.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No goal events recorded yet in this tournament.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {scorers.map((player, idx) => (
                <div
                  key={player.player_id}
                  className="flex items-center justify-between p-4 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                        idx === 0
                          ? 'bg-amber-400 text-zinc-950 font-black'
                          : idx === 1
                          ? 'bg-zinc-300 text-zinc-950'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'text-zinc-500'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
                      {player.player_avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={player.player_avatar}
                          alt={player.player_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-zinc-400 font-bold">
                          {player.player_name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div>
                      <Link
                        href={`/players/${player.player_id}`}
                        className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                      >
                        {player.player_name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                        <span>{player.team_crest}</span>
                        <span>{player.team_name}</span>
                        {player.jersey_number && (
                          <span className="rounded bg-zinc-800 px-1.5 py-0.2 text-[10px] text-zinc-300">
                            #{player.jersey_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div className="text-xs text-zinc-400 hidden sm:block">
                      <span className="font-semibold text-zinc-200">{player.assists}</span> assists
                    </div>
                    <div>
                      <div className="text-xl font-black text-emerald-400">
                        {player.goals}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">
                        Goals
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Assists */}
      {tab === 'assists' && (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70">
          <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Most Assists (Playmakers)
            </span>
          </div>

          {assists.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No assist data logged yet.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {assists.map((player, idx) => (
                <div
                  key={player.player_id}
                  className="flex items-center justify-between p-4 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 text-xs font-bold flex items-center justify-center text-zinc-400">
                      {idx + 1}
                    </span>
                    <div>
                      <Link
                        href={`/players/${player.player_id}`}
                        className="text-sm font-semibold text-white hover:text-emerald-400"
                      >
                        {player.player_name}
                      </Link>
                      <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <span>{player.team_crest}</span>
                        <span>{player.team_name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-emerald-400">{player.assists}</div>
                    <div className="text-[10px] text-zinc-500 uppercase">Assists</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Clean Sheets */}
      {tab === 'cleansheets' && (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70">
          <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Golden Glove (Goalkeepers Clean Sheets)
            </span>
          </div>

          {cleanSheets.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No goalkeeper records available.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {cleanSheets.map((gk, idx) => (
                <div
                  key={gk.player_id}
                  className="flex items-center justify-between p-4 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 text-xs font-bold text-zinc-400 flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <Link
                        href={`/players/${gk.player_id}`}
                        className="text-sm font-semibold text-white hover:text-emerald-400"
                      >
                        {gk.player_name}
                      </Link>
                      <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <span>{gk.team_crest}</span>
                        <span>{gk.team_name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div className="text-xs text-zinc-400 hidden sm:block">
                      <span className="font-semibold text-zinc-200">{gk.goals_conceded}</span> conceded
                    </div>
                    <div>
                      <div className="text-xl font-black text-emerald-400">
                        {gk.clean_sheets}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">
                        Clean Sheets
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Disciplinary */}
      {tab === 'cards' && (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70">
          <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Disciplinary Record (Yellow & Red Cards)
            </span>
          </div>

          {disciplinary.length === 0 ? (
            <div className="p-8 text-center text-xs text-emerald-400">
              No disciplinary infractions recorded. Great fair play!
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {disciplinary.map((row) => (
                <div
                  key={row.player_id}
                  className="flex items-center justify-between p-4 hover:bg-zinc-800/40"
                >
                  <div>
                    <Link
                      href={`/players/${row.player_id}`}
                      className="text-sm font-semibold text-white hover:text-emerald-400"
                    >
                      {row.player_name}
                    </Link>
                    <div className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                      <span>{row.team_crest}</span>
                      <span>{row.team_name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="h-4 w-3 rounded-xs bg-amber-400 inline-block shadow-sm" />
                      <span className="font-bold text-zinc-200">{row.yellow_cards}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="h-4 w-3 rounded-xs bg-rose-600 inline-block shadow-sm" />
                      <span className="font-bold text-zinc-200">{row.red_cards}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
