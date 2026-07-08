import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import axios from 'axios'

export default function Risks() {
  const [risks, setRisks] = useState([])
  useEffect(() => { axios.get('/api/risks').then(r => setRisks(r.data.risks)) }, [])

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-racing-green flex items-center justify-center shadow-sm">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">Risk Management</h1>
          <p className="text-warm-gray text-sm">Risk scenarios with scoring, treatment, and control mapping.</p>
        </div>
      </div>

      {/* Risk Heat Map Legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="tag-green">Low (1-4)</span>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-yellow/40 text-yellow bg-[rgba(212,175,55,0.04)]">Medium (5-9)</span>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-orange/40 text-orange bg-[rgba(184,134,11,0.04)]">High (10-15)</span>
        <span className="tag-red">Critical (16-25)</span>
      </div>

      <div className="space-y-3">
        {risks.map(risk => {
          const levelColors = {
            Critical: { tag: 'tag-red', bg: 'bg-[rgba(165,42,42,0.03)]' },
            High: { tag: 'text-orange border-orange', bg: 'bg-[rgba(184,134,11,0.03)]' },
            Medium: { tag: 'text-yellow border-yellow', bg: 'bg-[rgba(212,175,55,0.03)]' },
            Low: { tag: 'tag-green', bg: 'bg-[rgba(0,77,43,0.03)]' },
          }
          const lc = levelColors[risk.risk_level] || levelColors.Low

          return (
            <div key={risk.id}
              className={`card transition-all duration-200 hover:shadow-md ${lc.bg}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0">
                  <h3 className="font-medium text-charcoal">{risk.name}</h3>
                  <p className="text-xs text-warm-gray mt-0.5">{risk.category}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-xs font-mono text-charcoal">Score: {risk.risk_score}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${lc.tag}`}>
                    {risk.risk_level}
                  </span>
                </div>
              </div>
              <p className="text-xs text-warm-gray mb-3 leading-relaxed">{risk.description}</p>
              <div className="grid grid-cols-3 gap-4 text-xs bg-white rounded-lg border border-parchment/60 p-3">
                <div>
                  <span className="text-warm-gray block">Likelihood</span>
                  <span className="font-mono text-charcoal font-semibold">{risk.likelihood}/5</span>
                </div>
                <div>
                  <span className="text-warm-gray block">Impact</span>
                  <span className="font-mono text-charcoal font-semibold">{risk.impact}/5</span>
                </div>
                <div>
                  <span className="text-warm-gray block">Treatment</span>
                  <span className="text-racing-green font-semibold">{risk.treatment}</span>
                </div>
              </div>
              {risk.controls && (
                <div className="flex gap-1 mt-3 flex-wrap">
                  {risk.controls.map(c => (
                    <span key={c} className="tag-default text-[9px]">{c}</span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
