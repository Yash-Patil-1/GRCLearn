import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Lightbulb, HelpCircle } from 'lucide-react'
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-racing-green flex items-center justify-center shadow-sm">
          <HelpCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">Knowledge Quiz</h1>
          <p className="text-warm-gray text-sm">Test your GRC knowledge — scenarios, frameworks, compliance.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FRAMEWORKS.map(fw => (
          <button key={fw} onClick={() => setParams({ framework: fw })}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
              fw === framework
                ? 'bg-[rgba(0,77,43,0.08)] text-racing-green border border-racing-green/40 shadow-sm'
                : 'bg-white text-warm-gray border border-parchment hover:text-racing-green hover:border-racing-green/30'
            }`}>
            {fw === 'iso27001' ? 'ISO 27001' : fw.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex gap-6 mb-6 text-sm bg-white border border-parchment rounded-lg px-4 py-3 shadow-sm">
        <span className="text-warm-gray">Answered: <span className="font-semibold text-charcoal">{stats.total_answered}</span></span>
        <span className="text-warm-gray">Correct: <span className="font-semibold text-green">{stats.correct}</span></span>
        <span className="text-warm-gray">Accuracy: <span className="font-semibold text-racing-green">{stats.accuracy}%</span></span>
      </div>

      {question ? (
        <div className="card">
          <div className="flex justify-between mb-4">
            <span className="tag-racing">{question.type}</span>
            <span className="tag-green">{question.difficulty}</span>
          </div>
          <p className="text-charcoal mb-6 leading-relaxed text-lg">{question.question}</p>
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
                <p className="mt-4 text-xs text-champagne italic">💡 {question.hints[0]}</p>
              )}
            </>
          )}
          {result && (
            <div className={`mt-4 p-4 rounded-lg border ${
              result.correct
                ? 'border-green/30 bg-[rgba(0,77,43,0.04)]'
                : 'border-red/30 bg-[rgba(165,42,42,0.04)]'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result.correct
                  ? <CheckCircle className="w-5 h-5 text-green" />
                  : <XCircle className="w-5 h-5 text-red" />
                }
                <span className={`font-semibold ${result.correct ? 'text-green' : 'text-red'}`}>
                  {result.correct ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-sm text-warm-gray mb-2">{result.explanation}</p>
              {!result.correct && (
                <p className="text-xs text-warm-gray mb-3">
                  Expected: <code className="text-racing-green bg-ivory px-2 py-0.5 rounded text-xs font-mono">{result.expected}</code>
                </p>
              )}
              <button onClick={loadQuestion} className="btn-primary mt-2">Next Question →</button>
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-12">
          <HelpCircle className="w-12 h-12 mx-auto mb-3 text-warm-gray" />
          <p className="text-warm-gray">No questions available for this framework yet.</p>
        </div>
      )}
    </div>
  )
}
