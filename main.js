const { app, BrowserWindow, ipcMain } = require('electron');
const { PythonShell } = require("python-shell");
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, 'src_py', '.env') });

// pythonの仮想環境パス
const options = {
    mode: 'text',
    pythonPath: __dirname + './.venv/Scripts/python.exe',
    pythonOptions: ['-u'],
    //scriptPath: __dirname + './src_py',
    env: { ...process.env },
    encoding: 'utf8'
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
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

//ここでpreload.jsからのipc通信を受け取り、python-shellを起動
//pythonで書かれたコードを呼び出す
// ipcMain.handle('send_email', async (event, todos) => {

//     const scriptPath = path.join(__dirname, './src_py/hoge.py');
//     let pyshell = await new PythonShell(scriptPath, options);

//     return ("success");
// });

ipcMain.handle('send_email', async (event, todos) => {
    const scriptPath = path.join(__dirname, './src_py/send_mail.py');
    let pyshell = new PythonShell(scriptPath, options);

    pyshell.on('message', function (message) {
        console.log('Python output:', encoding = 'utf-8', message);
    });

    return new Promise((resolve, reject) => {
        pyshell.end(function (err) {
            if (err) {
                console.error('Python script error:', err);
                reject(err);
            }
            console.log('Python script finished');
            resolve("success");
        });
    });
});

ipcMain.handle('send_manual', async (event, todos) => {

    const scriptPath = path.join(__dirname, './src_py/hoge3.py');
    let pyshell = await new PythonShell(scriptPath, options);

    return ("success");
});



console.log('TODOs file path:', TODOS_FILE);