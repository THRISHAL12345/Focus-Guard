import {
  addDays,
  addWeeks,
  addMonths,
  formatISO,
  parseISO,
  isToday,
  isTomorrow,
  isYesterday,
  isBefore,
  startOfDay,
  differenceInDays,
  format
} from 'date-fns'
import { RecurringInterval } from './constants'

export function getNextDueDate(dueDate: string, interval: RecurringInterval): string {
  const date = parseISO(dueDate)
  const next =
    interval === 'daily' ? addDays(date, 1) : interval === 'weekly' ? addWeeks(date, 1) : addMonths(date, 1)
  return formatISO(next, { representation: 'date' })
}

export function formatRelativeDate(dateStr: string): string {
  const date = parseISO(dateStr)
  const today = startOfDay(new Date())

  if (isToday(date)) return 'TODAY'
  if (isTomorrow(date)) return 'TOMORROW'
  if (isYesterday(date)) return 'YESTERDAY'

  const diff = differenceInDays(date, today)

  if (diff > 0 && diff <= 7) return `IN ${diff} DAYS`
  if (diff < 0 && diff >= -7) return `${Math.abs(diff)} DAYS AGO`

  return format(date, 'dd MMM yyyy').toUpperCase()
}

export function isOverdue(dueDate: string): boolean {
  return isBefore(parseISO(dueDate), startOfDay(new Date()))
}

export function getDaysUntilDue(dueDate: string): number {
  return differenceInDays(parseISO(dueDate), startOfDay(new Date()))
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

export function getTodayISO(): string {
  return formatISO(new Date(), { representation: 'date' })
}

export { isToday, isTomorrow, parseISO, format, startOfDay, differenceInDays, isBefore }
