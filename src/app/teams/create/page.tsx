'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { useStore } from '@/lib/store';

const CREST_EMOJIS = ['⚡', '🐂', '🎯', '🌊', '🦅', '🦁', '🐺', '🔥', '⚔️', '🛡️', '👑', '⭐'];

export default function CreateTeamPage() {
  const router = useRouter();
  const { createTeam, currentUser } = useStore();

  const [name, setName] = useState('');
  const [crestUrl, setCrestUrl] = useState('⚡');
  const [bio, setBio] = useState('');
  const [squadLimit, setSquadLimit] = useState(22);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a team name.');
      return;
    }

    const team = createTeam({
      name: name.trim(),
      crest_url: crestUrl,
      bio: bio.trim(),
      squad_limit: Number(squadLimit) || 22,
    });

    router.push(`/teams/${team.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        href="/teams"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Teams
      </Link>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Captain Club Creation
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Register a New Team</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Establish your club profile, assign a crest, and start building your roster to enter tournaments.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Team Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Camden Royals FC"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Crest / Badge Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Select Club Crest / Icon
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {CREST_EMOJIS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setCrestUrl(emoji)}
                  className={`h-12 w-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                    crestUrl === emoji
                      ? 'bg-emerald-500/20 border-2 border-emerald-500 scale-110 shadow-lg'
                      : 'border border-zinc-700 bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Team Bio */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Club Bio & Tactical Ethos
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Founded in 2024. Fast-paced, high pressing team playing in green and white."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Squad Limit */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Maximum Squad Size Limit
            </label>
            <input
              type="number"
              min={11}
              max={30}
              value={squadLimit}
              onChange={(e) => setSquadLimit(Number(e.target.value))}
              className="w-full sm:w-48 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Standard amateur squad limit is 22 to 25 registered players.
            </p>
          </div>

          {/* Captain info */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 flex items-center gap-3">
            <Shield className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <div className="text-xs text-zinc-300">
              <span className="font-semibold text-white">
                Captain: {currentUser?.full_name || 'Current User'}
              </span>
              <p className="text-[11px] text-zinc-500">
                You will automatically be designated as Captain with roster management permissions.
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <Link
              href="/teams"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 font-bold text-xs text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Establish Club Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
