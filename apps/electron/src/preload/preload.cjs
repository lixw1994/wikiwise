const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("wikiwise", {
  resources: () => ipcRenderer.invoke("wikiwise:listResources"),
  openExisting: () => ipcRenderer.invoke("wikiwise:openExisting"),
  scanProject: (projectPath) => ipcRenderer.invoke("wikiwise:scanProject", projectPath),
  readFile: (filePath) => ipcRenderer.invoke("wikiwise:readFile", filePath),
  compilePage: (payload) => ipcRenderer.invoke("wikiwise:compilePage", payload)
});
