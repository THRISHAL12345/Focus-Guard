import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Task } from '../../lib/constants'
import { TaskForm } from './TaskForm'

interface TaskPanelProps {
  isOpen: boolean
  onClose: () => void
  task?: Task // if provided, we are editing. if undefined, creating new.
}

export function TaskPanel({ isOpen, onClose, task }: TaskPanelProps): React.ReactElement {
  
  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
              backdropFilter: 'blur(2px)'
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 480 }}
            animate={{ x: 0 }}
            exit={{ x: 480 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 480,
              background: 'var(--bg-void)',
              borderLeft: '1px solid var(--border-subtle)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 24px rgba(0,0,0,0.5)'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                {task ? 'EDIT TASK' : 'NEW TASK'}
              </h2>
              <button
                onClick={onClose}
                style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content (Form) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              <TaskForm task={task} onSubmit={onClose} onCancel={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
