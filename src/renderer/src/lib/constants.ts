export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type Status = 'pending' | 'in-progress' | 'done'
export type RecurringInterval = 'daily' | 'weekly' | 'monthly'

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  category: string
  dueDate: string // ISO 8601 date string
  dueTime?: string // "HH:mm" optional
  status: Status
  isRecurring: boolean
  recurringInterval?: RecurringInterval
  parentId?: string // points to original if this is a recurrence
  completedAt?: string // ISO timestamp
  createdAt: string // ISO timestamp
}

export interface Settings {
  launchAtStartup: boolean
  showOverlayOnStartup: boolean
  overlayRequiresTyping: boolean
  dailyReminderEnabled: boolean
  dailyReminderTime: string // "HH:mm"
  notifyOverdue: boolean
  theme: 'dark' | 'light'
  accentColor: 'red' | 'orange' | 'blue'
  reduceAnimations: boolean
  hasCompletedOnboarding: boolean
  userName: string
  persona: string | null
}

export const DEFAULT_SETTINGS: Settings = {
  launchAtStartup: true,
  showOverlayOnStartup: true,
  overlayRequiresTyping: false,
  dailyReminderEnabled: true,
  dailyReminderTime: '08:00',
  notifyOverdue: true,
  theme: 'dark',
  accentColor: 'red',
  reduceAnimations: false,
  hasCompletedOnboarding: false,
  userName: 'Commander',
  persona: null
}

export const DEFAULT_CATEGORIES = ['Work', 'Personal', 'Health', 'Finance']

export const PERSONA_CATEGORIES: Record<string, string[]> = {
  Developer: ['Code Review', 'Bug Fix', 'Feature', 'Meeting'],
  Student: ['Homework', 'Study', 'Lecture', 'Personal'],
  Executive: ['Management', 'Strategy', 'Email', 'Finance'],
  General: ['Work', 'Personal', 'Health', 'Finance']
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; order: number }> = {
  critical: { label: 'CRITICAL', color: 'var(--critical)', order: 0 },
  high: { label: 'HIGH', color: 'var(--high)', order: 1 },
  medium: { label: 'MEDIUM', color: 'var(--medium)', order: 2 },
  low: { label: 'LOW', color: 'var(--low)', order: 3 }
}

export const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  pending: { label: 'PENDING', color: 'var(--text-secondary)' },
  'in-progress': { label: 'IN PROGRESS', color: 'var(--medium)' },
  done: { label: 'DONE', color: 'var(--done)' }
}
