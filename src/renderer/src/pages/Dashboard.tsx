import React, { useState } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { useLiveClock } from '../hooks/useLiveClock'
import { useTaskFilters } from '../hooks/useTaskFilters'
import { getTaskStats } from '../lib/taskUtils'
import { StatCard } from '../components/ui/StatCard'
import { FilterBar } from '../components/ui/FilterBar'
import { TaskList } from '../components/task/TaskList'
import { TaskPanel } from '../components/task/TaskPanel'
import { Task } from '../lib/constants'

export function Dashboard(): React.ReactElement {
  const tasks = useTaskStore(s => s.tasks)
  const categories = useTaskStore(s => s.categories)
  const stats = getTaskStats(tasks)
  const { time, date, greeting } = useLiveClock()
  
  // Dashboard defaults to showing today + overdue if no filters applied
  // For simplicity, we just use the global filter hook
  const { filters, setFilter, filteredTasks } = useTaskFilters(tasks)
  
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setPanelOpen(true)
  }

  // Simulate trends
  const completedTrend = stats.completedCount > 0 ? `↑ ${stats.completedCount} done` : ''
  const overdueTrend = stats.overdueCount > 0 ? '⚠ urgent' : ''

  return (
    <div style={{ padding: '24px 32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 4 }}>
            COMMAND CENTER
          </div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 400, color: 'var(--text-primary)' }}>
            {greeting}, Commander.
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: 4 }}>
            {date}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>
            {time}
          </div>
        </div>
      </div>
      
      <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 24 }} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard title="TOTAL" subtitle="ALL TASKS" value={stats.total} accentColor="var(--medium)" trend={`↑ ${stats.pendingCount} pending`} />
        <StatCard title="TODAY" subtitle="DUE TODAY" value={stats.todayCount} accentColor="var(--high)" />
        <StatCard title="OVERDUE" subtitle="PAST DUE" value={stats.overdueCount} accentColor="var(--critical)" trend={overdueTrend} />
        <StatCard title="DONE" subtitle="COMPLETED" value={stats.completedCount} accentColor="var(--done)" trend={completedTrend} />
      </div>

      {/* Task List Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <FilterBar filters={filters} setFilter={setFilter} categories={categories} />
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          <TaskList tasks={filteredTasks} onEditTask={handleEdit} />
        </div>
      </div>

      {/* Edit Panel (if opened from list) */}
      <TaskPanel 
        isOpen={panelOpen} 
        onClose={() => { setPanelOpen(false); setEditingTask(undefined); }} 
        task={editingTask} 
      />
    </div>
  )
}
