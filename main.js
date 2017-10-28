const {app, BrowserWindow, webFrame, Menu, shell} = require('electron')
const path = require('path')
const url = require('url')



let win

function createWindow () {
    win = new BrowserWindow({
        width: 1600,
        height: 1000,
        minWidth: 1000,
        minHeight: 600,
        icon: path.join(__dirname, './src/assets/nirethink.icns')
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, './dist/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.commandLine.appendSwitch('--enable-viewport-meta', 'true')
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

