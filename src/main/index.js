'use strict'

import path from 'path'
import { app, BrowserWindow, Tray } from 'electron'
import { setup as setupPushReceiver } from 'electron-push-receiver'
import '../renderer/store'

const Menu = require('electron').Menu

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
let tray

const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function toggleWindow() {
  mainWindow.isVisible() ? mainWindow.hide() : showWindow()
}

function getWindowPosition() {
  const windowBounds = mainWindow.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  )
  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(
    trayBounds.y + trayBounds.height + 4 - windowBounds.height
  )
  return { x: x, y: y }
}

function showWindow() {
  const position = getWindowPosition()
  mainWindow.setPosition(position.x, position.y, false)
  mainWindow.show()
  mainWindow.focus()
}

function createTray() {
  /* eslint-disable */
  tray = new Tray(path.join(__static, 'tray.png'))
  tray.on('right-click', (event) => tray.popUpContextMenu(Menu.buildFromTemplate([
    {
      label: 'Quit',
      type: 'normal',
      click: () => app.quit()
    }
  ])))
  /* eslint-enable */
  tray.on('click', () => {
    toggleWindow()
  })
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 360,
    height: 600,
    frame: false,
    show: false,
    resizable: false,
    fullscreenable: false,
    transparent: true,
    skipTaskbar: true,
    icon: path.join(__static, 'icons/mac/icon.icns'),
  })

  mainWindow.setAlwaysOnTop(true, 'floating', 1);
  // allows the window to show over a fullscreen window
  mainWindow.setVisibleOnAllWorkspaces(true);

  mainWindow.loadURL(winURL)

  setupPushReceiver(mainWindow.webContents)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('blur', () => {
    mainWindow.hide()
  })
}

function createMenu() {
  const application = {
    label: 'Application',
    submenu: [
      {
        label: 'About Application',
        selector: 'orderFrontStandardAboutPanel:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => {
          app.quit()
        }
      }
    ]
  }

  const edit = {
    label: 'Edit',
    submenu: [
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:'
      }
    ]
  }

  const template = [application, edit]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

if (process.platform === 'darwin') {
  app.dock.hide()
}

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (shouldQuit) {
  app.quit();
}

app.on('ready', () => {
  createTray()
  createWindow()
  createMenu()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
