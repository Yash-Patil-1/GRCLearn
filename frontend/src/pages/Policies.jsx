import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import axios from 'axios'

export default function Policies() {
  const [policies, setPolicies] = useState([])
  const [content, setContent] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => { axios.get('/api/policies').then(r => setPolicies(r.data.policies)) }, [])

  const loadPolicy = (id) => {
    setSelected(id)
    axios.get(`/api/policies/${id}`).then(r => setContent(r.data.content))
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-racing-green flex items-center justify-center shadow-sm">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">Policy Library</h1>
          <p className="text-warm-gray text-sm">Security policy templates for learning and reference.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <div className="space-y-1.5">
          {policies.map(p => (
            <button key={p.id} onClick={() => loadPolicy(p.id)}
              className={`w-full text-left text-sm transition-all duration-200 rounded-lg px-3 py-2 ${
                selected === p.id
                  ? 'bg-[var(--bg-green-faint)] text-racing-green font-medium border border-racing-green/20'
                  : 'text-warm-gray hover:text-racing-green hover:bg-[var(--bg-green-subtle)] border border-transparent'
              }`}>
              {p.name}
            </button>
          ))}
        </div>
        <div className="card min-h-[300px]">
          {content ? (
            <div>
              <h2 className="text-lg font-bold text-charcoal mb-4 pb-3 border-b border-parchment">
                {policies.find(p => p.id === selected)?.name || 'Policy'}
              </h2>
              <pre className="whitespace-pre-wrap text-sm text-warm-gray font-sans leading-relaxed">{content}</pre>
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 mx-auto mb-3 text-warm-gray/40" />
              <p className="text-warm-gray">Select a policy to view</p>
              <p className="text-xs text-warm-gray/60 mt-1">Choose from the list on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
