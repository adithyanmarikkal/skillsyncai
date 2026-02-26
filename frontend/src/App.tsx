import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AnalyzeDashboard from "./pages/AnalyzeDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnalyzeDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
