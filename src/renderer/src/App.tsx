import React, { useState } from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { TaskPanel } from './components/task/TaskPanel'
import { useAppInit } from './hooks/useAppInit'
import { useSettingsStore } from './store/useSettingsStore'
import { useOverdueCheck } from './hooks/useOverdueCheck'

import { Dashboard } from './pages/Dashboard'
import { AllTasks } from './pages/AllTasks'
import { Today } from './pages/Today'
import { Recurring } from './pages/Recurring'
import { Categories } from './pages/Categories'
import { SettingsPage } from './pages/Settings'
import { Overlay } from './pages/Overlay'
import { OnboardingWizard } from './components/onboarding/OnboardingWizard'
import { Omnibar } from './pages/Omnibar'
import { CommandPalette } from './components/ui/CommandPalette'

export default function App(): React.ReactElement {
  useAppInit()
  useOverdueCheck()

  const { settings } = useSettingsStore()
  const isOverlay = window.location.search.includes('overlay=true')
  const isOmnibar = window.location.search.includes('omnibar=true')
  const [newTaskPanelOpen, setNewTaskPanelOpen] = useState(false)

  if (isOmnibar) {
    return <Omnibar />
  }

  if (isOverlay) {
    return <Overlay />
  }

  if (!settings.hasCompletedOnboarding) {
    return <OnboardingWizard />
  }

  return (
    <>
      <MemoryRouter>
        <CommandPalette onNewTask={() => setNewTaskPanelOpen(true)} />
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
