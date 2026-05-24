const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("wikiwise", {
  resources: () => ipcRenderer.invoke("wikiwise:listResources"),
  openExisting: () => ipcRenderer.invoke("wikiwise:openExisting"),
  scanProject: (projectPath) => ipcRenderer.invoke("wikiwise:scanProject", projectPath),
  readFile: (filePath) => ipcRenderer.invoke("wikiwise:readFile", filePath),
  compilePage: (payload) => ipcRenderer.invoke("wikiwise:compilePage", payload),
  saveFile: (payload) => ipcRenderer.invoke("wikiwise:saveFile", payload),
  getDefaultWikiLocation: () => ipcRenderer.invoke("wikiwise:getDefaultWikiLocation"),
  chooseNewWikiLocation: () => ipcRenderer.invoke("wikiwise:chooseNewWikiLocation"),
  createNewWiki: (payload) => ipcRenderer.invoke("wikiwise:createNewWiki", payload),
  startProjectWatcher: (payload) => ipcRenderer.invoke("wikiwise:startProjectWatcher", payload),
  stopProjectWatcher: () => ipcRenderer.invoke("wikiwise:stopProjectWatcher"),
  onProjectChanged: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on("wikiwise:projectChanged", listener);
    return () => ipcRenderer.removeListener("wikiwise:projectChanged", listener);
  }
});
