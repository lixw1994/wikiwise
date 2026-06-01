const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("wikiwise", {
  getAppSettings: () => ipcRenderer.invoke("wikiwise:getAppSettings"),
  setAppearanceMode: (mode) => ipcRenderer.invoke("wikiwise:setAppearanceMode", mode),
  restoreLastProject: () => ipcRenderer.invoke("wikiwise:restoreLastProject"),
  openGeneratedPage: (payload) => ipcRenderer.invoke("wikiwise:openGeneratedPage", payload),
  resolvePreviewNavigation: (payload) => ipcRenderer.invoke("wikiwise:resolvePreviewNavigation", payload),
  openExternalUrl: (url) => ipcRenderer.invoke("wikiwise:openExternalUrl", url),
  openExisting: () => ipcRenderer.invoke("wikiwise:openExisting"),
  scanProject: (projectPath) => ipcRenderer.invoke("wikiwise:scanProject", projectPath),
  expandTreeDirectory: (payload) => ipcRenderer.invoke("wikiwise:expandTreeDirectory", payload),
  readFile: (filePath) => ipcRenderer.invoke("wikiwise:readFile", filePath),
  compilePage: (payload) => ipcRenderer.invoke("wikiwise:compilePage", payload),
  getEditorResource: () => ipcRenderer.invoke("wikiwise:getEditorResource"),
  getTerminalResource: () => ipcRenderer.invoke("wikiwise:getTerminalResource"),
  saveFile: (payload) => ipcRenderer.invoke("wikiwise:saveFile", payload),
  setActiveFile: (payload) => ipcRenderer.invoke("wikiwise:setActiveFile", payload),
  getDocumentInfo: (payload) => ipcRenderer.invoke("wikiwise:getDocumentInfo", payload),
  getPublishConfig: (payload) => ipcRenderer.invoke("wikiwise:getPublishConfig", payload),
  checkPublishAvailability: (payload) => ipcRenderer.invoke("wikiwise:checkPublishAvailability", payload),
  publishSite: (payload) => ipcRenderer.invoke("wikiwise:publishSite", payload),
  publishCloudflareHubSite: (payload) => ipcRenderer.invoke("wikiwise:publishCloudflareHubSite", payload),
  unpublishSite: (payload) => ipcRenderer.invoke("wikiwise:unpublishSite", payload),
  getDefaultWikiLocation: () => ipcRenderer.invoke("wikiwise:getDefaultWikiLocation"),
  chooseNewWikiLocation: () => ipcRenderer.invoke("wikiwise:chooseNewWikiLocation"),
  createNewWiki: (payload) => ipcRenderer.invoke("wikiwise:createNewWiki", payload),
  startProjectWatcher: (payload) => ipcRenderer.invoke("wikiwise:startProjectWatcher", payload),
  stopProjectWatcher: () => ipcRenderer.invoke("wikiwise:stopProjectWatcher"),
  startTerminal: (payload) => ipcRenderer.invoke("wikiwise:startTerminal", payload),
  sendTerminalInput: (payload) => ipcRenderer.invoke("wikiwise:sendTerminalInput", payload),
  resizeTerminal: (payload) => ipcRenderer.invoke("wikiwise:resizeTerminal", payload),
  stopTerminal: () => ipcRenderer.invoke("wikiwise:stopTerminal"),
  onProjectChanged: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on("wikiwise:projectChanged", listener);
    return () => ipcRenderer.removeListener("wikiwise:projectChanged", listener);
  },
  onTerminalOutput: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on("wikiwise:terminalOutput", listener);
    return () => ipcRenderer.removeListener("wikiwise:terminalOutput", listener);
  },
  onAppCommand: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on("wikiwise:appCommand", listener);
    return () => ipcRenderer.removeListener("wikiwise:appCommand", listener);
  }
});
