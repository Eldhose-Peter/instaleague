-- ==============================================================================
-- INSTALEAGUE SEED DATA
-- Sample data with Tournaments, Teams, Players, Fixtures, and Stats
-- ==============================================================================

-- 1. Profiles (Organizers, Captains, Players)
INSERT INTO public.profiles (id, email, full_name, role, avatar_url, bio, position, jersey_number)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'organizer@instaleague.com', 'Marcus Vance (Organizer)', 'organizer', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Instaleague Chief Tournament Director and Match Commissioner.', 'Coach', 0),
  ('a0000000-0000-0000-0000-000000000002', 'alex.morgan@apexfc.com', 'Alex Morgan', 'captain', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Apex FC Captain & Playmaker. 8 years competitive Sunday league experience.', 'FWD', 10),
  ('a0000000-0000-0000-0000-000000000003', 'liam.chen@apexfc.com', 'Liam Chen', 'player', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Apex FC Goalkeeper. Safe pair of hands and penalty specialist.', 'GK', 1),
  ('a0000000-0000-0000-0000-000000000004', 'diego.silva@apexfc.com', 'Diego Silva', 'player', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', 'Apex FC Central Midfielder with great vision and crossing accuracy.', 'MID', 8),
  ('a0000000-0000-0000-0000-000000000005', 'tariq.almansoor@redbulls.com', 'Tariq Al-Mansoor', 'captain', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 'Red Bulls Captain and vocal center-back defender.', 'DEF', 4),
  ('a0000000-0000-0000-0000-000000000006', 'mateo.rossi@redbulls.com', 'Mateo Rossi', 'player', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'Lethal striker with 14 career tournament goals.', 'FWD', 9),
  ('a0000000-0000-0000-0000-000000000007', 'jordan.reed@metrostrikers.com', 'Jordan Reed', 'captain', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'Metro Strikers Skipper & Midfield Maestro.', 'MID', 7),
  ('a0000000-0000-0000-0000-000000000008', 'samuel.boateng@coastalrovers.com', 'Samuel Boateng', 'captain', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 'Coastal Rovers Leader and defensive anchor.', 'DEF', 5)
ON CONFLICT (id) DO NOTHING;

-- 2. Teams
INSERT INTO public.teams (id, name, slug, crest_url, bio, captain_id, squad_limit)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Apex FC', 'apex-fc', '⚡', 'Reigning champions known for high-pressing attacking football and quick transitions.', 'a0000000-0000-0000-0000-000000000002', 25),
  ('b0000000-0000-0000-0000-000000000002', 'Red Bulls United', 'red-bulls-united', '🐂', 'Fierce physical side built around disciplined defense and lethal set pieces.', 'a0000000-0000-0000-0000-000000000005', 25),
  ('b0000000-0000-0000-0000-000000000003', 'Metro Strikers', 'metro-strikers', '🎯', 'Fast-paced technical team representing the metropolitan district.', 'a0000000-0000-0000-0000-000000000007', 25),
  ('b0000000-0000-0000-0000-000000000004', 'Coastal Rovers', 'coastal-rovers', '🌊', 'Gritty coastal squad renowned for tactical maturity and defensive resilience.', 'a0000000-0000-0000-0000-000000000008', 25)
ON CONFLICT (id) DO NOTHING;

-- 3. Team Members
INSERT INTO public.team_members (id, team_id, user_id, jersey_number, position, role, status)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 10, 'FWD', 'captain', 'active'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 1, 'GK', 'player', 'active'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 8, 'MID', 'player', 'active'),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', 4, 'DEF', 'captain', 'active'),
  ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', 9, 'FWD', 'player', 'active'),
  ('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000007', 7, 'MID', 'captain', 'active'),
  ('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000008', 5, 'DEF', 'captain', 'active')
ON CONFLICT (id) DO NOTHING;

-- 4. Tournaments
INSERT INTO public.tournaments (id, name, slug, description, format, status, entry_fee, prize_pool, max_teams, location, venues, rules, start_date, end_date, created_by)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Instaleague Premier Cup 2026', 'instaleague-premier-cup-2026', 'The premier amateur 11-a-side football championship featuring top regional clubs.', 'round_robin', 'ongoing', 150.00, 2500.00, 6, 'West London Sports Park', ARRAY['Pitch 1 (Grandstand)', 'Pitch 2 (Floodlit)', 'Arena A'], 'Standard FIFA 90-min matches. 3 points for win, 1 for draw. Yellow card accumulation results in 1-match suspension.', '2026-11-01', '2026-12-15', 'a0000000-0000-0000-0000-000000000001'),
  ('d0000000-0000-0000-0000-000000000002', 'Winter Knockout Invitational', 'winter-knockout-invitational', 'High-stakes single-elimination knockout cup with penalty shootouts for drawn fixtures.', 'knockout', 'upcoming', 100.00, 1500.00, 8, 'Olympic Youth Arena', ARRAY['Center Pitch', 'Pitch 3'], 'Single-elimination knockout. Drawn matches proceed directly to 5-kick penalty shootouts.', '2026-12-01', '2026-12-20', 'a0000000-0000-0000-0000-000000000001'),
  ('d0000000-0000-0000-0000-000000000003', 'Autumn Super League', 'autumn-super-league', 'Concluded autumn championship with records etched into Instaleague history.', 'round_robin', 'completed', 120.00, 2000.00, 6, 'Metro Football Complex', ARRAY['Pitch 1', 'Pitch 2'], 'Completed round robin tournament.', '2026-09-01', '2026-10-25', 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- 5. Registrations
INSERT INTO public.tournament_registrations (id, tournament_id, team_id, status, payment_status, notes)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'approved', 'paid', 'Registered early with full squad roster ready.'),
  ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'approved', 'paid', 'Fee cleared via Stripe.'),
  ('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'approved', 'paid', 'Home kit: Blue, Away kit: White.'),
  ('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'approved', 'paid', 'Approved by organizer.'),
  ('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'pending', 'unpaid', 'Applying for knockout invitational spot.')
ON CONFLICT (id) DO NOTHING;

-- 6. Matches
INSERT INTO public.matches (id, tournament_id, round, stage, home_team_id, away_team_id, scheduled_at, venue, referee, status, home_score, away_score)
VALUES
  ('f0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 1, 'regular', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', '2026-11-05 15:00:00+00', 'Pitch 1 (Grandstand)', 'David Oliver', 'completed', 3, 1),
  ('f0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 1, 'regular', 'b0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', '2026-11-05 17:30:00+00', 'Pitch 2 (Floodlit)', 'Sarah Webb', 'completed', 2, 2),
  ('f0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 2, 'regular', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', '2026-11-12 15:00:00+00', 'Pitch 1 (Grandstand)', 'David Oliver', 'completed', 2, 0),
  ('f0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 2, 'regular', 'b0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', '2026-11-12 17:30:00+00', 'Pitch 2 (Floodlit)', 'Michael Brooks', 'completed', 1, 0),
  ('f0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000001', 3, 'regular', 'b0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', '2026-11-19 15:00:00+00', 'Pitch 1 (Grandstand)', 'Sarah Webb', 'scheduled', 0, 0),
  ('f0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000001', 3, 'regular', 'b0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', '2026-11-19 17:30:00+00', 'Pitch 2 (Floodlit)', 'Michael Brooks', 'scheduled', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- 7. Match Events
INSERT INTO public.match_events (match_id, team_id, player_id, assist_player_id, event_type, minute, notes)
VALUES
  -- Match 1: Apex FC 3 - 1 Red Bulls
  ('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'goal', 14, 'Right-footed curler into top right corner.'),
  ('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', NULL, 'goal', 38, 'Header from near post corner.'),
  ('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'goal', 62, 'Counter attack finish.'),
  ('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', NULL, 'goal', 88, 'Long distance strike.'),
  ('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', NULL, 'yellow_card', 75, 'Late tactical tackle.');
