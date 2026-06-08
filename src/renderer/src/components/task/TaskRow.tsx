import React, { useState } from 'react'
import { MoreVertical, Edit2, Trash2, RotateCw, ChevronDown, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MarkdownRenderer } from '../ui/MarkdownRenderer'
import { Task } from '../../lib/constants'
import { useTaskStore } from '../../store/useTaskStore'
import { PriorityBadge } from '../ui/PriorityBadge'
import { CategoryTag } from '../ui/CategoryTag'
import { DueDateBadge } from '../ui/DueDateBadge'

interface TaskRowProps {
  task: Task
  onEdit: () => void
}

export function TaskRow({ task, onEdit }: TaskRowProps): React.ReactElement {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const completeTask = useTaskStore(s => s.completeTask)
  const deleteTask = useTaskStore(s => s.deleteTask)
  const setTaskStatus = useTaskStore(s => s.setTaskStatus)

  const isDone = task.status === 'done'
  const isInProgress = task.status === 'in-progress'
  const hasDescription = !!task.description?.trim()

  const handleCheckbox = () => {
    if (isDone) {
      setTaskStatus(task.id, 'pending')
    } else {
      completeTask(task.id)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: '40px 100px 1fr 120px 140px 80px',
          alignItems: 'center',
          padding: '0 12px',
          height: 52,
          background: hovered ? 'var(--bg-elevated)' : 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderTopLeftRadius: 'var(--radius-md)',
          borderTopRightRadius: 'var(--radius-md)',
          borderBottomLeftRadius: isExpanded && hasDescription ? 0 : 'var(--radius-md)',
          borderBottomRightRadius: isExpanded && hasDescription ? 0 : 'var(--radius-md)',
          transition: 'all var(--transition-fast)',
          opacity: isDone ? 0.6 : 1,
          borderLeft: !isDone && hovered ? '3px solid var(--accent)' : '1px solid var(--border-default)'
        }}
      >
      {/* Checkbox */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={handleCheckbox}
          style={{
            width: 20, height: 20,
            borderRadius: 4,
            border: `2px solid ${isDone ? 'var(--done)' : isInProgress ? 'var(--medium)' : 'var(--text-muted)'}`,
            background: isDone ? 'var(--done)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          {isDone && (
            <svg viewBox="0 0 14 10" fill="none" style={{ width: 12, height: 12 }}>
              <path d="M1 5L5 9L13 1" stroke="var(--bg-void)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {isInProgress && (
            <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--medium)' }} />
          )}
        </button>
      </div>

      {/* Priority */}
      <div>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Title */}
      <div 
        onClick={() => hasDescription && setIsExpanded(!isExpanded)}
        style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        paddingRight: 16,
        cursor: hasDescription ? 'pointer' : 'default'
      }}>
        {hasDescription && (
          isExpanded ? <ChevronDown size={14} color="var(--text-secondary)" /> : <ChevronRight size={14} color="var(--text-secondary)" />
        )}
        {task.isRecurring && <RotateCw size={12} color="var(--recurring)" />}
        <span style={{
          textDecoration: isDone ? 'line-through' : 'none',
          color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
          fontSize: 14,
        }}>
          {task.title}
        </span>
      </div>

      {/* Category */}
      <div>
        <CategoryTag category={task.category} />
      </div>

      {/* Due Date */}
      <div>
        <DueDateBadge dueDate={task.dueDate} status={task.status} />
      </div>

      {/* Actions */}
      <div 
        onMouseLeave={() => setMenuOpen(false)}
        style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, opacity: hovered || menuOpen ? 1 : 0, transition: 'opacity 0.2s', position: 'relative' }}
      >
        <ActionBtn onClick={onEdit} icon={<Edit2 size={14} />} color="var(--text-secondary)" hoverColor="var(--medium)" />
        <ActionBtn onClick={() => deleteTask(task.id)} icon={<Trash2 size={14} />} color="var(--text-secondary)" hoverColor="var(--critical)" />
        
        <div style={{ position: 'relative' }}>
          <ActionBtn onClick={() => setMenuOpen(!menuOpen)} icon={<MoreVertical size={14} />} color={menuOpen ? 'var(--text-primary)' : 'var(--text-secondary)'} hoverColor="var(--text-primary)" />
          
          {menuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              zIndex: 10,
              minWidth: 140,
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
              {task.status !== 'in-progress' && (
                <MenuBtn onClick={() => { setTaskStatus(task.id, 'in-progress'); setMenuOpen(false); }}>Mark In-Progress</MenuBtn>
              )}
              {task.status === 'in-progress' && (
                <MenuBtn onClick={() => { setTaskStatus(task.id, 'pending'); setMenuOpen(false); }}>Mark Pending</MenuBtn>
              )}
              {!isDone && (
                <MenuBtn onClick={() => { completeTask(task.id); setMenuOpen(false); }}>Mark Done</MenuBtn>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
      
      {/* Expanded Description */}
      <AnimatePresence>
        {isExpanded && hasDescription && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ 
              padding: '16px 24px', 
              background: 'var(--bg-void)', 
              border: '1px solid var(--border-default)', 
              borderTop: 'none',
              borderBottomLeftRadius: 'var(--radius-md)',
              borderBottomRightRadius: 'var(--radius-md)'
            }}>
              <MarkdownRenderer content={task.description || ''} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ActionBtn({ onClick, icon, color, hoverColor }: { onClick: () => void, icon: React.ReactNode, color: string, hoverColor: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 28, height: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 4,
        color: hovered ? hoverColor : color,
        background: hovered ? 'var(--bg-base)' : 'transparent',
        transition: 'all 0.1s'
      }}
    >
      {icon}
    </button>
  )
}

function MenuBtn({ onClick, children }: { onClick: () => void, children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 12px',
        background: hovered ? 'var(--bg-surface)' : 'transparent',
        border: 'none',
        color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        textAlign: 'left',
        cursor: 'pointer',
        borderRadius: 2
      }}
    >
      {children}
    </button>
  )
}
