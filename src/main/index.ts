import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { store } from './store'
import { seedExampleTasks } from './services/seed'
import { autoStartService } from './services/autostart.service'
import { registerTaskHandlers } from './ipc/tasks.ipc'
import { registerSettingsHandlers } from './ipc/settings.ipc'
import { registerOverlayHandlers } from './ipc/overlay.ipc'
import { createTray } from './tray'
import icon from '../../resources/icon.png?asset'

let mainWindow: BrowserWindow | null = null
let overlayWindow: BrowserWindow | null = null
let omnibarWindow: BrowserWindow | null = null

function createOmnibarWindow(): void {
  omnibarWindow = new BrowserWindow({
    width: 600,
    height: 80,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    titleBarStyle: 'hidden',
    show: false,
    skipTaskbar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  omnibarWindow.on('blur', () => {
    omnibarWindow?.hide()
  })

  const omnibarUrl = is.dev && process.env['ELECTRON_RENDERER_URL']
    ? `${process.env['ELECTRON_RENDERER_URL']}?omnibar=true`
    : `file://${join(__dirname, '../renderer/index.html')}?omnibar=true`

  omnibarWindow.loadURL(omnibarUrl)
}

function createOverlayWindow(): void {
  overlayWindow = new BrowserWindow({
    fullscreen: true,
    alwaysOnTop: true,
    frame: false,
    resizable: false,
    movable: false,
    skipTaskbar: false,
    backgroundColor: '#000000',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Prevent alt+f4, task manager can still kill it
  overlayWindow.on('close', (e) => {
    // Only prevent close if we are not explicitly destroying it
    if (overlayWindow && !overlayWindow.isDestroyed() && mainWindow && !mainWindow.isVisible()) {
      e.preventDefault()
    }
  })

  const overlayUrl = is.dev && process.env['ELECTRON_RENDERER_URL']
    ? `${process.env['ELECTRON_RENDERER_URL']}?overlay=true`
    : `file://${join(__dirname, '../renderer/index.html')}?overlay=true`

  overlayWindow.loadURL(overlayUrl)
}

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#080808',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Window controls IPC
  ipcMain.on('window:minimize', () => mainWindow?.minimize())
  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) mainWindow?.unmaximize()
    else mainWindow?.maximize()
  })
  ipcMain.on('window:close', () => mainWindow?.close())

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.focusguard.app')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC Handlers
  registerTaskHandlers()
  registerSettingsHandlers()
  
  ipcMain.handle('app:version', () => app.getVersion())
  ipcMain.on('omnibar:hide', () => omnibarWindow?.hide())

  // Initialize
  const isFirstLaunch = (store as any).get('initialized') !== true
  if (isFirstLaunch) {
    autoStartService.setEnabled(true)
    seedExampleTasks()
  }

  // Create windows
  createMainWindow()
  createOmnibarWindow()
  
  if (mainWindow) {
    createTray(mainWindow)
    registerOverlayHandlers(overlayWindow, mainWindow)
  }

  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    if (omnibarWindow) {
      if (omnibarWindow.isVisible()) {
        omnibarWindow.hide()
      } else {
        omnibarWindow.center()
        omnibarWindow.show()
      }
    }
  })

  const settings = (store as any).get('settings')
  const isStartupLaunch = process.argv.includes('--started-at-login')

  if (settings.showOverlayOnStartup && (isStartupLaunch || is.dev)) {
    createOverlayWindow()
  } else {
    mainWindow?.on('ready-to-show', () => {
      mainWindow?.show()
    })
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
