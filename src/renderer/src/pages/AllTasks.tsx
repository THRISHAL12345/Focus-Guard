import React, { useState } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { useTaskFilters } from '../hooks/useTaskFilters'
import { FilterBar } from '../components/ui/FilterBar'
import { TaskList } from '../components/task/TaskList'
import { TaskPanel } from '../components/task/TaskPanel'
import { Task } from '../lib/constants'

export function AllTasks(): React.ReactElement {
  const tasks = useTaskStore(s => s.tasks)
  const categories = useTaskStore(s => s.categories)
  const { filters, setFilter, filteredTasks } = useTaskFilters(tasks)
  
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  return (
    <div style={{ padding: '24px 32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 400, color: 'var(--text-primary)' }}>
          All Tasks
        </h1>
      </div>
      
      <FilterBar filters={filters} setFilter={setFilter} categories={categories} />
      
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
        <TaskList tasks={filteredTasks} onEditTask={t => { setEditingTask(t); setPanelOpen(true); }} />
      </div>

      <TaskPanel 
        isOpen={panelOpen} 
        onClose={() => { setPanelOpen(false); setEditingTask(undefined); }} 
        task={editingTask} 
      />
    </div>
  )
}
