export type UserRole = 'organizer' | 'captain' | 'player';

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD' | 'Coach';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  position?: PlayerPosition;
  jersey_number?: number;
  phone?: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  crest_url: string;
  bio: string;
  captain_id: string;
  squad_limit: number;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  jersey_number: number;
  position: PlayerPosition;
  role: 'captain' | 'player';
  status: 'active' | 'pending' | 'inactive';
  joined_at: string;
  // Joined relation for UI display
  profile?: Profile;
}

export interface TeamInvite {
  id: string;
  team_id: string;
  email: string;
  token: string;
  role: 'player';
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  created_at: string;
  expires_at: string;
}

export type TournamentFormat = 'round_robin' | 'knockout' | 'group_knockout';
export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  description: string;
  format: TournamentFormat;
  status: TournamentStatus;
  banner_url?: string;
  entry_fee: number;
  prize_pool: number;
  max_teams: number;
  location: string;
  venues: string[];
  rules: string;
  start_date: string;
  end_date: string;
  created_by?: string;
  created_at: string;
}

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'unpaid' | 'paid' | 'exempt';

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  team_id: string;
  status: RegistrationStatus;
  payment_status: PaymentStatus;
  notes?: string;
  registered_at: string;
  team?: Team;
}

export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';
export type MatchStage = 'group' | 'quarter_final' | 'semi_final' | 'final' | 'regular';

export interface Match {
  id: string;
  tournament_id: string;
  round: number;
  stage: MatchStage;
  home_team_id: string;
  away_team_id: string;
  scheduled_at: string;
  venue: string;
  referee?: string;
  status: MatchStatus;
  home_score: number;
  away_score: number;
  penalty_home_score?: number;
  penalty_away_score?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined relations
  home_team?: Team;
  away_team?: Team;
}

export type MatchEventType = 'goal' | 'yellow_card' | 'red_card' | 'clean_sheet' | 'own_goal' | 'penalty';

export interface MatchEvent {
  id: string;
  match_id: string;
  team_id: string;
  player_id?: string;
  assist_player_id?: string;
  event_type: MatchEventType;
  minute: number;
  notes?: string;
  created_at: string;
  // Joined relations
  player?: Profile;
  assist_player?: Profile;
  team?: Team;
}

export interface StandingRow {
  team_id: string;
  team_name: string;
  team_crest: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  rank: number;
  form: ('W' | 'D' | 'L')[];
}

export interface TopScorerRow {
  player_id: string;
  player_name: string;
  player_avatar?: string;
  jersey_number?: number;
  team_id: string;
  team_name: string;
  team_crest: string;
  goals: number;
  assists: number;
  matches_played: number;
}

export interface TopAssistRow {
  player_id: string;
  player_name: string;
  player_avatar?: string;
  team_id: string;
  team_name: string;
  team_crest: string;
  assists: number;
  matches_played: number;
}

export interface CleanSheetRow {
  player_id: string;
  player_name: string;
  player_avatar?: string;
  team_id: string;
  team_name: string;
  team_crest: string;
  clean_sheets: number;
  goals_conceded: number;
  matches_played: number;
}

export interface DisciplinaryRow {
  player_id: string;
  player_name: string;
  player_avatar?: string;
  team_id: string;
  team_name: string;
  team_crest: string;
  yellow_cards: number;
  red_cards: number;
  points: number; // 1 pt per yellow, 3 per red
}

export interface AppNotification {
  id: string;
  user_id: string;
  team_id?: string;
  title: string;
  message: string;
  type: 'fixture' | 'registration' | 'result' | 'system';
  read: boolean;
  link?: string;
  created_at: string;
}
