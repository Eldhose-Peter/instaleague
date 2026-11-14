'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  CheckCircle,
  Plus,
  Minus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { MatchEventType, MatchStatus } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminMatchDetailPage() {
  const params = useParams();
  const matchId = params?.id as string;

  const {
    matches,
    teams,
    tournaments,
    matchEvents,
    teamMembers,
    profiles,
    updateMatchScore,
    addMatchEvent,
    removeMatchEvent,
  } = useStore();

  const match = matches.find((m) => m.id === matchId);

  // Score states
  const [homeScore, setHomeScore] = useState<number>(match?.home_score ?? 0);
  const [awayScore, setAwayScore] = useState<number>(match?.away_score ?? 0);
  const [status, setStatus] = useState<MatchStatus>(match?.status ?? 'completed');
  const [notes, setNotes] = useState<string>(match?.notes ?? '');
  const [scoreSaved, setScoreSaved] = useState(false);

  // Event modal/form states
  const [eventType, setEventType] = useState<MatchEventType>('goal');
  const [eventTeamId, setEventTeamId] = useState<string>(match?.home_team_id || '');
  const [eventPlayerId, setEventPlayerId] = useState<string>('');
  const [eventAssistId, setEventAssistId] = useState<string>('');
  const [eventMinute, setEventMinute] = useState<number>(45);
  const [eventNotes, setEventNotes] = useState<string>('');

  if (!match) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Match not found</h2>
        <Link
          href="/admin/matches"
          className="inline-block px-4 py-2 rounded-lg bg-emerald-500 font-semibold text-xs text-zinc-950"
        >
          Back to Match List
        </Link>
      </div>
    );
  }

  const tournament = tournaments.find((t) => t.id === match.tournament_id);
  const homeTeam = teams.find((t) => t.id === match.home_team_id);
  const awayTeam = teams.find((t) => t.id === match.away_team_id);

  const profilesMap = new Map(profiles.map((p) => [p.id, p]));

  // Rosters
  const homeRoster = teamMembers
    .filter((m) => m.team_id === match.home_team_id)
    .map((m) => ({ ...m, profile: profilesMap.get(m.user_id) }));

  const awayRoster = teamMembers
    .filter((m) => m.team_id === match.away_team_id)
    .map((m) => ({ ...m, profile: profilesMap.get(m.user_id) }));

  // Events for this match
  const events = matchEvents
    .filter((e) => e.match_id === match.id)
    .sort((a, b) => a.minute - b.minute);

  const activeRoster =
    eventTeamId === match.home_team_id ? homeRoster : awayRoster;

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    updateMatchScore(match.id, homeScore, awayScore, status, notes);
    setScoreSaved(true);
    setTimeout(() => setScoreSaved(false), 2500);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTeamId) return;

    addMatchEvent({
      match_id: match.id,
      team_id: eventTeamId,
      player_id: eventPlayerId || undefined,
      assist_player_id: eventAssistId || undefined,
      event_type: eventType,
      minute: Number(eventMinute) || 1,
      notes: eventNotes.trim() || undefined,
    });

    // If goal event, also sync the local score state
    if (eventType === 'goal') {
      if (eventTeamId === match.home_team_id) {
        setHomeScore((prev) => prev + 1);
      } else {
        setAwayScore((prev) => prev + 1);
      }
    }

    setEventNotes('');
    setEventPlayerId('');
    setEventAssistId('');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <Link
        href="/admin/matches"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Matches Queue
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Official Match Center
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Live Match Console</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {tournament?.name} • Round {match.round} • {formatDate(match.scheduled_at)}
          </p>
        </div>

        <Link
          href={`/matches/${match.id}`}
          className="text-xs text-emerald-400 hover:underline font-semibold"
        >
          View Public Match Center →
        </Link>
      </div>

      {/* Real-time sync feedback notification */}
      <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-xs text-zinc-300 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Automatic Reactive Computation:</strong> Any score adjustments or goal/card logs submitted here immediately calculate and update the Tournament Standings, Form Guides, and Leaderboards.
          </span>
        </div>
        <Link
          href={`/tournaments/${tournament?.id}`}
          className="text-emerald-400 hover:underline font-bold whitespace-nowrap"
        >
          View Table →
        </Link>
      </div>

      {/* Main Score Editor Card */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            Match Score &amp; Status Control
          </h3>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-zinc-400">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MatchStatus)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="scheduled">Scheduled</option>
              <option value="live">Live (In Progress)</option>
              <option value="completed">Completed (Full Time)</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Big Score Adjustment Grid */}
        <div className="grid grid-cols-7 items-center gap-4">
          {/* Home Team Score Controls */}
          <div className="col-span-3 flex flex-col items-center sm:items-end space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-4xl">{homeTeam?.crest_url}</span>
              <span className="text-base sm:text-xl font-bold text-white">
                {homeTeam?.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHomeScore((prev) => Math.max(0, prev - 1))}
                className="h-10 w-10 rounded-xl border border-zinc-700 bg-zinc-800 text-white font-bold flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min={0}
                value={homeScore}
                onChange={(e) => setHomeScore(Math.max(0, Number(e.target.value)))}
                className="h-14 w-20 rounded-2xl border border-zinc-700 bg-zinc-950 font-mono text-3xl font-black text-center text-emerald-400 focus:outline-none focus:border-emerald-500 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setHomeScore((prev) => prev + 1)}
                className="h-10 w-10 rounded-xl border border-zinc-700 bg-zinc-800 text-white font-bold flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Center Divider */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-bold text-zinc-600">:</span>
          </div>

          {/* Away Team Score Controls */}
          <div className="col-span-3 flex flex-col items-center sm:items-start space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-4xl">{awayTeam?.crest_url}</span>
              <span className="text-base sm:text-xl font-bold text-white">
                {awayTeam?.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAwayScore((prev) => Math.max(0, prev - 1))}
                className="h-10 w-10 rounded-xl border border-zinc-700 bg-zinc-800 text-white font-bold flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min={0}
                value={awayScore}
                onChange={(e) => setAwayScore(Math.max(0, Number(e.target.value)))}
                className="h-14 w-20 rounded-2xl border border-zinc-700 bg-zinc-950 font-mono text-3xl font-black text-center text-emerald-400 focus:outline-none focus:border-emerald-500 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setAwayScore((prev) => prev + 1)}
                className="h-10 w-10 rounded-xl border border-zinc-700 bg-zinc-800 text-white font-bold flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Match Notes */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Official Referee Notes &amp; Observations
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Competitive fixture. High intensity midfield battle, no injuries."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {scoreSaved ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle className="h-4 w-4" /> Match score and standings updated!
            </span>
          ) : (
            <span className="text-xs text-zinc-500">
              Click &quot;Save Match Score&quot; to push changes.
            </span>
          )}

          <button
            onClick={handleSaveScore}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 font-bold text-xs text-zinc-950 hover:bg-emerald-400 transition-colors shadow-md"
          >
            Save Match Score
          </button>
        </div>
      </div>

      {/* Log Match Event (Goals, Assists, Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Event Form */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-5 h-fit shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Plus className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Log Match Event</h3>
          </div>

          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as MatchEventType)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="goal">⚽ Goal Scored</option>
                <option value="yellow_card">🟨 Yellow Card</option>
                <option value="red_card">🟥 Red Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Club Involved
              </label>
              <select
                value={eventTeamId || match.home_team_id}
                onChange={(e) => {
                  setEventTeamId(e.target.value);
                  setEventPlayerId('');
                  setEventAssistId('');
                }}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={homeTeam?.id}>
                  {homeTeam?.crest_url} {homeTeam?.name} (Home)
                </option>
                <option value={awayTeam?.id}>
                  {awayTeam?.crest_url} {awayTeam?.name} (Away)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Player Involved
              </label>
              <select
                value={eventPlayerId}
                onChange={(e) => setEventPlayerId(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Select Player from Squad --</option>
                {activeRoster.map((m) => (
                  <option key={m.id} value={m.user_id}>
                    #{m.jersey_number} - {m.profile?.full_name} ({m.position})
                  </option>
                ))}
              </select>
            </div>

            {eventType === 'goal' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Assist Provider (Optional)
                </label>
                <select
                  value={eventAssistId}
                  onChange={(e) => setEventAssistId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- No Assist / Unassisted --</option>
                  {activeRoster
                    .filter((m) => m.user_id !== eventPlayerId)
                    .map((m) => (
                      <option key={m.id} value={m.user_id}>
                        #{m.jersey_number} - {m.profile?.full_name} ({m.position})
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Minute of Match (1 - 90+)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                required
                value={eventMinute}
                onChange={(e) => setEventMinute(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Event Description / Commentary
              </label>
              <input
                type="text"
                value={eventNotes}
                onChange={(e) => setEventNotes(e.target.value)}
                placeholder="e.g. Header from near post corner."
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 font-bold text-xs text-zinc-950 hover:bg-emerald-400 transition-colors shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add Match Event
            </button>
          </form>
        </div>

        {/* Existing Match Events Timeline */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              Logged Events ({events.length})
            </h3>
            <span className="text-[11px] text-zinc-400">Chronological</span>
          </div>

          {events.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No match events logged yet. Use the form on the left to add goals and cards.
            </div>
          ) : (
            <div className="space-y-2.5">
              {events.map((ev) => {
                const player = profilesMap.get(ev.player_id || '');
                const assist = profilesMap.get(ev.assist_player_id || '');
                const team = teams.find((t) => t.id === ev.team_id);

                return (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-emerald-400 rounded bg-zinc-900 px-1.5 py-0.5">
                        {ev.minute}&apos;
                      </span>

                      <div>
                        <div className="flex items-center gap-2 font-semibold text-white">
                          <span>{team?.crest_url}</span>
                          <span>{player?.full_name || 'Player'}</span>
                          {ev.event_type === 'goal' && (
                            <span className="text-emerald-400 font-bold">⚽ Goal</span>
                          )}
                          {ev.event_type === 'yellow_card' && (
                            <span className="text-amber-400 font-bold">🟨 Yellow Card</span>
                          )}
                          {ev.event_type === 'red_card' && (
                            <span className="text-rose-400 font-bold">🟥 Red Card</span>
                          )}
                        </div>

                        {assist && (
                          <div className="text-[10px] text-zinc-400 mt-0.5">
                            Assist: {assist.full_name}
                          </div>
                        )}

                        {ev.notes && (
                          <div className="text-[10px] text-zinc-500 italic mt-0.5">
                            &quot;{ev.notes}&quot;
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeMatchEvent(ev.id)}
                      title="Delete event"
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
