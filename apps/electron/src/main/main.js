import { app, BrowserWindow, dialog, ipcMain } from "electron";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  WikiCompiler,
  getBundledResourceNames,
  readTextFile,
  resolveRepositoryResourcePath,
  scanOneLevel
} from "@wikiwise/core";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const packageRoot = path.resolve(currentDir, "..", "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");
const compilersByProjectRoot = new Map();
const wikiHomeRelativePath = "wiki/home.md";

function getResourceManifest() {
  return getBundledResourceNames().map((name) => ({
    name,
    path: resolveRepositoryResourcePath(repositoryRoot, name)
  }));
}

function getCompiler(projectRoot) {
  const resolvedRoot = path.resolve(projectRoot);
  const cached = compilersByProjectRoot.get(resolvedRoot);
  if (cached) return cached;

  const compiler = new WikiCompiler({
    projectRoot: resolvedRoot,
    repositoryRoot
  });
  compilersByProjectRoot.set(resolvedRoot, compiler);
  return compiler;
}

function compileMarkdownFile(projectRoot, filePath) {
  const compiler = getCompiler(projectRoot);

  compiler.scanPages();
  const result = compiler.compileMarkdownFile(filePath);

  return {
    ...result,
    fileUrl: result.outputPath ? pathToFileURL(result.outputPath).href : null
  };
}

function compileWikiHomeIfPresent(projectRoot) {
  const homePath = path.join(projectRoot, ...wikiHomeRelativePath.split("/"));
  if (!fs.existsSync(homePath)) return null;

  const compiled = compileMarkdownFile(projectRoot, homePath);

  return {
    path: homePath,
    name: "home.md",
    content: readTextFile(homePath),
    compiled
  };
}

function createProjectResult(targetPath) {
  const stat = fs.statSync(targetPath);
  const isDirectory = stat.isDirectory();
  const projectRoot = isDirectory ? targetPath : path.dirname(targetPath);
  const tree = scanOneLevel(projectRoot);
  const selectedFile = isDirectory
    ? compileWikiHomeIfPresent(projectRoot)
    : {
        path: targetPath,
        name: path.basename(targetPath),
        content: readTextFile(targetPath)
      };

  return {
    projectRoot,
    projectName: path.basename(projectRoot),
    tree,
    selectedFile
  };
}

async function openExistingProject(browserWindow) {
  const result = await dialog.showOpenDialog(browserWindow, {
    title: "Choose a markdown file or a folder",
    message: "Choose a markdown file or a folder",
    properties: ["openFile", "openDirectory"],
    filters: [
      { name: "Wikiwise files", extensions: ["md", "css", "js", "json", "html"] },
      { name: "All Files", extensions: ["*"] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  return {
    canceled: false,
    project: createProjectResult(result.filePaths[0])
  };
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
ipcMain.handle("wikiwise:openExisting", (event) => {
  return openExistingProject(BrowserWindow.fromWebContents(event.sender));
});
ipcMain.handle("wikiwise:scanProject", (_event, projectPath) => {
  return scanOneLevel(projectPath);
});
ipcMain.handle("wikiwise:readFile", (_event, filePath) => {
  return readTextFile(filePath);
});
ipcMain.handle("wikiwise:compilePage", (_event, payload) => {
  if (!payload?.projectRoot || !payload?.filePath) {
    throw new Error("compilePage requires projectRoot and filePath");
  }

  return compileMarkdownFile(payload.projectRoot, payload.filePath);
});

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

export {
  compileMarkdownFile,
  createMainWindow,
  createProjectResult,
  getResourceManifest,
  openExistingProject
};
