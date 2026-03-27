import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import type { RootState } from "./app/store"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import LandingPage from "./pages/LandingPage"
import ProtectedRoute from "./components/ProtectedRoute"
import IssueList from "./pages/issues/IssueList"
import CreateIssue from "./pages/issues/CreateIssue"
import IssueBoard from "./pages/issues/IssueBoard"
import CreateSociety from "./pages/society/CreateSociety"
import SocietyList from "./pages/society/SocietyList"
import SocietyIssues from "./pages/society/SocietyIssues"
import Dashboard from "./pages/dashboard/Dashboard"
import IssueRoute from "./routes/IssueRoutes"
import { useSelector } from "react-redux"

function App() {

  const user = useSelector((state : RootState) => state.auth.user)

  return (
    <HashRouter>
      <Routes>

        {/* DEFAULT ROUTE */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <LandingPage />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/issues" element={<IssueList />} />
        <Route path="/create-issue" element={<CreateIssue />} />
        <Route path="/issues/:id" element={<IssueRoute />} />
        <Route path="/issue-board" element={<IssueBoard />} />
        <Route path="/create-society" element={<CreateSociety />} />
        <Route path="/society/:id" element={<SocietyIssues />} />
        <Route path="/societies" element={<SocietyList />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </HashRouter>
  )
}

export default App
