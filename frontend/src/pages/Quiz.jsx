import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Lightbulb, HelpCircle, BarChart3, ChevronRight } from 'lucide-react'
import axios from 'axios'
import QuizResults from '../components/QuizResults'

const FRAMEWORKS = ['nist', 'iso27001', 'risk', 'compliance', 'audit']

export default function Quiz() {
  const [params, setParams] = useSearchParams()
  const framework = params.get('framework') || 'nist'
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [stats, setStats] = useState({ total_answered: 0, correct: 0, accuracy: 0 })

  // Session tracking
  const [sessionResults, setSessionResults] = useState([])
  const [showResults, setShowResults] = useState(false)

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
      .then(r => {
        setResult(r.data)
        // Track in session
        setSessionResults(prev => [...prev, {
          question: question.question,
          id: question.id,
          type: question.type,
          difficulty: question.difficulty,
          framework: question.framework || framework,
          userAnswer: answer,
          correct: r.data.correct,
          expected: r.data.expected,
          explanation: r.data.explanation,
        }])
        loadStats()
      })
  }

  const nextQuestion = () => {
    loadQuestion()
  }

  const finishQuiz = () => {
    setShowResults(true)
  }

  const restartQuiz = () => {
    setSessionResults([])
    setShowResults(false)
    setQuestion(null)
    setResult(null)
    setAnswer('')
    loadQuestion()
  }

  // Show results screen
  if (showResults) {
    return <QuizResults results={sessionResults} onRestart={restartQuiz} />
  }

  const sessionCorrect = sessionResults.filter(r => r.correct).length
  const sessionTotal = sessionResults.length

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-racing-green flex items-center justify-center shadow-sm">
          <HelpCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">Knowledge Quiz</h1>
          <p className="text-warm-gray text-sm">Test your GRC knowledge — scenarios, frameworks, compliance.</p>
        </div>
      </div>

      {/* Framework selector + session progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {FRAMEWORKS.map(fw => (
            <button key={fw} onClick={() => setParams({ framework: fw })}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                fw === framework
                  ? 'bg-[var(--bg-green-tag)] text-racing-green border border-racing-green/40 shadow-sm'
                  : 'bg-white text-warm-gray border border-parchment hover:text-racing-green hover:border-racing-green/30'
              }`}>
              {fw === 'iso27001' ? 'ISO 27001' : fw.toUpperCase()}
            </button>
          ))}
        </div>
        {sessionTotal > 0 && (
          <div className="flex items-center gap-2 text-xs text-warm-gray bg-white border border-parchment rounded-md px-3 py-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-racing-green" />
            <span>Session: <span className="text-green font-semibold">{sessionCorrect}</span>/{sessionTotal}</span>
          </div>
        )}
      </div>

      {/* Lifetime stats */}
      <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 text-sm bg-white border border-parchment rounded-lg px-4 py-3 shadow-sm">
        <span className="text-warm-gray">Answered: <span className="font-semibold text-charcoal">{stats.total_answered}</span></span>
        <span className="text-warm-gray">Correct: <span className="font-semibold text-green">{stats.correct}</span></span>
        <span className="text-warm-gray">Accuracy: <span className="font-semibold text-racing-green">{stats.accuracy}%</span></span>
        {sessionTotal > 0 && (
          <>
            <span className="w-px h-4 bg-parchment self-center hidden sm:block" />
            <span className="text-warm-gray">
              <span className="text-xs font-semibold text-champagne uppercase tracking-wider">Session</span>
              : <span className="font-semibold text-charcoal">{sessionCorrect}/{sessionTotal}</span>
              <span className="mx-1 text-parchment">·</span>
              <span className={`font-semibold ${sessionTotal > 0 && (sessionCorrect / sessionTotal) >= 0.7 ? 'text-racing-green' : 'text-champagne'}`}>
                {sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0}%
              </span>
            </span>
          </>
        )}
      </div>

      {question ? (
        <div className="card">
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              <span className="tag-racing">{question.type}</span>
              <span className="tag-green">{question.difficulty}</span>
            </div>
            {sessionTotal > 0 && (
              <button onClick={finishQuiz}
                className="text-xs text-warm-gray hover:text-red transition-colors flex items-center gap-1">
                Finish & See Results <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <p className="text-charcoal mb-6 leading-relaxed text-base sm:text-lg">{question.question}</p>
          {!result && (
            <>
              <textarea value={answer} onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="input-field font-mono text-sm min-h-[80px] sm:h-24 resize-none mb-4"
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAnswer() }}} />
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button onClick={submitAnswer} className="btn-primary justify-center text-sm">Submit</button>
                <button onClick={() => setShowHint(true)} className="btn-ghost justify-center text-sm">
                  <Lightbulb className="w-4 h-4" />Hint
                </button>
              </div>
              {showHint && question.hints?.[0] && (
                <p className="mt-4 text-xs text-champagne italic">💡 {question.hints[0]}</p>
              )}
            </>
          )}
          {result && (
            <div className={`p-4 rounded-lg border ${
              result.correct
                ? 'border-green/30 bg-[var(--bg-green-subtle)]'
                : 'border-red/30 bg-[var(--bg-red-subtle)]'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result.correct
                  ? <CheckCircle className="w-5 h-5 text-green shrink-0" />
                  : <XCircle className="w-5 h-5 text-red shrink-0" />
                }
                <span className={`font-semibold text-sm sm:text-base ${result.correct ? 'text-green' : 'text-red'}`}>
                  {result.correct ? 'Correct!' : 'Incorrect'}
                </span>
                {result.correct && result.xp_awarded > 0 && (
                  <span className="text-racing-green text-xs font-mono ml-auto">+{result.xp_awarded} XP</span>
                )}
              </div>
              <p className="text-sm text-warm-gray mb-2 leading-relaxed">{result.explanation}</p>
              {!result.correct && (
                <p className="text-xs text-warm-gray mb-3">
                  Expected: <code className="text-racing-green bg-ivory px-2 py-0.5 rounded text-xs font-mono break-words">{result.expected}</code>
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3">
                <button onClick={nextQuestion} className="btn-primary justify-center text-sm">Next Question <ChevronRight className="w-4 h-4" /></button>
                {sessionTotal >= 2 && (
                  <button onClick={finishQuiz} className="btn-ghost justify-center text-sm">
                    <BarChart3 className="w-4 h-4" /> See Results
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-12">
          <HelpCircle className="w-12 h-12 mx-auto mb-3 text-warm-gray" />
          <p className="text-warm-gray mb-2">No questions available for this framework yet.</p>
          <p className="text-xs text-warm-gray/60">Try switching to a different topic above.</p>
        </div>
      )}
    </div>
  )
}
