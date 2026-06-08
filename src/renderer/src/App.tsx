import React, { useState } from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { TaskPanel } from './components/task/TaskPanel'
import { useAppInit } from './hooks/useAppInit'
import { useOverdueCheck } from './hooks/useOverdueCheck'

import { Dashboard } from './pages/Dashboard'
import { AllTasks } from './pages/AllTasks'
import { Today } from './pages/Today'
import { Recurring } from './pages/Recurring'
import { Categories } from './pages/Categories'
import { SettingsPage } from './pages/Settings'
import { Overlay } from './pages/Overlay'

export default function App(): React.ReactElement {
  useAppInit()
  useOverdueCheck()

  const isOverlay = window.location.search.includes('overlay=true')
  const [newTaskPanelOpen, setNewTaskPanelOpen] = useState(false)

  if (isOverlay) {
    return <Overlay />
  }

  return (
    <>
      <MemoryRouter>
        <AppShell onNewTask={() => setNewTaskPanelOpen(true)}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/all" element={<AllTasks />} />
            <Route path="/today" element={<Today />} />
            <Route path="/recurring" element={<Recurring />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppShell>
      </MemoryRouter>
      
      {/* Global New Task Panel */}
      <TaskPanel 
        isOpen={newTaskPanelOpen} 
        onClose={() => setNewTaskPanelOpen(false)} 
      />
    </>
  )
}
