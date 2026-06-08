import { Task, Settings } from './constants'

export interface ElectronAPI {
  // Tasks
  getAllTasks: () => Promise<Task[]>
  saveTasks: (tasks: Task[]) => Promise<void>
  getCategories: () => Promise<string[]>
  saveCategories: (categories: string[]) => Promise<void>

  // Settings
  getSettings: () => Promise<Settings>
  saveSettings: (settings: Settings) => Promise<void>

  // Overlay
  dismissOverlay: () => void

  // Window controls
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void

  // System
  getAppVersion: () => Promise<string>
}

declare global {
  interface Window {
    api: ElectronAPI
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: unknown[]) => void
        invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
        on: (channel: string, listener: (...args: unknown[]) => void) => void
      }
    }
  }
}

export {}
