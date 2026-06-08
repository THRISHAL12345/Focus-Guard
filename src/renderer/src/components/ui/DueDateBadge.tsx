import React from 'react'
import { formatRelativeDate, isOverdue, getDaysUntilDue } from '../../lib/dateUtils'

interface DueDateBadgeProps {
  dueDate: string
  status: string
}

export function DueDateBadge({ dueDate, status }: DueDateBadgeProps): React.ReactElement {
  const isDone = status === 'done'
  const overdue = !isDone && isOverdue(dueDate)
  const daysUntil = !isDone ? getDaysUntilDue(dueDate) : null
  
  const text = isDone ? 'COMPLETED' : formatRelativeDate(dueDate)
  
  let color = 'var(--text-secondary)'
  let bg = 'transparent'
  let border = 'var(--border-default)'
  let pulse = false

  if (isDone) {
    color = 'var(--done)'
  } else if (overdue) {
    color = 'var(--critical)'
    bg = 'rgba(239, 68, 68, 0.1)'
    border = 'var(--critical)'
    pulse = true
  } else if (daysUntil === 0) {
    color = 'var(--high)' // Today
  } else if (daysUntil === 1) {
    color = 'var(--text-primary)' // Tomorrow
  }

  return (
    <span className={pulse ? 'overdue-pulse' : ''} style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 8px',
      borderRadius: 'var(--radius-sm)',
      background: bg,
      border: `1px solid ${border}`,
      color,
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: overdue || daysUntil === 0 ? 600 : 400,
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}>
      {text}
    </span>
  )
}
