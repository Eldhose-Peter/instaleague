'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Shield,
  UserPlus,
  Share2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Calendar,
  X,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { PlayerPosition } from '@/types';
import { formatDate } from '@/lib/utils';

export default function TeamProfilePage() {
  const params = useParams();
  const teamId = params?.id as string;

  const {
    teams,
    teamMembers,
    profiles,
    currentUser,
    matches,
    addTeamMember,
    removeTeamMember,
  } = useStore();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states for adding player
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>('MID');
  const [jerseyNumber, setJerseyNumber] = useState<number>(11);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const team = teams.find((t) => t.id === teamId || t.slug === teamId);

  if (!team) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Team not found</h2>
        <Link
          href="/teams"
          className="inline-block px-4 py-2 rounded-lg bg-emerald-500 font-semibold text-xs text-zinc-950"
        >
          Return to Teams Directory
        </Link>
      </div>
    );
  }

  const profilesMap = new Map(profiles.map((p) => [p.id, p]));
  const captain = profilesMap.get(team.captain_id);

  // Roster
  const roster = teamMembers
    .filter((m) => m.team_id === team.id)
    .map((m) => ({
      ...m,
      profile: profilesMap.get(m.user_id),
    }))
    .sort((a, b) => a.jersey_number - b.jersey_number);

  // Permission check
  const isCaptain = currentUser?.id === team.captain_id;
  const isOrganizer = currentUser?.role === 'organizer';
  const canManage = isCaptain || isOrganizer;

  // Team Matches
  const teamMatches = matches
    .filter((m) => m.home_team_id === team.id || m.away_team_id === team.id)
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());

  const handleCopyInvite = () => {
    if (typeof window !== 'undefined') {
      const inviteUrl = `${window.location.origin}/teams/${team.id}?invite=active`;
      navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!playerName.trim() || !playerEmail.trim()) {
      setError('Please provide player name and valid email.');
      return;
    }

    if (roster.length >= team.squad_limit) {
      setError(`Squad limit of ${team.squad_limit} players reached.`);
      return;
    }

    // Check if jersey number taken
    const numberTaken = roster.some((m) => m.jersey_number === Number(jerseyNumber));
    if (numberTaken) {
      setError(`Jersey #${jerseyNumber} is already taken in this squad.`);
      return;
    }

    addTeamMember(team.id, {
      fullName: playerName.trim(),
      email: playerEmail.trim(),
      position: playerPosition,
      jerseyNumber: Number(jerseyNumber),
      role: 'player',
    });

    setSuccessMsg(`Added ${playerName} to roster!`);
    setPlayerName('');
    setPlayerEmail('');
    setJerseyNumber((prev) => prev + 1);
    setTimeout(() => {
      setIsInviteModalOpen(false);
      setSuccessMsg('');
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      {/* Header Profile Card */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-zinc-800/90 border-2 border-zinc-700 text-5xl sm:text-6xl shadow-xl">
              {team.crest_url || '⚽'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 uppercase">
                  Verified Club
                </span>
                <span className="text-xs text-zinc-400">
                  Est. {new Date(team.created_at).getFullYear()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
                {team.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mt-2 leading-relaxed">
                {team.bio || 'Affiliated football club.'}
              </p>
            </div>
          </div>

          {/* Captain & Action Buttons */}
          <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
            <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 text-xs text-zinc-300 flex items-center gap-2.5">
              <Shield className="h-4 w-4 text-emerald-400" />
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">Captain</span>
                <span className="font-bold text-white">
                  {captain?.full_name || 'Captain'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyInvite}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                {copiedLink ? 'Link Copied!' : 'Share Invite Link'}
              </button>

              {canManage && (
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 font-bold text-xs text-zinc-950 hover:bg-emerald-400 transition-colors shadow-md"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Player
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Squad Limit Progress */}
        <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <Users className="h-4 w-4 text-emerald-400" />
            <span>
              Squad Registration Status: <strong className="text-white">{roster.length}</strong> / {team.squad_limit} Players
            </span>
          </div>

          <div className="w-full sm:w-48 bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${(roster.length / team.squad_limit) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Roster Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-400" />
            Official Squad Roster ({roster.length})
          </h2>
          {canManage && (
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              + Add / Invite Squad Member
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-xl">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/70 uppercase text-[11px] font-bold text-zinc-400 tracking-wider border-b border-zinc-800">
              <tr>
                <th scope="col" className="py-3 px-4 w-14 text-center">No.</th>
                <th scope="col" className="py-3 px-4">Player</th>
                <th scope="col" className="py-3 px-4 text-center">Position</th>
                <th scope="col" className="py-3 px-4 text-center">Role</th>
                <th scope="col" className="py-3 px-4 text-center">Status</th>
                {canManage && (
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {roster.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-zinc-800/40 transition-colors"
                >
                  <td className="py-3 px-4 text-center font-mono font-bold text-zinc-400">
                    #{member.jersey_number}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
                        {member.profile?.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={member.profile.avatar_url}
                            alt={member.profile.full_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center font-bold text-zinc-400">
                            {member.profile?.full_name?.charAt(0) || 'P'}
                          </div>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/players/${member.user_id}`}
                          className="font-bold text-white hover:text-emerald-400 transition-colors"
                        >
                          {member.profile?.full_name || 'Player'}
                        </Link>
                        <div className="text-[10px] text-zinc-500">
                          {member.profile?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        member.position === 'GK'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : member.position === 'DEF'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : member.position === 'MID'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {member.position}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        member.role === 'captain'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : 'text-zinc-400'
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </td>
                  {canManage && (
                    <td className="py-3 px-4 text-right">
                      {member.role !== 'captain' && (
                        <button
                          onClick={() => removeTeamMember(member.id)}
                          title="Remove player"
                          className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Matches History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-400" />
          Recent Matches & Schedule
        </h2>

        {teamMatches.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-xs text-zinc-400">
            No matches scheduled for this team yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMatches.map((m) => {
              const home = teams.find((t) => t.id === m.home_team_id);
              const away = teams.find((t) => t.id === m.away_team_id);
              const isCompleted = m.status === 'completed';

              return (
                <Link
                  key={m.id}
                  href={`/matches/${m.id}`}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-[10px] text-zinc-500">
                      Round {m.round} • {formatDate(m.scheduled_at)}
                    </div>
                    <div className="flex items-center gap-3 font-semibold text-xs text-white">
                      <span>{home?.crest_url} {home?.name}</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {isCompleted ? `${m.home_score} - ${m.away_score}` : 'vs'}
                      </span>
                      <span>{away?.crest_url} {away?.name}</span>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 group-hover:text-emerald-400 font-bold">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Player Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-zinc-100">
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>

            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Roster Management
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Add Player to {team.name}
                </h3>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 text-xs">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-xs">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="e.g. David Silva"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={playerEmail}
                  onChange={(e) => setPlayerEmail(e.target.value)}
                  placeholder="e.g. david.silva@example.com"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Position
                  </label>
                  <select
                    value={playerPosition}
                    onChange={(e) => setPlayerPosition(e.target.value as PlayerPosition)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="GK">Goalkeeper (GK)</option>
                    <option value="DEF">Defender (DEF)</option>
                    <option value="MID">Midfielder (MID)</option>
                    <option value="FWD">Forward (FWD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Jersey Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    required
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-500 font-bold text-xs text-zinc-950 hover:bg-emerald-400 transition-colors shadow-md"
                >
                  Add Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
