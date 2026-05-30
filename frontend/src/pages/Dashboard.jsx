import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, AlertTriangle, FileText, ArrowRight } from 'lucide-react'
import axios from 'axios'

export default function Dashboard() {
  const [stats, setStats] = useState({})
  useEffect(() => {
    Promise.all([
      axios.get('/api/controls?limit=1'),
      axios.get('/api/risks'),
      axios.get('/api/policies'),
      axios.get('/api/frameworks'),
    ]).then(([c, r, p, f]) => setStats({
      controls: c.data.total, risks: r.data.total, policies: p.data.policies.length, frameworks: f.data.frameworks.length
    })).catch(() => {})
  }, [])

  return (
    <div className="max-w-5xl">
      <h1 className="text-4xl font-bold text-polar mb-2">GRCLearn</h1>
      <p className="text-ash text-lg mb-10">Governance, Risk & Compliance — learn frameworks, controls, and risk management.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Stat icon={Shield} label="Controls" value={stats.controls || '—'} />
        <Stat icon={AlertTriangle} label="Risk Scenarios" value={stats.risks || '—'} />
        <Stat icon={FileText} label="Policies" value={stats.policies || '—'} />
        <Stat icon={Shield} label="Frameworks" value={stats.frameworks || '—'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QLink to="/controls" title="Control Library" desc="Browse NIST, ISO, CIS controls with mappings" />
        <QLink to="/risks" title="Risk Management" desc="Risk scenarios, scoring, and treatment" />
        <QLink to="/policies" title="Policy Library" desc="Security policy templates" />
        <QLink to="/controls" title="Framework Mapping" desc="Cross-framework control equivalences" />
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="card flex flex-col items-center py-6">
      <Icon className="w-6 h-6 text-amber mb-2" />
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-ash mt-1">{label}</span>
    </div>
  )
}

function QLink({ to, title, desc }) {
  return (
    <Link to={to} className="card group flex items-center justify-between hover:border-amber/30 transition-colors">
      <div><h3 className="font-medium">{title}</h3><p className="text-xs text-ash mt-1">{desc}</p></div>
      <ArrowRight className="w-4 h-4 text-ash group-hover:text-amber" />
    </Link>
  )
}
