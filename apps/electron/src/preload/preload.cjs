const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("wikiwise", {
  resources: () => ipcRenderer.invoke("wikiwise:listResources")
});
