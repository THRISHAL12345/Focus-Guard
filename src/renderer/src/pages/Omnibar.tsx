import React, { useState, useEffect, useRef } from 'react'
import { getTodayISO } from '../lib/dateUtils'
import { Status } from '../lib/constants'
import { useTaskStore } from '../store/useTaskStore'

export function Omnibar(): React.ReactElement {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus immediately
    inputRef.current?.focus()
    
    // Listen for escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        (window as any).api.hideOmnibar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) {
      (window as any).api.hideOmnibar()
      return
    }

    // Basic parsing: title, priority, category
    let title = input.trim()
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
    
    // Quick parse for priority
    if (title.includes('p:high')) { priority = 'high'; title = title.replace('p:high', '') }
    if (title.includes('p:critical')) { priority = 'critical'; title = title.replace('p:critical', '') }
    if (title.includes('p:low')) { priority = 'low'; title = title.replace('p:low', '') }
    
    // The rest goes to the new task
    const newTask = {
      title: title.trim(),
      priority,
      category: 'General',
      dueDate: getTodayISO(),
      status: 'pending' as Status,
      isRecurring: false
    }

    useTaskStore.getState().addTask(newTask);
    setInput('');
    (window as any).api.hideOmnibar();
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      WebkitAppRegion: 'no-drag',
    } as React.CSSProperties}>
      <form 
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          background: 'rgba(10, 10, 10, 0.95)',
          border: '1px solid var(--accent)',
          borderRadius: 8,
          boxShadow: '0 0 20px rgba(255, 69, 0, 0.3)',
          WebkitAppRegion: 'no-drag'
        } as React.CSSProperties}
      >
        <span style={{ color: 'var(--accent)', marginRight: 16, fontFamily: 'var(--font-mono)', fontSize: 24 }}>&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Capture task... (e.g., Fix bug p:high)"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 24,
          }}
        />
      </form>
    </div>
  )
}
