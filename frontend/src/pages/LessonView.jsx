import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Lightbulb, Award, Flame } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import SkeletonLoader from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'

export default function LessonView() {
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [step, setStep] = useState(0)
  const [checkpointIndex, setCheckpointIndex] = useState(0)
  const [checkpointIds, setCheckpointIds] = useState([])
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [streak, setStreak] = useState(null)
  const [phase, setPhase] = useState('reading')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true); setError(false); setLesson(null)
    axios.get(`/api/lessons/${id}`).then(r => {
      setLesson(r.data)
      const ids = [...r.data.checkpoint_question_ids].sort(() => Math.random() - 0.5)
      setCheckpointIds(ids)
      setLoading(false)
    }).catch(() => { setError(true); setLoading(false) })
  }, [id])

  useEffect(() => {
    if (phase !== 'checkpoint' || !lesson) return
    if (checkpointIndex >= checkpointIds.length) {
      setPhase('reading')
      return
    }
    const qid = checkpointIds[checkpointIndex]
    setAnswer(''); setResult(null); setShowHint(false); setQuestion(null)
    axios.get(`/api/quiz/question/${qid}`)
      .then(r => setQuestion(r.data))
      .catch(() => setCheckpointIndex(i => i + 1))
  }, [phase, checkpointIndex, checkpointIds, lesson])

  const submitCheckpoint = () => {
    if (!answer.trim() || !question) return
    axios.post('/api/quiz/answer', {
      question_id: question.id,
      framework: question.topic_id || question.framework || '',
      answer,
    }).then(r => {
      setResult(r.data)
      if (r.data.xp_awarded > 0) setXpEarned(prev => prev + r.data.xp_awarded)
      if (r.data.streak) setStreak(r.data.streak)
      setPhase('result')
    })
  }

  const advanceAfterResult = () => {
    setCheckpointIndex(i => i + 1)
    setQuestion(null); setResult(null); setAnswer(''); setShowHint(false)
    setPhase('reading')
    setStep(s => Math.min(s + 1, lesson.sections.length - 1))
  }

  const advanceSection = () => {
    const nextStep = step + 1
    if (nextStep >= lesson.sections.length) { completeLesson(); return }
    const checkpointCadence = Math.max(1,
      Math.floor(lesson.sections.length / Math.max(1, checkpointIds.length))
    )
    const shouldCheckpoint = checkpointIndex < checkpointIds.length &&
      nextStep % checkpointCadence === 0
    if (shouldCheckpoint) setPhase('checkpoint')
    else setStep(nextStep)
  }

  const completeLesson = async () => {
    try {
      const r = await axios.post(`/api/lessons/${id}/complete`)
      setXpEarned(prev => prev + r.data.xp_awarded)
      setStreak(r.data.streak)
    } catch { /* ignore */ }
    setCompleted(true)
  }

  if (completed) {
    return (
      <div className="max-w-4xl">
        <div className="card text-center py-12 animate-fade-in border-racing-green/30">
          <div className="w-16 h-16 rounded-full bg-[rgba(0,77,43,0.08)] flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-racing-green" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Lesson Complete!</h2>
          <p className="text-warm-gray mb-6">You've mastered this GRC concept.</p>
          {xpEarned > 0 && (
            <div className="inline-flex items-center gap-4 px-6 py-3 mb-6 bg-[rgba(0,77,43,0.04)] border border-racing-green/20 rounded-lg">
              <Flame className="w-5 h-5 text-champagne" />
              <span className="text-racing-green font-bold font-mono">+{xpEarned} XP</span>
              {streak && (
                <>
                  <span className="text-warm-gray font-mono text-sm border-l border-racing-green/20 pl-4">
                    Streak: {streak.current_streak} days
                  </span>
                  <span className="tag-racing text-xs">LVL {streak.level}</span>
                </>
              )}
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <Link to="/learn" className="btn-primary">Next Lesson →</Link>
            <Link to="/quiz" className="btn-ghost">Practice Quiz</Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl">
        <Link to="/learn" className="inline-flex items-center gap-1 text-racing-green hover:underline mb-6 text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to lessons
        </Link>
        <SkeletonLoader variant="text" lines={5} count={2} />
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="max-w-4xl">
        <Link to="/learn" className="inline-flex items-center gap-1 text-racing-green hover:underline mb-6 text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to lessons
        </Link>
        <ErrorMessage message="Lesson not found or server unavailable." />
      </div>
    )
  }

  const sections = lesson.sections
  const totalSections = sections.length

  return (
    <div className="max-w-4xl">
      <Link to="/learn" className="inline-flex items-center gap-1 text-racing-green hover:underline mb-6 text-sm transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to lessons
      </Link>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 bg-parchment/60 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500 ease-out bg-racing-green"
            style={{
              width: `${((step + 1) / totalSections) * 100}%`,
              boxShadow: '0 0 6px rgba(0, 77, 43, 0.2)',
            }}
          />
        </div>
        <span className="text-xs font-mono text-warm-gray">{step + 1}/{totalSections}</span>
      </div>

      {/* ===== READING PHASE ===== */}
      {phase === 'reading' && (
        <>
          <div className="card animate-fade-in relative overflow-hidden" key={`s-${step}`}>
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-racing-green/20" />
            <div className="flex items-center gap-2 mb-3">
              <span className="tag-racing">Section {step + 1}</span>
            </div>
            <h2 className="text-xl font-bold text-charcoal mb-4">{sections[step].title}</h2>
            <div className="prose prose-invert max-w-none text-warm-gray leading-relaxed text-sm
              [&_strong]:text-charcoal
              [&_code]:text-racing-green [&_code]:bg-ivory [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs
              [&_pre]:bg-ivory [&_pre]:border [&_pre]:border-parchment [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-xs [&_pre]:font-mono
              [&_pre_code]:bg-transparent [&_pre_code]:p-0
              [&_table]:w-full [&_table]:border-collapse
              [&_th]:border [&_th]:border-parchment [&_th]:px-3 [&_th]:py-2 [&_th]:text-xs [&_th]:text-racing-green [&_th]:bg-ivory
              [&_td]:border [&_td]:border-parchment [&_td]:px-3 [&_td]:py-2 [&_td]:text-xs
              [&_ul]:list-disc [&_ul]:pl-4 [&_li]:text-warm-gray
              [&_hr]:border-parchment">
              <ReactMarkdown>{sections[step].content}</ReactMarkdown>
            </div>

            {sections[step].key_concepts && (
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-parchment/60">
                {sections[step].key_concepts.map((concept, i) => (
                  <span key={i}
                    className="px-2 py-0.5 text-[10px] font-mono rounded-full border border-parchment text-warm-gray">
                    {concept}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button onClick={advanceSection} className="btn-primary flex items-center gap-1">
              {step < totalSections - 1 ? (
                <>Next Section <ChevronRight className="w-4 h-4" /></>
              ) : (
                <>Complete Lesson <Award className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </>
      )}

      {/* ===== CHECKPOINT PHASE ===== */}
      {phase === 'checkpoint' && question && (
        <div className="card animate-fade-in border-champagne/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="tag-racing">CHECKPOINT</span>
          </div>
          <p className="text-charcoal mb-5 leading-relaxed text-base">{question.question}</p>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="input-field font-mono text-sm resize-none h-24 mb-3"
            style={{ borderColor: answer ? 'rgba(0, 77, 43, 0.3)' : undefined }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitCheckpoint() }}}
          />
          <div className="flex gap-3">
            <button onClick={submitCheckpoint} className="btn-primary">Submit</button>
            <button onClick={() => setShowHint(true)} className="btn-ghost flex items-center gap-1">
              <Lightbulb className="w-4 h-4" /> Hint
            </button>
          </div>
          {showHint && question.hints?.[0] && (
            <p className="mt-3 text-xs text-champagne italic">💡 {question.hints[0]}</p>
          )}
        </div>
      )}

      {/* ===== RESULT PHASE ===== */}
      {phase === 'result' && result && (
        <div className={`card animate-fade-in border ${
          result.correct ? 'border-green/40' : 'border-red/40'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            {result.correct
              ? <CheckCircle className="w-5 h-5 text-green" />
              : <XCircle className="w-5 h-5 text-red" />
            }
            <span className={`font-semibold ${result.correct ? 'text-green' : 'text-red'}`}>
              {result.correct ? 'Correct!' : 'Not quite'}
            </span>
            {result.xp_awarded > 0 && (
              <span className="text-racing-green text-xs font-mono ml-auto">
                <Flame className="w-3 h-3 inline mr-1" />+{result.xp_awarded} XP
              </span>
            )}
          </div>
          <p className="text-sm text-warm-gray mb-3">{result.explanation}</p>
          {!result.correct && (
            <p className="text-xs text-warm-gray mb-3">
              Expected: <code className="text-racing-green bg-ivory px-1 py-0.5 rounded text-xs font-mono">{result.expected}</code>
            </p>
          )}
          <button onClick={advanceAfterResult} className="btn-primary flex items-center gap-1">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
