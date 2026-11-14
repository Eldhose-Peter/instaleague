import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCleanSheets,
  calculateDisciplinary,
  calculateTopAssists,
  calculateTopScorers,
  getPlayerIndividualStats,
} from '../src/lib/statsCalculator';
import { Match, MatchEvent, Profile, Team, TeamMember } from '../src/types';

const mockProfiles: Profile[] = [
  {
    id: 'p1',
    email: 'alex@example.com',
    full_name: 'Alex Morgan',
    role: 'captain',
    position: 'FWD',
    jersey_number: 10,
    created_at: '',
  },
  {
    id: 'p2',
    email: 'liam@example.com',
    full_name: 'Liam Chen',
    role: 'player',
    position: 'GK',
    jersey_number: 1,
    created_at: '',
  },
  {
    id: 'p3',
    email: 'diego@example.com',
    full_name: 'Diego Silva',
    role: 'player',
    position: 'MID',
    jersey_number: 8,
    created_at: '',
  },
];

const mockTeams: Team[] = [
  {
    id: 't1',
    name: 'Apex FC',
    slug: 'apex-fc',
    crest_url: '⚡',
    bio: '',
    captain_id: 'p1',
    squad_limit: 25,
    created_at: '',
  },
  {
    id: 't2',
    name: 'Red Bulls',
    slug: 'red-bulls',
    crest_url: '🐂',
    bio: '',
    captain_id: 'p4',
    squad_limit: 25,
    created_at: '',
  },
];

const mockMembers: TeamMember[] = [
  {
    id: 'tm1',
    team_id: 't1',
    user_id: 'p1',
    jersey_number: 10,
    position: 'FWD',
    role: 'captain',
    status: 'active',
    joined_at: '',
  },
  {
    id: 'tm2',
    team_id: 't1',
    user_id: 'p2',
    jersey_number: 1,
    position: 'GK',
    role: 'player',
    status: 'active',
    joined_at: '',
  },
  {
    id: 'tm3',
    team_id: 't1',
    user_id: 'p3',
    jersey_number: 8,
    position: 'MID',
    role: 'player',
    status: 'active',
    joined_at: '',
  },
];

test('calculateTopScorers aggregates goals and sorts descending', () => {
  const events: MatchEvent[] = [
    {
      id: 'e1',
      match_id: 'm1',
      team_id: 't1',
      player_id: 'p1',
      assist_player_id: 'p3',
      event_type: 'goal',
      minute: 10,
      created_at: '',
    },
    {
      id: 'e2',
      match_id: 'm1',
      team_id: 't1',
      player_id: 'p1',
      event_type: 'goal',
      minute: 25,
      created_at: '',
    },
    {
      id: 'e3',
      match_id: 'm1',
      team_id: 't1',
      player_id: 'p3',
      event_type: 'goal',
      minute: 50,
      created_at: '',
    },
  ];

  const scorers = calculateTopScorers(events, mockProfiles, mockTeams);
  assert.equal(scorers.length, 2);
  assert.equal(scorers[0].player_id, 'p1');
  assert.equal(scorers[0].goals, 2);
  assert.equal(scorers[1].player_id, 'p3');
  assert.equal(scorers[1].goals, 1);
  assert.equal(scorers[1].assists, 1);
});

test('calculateTopAssists aggregates assists', () => {
  const events: MatchEvent[] = [
    {
      id: 'e1',
      match_id: 'm1',
      team_id: 't1',
      player_id: 'p1',
      assist_player_id: 'p3',
      event_type: 'goal',
      minute: 10,
      created_at: '',
    },
  ];

  const assists = calculateTopAssists(events, mockProfiles, mockTeams);
  assert.equal(assists.length, 1);
  assert.equal(assists[0].player_id, 'p3');
  assert.equal(assists[0].assists, 1);
});

test('calculateCleanSheets computes clean sheets for GKs when opponent scores 0', () => {
  const matches: Match[] = [
    {
      id: 'm1',
      tournament_id: 'tour-1',
      round: 1,
      stage: 'regular',
      home_team_id: 't1',
      away_team_id: 't2',
      scheduled_at: '',
      venue: '',
      status: 'completed',
      home_score: 2,
      away_score: 0, // t1 GK Liam Chen conceded 0
      created_at: '',
      updated_at: '',
    },
    {
      id: 'm2',
      tournament_id: 'tour-1',
      round: 2,
      stage: 'regular',
      home_team_id: 't2',
      away_team_id: 't1',
      scheduled_at: '',
      venue: '',
      status: 'completed',
      home_score: 1,
      away_score: 3, // t1 GK Liam Chen conceded 1
      created_at: '',
      updated_at: '',
    },
  ];

  const cleanSheets = calculateCleanSheets(matches, mockMembers, mockProfiles, mockTeams);
  assert.equal(cleanSheets.length, 1);
  assert.equal(cleanSheets[0].player_id, 'p2');
  assert.equal(cleanSheets[0].clean_sheets, 1);
  assert.equal(cleanSheets[0].goals_conceded, 1);
});

test('calculateDisciplinary aggregates yellow and red cards and points', () => {
  const events: MatchEvent[] = [
    {
      id: 'e1',
      match_id: 'm1',
      team_id: 't1',
      player_id: 'p1',
      event_type: 'yellow_card',
      minute: 30,
      created_at: '',
    },
    {
      id: 'e2',
      match_id: 'm1',
      team_id: 't1',
      player_id: 'p1',
      event_type: 'red_card',
      minute: 75,
      created_at: '',
    },
  ];

  const disc = calculateDisciplinary(events, mockProfiles, mockTeams);
  assert.equal(disc.length, 1);
  assert.equal(disc[0].player_id, 'p1');
  assert.equal(disc[0].yellow_cards, 1);
  assert.equal(disc[0].red_cards, 1);
  assert.equal(disc[0].points, 4); // 1*1 + 1*3 = 4
});

test('getPlayerIndividualStats aggregates all stats for player profile', () => {
  const events: MatchEvent[] = [
    {
      id: 'e1',
      match_id: 'm1',
      team_id: 't1',
      player_id: 'p1',
      assist_player_id: 'p3',
      event_type: 'goal',
      minute: 10,
      created_at: '',
    },
    {
      id: 'e2',
      match_id: 'm1',
      team_id: 't1',
      player_id: 'p1',
      event_type: 'yellow_card',
      minute: 70,
      created_at: '',
    },
  ];

  const matches: Match[] = [
    {
      id: 'm1',
      tournament_id: 'tour-1',
      round: 1,
      stage: 'regular',
      home_team_id: 't1',
      away_team_id: 't2',
      scheduled_at: '',
      venue: '',
      status: 'completed',
      home_score: 2,
      away_score: 0,
      created_at: '',
      updated_at: '',
    },
  ];

  const stats = getPlayerIndividualStats('p1', events, matches, mockMembers[0]);
  assert.equal(stats.goals, 1);
  assert.equal(stats.yellowCards, 1);
  assert.equal(stats.appearances, 1);
});
