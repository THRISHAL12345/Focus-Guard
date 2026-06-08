import { ipcMain } from 'electron'
import { store } from '../store'

export function registerTaskHandlers() {
  ipcMain.handle('tasks:get-all', () => store.get('tasks'))
  
  ipcMain.handle('tasks:save', (_, tasks) => {
    store.set('tasks', tasks)
  })
  
  ipcMain.handle('tasks:get-categories', () => store.get('categories'))
  
  ipcMain.handle('tasks:save-categories', (_, cats) => {
    store.set('categories', cats)
  })
}
