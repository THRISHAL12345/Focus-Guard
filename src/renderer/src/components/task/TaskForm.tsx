import React, { useState } from 'react'
import { Task, Priority, RecurringInterval } from '../../lib/constants'
import { useTaskStore } from '../../store/useTaskStore'
import { getTodayISO } from '../../lib/dateUtils'
import { Toggle } from '../ui/Toggle'
import { MarkdownRenderer } from '../ui/MarkdownRenderer'

interface TaskFormProps {
  task?: Task
  onSubmit: () => void
  onCancel: () => void
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps): React.ReactElement {
  const addTask = useTaskStore(s => s.addTask)
  const updateTask = useTaskStore(s => s.updateTask)
  const categories = useTaskStore(s => s.categories)
  
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium')
  const [category, setCategory] = useState(task?.category || (categories[0] || 'Work'))
  const [dueDate, setDueDate] = useState(task?.dueDate || getTodayISO())
  const [dueTime, setDueTime] = useState(task?.dueTime || '')
  const [isRecurring, setIsRecurring] = useState(task?.isRecurring || false)
  const [recurringInterval, setRecurringInterval] = useState<RecurringInterval>(task?.recurringInterval || 'daily')
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const taskData = {
      title,
      description,
      priority,
      category,
      dueDate,
      dueTime: dueTime || undefined,
      isRecurring,
      recurringInterval: isRecurring ? recurringInterval : undefined,
      status: task?.status || 'pending',
      parentId: task?.parentId
    }

    if (task) {
      updateTask(task.id, taskData)
    } else {
      addTask(taskData)
    }
    
    onSubmit()
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    padding: '10px 12px',
    outline: 'none',
    transition: 'border-color 0.2s',
    marginBottom: 20
  }

  const labelStyle = {
    display: 'block',
    marginBottom: 8,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 500,
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div>
        <label style={labelStyle}>Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
          required
          style={{...inputStyle, fontFamily: 'var(--font-mono)'}}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Description</label>
          <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: 2 }}>
            <button
              type="button"
              onClick={() => setIsPreviewMode(false)}
              style={{
                background: !isPreviewMode ? 'var(--bg-surface)' : 'transparent',
                color: !isPreviewMode ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none', padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', borderRadius: 2, cursor: 'pointer'
              }}
            >
              WRITE
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewMode(true)}
              style={{
                background: isPreviewMode ? 'var(--bg-surface)' : 'transparent',
                color: isPreviewMode ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none', padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', borderRadius: 2, cursor: 'pointer'
              }}
            >
              PREVIEW
            </button>
          </div>
        </div>
        
        {!isPreviewMode ? (
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add details... (Markdown supported)"
            rows={5}
            style={{...inputStyle, resize: 'vertical', minHeight: 100}}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
          />
        ) : (
          <div style={{ 
            background: 'var(--bg-elevated)', 
            border: '1px solid var(--border-default)', 
            borderRadius: 'var(--radius-sm)', 
            padding: '10px 12px', 
            minHeight: 100, 
            marginBottom: 20,
            overflowY: 'auto',
            maxHeight: 300
          }}>
            {description ? <MarkdownRenderer content={description} /> : <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Nothing to preview</span>}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Priority</label>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['critical', 'high', 'medium', 'low'] as Priority[]).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  background: priority === p ? `var(--${p})` : 'var(--bg-elevated)',
                  color: priority === p ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${priority === p ? `var(--${p})` : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={inputStyle}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            required
            style={{...inputStyle, fontFamily: 'var(--font-mono)'}}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Time (Optional)</label>
          <input
            type="time"
            value={dueTime}
            onChange={e => setDueTime(e.target.value)}
            style={{...inputStyle, fontFamily: 'var(--font-mono)'}}
          />
        </div>
      </div>

      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: 16,
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isRecurring ? 16 : 0 }}>
          <label style={{...labelStyle, marginBottom: 0}}>Recurring Task</label>
          <Toggle checked={isRecurring} onChange={setIsRecurring} />
        </div>
        
        {isRecurring && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>Repeat interval:</span>
            <select
              value={recurringInterval}
              onChange={e => setRecurringInterval(e.target.value as RecurringInterval)}
              style={{...inputStyle, width: 'auto', marginBottom: 0, padding: '6px 12px'}}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', gap: 12, paddingTop: 24, borderTop: '1px solid var(--border-subtle)' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '12px',
            background: 'transparent',
            border: '1px solid var(--border-strong)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          CANCEL
        </button>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: '12px',
            background: 'var(--accent)',
            border: 'none',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {task ? 'SAVE CHANGES' : 'CREATE TASK →'}
        </button>
      </div>
    </form>
  )
}
