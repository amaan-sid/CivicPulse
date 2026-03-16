interface Props {
  text: string
  variant?: "low" | "medium" | "high" | "open" | "in-progress" | "resolved"
}

function Badge({ text, variant }: Props) {

  const getColor = () => {

    if (variant === "high") return "bg-red-100 text-red-600"
    if (variant === "medium") return "bg-yellow-100 text-yellow-700"
    if (variant === "low") return "bg-green-100 text-green-600"

    if (variant === "resolved") return "bg-green-100 text-green-600"
    if (variant === "in-progress") return "bg-blue-100 text-blue-600"
    if (variant === "open") return "bg-gray-100 text-gray-600"

    return "bg-gray-100 text-gray-600"
  }

  return (
    <span
      className={`text-xs px-2 py-1 rounded font-medium ${getColor()}`}
    >
      {text}
    </span>
  )
}

export default Badge