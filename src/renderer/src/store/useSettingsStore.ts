import { create } from 'zustand'
import { Settings, DEFAULT_SETTINGS } from '../lib/constants'

interface SettingsStore {
  settings: Settings
  setSettings: (settings: Settings) => void
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  persistSettings: () => Promise<void>
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,

  setSettings: (settings) => set({ settings }),

  updateSetting: async (key, value) => {
    set((s) => ({
      settings: { ...s.settings, [key]: value }
    }))
    await get().persistSettings()
  },

  persistSettings: async () => {
    try {
      await window.api.saveSettings(get().settings)
    } catch {
      // silently fail in dev
    }
  }
}))
