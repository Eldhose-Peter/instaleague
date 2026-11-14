import { Match, MatchStage, Team } from '@/types';

export interface FixtureGeneratorOptions {
  tournamentId: string;
  startDate: string; // ISO string or YYYY-MM-DD
  venues: string[];
  kickoffTimes?: string[]; // e.g. ['14:00', '16:30', '19:00']
  daysBetweenRounds?: number;
}

/**
 * Berger / Polygon round-robin tournament fixture generator.
 * Handles both even and odd number of teams.
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
      const homeIdx = teamIndices[i];
      const awayIdx = teamIndices[numTeams - 1 - i];

      const homeTeam = teamList[homeIdx];
      const awayTeam = teamList[awayIdx];

      // Skip bye matches
      if (homeTeam.id === dummyTeamId || awayTeam.id === dummyTeamId) {
        continue;
      }

      // Alternate home and away to maintain fair balance
      const [finalHome, finalAway] =
        round % 2 === 1 ? [awayTeam, homeTeam] : [homeTeam, awayTeam];

      const venue = venues[matchInRound % venues.length];
      const timeStr = kickoffTimes[matchInRound % kickoffTimes.length];
      const [hours, minutes] = timeStr.split(':').map(Number);

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
 * Generates initial round matches (Round of 16, Quarter-Finals, Semi-Finals, Final)
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
  } = options;

  const fixtures: Omit<Match, 'id' | 'created_at' | 'updated_at'>[] = [];
  const baseDate = new Date(startDate);

  let stage: MatchStage = 'quarter_final';
  if (teams.length <= 2) stage = 'final';
  else if (teams.length <= 4) stage = 'semi_final';

  // Pair teams: 1 vs 2, 3 vs 4, etc.
  for (let i = 0; i < teams.length; i += 2) {
    if (i + 1 >= teams.length) break;

    const matchIdx = i / 2;
    const venue = venues[matchIdx % venues.length];
    const timeStr = kickoffTimes[matchIdx % kickoffTimes.length];
    const [hours, minutes] = timeStr.split(':').map(Number);

    const matchDate = new Date(baseDate);
    matchDate.setHours(hours || 15, minutes || 0, 0, 0);

    fixtures.push({
      tournament_id: tournamentId,
      round: 1,
      stage,
      home_team_id: teams[i].id,
      away_team_id: teams[i + 1].id,
      scheduled_at: matchDate.toISOString(),
      venue,
      status: 'scheduled',
      home_score: 0,
      away_score: 0,
    });
  }

  return fixtures;
}
