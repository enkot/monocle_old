'use strict'

import path from 'path'
import { app, protocol, BrowserWindow, Tray } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import './actions'
import { setup as setupPushReceiver } from 'electron-push-receiver'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let tray

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function toggleWindow() {
  win.isVisible() ? win.hide() : showWindow()
}

function getWindowPosition() {
  const windowBounds = win.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  )
  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)
  return { x: x, y: y }
}

function showWindow() {
  const position = getWindowPosition()
  win.setPosition(position.x, position.y, false)
  win.show()
  win.focus()
}

function createTray() {
  tray = new Tray(path.join('src', 'assets', 'tray.png'))
  tray.on('click', () => {
    toggleWindow()
  })
}

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 360,
    height: 600,
    frame: false,
    show: false,
    resizable: false,
    fullscreenable: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  })

  win.setVisibleOnAllWorkspaces(true)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  if (!process.env.IS_TEST) win.webContents.openDevTools()

  setupPushReceiver(win.webContents)

  win.on('closed', () => {
    win = null
  })

  // Hide the window when it loses focus
  win.on('blur', () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.hide()
    }
  })
}

// Don't show the app in the doc
app.dock.hide()

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createTray()
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
