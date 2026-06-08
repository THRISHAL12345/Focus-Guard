import React from 'react'
import { Task, PRIORITY_CONFIG } from '../../lib/constants'

interface OverlayTaskItemProps {
  task: Task
}

export function OverlayTaskItem({ task }: OverlayTaskItemProps): React.ReactElement {
  const isOverdue = task.status !== 'done' && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0))
  const config = PRIORITY_CONFIG[task.priority]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${isOverdue ? 'var(--critical)' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: 4,
      fontFamily: 'var(--font-mono)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Accent strip */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        background: config.color,
        opacity: 0.8
      }} />

      {/* Priority Badge */}
      <div style={{
        padding: '2px 6px',
        background: `${config.color}22`,
        color: config.color,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.1em',
        borderRadius: 2
      }}>
        [{config.label}]
      </div>

      {/* Title */}
      <div style={{ flex: 1, color: 'var(--text-primary)', fontSize: 14 }}>
        {task.title}
      </div>

      {/* Spacer line */}
      <div style={{ flex: 1, borderTop: '1px dashed rgba(255,255,255,0.2)' }} />

      {/* Due Indicator */}
      <div className={isOverdue ? 'overdue-pulse' : ''} style={{
        color: isOverdue ? 'var(--critical)' : 'var(--accent)',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.05em'
      }}>
        {isOverdue ? 'OVERDUE' : 'DUE TODAY'}
      </div>
    </div>
  )
}
