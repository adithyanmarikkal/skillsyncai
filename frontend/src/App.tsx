import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { type ReactElement } from 'react'

import AnalyzeDashboard from "./pages/AnalyzeDashboard";
import Login from "./pages/Login";

// Auth guard: redirects to /login if no token is stored
const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AnalyzeDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
