'use client';

import React from 'react';
import Link from 'next/link';
import { StandingRow } from '@/types';

interface StandingsTableProps {
  standings: StandingRow[];
  tournamentName?: string;
}

export function StandingsTable({ standings, tournamentName }: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center text-zinc-400">
        <p className="font-medium text-sm">No standings data available yet.</p>
        <p className="text-xs text-zinc-500 mt-1">
          Approve teams and record match results to generate the live table.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-xl">
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Points Table
          </h3>
          {tournamentName && (
            <p className="text-xs text-zinc-400 mt-0.5">{tournamentName}</p>
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> 1st: Trophy & Champions
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950/70 uppercase text-[11px] font-bold text-zinc-400 tracking-wider border-b border-zinc-800">
            <tr>
              <th scope="col" className="py-3 px-4 w-12 text-center">Pos</th>
              <th scope="col" className="py-3 px-4">Club</th>
              <th scope="col" className="py-3 px-3 text-center">P</th>
              <th scope="col" className="py-3 px-3 text-center">W</th>
              <th scope="col" className="py-3 px-3 text-center">D</th>
              <th scope="col" className="py-3 px-3 text-center">L</th>
              <th scope="col" className="py-3 px-3 text-center hidden sm:table-cell">GF</th>
              <th scope="col" className="py-3 px-3 text-center hidden sm:table-cell">GA</th>
              <th scope="col" className="py-3 px-3 text-center">GD</th>
              <th scope="col" className="py-3 px-4 text-center font-black text-emerald-400">PTS</th>
              <th scope="col" className="py-3 px-4 text-center hidden md:table-cell">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-medium">
            {standings.map((row) => {
              const isFirst = row.rank === 1;
              return (
                <tr
                  key={row.team_id}
                  className={`hover:bg-zinc-800/40 transition-colors ${
                    isFirst ? 'bg-emerald-950/15' : ''
                  }`}
                >
                  {/* Position */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                        isFirst
                          ? 'bg-emerald-500 text-zinc-950 font-black'
                          : row.rank <= 3
                          ? 'bg-zinc-800 text-zinc-200'
                          : 'text-zinc-500'
                      }`}
                    >
                      {row.rank}
                    </span>
                  </td>

                  {/* Club */}
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <Link
                      href={`/teams/${row.team_id}`}
                      className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors group"
                    >
                      <span className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {row.team_crest || '⚽'}
                      </span>
                      <span className="truncate max-w-[160px] sm:max-w-xs">
                        {row.team_name}
                      </span>
                    </Link>
                  </td>

                  {/* Stats */}
                  <td className="py-3.5 px-3 text-center text-zinc-200">{row.played}</td>
                  <td className="py-3.5 px-3 text-center text-emerald-400 font-bold">{row.won}</td>
                  <td className="py-3.5 px-3 text-center text-amber-400">{row.drawn}</td>
                  <td className="py-3.5 px-3 text-center text-rose-400">{row.lost}</td>
                  <td className="py-3.5 px-3 text-center hidden sm:table-cell text-zinc-400">{row.goals_for}</td>
                  <td className="py-3.5 px-3 text-center hidden sm:table-cell text-zinc-400">{row.goals_against}</td>
                  <td className="py-3.5 px-3 text-center font-semibold">
                    <span
                      className={
                        row.goal_difference > 0
                          ? 'text-emerald-400'
                          : row.goal_difference < 0
                          ? 'text-rose-400'
                          : 'text-zinc-400'
                      }
                    >
                      {row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-black text-sm text-emerald-400">
                    {row.points}
                  </td>

                  {/* Form */}
                  <td className="py-3.5 px-4 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {row.form.length === 0 ? (
                        <span className="text-zinc-500 text-[10px]">-</span>
                      ) : (
                        row.form.map((res, i) => (
                          <span
                            key={i}
                            className={`h-5 w-5 rounded text-[10px] font-bold flex items-center justify-center ${
                              res === 'W'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : res === 'D'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {res}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-zinc-950/50 border-t border-zinc-800 text-[11px] text-zinc-500 flex flex-wrap items-center justify-between gap-2">
        <span>Standard scoring: 3 pts for Win, 1 pt for Draw, 0 pts for Loss.</span>
        <span>Tiebreaker: Points &gt; Goal Diff &gt; Goals Scored</span>
      </div>
    </div>
  );
}
