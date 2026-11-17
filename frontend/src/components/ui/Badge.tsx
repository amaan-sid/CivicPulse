interface Props {
  text: string
  variant?: "low" | "medium" | "high" | "open" | "in-progress" | "resolved"
}

function Badge({ text, variant }: Props) {
  const getColor = () => {
    switch(variant) {
      case "high": return "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
      case "medium": return "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
      case "low": return "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
      case "resolved": return "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
      case "in-progress": return "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
      case "open": return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
      default: return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
    }
  }

  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-sm font-bold uppercase tracking-wider ${getColor()}`}>
      {text}
    </span>
  )
}

export default Badge