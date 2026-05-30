import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Risks() {
  const [risks, setRisks] = useState([])
  useEffect(() => { axios.get('/api/risks').then(r => setRisks(r.data.risks)) }, [])

  const getColor = (level) => {
    if (level === 'Critical') return 'tag-red'
    if (level === 'High') return 'text-[#E67E22] border-[#E67E22]'
    if (level === 'Medium') return 'text-[#F39C12] border-[#F39C12]'
    return 'tag-green'
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Risk Management</h1>
      <p className="text-ash mb-8">Risk scenarios with scoring, treatment, and control mapping.</p>

      {/* Risk Heat Map Legend */}
      <div className="flex gap-3 mb-6">
        <span className="tag-green">Low (1-4)</span>
        <span className="tag-default" style={{borderColor:'#F39C12',color:'#F39C12'}}>Medium (5-9)</span>
        <span className="tag-default" style={{borderColor:'#E67E22',color:'#E67E22'}}>High (10-15)</span>
        <span className="tag-red">Critical (16-25)</span>
      </div>

      <div className="space-y-3">
        {risks.map(risk => (
          <div key={risk.id} className="card hover:border-amber/30 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-polar">{risk.name}</h3>
                <p className="text-xs text-ash mt-1">{risk.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-polar">Score: {risk.risk_score}</span>
                <span className={`tag-default ${getColor(risk.risk_level)}`} style={risk.risk_level === 'Critical' ? {} : {borderColor: risk.risk_level === 'High' ? '#E67E22' : '#F39C12', color: risk.risk_level === 'High' ? '#E67E22' : '#F39C12'}}>
                  {risk.risk_level}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate mb-3">{risk.description}</p>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div><span className="text-ash">Likelihood:</span> <span className="font-mono">{risk.likelihood}/5</span></div>
              <div><span className="text-ash">Impact:</span> <span className="font-mono">{risk.impact}/5</span></div>
              <div><span className="text-ash">Treatment:</span> <span className="text-amber">{risk.treatment}</span></div>
            </div>
            {risk.controls && (
              <div className="flex gap-1 mt-3 flex-wrap">
                {risk.controls.map(c => <span key={c} className="tag-default">{c}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
