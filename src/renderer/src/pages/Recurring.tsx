import React, { useState, useMemo } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { getRecurringTasks } from '../lib/taskUtils'
import { HeatmapCalendar } from '../components/ui/HeatmapCalendar'
import { TaskList } from '../components/task/TaskList'
import { TaskPanel } from '../components/task/TaskPanel'
import { Task } from '../lib/constants'

export function Recurring(): React.ReactElement {
  const tasks = useTaskStore(s => s.tasks)
  
  const recurringTasks = useMemo(() => getRecurringTasks(tasks), [tasks])
  
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  return (
    <div style={{ padding: '24px 32px', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 400, color: 'var(--text-primary)' }}>
          Recurring Operations
        </h1>
      </div>
      
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 12 }}>
          COMPLETION HISTORY (LAST 90 DAYS)
        </div>
        <HeatmapCalendar tasks={tasks} days={90} />
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 12 }}>
          ACTIVE RECURRING TASKS
        </div>
        <TaskList tasks={recurringTasks} onEditTask={t => { setEditingTask(t); setPanelOpen(true); }} />
      </div>

      <TaskPanel 
        isOpen={panelOpen} 
        onClose={() => { setPanelOpen(false); setEditingTask(undefined); }} 
        task={editingTask} 
      />
    </div>
  )
}
