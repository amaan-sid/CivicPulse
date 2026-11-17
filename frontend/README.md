# CivicPulse Frontend

Single-page web application for CivicPulse built with React 19, TypeScript, Vite 7, Redux Toolkit, React Router DOM 7, Axios, and Tailwind CSS 4.

## Scripts

```bash
npm install
npm run dev      # Start Vite dev server (proxies /api to http://localhost:4000)
npm run lint     # Run ESLint across the project
npm run build    # Type-check with tsc -b and produce production bundle in dist/
npm run preview  # Preview the production build locally
```

## Architecture

- **Routing (`src/App.tsx`, `src/components/ProtectedRoute.tsx`)**: Uses `BrowserRouter` with automatic session hydration (`fetchCurrentUser`), scroll restoration, `GuestRoute` for authentication views, and role-based `ProtectedRoute` guards (`resident`, `staff`, `admin`).
- **State (`src/app/store.ts`, `src/features/auth/authSlice.ts`)**: Redux Toolkit manages authentication state and async session hydration/sign-out thunks.
- **HTTP Layer (`src/services/api.ts`)**: Shared Axios instance configured with `withCredentials: true` and a 10-second request timeout.
- **UI System (`src/index.css`, `src/components/ui/`)**: Minimal monochrome neutral design language (`zinc` palette) reserving semantic color strictly for severity, SLA warnings, and resolution states.

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Base URL for API requests. Keep `/api` in development to route through the Vite proxy; set the full backend URL in production. |
| `VITE_PROXY_TARGET` | `http://localhost:4000` | Upstream API target used by the Vite dev server proxy. |

## Production Deployment

`vercel.json` configures SPA fallback rewrites so direct navigation to client routes (such as `/login`, `/dashboard`, `/issues`, and `/societies`) resolves cleanly to `/index.html`.

See the [root README](../README.md) for full system architecture diagrams, API documentation, and roadmap details.
