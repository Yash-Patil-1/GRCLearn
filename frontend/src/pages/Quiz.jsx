import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import axios from 'axios'

const FRAMEWORKS = ['nist', 'iso27001', 'risk', 'compliance', 'audit']

export default function Quiz() {
  const [params, setParams] = useSearchParams()
  const framework = params.get('framework') || 'nist'
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [stats, setStats] = useState({ total_answered: 0, correct: 0, accuracy: 0 })

  const loadQuestion = () => {
    setResult(null); setAnswer(''); setShowHint(false)
    axios.get(`/api/quiz/next?framework=${framework}`)
      .then(r => setQuestion(r.data))
      .catch(() => setQuestion(null))
  }

  const loadStats = () => {
    axios.get(`/api/quiz/stats?framework=${framework}`)
      .then(r => setStats(r.data))
      .catch(() => {})
  }

  useEffect(() => { loadQuestion(); loadStats() }, [framework])

  const submitAnswer = () => {
    if (!answer.trim() || !question) return
    axios.post('/api/quiz/answer', { question_id: question.id, framework, answer })
      .then(r => { setResult(r.data); loadStats() })
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Quiz</h1>
      <p className="text-ash mb-6">Test your GRC knowledge — scenarios, frameworks, compliance.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {FRAMEWORKS.map(fw => (
          <button key={fw} onClick={() => setParams({ framework: fw })}
            className={`px-3 py-1.5 rounded text-xs font-medium transition ${fw === framework ? 'bg-amber/20 text-amber border border-amber/50' : 'bg-white/5 text-ash hover:text-polar border border-white/10 hover:border-amber/30'}`}>
            {fw === 'iso27001' ? 'ISO 27001' : fw.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex gap-6 mb-6 text-sm">
        <span className="text-ash">Answered: <span className="text-polar">{stats.total_answered}</span></span>
        <span className="text-ash">Correct: <span className="text-green">{stats.correct}</span></span>
        <span className="text-ash">Accuracy: <span className="text-amber">{stats.accuracy}%</span></span>
      </div>

      {question ? (
        <div className="card">
          <div className="flex justify-between mb-4">
            <span className="tag-amber">{question.type}</span>
            <span className="tag-green">{question.difficulty}</span>
          </div>
          <p className="text-polar mb-6 leading-relaxed text-lg">{question.question}</p>
          {!result && (
            <>
              <textarea value={answer} onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="input-field font-mono text-sm h-24 resize-none mb-4"
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAnswer() }}} />
              <div className="flex gap-3">
                <button onClick={submitAnswer} className="btn-primary">Submit</button>
                <button onClick={() => setShowHint(true)} className="btn-ghost flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" />Hint
                </button>
              </div>
              {showHint && question.hints?.[0] && (
                <p className="mt-4 text-xs text-amber italic">💡 {question.hints[0]}</p>
              )}
            </>
          )}
          {result && (
            <div className={`mt-4 p-4 rounded-lg border ${result.correct ? 'border-green/50 bg-green/5' : 'border-[#E74C3C]/50 bg-[#E74C3C]/5'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.correct ? <CheckCircle className="w-5 h-5 text-green" /> : <XCircle className="w-5 h-5 text-[#E74C3C]" />}
                <span className="font-medium text-polar">{result.correct ? 'Correct!' : 'Incorrect'}</span>
              </div>
              <p className="text-sm text-slate mb-2">{result.explanation}</p>
              {!result.correct && <p className="text-xs text-ash">Expected: <code className="text-amber bg-white/5 px-2 py-0.5 rounded">{result.expected}</code></p>}
              <button onClick={loadQuestion} className="btn-primary mt-4">Next Question →</button>
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-ash">No questions available for this framework yet.</p>
        </div>
      )}
    </div>
  )
}
