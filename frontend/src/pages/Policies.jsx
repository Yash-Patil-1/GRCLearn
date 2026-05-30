import { useEffect, useState } from 'react'
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
      <h1 className="text-3xl font-bold mb-2">Policy Library</h1>
      <p className="text-ash mb-8">Security policy templates for learning and reference.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <div className="space-y-2">
          {policies.map(p => (
            <button key={p.id} onClick={() => loadPolicy(p.id)}
              className={`card w-full text-left text-sm ${selected === p.id ? 'border-amber/50' : 'hover:border-amber/30'} transition-colors`}>
              {p.name}
            </button>
          ))}
        </div>
        <div className="card">
          {content ? (
            <pre className="whitespace-pre-wrap text-sm text-slate font-sans leading-relaxed">{content}</pre>
          ) : (
            <p className="text-ash text-center py-12">Select a policy to view</p>
          )}
        </div>
      </div>
    </div>
  )
}
