import React from 'react'

interface CategoryTagProps {
  category: string
}

export function CategoryTag({ category }: CategoryTagProps): React.ReactElement {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 8px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-default)',
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.04em',
    }}>
      {category}
    </span>
  )
}
