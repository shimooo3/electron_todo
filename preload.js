const { contextBridge, ipcRenderer } = require('electron')

// main.jsに書かれた'send_email'handleを呼び出す
contextBridge.exposeInMainWorld('myapi', {
    send: async (data) => await ipcRenderer.invoke('send_email', data),
})
