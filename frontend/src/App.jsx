import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Controls from './pages/Controls'
import Risks from './pages/Risks'
import Policies from './pages/Policies'
import Quiz from './pages/Quiz'
import Learn from './pages/Learn'
import LessonView from './pages/LessonView'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('grclearn-dark-mode')
    return saved === 'true'
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('grclearn-dark-mode', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ backgroundColor: 'var(--bg-charcoal-overlay)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pt-14 lg:pt-8 lg:pl-64">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-3 left-3 z-20 lg:hidden w-9 h-9 rounded-lg bg-[var(--color-white)] border border-[var(--color-parchment)] flex items-center justify-center shadow-sm hover:bg-[var(--color-ivory)] transition-colors"
          aria-label="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--color-charcoal)]">
            <line x1="3" y1="4" x2="15" y2="4" />
            <line x1="3" y1="9" x2="15" y2="9" />
            <line x1="3" y1="14" x2="15" y2="14" />
          </svg>
        </button>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/controls" element={<Controls />} />
          <Route path="/risks" element={<Risks />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:id" element={<LessonView />} />
        </Routes>
      </main>
    </div>
  )
}
