import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

function Card({ children, className = "", hover = false }: Props) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-5 ${
        hover ? "transition-colors duration-150 hover:border-zinc-300 hover:bg-zinc-50/40" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
