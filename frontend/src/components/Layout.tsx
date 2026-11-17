import { Link, NavLink, Outlet } from "react-router";
import { Logo } from "./ui/Icon";
import ApiStatus from "./ApiStatus";
import { APP_NAME } from "../utils/constants";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
  }`;

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-[15px] font-semibold tracking-tight">{APP_NAME}</span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Main">
            <NavLink to="/" end className={navClass}>
              Issues
            </NavLink>
            <NavLink to="/report" className={navClass}>
              Report an issue
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:px-6">
          <span>© {new Date().getFullYear()} {APP_NAME}. Community issue resolution.</span>
          <ApiStatus />
        </div>
      </footer>
    </div>
  );
}
