import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import Dashboard from "./pages/dashboard/Dashboard"
import IssueList from "./pages/issues/IssueList"
import CreateIssue from "./pages/issues/CreateIssue"
import IssueDetails from "./pages/issues/IssueDetails"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/issues" element={<ProtectedRoute><IssueList /></ProtectedRoute>} />
        <Route path="/issues/create" element={<ProtectedRoute><CreateIssue /></ProtectedRoute>} />
        <Route path="/issues/:id" element={<ProtectedRoute><IssueDetails /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App