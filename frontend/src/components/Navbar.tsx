import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { signOutUser } from "../features/auth/authSlice";
import { Icon } from "./ui/Icon";
import Badge from "./ui/Badge";

const PAGE_TITLES: Array<{ match: (path: string) => boolean; title: string }> = [
  { match: (p) => p === "/dashboard", title: "Dashboard" },
  { match: (p) => p === "/issues", title: "Issues" },
  { match: (p) => p === "/issue-board", title: "Issue Board" },
  { match: (p) => p === "/create-issue" || p === "/report", title: "Report Issue" },
  { match: (p) => p.startsWith("/issues/"), title: "Issue Details" },
  { match: (p) => p === "/societies", title: "Societies" },
  { match: (p) => p === "/create-society", title: "Create Society" },
  { match: (p) => p.startsWith("/society/"), title: "Society Issues" },
];

interface NavbarProps {
  onMenuClick?: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [signingOut, setSigningOut] = useState(false);

  const pageTitle =
    PAGE_TITLES.find((entry) => entry.match(location.pathname))?.title ?? "CivicPulse";

  const handleLogout = async () => {
    setSigningOut(true);
    await dispatch(signOutUser());
    setSigningOut(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-md border border-zinc-200 bg-white p-1.5 text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Icon name="menu" className="size-4" />
          </button>
        )}
        <h1 className="text-sm font-semibold tracking-tight text-zinc-900 sm:text-base">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        {user?.role === "resident" && (
          <Link
            to="/create-issue"
            className="hidden items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800 sm:inline-flex"
          >
            <Icon name="plus" className="size-3.5" />
            Report Issue
          </Link>
        )}

        {user?.role === "admin" && (
          <Link
            to="/create-society"
            className="hidden items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800 sm:inline-flex"
          >
            <Icon name="plus" className="size-3.5" />
            New Society
          </Link>
        )}

        {user && (
          <div className="hidden items-center gap-2 border-l border-zinc-200 pl-3 md:flex">
            <span className="text-xs font-medium text-zinc-700">{user.name}</span>
            <Badge text={user.role} variant={user.role} dot={false} />
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={signingOut}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50"
        >
          <Icon name="logout" className="size-3.5" />
          <span>{signingOut ? "Signing out…" : "Sign out"}</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
