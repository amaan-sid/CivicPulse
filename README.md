# CivicPulse

CivicPulse is a real-time, priority-aware community governance and issue resolution platform. Built for **Housing Societies**, **Student Hostels**, and **University Campuses**, CivicPulse automates SLA enforcement, provides live countdown ticket tracking, offers a searchable community member directory, and delivers multi-tier administrative governance from residents to platform Super Admins.

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [User Profile Management](#user-profile-management)
  - [Society & Community Management](#society--community-management)
  - [Issue Management & Tracking](#issue-management--tracking)
  - [Super Admin Command Center](#super-admin-command-center)
  - [Dashboard & Analytics](#dashboard--analytics)
  - [Audit Logs](#audit-logs)
- [Authentication & Role-Based Access Control (RBAC)](#authentication--role-based-access-control-rbac)
- [Priority & Automated SLA Engine](#priority--automated-sla-engine)
- [Frontend Architecture](#frontend-architecture)
- [Running the Application](#running-the-application)

---

## Key Features

- ⏱️ **Automated SLA Countdown Engine**: Priority-driven resolution countdown timers with real-time status indicators (`On Schedule`, `Approaching Breach`, `Breached`).
- 🏢 **Multi-Category Organizations**: Natively supports **Housing Societies** (residential flats), **Student Hostels** (rooms/wings with warden workflows), and **University Campuses** (departments and labs).
- 👥 **Community Member Directory**: Full roster of residents, members, staff, and admins with live search (by name, `@username`, email, flat/room), role filter pills, and custom user avatars.
- 🛡️ **Single-Owner Super Admin Governance**: Platform-wide ecosystem analytics, category filtering, detail inspection modals (Issues, Organizations, Users), and secure Super Admin ownership transfer.
- 📜 **Timestamped Audit Timelines**: Detailed historical milestone tracking for every ticket (Logged &rarr; Auto-Assigned &rarr; On-Site Inspection &rarr; Resolved & Confirmed).
- 👤 **Custom User Profiles**: Profile picture management, default avatars with gender options (`male`, `female`), verified `@username` handles, and password management.
- 🌓 **Modern Responsive UI**: Dark/Light mode theme toggle, smooth micro-animations, accessible toast feedback, and directional navigation.

---

## Architecture Overview

CivicPulse is architected as a modern, decoupled client-server platform:

- **Frontend**: React 19 Single Page Application (Vite + TypeScript) powered by Redux Toolkit for centralized state management, TailwindCSS styling, and Lucide React icons.
- **Backend**: Modular Express.js REST API with TypeScript, controller-service pattern, and Mongoose ODM.
- **Database**: MongoDB with indexed schema models and referential relationships.
- **Authentication**: Stateless JWT token authentication delivered securely via HTTP-only cookies.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Frontend (React 19 + Vite)                      │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌────────┐ │
│   │    Pages     │   │  Components  │   │ Redux Store  │   │ Hooks  │ │
│   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   └───┬────┘ │
│          └──────────────────┴──────────────────┴───────────────┘      │
│                                     │                                  │
│                               ┌─────▼─────┐                            │
│                               │ Axios API │                            │
│                               └─────┬─────┘                            │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │ HTTP + Credentials (JWT Cookie)
┌─────────────────────────────────────┼──────────────────────────────────┐
│                               ┌─────▼─────┐     Backend (Express + TS) │
│                               │  Routes   │                            │
│                               └─────┬─────┘                            │
│        ┌────────────────────────────┼───────────────────────────┐      │
│   ┌────▼─────┐  ┌──────────▼────────┐  ┌──────────▼──────┐ ┌───▼────┐ │
│   │Auth / RBAC  │Society / Community│  │Issue Controller │ │Super-  │ │
│   │Middleware│  │   Controller      │  │  & SLA Engine   │ │Admin   │ │
│   └────┬─────┘  └──────────┬────────┘  └──────────┬──────┘ └───┬────┘ │
│        └───────────────────┴──────────────────────┴────────────┘      │
│                                     │                                  │
│                               ┌─────▼─────┐                            │
│                               │  MongoDB  │                            │
│                               └───────────┘                            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js & Express.js | Core web application framework |
| TypeScript | Type safety and structured architecture |
| MongoDB & Mongoose | Document database and object modeling |
| JSON Web Tokens (JWT) | Secure, stateless authentication |
| bcryptjs | Salted password hashing |
| cookie-parser | HTTP-only cookie parsing |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI component library |
| TypeScript | Type-safe interfaces and state |
| Vite | Lightning-fast build tooling and HMR |
| Redux Toolkit | Global application state management |
| React Router v7 | Client-side routing and guarded routes |
| TailwindCSS v4 | Modern styling and design system |
| Lucide React | Modern iconography |
| react-hot-toast | Non-blocking user feedback notifications |

---

## Project Structure

```
CivicPulse/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                   # MongoDB connection lifecycle
│   │   ├── controllers/
│   │   │   ├── audit.controller.ts     # Audit log handlers
│   │   │   ├── auth.controller.ts      # Auth (signup, login, logout, me)
│   │   │   ├── dashboard.controller.ts # Admin metrics and distribution
│   │   │   ├── issue.controller.ts     # Issue creation, assignment, resolution
│   │   │   ├── society.controller.ts   # Society CRUD, directory roster, roles
│   │   │   ├── superadmin.controller.ts# Ecosystem stats, orgs, users, promote
│   │   │   └── user.controller.ts      # Profile, password, user lists
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts       # JWT cookie verification
│   │   │   └── authorize.middleware.ts  # Role checks (society & platform)
│   │   ├── models/
│   │   │   ├── audit.model.ts          # Audit trail schema
│   │   │   ├── issue.model.ts          # Issue & SLA tracking schema
│   │   │   ├── membership.model.ts     # Society-User junction schema
│   │   │   ├── society.model.ts        # Organization/Community schema
│   │   │   └── user.model.ts           # User account schema
│   │   ├── routes/
│   │   │   ├── audit.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   ├── issue.routes.ts
│   │   │   ├── society.routes.ts
│   │   │   ├── superadmin.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── services/                   # Business logic and query layer
│   │   ├── utils/                      # SLA calculation, code generation
│   │   └── server.ts                   # Application server bootstrap
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   └── store.ts                # Redux Toolkit store config
    │   ├── components/
    │   │   ├── common/                 # UserAvatar, badges, UI elements
    │   │   ├── layout/                 # Navbar, Sidebar, ProtectedRoute
    │   │   ├── profile/                # UserProfileModal
    │   │   └── ui/                     # Card, ConfirmModal, CustomSelect
    │   ├── features/                   # Redux slices (auth, issue, society)
    │   ├── pages/
    │   │   ├── admin/                  # SuperAdminDashboard & Detail Modals
    │   │   ├── auth/                   # Unified AuthPage (Login/Signup)
    │   │   ├── dashboard/              # Admin, Member, Resident Dashboards
    │   │   ├── issues/                 # IssueList, IssueDetails, ReportIssue
    │   │   ├── landing/                # LandingPage with interactive sandbox
    │   │   └── society/                # ManageSociety, JoinSociety
    │   ├── routes/                     # App routing tree
    │   ├── services/                   # Axios API service clients
    │   └── types/                      # Frontend TypeScript definitions
    ├── package.json
    └── vite.config.ts
```

---

## Database Schema

### 1. User Model (`User`)
```typescript
{
  _id: ObjectId,
  name: string,                         // Full Name
  username: string,                     // Unique, lowercase handle (e.g. @amaan)
  email: string,                        // Unique, lowercase
  password: string,                     // Hashed, select: false
  profilePic?: string,                  // Custom avatar URL / data URI
  gender: "male" | "female",            // Avatar defaults (male / female)
  platformRole: "SUPER_ADMIN" | "USER", // Ecosystem-wide permission level
  currentSocietyId?: ObjectId,          // Currently active community context
  isActive: boolean,                    // Account status (default: true)
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Society Model (`Society`)
```typescript
{
  _id: ObjectId,
  name: string,                         // e.g., "Emerald Heights"
  type: "SOCIETY" | "HOSTEL" | "CAMPUS",// Category of community
  address: string,
  city: string,
  state: string,
  totalFlats: number,                   // Units/Flats/Rooms count
  code: string,                         // Unique 6-character joining code
  isActive: boolean,                    // Status toggle
  defaultSLAs: {
    plumbing: number,                   // Hours (default: 24)
    electricity: number,                // Hours (default: 12)
    lift: number,                       // Hours (default: 4)
    security: number,                   // Hours (default: 2)
    cleanliness: number,                // Hours (default: 48)
    water: number                       // Hours (default: 6)
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Membership Model (`Membership`)
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                     // Reference -> User
  societyId: ObjectId,                  // Reference -> Society
  role: "resident" | "member" | "staff" | "admin", // Organization-scoped role
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Issue Model (`Issue`)
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  category: "plumbing" | "electricity" | "lift" | "security" | "cleanliness" | "water",
  status: "open" | "in-progress" | "resolved",
  severity: "low" | "medium" | "high",
  priorityScore: number,                // Computed priority score
  reportCount: number,                  // Duplicate report accumulator
  reportedBy: ObjectId,                 // Reference -> User
  reporters: ObjectId[],                // Users who reported/upvoted
  assignedTo?: ObjectId,                // Reference -> User (Staff/Admin)
  assignedBy?: ObjectId,                // Reference -> User
  assignedAt?: Date,
  society: ObjectId,                    // Reference -> Society
  slaDeadline: Date,                    // Computed SLA expiry date
  isEscalated: boolean,                 // True if SLA target breached
  breachedAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. AuditLog Model (`AuditLog`)
```typescript
{
  _id: ObjectId,
  issueId: ObjectId,                    // Reference -> Issue
  action: string,                       // e.g. "status_changed", "assigned"
  performedBy: ObjectId,                // Reference -> User
  details: object,                      // State diff / metadata
  createdAt: Date
}
```

---

## API Endpoints

### Base URL: `http://localhost:4000/api`

---

### Authentication

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/signup` | ❌ | - | Register new user with username and gender |
| POST | `/auth/login` | ❌ | - | Authenticate user & set HTTP-only JWT cookie |
| POST | `/auth/logout` | ✅ | - | Clear authentication cookie |
| GET | `/auth/me` | ✅ | - | Retrieve currently authenticated user context |

---

### User Profile Management

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/user/profile` | ✅ | - | Get profile data of authenticated user |
| PUT | `/user/profile` | ✅ | - | Update name, username, gender, profile avatar |
| PUT | `/user/change-password` | ✅ | - | Change account password |
| GET | `/user` | ✅ | admin/member | List users in organization |

---

### Society & Community Management

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/society/create` | ✅ | - | Create new community (Society, Hostel, Campus) |
| POST | `/society/join` | ✅ | - | Join organization via unique 6-character code |
| POST | `/society/current` | ✅ | - | Switch active organization context |
| GET | `/society/current` | ✅ | - | Fetch details of active organization |
| GET | `/society/residents` | ✅ | resident+ | Retrieve full community member directory |
| GET | `/society/:id` | ✅ | - | Get organization details by ID |
| GET | `/society/:id/issues` | ✅ | - | Fetch all issues filed in organization |
| PATCH | `/society/update` | ✅ | admin | Update organization parameters and SLAs |
| PUT | `/society/residents/:id` | ✅ | admin | Update member role (`resident`, `member`, `staff`, `admin`) |
| DELETE | `/society/residents/:id` | ✅ | admin | Remove member from organization |

---

### Issue Management & Tracking

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/issues` | ✅ | - | Get issues in user's active community |
| GET | `/issues/:id` | ✅ | - | Get detailed ticket record with SLA & assignee |
| POST | `/issues` | ✅ | resident+ | File new issue (calculates SLA deadline & priority) |
| PATCH | `/issues/:id` | ✅ | staff/member/admin | Update ticket status (`open` &rarr; `in-progress` &rarr; `resolved`) |
| PATCH | `/issues/:id/assign` | ✅ | admin | Assign ticket to verified staff or admin |
| PATCH | `/issues/:id/report` | ✅ | - | Report duplicate issue (increments score) |

---

### Super Admin Command Center

*(Requires `platformRole: "SUPER_ADMIN"`)*

| Method | Endpoint | Auth | Platform Role | Description |
|--------|----------|------|---------------|-------------|
| GET | `/superadmin/stats` | ✅ | SUPER_ADMIN | Platform-wide analytics, totals, breach rate |
| GET | `/superadmin/organizations` | ✅ | SUPER_ADMIN | List all organizations with category filters |
| GET | `/superadmin/users` | ✅ | SUPER_ADMIN | List all platform users with society counts |
| GET | `/superadmin/issues` | ✅ | SUPER_ADMIN | Global issue log with SLA status & organization info |
| POST | `/superadmin/organizations` | ✅ | SUPER_ADMIN | Directly create organizations with admin |
| PATCH | `/superadmin/organizations/:id/status` | ✅ | SUPER_ADMIN | Toggle organization active/inactive status |
| DELETE | `/superadmin/organizations/:id` | ✅ | SUPER_ADMIN | Remove organization and memberships |
| POST | `/superadmin/promote` | ✅ | SUPER_ADMIN | Securely transfer Super Admin ownership |

---

### Dashboard & Analytics

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/dashboard` | ✅ | admin | Aggregate statistics, category breakdowns, breach counts |

---

### Audit Logs

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/issues/:id/logs` | ✅ | member+ | Retrieve immutable chronological action history |

---

## Authentication & Role-Based Access Control (RBAC)

### Dual-Layer Permission Model

CivicPulse operates on a **two-tier role hierarchy**:

1. **Platform Layer (`platformRole`)**:
   - `SUPER_ADMIN`: Single-owner platform executive with ecosystem-wide visibility across all organizations, global analytics, and ownership transfer authority.
   - `USER`: Regular platform user.

2. **Organization Layer (`Membership.role`)**:
   - `admin`: Full administrative control over the community, assign staff, configure SLAs, manage member roles.
   - `staff`: Maintenance technicians and operational staff; can receive assignments, update status, and log resolution progress.
   - `member`: Committee members with permissions to update statuses and review audit trails.
   - `resident`: Regular resident/student; can report issues, join organizations, track SLAs, view community directory, and customize profiles.

---

## Priority & Automated SLA Engine

### Dynamic Priority Score

Priority is recalculated dynamically using the formula:

$$\text{Priority Score} = \text{Category Weight} + (\text{Report Count} \times 2) + (\text{isBreached} \times 15)$$

#### Category Weights

| Category | Weight | Default SLA Window |
|----------|--------|-------------------|
| 🚨 Security | 9 | 2 hours |
| 🛗 Lift | 10 | 4 hours |
| 💧 Water | 8 | 6 hours |
| ⚡ Electricity | 7 | 12 hours |
| 🔧 Plumbing | 6 | 24 hours |
| 🧹 Cleanliness | 4 | 48 hours |

#### Escalation & Pre-Breach Warning

- **Pre-Breach Warning**: As tickets approach their SLA window, visual timers enter critical state (`Approaching Breach`).
- **Breach Escalation**: When `slaDeadline < Date.now()` and status is not `resolved`:
  - `isEscalated` is set to `true`.
  - `breachedAt` timestamp is recorded.
  - An additional **+15 points** is added to the priority score.
  - Ticket is flagged in Super Admin and Admin dashboards for urgent intervention.

---

## Frontend Architecture

### Core Slices (`src/features/`)

- `authSlice`: Handles user session, credentials, `@username`, avatars, and active organization context.
- `issueSlice`: Handles ticket fetching, filtering, creation, assignment, and status transitions.
- `societySlice`: Manages active community data, directory roster, and role changes.

### Key Interactive Modals & Components

- `UserProfileModal`: Drawer/modal for profile picture upload, gender selection, handle, and password updates.
- `UserAvatar`: Universal avatar component supporting custom pictures, initials fallback, and gender defaults.
- `IssueDetailModal`: Deep-dive modal inspecting tickets, category, SLA countdown, and audit logs.
- `OrganizationDetailModal`: Inspects community details, admins, address, and category.
- `UserDetailModal`: Inspects user profile details, memberships, and activity.
- `SLATimer`: Interactive real-time countdown timer with automated color-coded urgency states.
- `ResidentsSection`: Full searchable directory of all community members with dynamic role filter pills.

---

## Running the Application

### Prerequisites

- **Node.js**: v18+ or v20+ LTS
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/amaan-sid/CivicPulse.git
cd CivicPulse

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` folder:

```env
MONGODB_URI=mongodb://localhost:27017/civicpulse
JWT_SECRET=your_jwt_secret_key_here
BACKEND_PORT=4000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
SALT_ROUNDS=10
```

### 3. Run Development Servers

```bash
# Terminal 1: Start Backend (Port 4000)
cd backend
npm run dev

# Terminal 2: Start Frontend (Port 5173)
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser to access CivicPulse.
