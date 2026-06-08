import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HexLogo } from '../components/layout/TitleBar'
import { ScanlineEffect } from '../components/overlay/ScanlineEffect'
import { OverlayTaskItem } from '../components/overlay/OverlayTaskItem'
import { useTaskStore } from '../store/useTaskStore'
import { getTodayTasks, getOverdueTasks } from '../lib/taskUtils'
import { useLiveClock } from '../hooks/useLiveClock'

function Typewriter({ text, startDelay }: { text: string; startDelay: number }) {
  const [displayed, setDisplayed] = useState('')
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, ++i))
        if (i >= text.length) clearInterval(interval)
      }, 40)
    }, startDelay * 1000)
    return () => clearTimeout(timeout)
  }, [text, startDelay])
  
  return <span>{displayed}<span style={{ animation: 'pulse 1s infinite' }}>_</span></span>
}

export function Overlay(): React.ReactElement {
  const [dismissing, setDismissing] = useState(false)
  const tasks = useTaskStore(s => s.tasks)
  const { time, date } = useLiveClock()
  
  const todayTasks = getTodayTasks(tasks).filter(t => t.status !== 'done')
  const overdueTasks = getOverdueTasks(tasks)
  
  // Combine and deduplicate
  const urgentTasks = [...new Map([...overdueTasks, ...todayTasks].map(item => [item.id, item])).values()]

  const handleDismiss = () => {
    setDismissing(true)
    setTimeout(() => {
      try { window.api.dismissOverlay() } catch { /* dev */ }
    }, 800)
  }

  // Animation sequence times
  const seq = {
    logo: 0.3,
    title: 0.6,
    scan: 0.9,
    tasks: 1.2,
    button: 1.8
  }

  return (
    <div className={dismissing ? 'dissolving' : ''} style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-overlay)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      overflow: 'hidden',
      userSelect: 'none'
    }}>
      <ScanlineEffect />

      <div style={{ zIndex: 20, width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Logo & Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: seq.logo, duration: 0.8, ease: "easeOut" }}
          className="glow-pulse"
          style={{ marginBottom: 24 }}
        >
          <HexLogo size={80} color="var(--accent)" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: seq.title }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1 }}>
            FOCUSGUARD
          </h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.2em', marginTop: 8 }}>
            PRODUCTIVITY ENFORCER
          </div>
        </motion.div>

        {/* Date Divider */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ delay: seq.scan, duration: 0.6 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            width: '100%',
            marginBottom: 40
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--border-strong)' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent)', fontWeight: 600, display: 'flex', gap: 16 }}>
            <span>TODAY IS</span>
            <span>{date} // {time}</span>
          </div>
          <div style={{ flex: 1, height: 1, background: 'var(--border-strong)' }} />
        </motion.div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: seq.tasks, duration: 0.6 }}
          style={{ width: '100%', marginBottom: 40 }}
        >
          <div style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: 12, 
            color: 'var(--text-secondary)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <div style={{ width: 8, height: 8, background: 'var(--accent)' }} />
            SYSTEM BOOT — <Typewriter text="TASKS REQUIRING YOUR ATTENTION" startDelay={seq.tasks} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {urgentTasks.length > 0 ? (
              urgentTasks.slice(0, 5).map(task => (
                <OverlayTaskItem key={task.id} task={task} />
              ))
            ) : (
              <div style={{ 
                padding: '24px', 
                textAlign: 'center', 
                border: '1px dashed var(--border-strong)',
                color: 'var(--done)',
                fontFamily: 'var(--font-mono)'
              }}>
                NO URGENT TASKS FOUND. PROCEED.
              </div>
            )}
            {urgentTasks.length > 5 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 8 }}>
                + {urgentTasks.length - 5} MORE TASKS
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: seq.button, duration: 1 }}
          style={{ width: '100%' }}
        >
          <button
            onClick={handleDismiss}
            style={{
              width: '100%',
              height: 56,
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.02)'
              e.currentTarget.style.filter = 'brightness(1.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.filter = 'brightness(1)'
            }}
          >
            ACKNOWLEDGE TASKS AND ENTER →
          </button>
          
          <div style={{ 
            textAlign: 'center', 
            marginTop: 16, 
            fontFamily: 'var(--font-mono)', 
            fontSize: 11,
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'center',
            gap: 16
          }}>
            <span>{urgentTasks.length} TASKS PENDING</span>
            <span>•</span>
            <span style={{ color: overdueTasks.length > 0 ? 'var(--critical)' : 'inherit' }}>{overdueTasks.length} OVERDUE</span>
            <span>•</span>
            <span>{todayTasks.length} DUE TODAY</span>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
