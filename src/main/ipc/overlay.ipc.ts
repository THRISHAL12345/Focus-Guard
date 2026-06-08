import { ipcMain, BrowserWindow } from 'electron'

export function registerOverlayHandlers(overlayWin: BrowserWindow | null, mainWin: BrowserWindow) {
  ipcMain.on('overlay:dismissed', () => {
    if (overlayWin && !overlayWin.isDestroyed()) {
      overlayWin.close()
    }
    if (mainWin && !mainWin.isDestroyed()) {
      mainWin.show()
      mainWin.focus()
    }
  })
}
