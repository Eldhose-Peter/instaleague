'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, Shield, UserCheck } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Profile } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { profiles, setCurrentUser } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const found = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      router.push(found.role === 'organizer' ? '/admin' : '/tournaments');
    } else {
      // Allow any login with default profile or captain
      const fallback = profiles[1] || profiles[0];
      setCurrentUser({
        ...fallback,
        email: email,
        full_name: email.split('@')[0],
      });
      router.push('/tournaments');
    }
  };

  const handleSelectDemoUser = (user: Profile) => {
    setCurrentUser(user);
    if (user.role === 'organizer') router.push('/admin');
    else router.push('/tournaments');
  };

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-zinc-950 shadow-lg shadow-emerald-500/20">
          <Trophy className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-black text-white">Welcome back to Instaleague</h1>
        <p className="text-xs text-zinc-400">
          Sign in to manage your squad, track fixtures, and view tournament stats.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Demo Fast Login Buttons */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
            Instant Demo Sign-in
          </span>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleSelectDemoUser(profiles[0])}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-xs text-left text-zinc-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-400" />
                <div>
                  <div className="font-semibold text-white">Marcus Vance</div>
                  <div className="text-[10px] text-zinc-400">Tournament Organizer</div>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                Organizer
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectDemoUser(profiles[1])}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-xs text-left text-zinc-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">Alex Morgan</div>
                  <div className="text-[10px] text-zinc-400">Apex FC Captain &amp; Forward</div>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Captain
              </span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-zinc-800" />
          <span className="bg-zinc-900 px-3 text-[10px] uppercase font-bold text-zinc-500 absolute">
            Or sign in with email
          </span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="captain@club.com"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
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
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-500 font-bold text-xs text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
          >
            Sign In
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-emerald-400 hover:underline font-semibold">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
