import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import Dashboard from "./pages/dashboard/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import IssueList from "./pages/issues/IssueList"
import CreateIssue from "./pages/issues/CreateIssue"
import IssueDetails from "./pages/issues/IssueDetails"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/issues" element={<IssueList />} />
        <Route path="/create-issue" element={<CreateIssue />} />
        <Route path="/issues/:id" element={<IssueDetails />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App