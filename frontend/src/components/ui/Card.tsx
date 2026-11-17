import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

function Card({ children, className = "", hover = false }: Props) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs ${
        hover ? "transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
