import { Notification } from 'electron'
import { join } from 'path'
import { store } from '../store'
import { Task } from '../../renderer/src/lib/constants'

let reminderTimer: NodeJS.Timeout | null = null

export const notificationService = {
  reschedule(timeStr: string) {
    if (reminderTimer) clearInterval(reminderTimer)
    
    // Check every minute
    reminderTimer = setInterval(() => {
      const now = new Date()
      const [h, m] = timeStr.split(':').map(Number)
      
      if (now.getHours() === h && now.getMinutes() === m) {
        this.sendDailyReminder()
      }
    }, 60_000)
  },

  sendDailyReminder() {
    const tasks = store.get('tasks') as Task[]
    
    // Basic "isToday" check for main process without date-fns
    const today = new Date()
    const todayPending = tasks.filter(t => {
      if (t.status === 'done') return false
      const due = new Date(t.dueDate)
      return due.getUTCFullYear() === today.getUTCFullYear() &&
             due.getUTCMonth() === today.getUTCMonth() &&
             due.getUTCDate() === today.getUTCDate()
    })
    
    if (todayPending.length === 0) return

    new Notification({
      title: 'FocusGuard — Daily Briefing',
      body: `${todayPending.length} task(s) need your attention today.`,
      icon: join(__dirname, '../../resources/icon.png'),
    }).show()
  }
}
