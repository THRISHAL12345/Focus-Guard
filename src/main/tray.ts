import { app, Tray, Menu } from 'electron'
import { join } from 'path'
import { BrowserWindow } from 'electron'

let tray: Tray | null = null

export function createTray(mainWindow: BrowserWindow) {
  const iconPath = join(__dirname, '../../resources/icon.png')
  tray = new Tray(iconPath)
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show()
        mainWindow.focus()
      }
    },
    { type: 'separator' },
    {
      label: 'Quit FocusGuard',
      click: () => {
        app.quit()
      }
    }
  ])
  
  tray.setToolTip('FocusGuard')
  tray.setContextMenu(contextMenu)
  
  tray.on('click', () => {
    mainWindow.show()
    mainWindow.focus()
  })
}
