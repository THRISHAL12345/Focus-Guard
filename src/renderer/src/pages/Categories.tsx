import React, { useState, useMemo } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { getTasksByCategory } from '../lib/taskUtils'
import { TaskList } from '../components/task/TaskList'
import { TaskPanel } from '../components/task/TaskPanel'
import { Task } from '../lib/constants'

export function Categories(): React.ReactElement {
  const tasks = useTaskStore(s => s.tasks)
  
  const tasksByCategory = useMemo(() => getTasksByCategory(tasks), [tasks])
  const categories = Object.keys(tasksByCategory).sort()
  
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  return (
    <div style={{ padding: '24px 32px', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 400, color: 'var(--text-primary)' }}>
          Categories
        </h1>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {categories.map(category => (
          <div key={category}>
            <h2 style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: 14, 
              color: 'var(--text-primary)', 
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: 8,
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ color: 'var(--accent)' }}>#</span>
              {category}
            </h2>
            <TaskList tasks={tasksByCategory[category]} onEditTask={t => { setEditingTask(t); setPanelOpen(true); }} />
          </div>
        ))}
      </div>

      <TaskPanel 
        isOpen={panelOpen} 
        onClose={() => { setPanelOpen(false); setEditingTask(undefined); }} 
        task={editingTask} 
      />
    </div>
  )
}
