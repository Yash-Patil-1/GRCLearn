import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Shield, AlertTriangle, FileText, HelpCircle, Github } from 'lucide-react'

const links = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/controls', label: 'Controls', icon: Shield },
  { path: '/risks', label: 'Risk Management', icon: AlertTriangle },
  { path: '/policies', label: 'Policies', icon: FileText },
  { path: '/quiz', label: 'Quiz', icon: HelpCircle },
]

export default function Sidebar() {
  const location = useLocation()
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-void border-r border-[#333] flex flex-col p-4">
      <Link to="/" className="flex items-center gap-2 mb-8 px-2">
        <span className="text-lg font-bold text-amber">🏛️ GRCLearn</span>
      </Link>
      <nav className="flex-1 space-y-1">
        {links.map(({ path, label, icon: Icon }) => (
          <Link key={path} to={path} className={location.pathname === path ? 'nav-active' : 'nav-item'}>
            <Icon className="w-4 h-4" />{label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-[#333] pt-4">
        <a href="https://github.com/Yash-Patil-1" target="_blank" rel="noopener noreferrer" className="nav-item">
          <Github className="w-4 h-4" />GitHub
        </a>
        <p className="text-[10px] text-ash px-3 mt-2">Educational GRC platform.</p>
      </div>
    </aside>
  )
}
