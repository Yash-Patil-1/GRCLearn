import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Controls from './pages/Controls'
import Risks from './pages/Risks'
import Policies from './pages/Policies'
import Quiz from './pages/Quiz'

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/controls" element={<Controls />} />
          <Route path="/risks" element={<Risks />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </main>
    </div>
  )
}
