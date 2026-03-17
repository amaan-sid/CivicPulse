# Contributing to CivicPulse

## Stack

- `backend/`: Express, Mongoose, TypeScript
- `frontend/`: React, Vite, Redux Toolkit, Tailwind CSS

## Requirements

- Node.js 18+
- npm 9+
- MongoDB connection string
- Git

## Local Setup

### Backend

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civicpulse
PORT=4000
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

Run:

```bash
npm run dev
```

Backend:

```text
http://localhost:4000
```

Health check:

```text
http://localhost:4000/api/health
```

### Frontend

```bash
cd frontend
npm install
```

Create or update `frontend/.env.development`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Useful Commands

### Backend

```bash
cd backend
npm run dev
npm run build
npm run start
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

## Deployment

### Backend

- Vercel project root: `backend`
- serverless entrypoints live in `backend/api/`

Required production env:

```env
MONGODB_URI=...
JWT_SECRET=...
NODE_ENV=production
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

### Frontend

Set:

```env
VITE_API_BASE_URL=https://your-backend-domain.vercel.app/api
```

## Workflow

- Create a focused branch:

```bash
git checkout -b feat/short-description
```

- Keep it updated:

```bash
git fetch upstream
git rebase upstream/main
```

Preferred branch prefixes:

- `feat/`
- `fix/`
- `docs/`
- `refactor/`
- `chore/`

## Quality Bar

- Use TypeScript consistently
- Keep changes scoped and readable
- Do not hardcode secrets, ports, or deployment URLs
- Use env variables for configuration
- Reuse the shared frontend API client in `frontend/src/services/api.ts`

Before opening a PR, run:

```bash
cd backend && npm run build
cd frontend && npm run build
cd frontend && npm run lint
```

## Pull Requests

Include:

- what changed
- why it changed
- how it was tested
- screenshots for UI changes
- env or deployment notes if relevant

## Security

- Never commit `.env` files or real secrets
- Rotate any exposed credential immediately
- Report security issues privately
