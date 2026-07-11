import { useEffect, useState } from 'react'
import { Flame, Zap, Award, Calendar } from 'lucide-react'
import axios from 'axios'

export default function StreakBadge() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/streak')
      .then(r => { setData(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse flex items-center gap-4 px-5 py-3 rounded-lg border border-parchment bg-white">
        <div className="h-4 w-16 bg-parchment rounded" />
        <div className="h-4 w-12 bg-parchment rounded" />
        <div className="h-4 w-20 bg-parchment rounded" />
      </div>
    )
  }

  if (!data) return null

  const xpProgress = data.today_xp || 0
  const dailyGoal = data.daily_goal || 50
  const progressPct = Math.min(100, (xpProgress / dailyGoal) * 100)
  const level = data.level || 1

  return (
    <div className="flex flex-wrap items-center gap-4 px-5 py-3 rounded-lg border border-parchment bg-white shadow-sm">
      {/* Streak */}
      <div className="flex items-center gap-2">
        <Flame className={`w-5 h-5 ${data.current_streak > 0 ? 'text-orange' : 'text-warm-gray'}`} style={data.current_streak > 0 ? { filter: 'drop-shadow(0 0 6px color-mix(in srgb, var(--color-orange) 30%, transparent))' } : {}} />
        <div>
          <span className="font-bold text-charcoal font-mono text-sm">{data.current_streak}</span>
          <span className="text-warm-gray text-[10px] ml-1">day streak</span>
        </div>
      </div>

      <div className="w-px h-8 bg-parchment" />

      {/* Level */}
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-racing-green" />
        <div>
          <span className="font-bold text-charcoal font-mono text-sm">LVL {level}</span>
          <span className="text-warm-gray text-[10px] ml-1">{data.total_xp || 0} XP</span>
        </div>
      </div>

      <div className="w-px h-8 bg-parchment" />

      {/* Daily goal */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-champagne" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-warm-gray">Daily goal</span>
            <span className="font-mono text-xs text-charcoal">{xpProgress}/{dailyGoal}</span>
          </div>
          <div className="w-24 h-1.5 bg-parchment/50 rounded-full overflow-hidden mt-1">
            <div className="h-full rounded-full bg-racing-green transition-all duration-500"
              style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
