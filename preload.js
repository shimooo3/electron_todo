const { contextBridge, ipcRenderer } = require('electron')

// main.jsに書かれた'send_email'handleを呼び出す
contextBridge.exposeInMainWorld('myapi', {
    send: async (data) => await ipcRenderer.invoke('send_email', data),
    get_msg: async (data) => await ipcRenderer.invoke('get_msg', data),
    send_manual: async (data) => await ipcRenderer.invoke('send_manual', data),
})
