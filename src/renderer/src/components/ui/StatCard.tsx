import React, { useEffect, useState } from 'react'

interface StatCardProps {
  title: string
  value: number
  subtitle: string
  accentColor: string
  trend?: string // e.g., "↑ 3 new"
}

export function StatCard({ title, value, subtitle, accentColor, trend }: StatCardProps): React.ReactElement {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    // Simple count up animation
    let start = 0
    const end = value
    if (start === end) return
    
    const duration = 400
    const stepTime = Math.abs(Math.floor(duration / end))
    
    const timer = setInterval(() => {
      start += 1
      setDisplayValue(start)
      if (start === end) clearInterval(timer)
    }, stepTime)
    
    return () => clearInterval(timer)
  }, [value])

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 20px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }}>
      {/* Top Accent Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '40%',
        height: 3,
        background: accentColor
      }} />

      <div className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 12, height: 4, background: accentColor, borderRadius: 2 }} />
        {title}
      </div>
      
      <div style={{ 
        fontFamily: 'var(--font-mono)', 
        fontSize: 36, 
        fontWeight: 700, 
        color: 'var(--text-primary)',
        lineHeight: 1.2,
        marginTop: 4
      }}>
        {value === 0 ? 0 : displayValue}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {subtitle}
        </span>
        {trend && (
          <span style={{ fontSize: 11, color: trend.includes('↑') || trend.includes('new') ? 'var(--medium)' : trend.includes('⚠') ? 'var(--critical)' : 'var(--done)' }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}
