import { useEffect } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { isBefore, startOfDay, parseISO } from '../lib/dateUtils'

export function useOverdueCheck(): void {
  const tasks = useTaskStore((s) => s.tasks)

  useEffect(() => {
    const today = startOfDay(new Date())
    tasks.forEach((task) => {
      if (task.status === 'done') return
      const due = parseISO(task.dueDate)
      if (isBefore(due, today)) {
        // Task is overdue — visual handling happens in TaskRow via isOverdue()
        // No status change needed, we keep it as pending but render differently
      }
    })
  }, [tasks])
}

export function isTaskOverdue(dueDate: string, status: string): boolean {
  return status !== 'done' && isBefore(parseISO(dueDate), startOfDay(new Date()))
}
