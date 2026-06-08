import React, { useMemo } from 'react'
import { subDays, format, startOfDay, isSameDay, parseISO } from 'date-fns'
import { Task } from '../../lib/constants'

interface HeatmapCalendarProps {
  tasks: Task[]
  days?: number
}

export function HeatmapCalendar({ tasks, days = 90 }: HeatmapCalendarProps): React.ReactElement {
  const data = useMemo(() => {
    const today = startOfDay(new Date())
    const completedTasks = tasks.filter(t => t.status === 'done' && t.completedAt)
    
    const result = Array.from({ length: days }).map((_, i) => {
      const date = subDays(today, days - 1 - i)
      const count = completedTasks.filter(t => isSameDay(parseISO(t.completedAt!), date)).length
      return { date, count }
    })
    return result
  }, [tasks, days])

  const maxCount = Math.max(...data.map(d => d.count), 1)

  const getColor = (count: number): string => {
    if (count === 0) return 'var(--bg-elevated)'
    const intensity = Math.min(count / Math.max(maxCount, 5), 1) // Normalize to max 5 tasks/day for color scale
    return `rgba(255, 69, 0, ${0.2 + intensity * 0.8})` // Base accent color with dynamic opacity
  }

  // Group by weeks for a grid layout (like GitHub)
  const weeks: { date: Date, count: number }[][] = []
  let currentWeek: { date: Date, count: number }[] = []
  
  data.forEach((day, i) => {
    currentWeek.push(day)
    if (day.date.getDay() === 6 || i === data.length - 1) { // End of week (Saturday) or end of data
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  // Ensure first week starts on Sunday visually by padding
  if (weeks[0] && weeks[0].length < 7 && weeks[0][0].date.getDay() !== 0) {
     const padding = Array.from({ length: weeks[0][0].date.getDay() }).map(() => ({ date: new Date(), count: -1 })) // Dummy data
     weeks[0] = [...padding, ...weeks[0]]
  }

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      overflowX: 'auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
        {weeks.map((week, wIdx) => (
          <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Array of 7 days (Sun-Sat) */}
            {Array.from({ length: 7 }).map((_, dIdx) => {
               const day = week.find(d => d.date && d.date.getDay() === dIdx)
               const isDummy = day?.count === -1
               
               return (
                 <div
                   key={dIdx}
                   title={day && !isDummy ? `${day.count} tasks completed on ${format(day.date, 'MMM d, yyyy')}` : undefined}
                   style={{
                     width: 12,
                     height: 12,
                     borderRadius: 2,
                     background: day && !isDummy ? getColor(day.count) : 'transparent',
                     border: day && !isDummy && day.count === 0 ? '1px solid var(--border-default)' : 'none',
                   }}
                 />
               )
            })}
          </div>
        ))}
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center',
        gap: 8, 
        marginTop: 12,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-muted)'
      }}>
        Less
        <div style={{ display: 'flex', gap: 4 }}>
          {[0, 1, 2, 3, 4].map(level => (
            <div key={level} style={{
              width: 10, height: 10, borderRadius: 2,
              background: level === 0 ? 'var(--bg-elevated)' : `rgba(255, 69, 0, ${0.2 + (level/4) * 0.8})`
            }} />
          ))}
        </div>
        More
      </div>
    </div>
  )
}
