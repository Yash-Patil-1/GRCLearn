import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Shield, AlertTriangle, FileText, HelpCircle, BookOpen, Github } from 'lucide-react'

const links = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/learn', label: 'Guided Lessons', icon: BookOpen },
  { path: '/controls', label: 'Controls', icon: Shield },
  { path: '/risks', label: 'Risk Management', icon: AlertTriangle },
  { path: '/policies', label: 'Policies', icon: FileText },
  { path: '/quiz', label: 'Quiz', icon: HelpCircle },
]

export default function Sidebar() {
  const location = useLocation()
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-parchment flex flex-col p-4 shadow-sm">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-racing-green flex items-center justify-center shadow-sm">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-racing-green tracking-tight">GRCLearn</span>
          <span className="block text-[9px] text-warm-gray uppercase tracking-wider">Governance, Risk & Compliance</span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {links.map(({ path, label, icon: Icon }) => (
          <Link key={path} to={path} className={location.pathname === path ? 'nav-active' : 'nav-item'}>
            <Icon className="w-4 h-4" />{label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-parchment pt-4">
        <a href="https://github.com/Yash-Patil-1" target="_blank" rel="noopener noreferrer" className="nav-item">
          <Github className="w-4 h-4" />GitHub
        </a>
        <p className="text-[10px] text-warm-gray/60 px-3 mt-2">Educational GRC platform. Aston Martin edition.</p>
      </div>
    </aside>
  )
}
