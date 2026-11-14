'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Users, User, ArrowLeft } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PlayerPosition, UserRole } from '@/types';

export default function SignupPage() {
  const router = useRouter();
  const { setCurrentUser } = useStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('captain');
  const [position, setPosition] = useState<PlayerPosition>('FWD');
  const [jerseyNumber, setJerseyNumber] = useState<number>(10);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      full_name: fullName,
      role,
      position,
      jersey_number: Number(jerseyNumber),
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      created_at: new Date().toISOString(),
    };

    setCurrentUser(newUser);

    if (role === 'organizer') router.push('/admin');
    else if (role === 'captain') router.push('/teams/create');
    else router.push('/tournaments');
  };

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-12 space-y-6">
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Join Instaleague
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Create Your Account</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Choose your football role to start competing or organizing tournaments.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Select Your Platform Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('captain')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  role === 'captain'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Users className="mx-auto h-4 w-4 mb-1" />
                <div className="text-xs font-bold">Team Captain</div>
                <div className="text-[9px] text-zinc-500">Manage club &amp; squad</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('player')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  role === 'player'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <User className="mx-auto h-4 w-4 mb-1" />
                <div className="text-xs font-bold">Player</div>
                <div className="text-[9px] text-zinc-500">Track player stats</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('organizer')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  role === 'organizer'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Shield className="mx-auto h-4 w-4 mb-1" />
                <div className="text-xs font-bold">Organizer</div>
                <div className="text-[9px] text-zinc-500">Host competitions</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Harry Kane"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="harry@example.com"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {role !== 'organizer' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Primary Position
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as PlayerPosition)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="GK">Goalkeeper (GK)</option>
                  <option value="DEF">Defender (DEF)</option>
                  <option value="MID">Midfielder (MID)</option>
                  <option value="FWD">Forward (FWD)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Preferred Jersey Number
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-500 font-bold text-xs text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Complete Registration
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-zinc-400">
          Already registered?{' '}
          <Link href="/auth/login" className="text-emerald-400 hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
