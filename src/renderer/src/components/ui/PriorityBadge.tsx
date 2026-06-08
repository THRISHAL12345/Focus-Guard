import React from 'react'
import { Priority, PRIORITY_CONFIG } from '../../lib/constants'

interface PriorityBadgeProps {
  priority: Priority
  size?: 'sm' | 'md'
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps): React.ReactElement {
  const config = PRIORITY_CONFIG[priority]
  const fontSize = size === 'sm' ? 9 : 10

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: size === 'sm' ? '2px 6px' : '3px 8px',
      borderRadius: 3,
      background: `${config.color}18`,
      border: `1px solid ${config.color}44`,
      color: config.color,
      fontFamily: 'var(--font-mono)',
      fontSize,
      fontWeight: 600,
      letterSpacing: '0.06em',
      whiteSpace: 'nowrap',
    }}>
      {config.label}
    </span>
  )
}
