import { app, BrowserWindow } from 'electron';
import { rootPath, assetsPath } from '../path';
import { prepareStorage } from './storage'
import './ipc'

const path = require('path')
const url = require('url')

let mainWindow

let init = () => {
	prepareStorage().then((config) => {
		createWindow()
	})
}

let createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 600,
		height: 500,
		resizable:false
	})

	mainWindow.loadURL(url.format({
		pathname: path.join(assetsPath, '/views/index.html'),
		protocol: 'file:',
		slashes: true
	}))

	//mainWindow.webContents.openDevTools()

	mainWindow.on('closed', function() {
		mainWindow = null
	})
}

app.on('ready', init)

app.on('window-all-closed', function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})