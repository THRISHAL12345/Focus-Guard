import React, { useState, useMemo } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { TaskList } from '../components/task/TaskList'
import { TaskPanel } from '../components/task/TaskPanel'
import { Task } from '../lib/constants'
import { getTodayTasks, getOverdueTasks } from '../lib/taskUtils'

export function Today(): React.ReactElement {
  const tasks = useTaskStore(s => s.tasks)
  
  const todayTasks = useMemo(() => getTodayTasks(tasks), [tasks])
  const overdueTasks = useMemo(() => getOverdueTasks(tasks), [tasks])
  
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  return (
    <div style={{ padding: '24px 32px', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 400, color: 'var(--text-primary)' }}>
          Today's Briefing
        </h1>
      </div>
      
      {overdueTasks.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--critical)', marginBottom: 12 }}>
            ⚠ OVERDUE TASKS
          </h2>
          <TaskList tasks={overdueTasks} onEditTask={t => { setEditingTask(t); setPanelOpen(true); }} />
        </div>
      )}

      <div>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--high)', marginBottom: 12 }}>
          DUE TODAY
        </h2>
        <TaskList tasks={todayTasks} onEditTask={t => { setEditingTask(t); setPanelOpen(true); }} />
      </div>

      <TaskPanel 
        isOpen={panelOpen} 
        onClose={() => { setPanelOpen(false); setEditingTask(undefined); }} 
        task={editingTask} 
      />
    </div>
  )
}
