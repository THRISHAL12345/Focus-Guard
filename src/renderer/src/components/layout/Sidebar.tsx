import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ListTodo, CalendarCheck, RefreshCw, Tag, Settings, Plus, Circle } from 'lucide-react'
import { useTaskStore } from '../../store/useTaskStore'
import { isToday, parseISO } from '../../lib/dateUtils'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  badge?: number
}

interface SidebarProps {
  onNewTask: () => void
  collapsed?: boolean
}

export function Sidebar({ onNewTask, collapsed }: SidebarProps): React.ReactElement {
  const location = useLocation()
  const navigate = useNavigate()
  const tasks = useTaskStore((s) => s.tasks)

  const todayCount = tasks.filter(t => t.status !== 'done' && isToday(parseISO(t.dueDate))).length

  const navItems: NavItem[] = [
    { label: 'Command Center', path: '/', icon: <LayoutDashboard size={16} /> },
    { label: 'All Tasks', path: '/all', icon: <ListTodo size={16} /> },
    { label: 'Today', path: '/today', icon: <CalendarCheck size={16} />, badge: todayCount },
    { label: 'Recurring', path: '/recurring', icon: <RefreshCw size={16} /> },
    { label: 'Categories', path: '/categories', icon: <Tag size={16} /> },
  ]

  return (
    <div style={{
      width: collapsed ? 48 : 240,
      minWidth: collapsed ? 48 : 240,
      height: '100%',
      background: 'var(--bg-void)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width var(--transition-base)',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Nav section */}
      <div style={{ padding: collapsed ? '8px 4px' : '8px 8px', flex: 1 }}>
        {!collapsed && (
          <div style={{ padding: '8px 8px 12px', marginBottom: 4 }}>
            <span className="label" style={{ fontSize: 10 }}>Navigation</span>
          </div>
        )}
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <NavBtn
              key={item.path}
              item={item}
              active={active}
              collapsed={!!collapsed}
              onClick={() => navigate(item.path)}
            />
          )
        })}

        {/* New Task CTA */}
        {!collapsed && (
          <div style={{ padding: '16px 8px 8px', borderTop: '1px solid var(--border-subtle)', marginTop: 12 }}>
            <span className="label" style={{ fontSize: 10 }}>Workspace</span>
          </div>
        )}
        <button
          onClick={onNewTask}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '10px' : '10px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent)',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.05em',
            cursor: 'pointer',
            border: 'none',
            transition: 'background var(--transition-fast)',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-dim)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
        >
          <Plus size={16} />
          {!collapsed && 'NEW TASK'}
        </button>
      </div>

      {/* Bottom section */}
      <div style={{ padding: collapsed ? '8px 4px' : '8px 8px', borderTop: '1px solid var(--border-subtle)' }}>
        <NavBtn
          item={{ label: 'Settings', path: '/settings', icon: <Settings size={16} /> }}
          active={location.pathname === '/settings'}
          collapsed={!!collapsed}
          onClick={() => navigate('/settings')}
        />

        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px' }}>
            <Circle size={8} style={{ fill: 'var(--done)', color: 'var(--done)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              SYSTEM ACTIVE
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function NavBtn({ item, active, collapsed, onClick }: {
  item: NavItem
  active: boolean
  collapsed: boolean
  onClick: () => void
}): React.ReactElement {
  const [hovered, setHovered] = React.useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: collapsed ? '10px' : '10px 12px',
        borderRadius: 'var(--radius-md)',
        background: active
          ? 'linear-gradient(90deg, rgba(255,69,0,0.12) 0%, transparent 100%)'
          : hovered ? 'var(--bg-elevated)' : 'transparent',
        borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
        color: active || hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        letterSpacing: '0.03em',
        cursor: 'pointer',
        border: 'none',
        transition: 'all var(--transition-fast)',
        justifyContent: collapsed ? 'center' : 'flex-start',
        transform: hovered && !active ? 'translateX(2px)' : 'translateX(0)',
        textAlign: 'left',
        position: 'relative',
      } as React.CSSProperties}
    >
      <span style={{ flexShrink: 0 }}>{item.icon}</span>
      {!collapsed && (
        <>
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span style={{
              background: 'var(--accent)',
              color: '#fff',
              fontSize: 9,
              fontWeight: 700,
              borderRadius: 10,
              padding: '1px 6px',
              fontFamily: 'var(--font-mono)',
              minWidth: 18,
              textAlign: 'center',
            }}>
              {item.badge}
            </span>
          )}
        </>
      )}
    </button>
  )
}
