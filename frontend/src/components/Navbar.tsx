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
  { match: (p) => p === "/issues", title: "Community Issues" },
  { match: (p) => p === "/issue-board", title: "Issue Workflow Board" },
  { match: (p) => p === "/create-issue" || p === "/report", title: "Report an Issue" },
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Icon name="menu" className="size-5" />
          </button>
        )}
        <div>
          <h1 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user?.role === "resident" && (
          <Link
            to="/create-issue"
            className="hidden items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 sm:inline-flex"
          >
            <Icon name="plus" className="size-3.5" />
            Report Issue
          </Link>
        )}

        {user?.role === "admin" && (
          <Link
            to="/create-society"
            className="hidden items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 sm:inline-flex"
          >
            <Icon name="plus" className="size-3.5" />
            New Society
          </Link>
        )}

        {user && (
          <div className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 py-1 pl-3 pr-1.5 md:flex">
            <span className="text-xs font-medium text-slate-700">{user.name}</span>
            <Badge text={user.role} variant={user.role} dot={false} />
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={signingOut}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-60"
        >
          <Icon name="logout" className="size-3.5" />
          <span>{signingOut ? "Signing out…" : "Logout"}</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
