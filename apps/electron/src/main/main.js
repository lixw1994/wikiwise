import { app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, nativeTheme, shell } from "electron";
import * as pty from "node-pty";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  WikiCompiler,
  checkPublishAvailability,
  createWikiScaffold,
  expandTreeDirectory,
  loadPublishConfig,
  publishSite,
  randomPublishSubdomain,
  readDisplayTextFile,
  readTextFile,
  scanOneLevel,
  slugForPath,
  summarizeDocumentInfo,
  summarizeWatchEvents,
  unpublishSite,
  writeActiveFile,
  writeTextFile
} from "@wikiwise/core";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const packageRoot = path.resolve(currentDir, "..", "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");
const requireFromMain = createRequire(import.meta.url);
const compilersByProjectRoot = new Map();
const watchersByWebContents = new Map();
const terminalSessionsByWebContents = new Map();
const projectRootsByWebContents = new Map();
const backgroundCompilationJobsByProjectRoot = new Map();
const startupRestoreByWebContentsId = new Map();
let mainWindowCreationCount = 0;
const projectWatcherDebounceMs = 200;
const backgroundCompilationBatchSize = 3;
const backgroundCompilationIntervalMs = 100;
const wikiHomeRelativePath = "wiki/home.md";
const nativeResourcesRoot = path.join(repositoryRoot, "Sources", "Wikiwise", "Resources");
const nativeAppIconPath = path.join(nativeResourcesRoot, "Wikiwise.icns");
const nativeWindowDefaultSize = Object.freeze({ width: 1500, height: 1000 });
const nativeWindowMinimumSize = Object.freeze({ width: 800, height: 500 });
const nativeBroadcastAppCommands = new Set(["goBack", "goForward", "refreshWiki"]);
const terminalRuntimeDependencies = Object.freeze(["node-pty", "@xterm/xterm", "@xterm/addon-fit"]);
const defaultAppSettings = Object.freeze({
  appearanceMode: "Auto",
  lastFolderPath: ""
});
const generatedPageNames = new Set(["map-3d.html", "map.html", "graph.html", "index.html", "catalog.html"]);
const isRuntimeAudit = process.argv.includes("--audit-runtime");
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

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

function stopBackgroundCompilation(projectRoot) {
  const resolvedRoot = path.resolve(projectRoot);
  const job = backgroundCompilationJobsByProjectRoot.get(resolvedRoot);
  if (!job) return false;

  clearInterval(job.timer);
  backgroundCompilationJobsByProjectRoot.delete(resolvedRoot);
  return true;
}

function setWebContentsProjectRoot(webContents, projectRoot) {
  if (!webContents || webContents.isDestroyed?.()) {
    return {
      registered: false,
      projectRoot: null,
      stoppedPreviousBackgroundCompilation: false
    };
  }

  const webContentsId = webContents.id;
  const previousRoot = projectRootsByWebContents.get(webContentsId);
  const nextRoot = projectRoot ? path.resolve(projectRoot) : null;
  let stoppedPreviousBackgroundCompilation = false;
  if (previousRoot && previousRoot !== nextRoot) {
    stoppedPreviousBackgroundCompilation = stopBackgroundCompilation(previousRoot);
  }

  if (nextRoot) {
    projectRootsByWebContents.set(webContentsId, nextRoot);
  } else {
    projectRootsByWebContents.delete(webContentsId);
  }

  return {
    registered: true,
    webContentsId,
    previousRoot: previousRoot ?? null,
    projectRoot: nextRoot,
    stoppedPreviousBackgroundCompilation
  };
}

function stopBackgroundCompilationForWebContents(webContentsId) {
  const projectRoot = projectRootsByWebContents.get(webContentsId);
  if (!projectRoot) return false;

  projectRootsByWebContents.delete(webContentsId);
  return stopBackgroundCompilation(projectRoot);
}

function closeWindowScopedResources(webContentsId) {
  const watcherStopped = closeProjectWatcher(webContentsId);
  const backgroundCompilationStopped = stopBackgroundCompilationForWebContents(webContentsId);
  const terminalStopped = closeTerminal(webContentsId);

  return {
    watcherStopped,
    backgroundCompilationStopped,
    terminalStopped
  };
}

function startBackgroundCompilation(projectRoot) {
  const resolvedRoot = path.resolve(projectRoot);
  if (!fs.existsSync(resolvedRoot) || !fs.statSync(resolvedRoot).isDirectory()) {
    return { started: false, projectRoot: resolvedRoot };
  }

  const compiler = getCompiler(resolvedRoot);
  stopBackgroundCompilation(resolvedRoot);

  const job = {
    projectRoot: resolvedRoot,
    batches: 0,
    remaining: null,
    timer: null
  };
  job.timer = setInterval(() => {
    try {
      const remaining = compiler.compileNextBatch(backgroundCompilationBatchSize);
      job.batches += 1;
      job.remaining = remaining;
      if (remaining <= 0) {
        stopBackgroundCompilation(resolvedRoot);
      }
    } catch (error) {
      console.error(error instanceof Error ? error.stack : String(error));
      stopBackgroundCompilation(resolvedRoot);
    }
  }, backgroundCompilationIntervalMs);
  job.timer.unref?.();
  backgroundCompilationJobsByProjectRoot.set(resolvedRoot, job);

  return {
    started: true,
    projectRoot: resolvedRoot,
    batchSize: backgroundCompilationBatchSize,
    intervalMs: backgroundCompilationIntervalMs
  };
}

function compileMarkdownFile(projectRoot, filePath, options = {}) {
  const compiler = getCompiler(projectRoot);

  if (options.reloadCSS) {
    compiler.reloadCSS();
  }
  if (options.invalidate) {
    compiler.invalidatePage(slugForPath(filePath));
  }
  const result = compiler.compileMarkdownFile(filePath);
  startBackgroundCompilation(projectRoot);

  return {
    ...result,
    fileUrl: result.outputPath ? pathToFileURL(result.outputPath).href : null
  };
}

function settingsPath() {
  return path.join(app.getPath("userData"), "settings.json");
}

function readAppSettings() {
  try {
    const parsed = JSON.parse(readTextFile(settingsPath()));
    return normalizeAppSettings(parsed);
  } catch {
    return { ...defaultAppSettings };
  }
}

function writeAppSettings(nextSettings) {
  const settings = normalizeAppSettings(nextSettings);
  writeTextFile(settingsPath(), `${JSON.stringify(settings, null, 2)}\n`);
  return settings;
}

function updateAppSettings(patch) {
  return writeAppSettings({
    ...readAppSettings(),
    ...patch
  });
}

function normalizeAppSettings(settings) {
  const appearanceMode = ["Auto", "Light", "Dark"].includes(settings?.appearanceMode)
    ? settings.appearanceMode
    : defaultAppSettings.appearanceMode;

  return {
    appearanceMode,
    lastFolderPath: typeof settings?.lastFolderPath === "string"
      ? settings.lastFolderPath
      : defaultAppSettings.lastFolderPath
  };
}

function applyAppearanceMode(mode) {
  nativeTheme.themeSource = mode === "Dark" ? "dark" : mode === "Light" ? "light" : "system";
  return mode;
}

function applyNativeActivationPolicy() {
  app.setActivationPolicy?.("regular");
  app.focus({ steal: true });
  return true;
}

function resolveNativeAppIconPath() {
  return fs.existsSync(nativeAppIconPath) ? nativeAppIconPath : null;
}

function extractLargestPngFromIcns(iconBuffer) {
  if (!Buffer.isBuffer(iconBuffer) || iconBuffer.length < 16) return null;
  if (iconBuffer.toString("ascii", 0, 4) !== "icns") return null;

  let largestPng = null;
  let offset = 8;
  while (offset + 8 <= iconBuffer.length) {
    const entryLength = iconBuffer.readUInt32BE(offset + 4);
    if (entryLength < 8 || offset + entryLength > iconBuffer.length) {
      return largestPng ? Buffer.from(largestPng) : null;
    }

    const payload = iconBuffer.subarray(offset + 8, offset + entryLength);
    if (payload.subarray(0, pngSignature.length).equals(pngSignature)) {
      if (!largestPng || payload.length > largestPng.length) {
        largestPng = payload;
      }
    }
    offset += entryLength;
  }

  return largestPng ? Buffer.from(largestPng) : null;
}

function createNativeAppIcon() {
  const appIconPath = resolveNativeAppIconPath();
  if (!appIconPath) return null;

  try {
    const pngBuffer = extractLargestPngFromIcns(fs.readFileSync(appIconPath));
    const appIcon = pngBuffer
      ? nativeImage.createFromBuffer(pngBuffer)
      : nativeImage.createFromPath(appIconPath);

    return appIcon.isEmpty() ? null : appIcon;
  } catch {
    return null;
  }
}

function applyNativeAppIcon() {
  const appIcon = createNativeAppIcon();
  if (!appIcon) return false;

  app.dock?.setIcon(appIcon);
  return true;
}

function setAppearanceMode(mode) {
  const settings = updateAppSettings({ appearanceMode: mode });
  applyAppearanceMode(settings.appearanceMode);
  return settings;
}

function rememberProjectRoot(projectRoot) {
  const resolvedRoot = assertProjectRoot(projectRoot);
  return updateAppSettings({ lastFolderPath: resolvedRoot });
}

function restoreLastProject(webContents = null) {
  const settings = readAppSettings();
  if (!settings.lastFolderPath || !fs.existsSync(settings.lastFolderPath)) {
    return null;
  }

  const stat = fs.statSync(settings.lastFolderPath);
  if (!stat.isDirectory()) {
    return null;
  }

  return createProjectResult(settings.lastFolderPath, webContents);
}

function restoreLastProjectForWebContents(webContents) {
  if (!startupRestoreByWebContentsId.get(webContents?.id)) return null;

  return restoreLastProject(webContents);
}

function openGeneratedPage(payload) {
  if (!payload?.projectRoot || !payload?.pageName) {
    throw new Error("openGeneratedPage requires projectRoot and pageName");
  }
  if (!generatedPageNames.has(payload.pageName)) {
    throw new Error("Generated page is not allowed");
  }

  const projectRoot = assertProjectRoot(payload.projectRoot);
  const compiler = getCompiler(projectRoot);

  const pagePath = path.join(compiler.outputDir, payload.pageName);
  if (!fs.existsSync(pagePath)) return null;

  return {
    kind: "generated",
    name: payload.pageName,
    path: pagePath,
    fileUrl: pathToFileURL(pagePath).href
  };
}

function resolveNodePackageRoot(packageName) {
  const resolvedEntry = requireFromMain.resolve(packageName);
  let directory = path.dirname(resolvedEntry);
  const root = path.parse(directory).root;

  while (directory !== root) {
    const manifestPath = path.join(directory, "package.json");
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      if (manifest.name === packageName) {
        return directory;
      }
    }
    directory = path.dirname(directory);
  }

  throw new Error(`Unable to resolve package root for ${packageName}`);
}

function getTerminalResource() {
  const xtermRoot = resolveNodePackageRoot("@xterm/xterm");
  const fitRoot = resolveNodePackageRoot("@xterm/addon-fit");
  const xtermScriptPath = requireFromMain.resolve("@xterm/xterm");
  const fitScriptPath = requireFromMain.resolve("@xterm/addon-fit");
  const xtermCssPath = path.join(xtermRoot, "css", "xterm.css");

  for (const resourcePath of [xtermScriptPath, fitScriptPath, xtermCssPath]) {
    if (!fs.existsSync(resourcePath)) {
      throw new Error(`Missing bundled terminal resource: ${resourcePath}`);
    }
  }

  return {
    xtermRoot,
    fitRoot,
    xtermScriptUrl: pathToFileURL(xtermScriptPath).href,
    fitScriptUrl: pathToFileURL(fitScriptPath).href,
    xtermCssUrl: pathToFileURL(xtermCssPath).href
  };
}

function getEditorResource() {
  const editorPath = path.join(nativeResourcesRoot, "editor.html");
  const codeMirrorBundlePath = path.join(nativeResourcesRoot, "codemirror-bundle.js");

  if (!fs.existsSync(editorPath) || !fs.existsSync(codeMirrorBundlePath)) {
    throw new Error("Missing bundled CodeMirror editor resources.");
  }

  return {
    path: editorPath,
    fileUrl: pathToFileURL(editorPath).href,
    bundlePath: codeMirrorBundlePath
  };
}

function resolvePreviewNavigation(payload) {
  if (!payload?.projectRoot || !payload?.url) {
    throw new Error("resolvePreviewNavigation requires projectRoot and url");
  }

  const projectRoot = assertProjectRoot(payload.projectRoot);
  const targetUrl = new URL(payload.url);

  if (targetUrl.protocol === "http:" || targetUrl.protocol === "https:") {
    return {
      kind: "external",
      url: targetUrl.href
    };
  }

  if (targetUrl.protocol !== "file:") {
    return null;
  }

  const targetPath = fileURLToPath(targetUrl);
  const pageSlug = markdownSlugForPath(targetPath);
  if (!pageSlug) return null;

  const markdownFile = findMarkdownFileForSlug(projectRoot, pageSlug);
  if (markdownFile) {
    return {
      kind: "file",
      path: markdownFile,
      name: path.basename(markdownFile)
    };
  }

  const compiler = getCompiler(projectRoot);
  const pageName = `${pageSlug}.html`;
  const generatedPath = path.join(compiler.outputDir, pageName);
  if (!fs.existsSync(generatedPath)) return null;

  return generatedPageResult(generatedPath);
}

function findMarkdownFileForSlug(projectRoot, slug) {
  const searchDirs = [
    path.join(projectRoot, "wiki"),
    path.join(projectRoot, "raw"),
    projectRoot
  ];

  for (const searchDir of searchDirs) {
    let entries = [];
    try {
      entries = fs.readdirSync(searchDir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isFile() || !isPreviewMarkdownLookupCandidate(entry.name)) continue;

      const filePath = path.join(searchDir, entry.name);
      if (markdownSlugForPath(filePath) === slug) {
        return filePath;
      }
    }
  }

  return null;
}

function markdownSlugForPath(filePath) {
  return path.basename(filePath, path.extname(filePath)).toLowerCase().replace(/ /g, "-");
}

function isPreviewMarkdownLookupCandidate(filePath) {
  return path.extname(filePath) === ".md";
}

function generatedPageResult(pagePath) {
  return {
    kind: "generated",
    name: path.basename(pagePath),
    path: pagePath,
    fileUrl: pathToFileURL(pagePath).href
  };
}

async function openExternalUrl(url) {
  const targetUrl = new URL(url);
  if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
    throw new Error("Only http and https URLs can be opened externally");
  }

  await shell.openExternal(targetUrl.href);
  return {
    opened: true,
    url: targetUrl.href
  };
}

function sendAppCommand(command) {
  if (!nativeBroadcastAppCommands.has(command)) return false;

  const targetWindows = BrowserWindow.getAllWindows();
  let sentCommand = false;

  for (const targetWindow of targetWindows) {
    if (!targetWindow || targetWindow.webContents.isDestroyed()) continue;
    targetWindow.webContents.send("wikiwise:appCommand", { command });
    sentCommand = true;
  }

  return sentCommand;
}

function createApplicationMenu() {
  const template = [
    ...(process.platform === "darwin"
      ? [{
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" }
          ]
        }]
      : []),
    {
      label: "File",
      submenu: [
        {
          label: "New Window",
          accelerator: "CommandOrControl+N",
          click: () => createMainWindow()
        },
        { type: "separator" },
        {
          label: "Go Back",
          accelerator: "CommandOrControl+[",
          click: () => sendAppCommand("goBack")
        },
        {
          label: "Go Forward",
          accelerator: "CommandOrControl+]",
          click: () => sendAppCommand("goForward")
        },
        { type: "separator" },
        {
          label: "Refresh Page",
          accelerator: "CommandOrControl+R",
          click: () => sendAppCommand("refreshWiki")
        },
        { type: "separator" },
        { role: "close" }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "pasteAndMatchStyle" },
        { role: "delete" },
        { type: "separator" },
        { role: "selectAll" }
      ]
    },
    {
      label: "View",
      submenu: [{ role: "togglefullscreen" }]
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        { type: "separator" },
        { role: "front" }
      ]
    }
  ];

  return Menu.buildFromTemplate(template);
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
  setWebContentsProjectRoot(webContents, resolvedRoot);
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
    startBackgroundCompilation(projectRoot);
    return;
  }

  if (summary.kind === "structure") {
    compiler.rescan();
    startBackgroundCompilation(projectRoot);
    return;
  }

  if (summary.cssChanged) {
    compiler.reloadCSS();
    compiler.invalidateAll();
    startBackgroundCompilation(projectRoot);
  }
  if (summary.changedMarkdownPaths.length > 0) {
    compiler.rescan();
    startBackgroundCompilation(projectRoot);
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

function assertProjectRoot(projectRoot) {
  const resolvedRoot = path.resolve(projectRoot);
  const stat = fs.statSync(resolvedRoot);
  if (!stat.isDirectory()) {
    throw new Error("Project root must be a directory");
  }
  return resolvedRoot;
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

function setActiveFile(payload) {
  if (!payload?.projectRoot || !payload?.filePath) {
    throw new Error("setActiveFile requires projectRoot and filePath");
  }

  const projectRoot = assertProjectRoot(payload.projectRoot);
  const filePath = assertProjectPath(projectRoot, payload.filePath);
  return writeActiveFile(projectRoot, filePath);
}

function getDocumentInfo(payload) {
  if (!payload?.projectRoot || !payload?.filePath) {
    throw new Error("getDocumentInfo requires projectRoot and filePath");
  }

  const projectRoot = path.resolve(payload.projectRoot);
  const filePath = assertProjectPath(projectRoot, payload.filePath);
  return summarizeDocumentInfo(filePath);
}

function expandProjectTreeDirectory(payload) {
  if (!payload?.projectRoot || !payload?.directoryPath) {
    throw new Error("expandTreeDirectory requires projectRoot and directoryPath");
  }

  const projectRoot = assertProjectRoot(payload.projectRoot);
  const directoryPath = assertProjectPath(projectRoot, payload.directoryPath);
  return expandTreeDirectory(projectRoot, directoryPath);
}

function getPublishConfig(payload) {
  if (!payload?.projectRoot) {
    throw new Error("getPublishConfig requires projectRoot");
  }

  const projectRoot = assertProjectRoot(payload.projectRoot);
  function unpublishedPublishConfig(projectRoot) {
    const suggestedSubdomain = randomPublishSubdomain(path.basename(projectRoot));
    return {
      published: false,
      subdomain: "",
      suggestedSubdomain,
      url: "",
      lastPublishedAt: null
    };
  }

  let config;
  try {
    config = loadPublishConfig(projectRoot);
  } catch (error) {
    if (error?.code === "corrupt_config") {
      return unpublishedPublishConfig(projectRoot);
    }
    throw error;
  }

  if (config) {
    return {
      published: true,
      subdomain: config.subdomain,
      url: config.url,
      lastPublishedAt: config.lastPublishedAt ?? null
    };
  }

  return unpublishedPublishConfig(projectRoot);
}

async function checkProjectPublishAvailability(payload) {
  if (!payload?.projectRoot || !payload?.subdomain) {
    throw new Error("checkPublishAvailability requires projectRoot and subdomain");
  }

  const projectRoot = assertProjectRoot(payload.projectRoot);
  const config = loadPublishConfig(projectRoot);
  return {
    availability: await checkPublishAvailability(payload.subdomain, {
      token: config?.token
    })
  };
}

async function publishProject(payload) {
  if (!payload?.projectRoot) {
    throw new Error("publishSite requires projectRoot");
  }

  const projectRoot = assertProjectRoot(payload.projectRoot);
  const compiler = getCompiler(projectRoot);
  compiler.compileAll();

  return publishSite({
    projectRoot,
    siteFolder: compiler.outputDir,
    subdomain: payload.subdomain
  });
}

async function unpublishProject(payload) {
  if (!payload?.projectRoot) {
    throw new Error("unpublishSite requires projectRoot");
  }

  return unpublishSite({
    projectRoot: assertProjectRoot(payload.projectRoot)
  });
}

function resolveNodePtyPrebuildSpawnHelperPaths(nodePtyRoot) {
  const prebuildsPath = path.join(nodePtyRoot, "prebuilds");
  if (!fs.existsSync(prebuildsPath)) {
    return [];
  }

  const prebuildEntries = fs.readdirSync(prebuildsPath, { withFileTypes: true });
  return prebuildEntries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("darwin-"))
    .map((entry) => path.join(prebuildsPath, entry.name, "spawn-helper"))
    .filter((helperPath) => fs.existsSync(helperPath));
}

function resolveNodePtySpawnHelperPaths() {
  if (process.platform === "win32") {
    return [];
  }

  let nodePtyRoot;
  try {
    nodePtyRoot = path.dirname(requireFromMain.resolve("node-pty/package.json"));
  } catch {
    return [];
  }

  const helperCandidates = [
    path.join(nodePtyRoot, "build", "Release", "spawn-helper"),
    path.join(nodePtyRoot, "build", "Debug", "spawn-helper"),
    ...resolveNodePtyPrebuildSpawnHelperPaths(nodePtyRoot)
  ];

  return helperCandidates.filter((helperPath) => fs.existsSync(helperPath));
}

function ensureNodePtySpawnHelperExecutable() {
  if (process.platform === "win32") {
    return {
      checked: false,
      fixed: false,
      helperPath: null,
      helperPaths: []
    };
  }

  const helperPaths = resolveNodePtySpawnHelperPaths();
  if (helperPaths.length === 0) {
    return {
      checked: false,
      fixed: false,
      helperPath: null,
      helperPaths
    };
  }

  try {
    let fixed = false;
    for (const helperPath of helperPaths) {
      const stat = fs.statSync(helperPath);
      if ((stat.mode & 0o111) !== 0) {
        continue;
      }

      fs.chmodSync(helperPath, stat.mode | 0o111);
      fixed = true;
    }

    return {
      checked: true,
      fixed,
      helperPath: helperPaths[0],
      helperPaths
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to make node-pty spawn helper executable: ${message}`);
  }
}

function startTerminal(webContents, payload) {
  const projectRoot = typeof payload === "string" ? payload : payload?.projectRoot;
  if (!projectRoot) {
    throw new Error("startTerminal requires projectRoot");
  }
  if (!webContents || webContents.isDestroyed()) {
    throw new Error("startTerminal requires live webContents");
  }

  const webContentsId = webContents.id;
  const existingTerminal = terminalSessionsByWebContents.get(webContentsId);
  if (existingTerminal) {
    const { cols, rows } = normalizeTerminalSize(payload);
    if (cols !== existingTerminal.cols || rows !== existingTerminal.rows) {
      existingTerminal.process.resize(cols, rows);
      existingTerminal.cols = cols;
      existingTerminal.rows = rows;
    }
    return {
      started: false,
      reused: true,
      projectRoot: existingTerminal.projectRoot,
      shell: existingTerminal.shell,
      pty: true,
      cols: existingTerminal.cols,
      rows: existingTerminal.rows
    };
  }

  const resolvedRoot = path.resolve(projectRoot);
  const stat = fs.statSync(resolvedRoot);
  if (!stat.isDirectory()) {
    throw new Error("startTerminal requires a project directory");
  }

  const { cols, rows } = normalizeTerminalSize(payload);
  const shellPath = process.env.SHELL || process.env.ComSpec || (process.platform === "win32" ? "cmd.exe" : "/bin/zsh");
  const shellArgs = loginShellArgs();
  const shell = path.basename(shellPath);
  ensureNodePtySpawnHelperExecutable();
  const ptyProcess = pty.spawn(shellPath, shellArgs, {
    name: "xterm-256color",
    cols,
    rows,
    cwd: resolvedRoot,
    env: {
      ...process.env,
      TERM: "xterm-256color",
      COLORTERM: "truecolor"
    }
  });

  const session = {
    projectRoot: resolvedRoot,
    process: ptyProcess,
    shell,
    cols,
    rows
  };
  terminalSessionsByWebContents.set(webContentsId, session);

  function sendOutput(source, chunk) {
    if (webContents.isDestroyed()) return;
    webContents.send("wikiwise:terminalOutput", {
      projectRoot: resolvedRoot,
      source,
      data: String(chunk)
    });
  }

  ptyProcess.onData((data) => sendOutput("pty", data));
  ptyProcess.onExit(({ exitCode, signal }) => {
    const current = terminalSessionsByWebContents.get(webContentsId);
    if (current?.process === ptyProcess) {
      terminalSessionsByWebContents.delete(webContentsId);
    }
    sendOutput("system", `\r\n[process exited ${signal ?? exitCode ?? 0}]\r\n`);
  });
  webContents.once("destroyed", () => closeTerminal(webContentsId));

  return {
    started: true,
    projectRoot: resolvedRoot,
    shell,
    pty: true,
    cols,
    rows
  };
}

function loginShellArgs() {
  if (process.platform === "win32") {
    return [];
  }

  return ["-l"];
}

function normalizeTerminalSize(payload) {
  return {
    cols: clampTerminalDimension(payload?.cols, 80, 20, 300),
    rows: clampTerminalDimension(payload?.rows, 24, 8, 120)
  };
}

function clampTerminalDimension(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(parsed)));
}

function sendTerminalInput(webContents, payload) {
  const session = terminalSessionsByWebContents.get(webContents.id);
  if (!session) {
    throw new Error("No terminal is running for this window");
  }

  const input = String(payload?.input ?? "");
  if (!input) {
    return { sent: false };
  }

  session.process.write(input);
  return { sent: true };
}

function resizeTerminal(webContents, payload) {
  const session = terminalSessionsByWebContents.get(webContents.id);
  if (!session) {
    return { resized: false };
  }

  const { cols, rows } = normalizeTerminalSize(payload);
  session.process.resize(cols, rows);
  session.cols = cols;
  session.rows = rows;
  return { resized: true, cols, rows };
}

function closeTerminal(webContentsId) {
  const session = terminalSessionsByWebContents.get(webContentsId);
  if (!session) return false;

  terminalSessionsByWebContents.delete(webContentsId);
  session.process.kill();
  return true;
}

function getDefaultWikiLocation() {
  return path.join(app.getPath("home"), "wikis");
}

async function chooseNewWikiLocation(browserWindow) {
  const result = await dialog.showOpenDialog(browserWindow, {
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

function createNewWiki(payload, webContents = null) {
  if (!payload?.name || !payload?.parentDir) {
    throw new Error("createNewWiki requires name and parentDir");
  }

  const scaffold = createWikiScaffold({
    repositoryRoot,
    parentDir: payload.parentDir,
    name: payload.name
  });
  rememberProjectRoot(scaffold.path);

  return {
    created: true,
    scaffold,
    project: createProjectResult(scaffold.path, webContents)
  };
}

function compileWikiHomeIfPresent(projectRoot) {
  const homePath = path.join(projectRoot, ...wikiHomeRelativePath.split("/"));
  if (!fs.existsSync(homePath)) return null;

  const compiled = compileMarkdownFile(projectRoot, homePath);

  return {
    path: homePath,
    name: "home.md",
    content: readDisplayTextFile(homePath),
    compiled
  };
}

function createProjectResult(targetPath, webContents = null) {
  const stat = fs.statSync(targetPath);
  const isDirectory = stat.isDirectory();
  const projectKind = isDirectory ? "folder" : "file";
  const projectRoot = isDirectory ? targetPath : path.dirname(targetPath);
  if (isDirectory) {
    setWebContentsProjectRoot(webContents, projectRoot);
    getCompiler(projectRoot).scanPages();
  }
  const tree = isDirectory ? scanOneLevel(projectRoot) : [];
  const selectedFile = isDirectory
    ? compileWikiHomeIfPresent(projectRoot)
    : {
        path: targetPath,
        name: path.basename(targetPath),
        content: readDisplayTextFile(targetPath)
      };
  if (isDirectory) {
    startBackgroundCompilation(projectRoot);
  }

  return {
    projectRoot,
    projectKind,
    projectName: path.basename(projectRoot),
    tree,
    selectedFile
  };
}

async function openExistingProject(browserWindow) {
  const result = await dialog.showOpenDialog(browserWindow, {
    message: "Choose a markdown file or a folder",
    properties: ["openFile", "openDirectory"],
    filters: [
      { name: "Markdown or text files", extensions: ["md", "markdown", "txt", "text"] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }
  const targetPath = result.filePaths[0];
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    rememberProjectRoot(targetPath);
  }

  return {
    canceled: false,
    project: createProjectResult(targetPath, browserWindow?.webContents)
  };
}

function createMainWindow() {
  const shouldRestoreLastProject = mainWindowCreationCount === 0;
  mainWindowCreationCount += 1;

  const appIcon = createNativeAppIcon();
  const mainWindow = new BrowserWindow({
    width: nativeWindowDefaultSize.width,
    height: nativeWindowDefaultSize.height,
    minWidth: nativeWindowMinimumSize.width,
    minHeight: nativeWindowMinimumSize.height,
    title: "Wikiwise",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 12, y: 13 },
    ...(appIcon ? { icon: appIcon } : {}),
    webPreferences: {
      preload: path.join(packageRoot, "src", "preload", "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  const webContentsId = mainWindow.webContents.id;
  startupRestoreByWebContentsId.set(webContentsId, shouldRestoreLastProject);
  mainWindow.webContents.once("destroyed", () => {
    closeWindowScopedResources(webContentsId);
    startupRestoreByWebContentsId.delete(webContentsId);
  });

  mainWindow.loadFile(path.join(packageRoot, "src", "renderer", "index.html"));
  return mainWindow;
}

ipcMain.handle("wikiwise:getAppSettings", () => {
  return readAppSettings();
});
ipcMain.handle("wikiwise:setAppearanceMode", (_event, mode) => {
  return setAppearanceMode(mode);
});
ipcMain.handle("wikiwise:restoreLastProject", (event) => {
  return restoreLastProjectForWebContents(event.sender);
});
ipcMain.handle("wikiwise:openGeneratedPage", (_event, payload) => {
  return openGeneratedPage(payload);
});
ipcMain.handle("wikiwise:resolvePreviewNavigation", (_event, payload) => {
  return resolvePreviewNavigation(payload);
});
ipcMain.handle("wikiwise:openExternalUrl", (_event, url) => {
  return openExternalUrl(url);
});
ipcMain.handle("wikiwise:openExisting", (event) => {
  return openExistingProject(BrowserWindow.fromWebContents(event.sender));
});
ipcMain.handle("wikiwise:scanProject", (_event, projectPath) => {
  return scanOneLevel(projectPath);
});
ipcMain.handle("wikiwise:expandTreeDirectory", (_event, payload) => {
  return expandProjectTreeDirectory(payload);
});
ipcMain.handle("wikiwise:readFile", (_event, filePath) => {
  return readDisplayTextFile(filePath);
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
ipcMain.handle("wikiwise:getEditorResource", () => {
  return getEditorResource();
});
ipcMain.handle("wikiwise:getTerminalResource", () => {
  return getTerminalResource();
});
ipcMain.handle("wikiwise:saveFile", (_event, payload) => {
  return saveFile(payload);
});
ipcMain.handle("wikiwise:setActiveFile", (_event, payload) => {
  return setActiveFile(payload);
});
ipcMain.handle("wikiwise:getDocumentInfo", (_event, payload) => {
  return getDocumentInfo(payload);
});
ipcMain.handle("wikiwise:getPublishConfig", (_event, payload) => {
  return getPublishConfig(payload);
});
ipcMain.handle("wikiwise:checkPublishAvailability", (_event, payload) => {
  return checkProjectPublishAvailability(payload);
});
ipcMain.handle("wikiwise:publishSite", (_event, payload) => {
  return publishProject(payload);
});
ipcMain.handle("wikiwise:unpublishSite", (_event, payload) => {
  return unpublishProject(payload);
});
ipcMain.handle("wikiwise:getDefaultWikiLocation", () => {
  return getDefaultWikiLocation();
});
ipcMain.handle("wikiwise:chooseNewWikiLocation", (event) => {
  return chooseNewWikiLocation(BrowserWindow.fromWebContents(event.sender));
});
ipcMain.handle("wikiwise:createNewWiki", (event, payload) => {
  return createNewWiki(payload, event.sender);
});
ipcMain.handle("wikiwise:startProjectWatcher", (event, payload) => {
  return startProjectWatcher(event.sender, payload);
});
ipcMain.handle("wikiwise:stopProjectWatcher", (event) => {
  return {
    stopped: closeProjectWatcher(event.sender.id)
  };
});
ipcMain.handle("wikiwise:startTerminal", (event, payload) => {
  return startTerminal(event.sender, payload);
});
ipcMain.handle("wikiwise:sendTerminalInput", (event, payload) => {
  return sendTerminalInput(event.sender, payload);
});
ipcMain.handle("wikiwise:resizeTerminal", (event, payload) => {
  return resizeTerminal(event.sender, payload);
});
ipcMain.handle("wikiwise:stopTerminal", (event) => {
  return {
    stopped: closeTerminal(event.sender.id)
  };
});

app.whenReady().then(async () => {
  applyNativeActivationPolicy();
  applyNativeAppIcon();

  if (isRuntimeAudit) {
    const auditModule = await import(
      pathToFileURL(path.join(repositoryRoot, "scripts", "audit-electron-runtime.mjs")).href
    );
    await auditModule.runElectronRuntimeAudit();
    process.exitCode = 0;
    app.quit();
    return;
  }

  applyAppearanceMode(readAppSettings().appearanceMode);
  Menu.setApplicationMenu(createApplicationMenu());
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
}).catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  app.exit(1);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

export {
  applyNativeActivationPolicy,
  applyWatchSummary,
  applyAppearanceMode,
  applyNativeAppIcon,
  assertProjectPath,
  backgroundCompilationBatchSize,
  backgroundCompilationIntervalMs,
  closeProjectWatcher,
  closeWindowScopedResources,
  compileMarkdownFile,
  createApplicationMenu,
  createNewWiki,
  createMainWindow,
  createProjectResult,
  chooseNewWikiLocation,
  closeTerminal,
  checkProjectPublishAvailability,
  createNativeAppIcon,
  expandProjectTreeDirectory,
  extractLargestPngFromIcns,
  getDefaultWikiLocation,
  getDocumentInfo,
  getEditorResource,
  getTerminalResource,
  getPublishConfig,
  resolveNativeAppIconPath,
  findMarkdownFileForSlug,
  generatedPageResult,
  markdownSlugForPath,
  openExternalUrl,
  openGeneratedPage,
  openExistingProject,
  publishProject,
  readAppSettings,
  rememberProjectRoot,
  resolvePreviewNavigation,
  resizeTerminal,
  restoreLastProject,
  saveFile,
  setActiveFile,
  sendTerminalInput,
  sendAppCommand,
  setAppearanceMode,
  setWebContentsProjectRoot,
  startBackgroundCompilation,
  startTerminal,
  startProjectWatcher,
  stopBackgroundCompilation,
  stopBackgroundCompilationForWebContents,
  unpublishProject,
  writeAppSettings
};

function isMarkdownFile(filePath) {
  return /\.md$/i.test(filePath);
}
