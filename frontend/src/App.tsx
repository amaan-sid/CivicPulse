import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import type { RootState } from "@/app/store"
import { Toaster } from "react-hot-toast"
import AuthPage from "@/pages/auth/AuthPage"
import LandingPage from "@/pages/landing/LandingPage"
import ProtectedRoute from "@/components/layout/ProtectedRoute"
import IssueList from "@/pages/issues/IssueList"
import ReportIssue from "@/pages/issues/ReportIssue"
import ManageSociety from "@/pages/society/ManageSociety"
import SocietyIssues from "@/pages/society/SocietyIssues"
import JoinSociety from "@/pages/society/JoinSociety"
import { useSelector } from "react-redux"
import ManageIssues from "@/pages/issues/ManageIssues"
import IssueDetails from "@/pages/issues/IssueDetails"
import SuperAdminDashboard from "@/pages/admin/SuperAdminDashboard"

function App() {

  const user = useSelector((state : RootState) => state.auth.user)

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>

        <Route
          path="/"
          element={
            !user ? (
              <LandingPage />
            ) : user.platformRole === "SUPER_ADMIN" ? (
              <Navigate to="/super-admin" />
            ) : (
              <Navigate to="/managesociety" />
            ) 
          }
        />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />

        <Route element={<ProtectedRoute/>}>
              <Route path="/super-admin" element={<SuperAdminDashboard initialTab="overview" />} />
              <Route path="/super-admin/organizations" element={<SuperAdminDashboard initialTab="orgs" />} />
              <Route path="/super-admin/users" element={<SuperAdminDashboard initialTab="users" />} />
              <Route path="/super-admin/issues" element={<SuperAdminDashboard initialTab="issues" />} />
              <Route path="/join-society" element={<JoinSociety />} />
              <Route path="/issues" element={<IssueList />} />
              <Route path="/report-issue" element={<ReportIssue />} />
              <Route path="/issues/:id" element={<IssueDetails />} />
              <Route path="/manageissues" element={<ManageIssues />} />
              <Route path="/society/:id" element={<SocietyIssues />} />
              <Route path="/managesociety" element={<ManageSociety />} />
              <Route path="/my-societies" element={<ManageSociety />} />
              <Route path="/issuedetails/:id" element={<IssueDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App