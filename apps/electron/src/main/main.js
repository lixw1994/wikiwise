import { app, BrowserWindow, dialog, ipcMain } from "electron";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  WikiCompiler,
  createWikiScaffold,
  getBundledResourceNames,
  readTextFile,
  resolveRepositoryResourcePath,
  scanOneLevel,
  slugForPath,
  summarizeWatchEvents,
  writeActiveFile,
  writeTextFile
} from "@wikiwise/core";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const packageRoot = path.resolve(currentDir, "..", "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");
const compilersByProjectRoot = new Map();
const watchersByWebContents = new Map();
const projectWatcherDebounceMs = 200;
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

function compileMarkdownFile(projectRoot, filePath, options = {}) {
  const compiler = getCompiler(projectRoot);

  if (options.reloadCSS) {
    compiler.reloadCSS();
  }
  compiler.scanPages();
  if (options.invalidate) {
    compiler.invalidatePage(slugForPath(filePath));
  }
  const result = compiler.compileMarkdownFile(filePath);

  return {
    ...result,
    fileUrl: result.outputPath ? pathToFileURL(result.outputPath).href : null
  };
}

function startProjectWatcher(webContents, payload) {
  const projectRoot = typeof payload === "string" ? payload : payload?.projectRoot;
  if (!projectRoot) {
    throw new Error("startProjectWatcher requires projectRoot");
  }
  if (!webContents || webContents.isDestroyed()) {
    throw new Error("startProjectWatcher requires live webContents");
  }

  const resolvedRoot = path.resolve(projectRoot);
  const compiler = getCompiler(resolvedRoot);
  const webContentsId = webContents.id;
  closeProjectWatcher(webContentsId);

  const pendingEvents = [];
  let debounceTimer = null;

  function flushPendingEvents() {
    debounceTimer = null;
    const events = pendingEvents.splice(0);
    const summary = summarizeWatchEvents({
      projectRoot: resolvedRoot,
      outputDir: compiler.outputDir,
      events
    });

    if (!summary) return;

    applyWatchSummary(resolvedRoot, summary);
    if (!webContents.isDestroyed()) {
      webContents.send("wikiwise:projectChanged", {
        projectRoot: resolvedRoot,
        ...summary
      });
    }
  }

  function scheduleFlush() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(flushPendingEvents, projectWatcherDebounceMs);
  }

  const watcher = createProjectWatcher(resolvedRoot, (eventType, filename) => {
    if (!filename) return;

    const eventPath = path.join(resolvedRoot, filename.toString());
    pendingEvents.push({
      path: eventPath,
      eventType,
      removed: !fs.existsSync(eventPath)
    });
    scheduleFlush();
  });

  watchersByWebContents.set(webContentsId, {
    projectRoot: resolvedRoot,
    close: () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      watcher.close();
    }
  });
  webContents.once("destroyed", () => closeProjectWatcher(webContentsId));

  return {
    watching: true,
    projectRoot: resolvedRoot
  };
}

function createProjectWatcher(projectRoot, callback) {
  try {
    return fs.watch(projectRoot, { recursive: true }, callback);
  } catch (error) {
    if (error?.code !== "ERR_FEATURE_UNAVAILABLE_ON_PLATFORM") {
      throw error;
    }
    return fs.watch(projectRoot, callback);
  }
}

function applyWatchSummary(projectRoot, summary) {
  const compiler = getCompiler(projectRoot);

  if (summary.kind === "rebuild") {
    fs.rmSync(path.join(projectRoot, ".rebuild"), { force: true });
    compiler.rescan();
    compiler.invalidateAll();
    return;
  }

  if (summary.kind === "structure") {
    compiler.rescan();
    return;
  }

  if (summary.cssChanged) {
    compiler.reloadCSS();
    compiler.invalidateAll();
  }
  if (summary.changedMarkdownPaths.length > 0) {
    compiler.rescan();
  }
}

function closeProjectWatcher(webContentsId) {
  const watcherRecord = watchersByWebContents.get(webContentsId);
  if (!watcherRecord) return false;

  watcherRecord.close();
  watchersByWebContents.delete(webContentsId);
  return true;
}

function assertProjectPath(projectRoot, filePath) {
  const resolvedRoot = path.resolve(projectRoot);
  const resolvedFilePath = path.resolve(filePath);
  const relativePath = path.relative(resolvedRoot, resolvedFilePath);

  if (
    !relativePath ||
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error("Save target must be inside the current project");
  }

  return resolvedFilePath;
}

function saveFile(payload) {
  if (!payload?.projectRoot || !payload?.filePath || typeof payload.content !== "string") {
    throw new Error("saveFile requires projectRoot, filePath, and content");
  }

  const projectRoot = path.resolve(payload.projectRoot);
  const filePath = assertProjectPath(projectRoot, payload.filePath);
  const write = writeTextFile(filePath, payload.content);
  const activeFile = writeActiveFile(projectRoot, filePath);
  const compiled = isMarkdownFile(filePath)
    ? compileMarkdownFile(projectRoot, filePath, { invalidate: true })
    : null;

  return {
    saved: true,
    path: filePath,
    write,
    activeFile,
    compiled
  };
}

function getDefaultWikiLocation() {
  return path.join(app.getPath("home"), "wikis");
}

async function chooseNewWikiLocation(browserWindow) {
  const result = await dialog.showOpenDialog(browserWindow, {
    title: "Choose where to create your wiki",
    message: "Choose where to create your wiki",
    defaultPath: getDefaultWikiLocation(),
    properties: ["openDirectory", "createDirectory"]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true, path: null };
  }

  return {
    canceled: false,
    path: result.filePaths[0]
  };
}

function createNewWiki(payload) {
  if (!payload?.name || !payload?.parentDir) {
    throw new Error("createNewWiki requires name and parentDir");
  }

  const scaffold = createWikiScaffold({
    repositoryRoot,
    parentDir: payload.parentDir,
    name: payload.name
  });

  return {
    created: true,
    scaffold,
    project: createProjectResult(scaffold.path)
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

  return compileMarkdownFile(payload.projectRoot, payload.filePath, {
    invalidate: Boolean(payload.invalidate),
    reloadCSS: Boolean(payload.reloadCSS)
  });
});
ipcMain.handle("wikiwise:saveFile", (_event, payload) => {
  return saveFile(payload);
});
ipcMain.handle("wikiwise:getDefaultWikiLocation", () => {
  return getDefaultWikiLocation();
});
ipcMain.handle("wikiwise:chooseNewWikiLocation", (event) => {
  return chooseNewWikiLocation(BrowserWindow.fromWebContents(event.sender));
});
ipcMain.handle("wikiwise:createNewWiki", (_event, payload) => {
  return createNewWiki(payload);
});
ipcMain.handle("wikiwise:startProjectWatcher", (event, payload) => {
  return startProjectWatcher(event.sender, payload);
});
ipcMain.handle("wikiwise:stopProjectWatcher", (event) => {
  return {
    stopped: closeProjectWatcher(event.sender.id)
  };
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
  applyWatchSummary,
  assertProjectPath,
  closeProjectWatcher,
  compileMarkdownFile,
  createNewWiki,
  createMainWindow,
  createProjectResult,
  chooseNewWikiLocation,
  getDefaultWikiLocation,
  getResourceManifest,
  openExistingProject,
  saveFile,
  startProjectWatcher
};

function isMarkdownFile(filePath) {
  return /\.md$/i.test(filePath);
}
