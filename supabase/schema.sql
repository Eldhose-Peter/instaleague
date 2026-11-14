-- ==============================================================================
-- INSTALEAGUE DATABASE SCHEMA
-- Football Tournament Management Platform
-- Compatible with Supabase PostgreSQL (with Row Level Security & Triggers)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('organizer', 'captain', 'player')),
  avatar_url TEXT,
  bio TEXT,
  position TEXT CHECK (position IN ('GK', 'DEF', 'MID', 'FWD', 'Coach', 'Staff') OR position IS NULL),
  jersey_number INTEGER CHECK (jersey_number >= 0 AND jersey_number <= 99),
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TEAMS
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  crest_url TEXT,
  bio TEXT,
  captain_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  squad_limit INTEGER NOT NULL DEFAULT 25,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TEAM MEMBERS (Roster)
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  jersey_number INTEGER CHECK (jersey_number >= 0 AND jersey_number <= 99),
  position TEXT NOT NULL DEFAULT 'MID' CHECK (position IN ('GK', 'DEF', 'MID', 'FWD')),
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('captain', 'player')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id),
  UNIQUE(team_id, jersey_number)
);

-- 4. TEAM INVITES (Invitation system via email / share link)
CREATE TABLE IF NOT EXISTS public.team_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days')
);

-- 5. TOURNAMENTS
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  format TEXT NOT NULL DEFAULT 'round_robin' CHECK (format IN ('round_robin', 'knockout', 'group_knockout')),
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  banner_url TEXT,
  entry_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  prize_pool NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  max_teams INTEGER NOT NULL DEFAULT 8 CHECK (max_teams >= 2),
  location TEXT NOT NULL DEFAULT 'Main Football Complex',
  venues TEXT[] NOT NULL DEFAULT ARRAY['Pitch 1', 'Pitch 2', 'Main Stadium'],
  rules TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TOURNAMENT REGISTRATIONS (Applications)
CREATE TABLE IF NOT EXISTS public.tournament_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'exempt')),
  notes TEXT,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  UNIQUE(tournament_id, team_id)
);

-- 7. FIXTURES / MATCHES
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round INTEGER NOT NULL DEFAULT 1,
  stage TEXT NOT NULL DEFAULT 'regular' CHECK (stage IN ('group', 'quarter_final', 'semi_final', 'final', 'regular')),
  home_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE RESTRICT,
  away_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE RESTRICT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  venue TEXT NOT NULL,
  referee TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  home_score INTEGER DEFAULT 0 CHECK (home_score >= 0),
  away_score INTEGER DEFAULT 0 CHECK (away_score >= 0),
  penalty_home_score INTEGER,
  penalty_away_score INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (home_team_id <> away_team_id)
);

-- 8. MATCH EVENTS (Goals, Assists, Cards)
CREATE TABLE IF NOT EXISTS public.match_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assist_player_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('goal', 'yellow_card', 'red_card', 'clean_sheet', 'own_goal', 'penalty')),
  minute INTEGER NOT NULL CHECK (minute >= 1 AND minute <= 130),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system' CHECK (type IN ('fixture', 'registration', 'result', 'system')),
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_tournament ON public.tournament_registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_registrations_team ON public.tournament_registrations(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON public.matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_scheduled ON public.matches(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_match_events_match ON public.match_events(match_id);
CREATE INDEX IF NOT EXISTS idx_match_events_player ON public.match_events(player_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, user can update own profile
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Teams: Public read, captain and organizers can insert/update
CREATE POLICY "Teams are viewable by everyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Captains can create teams" ON public.teams FOR INSERT WITH CHECK (auth.uid() = captain_id);
CREATE POLICY "Captains and organizers can update teams" ON public.teams FOR UPDATE USING (
  auth.uid() = captain_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'organizer')
);

-- Team Members: Public read, captain or organizer can manage
CREATE POLICY "Team members are viewable by everyone" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Captains manage team members" ON public.team_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_members.team_id AND captain_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'organizer')
);

-- Tournaments: Public read, organizer can insert/update/delete
CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Organizers manage tournaments" ON public.tournaments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'organizer')
);

-- Tournament Registrations: Public read, captain can apply, organizer can approve/reject
CREATE POLICY "Registrations viewable by everyone" ON public.tournament_registrations FOR SELECT USING (true);
CREATE POLICY "Captains can register their teams" ON public.tournament_registrations FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.teams WHERE id = tournament_registrations.team_id AND captain_id = auth.uid())
);
CREATE POLICY "Organizers manage registrations" ON public.tournament_registrations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'organizer')
);

-- Matches: Public read, organizers manage fixtures and results
CREATE POLICY "Matches are viewable by everyone" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Organizers manage matches" ON public.matches FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'organizer')
);

-- Match Events: Public read, organizers manage events
CREATE POLICY "Match events viewable by everyone" ON public.match_events FOR SELECT USING (true);
CREATE POLICY "Organizers manage match events" ON public.match_events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'organizer')
);

-- Notifications: User can read and update their own notifications
CREATE POLICY "Users view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
