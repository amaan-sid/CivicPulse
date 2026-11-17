import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../app/store";
import type { UserRole } from "../types/user";
import DashboardLayout from "../layouts/DashboardLayout";
import { Icon, Logo } from "./ui/Icon";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <div className="flex flex-col items-center gap-3">
        <Logo className="size-9 opacity-90" />
        <p className="text-xs font-medium text-zinc-500">Loading workspace…</p>
      </div>
    </div>
  );
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, initialized } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!initialized) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
            <Icon name="lock" className="size-5" />
          </div>
          <h2 className="text-base font-semibold text-zinc-900">Access Restricted</h2>
          <p className="mt-1.5 text-sm text-zinc-500">
            Your <span className="font-medium capitalize text-zinc-800">{user.role}</span> account
            does not have permission to view this page.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return <>{children}</>;
};

export function GuestRoute({ children }: { children: ReactNode }) {
  const { user, initialized } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!initialized) {
    return <AuthLoadingScreen />;
  }

  if (user) {
    const redirectTo = (location.state as { from?: string } | null)?.from || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
