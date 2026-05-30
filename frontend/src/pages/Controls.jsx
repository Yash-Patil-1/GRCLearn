import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
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
      <h1 className="text-3xl font-bold mb-6">Control Library</h1>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-4 h-4 text-ash" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search controls..." className="input-field pl-10" />
      </div>
      <p className="text-xs text-ash mb-4">{total} controls</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
        {/* List */}
        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
          {controls.map(c => (
            <button key={c.id} onClick={() => setSelected(c)} className={`card w-full text-left hover:border-amber/30 transition-colors ${selected?.id === c.id ? 'border-amber/50' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-amber">{c.control_id}</span>
                  <h3 className="text-sm text-polar font-medium">{c.name}</h3>
                </div>
                <span className="tag-default">{c.family_id || c.family?.slice(0,2)}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="card sticky top-4">
          {selected ? (
            <div>
              <span className="tag-amber mb-2">{selected.control_id}</span>
              <h2 className="text-xl font-bold mt-2 mb-1">{selected.name}</h2>
              <p className="text-xs text-ash mb-4">{selected.framework} — {selected.family}</p>
              <p className="text-sm text-slate mb-4">{selected.description}</p>

              <h3 className="text-xs font-bold text-amber uppercase mb-2">Implementation Guidance</h3>
              <ul className="space-y-1 mb-4">{selected.implementation_guidance?.map((g,i) => <li key={i} className="text-xs text-slate">• {g}</li>)}</ul>

              <h3 className="text-xs font-bold text-green uppercase mb-2">Audit Evidence</h3>
              <ul className="space-y-1 mb-4">{selected.audit_evidence?.map((e,i) => <li key={i} className="text-xs text-slate">• {e}</li>)}</ul>

              {selected.mappings && (
                <>
                  <h3 className="text-xs font-bold text-ash uppercase mb-2">Cross-Framework Mapping</h3>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(selected.mappings).map(([fw, ids]) => ids.map(id => <span key={`${fw}-${id}`} className="tag-default">{fw}: {id}</span>))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-ash text-center py-12">Select a control to view details</p>
          )}
        </div>
      </div>
    </div>
  )
}
