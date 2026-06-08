import { contextBridge, ipcRenderer } from 'electron'

// Define the API object
const api = {
  // Tasks
  getAllTasks: () => ipcRenderer.invoke('tasks:get-all'),
  saveTasks: (tasks) => ipcRenderer.invoke('tasks:save', tasks),
  getCategories: () => ipcRenderer.invoke('tasks:get-categories'),
  saveCategories: (cats) => ipcRenderer.invoke('tasks:save-categories', cats),

  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (s) => ipcRenderer.invoke('settings:save', s),

  // Overlay
  dismissOverlay: () => ipcRenderer.send('overlay:dismissed'),
  
  // Omnibar
  hideOmnibar: () => ipcRenderer.send('omnibar:hide'),

  // Window controls (for custom titlebar)
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),

  // System
  getAppVersion: () => ipcRenderer.invoke('app:version'),
}

// Expose API to renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.api = api
}
