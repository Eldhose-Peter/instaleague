'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppNotification,
  CleanSheetRow,
  DisciplinaryRow,
  Match,
  MatchEvent,
  MatchStatus,
  PaymentStatus,
  PlayerPosition,
  Profile,
  RegistrationStatus,
  StandingRow,
  Team,
  TeamMember,
  TopAssistRow,
  TopScorerRow,
  Tournament,
  TournamentRegistration,
} from '@/types';
import {
  INITIAL_MATCH_EVENTS,
  INITIAL_MATCHES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROFILES,
  INITIAL_REGISTRATIONS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_TEAMS,
  INITIAL_TOURNAMENTS,
} from './initialData';
import { calculateStandings } from '../standingsCalculator';
import {
  calculateCleanSheets,
  calculateDisciplinary,
  calculateTopAssists,
  calculateTopScorers,
  getPlayerIndividualStats,
} from '../statsCalculator';
import {
  FixtureGeneratorOptions,
  generateKnockoutFixtures,
  generateRoundRobinFixtures,
} from '../fixtureGenerator';

interface StoreContextType {
  currentUser: Profile | null;
  setCurrentUser: (user: Profile | null) => void;
  profiles: Profile[];
  teams: Team[];
  teamMembers: TeamMember[];
  tournaments: Tournament[];
  registrations: TournamentRegistration[];
  matches: Match[];
  matchEvents: MatchEvent[];
  notifications: AppNotification[];

  // Mutators
  createTournament: (data: Omit<Tournament, 'id' | 'slug' | 'created_at'>) => Tournament;
  updateTournament: (id: string, data: Partial<Tournament>) => void;
  createTeam: (data: { name: string; bio: string; crest_url: string; squad_limit?: number }) => Team;
  updateTeam: (id: string, data: Partial<Team>) => void;
  addTeamMember: (
    teamId: string,
    member: {
      fullName: string;
      email: string;
      position: PlayerPosition;
      jerseyNumber: number;
      role?: 'captain' | 'player';
    }
  ) => TeamMember;
  removeTeamMember: (memberId: string) => void;
  registerTeamForTournament: (
    tournamentId: string,
    teamId: string,
    notes?: string,
    paymentStatus?: PaymentStatus
  ) => TournamentRegistration;
  updateRegistrationStatus: (
    registrationId: string,
    status: RegistrationStatus
  ) => void;
  updatePaymentStatus: (
    registrationId: string,
    status: PaymentStatus
  ) => void;
  generateFixturesForTournament: (
    tournamentId: string,
    options?: Partial<FixtureGeneratorOptions>
  ) => Match[];
  updateMatchScore: (
    matchId: string,
    homeScore: number,
    awayScore: number,
    status?: MatchStatus,
    notes?: string,
    penaltyHomeScore?: number,
    penaltyAwayScore?: number
  ) => void;
  addMatchEvent: (
    event: Omit<MatchEvent, 'id' | 'created_at'>
  ) => MatchEvent;
  removeMatchEvent: (eventId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDefaultData: () => void;

  // Selectors
  getTournamentStandings: (tournamentId: string) => StandingRow[];
  getTournamentScorers: (tournamentId: string) => TopScorerRow[];
  getTournamentAssists: (tournamentId: string) => TopAssistRow[];
  getTournamentCleanSheets: (tournamentId: string) => CleanSheetRow[];
  getTournamentDisciplinary: (tournamentId: string) => DisciplinaryRow[];
  getTeamById: (teamId: string) => Team | undefined;
  getTeamRoster: (teamId: string) => (TeamMember & { profile?: Profile })[];
  getPlayerProfile: (playerId: string) => Profile | undefined;
  getPlayerStats: (playerId: string) => ReturnType<typeof getPlayerIndividualStats>;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY_PREFIX = 'instaleague_data_v1';

function getInitialStoredData() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Lazy-initialize states from storage or fallback to defaults
  const [currentUser, setCurrentUserState] = useState<Profile | null>(() => {
    const data = getInitialStoredData();
    if (data?.currentUserId) {
      const user = (data.profiles || INITIAL_PROFILES).find(
        (p: Profile) => p.id === data.currentUserId
      );
      if (user) return user;
    }
    return INITIAL_PROFILES[1];
  });

  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const data = getInitialStoredData();
    return data?.profiles || INITIAL_PROFILES;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const data = getInitialStoredData();
    return data?.teams || INITIAL_TEAMS;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const data = getInitialStoredData();
    return data?.teamMembers || INITIAL_TEAM_MEMBERS;
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const data = getInitialStoredData();
    return data?.tournaments || INITIAL_TOURNAMENTS;
  });

  const [registrations, setRegistrations] = useState<TournamentRegistration[]>(() => {
    const data = getInitialStoredData();
    return data?.registrations || INITIAL_REGISTRATIONS;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const data = getInitialStoredData();
    return data?.matches || INITIAL_MATCHES;
  });

  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>(() => {
    const data = getInitialStoredData();
    return data?.matchEvents || INITIAL_MATCH_EVENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const data = getInitialStoredData();
    return data?.notifications || INITIAL_NOTIFICATIONS;
  });

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      const stateToPersist = {
        currentUserId: currentUser?.id,
        profiles,
        teams,
        teamMembers,
        tournaments,
        registrations,
        matches,
        matchEvents,
        notifications,
      };
      localStorage.setItem(STORAGE_KEY_PREFIX, JSON.stringify(stateToPersist));
    } catch {
      // Ignore write errors (quota, private browsing)
    }
  }, [
    currentUser,
    profiles,
    teams,
    teamMembers,
    tournaments,
    registrations,
    matches,
    matchEvents,
    notifications,
  ]);

  const setCurrentUser = (user: Profile | null) => {
    setCurrentUserState(user);
  };

  const createTournament = (
    data: Omit<Tournament, 'id' | 'slug' | 'created_at'>
  ): Tournament => {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newTournament: Tournament = {
      ...data,
      id: `tour-${Date.now()}`,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
      created_by: currentUser?.id,
    };

    setTournaments((prev) => [newTournament, ...prev]);

    // Send notification to organizer
    if (currentUser) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          user_id: currentUser.id,
          title: 'Tournament Created',
          message: `Tournament "${newTournament.name}" is now live in the directory.`,
          type: 'system',
          read: false,
          link: `/tournaments/${newTournament.id}`,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    return newTournament;
  };

  const updateTournament = (id: string, data: Partial<Tournament>) => {
    setTournaments((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const createTeam = (data: {
    name: string;
    bio: string;
    crest_url: string;
    squad_limit?: number;
  }): Team => {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const captainId = currentUser?.id || 'guest-captain';

    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: data.name,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      crest_url: data.crest_url || '⚽',
      bio: data.bio,
      captain_id: captainId,
      squad_limit: data.squad_limit || 22,
      created_at: new Date().toISOString(),
    };

    setTeams((prev) => [...prev, newTeam]);

    // Automatically add current user as team captain in roster
    if (currentUser) {
      const captainMember: TeamMember = {
        id: `tm-${Date.now()}`,
        team_id: newTeam.id,
        user_id: currentUser.id,
        jersey_number: currentUser.jersey_number || 10,
        position: currentUser.position || 'FWD',
        role: 'captain',
        status: 'active',
        joined_at: new Date().toISOString(),
      };
      setTeamMembers((prev) => [...prev, captainMember]);

      // Update current user role to captain if not already organizer
      if (currentUser.role !== 'organizer') {
        const updatedUser: Profile = { ...currentUser, role: 'captain' };
        setCurrentUserState(updatedUser);
        setProfiles((prev) =>
          prev.map((p) => (p.id === currentUser.id ? updatedUser : p))
        );
      }
    }

    return newTeam;
  };

  const updateTeam = (id: string, data: Partial<Team>) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  };

  const addTeamMember = (
    teamId: string,
    member: {
      fullName: string;
      email: string;
      position: PlayerPosition;
      jerseyNumber: number;
      role?: 'captain' | 'player';
    }
  ): TeamMember => {
    // Check if profile exists for email, or create new player profile
    let profile = profiles.find((p) => p.email.toLowerCase() === member.email.toLowerCase());

    if (!profile) {
      profile = {
        id: `user-${Date.now()}`,
        email: member.email,
        full_name: member.fullName,
        role: member.role || 'player',
        avatar_url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150`,
        position: member.position,
        jersey_number: member.jerseyNumber,
        created_at: new Date().toISOString(),
      };
      setProfiles((prev) => [...prev, profile!]);
    }

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      team_id: teamId,
      user_id: profile.id,
      jersey_number: member.jerseyNumber,
      position: member.position,
      role: member.role || 'player',
      status: 'active',
      joined_at: new Date().toISOString(),
    };

    setTeamMembers((prev) => [...prev, newMember]);

    // Send notification to player
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        user_id: profile!.id,
        team_id: teamId,
        title: 'Joined Roster',
        message: `You were added to the team roster as #${member.jerseyNumber} (${member.position}).`,
        type: 'system',
        read: false,
        link: `/teams/${teamId}`,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    return newMember;
  };

  const removeTeamMember = (memberId: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const registerTeamForTournament = (
    tournamentId: string,
    teamId: string,
    notes?: string,
    paymentStatus: PaymentStatus = 'unpaid'
  ): TournamentRegistration => {
    // Check if already registered
    const existing = registrations.find(
      (r) => r.tournament_id === tournamentId && r.team_id === teamId
    );
    if (existing) return existing;

    const newReg: TournamentRegistration = {
      id: `reg-${Date.now()}`,
      tournament_id: tournamentId,
      team_id: teamId,
      status: 'pending',
      payment_status: paymentStatus,
      notes: notes || 'Application submitted via Instaleague portal.',
      registered_at: new Date().toISOString(),
    };

    setRegistrations((prev) => [...prev, newReg]);

    const tournament = tournaments.find((t) => t.id === tournamentId);
    const team = teams.find((t) => t.id === teamId);

    // Notify organizers
    const organizer = profiles.find((p) => p.role === 'organizer');
    if (organizer) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          user_id: organizer.id,
          title: 'New Team Registration',
          message: `${team?.name || 'A team'} has registered for "${tournament?.name || 'Tournament'}".`,
          type: 'registration',
          read: false,
          link: '/admin/applications',
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    return newReg;
  };

  const updateRegistrationStatus = (
    registrationId: string,
    status: RegistrationStatus
  ) => {
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return;

    setRegistrations((prev) =>
      prev.map((r) => (r.id === registrationId ? { ...r, status } : r))
    );

    const tournament = tournaments.find((t) => t.id === reg.tournament_id);
    const team = teams.find((t) => t.id === reg.team_id);

    // Notify team captain
    if (team) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          user_id: team.captain_id,
          team_id: team.id,
          title: `Registration ${status.toUpperCase()}`,
          message: `Your application for "${tournament?.name}" has been ${status}.`,
          type: 'registration',
          read: false,
          link: `/tournaments/${reg.tournament_id}`,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const updatePaymentStatus = (
    registrationId: string,
    status: PaymentStatus
  ) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === registrationId ? { ...r, payment_status: status } : r))
    );
  };

  const generateFixturesForTournament = (
    tournamentId: string,
    options?: Partial<FixtureGeneratorOptions>
  ): Match[] => {
    const tournament = tournaments.find((t) => t.id === tournamentId);
    if (!tournament) return [];

    // Get approved teams
    const approvedTeamIds = registrations
      .filter((r) => r.tournament_id === tournamentId && r.status === 'approved')
      .map((r) => r.team_id);

    const participatingTeams = teams.filter((t) =>
      approvedTeamIds.includes(t.id)
    );

    if (participatingTeams.length < 2) return [];

    const config: FixtureGeneratorOptions = {
      tournamentId,
      startDate: options?.startDate || tournament.start_date || new Date().toISOString(),
      venues:
        options?.venues && options.venues.length > 0
          ? options.venues
          : tournament.venues.length > 0
          ? tournament.venues
          : ['Main Pitch'],
      kickoffTimes: options?.kickoffTimes || ['14:00', '16:30', '19:00'],
      daysBetweenRounds: options?.daysBetweenRounds || 7,
    };

    const rawFixtures =
      tournament.format === 'knockout'
        ? generateKnockoutFixtures(participatingTeams, config)
        : generateRoundRobinFixtures(participatingTeams, config);

    const newMatches: Match[] = rawFixtures.map((f, idx) => ({
      ...f,
      id: `match-${Date.now()}-${idx}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Replace or append existing matches for this tournament
    setMatches((prev) => [
      ...prev.filter((m) => m.tournament_id !== tournamentId),
      ...newMatches,
    ]);

    // Send notifications to captains of participating teams
    participatingTeams.forEach((team) => {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}-${team.id}`,
          user_id: team.captain_id,
          team_id: team.id,
          title: 'Fixtures Published!',
          message: `The schedule for "${tournament.name}" is now live. Check your kickoff times!`,
          type: 'fixture',
          read: false,
          link: `/tournaments/${tournamentId}`,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    });

    return newMatches;
  };

  const updateMatchScore = (
    matchId: string,
    homeScore: number,
    awayScore: number,
    status: MatchStatus = 'completed',
    notes?: string,
    penaltyHomeScore?: number,
    penaltyAwayScore?: number
  ) => {
    let targetHomeTeamId: string | null = null;
    let targetAwayTeamId: string | null = null;

    setMatches((prev) => {
      let updatedMatch: Match | undefined;
      const next = prev.map((m) => {
        if (m.id === matchId) {
          updatedMatch = {
            ...m,
            home_score: homeScore,
            away_score: awayScore,
            status,
            notes: notes !== undefined ? notes : m.notes,
            penalty_home_score:
              penaltyHomeScore !== undefined
                ? penaltyHomeScore
                : m.penalty_home_score,
            penalty_away_score:
              penaltyAwayScore !== undefined
                ? penaltyAwayScore
                : m.penalty_away_score,
            updated_at: new Date().toISOString(),
          };
          targetHomeTeamId = updatedMatch.home_team_id;
          targetAwayTeamId = updatedMatch.away_team_id;
          return updatedMatch;
        }
        return m;
      });

      // If match is completed and stage is knockout, advance the winner!
      if (
        updatedMatch &&
        status === 'completed' &&
        (updatedMatch.stage === 'quarter_final' ||
          updatedMatch.stage === 'semi_final')
      ) {
        let winnerId: string | null = null;
        if (homeScore > awayScore) {
          winnerId = updatedMatch.home_team_id;
        } else if (awayScore > homeScore) {
          winnerId = updatedMatch.away_team_id;
        } else {
          // Tiebreaker via penalties
          const pHome = penaltyHomeScore ?? updatedMatch.penalty_home_score ?? 0;
          const pAway = penaltyAwayScore ?? updatedMatch.penalty_away_score ?? 0;
          if (pHome > pAway) winnerId = updatedMatch.home_team_id;
          else if (pAway > pHome) winnerId = updatedMatch.away_team_id;
          else winnerId = updatedMatch.home_team_id;
        }

        if (winnerId && !winnerId.startsWith('tbd-')) {
          const tourMatches = next.filter(
            (m) => m.tournament_id === updatedMatch!.tournament_id
          );
          const currentStageMatches = tourMatches.filter(
            (m) => m.stage === updatedMatch!.stage
          );
          const matchIndex = currentStageMatches.findIndex(
            (m) => m.id === updatedMatch!.id
          );

          if (matchIndex >= 0) {
            if (updatedMatch.stage === 'quarter_final') {
              // QF0 & QF1 -> SF0; QF2 & QF3 -> SF1
              const sfMatches = tourMatches.filter(
                (m) => m.stage === 'semi_final'
              );
              const targetSfIndex = Math.floor(matchIndex / 2);
              const isHomeSlot = matchIndex % 2 === 0;
              const targetSf = sfMatches[targetSfIndex];
              if (targetSf) {
                targetSf.home_team_id = isHomeSlot
                  ? winnerId
                  : targetSf.home_team_id;
                targetSf.away_team_id = !isHomeSlot
                  ? winnerId
                  : targetSf.away_team_id;
              }
            } else if (updatedMatch.stage === 'semi_final') {
              // SF0 -> Final Home; SF1 -> Final Away
              const finalMatch = tourMatches.find((m) => m.stage === 'final');
              if (finalMatch) {
                if (matchIndex === 0) finalMatch.home_team_id = winnerId;
                else finalMatch.away_team_id = winnerId;
              }
            }
          }
        }
      }

      return next;
    });

    const homeTeam = teams.find((t) => t.id === targetHomeTeamId);
    const awayTeam = teams.find((t) => t.id === targetAwayTeamId);

    // Notify captains of result update
    [homeTeam, awayTeam].forEach((team) => {
      if (!team) return;
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}-${team.id}`,
          user_id: team.captain_id,
          team_id: team.id,
          title: 'Match Result Updated',
          message: `${homeTeam?.name || 'Home'} ${homeScore} - ${awayScore} ${awayTeam?.name || 'Away'}. Standings updated!`,
          type: 'result',
          read: false,
          link: `/matches/${matchId}`,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    });
  };

  const addMatchEvent = (
    event: Omit<MatchEvent, 'id' | 'created_at'>
  ): MatchEvent => {
    const newEvent: MatchEvent = {
      ...event,
      id: `event-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    setMatchEvents((prev) => [...prev, newEvent]);

    const match = matches.find((m) => m.id === event.match_id);
    if (match) {
      if (newEvent.event_type === 'goal' || newEvent.event_type === 'penalty') {
        const isHome = match.home_team_id === event.team_id;
        const newHomeScore = isHome ? match.home_score + 1 : match.home_score;
        const newAwayScore = !isHome ? match.away_score + 1 : match.away_score;
        updateMatchScore(match.id, newHomeScore, newAwayScore, match.status);
      } else if (newEvent.event_type === 'own_goal') {
        const isHome = match.home_team_id === event.team_id;
        const newHomeScore = !isHome ? match.home_score + 1 : match.home_score;
        const newAwayScore = isHome ? match.away_score + 1 : match.away_score;
        updateMatchScore(match.id, newHomeScore, newAwayScore, match.status);
      }
    }

    return newEvent;
  };

  const removeMatchEvent = (eventId: string) => {
    const ev = matchEvents.find((e) => e.id === eventId);
    if (!ev) return;

    setMatchEvents((prev) => prev.filter((e) => e.id !== eventId));

    const match = matches.find((m) => m.id === ev.match_id);
    if (match) {
      if (ev.event_type === 'goal' || ev.event_type === 'penalty') {
        const isHome = match.home_team_id === ev.team_id;
        const newHomeScore = isHome ? Math.max(0, match.home_score - 1) : match.home_score;
        const newAwayScore = !isHome ? Math.max(0, match.away_score - 1) : match.away_score;
        updateMatchScore(match.id, newHomeScore, newAwayScore, match.status);
      } else if (ev.event_type === 'own_goal') {
        const isHome = match.home_team_id === ev.team_id;
        const newHomeScore = !isHome ? Math.max(0, match.home_score - 1) : match.home_score;
        const newAwayScore = isHome ? Math.max(0, match.away_score - 1) : match.away_score;
        updateMatchScore(match.id, newHomeScore, newAwayScore, match.status);
      }
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetToDefaultData = () => {
    setProfiles(INITIAL_PROFILES);
    setTeams(INITIAL_TEAMS);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setTournaments(INITIAL_TOURNAMENTS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setMatches(INITIAL_MATCHES);
    setMatchEvents(INITIAL_MATCH_EVENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUserState(INITIAL_PROFILES[1]);
    try {
      localStorage.removeItem(STORAGE_KEY_PREFIX);
    } catch {
      // Ignore
    }
  };

  // Selectors
  const getTournamentStandings = (tournamentId: string): StandingRow[] => {
    const approvedTeamIds = registrations
      .filter((r) => r.tournament_id === tournamentId && r.status === 'approved')
      .map((r) => r.team_id);

    const tournamentTeams = teams.filter((t) => approvedTeamIds.includes(t.id));
    const tournamentMatches = matches.filter((m) => m.tournament_id === tournamentId);

    return calculateStandings(tournamentTeams, tournamentMatches);
  };

  const getTournamentScorers = (tournamentId: string): TopScorerRow[] => {
    const tournamentMatchIds = matches
      .filter((m) => m.tournament_id === tournamentId)
      .map((m) => m.id);

    const tournamentEvents = matchEvents.filter((e) =>
      tournamentMatchIds.includes(e.match_id)
    );

    const tournamentMatches = matches.filter((m) => m.tournament_id === tournamentId);

    return calculateTopScorers(tournamentEvents, profiles, teams, tournamentMatches);
  };

  const getTournamentAssists = (tournamentId: string): TopAssistRow[] => {
    const tournamentMatchIds = matches
      .filter((m) => m.tournament_id === tournamentId)
      .map((m) => m.id);

    const tournamentEvents = matchEvents.filter((e) =>
      tournamentMatchIds.includes(e.match_id)
    );

    const tournamentMatches = matches.filter((m) => m.tournament_id === tournamentId);

    return calculateTopAssists(tournamentEvents, profiles, teams, tournamentMatches);
  };

  const getTournamentCleanSheets = (tournamentId: string): CleanSheetRow[] => {
    const tournamentMatches = matches.filter((m) => m.tournament_id === tournamentId);
    return calculateCleanSheets(tournamentMatches, teamMembers, profiles, teams);
  };

  const getTournamentDisciplinary = (tournamentId: string): DisciplinaryRow[] => {
    const tournamentMatchIds = matches
      .filter((m) => m.tournament_id === tournamentId)
      .map((m) => m.id);

    const tournamentEvents = matchEvents.filter((e) =>
      tournamentMatchIds.includes(e.match_id)
    );

    return calculateDisciplinary(tournamentEvents, profiles, teams);
  };

  const getTeamById = (teamId: string): Team | undefined => {
    return teams.find((t) => t.id === teamId);
  };

  const getTeamRoster = (
    teamId: string
  ): (TeamMember & { profile?: Profile })[] => {
    return teamMembers
      .filter((m) => m.team_id === teamId)
      .map((m) => ({
        ...m,
        profile: profiles.find((p) => p.id === m.user_id),
      }))
      .sort((a, b) => a.jersey_number - b.jersey_number);
  };

  const getPlayerProfile = (playerId: string): Profile | undefined => {
    return profiles.find((p) => p.id === playerId);
  };

  const getPlayerStats = (playerId: string) => {
    const member = teamMembers.find((m) => m.user_id === playerId);
    return getPlayerIndividualStats(playerId, matchEvents, matches, member);
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        profiles,
        teams,
        teamMembers,
        tournaments,
        registrations,
        matches,
        matchEvents,
        notifications,
        createTournament,
        updateTournament,
        createTeam,
        updateTeam,
        addTeamMember,
        removeTeamMember,
        registerTeamForTournament,
        updateRegistrationStatus,
        updatePaymentStatus,
        generateFixturesForTournament,
        updateMatchScore,
        addMatchEvent,
        removeMatchEvent,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDefaultData,
        getTournamentStandings,
        getTournamentScorers,
        getTournamentAssists,
        getTournamentCleanSheets,
        getTournamentDisciplinary,
        getTeamById,
        getTeamRoster,
        getPlayerProfile,
        getPlayerStats,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
