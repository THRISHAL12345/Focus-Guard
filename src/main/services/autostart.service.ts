import { app } from 'electron'

export const autoStartService = {
  setEnabled(enabled: boolean) {
    if (app.isPackaged) {
      app.setLoginItemSettings({
        openAtLogin: enabled,
        openAsHidden: false,
        name: 'FocusGuard',
        args: ['--started-at-login'],
        path: process.execPath // Ensure correct path for packaged app
      })
    }
  },
  isEnabled(): boolean {
    if (app.isPackaged) {
      return app.getLoginItemSettings().openAtLogin
    }
    return false
  }
}
