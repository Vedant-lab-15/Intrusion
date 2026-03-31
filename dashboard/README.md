# IDS Security Dashboard

A full-stack Intrusion Detection System (IDS) dashboard for real-time security monitoring, threat analysis, audit logging, and role-based access control.

Built with React, TypeScript, Supabase, Zustand, TanStack Query, and Tailwind CSS.

---

## Quick Start (Recommended)

The fastest way to get running — works on macOS and Linux, no prior setup needed.

```bash
git clone <your-repo-url>
cd dashboard
bash setup.sh
```

The script will:
- Check and install Node.js 18+ if missing
- Check and install pnpm if missing
- Install all project dependencies
- Create a `.env.local` file (demo mode — no Supabase account needed)
- Run the test suite
- Print the URL and login credentials when done

Then start the dev server:

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Windows users:** Use [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) and run the script inside it, or follow the manual setup below.

---

## Manual Setup

If you prefer to set things up yourself:

**Prerequisites:** [Node.js 18+](https://nodejs.org) and [pnpm](https://pnpm.io/installation)

```bash
# 1. Install dependencies
pnpm install

# 2. Create environment file
cp .env.example .env.local
# The app works in demo mode without any changes to .env.local

# 3. Start the dev server
pnpm dev
```

---

## Demo Credentials

No account creation needed. Use these to log in:

| Username | Password | Role |
|---|---|---|
| `admin` | `Admin@2024!` | Full access — can edit settings and data |
| `analyst` | `Analyst@2024!` | Read-only access |

---

## All Available Commands

```bash
pnpm dev              # Start development server (http://localhost:5173)
pnpm build            # Type-check + production build
pnpm preview          # Preview the production build locally
pnpm test             # Run all tests once
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage report
pnpm type-check       # TypeScript type-check without building
pnpm lint             # Lint source files
```

---

## Features

- **Authentication** — Login gate with brute-force lockout (5 attempts → 5-min lockout), 30-minute session timeout, and activity-based refresh
- **Real-time Alerts** — Supabase Realtime WebSocket subscription for live alert streaming; falls back to a demo cycle without Supabase
- **Role-Based Access** — Admins can modify settings and data; analysts get read-only views
- **Threat Analysis** — Radar, scatter, and area charts with Excel/CSV import (validated: type, size, formula injection prevention)
- **Audit Log** — Every login, logout, settings change, and data modification is recorded, filterable, and paginated
- **Data Management** — Add, edit, and delete security incident data with full input validation and sanitization
- **Security Headers** — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Code Splitting** — All routes lazy-loaded; bundle split into vendor, charts, MUI, query, and Supabase chunks

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18, TypeScript, Tailwind CSS |
| State | Zustand (UI/audit), TanStack Query (server state) |
| Backend | Supabase (Auth, Postgres, Realtime) |
| Charts | Recharts |
| Build | Vite 5 |
| Testing | Vitest, React Testing Library |
| CI | GitHub Actions |

---

## Connecting Supabase (Optional)

The app runs fully in demo mode without Supabase. To connect a real backend:

**Step 1** — Create a free project at [supabase.com](https://supabase.com)

**Step 2** — Run this SQL in the Supabase SQL editor:

```sql
-- Security alerts table
create table security_alerts (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  severity text check (severity in ('low','medium','high','critical')) not null,
  type text not null,
  message text not null,
  source text not null,
  status text check (status in ('active','resolved')) default 'active'
);

-- Audit log table (append-only)
create table audit_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  user_id uuid references auth.users,
  username text not null,
  action text not null,
  detail text,
  ip_address text
);

-- Row Level Security
alter table security_alerts enable row level security;
alter table audit_logs enable row level security;

create policy "read alerts"   on security_alerts for select using (auth.role() = 'authenticated');
create policy "manage alerts" on security_alerts for all    using (auth.jwt() ->> 'role' = 'admin');
create policy "insert audit"  on audit_logs      for insert with check (auth.role() = 'authenticated');
create policy "read audit"    on audit_logs      for select using (auth.jwt() ->> 'role' = 'admin');
```

**Step 3** — Add your credentials to `.env.local`:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Or run the setup script with the `--prod` flag and it will prompt you:

```bash
bash setup.sh --prod
```

---

## Project Structure

```
dashboard/
├── setup.sh                  # One-command setup script
├── .env.example              # Environment variable template
├── src/
│   ├── auth/                 # AuthContext (Supabase + demo), LoginPage
│   ├── components/           # UI components
│   │   └── charts/           # Recharts wrappers
│   ├── data/                 # Mock data (used as fallback)
│   ├── hooks/                # useAlerts, useRealtimeAlerts
│   ├── lib/                  # Supabase client, database types
│   ├── store/                # Zustand store (navigation, alerts, settings, audit)
│   ├── test/                 # Vitest tests + setup
│   └── types/                # Shared TypeScript interfaces
├── vite.config.ts
├── vitest.config.ts
└── tsconfig.json
```

---

## Running Tests

```bash
pnpm test
```

Tests cover: authentication (login, lockout, session expiry), Zustand store (all state slices), data management (validation, sanitization, CRUD), and error boundary behaviour.

```bash
pnpm test:coverage    # generates coverage/index.html
```

---

## CI/CD

GitHub Actions runs automatically on every push and pull request to `main`:

1. Lint
2. Type-check
3. Test with coverage (thresholds: 60% lines/functions, 50% branches)
4. Production build

Configure Supabase credentials as repository secrets (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) for the build step to use them.

---

## Security Notes

- Session tokens stored in `sessionStorage` — cleared automatically when the tab closes
- Brute-force lockout after 5 failed login attempts (5-minute cooldown)
- All user-supplied text is sanitized (strips `<>"'\``) before storage or rendering
- Excel/CSV imports run with `cellFormula: false` to block formula injection
- Content Security Policy restricts script execution to `'self'`
- Supabase Row Level Security enforces access control server-side
