import { store } from '../store'
import { Task } from '../../renderer/src/lib/constants'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export function seedExampleTasks() {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const tasks: Task[] = [
    {
      id: generateId(),
      title: 'Review weekly goals',
      description: 'Check progress on all active projects',
      priority: 'high',
      category: 'Work',
      dueDate: todayStr,
      status: 'pending',
      isRecurring: true,
      recurringInterval: 'weekly',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: 'Morning workout',
      priority: 'medium',
      category: 'Health',
      dueDate: todayStr,
      status: 'pending',
      isRecurring: true,
      recurringInterval: 'daily',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: 'Read for 30 minutes',
      priority: 'low',
      category: 'Personal',
      dueDate: tomorrowStr,
      status: 'pending',
      isRecurring: false,
      createdAt: new Date().toISOString(),
    },
  ]

  store.set('tasks', tasks)
  store.set('initialized', true)
}
