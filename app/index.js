'use strict'
const electron = require('electron')
const electronSettings = require('electron-settings')
const electronPlatform = require('electron-platform')
const path = require('path')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const Menu = electron.Menu

let mainWindow = null
let outputWindow = null
const isDev = process.env.NODE_ENV === 'development'
let config
if (isDev) config = require('../build/config')
else config = {}

const install = require('./install')

let displays
let selectedDisplay

function createMainWindow () {
  if (electronPlatform.isDarwin) {
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      minWidth: 800,
      minHeight: 700,
      titleBarStyle: 'hidden-inset',
      backgroundColor: '#373737'
    })
  } else {
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      minWidth: 800,
      minHeight: 700,
      frame: false,
      backgroundColor: '#373737',
      icon: path.join(__dirname, 'assets/icon.png')
    })
  }
  mainWindow.setMenuBarVisibility(false)

  // and load the index.html of the app.
  const url = isDev ? `http://localhost:${config.port}#app` : `file://${__dirname}/dist/index.html#app`
  // const url = `file://${__dirname}/dist/index.html`
  mainWindow.loadURL(url)

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools()

    const installExtension = require('electron-devtools-installer')
    installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err))
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    if (outputWindow !== null) {
      outputWindow.close()
    }
  })

  const template = [
    {
      label: 'Application',
      submenu: [
        { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    }, {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

function createOutputWindow () {
  outputWindow = new BrowserWindow({
    x: displays[selectedDisplay].bounds.x,
    y: displays[selectedDisplay].bounds.y,
    backgroundColor: '#000000',
    show: true
  })

  outputWindow.setFullScreen(true)
  outputWindow.setMenuBarVisibility(false)

  const url = isDev ? `http://localhost:${config.port}#output` : `file://${__dirname}/dist/index.html#output`
  outputWindow.loadURL(url)

  outputWindow.webContents.on('did-finish-load', () => {
    outputWindow.show()
  })

  outputWindow.once('closed', () => {
    if (mainWindow !== null) mainWindow.webContents.send('outputClosed', '')
    outputWindow = null
  })
  return outputWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  if (!electronSettings.has('poive.conf')) install()
  var conf = electronSettings.get('poive.conf')
  // 현재 존재하는 모든 디스플레이들
  displays = electron.screen.getAllDisplays()

  electron.screen.on('display-added', (event) => { displays = electron.screen.getAllDisplays() })
  electron.screen.on('display-removed', (event) => { displays = electron.screen.getAllDisplays() })

  // 만약 conf에 등록된 디스플레이가 현재 없다면
  if (displays[conf.outputDisplay] === undefined) {
    // 첫번째 디스플레이로 설정한뒤 conf 저장
    selectedDisplay = 0
    conf.outputDisplay = 0
    electronSettings.set('poive.conf.outputDisplay', 0)
  } else {
    selectedDisplay = conf.outputDisplay
  }

  // app.setting 에서 출력 설정을 바꾸면...
  ipcMain.on('changeOutputScreen', (event, arg) => {
    selectedDisplay = arg
    conf.outputDisplay = arg
    electronSettings.set('poive.conf.outputDisplay', arg)
  })

  createMainWindow()

  ipcMain.on('playOn', (event, arg) => {
    outputWindow = createOutputWindow()
    outputWindow.webContents.on('did-finish-load', () => {
      outputWindow.webContents.send('sendBlack', arg.isBlack)
      outputWindow.webContents.send('sendSheet', arg.groups)
      outputWindow.webContents.send('sendIndex', arg.index)
    })
  })

  ipcMain.on('playOff', (event, arg) => {
    outputWindow.close()
  })
  ipcMain.on('sendSheet', (event, arg) => {
    if (outputWindow) outputWindow.webContents.send('sendSheet', arg)
  })
  ipcMain.on('sendIndex', (event, arg) => {
    if (outputWindow) outputWindow.webContents.send('sendIndex', arg)
  })
  ipcMain.on('sendBlack', (event, arg) => {
    if (outputWindow) outputWindow.webContents.send('sendBlack', arg)
  })
  ipcMain.on('sendIndexBack', (event, arg) => {
    mainWindow.webContents.send('sendIndexBack', arg)
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createMainWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
