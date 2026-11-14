'use client';

import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, AlertCircle, CreditCard } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PaymentStatus, Tournament } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface RegistrationModalProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrationModal({
  tournament,
  isOpen,
  onClose,
}: RegistrationModalProps) {
  const { currentUser, teams, registrations, registerTeamForTournament } = useStore();

  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Find teams captained by current user
  const userCaptainTeams = currentUser
    ? teams.filter((t) => t.captain_id === currentUser.id)
    : [];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const teamIdToRegister = selectedTeamId || userCaptainTeams[0]?.id;

    if (!teamIdToRegister) {
      setError('Please select a team to register.');
      return;
    }

    // Check if team already registered
    const existing = registrations.find(
      (r) => r.tournament_id === tournament.id && r.team_id === teamIdToRegister
    );

    if (existing) {
      setError('This team is already registered for this tournament!');
      return;
    }

    registerTeamForTournament(tournament.id, teamIdToRegister, notes, paymentStatus);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-zinc-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Registration Submitted!</h3>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
              Your team application for <strong className="text-white">{tournament.name}</strong> has been submitted to the tournament organizers. You will receive a notification once reviewed.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-emerald-500 font-semibold text-sm text-zinc-950 hover:bg-emerald-400"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Tournament Entry Flow
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Register for {tournament.name}
              </h3>
              <p className="text-xs text-zinc-400">
                Entry Fee: <strong className="text-white">{formatCurrency(tournament.entry_fee)}</strong> • Prize Pool: <strong className="text-emerald-400">{formatCurrency(tournament.prize_pool)}</strong>
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 text-xs">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {userCaptainTeams.length === 0 ? (
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300 text-xs space-y-2">
                <p className="font-semibold">No team profile found under your account.</p>
                <p className="text-zinc-400">
                  You must be a team captain to register. You can create a team first or select any existing club below for demo testing:
                </p>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full mt-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white"
                >
                  <option value="">-- Choose a team to register as demo captain --</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.crest_url} {t.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Select Team
                </label>
                <select
                  value={selectedTeamId || userCaptainTeams[0]?.id}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {userCaptainTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.crest_url} {team.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Captain / Squad Notes (Kit colors, preferred kickoff times)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Primary kit: Red/White. Full 16-player squad verified."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Entry Fee Settlement Option */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-emerald-400" />
                  Entry Fee Settlement: {formatCurrency(tournament.entry_fee)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPaymentStatus('paid')}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    paymentStatus === 'paid'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold">Pay Entry Fee Now</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Instant online checkout</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentStatus('unpaid')}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    paymentStatus === 'unpaid'
                      ? 'border-amber-500 bg-amber-950/40 text-amber-300 font-bold'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold">Pay Upon Approval</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Settle later / cash</div>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 text-xs text-zinc-400 flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Organizer Review Guarantee</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Organizers will review team rosters for eligibility before scheduling fixtures. Entry fee is settled once accepted.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-500 font-bold text-xs text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Confirm Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
