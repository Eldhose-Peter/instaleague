import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStandings } from '../src/lib/standingsCalculator';
import { Match, Team } from '../src/types';

const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Apex FC',
    slug: 'apex-fc',
    crest_url: '⚡',
    bio: 'Apex FC',
    captain_id: 'cap-1',
    squad_limit: 25,
    created_at: new Date().toISOString(),
  },
  {
    id: 'team-2',
    name: 'Red Bulls United',
    slug: 'red-bulls-united',
    crest_url: '🐂',
    bio: 'Red Bulls',
    captain_id: 'cap-2',
    squad_limit: 25,
    created_at: new Date().toISOString(),
  },
  {
    id: 'team-3',
    name: 'Metro Strikers',
    slug: 'metro-strikers',
    crest_url: '🎯',
    bio: 'Metro Strikers',
    captain_id: 'cap-3',
    squad_limit: 25,
    created_at: new Date().toISOString(),
  },
];

test('calculateStandings returns all teams with 0 stats when no matches played', () => {
  const standings = calculateStandings(mockTeams, []);
  assert.equal(standings.length, 3);
  standings.forEach((row) => {
    assert.equal(row.played, 0);
    assert.equal(row.won, 0);
    assert.equal(row.drawn, 0);
    assert.equal(row.lost, 0);
    assert.equal(row.points, 0);
    assert.equal(row.goal_difference, 0);
  });
});

test('calculateStandings correctly calculates wins, points, goal difference and ranks', () => {
  const matches: Match[] = [
    {
      id: 'm1',
      tournament_id: 'tour-1',
      round: 1,
      stage: 'regular',
      home_team_id: 'team-1',
      away_team_id: 'team-2',
      scheduled_at: '2026-11-01T15:00:00Z',
      venue: 'Pitch 1',
      status: 'completed',
      home_score: 3,
      away_score: 1,
      created_at: '',
      updated_at: '',
    },
    {
      id: 'm2',
      tournament_id: 'tour-1',
      round: 2,
      stage: 'regular',
      home_team_id: 'team-2',
      away_team_id: 'team-3',
      scheduled_at: '2026-11-05T15:00:00Z',
      venue: 'Pitch 1',
      status: 'completed',
      home_score: 2,
      away_score: 2,
      created_at: '',
      updated_at: '',
    },
  ];

  const standings = calculateStandings(mockTeams, matches);

  // Expected:
  // Team 1 (Apex): P 1, W 1, D 0, L 0, GF 3, GA 1, GD +2, Pts 3 -> Rank 1
  // Team 3 (Metro): P 1, W 0, D 1, L 0, GF 2, GA 2, GD 0, Pts 1 -> Rank 2
  // Team 2 (Red Bulls): P 2, W 0, D 1, L 1, GF 3, GA 5, GD -2, Pts 1 -> Rank 3

  assert.equal(standings[0].team_id, 'team-1');
  assert.equal(standings[0].points, 3);
  assert.equal(standings[0].goal_difference, 2);
  assert.equal(standings[0].rank, 1);
  assert.deepEqual(standings[0].form, ['W']);

  assert.equal(standings[1].team_id, 'team-3');
  assert.equal(standings[1].points, 1);
  assert.equal(standings[1].goal_difference, 0);
  assert.equal(standings[1].rank, 2);
  assert.deepEqual(standings[1].form, ['D']);

  assert.equal(standings[2].team_id, 'team-2');
  assert.equal(standings[2].played, 2);
  assert.equal(standings[2].points, 1);
  assert.equal(standings[2].goal_difference, -2);
  assert.equal(standings[2].rank, 3);
  assert.deepEqual(standings[2].form, ['L', 'D']);
});

test('calculateStandings ignores non-completed matches', () => {
  const matches: Match[] = [
    {
      id: 'm1',
      tournament_id: 'tour-1',
      round: 1,
      stage: 'regular',
      home_team_id: 'team-1',
      away_team_id: 'team-2',
      scheduled_at: '2026-11-01T15:00:00Z',
      venue: 'Pitch 1',
      status: 'scheduled',
      home_score: 5,
      away_score: 0,
      created_at: '',
      updated_at: '',
    },
  ];

  const standings = calculateStandings(mockTeams, matches);
  assert.equal(standings[0].played, 0);
  assert.equal(standings[0].points, 0);
});

test('calculateStandings excludes knockout stage matches (quarter-finals, semi-finals, finals)', () => {
  const matches: Match[] = [
    {
      id: 'm1',
      tournament_id: 'tour-1',
      round: 1,
      stage: 'regular',
      home_team_id: 'team-1',
      away_team_id: 'team-2',
      scheduled_at: '2026-11-01T15:00:00Z',
      venue: 'Pitch 1',
      status: 'completed',
      home_score: 1,
      away_score: 0,
      created_at: '',
      updated_at: '',
    },
    {
      id: 'm-ko',
      tournament_id: 'tour-1',
      round: 2,
      stage: 'final',
      home_team_id: 'team-1',
      away_team_id: 'team-2',
      scheduled_at: '2026-11-10T15:00:00Z',
      venue: 'Stadium',
      status: 'completed',
      home_score: 4,
      away_score: 0,
      created_at: '',
      updated_at: '',
    },
  ];

  const standings = calculateStandings(mockTeams, matches);
  // Team 1 should only have 1 match counted (the regular stage match, 1-0)
  assert.equal(standings[0].team_id, 'team-1');
  assert.equal(standings[0].played, 1);
  assert.equal(standings[0].goals_for, 1);
  assert.equal(standings[0].points, 3);
});

test('calculateStandings uses head-to-head resolution when points, GD, and GF are equal', () => {
  const matches: Match[] = [
    {
      id: 'm1',
      tournament_id: 'tour-1',
      round: 1,
      stage: 'regular',
      home_team_id: 'team-2', // Red Bulls beat Apex 1-0
      away_team_id: 'team-1',
      scheduled_at: '2026-11-01T15:00:00Z',
      venue: 'Pitch 1',
      status: 'completed',
      home_score: 1,
      away_score: 0,
      created_at: '',
      updated_at: '',
    },
    {
      id: 'm2',
      tournament_id: 'tour-1',
      round: 2,
      stage: 'regular',
      home_team_id: 'team-1', // Apex beat Metro 1-0
      away_team_id: 'team-3',
      scheduled_at: '2026-11-05T15:00:00Z',
      venue: 'Pitch 1',
      status: 'completed',
      home_score: 1,
      away_score: 0,
      created_at: '',
      updated_at: '',
    },
    {
      id: 'm3',
      tournament_id: 'tour-1',
      round: 3,
      stage: 'regular',
      home_team_id: 'team-3', // Metro beat Red Bulls 1-0
      away_team_id: 'team-2',
      scheduled_at: '2026-11-10T15:00:00Z',
      venue: 'Pitch 1',
      status: 'completed',
      home_score: 1,
      away_score: 0,
      created_at: '',
      updated_at: '',
    },
  ];

  // All 3 teams have 3 points, GD 0, GF 1, GA 1
  const standings = calculateStandings(mockTeams, matches);
  assert.equal(standings.length, 3);
  standings.forEach((s) => {
    assert.equal(s.points, 3);
    assert.equal(s.goal_difference, 0);
  });
});
