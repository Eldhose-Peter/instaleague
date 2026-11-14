import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKnockoutFixtures, generateRoundRobinFixtures } from '../src/lib/fixtureGenerator';
import { Team } from '../src/types';

const createTeams = (count: number): Team[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `team-${i + 1}`,
    name: `Team ${i + 1}`,
    slug: `team-${i + 1}`,
    crest_url: '⚽',
    bio: '',
    captain_id: `cap-${i + 1}`,
    squad_limit: 25,
    created_at: new Date().toISOString(),
  }));
};

test('generateRoundRobinFixtures with 4 teams produces exactly 6 matches (4 * 3 / 2) across 3 rounds', () => {
  const teams = createTeams(4);
  const fixtures = generateRoundRobinFixtures(teams, {
    tournamentId: 't1',
    startDate: '2026-11-01',
    venues: ['Pitch 1', 'Pitch 2'],
  });

  assert.equal(fixtures.length, 6);

  // Group by round
  const rounds = new Set(fixtures.map((f) => f.round));
  assert.equal(rounds.size, 3);

  // Verify no team plays itself
  fixtures.forEach((f) => {
    assert.notEqual(f.home_team_id, f.away_team_id);
    assert.equal(f.tournament_id, 't1');
    assert.ok(f.venue);
    assert.ok(f.scheduled_at);
  });

  // Verify every pair of teams plays each other exactly once
  const pairs = new Set<string>();
  fixtures.forEach((f) => {
    const pair = [f.home_team_id, f.away_team_id].sort().join(' vs ');
    assert.equal(pairs.has(pair), false, `Pair ${pair} was scheduled more than once`);
    pairs.add(pair);
  });
  assert.equal(pairs.size, 6);
});

test('generateRoundRobinFixtures with 3 teams (odd) handles bye properly without bye matches', () => {
  const teams = createTeams(3);
  const fixtures = generateRoundRobinFixtures(teams, {
    tournamentId: 't2',
    startDate: '2026-11-01',
    venues: ['Pitch 1'],
  });

  // 3 teams: 3 * 2 / 2 = 3 matches total
  assert.equal(fixtures.length, 3);
  fixtures.forEach((f) => {
    assert.notEqual(f.home_team_id, '__BYE__');
    assert.notEqual(f.away_team_id, '__BYE__');
  });
});

test('generateKnockoutFixtures generates pairings for quarter finals', () => {
  const teams = createTeams(8);
  const fixtures = generateKnockoutFixtures(teams, {
    tournamentId: 't-ko',
    startDate: '2026-11-01',
    venues: ['Pitch 1'],
  });

  assert.equal(fixtures.length, 4);
  fixtures.forEach((f) => {
    assert.equal(f.stage, 'quarter_final');
    assert.notEqual(f.home_team_id, f.away_team_id);
  });
});
