import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardStats from "../../components/DashboardStats";
import Card from "../../components/ui/Card";
import { Icon } from "../../components/ui/Icon";

function AdminDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Overview of society SLA compliance, open issues, and communities.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/societies"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            <Icon name="building" className="size-4" />
            Societies
          </Link>
          <Link
            to="/create-society"
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            <Icon name="plus" className="size-4" />
            Create Society
          </Link>
        </div>
      </div>

      <DashboardStats />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          {
            to: "/issues",
            icon: "list" as const,
            title: "All Issues",
            desc: "Review reported issues, assign staff, and audit activity logs.",
          },
          {
            to: "/issue-board",
            icon: "kanban" as const,
            title: "Workflow Board",
            desc: "Track progress across Open, In Progress, and Resolved stages.",
          },
          {
            to: "/societies",
            icon: "building" as const,
            title: "Societies",
            desc: "Manage residential communities and view society-level queues.",
          },
        ].map((item) => (
          <Link key={item.to} to={item.to}>
            <Card hover className="h-full">
              <div className="flex items-center justify-between">
                <div className="flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
                  <Icon name={item.icon} className="size-4" />
                </div>
                <Icon name="arrowRight" className="size-4 text-zinc-400" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-zinc-500">{item.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
