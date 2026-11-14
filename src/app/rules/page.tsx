'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Scale,
  ShieldAlert,
  Trophy,
  Users,
  CheckCircle2,
} from 'lucide-react';

export default function RulesHubPage() {
  const [activeSection, setActiveSection] = useState<string>('format');

  const sections = [
    { id: 'format', title: '1. Format & Match Duration', icon: Scale },
    { id: 'points', title: '2. Points & Standings Tiebreakers', icon: Trophy },
    { id: 'roster', title: '3. Squad Registration & Eligibility', icon: Users },
    { id: 'discipline', title: '4. Disciplinary Code & Card Bans', icon: ShieldAlert },
    { id: 'prizes', title: '5. Prize Distribution & Conduct', icon: CheckCircle2 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-400">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Official Instaleague Rulebook</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Rules & Guidelines Hub
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Standardized competition rules, disciplinary policies, and tournament bylaws governing all football competitions hosted on the Instaleague platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-1.5 md:sticky md:top-24 h-fit">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 block mb-2">
            Table of Contents
          </span>
          {sections.map((s) => {
            const Icon = s.icon;
            const isSelected = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="md:col-span-3 space-y-8">
          {/* Section 1: Match Duration & Formats */}
          {activeSection === 'format' && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                <Scale className="h-6 w-6 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">
                  Match Formats & Duration
                </h2>
              </div>

              <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                  <h3 className="font-bold text-white text-sm">Regulation Match Time</h3>
                  <p>
                    All league matches consist of two equal halves of <strong>45 minutes</strong> with a standard 15-minute half-time interval. Referees add allowance for time lost in each period for substitutions, medical assessments, or delays.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                  <h3 className="font-bold text-white text-sm">Knockout Competitions & Extra Time</h3>
                  <p>
                    In single-elimination knockout tournament matches (Quarter Finals, Semi Finals, Finals), if the score is tied after full-time regulation:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400 pt-1">
                    <li>Quarter and Semi Finals proceed directly to a <strong>5-kick FIFA penalty shootout</strong>.</li>
                    <li>The Grand Final includes two 15-minute periods of extra time before penalties.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                  <h3 className="font-bold text-white text-sm">Substitutions</h3>
                  <p>
                    Teams are permitted up to <strong>5 substitutions</strong> from an approved bench of up to 7 players, made across a maximum of 3 stoppages during play (excluding the half-time break).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Points & Tiebreakers */}
          {activeSection === 'points' && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                <Trophy className="h-6 w-6 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">
                  Points Allocation & Standings Tiebreakers
                </h2>
              </div>

              <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-center">
                    <div className="text-2xl font-black text-emerald-400">3 PTS</div>
                    <div className="text-[11px] text-zinc-400 mt-1 font-semibold">Match Win</div>
                  </div>
                  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-center">
                    <div className="text-2xl font-black text-amber-400">1 PT</div>
                    <div className="text-[11px] text-zinc-400 mt-1 font-semibold">Match Draw</div>
                  </div>
                  <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 text-center">
                    <div className="text-2xl font-black text-rose-400">0 PTS</div>
                    <div className="text-[11px] text-zinc-400 mt-1 font-semibold">Match Loss</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-3">
                  <h3 className="font-bold text-white text-sm">Official Tiebreak Hierarchy</h3>
                  <p>
                    If two or more clubs are equal on total points at the conclusion of all scheduled rounds, final table positions are decided by:
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-zinc-300 font-medium">
                    <li><strong className="text-white">Goal Difference (GD)</strong>: Total Goals For minus Total Goals Against.</li>
                    <li><strong className="text-white">Goals For (GF)</strong>: Greater number of total goals scored in all tournament fixtures.</li>
                    <li><strong className="text-white">Head-to-Head Result</strong>: Points obtained in matches between the teams concerned.</li>
                    <li><strong className="text-white">Disciplinary Fair Play Record</strong>: Fewer card points (Yellow = 1 pt, Red = 3 pts).</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Squad Registration */}
          {activeSection === 'roster' && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                <Users className="h-6 w-6 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">
                  Squad Registration & Player Eligibility
                </h2>
              </div>

              <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                  <h3 className="font-bold text-white text-sm">Squad Size Capacity</h3>
                  <p>
                    Each club may register a minimum of 14 players and a maximum of <strong>22 to 25 players</strong> as designated by the tournament organizer. All players must hold an active profile on Instaleague.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                  <h3 className="font-bold text-white text-sm">Unique Jersey Numbers</h3>
                  <p>
                    Every rostered player must be allocated a distinct jersey number between 0 and 99. No duplicate jersey numbers may appear on the pitch simultaneously.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                  <h3 className="font-bold text-white text-sm">Roster Freeze Deadline</h3>
                  <p>
                    Team rosters are locked <strong>48 hours</strong> prior to the opening match of the tournament. No unlisted &quot;ringers&quot; or guest players are permitted without written organizer authorization. Fielded ineligible players will result in automatic match forfeit (awarded as 3-0 loss).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Discipline & Cards */}
          {activeSection === 'discipline' && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                <ShieldAlert className="h-6 w-6 text-rose-400" />
                <h2 className="text-xl font-bold text-white">
                  Disciplinary Code & Suspensions
                </h2>
              </div>

              <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                    <span className="h-4 w-3 rounded-xs bg-amber-400 inline-block shadow-sm" />
                    Yellow Card Accumulation
                  </div>
                  <p className="text-zinc-300">
                    A player who accumulates <strong>2 yellow cards</strong> across consecutive matches incurs an automatic <strong>1-match suspension</strong> effective immediately for the next scheduled tournament fixture.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
                    <span className="h-4 w-3 rounded-xs bg-rose-600 inline-block shadow-sm" />
                    Red Card Infractions
                  </div>
                  <p className="text-zinc-300">
                    A player receiving a straight red card is sent off immediately. Disciplinary committee reviews determine the suspension severity:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400 pt-1">
                    <li>Denying an obvious goal-scoring opportunity (DOGSO): <strong>1-match ban</strong>.</li>
                    <li>Violent conduct or abusive language towards match officials: <strong>3-match ban up to permanent tournament expulsion</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Prizes & Conduct */}
          {activeSection === 'prizes' && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">
                  Prizes & Code of Conduct
                </h2>
              </div>

              <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                  <h3 className="font-bold text-white text-sm">Prize Disbursement</h3>
                  <p>
                    All prize money (Champions 70%, Runners-Up 30%) is disbursed to the verified team captain via bank transfer or Stripe payout within 5 business days of tournament conclusion.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                  <h3 className="font-bold text-white text-sm">Sportsmanship & Fair Play</h3>
                  <p>
                    Instaleague upholds a zero-tolerance policy against referee intimidation, pitch violence, or discrimination. Respect towards referees, opposing players, and facility staff is compulsory for all teams.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
