import { useEffect } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { useSettingsStore } from '../store/useSettingsStore'

export function useAppInit(): void {
  const setTasks = useTaskStore((s) => s.setTasks)
  const setSettings = useSettingsStore((s) => s.setSettings)

  useEffect(() => {
    async function init(): Promise<void> {
      try {
        const [tasks, settings, categories] = await Promise.all([
          window.api.getAllTasks(),
          window.api.getSettings(),
          window.api.getCategories()
        ])
        if (tasks) setTasks(tasks)
        if (settings) setSettings(settings)
        if (categories) useTaskStore.getState().setCategories(categories)
      } catch {
        // API not available in dev mode
        console.log('Running without Electron API')
      }
    }
    init()
  }, [setTasks, setSettings])
}
