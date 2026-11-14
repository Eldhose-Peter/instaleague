'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Shield, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-zinc-950 shadow-md">
                <Trophy className="h-4 w-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                INSTA<span className="text-emerald-400">LEAGUE</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The premier grassroots football competition platform. Empowering teams, captains, and tournament organizers with live points tables, automated scheduling, and professional match tracking.
            </p>
          </div>

          {/* Tournaments */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-200 mb-3">
              Tournaments
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tournaments" className="hover:text-emerald-400 transition-colors">
                  All Tournaments
                </Link>
              </li>
              <li>
                <Link href="/tournaments/tour-premier-2026" className="hover:text-emerald-400 transition-colors">
                  Premier Cup 2026
                </Link>
              </li>
              <li>
                <Link href="/tournaments/tour-knockout-2026" className="hover:text-emerald-400 transition-colors">
                  Winter Knockout Invitational
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-emerald-400 transition-colors">
                  Tournament Rules & Scoring
                </Link>
              </li>
            </ul>
          </div>

          {/* Teams & Players */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-200 mb-3">
              Teams & Players
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/teams" className="hover:text-emerald-400 transition-colors">
                  Browse Teams
                </Link>
              </li>
              <li>
                <Link href="/teams/team-apex" className="hover:text-emerald-400 transition-colors">
                  Apex FC Profile
                </Link>
              </li>
              <li>
                <Link href="/teams/team-redbulls" className="hover:text-emerald-400 transition-colors">
                  Red Bulls United
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-emerald-400 transition-colors">
                  Roster Limits & Codes
                </Link>
              </li>
            </ul>
          </div>

          {/* Organizer */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-200 mb-3">
              Organizers & Tech
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/fixtures" className="hover:text-emerald-400 transition-colors">
                  Automated Fixture Generator
                </Link>
              </li>
              <li>
                <Link href="/admin/applications" className="hover:text-emerald-400 transition-colors">
                  Team Application Review
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-zinc-500">
                Built with Next.js, Supabase & Vercel
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© 2026 Instaleague Ltd. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Engineered with <Heart className="h-3 w-3 text-emerald-400 fill-emerald-400" /> for the football community.
          </p>
        </div>
      </div>
    </footer>
  );
}
