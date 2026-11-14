'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  Filter,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { RegistrationStatus } from '@/types';

export default function AdminApplicationsPage() {
  const {
    registrations,
    tournaments,
    teams,
    updateRegistrationStatus,
    updatePaymentStatus,
  } = useStore();

  const [selectedTournament, setSelectedTournament] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | RegistrationStatus>('all');

  const teamsMap = new Map(teams.map((t) => [t.id, t]));
  const tournamentsMap = new Map(tournaments.map((t) => [t.id, t]));

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    if (selectedTournament !== 'all' && reg.tournament_id !== selectedTournament) {
      return false;
    }
    if (selectedStatus !== 'all' && reg.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Admissions Desk
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Application Management</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review club tournament registrations, verify eligibility, and approve squads into the official bracket.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="h-4 w-4 text-zinc-400" />
          <span className="font-semibold text-zinc-300">Tournament:</span>
          <select
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="all">All Tournaments</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                selectedStatus === status
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-xl">
        {filteredRegistrations.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-500">
            No registration applications match the selected filter.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/70 uppercase text-[11px] font-bold text-zinc-400 tracking-wider border-b border-zinc-800">
              <tr>
                <th scope="col" className="py-3 px-4">Club</th>
                <th scope="col" className="py-3 px-4">Tournament</th>
                <th scope="col" className="py-3 px-4 text-center">Applied Date</th>
                <th scope="col" className="py-3 px-4 text-center">Entry Fee</th>
                <th scope="col" className="py-3 px-4 text-center">Status</th>
                <th scope="col" className="py-3 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {filteredRegistrations.map((reg) => {
                const team = teamsMap.get(reg.team_id);
                const tour = tournamentsMap.get(reg.tournament_id);

                return (
                  <tr key={reg.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{team?.crest_url || '⚽'}</span>
                        <div>
                          <Link
                            href={`/teams/${team?.id}`}
                            className="font-bold text-white hover:text-emerald-400"
                          >
                            {team?.name || 'Club'}
                          </Link>
                          {reg.notes && (
                            <div className="text-[10px] text-zinc-400 italic line-clamp-1">
                              &quot;{reg.notes}&quot;
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Link
                        href={`/tournaments/${tour?.id}`}
                        className="font-semibold text-zinc-200 hover:text-emerald-400"
                      >
                        {tour?.name || 'Tournament'}
                      </Link>
                      <div className="text-[10px] text-zinc-500">
                        {tour?.location}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center text-zinc-400">
                      {formatDate(reg.registered_at)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() =>
                          updatePaymentStatus(
                            reg.id,
                            reg.payment_status === 'paid' ? 'unpaid' : 'paid'
                          )
                        }
                        title="Click to toggle payment status"
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                          reg.payment_status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        }`}
                      >
                        {reg.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          reg.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : reg.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {reg.status !== 'approved' && (
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'approved')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-[11px] hover:bg-emerald-400 transition-colors shadow-sm"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </button>
                        )}
                        {reg.status !== 'rejected' && (
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'rejected')}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 font-bold text-[11px] hover:bg-rose-950/40 transition-colors"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
