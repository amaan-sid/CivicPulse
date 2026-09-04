interface Props {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

function Card({ children, className = "", onClick }: Props) {
  return (
    <div onClick={onClick} className={`bg-white dark:bg-slate-800 p-6 rounded-md shadow-sm transition-all duration-300 ${className}`}>
      {children}
    </div>
  )
}

export default Card