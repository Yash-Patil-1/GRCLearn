import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, AlertTriangle, FileText, BookOpen, ArrowRight, Library, TrendingUp } from 'lucide-react'
import axios from 'axios'
import StreakBadge from '../components/StreakBadge'

export default function Dashboard() {
  const [stats, setStats] = useState({})
  useEffect(() => {
    Promise.all([
      axios.get('/api/controls?limit=1'),
      axios.get('/api/risks'),
      axios.get('/api/policies'),
      axios.get('/api/frameworks'),
      axios.get('/api/lessons'),
    ]).then(([c, r, p, f, l]) => setStats({
      controls: c.data.total, risks: r.data.total, policies: p.data.policies.length,
      frameworks: f.data.frameworks.length, lessons: l.data.lessons.length,
    })).catch(() => {})
  }, [])

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-racing-green flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-charcoal tracking-tight">GRCLearn</h1>
            <p className="text-warm-gray text-sm">Governance, Risk & Compliance — master frameworks, controls, and risk management.</p>
          </div>
        </div>
      </div>

      {/* Streak + XP Badge */}
      <div className="mb-8">
        <StreakBadge />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
        <Stat icon={BookOpen} label="Lessons" value={stats.lessons || '—'} color="text-racing-green" />
        <Stat icon={Shield} label="Controls" value={stats.controls || '—'} color="text-racing-green" />
        <Stat icon={AlertTriangle} label="Risks" value={stats.risks || '—'} color="text-orange" />
        <Stat icon={FileText} label="Policies" value={stats.policies || '—'} color="text-champagne" />
        <Stat icon={Library} label="Frameworks" value={stats.frameworks || '—'} color="text-racing-green" />
      </div>

      {/* Quick Links */}
      <h2 className="text-sm font-semibold text-warm-gray uppercase tracking-wider mb-3">Start Learning</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <QLink to="/learn" title="Guided Lessons" desc="Step-by-step GRC lessons with active-recall checkpoints" icon={BookOpen} />
        <QLink to="/controls" title="Control Library" desc="Browse NIST, ISO, CIS controls with cross-framework mappings" icon={Shield} />
        <QLink to="/risks" title="Risk Management" desc="Risk scenarios, scoring, treatment, and KRI tracking" icon={TrendingUp} />
        <QLink to="/quiz" title="Knowledge Quiz" desc="Test your GRC knowledge across frameworks and scenarios" icon={AlertTriangle} />
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-parchment rounded-lg px-4 py-5 text-center shadow-sm transition-all duration-200 hover:border-champagne/50 hover:shadow-md">
      <div className="flex justify-center mb-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color === 'text-racing-green' ? 'bg-[rgba(0,77,43,0.06)]' : color === 'text-orange' ? 'bg-[rgba(180,134,0,0.06)]' : 'bg-[rgba(201,169,110,0.06)]'}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
      <span className="text-xl font-bold text-charcoal font-mono">{value}</span>
      <span className="block text-[10px] text-warm-gray mt-0.5 uppercase tracking-wider">{label}</span>
    </div>
  )
}

function QLink({ to, title, desc, icon: Icon }) {
  return (
    <Link to={to} className="group bg-white border border-parchment rounded-lg p-4 flex items-center justify-between shadow-sm hover:border-racing-green/30 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[rgba(0,77,43,0.06)] flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-racing-green" />
        </div>
        <div>
          <h3 className="font-medium text-charcoal text-sm group-hover:text-racing-green transition-colors">{title}</h3>
          <p className="text-xs text-warm-gray mt-0.5">{desc}</p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-warm-gray group-hover:text-racing-green transition-colors shrink-0 ml-3" />
    </Link>
  )
}
