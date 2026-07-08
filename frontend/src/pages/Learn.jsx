import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, ChevronRight, GraduationCap } from 'lucide-react'
import axios from 'axios'
import SkeletonLoader from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'

export default function Learn() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadLessons = () => {
    setLoading(true); setError(false)
    axios.get('/api/lessons')
      .then(r => { setLessons(r.data.lessons); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }

  useEffect(() => { loadLessons() }, [])

  if (error) {
    return (
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-racing-green flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-charcoal tracking-tight">Guided Lessons</h1>
            <p className="text-warm-gray text-sm">Learn GRC concepts step by step with active-recall checkpoints.</p>
          </div>
        </div>
        <ErrorMessage onRetry={loadLessons} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-racing-green flex items-center justify-center shadow-sm">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">Guided Lessons</h1>
          <p className="text-warm-gray text-sm">Learn GRC concepts step by step with active-recall checkpoints.</p>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader variant="lesson" count={5} />
      ) : (
      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <Link
            key={lesson.id}
            to={`/learn/${lesson.id}`}
            className="card block group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-racing-green/30"
          >
            {/* Green accent bar on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-racing-green/0 group-hover:bg-racing-green/40 transition-all duration-200" />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-lg bg-[rgba(0,77,43,0.06)]">
                <span className="text-racing-green font-bold text-sm font-mono">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-charcoal font-medium group-hover:text-racing-green transition-colors">
                    {lesson.title}
                  </h3>
                  {lesson.learned && (
                    <CheckCircle className="w-4 h-4 text-green shrink-0" />
                  )}
                </div>
                <div className="flex gap-3 mt-2">
                  <span className="tag-racing">
                    <BookOpen className="w-3 h-3 inline mr-1" />
                    {lesson.section_count} sections
                  </span>
                  {lesson.checkpoint_count > 0 && (
                    <span className="tag-default">
                      {lesson.checkpoint_count} questions
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-warm-gray group-hover:text-racing-green transition-colors shrink-0 mt-2" />
            </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  )
}
