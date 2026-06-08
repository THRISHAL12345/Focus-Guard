import { TitleBar } from './TitleBar'
import { Sidebar } from './Sidebar'
import { useSettingsStore } from '../../store/useSettingsStore'

interface AppShellProps {
  onNewTask: () => void
  children?: React.ReactNode
}

export function AppShell({ onNewTask, children }: AppShellProps): React.ReactElement {
  const theme = useSettingsStore((s) => s.settings.theme)

  return (
    <div
      data-theme={theme}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--bg-void)',
        overflow: 'hidden',
      }}
    >
      <TitleBar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar onNewTask={onNewTask} />
        <main style={{
          flex: 1,
          background: 'var(--bg-base)',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
