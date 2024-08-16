const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

const TODOS_FILE = path.join(app.getPath('userData'), 'todos.json');

ipcMain.handle('get-todos', () => {
    if (fs.existsSync(TODOS_FILE)) {
        const data = fs.readFileSync(TODOS_FILE, 'utf-8');
        return JSON.parse(data);
    }
    return [];
});

ipcMain.handle('save-todos', (event, todos) => {
    fs.writeFileSync(TODOS_FILE, JSON.stringify(todos));
});

console.log('TODOs file path:', TODOS_FILE);