import { useState, useMemo } from 'react'
import { Task, Priority, Status } from '../lib/constants'
import { sortTasks, filterByStatus, filterByPriority, filterByCategory, SortField, SortDirection } from '../lib/taskUtils'

export interface TaskFilters {
  status: Status | 'all'
  priority: Priority | 'all'
  category: string | 'all'
  sortField: SortField
  sortDirection: SortDirection
  searchQuery: string
}

export function useTaskFilters(tasks: Task[]) {
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    category: 'all',
    sortField: 'dueDate',
    sortDirection: 'asc',
    searchQuery: ''
  })

  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    // Search filter
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
    }

    // Status filter
    result = filterByStatus(result, filters.status)

    // Priority filter
    result = filterByPriority(result, filters.priority)

    // Category filter
    result = filterByCategory(result, filters.category)

    // Sort
    result = sortTasks(result, filters.sortField, filters.sortDirection)

    return result
  }, [tasks, filters])

  const setFilter = <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]): void => {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  return { filters, setFilter, filteredTasks }
}
