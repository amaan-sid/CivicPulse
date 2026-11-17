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
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Admin Overview
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor society SLA compliance, issue volume, and maintenance staffing at a glance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/societies"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
          >
            <Icon name="building" className="size-4" />
            View Societies
          </Link>
          <Link
            to="/create-society"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700"
          >
            <Icon name="plus" className="size-4" />
            Create Society
          </Link>
        </div>
      </div>

      <DashboardStats />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link to="/issues">
          <Card hover className="h-full">
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon name="list" className="size-5" />
              </div>
              <Icon name="arrowRight" className="size-4 text-slate-400" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">All Community Issues</h3>
            <p className="mt-1 text-sm text-slate-500">
              Review reported issues, assign staff members, and inspect full audit trails.
            </p>
          </Card>
        </Link>

        <Link to="/issue-board">
          <Card hover className="h-full">
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Icon name="kanban" className="size-5" />
              </div>
              <Icon name="arrowRight" className="size-4 text-slate-400" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">Workflow Board</h3>
            <p className="mt-1 text-sm text-slate-500">
              Track issues visually across Open, In Progress, and Resolved stages.
            </p>
          </Card>
        </Link>

        <Link to="/societies">
          <Card hover className="h-full">
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Icon name="building" className="size-5" />
              </div>
              <Icon name="arrowRight" className="size-4 text-slate-400" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">Manage Societies</h3>
            <p className="mt-1 text-sm text-slate-500">
              Browse registered residential communities and drill down into society-level issues.
            </p>
          </Card>
        </Link>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
