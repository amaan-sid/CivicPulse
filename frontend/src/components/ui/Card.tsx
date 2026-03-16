interface Props {
  children: React.ReactNode
}

function Card({ children }: Props) {

  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
      {children}
    </div>
  )

}

export default Card