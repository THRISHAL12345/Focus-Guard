import React from 'react'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function Toggle({ checked, onChange, label }: ToggleProps): React.ReactElement {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'transparent',
        padding: 0,
        cursor: 'pointer',
        gap: 12
      }}
    >
      <div style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? 'var(--accent)' : 'var(--bg-elevated)',
        position: 'relative',
        transition: 'background var(--transition-fast)',
        border: '1px solid var(--border-strong)',
      }}>
        <div style={{
          position: 'absolute',
          top: 2,
          left: checked ? 22 : 2,
          width: 18,
          height: 18,
          borderRadius: 9,
          background: checked ? '#fff' : 'var(--text-muted)',
          transition: 'left var(--transition-fast), background var(--transition-fast)',
          boxShadow: checked ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
        }} />
      </div>
      {label && (
        <span style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: 12, 
          color: checked ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontWeight: checked ? 600 : 400
        }}>
          {label}
        </span>
      )}
    </button>
  )
}
