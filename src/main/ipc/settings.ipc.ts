import { ipcMain } from 'electron'
import { store } from '../store'
import { autoStartService } from '../services/autostart.service'
import { notificationService } from '../services/notification.service'

export function registerSettingsHandlers() {
  ipcMain.handle('settings:get', () => store.get('settings'))
  
  ipcMain.handle('settings:save', (_, settings) => {
    store.set('settings', settings)
    
    // Apply side effects
    autoStartService.setEnabled(settings.launchAtStartup)
    
    if (settings.dailyReminderEnabled) {
      notificationService.reschedule(settings.dailyReminderTime)
    }
  })
}
