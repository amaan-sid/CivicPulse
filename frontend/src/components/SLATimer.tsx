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
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
        <Icon name="check" className="size-3.5" />
        Resolved
      </span>
    );
  }

  if (timeLeft <= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
        <Icon name="alert" className="size-3.5" />
        SLA breached
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
      className={`inline-flex items-center gap-1 text-xs font-medium tabular-nums ${
        urgent ? "text-amber-700" : "text-zinc-500"
      }`}
    >
      <Icon name="clock" className="size-3.5" />
      {label}
    </span>
  );
}

export default SLATimer;
