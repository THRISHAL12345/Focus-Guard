import React from 'react'
import { Minus, Square, X } from 'lucide-react'

export function TitleBar(): React.ReactElement {

  const minimize = (): void => {
    try { window.api.minimizeWindow() } catch { /* dev */ }
  }
  const maximize = (): void => {
    try { window.api.maximizeWindow() } catch { /* dev */ }
  }
  const close = (): void => {
    try { window.api.closeWindow() } catch { /* dev */ }
  }

  return (
    <div
      style={{
        height: 32,
        minHeight: 32,
        background: 'var(--bg-void)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        userSelect: 'none',
        WebkitAppRegion: 'drag' as React.CSSProperties['cursor'],
        position: 'relative',
        zIndex: 100,
        flexShrink: 0,
      } as React.CSSProperties}
    >
      {/* Logo + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <HexLogo size={14} color="var(--accent)" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--text-primary)' }}>
          FOCUSGUARD
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginLeft: 2 }}>
          v1.0.0
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Window Controls */}
      <div style={{ display: 'flex', gap: 4, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <WinBtn onClick={minimize} color="var(--text-muted)" hoverColor="#f59e0b">
          <Minus size={10} />
        </WinBtn>
        <WinBtn onClick={maximize} color="var(--text-muted)" hoverColor="#22c55e">
          <Square size={9} />
        </WinBtn>
        <WinBtn onClick={close} color="var(--text-muted)" hoverColor="#ef4444">
          <X size={11} />
        </WinBtn>
      </div>
    </div>
  )
}

function WinBtn({ children, onClick, color, hoverColor }: {
  children: React.ReactNode
  onClick: () => void
  color: string
  hoverColor: string
}): React.ReactElement {
  const [hovered, setHovered] = React.useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 22, height: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 4,
        color: hovered ? hoverColor : color,
        background: hovered ? 'var(--bg-elevated)' : 'transparent',
        transition: 'all var(--transition-fast)',
      }}
    >
      {children}
    </button>
  )
}

function HexLogo({ size, color }: { size: number; color: string }): React.ReactElement {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 20 23" fill="none">
      <polygon points="10,1 19,6 19,17 10,22 1,17 1,6" stroke={color} strokeWidth="2" fill="none" />
      <polygon points="10,6 15,9 15,14 10,17 5,14 5,9" fill={color} />
    </svg>
  )
}

export { HexLogo }
