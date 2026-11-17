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
    <aside className="flex h-full w-60 flex-col border-r border-zinc-200 bg-white text-zinc-900">
      <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4">
        <Link to="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5">
          <Logo className="size-7" />
          <span className="text-sm font-semibold tracking-tight text-zinc-900">CivicPulse</span>
        </Link>
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
            aria-label="Close navigation"
          >
            <Icon name="x" className="size-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          Workspace
        </p>
        <nav className="space-y-0.5" aria-label="Sidebar Navigation">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-zinc-900 font-medium text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
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
        <div className="border-t border-zinc-200 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-zinc-900">{user.name}</p>
              <p className="truncate text-[11px] text-zinc-500">{user.email}</p>
            </div>
          </div>
          <div className="mt-1 flex items-center justify-between px-2">
            <span className="text-[11px] text-zinc-400">Role</span>
            <Badge text={user.role} variant={user.role} dot={false} />
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
