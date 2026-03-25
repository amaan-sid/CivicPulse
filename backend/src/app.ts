import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { db } from "./config/db";
import { env, validateEnv } from "./config/env";
import auditRoutes from "./routes/audit.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import authRoutes from "./routes/auth.routes";
import societyRoutes from "./routes/society.routes";
import issueRoutes from "./routes/issue.routes";
import userRoutes from "./routes/user.routes";
import { protect } from "./middlewares/auth.middleware";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";

export const app = express();

validateEnv();

app.disable("x-powered-by");

const corsOptions = {
  origin: ["https://civic-pulse-ui.vercel.app"],
  credentials: true
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
// const parseOrigin = (value: string) => {
//   try {
//     return new URL(value);
//   } catch {
//     return null;
//   }
// };

// const isAllowedOrigin = (origin: string | undefined) => {
//   if (!origin) {
//     return true;
//   }

//   const normalizedOrigin = origin.replace(/\/$/, "");

//   if (env.corsOrigins.includes(normalizedOrigin)) {
//     return true;
//   }

//   const requestUrl = parseOrigin(normalizedOrigin);

//   if (!requestUrl) {
//     return false;
//   }

//   return env.corsOrigins.some((allowedOrigin) => {
//     const allowedUrl = parseOrigin(allowedOrigin);

//     if (!allowedUrl) {
//       return false;
//     }

//     const requestIsVercel = requestUrl.hostname.endsWith(".vercel.app");
//     const allowedIsVercel = allowedUrl.hostname.endsWith(".vercel.app");

//     if (!requestIsVercel || !allowedIsVercel) {
//       return false;
//     }

//     const allowedProject = allowedUrl.hostname.replace(/\.vercel\.app$/, "");
//     const requestProject = requestUrl.hostname.replace(/\.vercel\.app$/, "");

//     return (
//       requestUrl.protocol === allowedUrl.protocol &&
//       (
//         requestProject === allowedProject ||
//         requestProject.startsWith(`${allowedProject}-`)
//       )
//     );
//   });
// };

// const corsOptions = {
//   origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
//     const isAllowed = isAllowedOrigin(origin);

//     if (isAllowed) {
//       return callback(null, true);
//     }

//     console.warn(`CORS blocked origin: ${origin}, Allowed: ${env.corsOrigins.join(", ")}`);
//     return callback(null, false);
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));
// app.options(/.*/, cors(corsOptions));

app.set("trust proxy", 1);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  return next();
});
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(async (_req, _res, next) => {
  try {
    await db();
    return next();
  } catch (error) {
    return next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/society", societyRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/issues", auditRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    environment: env.nodeEnv,
    uptimeSeconds: Math.round(process.uptime())
  });
});

app.get("/api/cors-config", (_req, res) => {
  res.status(200).json({
    status: "ok",
    environment: env.nodeEnv,
    corsOrigins: env.corsOrigins,
    corsOriginsEnvar: process.env.CORS_ORIGINS || "NOT SET",
    frontendUrl: process.env.FRONTEND_URL || "NOT SET"
  });
});

app.get("/.well-known/appspecific/com.chrome.devtools.json", (_req, res) => {
  res.status(204).end();
});

app.get("/", (_req, res) => {
  res.status(200).type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CivicPulse Backend</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f3f7f6;
        --panel: #ffffff;
        --text: #16302b;
        --muted: #5d726b;
        --accent: #0f766e;
        --border: #d7e4df;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        font-family: "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at top, rgba(15, 118, 110, 0.16), transparent 32%),
          linear-gradient(180deg, #f8fbfa 0%, var(--bg) 100%);
        color: var(--text);
      }

      main {
        width: min(720px, 100%);
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(12px);
        border: 1px solid var(--border);
        border-radius: 24px;
        padding: 32px;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
      }

      .eyebrow {
        display: inline-block;
        margin-bottom: 16px;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(15, 118, 110, 0.1);
        color: var(--accent);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      h1 {
        margin: 0 0 12px;
        font-size: clamp(32px, 5vw, 48px);
        line-height: 1.05;
      }

      p {
        margin: 0;
        color: var(--muted);
        font-size: 16px;
        line-height: 1.7;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin-top: 28px;
      }

      .card {
        padding: 18px;
        border-radius: 18px;
        border: 1px solid var(--border);
        background: #fcfefd;
      }

      .card strong {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
      }

      .card span {
        color: var(--muted);
        font-size: 14px;
        line-height: 1.6;
      }

      code {
        font-family: "SFMono-Regular", Consolas, monospace;
        color: var(--accent);
      }
    </style>
  </head>
  <body>
    <main>
      <div class="eyebrow">CivicPulse API</div>
      <h1>Backend is live and ready.</h1>
      <p>
        This deployment is serving the CivicPulse backend. Use the API routes for app traffic,
        and <code>/api/health</code> for health checks and deployment verification.
      </p>

      <section class="grid">
        <article class="card">
          <strong>Status</strong>
          <span>Online and responding to HTTP requests.</span>
        </article>
        <article class="card">
          <strong>Health Check</strong>
          <span><code>/api/health</code></span>
        </article>
        <article class="card">
          <strong>Environment</strong>
          <span>${env.nodeEnv}</span>
        </article>
      </section>
    </main>
  </body>
</html>`);
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
