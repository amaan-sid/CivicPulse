**Platform:** Real-time, priority-aware community issue resolution for hostels, societies & campuses.
 
 **Stack:** React + Redux Toolkit + Vite | Node.js + Express + MongoDB | Socket.IO | BullMQ + Redis

---

## Project Info

| Area | Detail |
|------|--------|
| Frontend | React + TypeScript + Redux Toolkit + Tailwind, Vite on `localhost:5173` |
| Backend | Node.js + Express + TypeScript + MongoDB (Mongoose), running on `localhost:4000` |
| Auth | JWT via HTTP-only cookies |
| Roles | `resident`, `maintainer`, `admin` |
| Real-time | Socket.IO (planned) |
| Background Jobs | BullMQ + Redis (planned) |
| Search | Algolia (planned) |

---

## Done

### Infrastructure & Setup
- [x] Monorepo structure created (`frontend/`, `backend/`)
- [x] `.env.example` committed
- [x] GitHub repository connected (`codxbrexx/CivicPulse`)
- [x] Git branch strategy established (feature branches → main)

### Backend
- [x] Express server scaffold (`server.ts`, `app.ts`)
- [x] MongoDB connection configured (`config/db.ts`)
- [x] Redis config file (`config/redis.ts`)
- [x] JWT auth middleware (`middlewares/auth.middleware.ts`)
- [x] Rate limit middleware (`middlewares/rateLimit.middleware.ts`)
- [x] Error middleware (`middlewares/error.middleware.ts`)
- [x] User model (`models/user.model.ts`)
- [x] Society model (`models/society.model.ts`)
- [x] Issue model (`models/issue.model.ts`)
- [x] Audit log model (`models/audit.model.ts`)
- [x] Auth routes (`/api/auth` — login, signup, logout)
- [x] Issue routes (`/api/issues` — CRUD)
- [x] Society routes (`/api/society`)
- [x] Dashboard routes (`/api/dashboard`)
- [x] Audit routes (`/api/issues` — audit log endpoints)
- [x] Issue assignment system implemented
- [x] Dashboard stats API
- [x] Logger utility (`utils/logger.ts`)
- [x] Permissions utility (`utils/permissions.ts`)
- [x] Validators utility (`utils/validators.ts`)
- [x] Job enqueue base (`jobs/enqueue.ts`)
- [x] Socket.IO setup (`sockets/index.ts`, `sockets/issue.socket.ts`)

### Frontend
- [x] Vite + React + TypeScript scaffold
- [x] Redux store configured (`app/store.ts`)
- [x] Auth Redux slice (`features/auth/authSlice.ts` — `setUser`, `logoutUser`)
- [x] Axios API client (`services/api.ts` → `localhost:4000/api`)
- [x] Login page (`pages/auth/Login.tsx`)
- [x] Signup page (`pages/auth/Signup.tsx`)
- [x] Protected route wrapper (`components/ProtectedRoute.tsx`)
- [x] Dashboard page (`pages/dashboard/Dashboard.tsx`)
- [x] Dashboard layout (`layouts/DashboardLayout.tsx`)
- [x] Navbar component (`components/Navbar.tsx`)
- [x] Sidebar component (`components/Sidebar.tsx`)
- [x] App routing for `/login`, `/signup`, `/dashboard`, `/issues`, `/issues/create`, `/issues/:id`


---

## In Progress / Next Up

### Frontend — Issue Pages
- [x] `pages/issues/IssueList.tsx` — List all issues with filters, priority/status badges, SLA timer
- [x] `pages/issues/IssueDetails.tsx` — Full issue detail view with timeline and comments
- [x] `pages/issues/CreateIssue.tsx` — Issue submission form (title, description, category, severity)
- [x] `components/IssueCard.tsx` — Reusable issue card with badges

### Frontend — Redux Issue Feature
- [x] `features/issues/issueTypes.ts` — Issue, IssueStatus, IssueSeverity, IssueCategory types
- [x] `features/issues/issueSlice.ts` — Redux slice (fetchIssues, createIssue async thunks)
- [x] `features/issues/issueAPI.ts` — Axios calls to `/api/issues` endpoints

### Frontend — Auth API Integration
- [x] `features/auth/authAPI.ts` — Axios calls for login, signup, logout, getMeAPI
- [ ] Persist auth state across page refresh (localStorage or cookie check on load)

### Frontend — Routing
- [x] Add routes for `/issues`, `/issues/create`, `/issues/:id` in `App.tsx`
- [ ] Add role-based route protection (maintainer/admin only routes)

### Frontend — Missing Components (per SRS)
- [ ] `SLAClock.tsx` — Countdown timer for SLA deadline per issue
- [ ] `MapView.tsx` — Location picker / issue heatmap
- [ ] `RealtimeToast.tsx` — Socket.IO live update notifications

---

## To Build (Upcoming Features)

### Backend — Intelligence Layer
- [ ] Severity scoring formula (`severity = base_impact × log(frequency) × urgency × location`)
- [ ] Duplicate detection — TF-IDF + cosine similarity against existing issues
- [ ] Background worker: `duplicateDetection` job processor
- [ ] Background worker: `slaChecker` — detect SLA breaches and escalate
- [ ] Background worker: `notifyUsers` — push notifications on status change

### Backend — SLA System
- [ ] SLA config per category (admin-configurable)
- [ ] `sla_due_at` set on issue creation
- [ ] Escalation flags when SLA breached
- [ ] SLA compliance analytics endpoint

### Backend — Reputation System
- [ ] Reporter score: +5 valid report, +2 upvoted, -3 flagged spam
- [ ] Resolver score: +10 before SLA, +5 timely, -10 SLA breach
- [ ] Leaderboard endpoint

### Backend — Comments & Real-time
- [ ] `POST /api/issues/:id/comments` endpoint
- [ ] Socket.IO `issue:update`, `comment:new`, `assignment:claimed` events
- [ ] Real-time dashboard updates for maintainers

### Backend — Search
- [ ] Algolia index setup for issues
- [ ] Push to Algolia on issue create/update
- [ ] Filtered search (category, status, severity, date range)

### Backend — Admin
- [ ] Manual merge endpoint (`POST /admin/merge`)
- [ ] Analytics KPIs (avg resolution time, SLA compliance %, frequency by category)
- [ ] User management endpoints

### Frontend — Maintainer Dashboard
- [ ] Priority-sorted issue queue
- [ ] Claim issue button
- [ ] Update issue status (open → in-progress → resolved)
- [ ] Quick reply templates

### Frontend — Admin Dashboard
- [ ] Analytics charts (SLA compliance, resolution time, category frequency)
- [ ] User management table
- [ ] Manual merge UI

---

## DevOps & Deployment

- [ ] `docker-compose.yml` for local dev (MongoDB + Redis + API + Frontend)
- [ ] `Dockerfile` for backend
- [ ] `Dockerfile` for frontend
- [ ] GitHub Actions CI: lint + test + build on push
- [ ] GitHub Actions CD: auto-deploy to staging on merge to `main`
- [ ] Deploy frontend to Vercel / Netlify
- [ ] Deploy backend to Render / Railway
- [ ] Managed MongoDB (MongoDB Atlas)
- [ ] Managed Redis (Upstash)
- [ ] Environment secrets configured in hosting provider

---

## Testing

- [ ] Unit tests for severity scoring algorithm
- [ ] Unit tests for duplicate detection (cosine similarity)
- [ ] API integration tests for auth, issues, dashboard
- [ ] Redux slice unit tests (auth, issues)
- [ ] E2E test: report → merge → claim → resolve (Cypress or Playwright)

---

## Documentation

- [ ] Update `README.md` with architecture diagram + screenshots
- [ ] Add `docs/architecture.md`
- [ ] Add `docs/api-spec.md` with all endpoint specs
- [ ] Add `docs/diagrams/` (system context + data flow)

---

## Stretch Goals (Post-MVP)

- [ ] WhatsApp / Telegram bot ingestion
- [ ] SBERT embeddings for semantic duplicate detection
- [ ] Image auto-tagging via CV service
- [ ] Heatmap analytics visualization
- [ ] Mobile-responsive PWA
- [ ] Multi-tenant support (multiple societies)
- [ ] Sentry for error tracking
- [ ] Prometheus + Grafana for metrics

---

