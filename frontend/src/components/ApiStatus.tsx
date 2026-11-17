import { useEffect, useState } from "react";
import { issuesAPI } from "../features/issues/issuesAPI";

type Status = "checking" | "ok" | "degraded" | "down";

const LABELS: Record<Status, string> = {
  checking: "Checking status",
  ok: "All systems operational",
  degraded: "Database unavailable",
  down: "API unreachable",
};

const DOTS: Record<Status, string> = {
  checking: "bg-zinc-300",
  ok: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-red-500",
};

export default function ApiStatus() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;
    const check = () =>
      issuesAPI
        .health()
        .then((h) => !cancelled && setStatus(h.status === "ok" ? "ok" : "degraded"))
        .catch((err) => !cancelled && setStatus(err?.status === 503 ? "degraded" : "down"));

    check();
    const timer = setInterval(check, 30_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <span className="inline-flex items-center gap-2 text-xs text-zinc-500" role="status">
      <span className={`size-2 rounded-full ${DOTS[status]}`} />
      {LABELS[status]}
    </span>
  );
}
