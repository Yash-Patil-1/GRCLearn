import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, Award, BarChart3, BookOpen, RefreshCw, Home, TrendingUp, Target } from 'lucide-react'

const FRAMEWORK_LABELS = {
  nist: 'NIST',
  iso27001: 'ISO 27001',
  risk: 'Risk',
  compliance: 'Compliance',
  audit: 'Audit',
  access_control: 'Access Control',
  audit_evidence: 'Audit Evidence',
  framework_mapping: 'Framework Mapping',
  general: 'General',
}

function labelFor(topic) {
  return FRAMEWORK_LABELS[topic] || topic.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function QuizResults({ results, onRestart }) {
  const totalQuestions = results.length

  // Guard: no questions attempted
  if (totalQuestions === 0) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in text-center py-16">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-warm-gray/40" />
        <h2 className="text-xl font-bold text-charcoal mb-2">No Results Yet</h2>
        <p className="text-warm-gray text-sm mb-6">Answer at least one question to see your results breakdown.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onRestart} className="btn-primary justify-center text-sm">Start Practicing</button>
          <Link to="/" className="btn-ghost justify-center text-sm">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const correctCount = results.filter(r => r.correct).length
  const incorrectCount = totalQuestions - correctCount
  const accuracy = Math.round((correctCount / totalQuestions) * 100)

  // Group by topic
  const byTopic = {}
  results.forEach(r => {
    const topic = r.framework || 'general'
    if (!byTopic[topic]) byTopic[topic] = { total: 0, correct: 0 }
    byTopic[topic].total++
    if (r.correct) byTopic[topic].correct++
  })

  // Group by difficulty
  const byDifficulty = {}
  results.forEach(r => {
    const diff = r.difficulty || 'medium'
    if (!byDifficulty[diff]) byDifficulty[diff] = { total: 0, correct: 0 }
    byDifficulty[diff].total++
    if (r.correct) byDifficulty[diff].correct++
  })

  const wrongAnswers = results.filter(r => !r.correct)
  const hasWrongAnswers = wrongAnswers.length > 0

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[var(--bg-green-tag)] flex items-center justify-center mx-auto mb-4">
          <Award className={`w-8 h-8 ${accuracy >= 80 ? 'text-racing-green' : accuracy >= 50 ? 'text-champagne' : 'text-warm-gray'}`} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight mb-1">
          Quiz Complete!
        </h1>
        <p className="text-warm-gray text-sm">Here's how you performed across all topics.</p>
      </div>

      {/* Score Card */}
      <div className="card mb-6 text-center py-6 sm:py-8">            <div className={`text-5xl sm:text-6xl font-bold font-mono mb-2 ${
            accuracy >= 80 ? 'text-racing-green' : accuracy >= 50 ? 'text-champagne' : 'text-red'
          }`}>
          {accuracy}%
        </div>
        <p className="text-warm-gray text-sm mb-4">
          <span className="text-green font-semibold">{correctCount} correct</span>
          <span className="mx-2">·</span>
          <span className="text-red font-semibold">{incorrectCount} incorrect</span>
          <span className="mx-2">·</span>
          <span className="text-charcoal font-semibold">{totalQuestions} total</span>
        </p>          <div className="w-full max-w-xs mx-auto h-2 bg-parchment/50 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ease-out ${
            accuracy >= 80 ? 'bg-racing-green' : accuracy >= 50 ? 'bg-champagne' : 'bg-red'
          }`}
            style={{ width: `${accuracy}%` }}
          />
        </div>
        <p className="text-xs text-warm-gray mt-3">
          {accuracy === 100 ? 'Perfect score! Outstanding GRC knowledge.' :
           accuracy >= 80 ? 'Excellent! You have strong GRC fundamentals.' :
           accuracy >= 60 ? 'Good progress! Review the wrong answers below to improve.' :
           'Keep practicing! Review the explanations below to build your knowledge.'}
        </p>
      </div>

      {/* Two-column stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Topic Breakdown */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-racing-green" />
            <h3 className="font-semibold text-charcoal text-sm">By Topic</h3>
          </div>
          {Object.entries(byTopic).length === 0 ? (
            <p className="text-xs text-warm-gray">No topics recorded.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(byTopic).map(([topic, data]) => (
                <div key={topic}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-charcoal">
                      {labelFor(topic)}
                    </span>
                    <span className="text-[10px] font-mono text-warm-gray">
                      {data.correct}/{data.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-parchment/50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-racing-green transition-all duration-500"
                      style={{ width: `${(data.correct / Math.max(1, data.total)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Difficulty Breakdown */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-champagne" />
            <h3 className="font-semibold text-charcoal text-sm">By Difficulty</h3>
          </div>
          {Object.entries(byDifficulty).length === 0 ? (
            <p className="text-xs text-warm-gray">No difficulty data.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(byDifficulty).map(([diff, data]) => (
                <div key={diff}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-medium capitalize ${
                      diff === 'easy' ? 'text-green' : diff === 'hard' ? 'text-red' : 'text-champagne'
                    }`}>
                      {diff}
                    </span>
                    <span className="text-[10px] font-mono text-warm-gray">
                      {data.correct}/{data.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-parchment/50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(data.correct / Math.max(1, data.total)) * 100}%`,
                        backgroundColor: diff === 'easy' ? '#004D2B' : diff === 'hard' ? '#A52A2A' : '#C9A96E',
                      }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Wrong Answer Review */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-red" />
          <h3 className="font-semibold text-charcoal text-sm">
            Wrong Answer Review
            <span className="ml-2 text-xs font-mono text-warm-gray font-normal">({wrongAnswers.length})</span>
          </h3>
        </div>

        {!hasWrongAnswers ? (
          <div className="text-center py-6">
            <CheckCircle className="w-10 h-10 text-green mx-auto mb-2" />
            <p className="text-sm text-racing-green font-medium">Perfect score — no mistakes to review!</p>
            <p className="text-xs text-warm-gray mt-1">You answered every question correctly.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wrongAnswers.map((item, i) => (
              <div key={i} className="border border-red/20 rounded-lg p-4 bg-[var(--bg-red-subtle)]">
                <div className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="tag-red text-[9px]">{item.type || 'theory'}</span>
                      <span className="tag-default text-[9px]">{item.difficulty || 'medium'}</span>
                      {item.framework && (
                        <span className="tag-default text-[9px]">
                          {labelFor(item.framework)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-charcoal font-medium mb-3 leading-relaxed">{item.question}</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-semibold text-red uppercase tracking-wider shrink-0 mt-0.5 w-16">You wrote:</span>
                        <span className="text-xs text-red bg-red/5 px-2 py-1 rounded font-mono break-words flex-1">{item.userAnswer}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-semibold text-racing-green uppercase tracking-wider shrink-0 mt-0.5 w-16">Expected:</span>
                        <span className="text-xs text-racing-green bg-racing-green/5 px-2 py-1 rounded font-mono break-words flex-1">{item.expected}</span>
                      </div>
                    </div>
                    {item.explanation && (
                      <div className="mt-3 pt-3 border-t border-red/10">
                        <p className="text-[11px] text-warm-gray leading-relaxed">
                          <span className="font-semibold text-charcoal">Why: </span>{item.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={onRestart} className="btn-primary justify-center text-sm">
          <RefreshCw className="w-4 h-4" /> Practice Again
        </button>
        <Link to="/" className="btn-ghost justify-center text-sm">
          <Home className="w-4 h-4" /> Back to Dashboard
        </Link>
        <Link to="/learn" className="btn-ghost justify-center text-sm">
          <BookOpen className="w-4 h-4" /> Review Lessons
        </Link>
      </div>
    </div>
  )
}
