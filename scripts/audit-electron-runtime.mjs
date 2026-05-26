#!/usr/bin/env electron
import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  WikiCompiler,
  createWikiScaffold,
  expandTreeDirectory,
  randomPublishSubdomain,
  readTextFile,
  scanOneLevel,
  slugForPath,
  summarizeDocumentInfo
} from "@wikiwise/core";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDir, "..");
const electronPackageRoot = path.join(repositoryRoot, "apps", "electron");
const runtimeAuditRoot = path.join(repositoryRoot, "apps", "electron", "out", "runtime-audit");
const screenshotRoot = path.join(runtimeAuditRoot, "screenshots");
const sampleProjectParent = path.join(runtimeAuditRoot, "sample-projects");
const reportPath = path.join(runtimeAuditRoot, "report.json");
const rendererHtmlPath = path.join(electronPackageRoot, "src", "renderer", "index.html");
const preloadPath = path.join(electronPackageRoot, "src", "preload", "preload.cjs");
const requireFromAudit = createRequire(import.meta.url);
const nativeDefaultWindowViewport = Object.freeze({ width: 1500, height: 1000 });
const viewport = nativeDefaultWindowViewport;
const scenarios = Object.freeze([
  { name: "welcome-light", kind: "welcome", appearanceMode: "Light" },
  { name: "welcome-dark", kind: "welcome", appearanceMode: "Dark" },
  { name: "new-wiki-light", kind: "new-wiki", appearanceMode: "Light" },
  { name: "new-wiki-dark", kind: "new-wiki", appearanceMode: "Dark" },
  { name: "standalone-file-light", kind: "standalone-file", appearanceMode: "Light" },
  { name: "project-light", kind: "project", appearanceMode: "Light" },
  { name: "project-dark", kind: "project", appearanceMode: "Dark" }
]);

let activeScenario = null;
let auditProject = null;
let auditStandaloneFileProject = null;
let terminalResizeObserved = false;
let terminalResizeCount = 0;
let terminalInputObserved = false;
let activeFileObserved = false;
let generatedPageOpenObserved = false;
let rightSidebarTerminalResizeObserved = false;
let projectWatcherStarted = false;
let projectWatcherProjectRoot = "";
let projectWatcherSender = null;
let watcherRuntimeCaptureActive = false;
let watcherRuntimeReadFilePaths = [];
let watcherRuntimeCompilePayloads = [];
let terminalStarted = false;
let terminalStartedProjectRoot = "";
let newWikiRuntimeCreatedScaffold = null;
let newWikiRuntimeCreatedProject = null;
let previewNavigationResolvePayloads = [];
const auditIpcChannels = Object.freeze([
  "wikiwise:getAppSettings",
  "wikiwise:setAppearanceMode",
  "wikiwise:restoreLastProject",
  "wikiwise:startProjectWatcher",
  "wikiwise:stopProjectWatcher",
  "wikiwise:startTerminal",
  "wikiwise:sendTerminalInput",
  "wikiwise:resizeTerminal",
  "wikiwise:stopTerminal",
  "wikiwise:getDocumentInfo",
  "wikiwise:getPublishConfig",
  "wikiwise:scanProject",
  "wikiwise:expandTreeDirectory",
  "wikiwise:readFile",
  "wikiwise:compilePage",
  "wikiwise:getEditorResource",
  "wikiwise:getTerminalResource",
  "wikiwise:openGeneratedPage",
  "wikiwise:resolvePreviewNavigation",
  "wikiwise:openExternalUrl",
  "wikiwise:openExisting",
  "wikiwise:getDefaultWikiLocation",
  "wikiwise:chooseNewWikiLocation",
  "wikiwise:createNewWiki",
  "wikiwise:saveFile",
  "wikiwise:setActiveFile",
  "wikiwise:checkPublishAvailability",
  "wikiwise:publishSite",
  "wikiwise:unpublishSite"
]);

function resetOutput() {
  fs.rmSync(runtimeAuditRoot, { recursive: true, force: true });
  fs.mkdirSync(screenshotRoot, { recursive: true });
  fs.mkdirSync(sampleProjectParent, { recursive: true });
}

function createAuditProject() {
  const scaffold = createWikiScaffold({
    name: "Runtime Audit Wiki",
    parentDir: sampleProjectParent,
    repositoryRoot,
    createdDate: "2026-05-25"
  });
  const projectRoot = scaffold.path;
  const selectedPath = path.join(projectRoot, "wiki", "home.md");
  const compiler = new WikiCompiler({ projectRoot, repositoryRoot });

  compiler.scanPages();
  const compiled = compiler.compileMarkdownFile(selectedPath);
  const backgroundCompilationEvidence = drainBackgroundCompilation(compiler);
  const indexMarkdownPath = path.join(projectRoot, "wiki", "index.md");
  const indexOutputPath = path.join(compiler.outputDir, "index.html");
  if (!fs.existsSync(indexOutputPath)) {
    compiler.compileMarkdownFile(indexMarkdownPath);
  }
  const auditPreviewPath = createAuditPreviewFile({
    indexFileUrl: pathToFileURL(indexOutputPath).href
  });

  return {
    projectRoot,
    projectKind: "folder",
    projectName: path.basename(projectRoot),
    tree: scanOneLevel(projectRoot),
    backgroundCompilationEvidence,
    selectedFile: {
      path: selectedPath,
      name: path.basename(selectedPath),
      content: readTextFile(selectedPath),
      compiled: {
        ...compiled,
        auditCompiledOutputPath: compiled.outputPath,
        outputPath: auditPreviewPath,
        fileUrl: pathToFileURL(auditPreviewPath).href
      }
    }
  };
}

function createAuditStandaloneFileProject() {
  const standaloneRoot = path.join(sampleProjectParent, "standalone-file-parent");
  const selectedPath = path.join(standaloneRoot, "standalone.md");
  fs.mkdirSync(standaloneRoot, { recursive: true });
  fs.writeFileSync(
    selectedPath,
    "# Standalone Audit File\n\nThis markdown file is opened directly, not as a wiki folder.\n"
  );
  fs.writeFileSync(path.join(standaloneRoot, "sibling.md"), "# Sibling\n\nThis should not render in the tree.\n");

  return {
    projectRoot: standaloneRoot,
    projectKind: "file",
    projectName: path.basename(standaloneRoot),
    tree: [],
    selectedFile: {
      path: selectedPath,
      name: path.basename(selectedPath),
      content: readTextFile(selectedPath)
    }
  };
}

function createAuditProjectResult(projectRoot) {
  const selectedPath = path.join(projectRoot, "wiki", "home.md");
  const compiler = new WikiCompiler({ projectRoot, repositoryRoot });
  compiler.scanPages();
  const compiled = compiler.compileMarkdownFile(selectedPath);

  return {
    projectRoot,
    projectKind: "folder",
    projectName: path.basename(projectRoot),
    tree: scanOneLevel(projectRoot),
    selectedFile: {
      path: selectedPath,
      name: path.basename(selectedPath),
      content: readTextFile(selectedPath),
      compiled: {
        ...compiled,
        fileUrl: pathToFileURL(compiled.outputPath).href
      }
    }
  };
}

function drainBackgroundCompilation(compiler) {
  const batchSize = 3;
  const maxBatches = 200;
  const observedRemaining = [];
  let remaining = compiler.compileNextBatch(batchSize);
  let batches = 1;
  observedRemaining.push(remaining);

  while (remaining > 0 && batches < maxBatches) {
    remaining = compiler.compileNextBatch(batchSize);
    batches += 1;
    observedRemaining.push(remaining);
  }

  return {
    batchSize,
    batches,
    remaining,
    observedRemaining,
    complete: remaining === 0
  };
}

function createAuditPreviewFile({ indexFileUrl } = {}) {
  const previewPath = path.join(runtimeAuditRoot, "audit-preview.html");
  const scrollSections = Array.from({ length: 28 }, (_value, index) => (
    `    <section class="audit-section">
      <h2>Runtime audit section ${index + 1}</h2>
      <p>Preview scroll preservation evidence block ${index + 1}.</p>
    </section>`
  )).join("\n");
  fs.writeFileSync(
    previewPath,
    `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Runtime Audit Preview</title>
    <style>
      body {
        margin: 0;
        padding: 32px;
        background: #f9f6f0;
        color: #1a1714;
        font-family: Georgia, "Times New Roman", serif;
      }
      .audit-section {
        min-height: 180px;
        border-top: 1px solid rgba(26, 23, 20, 0.16);
        padding: 24px 0;
      }
    </style>
  </head>
  <body>
    <h1>Runtime Audit Wiki</h1>
    <p>Static audit preview for Electron shell parity capture.</p>
    <p><a id="audit-local-index-link" href="${indexFileUrl ?? "#"}">Open runtime audit index</a></p>
${scrollSections}
  </body>
</html>
`
  );
  return previewPath;
}

function resolveAuditPackageRoot(packageName) {
  const resolvedEntry = requireFromAudit.resolve(packageName);
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

  throw new Error(`Unable to resolve audit package root for ${packageName}`);
}

function getAuditTerminalResource() {
  const xtermRoot = resolveAuditPackageRoot("@xterm/xterm");
  return {
    xtermScriptUrl: pathToFileURL(requireFromAudit.resolve("@xterm/xterm")).href,
    fitScriptUrl: pathToFileURL(requireFromAudit.resolve("@xterm/addon-fit")).href,
    xtermCssUrl: pathToFileURL(path.join(xtermRoot, "css", "xterm.css")).href
  };
}

function resolveAuditPreviewNavigation(payload) {
  if (!payload?.projectRoot || !payload?.url) {
    throw new Error("resolvePreviewNavigation requires projectRoot and url");
  }

  const projectRoot = path.resolve(payload.projectRoot);
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
  const pageSlug = path.basename(targetPath, path.extname(targetPath)).toLowerCase();
  if (!pageSlug) return null;

  const markdownFile = findAuditMarkdownFileForSlug(projectRoot, pageSlug);
  if (markdownFile) {
    return {
      kind: "file",
      path: markdownFile,
      name: path.basename(markdownFile)
    };
  }

  const compiler = new WikiCompiler({ projectRoot, repositoryRoot });
  compiler.compileAll();
  const generatedPath = path.join(compiler.outputDir, `${pageSlug}.html`);
  if (!fs.existsSync(generatedPath)) return null;

  return {
    kind: "generated",
    name: path.basename(generatedPath),
    path: generatedPath,
    fileUrl: pathToFileURL(generatedPath).href
  };
}

function findAuditMarkdownFileForSlug(projectRoot, slug) {
  const normalizedSlug = String(slug).toLowerCase();
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
      if (!entry.isFile() || !/\.md$/i.test(entry.name)) continue;

      const filePath = path.join(searchDir, entry.name);
      if (auditMarkdownSlugForPath(filePath) === normalizedSlug || slugForPath(filePath) === normalizedSlug) {
        return filePath;
      }
    }
  }

  return null;
}

function auditMarkdownSlugForPath(filePath) {
  return path.basename(filePath, path.extname(filePath)).toLowerCase().replace(/ /g, "-");
}

function registerAuditIpcHandlers() {
  for (const channel of auditIpcChannels) {
    ipcMain.removeHandler(channel);
  }

  ipcMain.handle("wikiwise:getAppSettings", () => ({
    appearanceMode: activeScenario?.appearanceMode ?? "Light",
    lastFolderPath: activeScenario?.kind === "project" ? auditProject.projectRoot : ""
  }));
  ipcMain.handle("wikiwise:setAppearanceMode", (_event, mode) => ({
    appearanceMode: mode,
    lastFolderPath: activeScenario?.kind === "project" ? auditProject.projectRoot : ""
  }));
  ipcMain.handle("wikiwise:restoreLastProject", () => {
    if (activeScenario?.kind === "project") return auditProject;
    if (activeScenario?.kind === "standalone-file") return auditStandaloneFileProject;
    return null;
  });
  ipcMain.handle("wikiwise:startProjectWatcher", (event, payload) => {
    projectWatcherStarted = true;
    projectWatcherProjectRoot = payload?.projectRoot ?? "";
    projectWatcherSender = event.sender;
    return { ok: true, watching: true, projectRoot: projectWatcherProjectRoot };
  });
  ipcMain.handle("wikiwise:stopProjectWatcher", () => {
    projectWatcherSender = null;
    return { ok: true };
  });
  ipcMain.handle("wikiwise:startTerminal", (event, payload) => {
    terminalStarted = true;
    terminalStartedProjectRoot = payload?.projectRoot ?? "";
    setTimeout(() => {
      if (!event.sender.isDestroyed()) {
        event.sender.send("wikiwise:terminalOutput", {
          projectRoot: payload?.projectRoot,
          source: "system",
          data: "\x1b[32m$ runtime audit ready\x1b[0m\r\n"
        });
      }
    }, 25);
    return { ok: true, pty: true, cols: payload?.cols, rows: payload?.rows };
  });
  ipcMain.handle("wikiwise:sendTerminalInput", (_event, payload) => {
    terminalInputObserved = Boolean(payload?.input);
    return { ok: true };
  });
  ipcMain.handle("wikiwise:resizeTerminal", (_event, payload) => {
    terminalResizeObserved = Number(payload?.cols) > 0 && Number(payload?.rows) > 0;
    if (terminalResizeObserved) {
      terminalResizeCount += 1;
    }
    return { ok: true, cols: payload?.cols, rows: payload?.rows };
  });
  ipcMain.handle("wikiwise:stopTerminal", () => ({ ok: true }));
  ipcMain.handle("wikiwise:getDocumentInfo", (_event, payload) => {
    return summarizeDocumentInfo(payload.filePath);
  });
  ipcMain.handle("wikiwise:getPublishConfig", (_event, payload) => ({
    published: false,
    subdomain: null,
    suggestedSubdomain: randomPublishSubdomain(path.basename(payload.projectRoot))
  }));
  ipcMain.handle("wikiwise:scanProject", (_event, projectRoot) => scanOneLevel(projectRoot));
  ipcMain.handle("wikiwise:expandTreeDirectory", (_event, payload) => {
    return expandTreeDirectory(payload.projectRoot, payload.directoryPath);
  });
  ipcMain.handle("wikiwise:readFile", (_event, filePath) => {
    const resolvedFilePath = typeof filePath === "string" ? path.resolve(filePath) : "";
    if (watcherRuntimeCaptureActive && resolvedFilePath) {
      watcherRuntimeReadFilePaths.push(resolvedFilePath);
    }
    return readTextFile(filePath);
  });
  ipcMain.handle("wikiwise:compilePage", (_event, payload) => {
    const resolvedFilePath = typeof payload?.filePath === "string" ? path.resolve(payload.filePath) : "";
    if (watcherRuntimeCaptureActive) {
      watcherRuntimeCompilePayloads.push({
        projectRoot: typeof payload?.projectRoot === "string" ? path.resolve(payload.projectRoot) : "",
        filePath: resolvedFilePath,
        invalidate: Boolean(payload?.invalidate),
        reloadCSS: Boolean(payload?.reloadCSS)
      });
    }
    const compiler = new WikiCompiler({ projectRoot: payload.projectRoot, repositoryRoot });
    compiler.scanPages();
    const compiled = compiler.compileMarkdownFile(payload.filePath);
    const auditSelectedPath = auditProject?.selectedFile?.path
      ? path.resolve(auditProject.selectedFile.path)
      : "";
    if (resolvedFilePath && resolvedFilePath === auditSelectedPath) {
      return {
        ...compiled,
        auditCompiledOutputPath: compiled.outputPath,
        outputPath: auditProject.selectedFile.compiled.outputPath,
        fileUrl: auditProject.selectedFile.compiled.fileUrl
      };
    }
    return {
      ...compiled,
      fileUrl: pathToFileURL(compiled.outputPath).href
    };
  });
  ipcMain.handle("wikiwise:getEditorResource", () => {
    const editorPath = path.join(repositoryRoot, "Sources", "Wikiwise", "Resources", "editor.html");
    return {
      path: editorPath,
      fileUrl: pathToFileURL(editorPath).href,
      bundlePath: path.join(repositoryRoot, "Sources", "Wikiwise", "Resources", "codemirror-bundle.js")
    };
  });
  ipcMain.handle("wikiwise:getTerminalResource", () => getAuditTerminalResource());
  ipcMain.handle("wikiwise:openGeneratedPage", (_event, payload) => {
    generatedPageOpenObserved = true;
    const projectRoot = path.resolve(payload.projectRoot);
    const compiler = new WikiCompiler({ projectRoot, repositoryRoot });
    compiler.compileAll();
    const pagePath = path.join(compiler.outputDir, payload.pageName);
    if (!fs.existsSync(pagePath)) return null;
    return {
      kind: "generated",
      name: payload.pageName,
      path: pagePath,
      fileUrl: pathToFileURL(pagePath).href
    };
  });
  ipcMain.handle("wikiwise:resolvePreviewNavigation", (_event, payload) => {
    const result = resolveAuditPreviewNavigation(payload);
    previewNavigationResolvePayloads.push({
      projectRoot: typeof payload?.projectRoot === "string" ? path.resolve(payload.projectRoot) : "",
      url: typeof payload?.url === "string" ? payload.url : "",
      resultKind: result?.kind ?? "",
      resultName: result?.name ?? "",
      resultPath: result?.path ? path.resolve(result.path) : ""
    });
    return result;
  });
  ipcMain.handle("wikiwise:openExternalUrl", () => ({ ok: true }));
  ipcMain.handle("wikiwise:openExisting", () => ({ canceled: true }));
  ipcMain.handle("wikiwise:getDefaultWikiLocation", () => sampleProjectParent);
  ipcMain.handle("wikiwise:chooseNewWikiLocation", () => ({ canceled: true }));
  ipcMain.handle("wikiwise:createNewWiki", (_event, payload) => {
    if (!payload?.name || !payload?.parentDir) {
      throw new Error("Runtime audit createNewWiki requires name and parentDir.");
    }

    const parentDir = path.resolve(payload.parentDir);
    const scaffold = createWikiScaffold({
      name: payload.name,
      parentDir,
      repositoryRoot,
      createdDate: "2026-05-25"
    });
    const project = createAuditProjectResult(scaffold.path);
    newWikiRuntimeCreatedScaffold = scaffold;
    newWikiRuntimeCreatedProject = project;

    return {
      created: true,
      scaffold,
      project
    };
  });
  ipcMain.handle("wikiwise:saveFile", () => {
    throw new Error("Runtime audit is read-only.");
  });
  ipcMain.handle("wikiwise:setActiveFile", (_event, payload) => {
    activeFileObserved = Boolean(payload?.projectRoot && payload?.filePath);
    return { ok: true };
  });
  ipcMain.handle("wikiwise:checkPublishAvailability", () => ({ availability: "unknown" }));
  ipcMain.handle("wikiwise:publishSite", () => {
    throw new Error("Runtime audit does not publish.");
  });
  ipcMain.handle("wikiwise:unpublishSite", () => {
    throw new Error("Runtime audit does not unpublish.");
  });
}

function createAuditWindow() {
  const window = new BrowserWindow({
    width: viewport.width,
    height: viewport.height,
    useContentSize: true,
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (!isMainFrame && errorCode === -3) return;
    console.error(
      `Runtime audit load failure: ${errorCode} ${errorDescription} ${validatedURL} mainFrame=${isMainFrame}`
    );
  });

  return window;
}

async function runScenario(window, scenario) {
  activeScenario = scenario;
  terminalResizeObserved = false;
  terminalResizeCount = 0;
  terminalInputObserved = false;
  activeFileObserved = false;
  generatedPageOpenObserved = false;
  rightSidebarTerminalResizeObserved = false;
  projectWatcherStarted = false;
  projectWatcherProjectRoot = "";
  projectWatcherSender = null;
  watcherRuntimeCaptureActive = false;
  watcherRuntimeReadFilePaths = [];
  watcherRuntimeCompilePayloads = [];
  terminalStarted = false;
  terminalStartedProjectRoot = "";
  newWikiRuntimeCreatedScaffold = null;
  newWikiRuntimeCreatedProject = null;
  previewNavigationResolvePayloads = [];
  nativeTheme.themeSource = scenario.appearanceMode.toLowerCase();
  console.log(`Running runtime audit scenario: ${scenario.name}`);

  await window.loadFile(rendererHtmlPath);
  await waitForScenario(window, scenario);
  if (scenario.kind === "new-wiki") {
    await captureNewWikiCreationEvidence(window, scenario);
  }
  if (scenario.kind === "standalone-file") {
    await window.webContents.executeJavaScript(`document.querySelector("#open-map")?.click()`, true);
    await delay(80);
  }
  if (scenario.kind === "project") {
    await waitForCondition(
      window,
      `Boolean(
        [...document.querySelectorAll(".tree-folder-button")]
          .some((button) => button.textContent.includes("wiki") && button.getAttribute("aria-expanded") === "true") &&
        [...document.querySelectorAll(".tree-file-button")]
          .some((button) => button.textContent.trim() === "home.md")
      )`,
      `scenario ${scenario.name} expanded wiki tree to render`
    );
    activeFileObserved = false;
    await window.webContents.executeJavaScript(
      `[...document.querySelectorAll(".tree-file-button")]
        .find((button) => button.textContent.trim() === "home.md")
        ?.click()`,
      true
    );
    await waitForHostCondition(
      () => activeFileObserved,
      `scenario ${scenario.name} nested file selection to reach active-file IPC`
    );
    await waitForCondition(
      window,
      `Boolean(
        document.querySelector("#mode-wiki")?.classList.contains("selected") &&
        !document.querySelector("#preview-frame")?.hidden &&
        document.querySelector("#source-editor-frame")?.hidden
      )`,
      `scenario ${scenario.name} default WIKI preview to render`
    );
    await captureDefaultWikiPreviewEvidence(window);
    await capturePreviewScrollPreservationEvidence(window);
    await capturePreviewNavigationRuntimeEvidence(window);
    await captureGeneratedMapFlowEvidence(window);
    await captureWatcherRuntimeEvidence(window);
    await window.webContents.executeJavaScript(`document.querySelector("#mode-file")?.click()`, true);
    await waitForCondition(
      window,
      `Boolean(
        !document.querySelector("#source-editor-frame")?.hidden &&
        document.querySelector("#source-editor-frame")?.contentDocument?.querySelector(".cm-editor")
      )`,
      `scenario ${scenario.name} CodeMirror editor to render`
    );
    await waitForCondition(
      window,
      `Boolean(document.querySelector("#terminal-surface .xterm") && window.__wikiwiseTerminal)`,
      `scenario ${scenario.name} xterm terminal to render`
    );
    await delay(80);
    const terminalResizeCountBeforeSidebarResize = terminalResizeCount;
    await simulateRightSidebarResize(window);
    await delay(160);
    rightSidebarTerminalResizeObserved = terminalResizeCount > terminalResizeCountBeforeSidebarResize;
    await simulateLeftSidebarResize(window);
    await delay(80);
    await simulateLeftSidebarToggle(window);
    await delay(80);
    await window.webContents.executeJavaScript(`window.__wikiwiseTerminal?.input("echo runtime audit\\r")`, true);
    await delay(80);
    await captureInfoOptionalSectionEvidence(window);
  }
  await delay(120);

  const screenshotPath = path.join(screenshotRoot, `${scenario.name}.png`);
  const image = await window.webContents.capturePage();
  fs.writeFileSync(screenshotPath, image.toPNG());

  const dom = await readDomEvidence(window);
  dom.backgroundCompilationEvidence = scenario.kind === "project"
    ? auditProject?.backgroundCompilationEvidence ?? null
    : null;
  dom.backgroundCompilationComplete = scenario.kind !== "project"
    || Boolean(dom.backgroundCompilationEvidence?.complete && dom.backgroundCompilationEvidence.remaining === 0);
  dom.terminalResizeObserved = terminalResizeObserved;
  dom.rightSidebarTerminalResizeObserved = rightSidebarTerminalResizeObserved;
  dom.terminalInputObserved = terminalInputObserved;
  dom.activeFileObserved = activeFileObserved;
  dom.standaloneFileWatcherStopped = scenario.kind !== "standalone-file" || !projectWatcherStarted;
  dom.standaloneFileTerminalStopped = scenario.kind !== "standalone-file" || !terminalStarted;
  dom.standaloneFileGeneratedMapServiceStopped = scenario.kind !== "standalone-file" || !generatedPageOpenObserved;
  const screenshot = screenshotStats(image);
  const assertions = assertScenario(scenario, dom, screenshot);
  console.log(`Captured runtime audit scenario: ${scenario.name}`);

  return {
    name: scenario.name,
    kind: scenario.kind,
    appearanceMode: scenario.appearanceMode,
    ok: assertions.length === 0,
    assertions,
    screenshotPath: path.relative(repositoryRoot, screenshotPath),
    dom,
    screenshot
  };
}

async function simulateRightSidebarResize(window) {
  return window.webContents.executeJavaScript(`(() => {
    const rightSidebar = document.querySelector("#right-sidebar");
    const handle = document.querySelector("#right-sidebar-resize-handle");
    const project = document.querySelector("#project");
    const projectRect = project?.getBoundingClientRect();
    const maxWidth = projectRect ? Math.floor(projectRect.width / 2) : null;

    if (!rightSidebar || !handle) {
      const missingEvidence = {
        rightSidebarResizeHandlePresent: Boolean(handle),
        rightSidebarInitialWidth: null,
        rightSidebarResizedWidth: null,
        rightSidebarMaxWidth: maxWidth,
        rightSidebarResizeObserved: false
      };
      window.__wikiwiseRightSidebarResizeEvidence = missingEvidence;
      return missingEvidence;
    }

    const before = Math.round(rightSidebar.getBoundingClientRect().width);
    const handleRect = handle.getBoundingClientRect();
    const startX = Math.round(handleRect.left + Math.max(1, handleRect.width / 2));
    const clientY = Math.round(handleRect.top + Math.max(1, handleRect.height / 2));
    const pointer = {
      bubbles: true,
      cancelable: true,
      pointerId: 17,
      pointerType: "mouse",
      isPrimary: true,
      button: 0,
      buttons: 1,
      clientX: startX,
      clientY
    };

    handle.dispatchEvent(new PointerEvent("pointerdown", pointer));
    handle.dispatchEvent(new PointerEvent("pointermove", {
      ...pointer,
      clientX: startX - 80
    }));
    handle.dispatchEvent(new PointerEvent("pointerup", {
      ...pointer,
      buttons: 0,
      clientX: startX - 80
    }));

    const after = Math.round(rightSidebar.getBoundingClientRect().width);
    const evidence = {
      rightSidebarResizeHandlePresent: true,
      rightSidebarInitialWidth: before,
      rightSidebarResizedWidth: after,
      rightSidebarMaxWidth: maxWidth,
      rightSidebarResizeObserved: before !== after
    };
    window.__wikiwiseRightSidebarResizeEvidence = evidence;
    return evidence;
  })()`, true).catch((error) => ({
    rightSidebarResizeHandlePresent: false,
    rightSidebarInitialWidth: null,
    rightSidebarResizedWidth: null,
    rightSidebarMaxWidth: null,
    rightSidebarResizeObserved: false,
    error: error instanceof Error ? error.message : String(error)
  }));
}

async function simulateLeftSidebarToggle(window) {
  return window.webContents.executeJavaScript(`(() => {
    const leftSidebar = document.querySelector("#left-sidebar");
    const toggle = document.querySelector("#toggle-left-sidebar");
    const detail = document.querySelector(".detail");
    const toolbarTitle = document.querySelector("#toolbar-project-name");
    const selectedTreeText = () => document.querySelector(".tree-file-button.selected")?.textContent?.trim() ?? "";
    const expandedFolderNames = () => [...document.querySelectorAll(".tree-folder-button")]
      .filter((button) => button.getAttribute("aria-expanded") === "true")
      .map((button) => button.textContent.trim());
    const toolbarAffordance = () => ({
      nativeAffordance: toggle?.dataset?.nativeAffordance ?? "",
      sidebarAction: toggle?.dataset?.sidebarAction ?? "",
      title: toggle?.getAttribute("title") ?? "",
      ariaLabel: toggle?.getAttribute("aria-label") ?? "",
      nativeSymbol: toggle?.querySelector(".toolbar-symbol")?.dataset?.nativeSymbol ?? ""
    });
    const isVisible = (element) => Boolean(
      element &&
      !element.hidden &&
      element.getBoundingClientRect().width > 0 &&
      element.getBoundingClientRect().height > 0
    );
    const detailWidth = () => Math.round(detail?.getBoundingClientRect().width ?? 0);
    const leftSidebarWidth = () => Math.round(leftSidebar?.getBoundingClientRect().width ?? 0);
    const titleOffset = () => {
      const transform = toolbarTitle ? window.getComputedStyle(toolbarTitle).transform : "";
      if (!transform || transform === "none") return 0;

      const matrix3d = transform.match(/^matrix3d\\(([^)]+)\\)$/);
      if (matrix3d) {
        const values = matrix3d[1].split(",").map((value) => Number.parseFloat(value.trim()));
        return Math.round(Number.isFinite(values[12]) ? values[12] : 0);
      }

      const matrix = transform.match(/^matrix\\(([^)]+)\\)$/);
      if (matrix) {
        const values = matrix[1].split(",").map((value) => Number.parseFloat(value.trim()));
        return Math.round(Number.isFinite(values[4]) ? values[4] : 0);
      }

      return 0;
    };

    const before = {
      visible: isVisible(leftSidebar),
      detailWidth: detailWidth(),
      leftSidebarWidth: leftSidebarWidth(),
      titleOffset: titleOffset(),
      selectedTreeText: selectedTreeText(),
      expandedFolderNames: expandedFolderNames(),
      toolbarAffordance: toolbarAffordance()
    };

    if (!leftSidebar || !toggle || !detail) {
      const missingEvidence = {
        leftSidebarTogglePresent: Boolean(toggle),
        leftSidebarInitiallyVisible: before.visible,
        leftSidebarHiddenAfterToggle: false,
        leftSidebarRestoredVisible: false,
        leftSidebarInitialDetailWidth: before.detailWidth,
        leftSidebarHiddenDetailWidth: null,
        leftSidebarDetailExpanded: false,
        leftSidebarSelectionPreserved: false,
        leftSidebarExpansionPreserved: false,
        toolbarTitleOffsetEvidence: Boolean(toolbarTitle),
        leftSidebarTitleOffsetWidth: before.leftSidebarWidth,
        toolbarTitleExpectedVisibleOffset: before.leftSidebarWidth ? -Math.round(before.leftSidebarWidth / 2) : 0,
        toolbarTitleInitialOffset: before.titleOffset,
        toolbarTitleHiddenOffset: null,
        toolbarTitleRestoredOffset: null,
        leftSidebarVisibleNativeAffordance: before.toolbarAffordance.nativeAffordance,
        leftSidebarVisibleSidebarAction: before.toolbarAffordance.sidebarAction,
        leftSidebarVisibleToolbarTitle: before.toolbarAffordance.title,
        leftSidebarVisibleToolbarAriaLabel: before.toolbarAffordance.ariaLabel,
        leftSidebarVisibleNativeSymbol: before.toolbarAffordance.nativeSymbol,
        leftSidebarHiddenNativeAffordance: "",
        leftSidebarHiddenSidebarAction: "",
        leftSidebarHiddenToolbarTitle: "",
        leftSidebarHiddenToolbarAriaLabel: "",
        leftSidebarHiddenNativeSymbol: ""
      };
      window.__wikiwiseLeftSidebarVisibilityEvidence = missingEvidence;
      return missingEvidence;
    }

    toggle.click();
    const hidden = {
      visible: isVisible(leftSidebar),
      detailWidth: detailWidth(),
      titleOffset: titleOffset(),
      toolbarAffordance: toolbarAffordance()
    };
    toggle.click();
    const restored = {
      visible: isVisible(leftSidebar),
      leftSidebarWidth: leftSidebarWidth(),
      titleOffset: titleOffset(),
      selectedTreeText: selectedTreeText(),
      expandedFolderNames: expandedFolderNames(),
      toolbarAffordance: toolbarAffordance()
    };
    const expectedVisibleOffset = -Math.round(restored.leftSidebarWidth / 2);
    const evidence = {
      leftSidebarTogglePresent: true,
      leftSidebarInitiallyVisible: before.visible,
      leftSidebarHiddenAfterToggle: !hidden.visible,
      leftSidebarRestoredVisible: restored.visible,
      leftSidebarInitialDetailWidth: before.detailWidth,
      leftSidebarHiddenDetailWidth: hidden.detailWidth,
      leftSidebarDetailExpanded: hidden.detailWidth > before.detailWidth,
      leftSidebarSelectionPreserved: before.selectedTreeText === restored.selectedTreeText,
      leftSidebarExpansionPreserved: before.expandedFolderNames.join("\\n") === restored.expandedFolderNames.join("\\n"),
      toolbarTitleOffsetEvidence: true,
      leftSidebarTitleOffsetWidth: restored.leftSidebarWidth,
      toolbarTitleExpectedVisibleOffset: expectedVisibleOffset,
      toolbarTitleInitialOffset: before.titleOffset,
      toolbarTitleHiddenOffset: hidden.titleOffset,
      toolbarTitleRestoredOffset: restored.titleOffset,
      leftSidebarVisibleNativeAffordance: before.toolbarAffordance.nativeAffordance,
      leftSidebarVisibleSidebarAction: before.toolbarAffordance.sidebarAction,
      leftSidebarVisibleToolbarTitle: before.toolbarAffordance.title,
      leftSidebarVisibleToolbarAriaLabel: before.toolbarAffordance.ariaLabel,
      leftSidebarVisibleNativeSymbol: before.toolbarAffordance.nativeSymbol,
      leftSidebarHiddenNativeAffordance: hidden.toolbarAffordance.nativeAffordance,
      leftSidebarHiddenSidebarAction: hidden.toolbarAffordance.sidebarAction,
      leftSidebarHiddenToolbarTitle: hidden.toolbarAffordance.title,
      leftSidebarHiddenToolbarAriaLabel: hidden.toolbarAffordance.ariaLabel,
      leftSidebarHiddenNativeSymbol: hidden.toolbarAffordance.nativeSymbol,
      leftSidebarRestoredNativeAffordance: restored.toolbarAffordance.nativeAffordance,
      leftSidebarRestoredSidebarAction: restored.toolbarAffordance.sidebarAction
    };
    window.__wikiwiseLeftSidebarVisibilityEvidence = evidence;
    return evidence;
  })()`, true).catch((error) => ({
    leftSidebarTogglePresent: false,
    leftSidebarInitiallyVisible: false,
    leftSidebarHiddenAfterToggle: false,
    leftSidebarRestoredVisible: false,
    leftSidebarInitialDetailWidth: null,
    leftSidebarHiddenDetailWidth: null,
    leftSidebarDetailExpanded: false,
    leftSidebarSelectionPreserved: false,
    leftSidebarExpansionPreserved: false,
    toolbarTitleOffsetEvidence: false,
    leftSidebarTitleOffsetWidth: null,
    toolbarTitleExpectedVisibleOffset: null,
    toolbarTitleInitialOffset: null,
    toolbarTitleHiddenOffset: null,
    toolbarTitleRestoredOffset: null,
    leftSidebarVisibleNativeAffordance: "",
    leftSidebarVisibleSidebarAction: "",
    leftSidebarVisibleToolbarTitle: "",
    leftSidebarVisibleToolbarAriaLabel: "",
    leftSidebarVisibleNativeSymbol: "",
    leftSidebarHiddenNativeAffordance: "",
    leftSidebarHiddenSidebarAction: "",
    leftSidebarHiddenToolbarTitle: "",
    leftSidebarHiddenToolbarAriaLabel: "",
    leftSidebarHiddenNativeSymbol: "",
    leftSidebarRestoredNativeAffordance: "",
    leftSidebarRestoredSidebarAction: "",
    error: error instanceof Error ? error.message : String(error)
  }));
}

async function simulateLeftSidebarResize(window) {
  return window.webContents.executeJavaScript(`(() => {
    const leftSidebar = document.querySelector("#left-sidebar");
    const handle = document.querySelector("#left-sidebar-resize-handle");
    const toolbarTitle = document.querySelector("#toolbar-project-name");
    const native = {
      min: 110,
      ideal: 200,
      max: 360
    };
    const titleOffset = () => {
      const transform = toolbarTitle ? window.getComputedStyle(toolbarTitle).transform : "";
      if (!transform || transform === "none") return 0;

      const matrix3d = transform.match(/^matrix3d\\(([^)]+)\\)$/);
      if (matrix3d) {
        const values = matrix3d[1].split(",").map((value) => Number.parseFloat(value.trim()));
        return Math.round(Number.isFinite(values[12]) ? values[12] : 0);
      }

      const matrix = transform.match(/^matrix\\(([^)]+)\\)$/);
      if (matrix) {
        const values = matrix[1].split(",").map((value) => Number.parseFloat(value.trim()));
        return Math.round(Number.isFinite(values[4]) ? values[4] : 0);
      }

      return 0;
    };

    if (!leftSidebar || !handle) {
      const missingEvidence = {
        leftSidebarResizeHandlePresent: Boolean(handle),
        leftSidebarNativeMinWidth: native.min,
        leftSidebarNativeIdealWidth: native.ideal,
        leftSidebarNativeMaxWidth: native.max,
        leftSidebarInitialWidth: leftSidebar ? Math.round(leftSidebar.getBoundingClientRect().width) : null,
        leftSidebarResizedWidth: null,
        leftSidebarResizeObserved: false,
        leftSidebarResizedTitleOffset: titleOffset()
      };
      window.__wikiwiseLeftSidebarResizeEvidence = missingEvidence;
      return missingEvidence;
    }

    const before = Math.round(leftSidebar.getBoundingClientRect().width);
    const handleRect = handle.getBoundingClientRect();
    const startX = Math.round(handleRect.left + Math.max(1, handleRect.width / 2));
    const clientY = Math.round(handleRect.top + Math.max(1, handleRect.height / 2));
    const pointer = {
      bubbles: true,
      cancelable: true,
      pointerId: 23,
      pointerType: "mouse",
      isPrimary: true,
      button: 0,
      buttons: 1,
      clientX: startX,
      clientY
    };

    handle.dispatchEvent(new PointerEvent("pointerdown", pointer));
    handle.dispatchEvent(new PointerEvent("pointermove", {
      ...pointer,
      clientX: startX + 60
    }));
    handle.dispatchEvent(new PointerEvent("pointerup", {
      ...pointer,
      buttons: 0,
      clientX: startX + 60
    }));

    const after = Math.round(leftSidebar.getBoundingClientRect().width);
    const evidence = {
      leftSidebarResizeHandlePresent: true,
      leftSidebarNativeMinWidth: native.min,
      leftSidebarNativeIdealWidth: native.ideal,
      leftSidebarNativeMaxWidth: native.max,
      leftSidebarInitialWidth: before,
      leftSidebarResizedWidth: after,
      leftSidebarResizeObserved: before !== after,
      leftSidebarResizedTitleOffset: titleOffset()
    };
    window.__wikiwiseLeftSidebarResizeEvidence = evidence;
    return evidence;
  })()`, true).catch((error) => ({
    leftSidebarResizeHandlePresent: false,
    leftSidebarNativeMinWidth: 110,
    leftSidebarNativeIdealWidth: 200,
    leftSidebarNativeMaxWidth: 360,
    leftSidebarInitialWidth: null,
    leftSidebarResizedWidth: null,
    leftSidebarResizeObserved: false,
    leftSidebarResizedTitleOffset: null,
    error: error instanceof Error ? error.message : String(error)
  }));
}

async function captureInfoOptionalSectionEvidence(window) {
  return window.webContents.executeJavaScript(`(() => {
    const infoTab = document.querySelector("#right-tab-info");
    const terminalTab = document.querySelector("#right-tab-terminal");
    const directionsSection = document.querySelector("#info-directions-section");
    const linksSection = document.querySelector("#info-links-section");
    const directionsText = document.querySelector("#info-directions")?.textContent?.trim() ?? "";
    const linksText = document.querySelector("#info-links")?.textContent?.trim() ?? "";
    const isVisible = (element) => Boolean(
      element &&
      !element.hidden &&
      element.getBoundingClientRect().width > 0 &&
      element.getBoundingClientRect().height > 0
    );

    infoTab?.click();
    const evidence = {
      infoTabActivated: Boolean(infoTab?.classList.contains("selected")),
      infoDirectionsSectionVisible: isVisible(directionsSection),
      infoLinksSectionVisible: isVisible(linksSection),
      infoDirectionsText: directionsText,
      infoLinksText: linksText,
      infoOptionalSectionEvidence: true
    };
    window.__wikiwiseInfoOptionalSectionEvidence = evidence;
    terminalTab?.click();
    return evidence;
  })()`, true).catch((error) => ({
    infoTabActivated: false,
    infoDirectionsSectionVisible: false,
    infoLinksSectionVisible: false,
    infoDirectionsText: "",
    infoLinksText: "",
    infoOptionalSectionEvidence: false,
    error: error instanceof Error ? error.message : String(error)
  }));
}

async function captureDefaultWikiPreviewEvidence(window) {
  return window.webContents.executeJavaScript(`(() => {
    const modeFile = document.querySelector("#mode-file");
    const modeWiki = document.querySelector("#mode-wiki");
    const previewFrame = document.querySelector("#preview-frame");
    const sourceEditorFrame = document.querySelector("#source-editor-frame");
    const selectedFileLabel = document.querySelector("#selected-file")?.textContent?.trim() ?? "";
    const isVisible = (element) => Boolean(
      element &&
      !element.hidden &&
      element.getBoundingClientRect().width > 0 &&
      element.getBoundingClientRect().height > 0
    );
    const evidence = {
      defaultWikiPreviewEvidence: true,
      defaultWikiModeSelected: Boolean(modeWiki?.classList.contains("selected")),
      defaultFileModeSelected: Boolean(modeFile?.classList.contains("selected")),
      defaultWikiPreviewVisible: isVisible(previewFrame),
      defaultWikiEditorHidden: Boolean(sourceEditorFrame?.hidden),
      defaultWikiPreviewSrc: previewFrame?.getAttribute("src") ?? "",
      defaultWikiSelectedFileLabel: selectedFileLabel
    };
    window.__wikiwiseDefaultWikiPreviewEvidence = evidence;
    return evidence;
  })()`, true).catch((error) => ({
    defaultWikiPreviewEvidence: false,
    defaultWikiModeSelected: false,
    defaultFileModeSelected: false,
    defaultWikiPreviewVisible: false,
    defaultWikiEditorHidden: false,
    defaultWikiPreviewSrc: "",
    defaultWikiSelectedFileLabel: "",
    error: error instanceof Error ? error.message : String(error)
  }));
}

async function capturePreviewScrollPreservationEvidence(window) {
  return window.webContents.executeJavaScript(`(async () => {
    const modeFile = document.querySelector("#mode-file");
    const modeWiki = document.querySelector("#mode-wiki");
    const previewFrame = document.querySelector("#preview-frame");
    const previewScrollTargetFraction = 0.7;
    const previewScrollTolerance = 0.08;
    const nextFrame = () => new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const waitForPreviewLoad = () => new Promise((resolve) => {
      if (!previewFrame) {
        resolve(false);
        return;
      }
      const timer = setTimeout(() => resolve(false), 1500);
      previewFrame.addEventListener("load", () => {
        clearTimeout(timer);
        resolve(true);
      }, { once: true });
    });
    const frameScroll = () => {
      const previewWindow = previewFrame?.contentWindow;
      const previewDocument = previewFrame?.contentDocument;
      const scrollHeight = Math.max(
        previewDocument?.documentElement?.scrollHeight ?? 0,
        previewDocument?.body?.scrollHeight ?? 0
      );
      const viewportHeight = previewWindow?.innerHeight ?? 0;
      const maxScroll = Math.max(1, scrollHeight - viewportHeight);
      const scrollY = previewWindow?.scrollY ?? 0;
      return {
        scrollY,
        scrollHeight,
        viewportHeight,
        maxScroll,
        fraction: scrollY / maxScroll
      };
    };
    const evidence = {
      previewScrollEvidence: true,
      previewScrollFrameScrollable: false,
      previewScrollTargetFraction,
      previewScrollCapturedFraction: null,
      previewScrollRestoredFraction: null,
      previewScrollWithinTolerance: false,
      previewScrollTolerance,
      previewScrollLoadedAfterReturn: false
    };

    await nextFrame();
    const initial = frameScroll();
    evidence.previewScrollInitialMaxScroll = initial.maxScroll;
    evidence.previewScrollFrameScrollable = initial.maxScroll > 1;
    if (!evidence.previewScrollFrameScrollable || !previewFrame?.contentWindow) {
      window.__wikiwisePreviewScrollEvidence = evidence;
      return evidence;
    }

    previewFrame.contentWindow.scrollTo(0, previewScrollTargetFraction * initial.maxScroll);
    await nextFrame();
    const captured = frameScroll();
    evidence.previewScrollCapturedFraction = captured.fraction;

    modeFile?.click();
    await nextFrame();
    const loadPromise = waitForPreviewLoad();
    modeWiki?.click();
    evidence.previewScrollLoadedAfterReturn = await loadPromise;
    await nextFrame();
    await delay(30);
    const restored = frameScroll();
    evidence.previewScrollRestoredFraction = restored.fraction;
    evidence.previewScrollWithinTolerance =
      Number.isFinite(evidence.previewScrollCapturedFraction) &&
      Number.isFinite(evidence.previewScrollRestoredFraction) &&
      Math.abs(evidence.previewScrollRestoredFraction - evidence.previewScrollCapturedFraction) <= previewScrollTolerance;

    window.__wikiwisePreviewScrollEvidence = evidence;
    return evidence;
  })()`, true).catch((error) => ({
    previewScrollEvidence: false,
    previewScrollFrameScrollable: false,
    previewScrollTargetFraction: 0.7,
    previewScrollCapturedFraction: null,
    previewScrollRestoredFraction: null,
    previewScrollWithinTolerance: false,
    previewScrollTolerance: 0.08,
    previewScrollLoadedAfterReturn: false,
    error: error instanceof Error ? error.message : String(error)
  }));
}

async function captureGeneratedMapFlowEvidence(window) {
  return window.webContents.executeJavaScript(`(async () => {
    const mapButton = document.querySelector("#open-map");
    const backButton = document.querySelector("#go-back");
    const generatedPreviewFrame = document.querySelector("#generated-preview-frame");
    const previewFrame = document.querySelector("#preview-frame");
    const selectedFileLabel = () => document.querySelector("#selected-file")?.textContent?.trim() ?? "";
    const frameSrc = () => generatedPreviewFrame?.getAttribute("src") ?? "";
    const nextFrame = () => new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
    const waitFor = async (predicate, timeoutMs = 2500) => {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        if (predicate()) return true;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      return false;
    };
    const evidence = {
      generatedMapEvidence: true,
      generatedMapControlPresent: Boolean(mapButton),
      generatedMapFrameVisible: false,
      generatedMapFrameSrc: "",
      generatedMapName: "",
      generatedMapBackControlPresent: Boolean(backButton),
      generatedMapBackRestoredMarkdown: false,
      generatedMapBackSelectedFileLabel: "",
      generatedMapBackPreviewVisible: false,
      generatedMapBackGeneratedFrameHidden: false
    };

    if (!mapButton || !backButton || !generatedPreviewFrame) {
      window.__wikiwiseGeneratedMapEvidence = evidence;
      return evidence;
    }

    mapButton.click();
    await waitFor(() => (
      !generatedPreviewFrame.hidden &&
      /map-3d\\.html(?:$|[?#])/.test(frameSrc()) &&
      selectedFileLabel() === "map-3d.html"
    ));
    await nextFrame();
    evidence.generatedMapFrameVisible = Boolean(!generatedPreviewFrame.hidden);
    evidence.generatedMapFrameSrc = frameSrc();
    evidence.generatedMapName = selectedFileLabel();

    backButton.click();
    await waitFor(() => (
      selectedFileLabel() === "home.md" &&
      Boolean(generatedPreviewFrame.hidden) &&
      Boolean(previewFrame && !previewFrame.hidden)
    ));
    await nextFrame();
    evidence.generatedMapBackSelectedFileLabel = selectedFileLabel();
    evidence.generatedMapBackGeneratedFrameHidden = Boolean(generatedPreviewFrame.hidden);
    evidence.generatedMapBackPreviewVisible = Boolean(previewFrame && !previewFrame.hidden);
    evidence.generatedMapBackRestoredMarkdown =
      evidence.generatedMapBackSelectedFileLabel === "home.md" &&
      evidence.generatedMapBackGeneratedFrameHidden &&
      evidence.generatedMapBackPreviewVisible;

    window.__wikiwiseGeneratedMapEvidence = evidence;
    return evidence;
  })()`, true).catch((error) => ({
    generatedMapEvidence: false,
    generatedMapControlPresent: false,
    generatedMapFrameVisible: false,
    generatedMapFrameSrc: "",
    generatedMapName: "",
    generatedMapBackControlPresent: false,
    generatedMapBackRestoredMarkdown: false,
    generatedMapBackSelectedFileLabel: "",
    generatedMapBackPreviewVisible: false,
    generatedMapBackGeneratedFrameHidden: false,
    error: error instanceof Error ? error.message : String(error)
  }));
}

async function capturePreviewNavigationRuntimeEvidence(window) {
  const resolvePayloadStart = previewNavigationResolvePayloads.length;
  await window.webContents.executeJavaScript(`(async () => {
    const previewFrame = document.querySelector("#preview-frame");
    const backButton = document.querySelector("#go-back");
    const selectedFileLabel = () => document.querySelector("#selected-file")?.textContent?.trim() ?? "";
    const isVisible = (element) => Boolean(
      element &&
      !element.hidden &&
      element.getBoundingClientRect().width > 0 &&
      element.getBoundingClientRect().height > 0
    );
    const waitFor = async (predicate, timeoutMs = 3500) => {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        if (predicate()) return true;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      return false;
    };
    const nextFrame = () => new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
    const evidence = {
      previewNavigationRuntimeEvidence: true,
      previewNavigationInitialSelectedFileLabel: selectedFileLabel(),
      previewNavigationLinkPresent: false,
      previewNavigationLinkHref: "",
      previewNavigationBackControlPresent: Boolean(backButton),
      previewNavigationSelectedFileAfterClick: "",
      previewNavigationTargetSelected: false,
      previewNavigationPreviewVisibleAfterClick: false,
      previewNavigationBackRestoredMarkdown: false,
      previewNavigationBackSelectedFileLabel: "",
      previewNavigationPreviewVisibleAfterBack: false
    };

    await nextFrame();
    const link = previewFrame?.contentDocument?.querySelector("#audit-local-index-link");
    evidence.previewNavigationLinkPresent = Boolean(link);
    evidence.previewNavigationLinkHref = link?.href || link?.getAttribute("href") || "";

    if (!previewFrame || !link || !backButton) {
      window.__wikiwisePreviewNavigationRuntimeEvidence = evidence;
      return evidence;
    }

    link.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      button: 0,
      view: previewFrame.contentWindow
    }));

    await waitFor(() => selectedFileLabel() === "index.md");
    await nextFrame();
    evidence.previewNavigationSelectedFileAfterClick = selectedFileLabel();
    evidence.previewNavigationTargetSelected = evidence.previewNavigationSelectedFileAfterClick === "index.md";
    evidence.previewNavigationPreviewVisibleAfterClick = isVisible(previewFrame);

    backButton.click();
    await waitFor(() => selectedFileLabel() === "home.md" && isVisible(previewFrame));
    await nextFrame();
    evidence.previewNavigationBackSelectedFileLabel = selectedFileLabel();
    evidence.previewNavigationPreviewVisibleAfterBack = isVisible(previewFrame);
    evidence.previewNavigationBackRestoredMarkdown =
      evidence.previewNavigationBackSelectedFileLabel === "home.md" &&
      evidence.previewNavigationPreviewVisibleAfterBack;

    window.__wikiwisePreviewNavigationRuntimeEvidence = evidence;
    return evidence;
  })()`, true).catch((error) => ({
    previewNavigationRuntimeEvidence: false,
    previewNavigationInitialSelectedFileLabel: "",
    previewNavigationLinkPresent: false,
    previewNavigationLinkHref: "",
    previewNavigationBackControlPresent: false,
    previewNavigationSelectedFileAfterClick: "",
    previewNavigationTargetSelected: false,
    previewNavigationPreviewVisibleAfterClick: false,
    previewNavigationBackRestoredMarkdown: false,
    previewNavigationBackSelectedFileLabel: "",
    previewNavigationPreviewVisibleAfterBack: false,
    error: error instanceof Error ? error.message : String(error)
  }));

  const currentResolvePayloads = previewNavigationResolvePayloads.slice(resolvePayloadStart);
  const indexResolvePayload = currentResolvePayloads.find((payload) => (
    /index\.html(?:$|[?#])/.test(payload.url) ||
    payload.resultName === "index.md"
  ));
  const hostEvidence = {
    previewNavigationResolvePayloads: currentResolvePayloads,
    previewNavigationResolveObserved: Boolean(indexResolvePayload),
    previewNavigationResolvedKind: indexResolvePayload?.resultKind ?? "",
    previewNavigationTargetFileName: indexResolvePayload?.resultName ?? ""
  };

  return window.webContents.executeJavaScript(`(() => {
    const hostEvidence = ${JSON.stringify(hostEvidence)};
    const evidence = {
      ...(window.__wikiwisePreviewNavigationRuntimeEvidence ?? {}),
      ...hostEvidence
    };
    window.__wikiwisePreviewNavigationRuntimeEvidence = evidence;
    return evidence;
  })()`, true).catch((error) => ({
    previewNavigationRuntimeEvidence: false,
    previewNavigationInitialSelectedFileLabel: "",
    previewNavigationLinkPresent: false,
    previewNavigationLinkHref: "",
    previewNavigationBackControlPresent: false,
    previewNavigationSelectedFileAfterClick: "",
    previewNavigationTargetSelected: false,
    previewNavigationPreviewVisibleAfterClick: false,
    previewNavigationBackRestoredMarkdown: false,
    previewNavigationBackSelectedFileLabel: "",
    previewNavigationPreviewVisibleAfterBack: false,
    ...hostEvidence,
    error: error instanceof Error ? error.message : String(error)
  }));
}

async function captureNewWikiCreationEvidence(window, scenario) {
  const wikiName = `Runtime Created Wiki ${scenario.appearanceMode}`;

  await window.webContents.executeJavaScript(`(async () => {
    const createButton = document.querySelector("#create-new");
    const dialog = document.querySelector("#new-wiki-dialog");
    const panel = document.querySelector(".new-wiki-panel");
    const nameInput = document.querySelector("#new-wiki-name");
    const locationLabel = document.querySelector("#new-wiki-location");
    const chooseButton = document.querySelector("#choose-new-wiki-location");
    const confirmButton = document.querySelector("#confirm-create-new");
    const cancelButton = document.querySelector("#cancel-create-new");
    const project = document.querySelector("#project");
    const guide = document.querySelector("#post-create-guide");
    const dismissButton = document.querySelector("#dismiss-post-create-guide");
    const waitFor = async (predicate, timeoutMs = 5000) => {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        if (predicate()) return true;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      return false;
    };
    const isVisible = (element) => Boolean(
      element &&
      !element.hidden &&
      element.getBoundingClientRect().width > 0 &&
      element.getBoundingClientRect().height > 0
    );
    const rectFor = (element) => {
      const rect = element?.getBoundingClientRect();
      if (!rect) return null;
      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left)
      };
    };
    const textFor = (selector) => document.querySelector(selector)?.textContent?.trim() ?? "";
    const evidence = {
      newWikiRuntimeEvidence: true,
      newWikiDialogEvidence: false,
      newWikiDialogTitle: "",
      newWikiDialogRect: null,
      newWikiNameInputPresent: Boolean(nameInput),
      newWikiLocationText: "",
      newWikiLocationTitle: "",
      newWikiLocationAriaLabel: "",
      newWikiChooseLabel: "",
      newWikiCancelLabel: "",
      newWikiConfirmLabel: "",
      newWikiCreateDisabledWhenEmpty: false,
      newWikiCreateEnabledWhenNamed: false,
      newWikiSubmittedName: ${JSON.stringify(wikiName)},
      newWikiProjectOpened: false,
      newWikiOpenedProjectName: "",
      newWikiPostCreateGuideVisible: false,
      newWikiGuideTitle: "",
      newWikiGuideSummaryVisible: false,
      newWikiGuideTerminalInstructionVisible: false,
      newWikiGuideCommandEvidence: false,
      newWikiSeedOptionCount: 0,
      newWikiDismissActionLabel: "",
      newWikiDismissedGuide: false,
      newWikiHomeSelectedAfterDismiss: false,
      newWikiPreviewVisibleAfterDismiss: false
    };

    createButton?.click();
    await waitFor(() => isVisible(dialog) && Boolean(locationLabel?.textContent?.trim()));

    evidence.newWikiDialogEvidence = isVisible(dialog) && isVisible(panel);
    evidence.newWikiDialogTitle = textFor("#new-wiki-title");
    evidence.newWikiDialogRect = rectFor(panel);
    evidence.newWikiLocationText = locationLabel?.textContent?.trim() ?? "";
    evidence.newWikiLocationTitle = locationLabel?.getAttribute("title") ?? "";
    evidence.newWikiLocationAriaLabel = locationLabel?.getAttribute("aria-label") ?? "";
    evidence.newWikiChooseLabel = chooseButton?.textContent?.trim() ?? "";
    evidence.newWikiCancelLabel = cancelButton?.textContent?.trim() ?? "";
    evidence.newWikiConfirmLabel = confirmButton?.textContent?.trim() ?? "";
    evidence.newWikiCreateDisabledWhenEmpty = Boolean(confirmButton?.disabled);

    if (nameInput) {
      nameInput.value = ${JSON.stringify(wikiName)};
      nameInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    await waitFor(() => Boolean(confirmButton && !confirmButton.disabled), 1500);
    evidence.newWikiCreateEnabledWhenNamed = Boolean(confirmButton && !confirmButton.disabled);

    confirmButton?.click();
    await waitFor(() => (
      Boolean(project && !project.hidden) &&
      Boolean(guide && !guide.hidden) &&
      textFor("#project-name")
    ));

    evidence.newWikiProjectOpened = Boolean(project && !project.hidden);
    evidence.newWikiOpenedProjectName = textFor("#project-name") || textFor("#toolbar-project-name");
    evidence.newWikiPostCreateGuideVisible = Boolean(guide && !guide.hidden);
    evidence.newWikiGuideTitle = textFor("#post-create-guide h2");
    evidence.newWikiGuideSummaryVisible = document.body.innerText.includes(
      "WikiWise created the folder structure, build tools, and agent skills. Now seed it with sources."
    );
    evidence.newWikiGuideTerminalInstructionVisible = document.body.innerText.includes(
      "Use the built-in terminal in the right sidebar, or open your own terminal:"
    );
    const commandText = [
      textFor("#guide-claude-command"),
      textFor("#guide-codex-command"),
      textFor("#guide-cursor-command")
    ].join("\\n");
    evidence.newWikiGuideCommandEvidence =
      /claude/.test(commandText) &&
      /codex/.test(commandText) &&
      /Cursor/.test(commandText) &&
      commandText.includes(evidence.newWikiOpenedProjectName);
    evidence.newWikiSeedOptionCount = document.querySelectorAll(".guide-seed-option").length;
    evidence.newWikiDismissActionLabel = dismissButton?.textContent?.trim() ?? "";

    dismissButton?.click();
    await waitFor(() => (
      Boolean(guide?.hidden) &&
      textFor("#selected-file") === "home.md" &&
      Boolean(document.querySelector("#preview-frame") && !document.querySelector("#preview-frame").hidden)
    ));
    evidence.newWikiDismissedGuide = Boolean(guide?.hidden);
    evidence.newWikiHomeSelectedAfterDismiss = textFor("#selected-file") === "home.md";
    evidence.newWikiPreviewVisibleAfterDismiss = Boolean(
      document.querySelector("#preview-frame") &&
      !document.querySelector("#preview-frame").hidden
    );

    window.__wikiwiseNewWikiRuntimeEvidence = evidence;
    return evidence;
  })()`, true).catch((error) => ({
    newWikiRuntimeEvidence: false,
    newWikiDialogEvidence: false,
    newWikiDialogTitle: "",
    newWikiDialogRect: null,
    newWikiNameInputPresent: false,
    newWikiLocationText: "",
    newWikiLocationTitle: "",
    newWikiLocationAriaLabel: "",
    newWikiChooseLabel: "",
    newWikiCancelLabel: "",
    newWikiConfirmLabel: "",
    newWikiCreateDisabledWhenEmpty: false,
    newWikiCreateEnabledWhenNamed: false,
    newWikiSubmittedName: wikiName,
    newWikiProjectOpened: false,
    newWikiOpenedProjectName: "",
    newWikiPostCreateGuideVisible: false,
    newWikiGuideTitle: "",
    newWikiGuideSummaryVisible: false,
    newWikiGuideTerminalInstructionVisible: false,
    newWikiGuideCommandEvidence: false,
    newWikiSeedOptionCount: 0,
    newWikiDismissActionLabel: "",
    newWikiDismissedGuide: false,
    newWikiHomeSelectedAfterDismiss: false,
    newWikiPreviewVisibleAfterDismiss: false,
    error: error instanceof Error ? error.message : String(error)
  }));

  const createdProjectRoot = newWikiRuntimeCreatedProject?.projectRoot
    ? path.resolve(newWikiRuntimeCreatedProject.projectRoot)
    : "";
  const hostEvidence = {
    newWikiCreatedScaffoldEvidence: Boolean(newWikiRuntimeCreatedScaffold?.path && fs.existsSync(newWikiRuntimeCreatedScaffold.path)),
    newWikiCreatedProjectRoot: createdProjectRoot,
    newWikiCreatedProjectName: newWikiRuntimeCreatedProject?.projectName ?? "",
    newWikiCreatedHomeExists: Boolean(createdProjectRoot && fs.existsSync(path.join(createdProjectRoot, "wiki", "home.md"))),
    newWikiCreatedSettingsExists: Boolean(createdProjectRoot && fs.existsSync(path.join(createdProjectRoot, ".claude", "settings.json"))),
    newWikiProjectWatcherStarted: Boolean(
      createdProjectRoot &&
      projectWatcherStarted &&
      path.resolve(projectWatcherProjectRoot) === createdProjectRoot
    ),
    newWikiTerminalStarted: Boolean(
      createdProjectRoot &&
      terminalStarted &&
      path.resolve(terminalStartedProjectRoot) === createdProjectRoot
    )
  };

  return window.webContents.executeJavaScript(`(() => {
    const hostEvidence = ${JSON.stringify(hostEvidence)};
    const evidence = {
      ...(window.__wikiwiseNewWikiRuntimeEvidence ?? {}),
      ...hostEvidence
    };
    window.__wikiwiseNewWikiRuntimeEvidence = evidence;
    return evidence;
  })()`, true);
}

async function captureWatcherRuntimeEvidence(window) {
  const selectedMarkdownPath = auditProject?.selectedFile?.path
    ? path.resolve(auditProject.selectedFile.path)
    : "";
  const projectRoot = auditProject?.projectRoot
    ? path.resolve(auditProject.projectRoot)
    : "";
  const watcherRuntimeEvent = {
    projectRoot,
    kind: "content",
    cssChanged: true,
    changedMarkdownPaths: [selectedMarkdownPath]
  };
  const watcherRuntimeStarted =
    projectWatcherStarted &&
    projectWatcherProjectRoot === projectRoot &&
    Boolean(projectWatcherSender && !projectWatcherSender.isDestroyed());
  let watcherRuntimeEventSent = false;

  watcherRuntimeReadFilePaths = [];
  watcherRuntimeCompilePayloads = [];
  watcherRuntimeCaptureActive = true;
  try {
    if (watcherRuntimeStarted && selectedMarkdownPath) {
      projectWatcherSender.send("wikiwise:projectChanged", watcherRuntimeEvent);
      watcherRuntimeEventSent = true;
      await waitForHostCondition(
        () => watcherRuntimeCompilePayloads.some((payload) => (
          payload.projectRoot === projectRoot &&
          payload.filePath === selectedMarkdownPath &&
          payload.invalidate === true &&
          payload.reloadCSS === true
        )),
        "watcher runtime selected markdown refresh",
        5000
      ).catch(() => {});
      await waitForCondition(
        window,
        `Boolean(
          document.querySelector("#selected-file")?.textContent?.trim() === "home.md" &&
          document.querySelector("#preview-frame") &&
          !document.querySelector("#preview-frame")?.hidden
        )`,
        "watcher runtime selected markdown state",
        3000
      ).catch(() => {});
    }
  } finally {
    watcherRuntimeCaptureActive = false;
  }

  const watcherRuntimeReadFileObserved = watcherRuntimeReadFilePaths.includes(selectedMarkdownPath);
  const watcherRuntimeCompilePayload = watcherRuntimeCompilePayloads.find((payload) => (
    payload.projectRoot === projectRoot &&
    payload.filePath === selectedMarkdownPath
  ));
  const hostEvidence = {
    watcherRuntimeEvidence: true,
    watcherRuntimeStarted,
    watcherRuntimeProjectRoot: projectRoot,
    watcherRuntimeEventSent,
    watcherRuntimeReadFileObserved,
    watcherRuntimeCompileObserved: Boolean(watcherRuntimeCompilePayload),
    watcherRuntimeCompileInvalidate: Boolean(watcherRuntimeCompilePayload?.invalidate),
    watcherRuntimeCompileReloadCSS: Boolean(watcherRuntimeCompilePayload?.reloadCSS),
    watcherRuntimeChangedMarkdownPath: selectedMarkdownPath,
    watcherRuntimeChangedMarkdownFileName: selectedMarkdownPath ? path.basename(selectedMarkdownPath) : "",
    watcherRuntimeReadFilePaths,
    watcherRuntimeCompilePayloads
  };

  return window.webContents.executeJavaScript(`(() => {
    const hostEvidence = ${JSON.stringify(hostEvidence)};
    const previewFrame = document.querySelector("#preview-frame");
    const selectedFileLabel = document.querySelector("#selected-file")?.textContent?.trim() ?? "";
    const evidence = {
      ...hostEvidence,
      watcherRuntimeSelectedFileLabel: selectedFileLabel,
      watcherRuntimePreviewVisible: Boolean(previewFrame && !previewFrame.hidden),
      watcherRuntimePreviewSrc: previewFrame?.getAttribute("src") ?? ""
    };
    window.__wikiwiseWatcherRuntimeEvidence = evidence;
    return evidence;
  })()`, true).catch((error) => ({
    watcherRuntimeEvidence: false,
    watcherRuntimeStarted,
    watcherRuntimeProjectRoot: projectRoot,
    watcherRuntimeEventSent,
    watcherRuntimeReadFileObserved,
    watcherRuntimeCompileObserved: false,
    watcherRuntimeCompileInvalidate: false,
    watcherRuntimeCompileReloadCSS: false,
    watcherRuntimeChangedMarkdownPath: selectedMarkdownPath,
    watcherRuntimeChangedMarkdownFileName: selectedMarkdownPath ? path.basename(selectedMarkdownPath) : "",
    watcherRuntimeSelectedFileLabel: "",
    watcherRuntimePreviewVisible: false,
    watcherRuntimePreviewSrc: "",
    error: error instanceof Error ? error.message : String(error)
  }));
}

async function waitForScenario(window, scenario) {
  const expression = scenario.kind === "project" || scenario.kind === "standalone-file"
    ? `Boolean(
        document.querySelector("#welcome")?.hidden &&
        !document.querySelector("#project")?.hidden &&
        document.querySelector("#selected-file")?.textContent?.trim()
      )`
    : `Boolean(
        !document.querySelector("#welcome")?.hidden &&
        document.querySelector("#project")?.hidden
      )`;

  await waitForCondition(window, expression, `scenario ${scenario.name} to render`);
}

async function waitForCondition(window, expression, label, timeoutMs = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const passed = await window.webContents.executeJavaScript(expression, true).catch(() => false);
    if (passed) return;
    await delay(50);
  }
  throw new Error(`Timed out waiting for ${label}.`);
}

async function waitForHostCondition(predicate, label, timeoutMs = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await delay(50);
  }
  throw new Error(`Timed out waiting for ${label}.`);
}

async function readDomEvidence(window) {
  return window.webContents.executeJavaScript(`(() => {
    const rectFor = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left)
      };
    };
    const styleFor = (selector) => {
      const element = selector === ":root" ? document.documentElement : document.querySelector(selector);
      if (!element) return null;
      const style = window.getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderTopColor: style.borderTopColor,
        borderRightColor: style.borderRightColor,
        borderBottomColor: style.borderBottomColor,
        borderLeftColor: style.borderLeftColor
      };
    };
    const parseRgb = (value) => {
      const channels = String(value).match(/[0-9.]+/g);
      if (!channels || channels.length < 3) return null;
      return {
        r: Number(channels[0]),
        g: Number(channels[1]),
        b: Number(channels[2]),
        a: channels[3] === undefined ? 1 : Number(channels[3])
      };
    };
    const isDarkSurface = (value) => {
      const color = parseRgb(value);
      return Boolean(color && color.a > 0.75 && color.r < 80 && color.g < 80 && color.b < 80);
    };
    const isLightSurface = (value) => {
      const color = parseRgb(value);
      return Boolean(color && color.a > 0.75 && color.r > 180 && color.g > 170 && color.b > 130);
    };
	    const textFor = (selector) => document.querySelector(selector)?.textContent?.trim() ?? "";
	    const toolbarSymbolFor = (selector) =>
	      document.querySelector(selector + " .toolbar-symbol")?.dataset.nativeSymbol ?? "";
	    const toolbarIconText = {
	      appearance: textFor("#appearance-mode"),
	      map: textFor("#open-map"),
	      leftSidebar: textFor("#toggle-left-sidebar"),
	      rightSidebar: textFor("#toggle-right-sidebar")
	    };
	    const toolbarIconEvidence = {
	      toolbarIconEvidence: true,
	      appearanceNativeSymbol: toolbarSymbolFor("#appearance-mode"),
	      mapNativeSymbol: toolbarSymbolFor("#open-map"),
	      leftSidebarNativeSymbol: toolbarSymbolFor("#toggle-left-sidebar"),
	      rightSidebarNativeSymbol: toolbarSymbolFor("#toggle-right-sidebar"),
	      toolbarIconText,
	      toolbarIconTextVisible: /\\b(?:Auto|Light|Dark|Map)\\b/.test(
	        toolbarIconText.appearance + "\\n" + toolbarIconText.map
	      )
	    };
	    const sourceEditorFrame = document.querySelector("#source-editor-frame");
	    const sourceEditorDocument = sourceEditorFrame?.contentDocument;
	    const terminalSurface = document.querySelector("#terminal-surface");
	    const terminalLineText = window.__wikiwiseTerminal?.buffer?.active
	      ? Array.from({ length: window.__wikiwiseTerminal.buffer.active.length }, (_value, index) =>
	          window.__wikiwiseTerminal.buffer.active.getLine(index)?.translateToString(true) ?? ""
	        ).join("\\n").trim()
	      : "";
	    const rightSidebarResizeEvidence = window.__wikiwiseRightSidebarResizeEvidence ?? {};
	    const leftSidebarResizeEvidence = window.__wikiwiseLeftSidebarResizeEvidence ?? {};
	    const leftSidebarVisibilityEvidence = window.__wikiwiseLeftSidebarVisibilityEvidence ?? {};
	    const infoOptionalEvidence = window.__wikiwiseInfoOptionalSectionEvidence ?? {};
	    const defaultWikiPreviewEvidence = window.__wikiwiseDefaultWikiPreviewEvidence ?? {};
	    const previewScrollEvidence = window.__wikiwisePreviewScrollEvidence ?? {};
	    const generatedMapEvidence = window.__wikiwiseGeneratedMapEvidence ?? {};
	    const previewNavigationRuntimeEvidence = window.__wikiwisePreviewNavigationRuntimeEvidence ?? {};
	    const watcherRuntimeEvidence = window.__wikiwiseWatcherRuntimeEvidence ?? {};
	    const newWikiRuntimeEvidence = window.__wikiwiseNewWikiRuntimeEvidence ?? {};
	    const treeButtons = [...document.querySelectorAll(".tree-row")];
	    const detailHeader = document.querySelector(".detail-header");
	    const detailHeaderRect = detailHeader?.getBoundingClientRect();
	    const detailHeaderVisible = Boolean(
	      detailHeader &&
	      !detailHeader.hidden &&
	      detailHeaderRect &&
	      detailHeaderRect.width > 0 &&
	      detailHeaderRect.height > 0
	    );
	    const expandedTreeEvidence = treeButtons.some((button) =>
	      button.classList.contains("tree-folder-button") &&
	      button.textContent.includes("wiki") &&
	      button.getAttribute("aria-expanded") === "true"
	    ) && treeButtons.some((button) =>
	      button.classList.contains("tree-file-button") &&
	      button.textContent.trim() === "home.md"
	    );
	    const nestedSelectionEvidence = treeButtons.some((button) =>
	      button.classList.contains("tree-file-button") &&
	      button.classList.contains("selected") &&
	      button.textContent.trim() === "home.md"
	    );
	    const folderIcon = document.querySelector(".tree-folder-button .tree-folder-icon");
	    const specialFolderIcon = document.querySelector(".tree-folder.special-folder .tree-folder-icon");
	    const selectedAccent = document.querySelector(".tree-file-button.selected .tree-selected-accent");
	    const selectedAccentRect = selectedAccent?.getBoundingClientRect();
	    const selectedAccentWidth = Math.round(selectedAccentRect?.width ?? 0);
	    const specialFolderDotContent = specialFolderIcon
	      ? window.getComputedStyle(specialFolderIcon, "::after").content
	      : "none";
	    const welcomeToolbar = document.querySelector("#welcome-toolbar");
	    const welcomeToolbarRect = rectFor("#welcome-toolbar");
	    const welcomeToolbarEvidence = {
	      welcomeToolbarEvidence: Boolean(welcomeToolbar),
	      welcomeToolbarVisible: Boolean(
	        welcomeToolbar &&
	          !welcomeToolbar.hidden &&
	          welcomeToolbarRect &&
	          welcomeToolbarRect.width > 0 &&
	          welcomeToolbarRect.height > 0
	      ),
	      welcomeToolbarMarkText: textFor(".welcome-toolbar-mark"),
	      welcomeToolbarTitleText: textFor(".welcome-toolbar-title"),
	      welcomeToolbarRect
	    };
	    const rootAppearance = document.documentElement.dataset.appearance ?? "";
	    const computedShellColors = {
	      root: styleFor(":root"),
	      body: styleFor("body"),
	      shell: styleFor(".shell"),
	      welcomePanel: styleFor(".welcome-panel"),
	      projectShell: styleFor(".project-shell"),
	      projectToolbar: styleFor(".project-toolbar"),
	      sidebar: styleFor(".sidebar"),
	      detail: styleFor(".detail"),
	      rightSidebar: styleFor(".right-sidebar"),
	      modalPanel: styleFor(".modal-panel")
	    };
	    const paletteSurfaces = document.querySelector("#project")?.hidden
	      ? [computedShellColors.body, computedShellColors.shell, computedShellColors.welcomePanel]
	      : [
	          computedShellColors.body,
	          computedShellColors.projectShell,
	          computedShellColors.projectToolbar,
	          computedShellColors.sidebar,
	          computedShellColors.detail,
	          computedShellColors.rightSidebar
	        ];
	    const existingPaletteSurfaces = paletteSurfaces.filter(Boolean);
	    const darkAppearancePaletteEvidence = existingPaletteSurfaces.length > 0 &&
	      existingPaletteSurfaces.every((surface) => isDarkSurface(surface.backgroundColor));
	    const lightAppearancePaletteEvidence = existingPaletteSurfaces.length > 0 &&
	      existingPaletteSurfaces.every((surface) => isLightSurface(surface.backgroundColor));
	    const appearancePaletteEvidence = rootAppearance === "Dark"
	      ? darkAppearancePaletteEvidence
	      : lightAppearancePaletteEvidence;
	    return {
      documentTitle: document.title,
      rootAppearance,
      computedShellColors,
      appearancePaletteEvidence,
      darkAppearancePaletteEvidence,
      bodyText: document.body.innerText,
      welcomeHidden: Boolean(document.querySelector("#welcome")?.hidden),
      projectHidden: Boolean(document.querySelector("#project")?.hidden),
      resourcePanelPresent: Boolean(document.querySelector(".resources-panel, #resource-list, #resource-count")),
      shellRect: rectFor(".shell"),
      welcomeRect: rectFor("#welcome"),
      projectRect: rectFor("#project"),
      projectName: textFor("#project-name") || textFor("#toolbar-project-name"),
      toolbarProjectName: textFor("#toolbar-project-name"),
      welcomeToolbarEvidence: Boolean(welcomeToolbarEvidence.welcomeToolbarEvidence),
      welcomeToolbarVisible: Boolean(welcomeToolbarEvidence.welcomeToolbarVisible),
      welcomeToolbarMarkText: welcomeToolbarEvidence.welcomeToolbarMarkText,
      welcomeToolbarTitleText: welcomeToolbarEvidence.welcomeToolbarTitleText,
      welcomeToolbarRect: welcomeToolbarEvidence.welcomeToolbarRect,
      toolbarIconEvidence: Boolean(toolbarIconEvidence.toolbarIconEvidence),
      appearanceNativeSymbol: toolbarIconEvidence.appearanceNativeSymbol,
      mapNativeSymbol: toolbarIconEvidence.mapNativeSymbol,
      leftSidebarNativeSymbol: toolbarIconEvidence.leftSidebarNativeSymbol,
      rightSidebarNativeSymbol: toolbarIconEvidence.rightSidebarNativeSymbol,
      toolbarIconText: toolbarIconEvidence.toolbarIconText,
      toolbarIconTextVisible: toolbarIconEvidence.toolbarIconTextVisible,
      selectedFileLabel: textFor("#selected-file"),
      standaloneFileEvidence: Boolean(
        textFor("#selected-file") === "standalone.md" &&
        !document.querySelector("#project")?.hidden
      ),
      standaloneFileTreeEmpty: document.querySelectorAll("#file-tree .tree-row").length === 0,
      standaloneFilePublishDisabled: Boolean(document.querySelector("#publish-wiki")?.disabled),
      standaloneFileGeneratedMapStayedHidden: Boolean(document.querySelector("#generated-preview-frame")?.hidden),
      detailHeaderVisible,
      detailSaveChromeTextVisible: /\\bSaved\\b\\s*\\n\\s*Save\\b/.test(document.body.innerText),
      projectViewportBounded: !document.querySelector("#project") || (
        Math.round(document.querySelector("#project").getBoundingClientRect().height) <= window.innerHeight + 1 &&
        document.documentElement.scrollHeight <= window.innerHeight + 1 &&
        document.body.scrollHeight <= window.innerHeight + 1
      ),
      publishDialogHidden: Boolean(document.querySelector("#publish-dialog")?.hidden),
      newWikiDialogHidden: Boolean(document.querySelector("#new-wiki-dialog")?.hidden),
      sourceEditorFramePresent: Boolean(sourceEditorFrame),
      sourceEditorFrameReady: Boolean(sourceEditorFrame?.contentWindow?.getContent),
      sourceEditorFrameHidden: Boolean(sourceEditorFrame?.hidden),
      codeMirrorEditorPresent: Boolean(sourceEditorDocument?.querySelector(".cm-editor")),
      defaultWikiPreviewEvidence: Boolean(defaultWikiPreviewEvidence.defaultWikiPreviewEvidence),
      defaultWikiModeSelected: Boolean(defaultWikiPreviewEvidence.defaultWikiModeSelected),
      defaultFileModeSelected: Boolean(defaultWikiPreviewEvidence.defaultFileModeSelected),
      defaultWikiPreviewVisible: Boolean(defaultWikiPreviewEvidence.defaultWikiPreviewVisible),
      defaultWikiEditorHidden: Boolean(defaultWikiPreviewEvidence.defaultWikiEditorHidden),
      defaultWikiPreviewSrc: defaultWikiPreviewEvidence.defaultWikiPreviewSrc ?? "",
      defaultWikiSelectedFileLabel: defaultWikiPreviewEvidence.defaultWikiSelectedFileLabel ?? "",
      previewScrollEvidence: Boolean(previewScrollEvidence.previewScrollEvidence),
      previewScrollFrameScrollable: Boolean(previewScrollEvidence.previewScrollFrameScrollable),
      previewScrollTargetFraction: previewScrollEvidence.previewScrollTargetFraction ?? null,
      previewScrollCapturedFraction: previewScrollEvidence.previewScrollCapturedFraction ?? null,
      previewScrollRestoredFraction: previewScrollEvidence.previewScrollRestoredFraction ?? null,
      previewScrollWithinTolerance: Boolean(previewScrollEvidence.previewScrollWithinTolerance),
      previewScrollTolerance: previewScrollEvidence.previewScrollTolerance ?? null,
      previewScrollLoadedAfterReturn: Boolean(previewScrollEvidence.previewScrollLoadedAfterReturn),
      generatedMapEvidence: Boolean(generatedMapEvidence.generatedMapEvidence),
      generatedMapControlPresent: Boolean(generatedMapEvidence.generatedMapControlPresent),
      generatedMapFrameVisible: Boolean(generatedMapEvidence.generatedMapFrameVisible),
      generatedMapFrameSrc: generatedMapEvidence.generatedMapFrameSrc ?? "",
      generatedMapName: generatedMapEvidence.generatedMapName ?? "",
      generatedMapBackControlPresent: Boolean(generatedMapEvidence.generatedMapBackControlPresent),
      generatedMapBackRestoredMarkdown: Boolean(generatedMapEvidence.generatedMapBackRestoredMarkdown),
      generatedMapBackSelectedFileLabel: generatedMapEvidence.generatedMapBackSelectedFileLabel ?? "",
      generatedMapBackPreviewVisible: Boolean(generatedMapEvidence.generatedMapBackPreviewVisible),
      generatedMapBackGeneratedFrameHidden: Boolean(generatedMapEvidence.generatedMapBackGeneratedFrameHidden),
      previewNavigationRuntimeEvidence: Boolean(previewNavigationRuntimeEvidence.previewNavigationRuntimeEvidence),
      previewNavigationInitialSelectedFileLabel:
        previewNavigationRuntimeEvidence.previewNavigationInitialSelectedFileLabel ?? "",
      previewNavigationLinkPresent: Boolean(previewNavigationRuntimeEvidence.previewNavigationLinkPresent),
      previewNavigationLinkHref: previewNavigationRuntimeEvidence.previewNavigationLinkHref ?? "",
      previewNavigationBackControlPresent:
        Boolean(previewNavigationRuntimeEvidence.previewNavigationBackControlPresent),
      previewNavigationResolveObserved:
        Boolean(previewNavigationRuntimeEvidence.previewNavigationResolveObserved),
      previewNavigationResolvedKind: previewNavigationRuntimeEvidence.previewNavigationResolvedKind ?? "",
      previewNavigationTargetFileName: previewNavigationRuntimeEvidence.previewNavigationTargetFileName ?? "",
      previewNavigationSelectedFileAfterClick:
        previewNavigationRuntimeEvidence.previewNavigationSelectedFileAfterClick ?? "",
      previewNavigationTargetSelected:
        Boolean(previewNavigationRuntimeEvidence.previewNavigationTargetSelected),
      previewNavigationPreviewVisibleAfterClick:
        Boolean(previewNavigationRuntimeEvidence.previewNavigationPreviewVisibleAfterClick),
      previewNavigationBackRestoredMarkdown:
        Boolean(previewNavigationRuntimeEvidence.previewNavigationBackRestoredMarkdown),
      previewNavigationBackSelectedFileLabel:
        previewNavigationRuntimeEvidence.previewNavigationBackSelectedFileLabel ?? "",
      previewNavigationPreviewVisibleAfterBack:
        Boolean(previewNavigationRuntimeEvidence.previewNavigationPreviewVisibleAfterBack),
      previewNavigationResolvePayloads: previewNavigationRuntimeEvidence.previewNavigationResolvePayloads ?? [],
      newWikiRuntimeEvidence: Boolean(newWikiRuntimeEvidence.newWikiRuntimeEvidence),
      newWikiDialogEvidence: Boolean(newWikiRuntimeEvidence.newWikiDialogEvidence),
      newWikiDialogTitle: newWikiRuntimeEvidence.newWikiDialogTitle ?? "",
      newWikiDialogRect: newWikiRuntimeEvidence.newWikiDialogRect ?? null,
      newWikiNameInputPresent: Boolean(newWikiRuntimeEvidence.newWikiNameInputPresent),
      newWikiLocationText: newWikiRuntimeEvidence.newWikiLocationText ?? "",
      newWikiLocationTitle: newWikiRuntimeEvidence.newWikiLocationTitle ?? "",
      newWikiLocationAriaLabel: newWikiRuntimeEvidence.newWikiLocationAriaLabel ?? "",
      newWikiChooseLabel: newWikiRuntimeEvidence.newWikiChooseLabel ?? "",
      newWikiCancelLabel: newWikiRuntimeEvidence.newWikiCancelLabel ?? "",
      newWikiConfirmLabel: newWikiRuntimeEvidence.newWikiConfirmLabel ?? "",
      newWikiCreateDisabledWhenEmpty: Boolean(newWikiRuntimeEvidence.newWikiCreateDisabledWhenEmpty),
      newWikiCreateEnabledWhenNamed: Boolean(newWikiRuntimeEvidence.newWikiCreateEnabledWhenNamed),
      newWikiSubmittedName: newWikiRuntimeEvidence.newWikiSubmittedName ?? "",
      newWikiCreatedScaffoldEvidence: Boolean(newWikiRuntimeEvidence.newWikiCreatedScaffoldEvidence),
      newWikiCreatedProjectRoot: newWikiRuntimeEvidence.newWikiCreatedProjectRoot ?? "",
      newWikiCreatedProjectName: newWikiRuntimeEvidence.newWikiCreatedProjectName ?? "",
      newWikiCreatedHomeExists: Boolean(newWikiRuntimeEvidence.newWikiCreatedHomeExists),
      newWikiCreatedSettingsExists: Boolean(newWikiRuntimeEvidence.newWikiCreatedSettingsExists),
      newWikiProjectOpened: Boolean(newWikiRuntimeEvidence.newWikiProjectOpened),
      newWikiOpenedProjectName: newWikiRuntimeEvidence.newWikiOpenedProjectName ?? "",
      newWikiProjectWatcherStarted: Boolean(newWikiRuntimeEvidence.newWikiProjectWatcherStarted),
      newWikiTerminalStarted: Boolean(newWikiRuntimeEvidence.newWikiTerminalStarted),
      newWikiPostCreateGuideVisible: Boolean(newWikiRuntimeEvidence.newWikiPostCreateGuideVisible),
      newWikiGuideTitle: newWikiRuntimeEvidence.newWikiGuideTitle ?? "",
      newWikiGuideSummaryVisible: Boolean(newWikiRuntimeEvidence.newWikiGuideSummaryVisible),
      newWikiGuideTerminalInstructionVisible: Boolean(newWikiRuntimeEvidence.newWikiGuideTerminalInstructionVisible),
      newWikiGuideCommandEvidence: Boolean(newWikiRuntimeEvidence.newWikiGuideCommandEvidence),
      newWikiSeedOptionCount: newWikiRuntimeEvidence.newWikiSeedOptionCount ?? null,
      newWikiDismissActionLabel: newWikiRuntimeEvidence.newWikiDismissActionLabel ?? "",
      newWikiDismissedGuide: Boolean(newWikiRuntimeEvidence.newWikiDismissedGuide),
      newWikiHomeSelectedAfterDismiss: Boolean(newWikiRuntimeEvidence.newWikiHomeSelectedAfterDismiss),
      newWikiPreviewVisibleAfterDismiss: Boolean(newWikiRuntimeEvidence.newWikiPreviewVisibleAfterDismiss),
      watcherRuntimeEvidence: Boolean(watcherRuntimeEvidence.watcherRuntimeEvidence),
      watcherRuntimeStarted: Boolean(watcherRuntimeEvidence.watcherRuntimeStarted),
      watcherRuntimeProjectRoot: watcherRuntimeEvidence.watcherRuntimeProjectRoot ?? "",
      watcherRuntimeEventSent: Boolean(watcherRuntimeEvidence.watcherRuntimeEventSent),
      watcherRuntimeReadFileObserved: Boolean(watcherRuntimeEvidence.watcherRuntimeReadFileObserved),
      watcherRuntimeCompileObserved: Boolean(watcherRuntimeEvidence.watcherRuntimeCompileObserved),
      watcherRuntimeCompileInvalidate: Boolean(watcherRuntimeEvidence.watcherRuntimeCompileInvalidate),
      watcherRuntimeCompileReloadCSS: Boolean(watcherRuntimeEvidence.watcherRuntimeCompileReloadCSS),
      watcherRuntimeChangedMarkdownPath: watcherRuntimeEvidence.watcherRuntimeChangedMarkdownPath ?? "",
      watcherRuntimeChangedMarkdownFileName: watcherRuntimeEvidence.watcherRuntimeChangedMarkdownFileName ?? "",
      watcherRuntimeSelectedFileLabel: watcherRuntimeEvidence.watcherRuntimeSelectedFileLabel ?? "",
      watcherRuntimePreviewVisible: Boolean(watcherRuntimeEvidence.watcherRuntimePreviewVisible),
      watcherRuntimePreviewSrc: watcherRuntimeEvidence.watcherRuntimePreviewSrc ?? "",
      expandedTreeEvidence,
      nestedSelectionEvidence,
	      fileTreeFolderIconPresent: Boolean(folderIcon),
	      fileTreeSpecialFolderMarkerPresent: Boolean(specialFolderIcon && specialFolderDotContent !== "none"),
	      fileTreeSelectedAccentPresent: Boolean(selectedAccent && selectedAccentWidth === 2),
      leftSidebarTogglePresent: Boolean(document.querySelector("#toggle-left-sidebar")),
	      leftSidebarResizeHandlePresent: Boolean(leftSidebarResizeEvidence.leftSidebarResizeHandlePresent),
	      leftSidebarNativeMinWidth: leftSidebarResizeEvidence.leftSidebarNativeMinWidth ?? null,
	      leftSidebarNativeIdealWidth: leftSidebarResizeEvidence.leftSidebarNativeIdealWidth ?? null,
	      leftSidebarNativeMaxWidth: leftSidebarResizeEvidence.leftSidebarNativeMaxWidth ?? null,
	      leftSidebarInitialWidth: leftSidebarResizeEvidence.leftSidebarInitialWidth ?? null,
	      leftSidebarResizedWidth: leftSidebarResizeEvidence.leftSidebarResizedWidth ?? null,
	      leftSidebarResizeObserved: Boolean(leftSidebarResizeEvidence.leftSidebarResizeObserved),
	      leftSidebarResizedTitleOffset: leftSidebarResizeEvidence.leftSidebarResizedTitleOffset ?? null,
	      leftSidebarInitiallyVisible: Boolean(leftSidebarVisibilityEvidence.leftSidebarInitiallyVisible),
	      leftSidebarHiddenAfterToggle: Boolean(leftSidebarVisibilityEvidence.leftSidebarHiddenAfterToggle),
	      leftSidebarRestoredVisible: Boolean(leftSidebarVisibilityEvidence.leftSidebarRestoredVisible),
	      leftSidebarInitialDetailWidth: leftSidebarVisibilityEvidence.leftSidebarInitialDetailWidth ?? null,
	      leftSidebarHiddenDetailWidth: leftSidebarVisibilityEvidence.leftSidebarHiddenDetailWidth ?? null,
	      leftSidebarDetailExpanded: Boolean(leftSidebarVisibilityEvidence.leftSidebarDetailExpanded),
	      leftSidebarSelectionPreserved: Boolean(leftSidebarVisibilityEvidence.leftSidebarSelectionPreserved),
	      leftSidebarExpansionPreserved: Boolean(leftSidebarVisibilityEvidence.leftSidebarExpansionPreserved),
	      toolbarTitleOffsetEvidence: Boolean(leftSidebarVisibilityEvidence.toolbarTitleOffsetEvidence),
	      leftSidebarTitleOffsetWidth: leftSidebarVisibilityEvidence.leftSidebarTitleOffsetWidth ?? null,
	      toolbarTitleExpectedVisibleOffset: leftSidebarVisibilityEvidence.toolbarTitleExpectedVisibleOffset ?? null,
	      toolbarTitleInitialOffset: leftSidebarVisibilityEvidence.toolbarTitleInitialOffset ?? null,
	      toolbarTitleHiddenOffset: leftSidebarVisibilityEvidence.toolbarTitleHiddenOffset ?? null,
	      toolbarTitleRestoredOffset: leftSidebarVisibilityEvidence.toolbarTitleRestoredOffset ?? null,
	      leftSidebarVisibleNativeAffordance:
	        leftSidebarVisibilityEvidence.leftSidebarVisibleNativeAffordance ?? "",
	      leftSidebarVisibleSidebarAction:
	        leftSidebarVisibilityEvidence.leftSidebarVisibleSidebarAction ?? "",
	      leftSidebarVisibleToolbarTitle:
	        leftSidebarVisibilityEvidence.leftSidebarVisibleToolbarTitle ?? "",
	      leftSidebarVisibleToolbarAriaLabel:
	        leftSidebarVisibilityEvidence.leftSidebarVisibleToolbarAriaLabel ?? "",
	      leftSidebarVisibleNativeSymbol:
	        leftSidebarVisibilityEvidence.leftSidebarVisibleNativeSymbol ?? "",
	      leftSidebarHiddenNativeAffordance:
	        leftSidebarVisibilityEvidence.leftSidebarHiddenNativeAffordance ?? "",
	      leftSidebarHiddenSidebarAction:
	        leftSidebarVisibilityEvidence.leftSidebarHiddenSidebarAction ?? "",
	      leftSidebarHiddenToolbarTitle:
	        leftSidebarVisibilityEvidence.leftSidebarHiddenToolbarTitle ?? "",
	      leftSidebarHiddenToolbarAriaLabel:
	        leftSidebarVisibilityEvidence.leftSidebarHiddenToolbarAriaLabel ?? "",
	      leftSidebarHiddenNativeSymbol:
	        leftSidebarVisibilityEvidence.leftSidebarHiddenNativeSymbol ?? "",
	      leftSidebarRestoredNativeAffordance:
	        leftSidebarVisibilityEvidence.leftSidebarRestoredNativeAffordance ?? "",
	      leftSidebarRestoredSidebarAction:
	        leftSidebarVisibilityEvidence.leftSidebarRestoredSidebarAction ?? "",
	      infoOptionalSectionEvidence: Boolean(infoOptionalEvidence.infoOptionalSectionEvidence),
	      infoTabActivated: Boolean(infoOptionalEvidence.infoTabActivated),
	      infoDirectionsSectionVisible: Boolean(infoOptionalEvidence.infoDirectionsSectionVisible),
	      infoLinksSectionVisible: Boolean(infoOptionalEvidence.infoLinksSectionVisible),
	      infoDirectionsText: infoOptionalEvidence.infoDirectionsText ?? "",
	      infoLinksText: infoOptionalEvidence.infoLinksText ?? "",
      previewFrameHidden: Boolean(document.querySelector("#preview-frame")?.hidden),
		      rightSidebarHidden: Boolean(document.querySelector("#right-sidebar")?.hidden),
		      rightSidebarResizeHandlePresent: Boolean(document.querySelector("#right-sidebar-resize-handle")),
		      rightSidebarInitialWidth: rightSidebarResizeEvidence.rightSidebarInitialWidth ?? null,
		      rightSidebarResizedWidth: rightSidebarResizeEvidence.rightSidebarResizedWidth ?? null,
		      rightSidebarMaxWidth: rightSidebarResizeEvidence.rightSidebarMaxWidth ?? null,
		      rightSidebarResizeObserved: Boolean(rightSidebarResizeEvidence.rightSidebarResizeObserved),
		      xtermTerminalPresent: Boolean(terminalSurface?.querySelector(".xterm")),
	      terminalText: window.__wikiwiseTerminalText || terminalLineText || textFor("#terminal-surface"),
	      errorText: textFor("#error-message")
	    };
  })()`, true);
}

function screenshotStats(image) {
  const size = image.getSize();
  const bitmap = image.toBitmap();
  const first = [bitmap[0], bitmap[1], bitmap[2], bitmap[3]];
  let differentFromFirstPixelCount = 0;
  let opaquePixelCount = 0;

  for (let index = 0; index < bitmap.length; index += 4) {
    if (bitmap[index + 3] > 0) {
      opaquePixelCount += 1;
    }
    if (
      bitmap[index] !== first[0] ||
      bitmap[index + 1] !== first[1] ||
      bitmap[index + 2] !== first[2] ||
      bitmap[index + 3] !== first[3]
    ) {
      differentFromFirstPixelCount += 1;
    }
  }

  return {
    width: size.width,
    height: size.height,
    opaquePixelCount,
    differentFromFirstPixelCount
  };
}

function assertScenario(scenario, dom, screenshot) {
  const failures = [];
  const bodyText = dom.bodyText ?? "";

  if (dom.documentTitle !== "Wikiwise") {
    failures.push(`Expected document title Wikiwise, got ${dom.documentTitle}`);
  }
  if (dom.resourcePanelPresent || /Shared resources/i.test(bodyText)) {
    failures.push("Shared resource debug panel is visible.");
  }
  if (dom.rootAppearance !== scenario.appearanceMode) {
    failures.push(`Renderer root appearance is ${dom.rootAppearance}, expected ${scenario.appearanceMode}.`);
  }
  if (!dom.appearancePaletteEvidence) {
    failures.push(`Appearance palette evidence is missing for ${scenario.appearanceMode}.`);
  }
  if (scenario.appearanceMode === "Dark" && !dom.darkAppearancePaletteEvidence) {
    failures.push("Dark appearance palette is not active.");
  }
  if (!dom.publishDialogHidden || !dom.newWikiDialogHidden) {
    failures.push("A modal dialog is visible without user action.");
  }
  if ((dom.shellRect?.width ?? 0) < viewport.width || (dom.shellRect?.height ?? 0) < viewport.height) {
    failures.push(`Shell viewport is too small: ${JSON.stringify(dom.shellRect)}`);
  }
  if (screenshot.width < viewport.width || screenshot.height < viewport.height) {
    failures.push(`Screenshot is smaller than viewport: ${screenshot.width}x${screenshot.height}`);
  }
  if (screenshot.differentFromFirstPixelCount < 1000) {
    failures.push("Screenshot appears blank or single-color.");
  }

  if (scenario.kind === "welcome") {
    if (dom.welcomeHidden || !dom.projectHidden) {
      failures.push("Welcome scenario did not render the no-folder state.");
    }
    if (
      !dom.welcomeToolbarEvidence ||
      !dom.welcomeToolbarVisible ||
      (dom.welcomeToolbarRect?.width ?? 0) <= 0 ||
      (dom.welcomeToolbarRect?.height ?? 0) <= 0
    ) {
      failures.push("Welcome toolbar brand evidence is missing.");
    }
    if (dom.welcomeToolbarMarkText !== "W" || dom.welcomeToolbarTitleText !== "WikiWise") {
      failures.push("Welcome toolbar brand text does not match native.");
    }
    for (const expectedText of [
      "WikiWise helps you turn any folder",
      "Create a New Wiki",
      "Open Existing Folder",
      "Claude Code, Codex, or Cursor"
    ]) {
      if (!bodyText.includes(expectedText)) {
        failures.push(`Missing welcome text: ${expectedText}`);
      }
    }
  } else if (scenario.kind === "new-wiki") {
    if (!dom.welcomeHidden || dom.projectHidden) {
      failures.push("New-wiki scenario did not open the created project.");
    }
    if (!dom.newWikiRuntimeEvidence) {
      failures.push("New-wiki runtime evidence is missing.");
    }
    if (
      !dom.newWikiDialogEvidence ||
      dom.newWikiDialogTitle !== "Create a New Wiki" ||
      !dom.newWikiNameInputPresent ||
      dom.newWikiChooseLabel !== "Choose…" ||
      dom.newWikiCancelLabel !== "Cancel" ||
      dom.newWikiConfirmLabel !== "Create" ||
      !dom.newWikiCreateDisabledWhenEmpty ||
      !dom.newWikiCreateEnabledWhenNamed ||
      (dom.newWikiDialogRect?.width ?? 0) < 390
    ) {
      failures.push("New-wiki dialog did not match native creation sheet behavior.");
    }
    if (
      !dom.newWikiCreatedScaffoldEvidence ||
      !dom.newWikiCreatedHomeExists ||
      !dom.newWikiCreatedSettingsExists ||
      !dom.newWikiCreatedProjectRoot
    ) {
      failures.push("Runtime new-wiki scaffold was not created.");
    }
    if (
      !dom.newWikiProjectOpened ||
      dom.projectName !== dom.newWikiCreatedProjectName ||
      !dom.newWikiProjectWatcherStarted ||
      !dom.newWikiTerminalStarted
    ) {
      failures.push("Runtime new-wiki project did not open with services started.");
    }
    if (
      !dom.newWikiPostCreateGuideVisible ||
      dom.newWikiGuideTitle !== "Your wiki is ready" ||
      !dom.newWikiGuideSummaryVisible ||
      !dom.newWikiGuideTerminalInstructionVisible ||
      !dom.newWikiGuideCommandEvidence ||
      dom.newWikiSeedOptionCount !== 4 ||
      dom.newWikiDismissActionLabel !== "Got it — start reading"
    ) {
      failures.push("Runtime new-wiki post-create guide did not render.");
    }
    if (
      !dom.newWikiDismissedGuide ||
      !dom.newWikiHomeSelectedAfterDismiss ||
      dom.selectedFileLabel !== "home.md" ||
      !dom.newWikiPreviewVisibleAfterDismiss
    ) {
      failures.push("Runtime new-wiki guide dismissal did not select home.");
    }
  } else if (scenario.kind === "standalone-file") {
    if (dom.welcomeHidden !== true || dom.projectHidden !== false) {
      failures.push("Standalone file scenario did not render the project shell.");
    }
    if (!dom.standaloneFileEvidence || dom.selectedFileLabel !== "standalone.md") {
      failures.push("Standalone file runtime evidence is missing.");
    }
    if (!dom.standaloneFileTreeEmpty) {
      failures.push("Standalone file tree is not empty.");
    }
    if (!dom.standaloneFileWatcherStopped || !dom.standaloneFileTerminalStopped) {
      failures.push("Standalone file project services started.");
    }
    if (!dom.standaloneFilePublishDisabled) {
      failures.push("Standalone file publish action is enabled.");
    }
    if (!dom.standaloneFileGeneratedMapStayedHidden || !dom.standaloneFileGeneratedMapServiceStopped) {
      failures.push("Standalone file generated map flow ran.");
    }
  } else {
    if (!dom.welcomeHidden || dom.projectHidden) {
      failures.push("Project scenario did not render the opened-project state.");
    }
    if (!dom.backgroundCompilationComplete) {
      failures.push("Background compilation did not complete.");
    }
    if (dom.projectName !== "runtime-audit-wiki") {
      failures.push(`Unexpected project name: ${dom.projectName}`);
    }
    if (dom.toolbarProjectName !== "runtime-audit-wiki") {
      failures.push(`Unexpected toolbar project name: ${dom.toolbarProjectName}`);
    }
    if (
      !dom.toolbarIconEvidence ||
      !["circle.lefthalf.filled", "sun.max.fill", "moon.fill"].includes(dom.appearanceNativeSymbol) ||
      dom.mapNativeSymbol !== "map" ||
      dom.leftSidebarNativeSymbol !== "sidebar.left" ||
      dom.rightSidebarNativeSymbol !== "sidebar.right"
    ) {
      failures.push("Toolbar native symbol evidence is missing.");
    }
    if (dom.toolbarIconTextVisible) {
      failures.push("Toolbar icon text is visible.");
    }
    if (!dom.projectViewportBounded) {
      failures.push(`Project shell exceeds viewport: ${JSON.stringify(dom.projectRect)}`);
    }
    if (dom.selectedFileLabel !== "home.md") {
      failures.push(`Unexpected selected document: ${dom.selectedFileLabel}`);
    }
    if (dom.detailHeaderVisible || dom.detailSaveChromeTextVisible) {
      failures.push("Non-native detail save chrome is visible.");
    }
    if (!dom.defaultWikiPreviewEvidence) {
      failures.push("Default WIKI preview evidence is missing.");
    }
    if (!dom.defaultWikiModeSelected || dom.defaultFileModeSelected) {
      failures.push("Markdown detail did not default to WIKI mode.");
    }
    if (!dom.defaultWikiPreviewVisible || !dom.defaultWikiPreviewSrc) {
      failures.push("Compiled preview frame is not visible before switching to editor mode.");
    }
    if (!dom.defaultWikiEditorHidden) {
      failures.push("Source editor is visible before switching to editor mode.");
    }
    if (!dom.previewScrollEvidence) {
      failures.push("Preview scroll preservation evidence is missing.");
    }
    if (!dom.previewScrollFrameScrollable) {
      failures.push("Compiled preview frame could not scroll.");
    }
    if (!dom.previewScrollWithinTolerance) {
      failures.push("Compiled preview scroll was not restored.");
    }
    if (!dom.generatedMapEvidence) {
      failures.push("Generated map runtime evidence is missing.");
    }
    if (!dom.generatedMapControlPresent || !dom.generatedMapBackControlPresent) {
      failures.push("Generated map toolbar control is missing.");
    }
    if (
      !dom.generatedMapFrameVisible ||
      dom.generatedMapName !== "map-3d.html" ||
      !/map-3d\.html(?:$|[?#])/.test(dom.generatedMapFrameSrc)
    ) {
      failures.push("Generated map page did not render.");
    }
    if (!dom.generatedMapBackRestoredMarkdown || dom.generatedMapBackSelectedFileLabel !== "home.md") {
      failures.push("Generated map back navigation did not restore markdown.");
    }
    if (!dom.previewNavigationRuntimeEvidence) {
      failures.push("Preview navigation runtime evidence is missing.");
    }
    if (!dom.previewNavigationLinkPresent) {
      failures.push("Preview local link was not available in the audit preview.");
    }
    if (
      !dom.previewNavigationResolveObserved ||
      dom.previewNavigationResolvedKind !== "file" ||
      dom.previewNavigationTargetFileName !== "index.md"
    ) {
      failures.push("Preview local link did not resolve through preload.");
    }
    if (
      !dom.previewNavigationTargetSelected ||
      dom.previewNavigationSelectedFileAfterClick !== "index.md" ||
      !dom.previewNavigationPreviewVisibleAfterClick
    ) {
      failures.push("Preview local link did not select the linked markdown file.");
    }
    if (
      !dom.previewNavigationBackRestoredMarkdown ||
      dom.previewNavigationBackSelectedFileLabel !== "home.md" ||
      !dom.previewNavigationPreviewVisibleAfterBack
    ) {
      failures.push("Preview navigation back did not restore the original markdown page.");
    }
    if (!dom.watcherRuntimeEvidence) {
      failures.push("Watcher runtime evidence is missing.");
    }
    if (!dom.watcherRuntimeStarted) {
      failures.push("Project watcher was not started through the preload bridge.");
    }
    if (
      !dom.watcherRuntimeEventSent ||
      !dom.watcherRuntimeReadFileObserved ||
      !dom.watcherRuntimeCompileObserved ||
      !dom.watcherRuntimeCompileInvalidate
    ) {
      failures.push("Runtime watcher event did not refresh the selected markdown preview.");
    }
    if (!dom.watcherRuntimeCompileReloadCSS) {
      failures.push("Runtime watcher refresh did not use CSS reload semantics.");
    }
    if (dom.watcherRuntimeSelectedFileLabel !== "home.md" || !dom.watcherRuntimePreviewVisible) {
      failures.push("Runtime watcher refresh did not preserve selected markdown state.");
    }
    if (!dom.sourceEditorFramePresent || !dom.sourceEditorFrameReady || !dom.codeMirrorEditorPresent) {
      failures.push("CodeMirror source editor did not render through the shared editor resource.");
    }
    if (!dom.expandedTreeEvidence) {
      failures.push("File tree did not show native default expansion for the wiki folder.");
    }
	    if (!dom.nestedSelectionEvidence || !dom.activeFileObserved) {
	      failures.push("Nested file selection did not update selected tree state and active-file IPC evidence.");
	    }
	    if (!dom.fileTreeFolderIconPresent) {
	      failures.push("File tree folder icons are missing.");
	    }
	    if (!dom.fileTreeSpecialFolderMarkerPresent) {
	      failures.push("File tree special folder marker is missing.");
	    }
	    if (!dom.fileTreeSelectedAccentPresent) {
	      failures.push("File tree selected accent is missing.");
	    }
	    if (!dom.leftSidebarTogglePresent) {
	      failures.push("Left sidebar toggle control is missing.");
	    }
	    if (!dom.leftSidebarResizeHandlePresent) {
	      failures.push("Left sidebar resize handle is missing.");
	    }
	    if (dom.leftSidebarInitialWidth !== 200 || dom.leftSidebarNativeIdealWidth !== 200) {
	      failures.push("Left sidebar initial width does not match native ideal.");
	    }
	    if (!dom.leftSidebarResizeObserved) {
	      failures.push("Left sidebar width did not change after drag.");
	    }
	    if (
	      dom.leftSidebarNativeMinWidth !== 110 ||
	      dom.leftSidebarNativeMaxWidth !== 360 ||
	      !Number.isFinite(dom.leftSidebarResizedWidth) ||
	      dom.leftSidebarResizedWidth < 110 ||
	      dom.leftSidebarResizedWidth > 360
	    ) {
	      failures.push("Left sidebar resized width violates native constraints.");
	    }
	    if (
	      Number.isFinite(dom.leftSidebarResizedWidth) &&
	      Number.isFinite(dom.leftSidebarResizedTitleOffset) &&
	      Math.abs(dom.leftSidebarResizedTitleOffset - (-Math.round(dom.leftSidebarResizedWidth / 2))) > 1
	    ) {
	      failures.push("Toolbar title offset does not match resized left sidebar.");
	    }
	    if (!dom.leftSidebarInitiallyVisible) {
	      failures.push("Left sidebar is not initially visible.");
	    }
	    if (!dom.leftSidebarHiddenAfterToggle) {
	      failures.push("Left sidebar did not hide after toggle.");
	    }
	    if (!dom.leftSidebarRestoredVisible) {
	      failures.push("Left sidebar did not restore after toggle.");
	    }
	    if (!dom.leftSidebarDetailExpanded) {
	      failures.push("Detail area did not expand after hiding left sidebar.");
	    }
	    if (
	      dom.leftSidebarVisibleNativeAffordance !== "system-split-view-toggle" ||
	      dom.leftSidebarVisibleSidebarAction !== "hide" ||
	      dom.leftSidebarVisibleToolbarTitle !== "Hide Sidebar" ||
	      dom.leftSidebarVisibleToolbarAriaLabel !== "Hide Sidebar" ||
	      dom.leftSidebarVisibleNativeSymbol !== "sidebar.left"
	    ) {
	      failures.push("Visible split-view toolbar affordance metadata is missing.");
	    }
	    if (
	      dom.leftSidebarHiddenNativeAffordance !== "custom-restore-control" ||
	      dom.leftSidebarHiddenSidebarAction !== "show" ||
	      dom.leftSidebarHiddenToolbarTitle !== "Show Sidebar" ||
	      dom.leftSidebarHiddenToolbarAriaLabel !== "Show Sidebar" ||
	      dom.leftSidebarHiddenNativeSymbol !== "sidebar.left"
	    ) {
	      failures.push("Hidden split-view toolbar affordance metadata is missing.");
	    }
	    if (!dom.leftSidebarSelectionPreserved || !dom.leftSidebarExpansionPreserved) {
	      failures.push("Left sidebar tree state was not preserved after restore.");
	    }
	    const titleOffsetMatches = (actual, expected) =>
	      Number.isFinite(actual) &&
	      Number.isFinite(expected) &&
	      Math.abs(actual - expected) <= 1;
	    if (!dom.toolbarTitleOffsetEvidence) {
	      failures.push("Toolbar title offset evidence is missing.");
	    } else {
	      if (
	        !titleOffsetMatches(dom.toolbarTitleInitialOffset, dom.toolbarTitleExpectedVisibleOffset) ||
	        !titleOffsetMatches(dom.toolbarTitleRestoredOffset, dom.toolbarTitleExpectedVisibleOffset)
	      ) {
	        failures.push("Toolbar title offset does not match native left-sidebar compensation.");
	      }
	      if (!titleOffsetMatches(dom.toolbarTitleHiddenOffset, 0)) {
	        failures.push("Toolbar title offset did not reset while left sidebar was hidden.");
	      }
	    }
	    if (!dom.infoOptionalSectionEvidence || !dom.infoTabActivated) {
	      failures.push("Info optional section evidence is missing.");
	    }
	    if (dom.infoDirectionsSectionVisible) {
	      failures.push("Empty directions section is visible.");
	    }
	    if (dom.infoLinksSectionVisible) {
	      failures.push("Empty linked section is visible.");
	    }
	    if (/\bNone\b/.test(`${dom.infoDirectionsText}\n${dom.infoLinksText}`)) {
	      failures.push("Empty optional info placeholder text is visible.");
	    }
	    if (dom.sourceEditorFrameHidden) {
	      failures.push("Source editor frame is hidden.");
	    }
    if (!dom.previewFrameHidden) {
      failures.push("Compiled preview frame is visible during editor audit mode.");
    }
	    if (dom.rightSidebarHidden) {
	      failures.push("Right sidebar is hidden.");
	    }
		    if (!dom.rightSidebarResizeHandlePresent) {
		      failures.push("Right sidebar resize handle is missing.");
		    }
		    if (!dom.rightSidebarResizeObserved) {
		      failures.push("Right sidebar width did not change after drag.");
		    }
		    if (Number.isFinite(dom.rightSidebarResizedWidth) && dom.rightSidebarResizedWidth < 200) {
		      failures.push(`Right sidebar width is below native minimum: ${dom.rightSidebarResizedWidth}`);
		    }
		    if (
		      Number.isFinite(dom.rightSidebarResizedWidth) &&
		      Number.isFinite(dom.rightSidebarMaxWidth) &&
		      dom.rightSidebarResizedWidth > dom.rightSidebarMaxWidth + 1
		    ) {
		      failures.push(
		        `Right sidebar width exceeds native maximum: ${dom.rightSidebarResizedWidth}/${dom.rightSidebarMaxWidth}`
		      );
		    }
	    if (!dom.xtermTerminalPresent) {
	      failures.push("Terminal panel did not render an xterm terminal surface.");
	    }
	    if (!dom.terminalResizeObserved) {
	      failures.push("Terminal resize was not sent through the preload bridge.");
	    }
		    if (!dom.rightSidebarTerminalResizeObserved) {
		      failures.push("Terminal resize was not sent after right sidebar drag.");
		    }
	    if (!dom.terminalInputObserved) {
	      failures.push("Terminal input was not sent through the preload bridge.");
	    }
	    if (!/runtime audit ready|Starting shell/.test(dom.terminalText)) {
	      failures.push("Terminal panel did not render audit output.");
	    }
  }

  return failures;
}

function writeReport(report) {
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runElectronRuntimeAudit() {
  resetOutput();
  auditProject = createAuditProject();
  auditStandaloneFileProject = createAuditStandaloneFileProject();
  registerAuditIpcHandlers();

  const window = createAuditWindow();
  const results = [];
  try {
    for (const scenario of scenarios) {
      results.push(await runScenario(window, scenario));
    }
  } finally {
    window.destroy();
  }

  const report = {
    generatedAt: new Date().toISOString(),
    rendererHtmlPath: path.relative(repositoryRoot, rendererHtmlPath),
    preloadPath: path.relative(repositoryRoot, preloadPath),
    viewport,
    reportPath: path.relative(repositoryRoot, reportPath),
    scenarios: results
  };

  writeReport(report);

  console.log(`Runtime audit report: ${report.reportPath}`);
  console.log(`Runtime audit screenshots: ${path.relative(repositoryRoot, screenshotRoot)}`);
  for (const result of results) {
    console.log(`${result.ok ? "PASS" : "FAIL"} ${result.name}: ${result.screenshotPath}`);
  }

  const failures = results.flatMap((result) => (
    result.assertions.map((assertion) => `${result.name}: ${assertion}`)
  ));
  if (failures.length > 0) {
    throw new Error(`Runtime audit failed:\n${failures.join("\n")}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.error("Run this audit through `npm run electron:audit:runtime`.");
  process.exit(1);
}
