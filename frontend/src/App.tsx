import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import type { RootState } from "./app/store"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import ProtectedRoute from "./components/ProtectedRoute"
import IssueList from "./pages/issues/IssueList"
import CreateIssue from "./pages/issues/CreateIssue"
import IssueBoard from "./pages/issues/IssueBoard"
import CreateSociety from "./pages/society/CreateSociety"
import SocietyList from "./pages/society/SocietyList"
import SocietyIssues from "./pages/society/SocietyIssues"
import Dashboard from "./pages/dashboard/Dashboard"
import IssueRoute from "./routes/IssueRoutes"
import JoinSociety from "./pages/society/JoinSociety"
import { useSelector } from "react-redux"

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
              <Route path="/create-issue" element={<CreateIssue />} />
              <Route path="/issues/:id" element={<IssueRoute />} />
              <Route path="/issue-board" element={<IssueBoard />} />
              <Route path="/society/:id" element={<SocietyIssues />} />
              <Route path="/societies" element={<SocietyList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App