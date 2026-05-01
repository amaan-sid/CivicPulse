# CivicPulse

CivicPulse is a real-time, priority-aware community issue resolution platform that intelligently clusters duplicate complaints, ranks issues by severity, enforces SLAs, and improves accountability for hostels, residential societies, and campuses.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Society Management](#society-management)
  - [Issue Management](#issue-management)
  - [Dashboard](#dashboard)
  - [Audit Logs](#audit-logs)
  - [User Management](#user-management)
- [Authentication & Authorization](#authentication--authorization)
- [Priority & SLA System](#priority--sla-system)
- [Frontend Architecture](#frontend-architecture)

---

## Architecture Overview

CivicPulse follows a **client-server architecture** with:

- **Frontend**: React + Redux Toolkit + React Router (SPA)
- **Backend**: Express.js + TypeScript REST API
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based cookie authentication

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Pages   │  │Components│  │  Redux   │  │  Hooks   │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       └────────────┴────────────┴────────────┘               │
│                          │                                      │
│                    ┌─────▼─────┐                               │
│                    │  API Layer │                               │
│                    └─────┬─────┘                               │
└──────────────────────────┼────────────────────────────────────┘
                           │ HTTP + Cookies
┌──────────────────────────┼────────────────────────────────────┐
│                    ┌─────▼─────┐        Backend (Express)      │
│                    │  Routes   │                               │
│                    └─────┬─────┘                               │
│       ┌──────────────────┼──────────────────┐                  │
│  ┌────▼─────┐      ┌────▼─────┐      ┌────▼─────┐            │
│  │ Auth     │      │ Society  │      │ Issues  │            │
│  │ Middle   │      │ Controller│      │ Controller│           │
│  └────┬─────┘      └────┬─────┘      └────┬─────┘            │
│       │                 │                 │                   │
│       └─────────────────┴─────────────────┘                   │
│                          │                                      │
│                    ┌─────▼─────┐                               │
│                    │ MongoDB   │                               │
│                    └───────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Express.js | Web framework |
| TypeScript | Type safety |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| cookie-parser | Cookie handling |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Redux Toolkit | State management |
| React Router | Routing |
| Axios | HTTP client |
| TailwindCSS | Styling |
| Vite | Build tool |

---

## Project Structure

```
CivicPulse/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── society.controller.ts
│   │   │   ├── issue.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── audit.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts  # JWT verification
│   │   │   └── authorize.middleware.ts # Role check
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── society.model.ts
│   │   │   ├── issue.model.ts
│   │   │   ├── membership.model.ts
│   │   │   └── audit.model.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── society.routes.ts
│   │   │   ├── issue.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   ├── audit.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── utils/
│   │   │   ├── priority.ts        # Priority calculation
│   │   │   └── codeGenerator.ts   # Unique society codes
│   │   ├── types/
│   │   │   └── express.d.ts      # TypeScript declarations
│   │   └── server.ts             # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   └── store.ts           # Redux store
    │   ├── components/           # Reusable UI components
    │   ├── features/             # Redux slices (API + state)
    │   ├── hooks/                # Custom React hooks
    │   ├── layouts/              # Page layouts
    │   ├── pages/                # Route pages
    │   ├── routes/               # Route definitions
    │   ├── services/             # API service layer
    │   ├── types/                # TypeScript types
    │   └── utils/                # Utility functions
    ├── package.json
    └── vite.config.ts
```

---

## Database Schema

### 1. User Model
```typescript
{
  _id: ObjectId,
  name: string,           // Required
  email: string,         // Required, unique
  password: string,      // Hashed, select: false
  currentSocietyId?: ObjectId,  // Reference to Society
  isActive: boolean,     // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Society Model
```typescript
{
  _id: ObjectId,
  name: string,          // Required
  address: string,      // Required
  city: string,         // Required
  state: string,        // Required
  totalFlats: number,   // Required
  code: string,         // Required, unique (6-char)
  defaultSLAs: {
    plumbing: number,   // Default: 24 hours
    electricity: number,// Default: 12 hours
    lift: number,       // Default: 4 hours
    security: number,  // Default: 2 hours
    cleanliness: number,// Default: 48 hours
    water: number       // Default: 6 hours
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Membership Model (Junction Table)
```typescript
{
  _id: ObjectId,
  userId: ObjectId,     // Reference to User
  societyId: ObjectId, // Reference to Society
  role: "resident" | "member" | "admin",
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Issue Model
```typescript
{
  _id: ObjectId,
  title: string,        // Required
  description: string,  // Required
  category: "plumbing" | "electricity" | "lift" | "security" | "cleanliness" | "water",
  status: "open" | "in-progress" | "resolved",
  severity: "low" | "medium" | "high",
  priorityScore: number,  // Calculated
  reportCount: number,     // Auto-incremented
  reportedBy: ObjectId,    // Reference to User
  reporters: ObjectId[],   // Array of users who reported
  assignedTo?: ObjectId,  // Reference to User
  assignedBy?: ObjectId,  // Reference to User
  assignedAt?: Date,
  society: ObjectId,      // Reference to Society
  slaDeadline: Date,      // Calculated from SLA
  isEscalated: boolean,   // True if breached
  breachedAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. AuditLog Model
```typescript
{
  _id: ObjectId,
  issueId: ObjectId,     // Reference to Issue
  action: string,       // e.g., "status_changed", "assigned"
  performedBy: ObjectId,// Reference to User
  details: object,     // Action-specific data
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
| POST | `/auth/signup` | ❌ | - | Register new user |
| POST | `/auth/login` | ❌ | - | Login user |
| POST | `/auth/logout` | ✅ | - | Logout user |
| GET | `/auth/me` | ✅ | - | Get current user |

#### POST `/auth/signup`
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}
```
**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```
- Sets HTTP-only cookie `token` (expires: 7 days)

#### POST `/auth/login`
**Request:**
```json
{
  "email": "john@example.com",
  "password": "secure123"
}
```
**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "currentSocietyId": "...",
    "memberships": [...],
    "role": "resident"
  }
}
```

#### GET `/auth/me`
**Headers:** `Cookie: token=<jwt>`
**Response (200):**
```json
{
  "id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "currentSocietyId": "...",
  "memberships": [...],
  "role": "admin"
}
```

---

### Society Management

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/society/create` | ✅ | - | Create new society |
| POST | `/society/join` | ✅ | - | Join society by code |
| POST | `/society/current` | ✅ | - | Switch active society |
| GET | `/society/current` | ✅ | - | Get active society |
| GET | `/society/residents` | ✅ | - | List all residents |
| GET | `/society/:id` | ✅ | - | Get society by ID |
| GET | `/society/:id/issues` | ✅ | - | Get society issues |
| PATCH | `/society/update` | ✅ | admin | Update society |
| PUT | `/society/residents/:id` | ✅ | admin | Update resident role |
| DELETE | `/society/residents/:id` | ✅ | admin | Remove resident |

#### POST `/society/create`
**Request:**
```json
{
  "name": "Sunrise Apartments",
  "address": "123 Main Road",
  "city": "Mumbai",
  "state": "Maharashtra",
  "totalFlats": 50
}
```
**Response (201):**
```json
{
  "currentSocietyId": "...",
  "memberships": [
    {
      "societyId": { "_id": "...", "name": "Sunrise Apartments", "code": "ABC123" },
      "role": "admin"
    }
  ]
}
```
- Creates society with unique 6-character code
- Automatically adds creator as **admin** member

#### POST `/society/join`
**Request:**
```json
{
  "societyCode": "ABC123"
}
```
**Response (200):**
```json
{
  "currentSocietyId": "...",
  "memberships": [...]
}
```
- Adds user to society with **resident** role

#### POST `/society/current`
**Request:**
```json
{
  "societyId": "..."
}
```
**Response (200):**
```json
{
  "currentSocietyId": "..."
}
```
- Switches user's active society context

#### GET `/society/residents`
**Response (200):**
```json
{
  "residents": [
    {
      "_id": "...",
      "userId": { "_id": "...", "name": "John", "email": "john@example.com" },
      "role": "admin",
      "createdAt": "..."
    }
  ]
}
```

---

### Issue Management

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/issues` | ✅ | - | Get society issues |
| GET | `/issues/:id` | ✅ | - | Get issue by ID |
| POST | `/issues` | ✅ | resident | Create new issue |
| PATCH | `/issues/:id` | ✅ | member/admin | Update status |
| PATCH | `/issues/:id/assign` | ✅ | admin | Assign issue |
| PATCH | `/issues/:id/report` | ✅ | - | Report/duplicate issue |

#### GET `/issues`
**Query Parameters:** None (uses user's society)
**Response (200):**
```json
[
  {
    "_id": "...",
    "title": "Water leakage in block A",
    "description": "Tap in kitchen leaking",
    "category": "plumbing",
    "status": "open",
    "severity": "high",
    "priorityScore": 25,
    "reportCount": 3,
    "slaDeadline": "2026-05-03T...",
    "isEscalated": false,
    "createdAt": "..."
  }
]
```

#### POST `/issues`
**Request:**
```json
{
  "title": "Lift not working",
  "description": "Lift in Block B is stuck between floors",
  "category": "lift",
  "severity": "high"
}
```
**Response (201):**
```json
{
  "_id": "...",
  "title": "Lift not working",
  "description": "...",
  "category": "lift",
  "status": "open",
  "severity": "high",
  "priorityScore": 10,
  "reportCount": 1,
  "society": "...",
  "slaDeadline": "2026-05-02T14:00:00.000Z",
  "isEscalated": false
}
```
- Calculates SLA deadline based on society's default SLA for category
- Calculates initial priority score

#### PATCH `/issues/:id`
**Request:**
```json
{
  "status": "in-progress"
}
```
**Response (200):**
```json
{
  "_id": "...",
  "status": "in-progress",
  ...
}
```
- Updates issue status
- Creates audit log entry

#### PATCH `/issues/:id/assign`
**Request:**
```json
{
  "assignedTo": "user_id_here"
}
```
**Response (200):**
```json
{
  "_id": "...",
  "assignedTo": "...",
  "assignedBy": "...",
  "assignedAt": "2026-05-02T...",
  "status": "in-progress"
}
```

#### PATCH `/issues/:id/report`
**Response (200):**
```json
{
  "message": "3 people have reported this issue.",
  "issue": { ... }
}
```
- Increments `reportCount` if not already reported
- Adds user to `reporters` array
- Recalculates priority score

---

### Dashboard

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/dashboard` | ✅ | admin | Get admin statistics |

#### GET `/dashboard`
**Response (200):**
```json
{
  "totalIssues": 45,
  "openIssues": 28,
  "resolvedIssues": 17,
  "breachedIssues": 5,
  "highPriorityIssues": 12,
  "categoryDistribution": [
    { "_id": "plumbing", "count": 15 },
    { "_id": "electricity", "count": 10 },
    { "_id": "lift", "count": 8 },
    { "_id": "security", "count": 5 },
    { "_id": "cleanliness", "count": 4 },
    { "_id": "water", "count": 3 }
  ]
}
```

---

### Audit Logs

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/issues/:id/logs` | ✅ | member/admin | Get issue history |

#### GET `/issues/:id/logs`
**Response (200):**
```json
{
  "logs": [
    {
      "_id": "...",
      "issueId": "...",
      "action": "status_changed",
      "performedBy": { "_id": "...", "name": "Admin User" },
      "details": { "from": "open", "to": "in-progress" },
      "createdAt": "2026-05-02T..."
    }
  ]
}
```

---

### User Management

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/users` | ✅ | admin | Get all users |

#### GET `/users`
**Response (200):**
```json
{
  "users": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "isActive": true,
      "createdAt": "..."
    }
  ]
}
```

---

## Authentication & Authorization

### Authentication Flow

```
1. User signs up/logins
         │
         ▼
2. Server validates credentials
         │
         ▼
3. Server generates JWT with user ID
         │
         ▼
4. Server sets HTTP-only cookie (7 days)
         │
         ▼
5. All subsequent requests include cookie
         │
         ▼
6. auth.middleware verifies JWT
         │
         ▼
7. req.user populated with { id, society, role }
```

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| `resident` | Create issues, report duplicates, view issues |
| `member` | + Update issue status, view audit logs |
| `admin` | + Assign issues, manage society, view dashboard, manage users |

### Middleware Chain

```typescript
// Protected route example
router.post("/", protect, authorize("resident"), createIssue);

// protect: Verifies JWT cookie, populates req.user
// authorize(...roles): Checks if req.user.role is in allowed roles
```

---

## Priority & SLA System

### Priority Calculation

Priority is calculated using the formula:

```
priorityScore = categoryWeight + (reportCount × 2) + (isBreached ? 15 : 0)
```

#### Category Weights

| Category | Weight |
|----------|--------|
| Lift | 10 |
| Security | 9 |
| Water | 8 |
| Electricity | 7 |
| Plumbing | 6 |
| Cleanliness | 4 |

#### SLA Deadlines (Default)

| Category | SLA (hours) |
|----------|-------------|
| Security | 2 |
| Lift | 4 |
| Water | 6 |
| Electricity | 12 |
| Plumbing | 24 |
| Cleanliness | 48 |

### Escalation Logic

1. When `slaDeadline` passes and issue is not resolved:
   - `isEscalated` → `true`
   - `breachedAt` → current timestamp
   - Priority score increases by **15 points**

2. High priority threshold: `priorityScore >= 20`

---

## Frontend Architecture

### State Management (Redux)

```
store/
├── authSlice      # User authentication state
├── issueSlice     # Issues CRUD
├── societySlice   # Society management
└── auditSlice     # Audit logs
```

### Key Components

| Component | Description |
|-----------|-------------|
| `DashboardStats` | Admin statistics display |
| `IssueCard` | Issue summary card |
| `Navbar` | Top navigation |
| `Sidebar` | Side navigation menu |
| `SLATimer` | Countdown to SLA deadline |
| `SocietySwitcher` | Switch between societies |

### Page Structure

```
pages/
├── auth/
│   ├── Login.tsx
│   └── Signup.tsx
├── dashboard/
│   ├── AdminDashboard.tsx
│   ├── MemberDashboard.tsx
│   └── ResidentDashboard.tsx
├── issues/
│   ├── IssueList.tsx
│   ├── IssueDetails.tsx
│   ├── ReportIssue.tsx
│   └── ManageIssues.tsx
└── society/
    ├── CreateSociety.tsx
    ├── JoinSociety.tsx
    └── ManageSociety.tsx
```

---

## Running the Application

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
# Create .env file (see .env.example)
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

```env
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/civicpulse
JWT_SECRET=your-super-secret-key
BACKEND_PORT=4000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
SALT_ROUNDS=10
```

