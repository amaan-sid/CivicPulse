import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./app/store";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchCurrentUser } from "./features/auth/authSlice";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import IssueList from "./pages/issues/IssueList";
import CreateIssue from "./pages/issues/CreateIssue";
import IssueBoard from "./pages/issues/IssueBoard";
import CreateSociety from "./pages/society/CreateSociety";
import SocietyList from "./pages/society/SocietyList";
import SocietyIssues from "./pages/society/SocietyIssues";
import NotFound from "./pages/NotFound";
import IssueRoute from "./routes/IssueRoutes";
import ProtectedRoute, { AuthLoadingScreen, GuestRoute } from "./components/ProtectedRoute";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function HomeGate() {
  const { user, initialized } = useSelector((state: RootState) => state.auth);
  if (!initialized) return <AuthLoadingScreen />;
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public & Guest Routes */}
        <Route path="/" element={<HomeGate />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />

        {/* Protected Workspace Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues"
          element={
            <ProtectedRoute>
              <IssueList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issue-board"
          element={
            <ProtectedRoute>
              <IssueBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-issue"
          element={
            <ProtectedRoute allowedRoles={["resident"]}>
              <CreateIssue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute allowedRoles={["resident"]}>
              <CreateIssue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/:id"
          element={
            <ProtectedRoute>
              <IssueRoute />
            </ProtectedRoute>
          }
        />

        {/* Society Management Routes */}
        <Route
          path="/societies"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SocietyList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-society"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateSociety />
            </ProtectedRoute>
          }
        />
        <Route
          path="/society/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SocietyIssues />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

export default App;
