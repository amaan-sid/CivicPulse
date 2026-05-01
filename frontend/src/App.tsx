import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import type { RootState } from "./app/store"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import ProtectedRoute from "./components/ProtectedRoute"
import IssueList from "./pages/issues/IssueList"
import ReportIssue from "./pages/issues/ReportIssue"
import CreateSociety from "./pages/society/CreateSociety"
import ManageSociety from "./pages/society/ManageSociety"
import SocietyIssues from "./pages/society/SocietyIssues"
import Dashboard from "./pages/dashboard/Dashboard"
import IssueRoute from "./routes/IssueRoutes"
import JoinSociety from "./pages/society/JoinSociety"
import { useSelector } from "react-redux"
import ManageIssues from "./pages/issues/ManageIssues"
import IssueDetails from "./pages/issues/IssueDetails"

function App() {

  const user = useSelector((state : RootState) => state.auth.user)

  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT ROUTE */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute/>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-society" element={<CreateSociety />} />
              <Route path="/join-society" element={<JoinSociety />} />

              <Route path="/issues" element={<IssueList />} />
              <Route path="/report-issue" element={<ReportIssue />} />
              <Route path="/issues/:id" element={<IssueRoute />} />
              <Route path="/manageissues" element={<ManageIssues />} />
              <Route path="/society/:id" element={<SocietyIssues />} />
              <Route path="/managesociety" element={<ManageSociety />} />
              <Route path="/issuedetails/:id" element={<IssueDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App