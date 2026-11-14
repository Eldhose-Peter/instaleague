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

test('generateRoundRobinFixtures with 4 teams produces balanced home games for all teams', () => {
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

  // Verify each team plays at least 1 home game and 1 away game
  const homeCount = new Map<string, number>();
  const awayCount = new Map<string, number>();
  teams.forEach((t) => {
    homeCount.set(t.id, 0);
    awayCount.set(t.id, 0);
  });

  fixtures.forEach((f) => {
    assert.notEqual(f.home_team_id, f.away_team_id);
    assert.equal(f.tournament_id, 't1');
    assert.ok(f.venue);
    assert.ok(f.scheduled_at);

    homeCount.set(f.home_team_id, (homeCount.get(f.home_team_id) || 0) + 1);
    awayCount.set(f.away_team_id, (awayCount.get(f.away_team_id) || 0) + 1);
  });

  teams.forEach((t) => {
    assert.ok((homeCount.get(t.id) || 0) >= 1, `Team ${t.id} had 0 home games!`);
    assert.ok((awayCount.get(t.id) || 0) >= 1, `Team ${t.id} had 0 away games!`);
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

test('generateKnockoutFixtures generates full bracket tree for 8 teams (4 QFs, 2 SFs, 1 Final)', () => {
  const teams = createTeams(8);
  const fixtures = generateKnockoutFixtures(teams, {
    tournamentId: 't-ko',
    startDate: '2026-11-01',
    venues: ['Pitch 1'],
  });

  // 8 teams single elimination = 7 matches total (4 QFs + 2 SFs + 1 Final)
  assert.equal(fixtures.length, 7);

  const qfs = fixtures.filter((f) => f.stage === 'quarter_final');
  const sfs = fixtures.filter((f) => f.stage === 'semi_final');
  const finals = fixtures.filter((f) => f.stage === 'final');

  assert.equal(qfs.length, 4);
  assert.equal(sfs.length, 2);
  assert.equal(finals.length, 1);

  // QFs have real teams
  qfs.forEach((f) => {
    assert.notEqual(f.home_team_id, f.away_team_id);
    assert.ok(teams.some((t) => t.id === f.home_team_id));
    assert.ok(teams.some((t) => t.id === f.away_team_id));
  });

  // Semis have progression placeholder IDs
  assert.equal(sfs[0].home_team_id, 'tbd-qf1');
  assert.equal(sfs[0].away_team_id, 'tbd-qf2');
  assert.equal(sfs[1].home_team_id, 'tbd-qf3');
  assert.equal(sfs[1].away_team_id, 'tbd-qf4');

  // Final has progression placeholder IDs
  assert.equal(finals[0].home_team_id, 'tbd-sf1');
  assert.equal(finals[0].away_team_id, 'tbd-sf2');
});

test('generateKnockoutFixtures generates full bracket tree for 4 teams (2 SFs, 1 Final)', () => {
  const teams = createTeams(4);
  const fixtures = generateKnockoutFixtures(teams, {
    tournamentId: 't-ko-4',
    startDate: '2026-11-01',
    venues: ['Pitch 1'],
  });

  // 4 teams = 3 matches (2 SFs, 1 Final)
  assert.equal(fixtures.length, 3);
  const sfs = fixtures.filter((f) => f.stage === 'semi_final');
  const finals = fixtures.filter((f) => f.stage === 'final');
  assert.equal(sfs.length, 2);
  assert.equal(finals.length, 1);
});
