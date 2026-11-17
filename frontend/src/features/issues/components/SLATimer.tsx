import { useEffect, useState } from "react"
import { Clock, AlertTriangle } from "lucide-react"

interface Props {
  createdAt?: string
  priority?: "low" | "medium" | "high" | string
  slaDeadline?: string | Date
  isEscalated?: boolean
  status?: string
}

function SLATimer({ createdAt, priority, slaDeadline, isEscalated, status }: Props) {
  const calculateRemaining = () => {
    if (slaDeadline) {
      return new Date(slaDeadline).getTime() - Date.now()
    }
    if (createdAt) {
      const slaHours = priority === "high" ? 12 : priority === "medium" ? 24 : 48
      const deadline = new Date(createdAt).getTime() + slaHours * 60 * 60 * 1000
      return deadline - Date.now()
    }
    return 0
  }

  const [timeLeft, setTimeLeft] = useState<number>(calculateRemaining)

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(calculateRemaining())
    }

    updateTimer()
    const interval = setInterval(updateTimer, 10000)
    return () => clearInterval(interval)
  }, [createdAt, priority, slaDeadline])

  // If issue is resolved, do not show breach warning
  if (status === "resolved") {
    return null
  }

  // If marked as escalated or deadline has passed
  if (isEscalated || timeLeft <= 0) {
    return (
      <div className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-sm text-xs font-semibold">
        <AlertTriangle size={13} />
        <span>SLA Breached</span>
      </div>
    )
  }

  const totalMinutes = Math.floor(timeLeft / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const isUrgent = hours < 2

  let timeString = ""
  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    timeString = `${days}d ${remainingHours}h left`
  } else if (hours > 0) {
    timeString = `${hours}h ${minutes}m left`
  } else {
    timeString = `${Math.max(0, minutes)}m left`
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${
        isUrgent
          ? "text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400"
          : "text-slate-500 bg-slate-100 dark:bg-slate-700/50 dark:text-slate-300"
      }`}
    >
      <Clock size={13} className={isUrgent ? "animate-pulse" : ""} />
      <span>{timeString}</span>
    </div>
  )
}

export default SLATimer