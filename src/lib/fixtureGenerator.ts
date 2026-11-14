import { Match, Team } from '@/types';

export interface FixtureGeneratorOptions {
  tournamentId: string;
  startDate: string; // ISO string or YYYY-MM-DD
  venues: string[];
  kickoffTimes?: string[]; // e.g. ['14:00', '16:30', '19:00']
  daysBetweenRounds?: number;
}

/**
 * Berger / Polygon round-robin tournament fixture generator.
 * Balanced home/away circle method.
 * Handles both even and odd number of teams with byes.
 */
export function generateRoundRobinFixtures(
  teams: Team[],
  options: FixtureGeneratorOptions
): Omit<Match, 'id' | 'created_at' | 'updated_at'>[] {
  if (teams.length < 2) {
    return [];
  }

  const {
    tournamentId,
    startDate,
    venues = ['Main Pitch'],
    kickoffTimes = ['14:00', '16:30', '19:00'],
    daysBetweenRounds = 7,
  } = options;

  const teamList = [...teams];
  const isOdd = teamList.length % 2 !== 0;
  const dummyTeamId = '__BYE__';

  if (isOdd) {
    teamList.push({
      id: dummyTeamId,
      name: 'BYE',
      slug: 'bye',
      crest_url: '',
      bio: '',
      captain_id: '',
      squad_limit: 0,
      created_at: '',
    });
  }

  const numTeams = teamList.length;
  const numRounds = numTeams - 1;
  const half = numTeams / 2;

  const fixtures: Omit<Match, 'id' | 'created_at' | 'updated_at'>[] = [];
  const baseDate = new Date(startDate);

  // Array of team indexes to rotate
  const teamIndices: number[] = Array.from({ length: numTeams }, (_, i) => i);

  for (let round = 0; round < numRounds; round++) {
    const roundDate = new Date(baseDate);
    roundDate.setDate(baseDate.getDate() + round * daysBetweenRounds);

    let matchInRound = 0;

    for (let i = 0; i < half; i++) {
      const t1Idx = teamIndices[i];
      const t2Idx = teamIndices[numTeams - 1 - i];

      const t1 = teamList[t1Idx];
      const t2 = teamList[t2Idx];

      // Skip bye matches
      if (t1.id === dummyTeamId || t2.id === dummyTeamId) {
        continue;
      }

      // Canonical circle method alternating for fair home/away balance:
      // Fixed team (i=0) alternates each round; non-fixed pairs alternate based on match index
      let finalHome: Team;
      let finalAway: Team;

      if (i === 0) {
        [finalHome, finalAway] = round % 2 === 0 ? [t1, t2] : [t2, t1];
      } else {
        [finalHome, finalAway] = i % 2 === 1 ? [t1, t2] : [t2, t1];
      }

      const venue = venues[matchInRound % venues.length];
      const timeStr = kickoffTimes[matchInRound % kickoffTimes.length];
      const [hours, minutes] = (timeStr || '15:00').split(':').map(Number);

      const matchDate = new Date(roundDate);
      matchDate.setHours(hours || 15, minutes || 0, 0, 0);

      fixtures.push({
        tournament_id: tournamentId,
        round: round + 1,
        stage: 'regular',
        home_team_id: finalHome.id,
        away_team_id: finalAway.id,
        scheduled_at: matchDate.toISOString(),
        venue,
        status: 'scheduled',
        home_score: 0,
        away_score: 0,
      });

      matchInRound++;
    }

    // Rotate indices keeping the first fixed
    const last = teamIndices.pop()!;
    teamIndices.splice(1, 0, last);
  }

  return fixtures;
}

/**
 * Knockout Tournament Fixture Generator (Single Elimination)
 * Generates the complete bracket tree:
 * - 2 teams: Final
 * - 3-4 teams: Semi-Finals (R1) and Final (R2)
 * - 5-8 teams: Quarter-Finals (R1), Semi-Finals (R2), and Final (R3)
 */
export function generateKnockoutFixtures(
  teams: Team[],
  options: FixtureGeneratorOptions
): Omit<Match, 'id' | 'created_at' | 'updated_at'>[] {
  if (teams.length < 2) return [];

  const {
    tournamentId,
    startDate,
    venues = ['Main Pitch'],
    kickoffTimes = ['14:00', '16:30', '19:00'],
    daysBetweenRounds = 7,
  } = options;

  const fixtures: Omit<Match, 'id' | 'created_at' | 'updated_at'>[] = [];
  const baseDate = new Date(startDate);

  // 2 teams: Final only
  if (teams.length <= 2) {
    const matchDate = new Date(baseDate);
    const [hours, minutes] = (kickoffTimes[0] || '15:00').split(':').map(Number);
    matchDate.setHours(hours || 15, minutes || 0, 0, 0);

    fixtures.push({
      tournament_id: tournamentId,
      round: 1,
      stage: 'final',
      home_team_id: teams[0].id,
      away_team_id: teams[1].id,
      scheduled_at: matchDate.toISOString(),
      venue: venues[0] || 'Main Pitch',
      status: 'scheduled',
      home_score: 0,
      away_score: 0,
    });
    return fixtures;
  }

  // 3-4 teams: 2 Semi-Finals (Round 1), 1 Final (Round 2)
  if (teams.length <= 4) {
    // Round 1: Semi-Finals
    for (let i = 0; i < 2; i++) {
      const matchDate = new Date(baseDate);
      const timeStr = kickoffTimes[i % kickoffTimes.length] || '15:00';
      const [hours, minutes] = timeStr.split(':').map(Number);
      matchDate.setHours(hours || 15, minutes || 0, 0, 0);

      const home = teams[i * 2];
      const away = teams[i * 2 + 1] || teams[0];

      fixtures.push({
        tournament_id: tournamentId,
        round: 1,
        stage: 'semi_final',
        home_team_id: home.id,
        away_team_id: away.id,
        scheduled_at: matchDate.toISOString(),
        venue: venues[i % venues.length] || 'Main Pitch',
        status: 'scheduled',
        home_score: 0,
        away_score: 0,
      });
    }

    // Round 2: Final
    const finalDate = new Date(baseDate);
    finalDate.setDate(baseDate.getDate() + daysBetweenRounds);
    const [fHours, fMinutes] = (kickoffTimes[0] || '16:00').split(':').map(Number);
    finalDate.setHours(fHours || 16, fMinutes || 0, 0, 0);

    fixtures.push({
      tournament_id: tournamentId,
      round: 2,
      stage: 'final',
      home_team_id: 'tbd-sf1',
      away_team_id: 'tbd-sf2',
      scheduled_at: finalDate.toISOString(),
      venue: venues[0] || 'Main Stadium',
      status: 'scheduled',
      home_score: 0,
      away_score: 0,
    });

    return fixtures;
  }

  // 5-8 teams: 4 Quarter-Finals (Round 1), 2 Semi-Finals (Round 2), 1 Final (Round 3)
  // Round 1: Quarter Finals
  for (let i = 0; i < 4; i++) {
    const matchDate = new Date(baseDate);
    const timeStr = kickoffTimes[i % kickoffTimes.length] || '15:00';
    const [hours, minutes] = timeStr.split(':').map(Number);
    matchDate.setHours(hours || 15, minutes || 0, 0, 0);

    const home = teams[i * 2];
    const away = teams[i * 2 + 1];

    if (!home || !away) break;

    fixtures.push({
      tournament_id: tournamentId,
      round: 1,
      stage: 'quarter_final',
      home_team_id: home.id,
      away_team_id: away.id,
      scheduled_at: matchDate.toISOString(),
      venue: venues[i % venues.length] || 'Main Pitch',
      status: 'scheduled',
      home_score: 0,
      away_score: 0,
    });
  }

  // Round 2: Semi Finals
  const semiDate = new Date(baseDate);
  semiDate.setDate(baseDate.getDate() + daysBetweenRounds);

  for (let i = 0; i < 2; i++) {
    const sDate = new Date(semiDate);
    const timeStr = kickoffTimes[i % kickoffTimes.length] || '15:00';
    const [hours, minutes] = timeStr.split(':').map(Number);
    sDate.setHours(hours || 15, minutes || 0, 0, 0);

    fixtures.push({
      tournament_id: tournamentId,
      round: 2,
      stage: 'semi_final',
      home_team_id: `tbd-qf${i * 2 + 1}`,
      away_team_id: `tbd-qf${i * 2 + 2}`,
      scheduled_at: sDate.toISOString(),
      venue: venues[i % venues.length] || 'Main Pitch',
      status: 'scheduled',
      home_score: 0,
      away_score: 0,
    });
  }

  // Round 3: Final
  const finalDate = new Date(baseDate);
  finalDate.setDate(baseDate.getDate() + daysBetweenRounds * 2);
  const [fHours, fMinutes] = (kickoffTimes[0] || '17:00').split(':').map(Number);
  finalDate.setHours(fHours || 17, fMinutes || 0, 0, 0);

  fixtures.push({
    tournament_id: tournamentId,
    round: 3,
    stage: 'final',
    home_team_id: 'tbd-sf1',
    away_team_id: 'tbd-sf2',
    scheduled_at: finalDate.toISOString(),
    venue: venues[0] || 'Main Stadium',
    status: 'scheduled',
    home_score: 0,
    away_score: 0,
  });

  return fixtures;
}

