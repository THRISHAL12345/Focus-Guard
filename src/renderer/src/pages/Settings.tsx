import React from 'react'
import { useSettingsStore } from '../store/useSettingsStore'
import { Toggle } from '../components/ui/Toggle'
import { CategoryManager } from '../components/settings/CategoryManager'
import { Settings } from '../lib/constants'

export function SettingsPage(): React.ReactElement {
  const { settings, updateSetting } = useSettingsStore()

  const handleExport = () => {
    try {
      window.api.getAllTasks().then(tasks => {
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `focusguard-export-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      })
    } catch { /* dev */ }
  }

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: 8,
        marginBottom: 16
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  )

  const Row = ({ label, desc, control }: { label: string, desc?: string, control: React.ReactNode }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ color: 'var(--text-primary)', fontSize: 14 }}>{label}</div>
        {desc && <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>{desc}</div>}
      </div>
      <div>{control}</div>
    </div>
  )

  return (
    <div style={{ padding: '24px 32px', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 400, color: 'var(--text-primary)' }}>
          Settings
        </h1>
      </div>
      
      <div style={{ maxWidth: 600 }}>
        <Section title="SYSTEM">
          <Row 
            label="Launch at Windows startup" 
            control={<Toggle checked={settings.launchAtStartup} onChange={v => updateSetting('launchAtStartup', v)} />} 
          />
          <Row 
            label="Show overlay on startup" 
            control={<Toggle checked={settings.showOverlayOnStartup} onChange={v => updateSetting('showOverlayOnStartup', v)} />} 
          />
        </Section>

        <Section title="NOTIFICATIONS">
          <Row 
            label="Daily reminder notification" 
            control={<Toggle checked={settings.dailyReminderEnabled} onChange={v => updateSetting('dailyReminderEnabled', v)} />} 
          />
          <Row 
            label="Reminder time" 
            control={
              <input 
                type="time" 
                value={settings.dailyReminderTime} 
                onChange={e => updateSetting('dailyReminderTime', e.target.value)}
                disabled={!settings.dailyReminderEnabled}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  opacity: settings.dailyReminderEnabled ? 1 : 0.5
                }}
              />
            } 
          />
          <Row 
            label="Notify for overdue tasks" 
            control={<Toggle checked={settings.notifyOverdue} onChange={v => updateSetting('notifyOverdue', v)} />} 
          />
        </Section>

        <Section title="APPEARANCE">
          <Row 
            label="Theme" 
            control={
              <select 
                value={settings.theme} 
                onChange={e => updateSetting('theme', e.target.value as Settings['theme'])}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
              </select>
            } 
          />
          <Row 
            label="Accent color" 
            control={
              <select 
                value={settings.accentColor} 
                onChange={e => updateSetting('accentColor', e.target.value as Settings['accentColor'])}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <option value="red">Red</option>
                <option value="orange">Orange</option>
                <option value="blue">Blue</option>
              </select>
            } 
          />
        </Section>

        <Section title="CATEGORIES">
          <CategoryManager />
        </Section>

        <Section title="DATA">
          <Row 
            label="Export all tasks" 
            desc="Save your data as a JSON file"
            control={
              <button onClick={handleExport} style={{
                padding: '6px 12px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                cursor: 'pointer'
              }}>
                EXPORT JSON
              </button>
            } 
          />
        </Section>
      </div>
    </div>
  )
}
