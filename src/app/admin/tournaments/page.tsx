'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  ArrowLeft,
  X,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { TournamentFormat, TournamentStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminTournamentsPage() {
  const { tournaments, createTournament, updateTournament } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState<TournamentFormat>('round_robin');
  const [status, setStatus] = useState<TournamentStatus>('upcoming');
  const [entryFee, setEntryFee] = useState<number>(100);
  const [prizePool, setPrizePool] = useState<number>(1500);
  const [maxTeams, setMaxTeams] = useState<number>(8);
  const [location, setLocation] = useState('West London Sports Park');
  const [venues, setVenues] = useState('Pitch 1, Pitch 2, Main Stadium');
  const [startDate, setStartDate] = useState('2026-12-01');
  const [endDate, setEndDate] = useState('2026-12-28');
  const [rules, setRules] = useState('Standard FIFA 90-min matches. 3 points for win, 1 for draw.');
  const [error, setError] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a tournament name.');
      return;
    }

    const venueList = venues
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    createTournament({
      name: name.trim(),
      description: description.trim(),
      format,
      status,
      entry_fee: Number(entryFee),
      prize_pool: Number(prizePool),
      max_teams: Number(maxTeams),
      location: location.trim(),
      venues: venueList.length > 0 ? venueList : ['Main Pitch'],
      start_date: startDate,
      end_date: endDate,
      rules: rules.trim(),
      banner_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200',
    });

    setIsModalOpen(false);
    setName('');
    setDescription('');
  };

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
            Tournament Director
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Tournament Management</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create new competitions, adjust formats, configure prize pools, and update tournament lifecycle status.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 font-bold text-xs text-zinc-950 hover:bg-emerald-400 transition-all shadow-md"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Tournament
        </button>
      </div>

      {/* Tournaments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tour) => (
          <div
            key={tour.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 flex flex-col justify-between shadow-xl space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-300 uppercase">
                  {tour.format.replace('_', ' ')}
                </span>

                {/* Status Switcher Dropdown */}
                <select
                  value={tour.status}
                  onChange={(e) =>
                    updateTournament(tour.id, {
                      status: e.target.value as TournamentStatus,
                    })
                  }
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                    tour.status === 'ongoing'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : tour.status === 'upcoming'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{tour.name}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                  {tour.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-800 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Prize Pool:</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(tour.prize_pool)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Entry Fee:</span>
                  <span>{formatCurrency(tour.entry_fee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Max Teams:</span>
                  <span>{tour.max_teams} Teams</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Dates:</span>
                  <span>
                    {formatDate(tour.start_date)} - {formatDate(tour.end_date)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href={`/tournaments/${tour.id}`}
                className="text-xs text-zinc-400 hover:text-white"
              >
                View Public Hub →
              </Link>
              <Link
                href={`/admin/fixtures?tournamentId=${tour.id}`}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-emerald-400"
              >
                Fixtures →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 shadow-2xl text-zinc-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Organizer Tool
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Create Football Tournament
                </h3>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 text-xs">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Tournament Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. London Winter Championship 2026"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as TournamentFormat)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="round_robin">Round-Robin League</option>
                    <option value="knockout">Single Elimination Knockout</option>
                    <option value="group_knockout">Group Stage to Knockout</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TournamentStatus)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="upcoming">Upcoming (Registration Open)</option>
                    <option value="ongoing">Ongoing (Fixtures Scheduled)</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Prize Pool (£)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={prizePool}
                    onChange={(e) => setPrizePool(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Entry Fee (£)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={entryFee}
                    onChange={(e) => setEntryFee(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Max Teams
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={32}
                    value={maxTeams}
                    onChange={(e) => setMaxTeams(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Location (City / Complex)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. West London Sports Park"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Pitches & Venues (comma-separated)
                </label>
                <input
                  type="text"
                  value={venues}
                  onChange={(e) => setVenues(e.target.value)}
                  placeholder="Pitch 1 (Grandstand), Pitch 2 (Floodlit)"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Competition Rules & Regulations
                </label>
                <input
                  type="text"
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="Standard FIFA rules, 3 points for win"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Tournament Overview & Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Flagship competition format details..."
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 font-bold text-xs text-zinc-950 hover:bg-emerald-400 transition-colors shadow-md"
                >
                  Launch Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
