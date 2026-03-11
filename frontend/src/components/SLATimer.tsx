import { useEffect, useState } from "react"

interface Props {
  createdAt: string
  priority: "low" | "medium" | "high"
}

function SLATimer({ createdAt, priority }: Props) {

  const [timeLeft, setTimeLeft] = useState<number>(0)

  const getSLAHours = () => {
    if (priority === "high") return 12
    if (priority === "medium") return 24
    return 48
  }

  useEffect(() => {

    const updateTimer = () => {

      const created = new Date(createdAt).getTime()
      const slaHours = getSLAHours() * 60 * 60 * 1000

      const deadline = created + slaHours
      const remaining = deadline - Date.now()

      setTimeLeft(remaining)

    }

    updateTimer()

    const interval = setInterval(updateTimer, 60000)

    return () => clearInterval(interval)

  }, [createdAt, priority])

  if (timeLeft <= 0) {

    return (
      <span className="text-red-600 text-xs font-semibold">
        ⚠ SLA Breached
      </span>
    )

  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

  return (

    <span className="text-orange-600 text-xs font-semibold">
      ⏳ {hours}h {minutes}m left
    </span>

  )
}

export default SLATimer