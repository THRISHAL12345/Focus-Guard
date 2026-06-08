import { create } from 'zustand'
import { Task, Status, DEFAULT_CATEGORIES } from '../lib/constants'
import { getNextDueDate } from '../lib/dateUtils'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

interface TaskStore {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  completeTask: (id: string) => void
  setTaskStatus: (id: string, status: Status) => void
  persistTasks: () => Promise<void>
  categories: string[]
  setCategories: (categories: string[]) => void
  addCategory: (category: string) => void
  updateCategory: (oldCategory: string, newCategory: string) => void
  deleteCategory: (category: string) => void
  persistCategories: () => Promise<void>
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  categories: DEFAULT_CATEGORIES,

  setTasks: (tasks) => set({ tasks }),

  addTask: async (taskData) => {
    const task: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString()
    }
    set((s) => ({ tasks: [...s.tasks, task] }))
    await get().persistTasks()
  },

  updateTask: async (id, updates) => {
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    }))
    await get().persistTasks()
  },

  deleteTask: async (id) => {
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
    await get().persistTasks()
  },

  completeTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return

    // Mark as done
    const updates: Partial<Task> = {
      status: 'done',
      completedAt: new Date().toISOString()
    }

    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    }))

    // Spawn next recurring task
    if (task.isRecurring && task.recurringInterval) {
      const nextDue = getNextDueDate(task.dueDate, task.recurringInterval)
      const nextTask: Task = {
        ...task,
        id: generateId(),
        status: 'pending',
        completedAt: undefined,
        dueDate: nextDue,
        parentId: task.parentId ?? task.id,
        createdAt: new Date().toISOString()
      }
      set((s) => ({ tasks: [...s.tasks, nextTask] }))
    }

    await get().persistTasks()
  },

  setTaskStatus: async (id, status) => {
    if (status === 'done') {
      get().completeTask(id)
      return
    }
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t))
    }))
    await get().persistTasks()
  },

  persistTasks: async () => {
    try {
      await window.api.saveTasks(get().tasks)
    } catch {
      // silently fail in dev when api isn't available
    }
  },

  setCategories: (categories) => set({ categories }),

  addCategory: async (category) => {
    set((s) => ({ categories: [...s.categories, category] }))
    await get().persistCategories()
  },

  updateCategory: async (oldCategory, newCategory) => {
    set((s) => ({
      categories: s.categories.map((c) => (c === oldCategory ? newCategory : c)),
      // Also update any tasks using this category
      tasks: s.tasks.map((t) => (t.category === oldCategory ? { ...t, category: newCategory } : t))
    }))
    await get().persistCategories()
    await get().persistTasks()
  },

  deleteCategory: async (category) => {
    set((s) => ({
      categories: s.categories.filter((c) => c !== category),
      // Move tasks in deleted category to 'Personal' or first available
      tasks: s.tasks.map((t) => (t.category === category ? { ...t, category: s.categories[0] === category ? s.categories[1] || 'Personal' : s.categories[0] } : t))
    }))
    await get().persistCategories()
    await get().persistTasks()
  },

  persistCategories: async () => {
    try {
      await window.api.saveCategories(get().categories)
    } catch {
      // silently fail
    }
  }
}))
