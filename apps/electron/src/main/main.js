import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getBundledResourceNames,
  resolveRepositoryResourcePath
} from "@wikiwise/core";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const packageRoot = path.resolve(currentDir, "..", "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");

function getResourceManifest() {
  return getBundledResourceNames().map((name) => ({
    name,
    path: resolveRepositoryResourcePath(repositoryRoot, name)
  }));
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 860,
    minHeight: 560,
    title: "Wikiwise Electron",
    webPreferences: {
      preload: path.join(packageRoot, "src", "preload", "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.loadFile(path.join(packageRoot, "src", "renderer", "index.html"));
  return mainWindow;
}

ipcMain.handle("wikiwise:listResources", () => getResourceManifest());

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

export { createMainWindow, getResourceManifest };
