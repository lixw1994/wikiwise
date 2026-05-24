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
const viewport = Object.freeze({ width: 1180, height: 780 });
const scenarios = Object.freeze([
  { name: "welcome-light", kind: "welcome", appearanceMode: "Light" },
  { name: "welcome-dark", kind: "welcome", appearanceMode: "Dark" },
  { name: "project-light", kind: "project", appearanceMode: "Light" },
  { name: "project-dark", kind: "project", appearanceMode: "Dark" }
]);

let activeScenario = null;
let auditProject = null;
let terminalResizeObserved = false;
let terminalResizeCount = 0;
let terminalInputObserved = false;
let activeFileObserved = false;
let rightSidebarTerminalResizeObserved = false;
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
  const auditPreviewPath = createAuditPreviewFile();

  return {
    projectRoot,
    projectName: path.basename(projectRoot),
    tree: scanOneLevel(projectRoot),
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

function createAuditPreviewFile() {
  const previewPath = path.join(runtimeAuditRoot, "audit-preview.html");
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
    </style>
  </head>
  <body>
    <h1>Runtime Audit Wiki</h1>
    <p>Static audit preview for Electron shell parity capture.</p>
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
    return activeScenario?.kind === "project" ? auditProject : null;
  });
  ipcMain.handle("wikiwise:startProjectWatcher", () => ({ ok: true }));
  ipcMain.handle("wikiwise:stopProjectWatcher", () => ({ ok: true }));
  ipcMain.handle("wikiwise:startTerminal", (event, payload) => {
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
  ipcMain.handle("wikiwise:readFile", (_event, filePath) => readTextFile(filePath));
  ipcMain.handle("wikiwise:compilePage", (_event, payload) => {
    const compiler = new WikiCompiler({ projectRoot: payload.projectRoot, repositoryRoot });
    compiler.scanPages();
    const compiled = compiler.compileMarkdownFile(payload.filePath);
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
  ipcMain.handle("wikiwise:openGeneratedPage", () => null);
  ipcMain.handle("wikiwise:resolvePreviewNavigation", () => null);
  ipcMain.handle("wikiwise:openExternalUrl", () => ({ ok: true }));
  ipcMain.handle("wikiwise:openExisting", () => ({ canceled: true }));
  ipcMain.handle("wikiwise:getDefaultWikiLocation", () => sampleProjectParent);
  ipcMain.handle("wikiwise:chooseNewWikiLocation", () => ({ canceled: true }));
  ipcMain.handle("wikiwise:createNewWiki", () => {
    throw new Error("Runtime audit does not create user projects.");
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
  rightSidebarTerminalResizeObserved = false;
  nativeTheme.themeSource = scenario.appearanceMode.toLowerCase();
  console.log(`Running runtime audit scenario: ${scenario.name}`);

  await window.loadFile(rendererHtmlPath);
  await waitForScenario(window, scenario);
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
    await simulateLeftSidebarToggle(window);
    await delay(80);
    await window.webContents.executeJavaScript(`window.__wikiwiseTerminal?.input("echo runtime audit\\r")`, true);
  }
  await delay(120);

  const screenshotPath = path.join(screenshotRoot, `${scenario.name}.png`);
  const image = await window.webContents.capturePage();
  fs.writeFileSync(screenshotPath, image.toPNG());

  const dom = await readDomEvidence(window);
  dom.terminalResizeObserved = terminalResizeObserved;
  dom.rightSidebarTerminalResizeObserved = rightSidebarTerminalResizeObserved;
  dom.terminalInputObserved = terminalInputObserved;
  dom.activeFileObserved = activeFileObserved;
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
    const selectedTreeText = () => document.querySelector(".tree-file-button.selected")?.textContent?.trim() ?? "";
    const expandedFolderNames = () => [...document.querySelectorAll(".tree-folder-button")]
      .filter((button) => button.getAttribute("aria-expanded") === "true")
      .map((button) => button.textContent.trim());
    const isVisible = (element) => Boolean(
      element &&
      !element.hidden &&
      element.getBoundingClientRect().width > 0 &&
      element.getBoundingClientRect().height > 0
    );
    const detailWidth = () => Math.round(detail?.getBoundingClientRect().width ?? 0);

    const before = {
      visible: isVisible(leftSidebar),
      detailWidth: detailWidth(),
      selectedTreeText: selectedTreeText(),
      expandedFolderNames: expandedFolderNames()
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
        leftSidebarExpansionPreserved: false
      };
      window.__wikiwiseLeftSidebarVisibilityEvidence = missingEvidence;
      return missingEvidence;
    }

    toggle.click();
    const hidden = {
      visible: isVisible(leftSidebar),
      detailWidth: detailWidth()
    };
    toggle.click();
    const restored = {
      visible: isVisible(leftSidebar),
      selectedTreeText: selectedTreeText(),
      expandedFolderNames: expandedFolderNames()
    };
    const evidence = {
      leftSidebarTogglePresent: true,
      leftSidebarInitiallyVisible: before.visible,
      leftSidebarHiddenAfterToggle: !hidden.visible,
      leftSidebarRestoredVisible: restored.visible,
      leftSidebarInitialDetailWidth: before.detailWidth,
      leftSidebarHiddenDetailWidth: hidden.detailWidth,
      leftSidebarDetailExpanded: hidden.detailWidth > before.detailWidth,
      leftSidebarSelectionPreserved: before.selectedTreeText === restored.selectedTreeText,
      leftSidebarExpansionPreserved: before.expandedFolderNames.join("\\n") === restored.expandedFolderNames.join("\\n")
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
    error: error instanceof Error ? error.message : String(error)
  }));
}

async function waitForScenario(window, scenario) {
  const expression = scenario.kind === "project"
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
	    const textFor = (selector) => document.querySelector(selector)?.textContent?.trim() ?? "";
	    const sourceEditorFrame = document.querySelector("#source-editor-frame");
	    const sourceEditorDocument = sourceEditorFrame?.contentDocument;
	    const terminalSurface = document.querySelector("#terminal-surface");
	    const terminalLineText = window.__wikiwiseTerminal?.buffer?.active
	      ? Array.from({ length: window.__wikiwiseTerminal.buffer.active.length }, (_value, index) =>
	          window.__wikiwiseTerminal.buffer.active.getLine(index)?.translateToString(true) ?? ""
	        ).join("\\n").trim()
	      : "";
	    const rightSidebarResizeEvidence = window.__wikiwiseRightSidebarResizeEvidence ?? {};
	    const leftSidebarVisibilityEvidence = window.__wikiwiseLeftSidebarVisibilityEvidence ?? {};
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
	    return {
      documentTitle: document.title,
      bodyText: document.body.innerText,
      welcomeHidden: Boolean(document.querySelector("#welcome")?.hidden),
      projectHidden: Boolean(document.querySelector("#project")?.hidden),
      resourcePanelPresent: Boolean(document.querySelector(".resources-panel, #resource-list, #resource-count")),
      shellRect: rectFor(".shell"),
      welcomeRect: rectFor("#welcome"),
      projectRect: rectFor("#project"),
      projectName: textFor("#project-name"),
      toolbarProjectName: textFor("#toolbar-project-name"),
      selectedFileLabel: textFor("#selected-file"),
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
      expandedTreeEvidence,
      nestedSelectionEvidence,
	      leftSidebarTogglePresent: Boolean(document.querySelector("#toggle-left-sidebar")),
	      leftSidebarInitiallyVisible: Boolean(leftSidebarVisibilityEvidence.leftSidebarInitiallyVisible),
	      leftSidebarHiddenAfterToggle: Boolean(leftSidebarVisibilityEvidence.leftSidebarHiddenAfterToggle),
	      leftSidebarRestoredVisible: Boolean(leftSidebarVisibilityEvidence.leftSidebarRestoredVisible),
	      leftSidebarInitialDetailWidth: leftSidebarVisibilityEvidence.leftSidebarInitialDetailWidth ?? null,
	      leftSidebarHiddenDetailWidth: leftSidebarVisibilityEvidence.leftSidebarHiddenDetailWidth ?? null,
	      leftSidebarDetailExpanded: Boolean(leftSidebarVisibilityEvidence.leftSidebarDetailExpanded),
	      leftSidebarSelectionPreserved: Boolean(leftSidebarVisibilityEvidence.leftSidebarSelectionPreserved),
	      leftSidebarExpansionPreserved: Boolean(leftSidebarVisibilityEvidence.leftSidebarExpansionPreserved),
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
  } else {
    if (!dom.welcomeHidden || dom.projectHidden) {
      failures.push("Project scenario did not render the opened-project state.");
    }
    if (dom.projectName !== "runtime-audit-wiki") {
      failures.push(`Unexpected project name: ${dom.projectName}`);
    }
    if (dom.toolbarProjectName !== "runtime-audit-wiki") {
      failures.push(`Unexpected toolbar project name: ${dom.toolbarProjectName}`);
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
    if (!dom.sourceEditorFramePresent || !dom.sourceEditorFrameReady || !dom.codeMirrorEditorPresent) {
      failures.push("CodeMirror source editor did not render through the shared editor resource.");
    }
    if (!dom.expandedTreeEvidence) {
      failures.push("File tree did not show native default expansion for the wiki folder.");
    }
	    if (!dom.nestedSelectionEvidence || !dom.activeFileObserved) {
	      failures.push("Nested file selection did not update selected tree state and active-file IPC evidence.");
	    }
	    if (!dom.leftSidebarTogglePresent) {
	      failures.push("Left sidebar toggle control is missing.");
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
	    if (!dom.leftSidebarSelectionPreserved || !dom.leftSidebarExpansionPreserved) {
	      failures.push("Left sidebar tree state was not preserved after restore.");
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
