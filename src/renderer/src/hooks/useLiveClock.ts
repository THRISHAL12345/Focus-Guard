import { useState, useEffect } from 'react'
import { format } from 'date-fns'

export function useLiveClock(): { time: string; date: string; greeting: string } {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return (): void => clearInterval(interval)
  }, [])

  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return {
    time: format(now, 'HH:mm:ss'),
    date: format(now, 'EEE dd MMM yyyy').toUpperCase(),
    greeting
  }
}
