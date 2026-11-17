import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Icon, Logo, type IconName } from "./ui/Icon";
import Badge from "./ui/Badge";

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
  roles?: Array<"resident" | "staff" | "admin">;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/issues", label: "Issues", icon: "list" },
  { to: "/issue-board", label: "Issue Board", icon: "kanban" },
  { to: "/create-issue", label: "Report Issue", icon: "plus", roles: ["resident"] },
  { to: "/societies", label: "Societies", icon: "building", roles: ["admin"] },
  { to: "/create-society", label: "Create Society", icon: "plus", roles: ["admin"] },
];

interface SidebarProps {
  onNavigate?: () => void;
}

function Sidebar({ onNavigate }: SidebarProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const initials = (user?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-100">
      <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-5">
        <Link to="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5">
          <Logo className="size-8" />
          <div>
            <p className="text-sm font-bold tracking-tight text-white">CivicPulse</p>
            <p className="text-[11px] text-slate-400">Society Operations</p>
          </div>
        </Link>
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <Icon name="x" className="size-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>
        <nav className="space-y-1" aria-label="Sidebar Navigation">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-950/40"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon name={item.icon} className="size-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {user && (
        <div className="border-t border-slate-800/80 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-900/90 p-3 ring-1 ring-slate-800">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/40">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user.name}</p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between px-1">
            <span className="text-[11px] text-slate-500">Signed in as</span>
            <Badge text={user.role} variant={user.role} dot={false} />
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
