# CivicPulse — Web app

React 19 + TypeScript + Vite + Tailwind CSS 4 single-page app for CivicPulse.

```bash
npm install
npm run dev      # http://localhost:5173 (proxies /api to http://localhost:4000)
npm run build    # production build in dist/
npm run lint
```

Configuration (`.env`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `/api` | API base URL. Keep `/api` in development to use the dev proxy. |
| `VITE_PROXY_TARGET` | `http://localhost:4000` | Dev-server proxy target. |

See the [root README](../README.md) for architecture, API reference, and design guidelines.
