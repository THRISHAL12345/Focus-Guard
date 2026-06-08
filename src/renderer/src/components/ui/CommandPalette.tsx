import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, LayoutDashboard, ListTodo, CalendarCheck, RefreshCw, Tag, Settings, Plus, Moon, Sun } from 'lucide-react'
import { useSettingsStore } from '../../store/useSettingsStore'

interface CommandItem {
  id: string
  title: string
  icon: React.ReactNode
  action: () => void
}

interface CommandPaletteProps {
  onNewTask: () => void
}

export function CommandPalette({ onNewTask }: CommandPaletteProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const navigate = useNavigate()
  const { settings, updateSetting } = useSettingsStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Define commands
  const commands: CommandItem[] = [
    { id: 'nav-dashboard', title: 'Go to Command Center', icon: <LayoutDashboard size={16} />, action: () => navigate('/') },
    { id: 'nav-all', title: 'Go to All Tasks', icon: <ListTodo size={16} />, action: () => navigate('/all') },
    { id: 'nav-today', title: 'Go to Today', icon: <CalendarCheck size={16} />, action: () => navigate('/today') },
    { id: 'nav-recurring', title: 'Go to Recurring', icon: <RefreshCw size={16} />, action: () => navigate('/recurring') },
    { id: 'nav-categories', title: 'Go to Categories', icon: <Tag size={16} />, action: () => navigate('/categories') },
    { id: 'nav-settings', title: 'Go to Settings', icon: <Settings size={16} />, action: () => navigate('/settings') },
    { id: 'action-new', title: 'Create New Task', icon: <Plus size={16} />, action: onNewTask },
    { 
      id: 'action-theme', 
      title: `Toggle Theme (${settings.theme === 'dark' ? 'Light' : 'Dark'} Mode)`, 
      icon: settings.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />, 
      action: () => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark') 
    },
  ]

  // Filter commands
  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase())
  )

  // Keyboard shortcut listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Manage selection & focus
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return
    const activeItem = listRef.current.children[selectedIndex] as HTMLElement
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action()
        setIsOpen(false)
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: '10vh'
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(2px)'
            }}
          />

          {/* Palette Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              width: 500,
              maxWidth: '90%',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-strong)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Input Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-default)',
              gap: 12
            }}>
              <Search size={20} style={{ color: 'var(--text-muted)' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: 16,
                  fontFamily: 'var(--font-sans)'
                }}
              />
              <div style={{
                background: 'var(--bg-base)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)'
              }}>ESC</div>
            </div>

            {/* Results List */}
            <div 
              ref={listRef}
              style={{
                maxHeight: 320,
                overflowY: 'auto',
                padding: '8px'
              }}
            >
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, i) => {
                  const active = i === selectedIndex
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => {
                        cmd.action()
                        setIsOpen(false)
                      }}
                      onMouseEnter={() => setSelectedIndex(i)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-md)',
                        background: active ? 'var(--accent-glow)' : 'transparent',
                        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                        borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                        transition: 'none' // Handled by react state instantly
                      }}
                    >
                      <div style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}>
                        {cmd.icon}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: active ? 500 : 400 }}>
                        {cmd.title}
                      </span>
                    </div>
                  )
                })
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No commands found
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div style={{
              padding: '8px 16px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-base)',
              display: 'flex',
              gap: 16,
              fontSize: 11,
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)'
            }}>
              <span><strong style={{ color: 'var(--text-secondary)' }}>↑↓</strong> to navigate</span>
              <span><strong style={{ color: 'var(--text-secondary)' }}>↵</strong> to select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
