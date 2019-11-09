import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

// const exec = require('child_process').exec;
let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');
const Path = require('path');
const icon = Path.resolve(__dirname, 'src', 'assets', 'icon.png');

function createWindow() {

	const electronScreen = screen;
	const size = electronScreen.getPrimaryDisplay().workAreaSize;

	// Create the browser window.
	win = new BrowserWindow({
		x: 100,
		y: 100,
		// width: size.width,
		// height: size.height
		width: 2000,
		height: 1000,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false
		},
		icon: icon
	});

	if (serve) {
		require('electron-reload')(__dirname, {
			electron: require(`${__dirname}/node_modules/electron`)
		});
		win.loadURL('http://localhost:4200');
	} else {
		win.loadURL(url.format({
			pathname: path.join(__dirname, 'dist/index.html'),
			protocol: 'file:',
			slashes: true
		}));
	}

	if (serve) {
		setTimeout(() => win.webContents.openDevTools(), 100);
	}

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store window
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;

		if (serve) {
			// exec('taskkill /F /im node.exe');
		}
	});

}

try {

	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.on('ready', createWindow);

	// Quit when all windows are closed.
	app.on('window-all-closed', () => {
		// On OS X it is common for applications and their menu bar
		// to stay active until the user quits explicitly with Cmd + Q
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', () => {
		// On OS X it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (win === null) {
			createWindow();
		}
	});

} catch (e) {
	// Catch Error
	// throw e;
}
