import { useAppSelector } from "./useAppDispatch";

export function useAuth() {
  const { user, initialized, loading } = useAppSelector((state) => state.auth);
  return {
    user,
    initialized,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    isStaff: user?.role === "staff",
    isResident: user?.role === "resident",
  };
}

