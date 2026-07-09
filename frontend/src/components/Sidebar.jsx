import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Shield, AlertTriangle, FileText, HelpCircle, BookOpen, Github, X, Sun, Moon } from 'lucide-react'

const links = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/learn', label: 'Guided Lessons', icon: BookOpen },
  { path: '/controls', label: 'Controls', icon: Shield },
  { path: '/risks', label: 'Risk Management', icon: AlertTriangle },
  { path: '/policies', label: 'Policies', icon: FileText },
  { path: '/quiz', label: 'Quiz', icon: HelpCircle },
]

export default function Sidebar({ onClose, darkMode, toggleDarkMode }) {
  const location = useLocation()
  const handleClick = () => {
    if (window.innerWidth < 1024 && onClose) onClose()
  }

  return (
    <aside className="h-full w-60 bg-[var(--color-white)] border-r border-[var(--color-parchment)] flex flex-col p-4 shadow-sm">
      {/* Brand + close button */}
      <div className="flex items-start justify-between mb-8 px-2">
        <Link to="/" onClick={handleClick} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-racing-green)] flex items-center justify-center shadow-sm shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-[var(--color-racing-green)] tracking-tight">GRCLearn</span>
            <span className="block text-[9px] text-[var(--color-warm-gray)] uppercase tracking-wider">Governance, Risk & Compliance</span>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} aria-label="Close sidebar" className="lg:hidden w-7 h-7 rounded-md flex items-center justify-center text-[var(--color-warm-gray)] hover:text-[var(--color-charcoal)] hover:bg-[var(--color-ivory)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {links.map(({ path, label, icon: Icon }) => (
          <Link key={path} to={path} onClick={handleClick} className={location.pathname === path ? 'nav-active' : 'nav-item'}>
            <Icon className="w-4 h-4" />{label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--color-parchment)] pt-3 space-y-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs text-[var(--color-warm-gray)] hover:text-[var(--color-racing-green)] hover:bg-[var(--bg-green-subtle)] transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <a href="https://github.com/Yash-Patil-1" target="_blank" rel="noopener noreferrer" className="nav-item">
          <Github className="w-4 h-4" />GitHub
        </a>
        <p className="text-[10px] text-[var(--color-warm-gray)]/60 px-3 mt-2">Educational GRC platform. Aston Martin edition.</p>
      </div>
    </aside>
  )
}
