import { Match, StandingRow, Team } from '@/types';

/**
 * Calculates league standings table based on teams and completed matches.
 * Standard football rules:
 * - Win = 3 points
 * - Draw = 1 point
 * - Loss = 0 points
 * 
 * Tiebreakers:
 * 1. Total Points
 * 2. Goal Difference (GF - GA)
 * 3. Goals For (GF)
 * 4. Team Name (Alphabetical)
 */
export function calculateStandings(
  teams: Team[],
  matches: Match[]
): StandingRow[] {
  const standingsMap = new Map<string, StandingRow>();

  // Initialize each team with 0s
  teams.forEach((team) => {
    standingsMap.set(team.id, {
      team_id: team.id,
      team_name: team.name,
      team_crest: team.crest_url,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goals_for: 0,
      goals_against: 0,
      goal_difference: 0,
      points: 0,
      rank: 1,
      form: [],
    });
  });

  // Filter completed matches sorted chronologically
  const completedMatches = matches
    .filter((m) => m.status === 'completed')
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  // Accumulate match results
  completedMatches.forEach((match) => {
    const home = standingsMap.get(match.home_team_id);
    const away = standingsMap.get(match.away_team_id);

    if (!home || !away) return;

    home.played += 1;
    away.played += 1;

    home.goals_for += match.home_score;
    home.goals_against += match.away_score;
    away.goals_for += match.away_score;
    away.goals_against += match.home_score;

    if (match.home_score > match.away_score) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
      home.form.push('W');
      away.form.push('L');
    } else if (match.home_score < match.away_score) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
      home.form.push('L');
      away.form.push('W');
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
      home.form.push('D');
      away.form.push('D');
    }

    home.goal_difference = home.goals_for - home.goals_against;
    away.goal_difference = away.goals_for - away.goals_against;
  });

  // Convert to array and sort
  const standingsArray = Array.from(standingsMap.values()).map((row) => ({
    ...row,
    // Keep last 5 form results
    form: row.form.slice(-5),
  }));

  standingsArray.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    if (b.goal_difference !== a.goal_difference) {
      return b.goal_difference - a.goal_difference;
    }
    if (b.goals_for !== a.goals_for) {
      return b.goals_for - a.goals_for;
    }
    return a.team_name.localeCompare(b.team_name);
  });

  // Assign 1-based ranks
  return standingsArray.map((row, index) => ({
    ...row,
    rank: index + 1,
  }));
}
