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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          <Logo className="size-12" />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <span className="size-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:-0.2s]" />
          <span className="size-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:-0.1s]" />
          <span className="size-2 animate-bounce rounded-full bg-indigo-600" />
          <span className="ml-1">Restoring your session…</span>
        </div>
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
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200">
            <Icon name="lock" className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
          <p className="mt-2 text-sm text-slate-600">
            Your <span className="font-semibold capitalize">{user.role}</span> account doesn&apos;t have permission to view this page.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
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
