# Instaleague ⚽

**Instaleague** is a full-featured football tournament management platform engineered with Next.js (App Router), Supabase (PostgreSQL), and Vercel. It bridges the gap between grassroots football clubs/players and tournament organizers.

---

## 🌟 Key Features

### 1. Team & Player Management
- **Authentication & Role System:** Players, Team Captains, and Tournament Organizers.
- **Role Simulator Widget:** Header persona switcher allowing one-click testing as Organizer Marcus Vance, Captain Alex Morgan, Player Liam Chen, or Guest.
- **Team Profiles:** Club badge/crest, bio, tactical ethos, squad limits, and verified captain indicator.
- **Roster Management:** Captains can add players with email, jersey numbers, and primary positions (GK, DEF, MID, FWD), share invite links, and enforce squad capacity limits.
- **Player Profiles:** Detailed player profiles with appearances, goals, assists, clean sheets, disciplinary records, and match event histories.

### 2. Tournament & Progress Tracking (Public / Player View)
- **Tournament Directory (`/tournaments`):** Filter by status (Ongoing, Upcoming, Completed) and format (Round-robin, Knockout).
- **Tournament Details Hub (`/tournaments/[id]`):**
  - **Live Points Table:** Interactive league standings showing Played (P), Won (W), Drawn (D), Lost (L), Goals For (GF), Goals Against (GA), Goal Difference (GD), Total Points (Pts: 3-1-0), and Form guide (W/D/L pills).
  - **Knockout Bracket:** Visual bracket tree for single-elimination cup competitions.
  - **Fixtures & Results Calendar:** Filterable by matchday round and status with date, kickoff time, pitch venue, and scores.
  - **Match Center (`/matches/[id]`):** Detailed scoreboards, minute-by-minute timeline (goals with scorers & assists, yellow/red cards), referee reports, and squad lineups.
  - **Leaderboards:** Golden Boot (top scorers), Top Playmakers (assists), Golden Glove (clean sheets), and Fair Play (disciplinary cards).
  - **Tournament Registration Flow:** Captains can enroll their squad with notes and confirmation.

### 3. Organizer Dashboard (`/admin`)
- **Tournament Creation (`/admin/tournaments`):** Set format (Round Robin, Single Elimination Knockout, Group+Knockout), dates, entry fees, prize pools, venues, and rules.
- **Application Management (`/admin/applications`):** Review club registrations, approve/reject applications with instant captain notification dispatch.
- **Automated Fixture Generator (`/admin/fixtures`):** Berger polygon round-robin and knockout scheduling algorithms with pitch allocation and kickoff slot rotation.
- **Live Match Updating Console (`/admin/matches/[id]`):** Real-time score increments, match status switcher (Scheduled, Live, Completed), and event logger (goals, assists, cards) that immediately recalculates standings and leaderboards.

### 4. Core Features
- **Notifications Hub (`/notifications`):** Alerts for upcoming matchdays, registration decisions, and result verifications.
- **Rules & Guidelines Hub (`/rules`):** Standardized 11v11 rulebook, tiebreak hierarchy, squad limits, and card suspension criteria.
- **Mobile Responsive Design:** Tailored for phones and pitch-side tablets.

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, Partial Prerendering)
- **Frontend:** React 19, Tailwind CSS v4, Lucide Icons
- **Database / Backend:** Supabase (PostgreSQL with Row Level Security and migrations)
- **Deployment:** Vercel
- **Testing:** Node.js native test runner via `tsx`

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your Supabase project URL and anon key if using live Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Note: If Supabase keys are not set, Instaleague seamlessly runs with persistent local state & realistic seed data for standalone testing and demos!)*

### 3. Database Setup (Supabase)
Execute the SQL schema and seed data in your Supabase SQL editor:
- Schema & RLS policies: [`supabase/schema.sql`](./supabase/schema.sql)
- Sample tournament data: [`supabase/seed.sql`](./supabase/seed.sql)

### 4. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

### 5. Run Verification & Tests
```bash
npm test
npm run lint
npm run build
```

---

## 🧪 Testing Coverage

The test suite covers:
- `standingsCalculator.test.ts`: Points (3-1-0), goal difference, tiebreaker sorting, form tracking.
- `fixtureGenerator.test.ts`: Round-robin schedule balance (no self-matches, odd-team bye handling, round distribution), knockout pairings.
- `statsCalculator.test.ts`: Top goalscorers, assists, goalkeeper clean sheets, disciplinary cards and points.
