import { useEffect, useState } from "react";
import { Icon } from "./ui/Icon";

interface Props {
  createdAt: string;
  priority?: "low" | "medium" | "high";
  slaDeadline?: string;
  status?: "open" | "in-progress" | "resolved";
}

function SLATimer({ createdAt, priority = "low", slaDeadline, status }: Props) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const getSLAHours = () => {
      if (priority === "high") return 12;
      if (priority === "medium") return 24;
      return 48;
    };

    const updateTimer = () => {
      const deadline = slaDeadline
        ? new Date(slaDeadline).getTime()
        : new Date(createdAt).getTime() + getSLAHours() * 60 * 60 * 1000;
      setTimeLeft(deadline - Date.now());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60_000);
    return () => clearInterval(interval);
  }, [createdAt, priority, slaDeadline]);

  if (status === "resolved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
        <Icon name="check" className="size-3" />
        Resolved
      </span>
    );
  }

  if (timeLeft <= 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
        <Icon name="alert" className="size-3" />
        SLA Breached
      </span>
    );
  }

  const totalHours = Math.floor(timeLeft / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const urgent = totalHours < 4;

  const label = days > 0 ? `${days}d ${hours}h left` : `${hours}h ${minutes}m left`;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums ring-1 ring-inset ${
        urgent
          ? "bg-amber-50 text-amber-800 ring-amber-600/20"
          : "bg-slate-100 text-slate-600 ring-slate-500/15"
      }`}
    >
      <Icon name="clock" className="size-3" />
      {label}
    </span>
  );
}

export default SLATimer;
