import { ipcMain, dialog} from 'electron'
import SheetBook from './sheetBook'
import * as storage from './storage'
import * as fs from 'fs'

const ipc = ipcMain

ipc.on('get-config', function(event){
	event.sender.send('get-config', storage.getConfig())
})

ipc.on('open-file-dialog', function(event) {
	let sheetBook = new SheetBook()
	dialog.showOpenDialog({
		properties: ['openFile']
	}, function(files) {
		if (files) {

			for (let i in files) {
				try {
					sheetBook.readFile(files[i])
				} catch (e) {
					event.sender.send('open-file-dialog', {
						error: e
					})
					break;
				}
				let summery = sheetBook.getSummery()
				event.sender.send('open-file-dialog',{summery:summery})
			}
		}
	})
})

ipc.on('open-save-dialog', function(event,data){
	dialog.showSaveDialog({title:"Save To File", defaultPath:data.namePattern,filters:[{name:'Text File',extensions:['txt']}]}, function(filename){
		if (!filename) return;
		fs.writeFile(filename, data.outputString+'\r\n', function(err){
			if (err){
				event.sender.send('open-save-dialog',{error:err})
			} else {
				storage.incrementFileNo(parseInt(data.fileNo)).then(function(data){
					event.sender.send('get-config', storage.getConfig())
				})
			}
		})
	})
})