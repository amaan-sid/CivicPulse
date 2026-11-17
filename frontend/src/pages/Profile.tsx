import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../app/store";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { signOutUser } from "../features/auth/authSlice";
import DashboardLayout from "../layouts/DashboardLayout";
import SocietyLinkBanner from "../components/SocietyLinkBanner";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { Icon } from "../components/ui/Icon";

function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(signOutUser());
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Account</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your profile details, assigned role, and society membership.
        </p>
      </div>

      <SocietyLinkBanner />

      <div className="max-w-2xl space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">{user.name}</h2>
              <p className="text-xs text-zinc-500">{user.email}</p>
            </div>
            <Badge text={user.role} variant={user.role} dot={false} />
          </div>

          <dl className="mt-5 space-y-3.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-xs text-zinc-500">Account role</dt>
              <dd className="text-xs font-medium capitalize text-zinc-900">{user.role}</dd>
            </div>
            {user.flatNumber && (
              <div className="flex items-center justify-between">
                <dt className="text-xs text-zinc-500">Flat / Unit</dt>
                <dd className="text-xs font-medium text-zinc-900">{user.flatNumber}</dd>
              </div>
            )}
            <div className="flex items-center justify-between">
              <dt className="text-xs text-zinc-500">Society</dt>
              <dd className="text-xs font-medium text-zinc-900">
                {user.societyLabel || (user.role === "admin" ? "All managed societies" : "Not linked")}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-zinc-500">Society link status</dt>
              <dd className="text-xs font-medium text-zinc-900">
                {user.role === "admin"
                  ? "Administrator"
                  : user.societyResolved
                    ? "Verified & linked"
                    : "Pending link"}
              </dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-zinc-100 pt-5">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
            >
              <Icon name="logout" className="size-3.5" />
              Sign out
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Profile;

