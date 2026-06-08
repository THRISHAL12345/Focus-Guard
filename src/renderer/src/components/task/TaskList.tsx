import React from 'react'
import { Task } from '../../lib/constants'
import { TaskRow } from './TaskRow'

interface TaskListProps {
  tasks: Task[]
  onEditTask: (task: Task) => void
}

export function TaskList({ tasks, onEditTask }: TaskListProps): React.ReactElement {
  if (tasks.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        letterSpacing: '0.05em',
        border: '1px dashed var(--border-default)',
        borderRadius: 'var(--radius-md)'
      }}>
        NO TASKS FOUND
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Table Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '40px 100px 1fr 120px 140px 40px',
        padding: '0 12px 8px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: 8,
      }}>
        <div /> {/* Checkbox */}
        <div className="label">Priority</div>
        <div className="label">Task Title</div>
        <div className="label">Category</div>
        <div className="label">Due Date</div>
        <div /> {/* Actions */}
      </div>

      {/* Task Rows */}
      {tasks.map(task => (
        <TaskRow key={task.id} task={task} onEdit={() => onEditTask(task)} />
      ))}
    </div>
  )
}
