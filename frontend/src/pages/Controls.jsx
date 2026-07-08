import { useEffect, useState } from 'react'
import { Search, Shield } from 'lucide-react'
import axios from 'axios'

export default function Controls() {
  const [controls, setControls] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (search.length >= 2) {
      axios.get(`/api/controls/search?q=${search}`).then(r => { setControls(r.data.controls); setTotal(r.data.total) })
    } else {
      axios.get('/api/controls?limit=100').then(r => { setControls(r.data.controls); setTotal(r.data.total) })
    }
  }, [search])

  return (
    <div className="max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-racing-green flex items-center justify-center shadow-sm">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">Control Library</h1>
          <p className="text-warm-gray text-sm">Browse NIST, ISO, CIS controls with cross-framework mappings.</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-warm-gray" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search controls by name, ID, or family..."
          className="input-field pl-10" />
      </div>
      <p className="text-xs text-warm-gray mb-4 font-mono">{total} controls loaded</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
        {/* List */}
        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          {controls.map(c => (
            <button key={c.id} onClick={() => setSelected(c)}
              className={`card w-full text-left transition-all duration-200 ${
                selected?.id === c.id
                  ? 'border-racing-green/40 shadow-sm bg-[var(--bg-green-subtle)]'
                  : 'hover:border-racing-green/20 hover:shadow-sm'
              }`}>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-racing-green font-semibold">{c.control_id}</span>
                    {c.priority === 'high' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red/5 text-red border border-red/20 font-mono">HIGH</span>
                    )}
                  </div>
                  <h3 className="text-sm text-charcoal font-medium truncate mt-0.5">{c.name}</h3>
                </div>
                <span className="tag-default shrink-0 ml-2">{c.family_id || c.family?.slice(0, 3)}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="card sticky top-4">
          {selected ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="tag-racing">{selected.control_id}</span>
                {selected.priority === 'high' && <span className="tag-red">HIGH PRIORITY</span>}
              </div>
              <h2 className="text-xl font-bold text-charcoal mb-1">{selected.name}</h2>
              <p className="text-xs text-warm-gray mb-4 font-mono">{selected.framework} — {selected.family}</p>
              <p className="text-sm text-warm-gray mb-5 leading-relaxed">{selected.description}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-racing-green uppercase tracking-wider mb-2">Implementation Guidance</h3>
                  <div className="bg-ivory rounded-lg p-3 border border-parchment">
                    <ul className="space-y-1">
                      {selected.implementation_guidance?.map((g, i) => (
                        <li key={i} className="text-xs text-warm-gray flex items-start gap-2">
                          <span className="text-racing-green mt-0.5">→</span>{g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-green uppercase tracking-wider mb-2">Audit Evidence</h3>
                  <ul className="space-y-1">
                    {selected.audit_evidence?.map((e, i) => (
                      <li key={i} className="text-xs text-warm-gray flex items-start gap-2">
                        <span className="text-green mt-0.5">•</span>{e}
                      </li>
                    ))}
                  </ul>
                </div>

                {selected.mappings && (
                  <div>
                    <h3 className="text-xs font-bold text-warm-gray uppercase tracking-wider mb-2">Cross-Framework Mapping</h3>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(selected.mappings).map(([fw, ids]) =>
                        ids.map(id => (
                          <span key={`${fw}-${id}`} className="tag-default font-mono text-[9px]">{fw}: {id}</span>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {selected.related_controls && (
                  <div>
                    <h3 className="text-xs font-bold text-warm-gray uppercase tracking-wider mb-2">Related Controls</h3>
                    <div className="flex flex-wrap gap-1">
                      {selected.related_controls.map(rc => (
                        <button key={rc} onClick={() => {
                          const found = controls.find(c => c.control_id === rc)
                          if (found) setSelected(found)
                        }}
                          className="text-[10px] font-mono text-racing-green bg-[var(--bg-green-subtle)] px-2 py-0.5 rounded border border-racing-green/20 hover:bg-[var(--bg-green-tag)] transition-colors">
                          {rc}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Shield className="w-12 h-12 mx-auto mb-3 text-warm-gray/40" />
              <p className="text-warm-gray">Select a control to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
