import {
  CleanSheetRow,
  DisciplinaryRow,
  Match,
  MatchEvent,
  Profile,
  Team,
  TeamMember,
  TopAssistRow,
  TopScorerRow,
} from '@/types';

/**
 * Calculates top goal scorers across matches and events.
 */
export function calculateTopScorers(
  events: MatchEvent[],
  profiles: Profile[],
  teams: Team[],
  matches?: Match[]
): TopScorerRow[] {
  const goalCounts = new Map<string, { goals: number; assists: number }>();

  // Count goals and assists
  events.forEach((ev) => {
    if (ev.event_type === 'goal' && ev.player_id) {
      const current = goalCounts.get(ev.player_id) || { goals: 0, assists: 0 };
      current.goals += 1;
      goalCounts.set(ev.player_id, current);
    }
    if (ev.assist_player_id) {
      const current = goalCounts.get(ev.assist_player_id) || { goals: 0, assists: 0 };
      current.assists += 1;
      goalCounts.set(ev.assist_player_id, current);
    }
  });

  const profilesMap = new Map(profiles.map((p) => [p.id, p]));
  const teamsMap = new Map(teams.map((t) => [t.id, t]));

  const rows: TopScorerRow[] = [];

  goalCounts.forEach((stats, playerId) => {
    if (stats.goals === 0) return;
    const profile = profilesMap.get(playerId);
    if (!profile) return;

    // Find player's team from events or match
    const playerEvent = events.find((e) => e.player_id === playerId);
    const team = playerEvent ? teamsMap.get(playerEvent.team_id) : undefined;

    // Count matches played by player's team
    const teamMatchesCount = matches
      ? matches.filter(
          (m) =>
            m.status === 'completed' &&
            (m.home_team_id === team?.id || m.away_team_id === team?.id)
        ).length
      : 1;

    rows.push({
      player_id: playerId,
      player_name: profile.full_name,
      player_avatar: profile.avatar_url,
      jersey_number: profile.jersey_number,
      team_id: team?.id || 'unknown',
      team_name: team?.name || 'Free Agent',
      team_crest: team?.crest_url || '⚽',
      goals: stats.goals,
      assists: stats.assists,
      matches_played: Math.max(teamMatchesCount, 1),
    });
  });

  // Sort by goals DESC, then assists DESC
  return rows.sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;
    return b.assists - a.assists;
  });
}

/**
 * Calculates top assist makers across tournament events.
 */
export function calculateTopAssists(
  events: MatchEvent[],
  profiles: Profile[],
  teams: Team[],
  matches?: Match[]
): TopAssistRow[] {
  const assistCounts = new Map<string, number>();

  events.forEach((ev) => {
    if (ev.assist_player_id) {
      const current = assistCounts.get(ev.assist_player_id) || 0;
      assistCounts.set(ev.assist_player_id, current + 1);
    }
  });

  const profilesMap = new Map(profiles.map((p) => [p.id, p]));
  const teamsMap = new Map(teams.map((t) => [t.id, t]));

  const rows: TopAssistRow[] = [];

  assistCounts.forEach((assists, playerId) => {
    const profile = profilesMap.get(playerId);
    if (!profile) return;

    const event = events.find((e) => e.assist_player_id === playerId);
    const team = event ? teamsMap.get(event.team_id) : undefined;

    const teamMatchesCount = matches
      ? matches.filter(
          (m) =>
            m.status === 'completed' &&
            (m.home_team_id === team?.id || m.away_team_id === team?.id)
        ).length
      : 1;

    rows.push({
      player_id: playerId,
      player_name: profile.full_name,
      player_avatar: profile.avatar_url,
      team_id: team?.id || 'unknown',
      team_name: team?.name || 'Free Agent',
      team_crest: team?.crest_url || '⚽',
      assists,
      matches_played: Math.max(teamMatchesCount, 1),
    });
  });

  return rows.sort((a, b) => b.assists - a.assists);
}

/**
 * Calculates clean sheets for goalkeepers in completed matches.
 */
export function calculateCleanSheets(
  matches: Match[],
  teamMembers: TeamMember[],
  profiles: Profile[],
  teams: Team[]
): CleanSheetRow[] {
  const gks = teamMembers.filter((tm) => tm.position === 'GK');
  const profilesMap = new Map(profiles.map((p) => [p.id, p]));
  const teamsMap = new Map(teams.map((t) => [t.id, t]));

  const rows: CleanSheetRow[] = [];

  gks.forEach((gkMember) => {
    const profile = profilesMap.get(gkMember.user_id);
    const team = teamsMap.get(gkMember.team_id);
    if (!profile || !team) return;

    let cleanSheets = 0;
    let goalsConceded = 0;
    let matchesPlayed = 0;

    matches
      .filter((m) => m.status === 'completed')
      .forEach((m) => {
        if (m.home_team_id === team.id) {
          matchesPlayed++;
          goalsConceded += m.away_score;
          if (m.away_score === 0) cleanSheets++;
        } else if (m.away_team_id === team.id) {
          matchesPlayed++;
          goalsConceded += m.home_score;
          if (m.home_score === 0) cleanSheets++;
        }
      });

    rows.push({
      player_id: profile.id,
      player_name: profile.full_name,
      player_avatar: profile.avatar_url,
      team_id: team.id,
      team_name: team.name,
      team_crest: team.crest_url,
      clean_sheets: cleanSheets,
      goals_conceded: goalsConceded,
      matches_played: matchesPlayed,
    });
  });

  return rows.sort((a, b) => {
    if (b.clean_sheets !== a.clean_sheets) {
      return b.clean_sheets - a.clean_sheets;
    }
    return a.goals_conceded - b.goals_conceded;
  });
}

/**
 * Calculates disciplinary table (yellow and red cards).
 */
export function calculateDisciplinary(
  events: MatchEvent[],
  profiles: Profile[],
  teams: Team[]
): DisciplinaryRow[] {
  const cardCounts = new Map<string, { yellow: number; red: number }>();

  events.forEach((ev) => {
    if (!ev.player_id) return;
    if (ev.event_type === 'yellow_card' || ev.event_type === 'red_card') {
      const current = cardCounts.get(ev.player_id) || { yellow: 0, red: 0 };
      if (ev.event_type === 'yellow_card') current.yellow += 1;
      if (ev.event_type === 'red_card') current.red += 1;
      cardCounts.set(ev.player_id, current);
    }
  });

  const profilesMap = new Map(profiles.map((p) => [p.id, p]));
  const teamsMap = new Map(teams.map((t) => [t.id, t]));

  const rows: DisciplinaryRow[] = [];

  cardCounts.forEach((cards, playerId) => {
    const profile = profilesMap.get(playerId);
    if (!profile) return;

    const event = events.find((e) => e.player_id === playerId);
    const team = event ? teamsMap.get(event.team_id) : undefined;

    const points = cards.yellow * 1 + cards.red * 3;

    rows.push({
      player_id: playerId,
      player_name: profile.full_name,
      player_avatar: profile.avatar_url,
      team_id: team?.id || 'unknown',
      team_name: team?.name || 'Free Agent',
      team_crest: team?.crest_url || '⚽',
      yellow_cards: cards.yellow,
      red_cards: cards.red,
      points,
    });
  });

  return rows.sort((a, b) => b.points - a.points);
}

/**
 * Calculates career / platform stats for a single player profile.
 */
export function getPlayerIndividualStats(
  playerId: string,
  events: MatchEvent[],
  matches: Match[],
  teamMember?: TeamMember
) {
  let goals = 0;
  let assists = 0;
  let yellowCards = 0;
  let redCards = 0;

  events.forEach((ev) => {
    if (ev.player_id === playerId) {
      if (ev.event_type === 'goal') goals++;
      if (ev.event_type === 'yellow_card') yellowCards++;
      if (ev.event_type === 'red_card') redCards++;
    }
    if (ev.assist_player_id === playerId) {
      assists++;
    }
  });

  let cleanSheets = 0;
  let appearances = 0;

  if (teamMember) {
    const teamId = teamMember.team_id;
    matches
      .filter((m) => m.status === 'completed')
      .forEach((m) => {
        if (m.home_team_id === teamId || m.away_team_id === teamId) {
          appearances++;
          if (teamMember.position === 'GK') {
            const conceded =
              m.home_team_id === teamId ? m.away_score : m.home_score;
            if (conceded === 0) cleanSheets++;
          }
        }
      });
  }

  return {
    goals,
    assists,
    yellowCards,
    redCards,
    cleanSheets,
    appearances,
  };
}
