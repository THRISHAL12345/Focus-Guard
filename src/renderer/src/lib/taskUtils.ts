import { Task, Priority, Status, PRIORITY_CONFIG } from './constants'
import { isOverdue, isToday, parseISO, isBefore, startOfDay } from './dateUtils'

export type SortField = 'priority' | 'dueDate' | 'title' | 'createdAt'
export type SortDirection = 'asc' | 'desc'

export function sortTasks(tasks: Task[], field: SortField, direction: SortDirection = 'asc'): Task[] {
  return [...tasks].sort((a, b) => {
    let cmp = 0

    switch (field) {
      case 'priority':
        cmp = PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order
        break
      case 'dueDate':
        cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        break
      case 'title':
        cmp = a.title.localeCompare(b.title)
        break
      case 'createdAt':
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
    }

    return direction === 'desc' ? -cmp : cmp
  })
}

export function filterByStatus(tasks: Task[], status: Status | 'all'): Task[] {
  if (status === 'all') return tasks
  return tasks.filter((t) => t.status === status)
}

export function filterByPriority(tasks: Task[], priority: Priority | 'all'): Task[] {
  if (priority === 'all') return tasks
  return tasks.filter((t) => t.priority === priority)
}

export function filterByCategory(tasks: Task[], category: string | 'all'): Task[] {
  if (category === 'all') return tasks
  return tasks.filter((t) => t.category === category)
}

export function getTodayTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => isToday(parseISO(t.dueDate)))
}

export function getOverdueTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status !== 'done' && isOverdue(t.dueDate))
}

export function getPendingTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status !== 'done')
}

export function getCompletedTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status === 'done')
}

export function getRecurringTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.isRecurring)
}

export function getTasksByCategory(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce(
    (acc, task) => {
      if (!acc[task.category]) acc[task.category] = []
      acc[task.category].push(task)
      return acc
    },
    {} as Record<string, Task[]>
  )
}

export function getTaskStats(tasks: Task[]) {
  const today = startOfDay(new Date())
  return {
    total: tasks.length,
    todayCount: tasks.filter((t) => isToday(parseISO(t.dueDate))).length,
    overdueCount: tasks.filter((t) => t.status !== 'done' && isBefore(parseISO(t.dueDate), today)).length,
    completedCount: tasks.filter((t) => t.status === 'done').length,
    pendingCount: tasks.filter((t) => t.status !== 'done').length,
    recurringCount: tasks.filter((t) => t.isRecurring).length
  }
}
