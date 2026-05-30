import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");

function read(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
}

function cssBlock(source, selector) {
  const pattern = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]+)\\}`);
  return source.match(pattern)?.[1] ?? "";
}

function functionSource(source, name, nextName) {
  const start = source.indexOf(`function ${name}`);
  const end = source.indexOf(`function ${nextName}`, start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  return source.slice(start, end);
}

test("main process owns app settings, appearance, restore, generated pages, and menu commands", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /Menu/);
  assert.match(mainSource, /nativeTheme/);
  assert.match(mainSource, /settings\.json/);
  assert.match(mainSource, /readAppSettings/);
  assert.match(mainSource, /writeAppSettings/);
  assert.match(mainSource, /applyAppearanceMode/);
  assert.match(mainSource, /rememberProjectRoot/);
  assert.match(mainSource, /restoreLastProject/);
  assert.match(mainSource, /openGeneratedPage/);
  assert.match(mainSource, /createApplicationMenu/);
  assert.match(mainSource, /sendAppCommand/);
  assert.match(mainSource, /wikiwise:getAppSettings/);
  assert.match(mainSource, /wikiwise:setAppearanceMode/);
  assert.match(mainSource, /wikiwise:restoreLastProject/);
  assert.match(mainSource, /wikiwise:openGeneratedPage/);
  assert.match(mainSource, /wikiwise:appCommand/);
  assert.match(mainSource, /accelerator:\s*"CommandOrControl\+\["/);
  assert.match(mainSource, /accelerator:\s*"CommandOrControl\+\]"/);
  assert.match(mainSource, /accelerator:\s*"CommandOrControl\+R"/);
});

test("startup restore is limited to the native first window scope", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /let mainWindowCreationCount = 0/);
  assert.match(mainSource, /const startupRestoreByWebContentsId = new Map\(\)/);
  assert.match(mainSource, /const shouldRestoreLastProject = mainWindowCreationCount === 0/);
  assert.match(mainSource, /mainWindowCreationCount \+= 1/);
  assert.match(mainSource, /const webContentsId = mainWindow\.webContents\.id/);
  assert.match(
    mainSource,
    /startupRestoreByWebContentsId\.set\(webContentsId,\s*shouldRestoreLastProject\)/
  );
  assert.match(
    mainSource,
    /mainWindow\.webContents\.once\("destroyed",\s*\(\) => \{[\s\S]*closeWindowScopedResources\(webContentsId\)[\s\S]*startupRestoreByWebContentsId\.delete\(webContentsId\)/
  );
  assert.match(mainSource, /function restoreLastProjectForWebContents\(webContents\)/);
  assert.match(
    mainSource,
    /if \(!startupRestoreByWebContentsId\.get\(webContents\?\.id\)\) return null/
  );
  assert.match(
    mainSource,
    /ipcMain\.handle\("wikiwise:restoreLastProject",\s*\(event\) => \{\s*return restoreLastProjectForWebContents\(event\.sender\)/
  );
});

test("file menu exposes native New Window command before Wikiwise commands", () => {
  const mainSource = read("src/main/main.js");
  const menuStart = mainSource.indexOf("function createApplicationMenu()");
  const menuEnd = mainSource.indexOf("function startProjectWatcher", menuStart);
  const menuSource = mainSource.slice(menuStart, menuEnd);

  assert.notEqual(menuStart, -1);
  assert.notEqual(menuEnd, -1);
  assert.match(
    menuSource,
    /label:\s*"File"[\s\S]*label:\s*"New Window"[\s\S]*accelerator:\s*"CommandOrControl\+N"[\s\S]*click:\s*\(\) => createMainWindow\(\)[\s\S]*label:\s*"Go Back"[\s\S]*label:\s*"Go Forward"[\s\S]*label:\s*"Refresh Page"/
  );
  assert.doesNotMatch(menuSource, /label:\s*"Open Existing Folder"/);
  assert.doesNotMatch(menuSource, /sendAppCommand\("openExisting"\)/);
  assert.doesNotMatch(menuSource, /sendAppCommand\("newWindow"\)/);
});

test("app menu navigation commands match the native File command group", () => {
  const mainSource = read("src/main/main.js");

  assert.match(
    mainSource,
    /label:\s*"File"[\s\S]*submenu:\s*\[[\s\S]*label:\s*"New Window"[\s\S]*label:\s*"Go Back"[\s\S]*accelerator:\s*"CommandOrControl\+\["[\s\S]*label:\s*"Go Forward"[\s\S]*accelerator:\s*"CommandOrControl\+\]"[\s\S]*label:\s*"Refresh Page"[\s\S]*accelerator:\s*"CommandOrControl\+R"/
  );
  assert.doesNotMatch(mainSource, /label:\s*"Open Existing Folder"[\s\S]*accelerator:\s*"CommandOrControl\+O"/);
  assert.doesNotMatch(mainSource, /label:\s*"Navigate"/);
});

test("app menu navigation and refresh commands broadcast like native global notifications", () => {
  const mainSource = read("src/main/main.js");
  const sendAppCommandSource = functionSource(mainSource, "sendAppCommand", "createApplicationMenu");
  const nativeBroadcastDeclaration =
    mainSource.match(/const nativeBroadcastAppCommands = new Set\(\[[\s\S]*?\]\);/)?.[0] ?? "";

  assert.match(nativeBroadcastDeclaration, /"goBack"/);
  assert.match(nativeBroadcastDeclaration, /"goForward"/);
  assert.match(nativeBroadcastDeclaration, /"refreshWiki"/);
  assert.doesNotMatch(nativeBroadcastDeclaration, /"openExisting"/);
  assert.match(sendAppCommandSource, /BrowserWindow\.getAllWindows\(\)/);
  assert.match(sendAppCommandSource, /for \(const targetWindow of targetWindows\)/);
  assert.match(sendAppCommandSource, /targetWindow\.webContents\.send\("wikiwise:appCommand", \{ command \}\)/);
  assert.doesNotMatch(sendAppCommandSource, /BrowserWindow\.getFocusedWindow\(\) \?\? BrowserWindow\.getAllWindows\(\)\[0\]/);
});

test("application menu preserves standard macOS app edit and window roles", () => {
  const mainSource = read("src/main/main.js");

  assert.match(
    mainSource,
    /label:\s*app\.name[\s\S]*role:\s*"about"[\s\S]*role:\s*"services"[\s\S]*role:\s*"hide"[\s\S]*role:\s*"hideOthers"[\s\S]*role:\s*"unhide"[\s\S]*role:\s*"quit"/
  );
  assert.match(
    mainSource,
    /label:\s*"Edit"[\s\S]*role:\s*"undo"[\s\S]*role:\s*"redo"[\s\S]*role:\s*"cut"[\s\S]*role:\s*"copy"[\s\S]*role:\s*"paste"[\s\S]*role:\s*"pasteAndMatchStyle"[\s\S]*role:\s*"delete"[\s\S]*role:\s*"selectAll"/
  );
  assert.match(
    mainSource,
    /label:\s*"Window"[\s\S]*role:\s*"minimize"[\s\S]*role:\s*"zoom"[\s\S]*role:\s*"front"/
  );
});

test("standard menu expansion preserves Wikiwise File and View commands", () => {
  const mainSource = read("src/main/main.js");

  assert.match(
    mainSource,
    /label:\s*"File"[\s\S]*label:\s*"New Window"[\s\S]*label:\s*"Go Back"[\s\S]*click:\s*\(\) => sendAppCommand\("goBack"\)[\s\S]*label:\s*"Go Forward"[\s\S]*click:\s*\(\) => sendAppCommand\("goForward"\)[\s\S]*label:\s*"Refresh Page"[\s\S]*click:\s*\(\) => sendAppCommand\("refreshWiki"\)[\s\S]*role:\s*"close"/
  );
  assert.doesNotMatch(mainSource, /label:\s*"Open Existing Folder"[\s\S]*click:\s*\(\) => sendAppCommand\("openExisting"\)/);
  assert.match(
    mainSource,
    /label:\s*"View"[\s\S]*submenu:\s*\[\{ role:\s*"togglefullscreen" \}\]/
  );
  assert.doesNotMatch(mainSource, /sendAppCommand\("undo"\)|sendAppCommand\("copy"\)|sendAppCommand\("minimize"\)/);
});

test("preload exposes settings, restore, generated page, and app command APIs", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(preloadSource, /getAppSettings:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:getAppSettings"\)/);
  assert.match(preloadSource, /setAppearanceMode:\s*\(mode\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:setAppearanceMode"/);
  assert.match(preloadSource, /restoreLastProject:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:restoreLastProject"\)/);
  assert.match(preloadSource, /openGeneratedPage:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:openGeneratedPage"/);
  assert.match(preloadSource, /onAppCommand:\s*\(callback\)\s*=>/);
  assert.match(preloadSource, /ipcRenderer\.on\("wikiwise:appCommand"/);
  assert.match(preloadSource, /removeListener\("wikiwise:appCommand"/);
});

test("renderer contains startup restore, appearance, toolbar, history, map, refresh, and sidebar state", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /appearanceMode:\s*"Auto"/);
  assert.match(rendererSource, /generatedPage/);
  assert.match(rendererSource, /backHistory/);
  assert.match(rendererSource, /forwardHistory/);
  assert.match(rendererSource, /isLeftSidebarVisible/);
  assert.match(rendererSource, /isRightSidebarVisible/);
  assert.match(rendererSource, /restoreLastProject/);
  assert.match(rendererSource, /loadAppSettings/);
  assert.match(rendererSource, /cycleAppearanceMode/);
  assert.match(rendererSource, /currentHistoryEntry/);
  assert.match(rendererSource, /pushHistoryEntry/);
  assert.match(rendererSource, /navigateBack/);
  assert.match(rendererSource, /navigateForward/);
  assert.match(rendererSource, /openMap/);
  assert.match(rendererSource, /refreshCurrentView/);
  assert.match(rendererSource, /toggleLeftSidebar/);
  assert.match(rendererSource, /toggleRightSidebar/);
  assert.match(rendererSource, /handleAppCommand/);
  assert.match(rendererSource, /wikiwise\.getAppSettings/);
  assert.match(rendererSource, /wikiwise\.setAppearanceMode/);
  assert.match(rendererSource, /wikiwise\.restoreLastProject/);
  assert.match(rendererSource, /wikiwise\.openGeneratedPage/);
  assert.match(rendererSource, /onAppCommand/);
});

test("renderer preserves native history when the active file is reselected", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const selectFileSource = functionSource(rendererSource, "selectFile", "setSelectedFile");

  assert.match(selectFileSource, /const isActiveFileReselect = state\.selectedFile\?\.path === node\.path/);
  assert.match(
    selectFileSource,
    /if \(options\.pushHistory !== false && !isActiveFileReselect\) \{[\s\S]*pushHistoryEntry\(currentHistoryEntry\(\)\);[\s\S]*state\.forwardHistory = \[\];[\s\S]*\}/
  );
  assert.match(selectFileSource, /state\.generatedPage = null/);
  assert.match(selectFileSource, /const content = await window\.wikiwise\.readFile\(node\.path\)/);
  assert.match(selectFileSource, /await setActiveSelectedFile\(nextFile\.path\)/);
  assert.match(selectFileSource, /await refreshDocumentInfo\(\)/);
  assert.doesNotMatch(selectFileSource, /if \(isActiveFileReselect\)\s*return/);
});

test("renderer keeps different-file and generated-page navigation on the history path", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const currentHistorySource = functionSource(rendererSource, "currentHistoryEntry", "pushHistoryEntry");
  const selectFileSource = functionSource(rendererSource, "selectFile", "setSelectedFile");
  const historyGate = selectFileSource.match(
    /if \(options\.pushHistory !== false && !isActiveFileReselect\) \{[\s\S]*?state\.forwardHistory = \[\];[\s\S]*?\}/
  )?.[0] ?? "";

  assert.match(currentHistorySource, /if \(state\.generatedPage\) \{/);
  assert.match(currentHistorySource, /kind:\s*"generated"/);
  assert.match(currentHistorySource, /if \(state\.selectedFile\) \{/);
  assert.match(currentHistorySource, /kind:\s*"file"/);
  assert.match(historyGate, /pushHistoryEntry\(currentHistoryEntry\(\)\)/);
  assert.match(historyGate, /state\.forwardHistory = \[\]/);
  assert.doesNotMatch(historyGate, /state\.generatedPage/);
  assert.doesNotMatch(historyGate, /node\.path !== state\.generatedPage/);
});

test("renderer markup and styles include native-like project toolbar controls", () => {
  const htmlSource = read("src/renderer/index.html");
  const cssSource = read("src/renderer/styles.css");

  for (const id of [
    "project-toolbar",
    "go-back",
    "go-forward",
    "toggle-left-sidebar",
    "appearance-mode",
    "open-map",
    "toggle-right-sidebar",
    "toolbar-project-name",
    "generated-preview-frame"
  ]) {
    assert.match(htmlSource, new RegExp(`id="${id}"`));
  }

  assert.match(cssSource, /\.project-toolbar/);
  assert.match(cssSource, /left-sidebar-hidden/);
  assert.match(cssSource, /\.toolbar-icon-button/);
  assert.match(cssSource, /\.toolbar-project-title/);
  assert.match(cssSource, /\.generated-preview-frame/);
  assert.match(cssSource, /\[data-appearance="Dark"\]/);
});

test("project toolbar icon controls mirror Electron macOS symbol semantics", () => {
  const htmlSource = read("src/renderer/index.html");
  const rendererSource = read("src/renderer/renderer.js");
  const cssSource = read("src/renderer/styles.css");


  assert.doesNotMatch(htmlSource, /id="appearance-mode"[\s\S]*?>\s*(Auto|Light|Dark)\s*<\/button>/);
  assert.doesNotMatch(htmlSource, /id="open-map"[\s\S]*?>\s*Map\s*<\/button>/);
  assert.match(htmlSource, /class="toolbar-symbol"/);
  assert.match(htmlSource, /data-native-symbol="circle\.lefthalf\.filled"/);
  assert.match(htmlSource, /data-native-symbol="map"/);
  assert.match(htmlSource, /data-native-symbol="sidebar\.left"/);
  assert.match(htmlSource, /data-native-symbol="sidebar\.right"/);

  assert.match(rendererSource, /function setToolbarButtonSymbol/);
  assert.match(rendererSource, /nativeSymbol:\s*"circle\.lefthalf\.filled"/);
  assert.match(rendererSource, /nativeSymbol:\s*"sun\.max\.fill"/);
  assert.match(rendererSource, /nativeSymbol:\s*"moon\.fill"/);
  assert.match(rendererSource, /nativeSymbol:\s*"map"/);
  assert.match(rendererSource, /nativeSymbol:\s*"sidebar\.left"/);
  assert.match(rendererSource, /nativeSymbol:\s*"sidebar\.right"/);
  assert.match(rendererSource, /button\.setAttribute\("aria-label",\s*symbol\.label\)/);
  assert.match(rendererSource, /button\.title\s*=\s*symbol\.label/);

  assert.match(cssSource, /\.toolbar-symbol/);
});

test("project toolbar icon controls mirror native symbol font sizes", () => {
  const cssSource = read("src/renderer/styles.css");
  const appearanceBlock = cssBlock(cssSource, "#appearance-mode");
  const mapBlock = cssBlock(cssSource, "#open-map");
  const leftSidebarBlock = cssBlock(cssSource, "#toggle-left-sidebar");
  const rightSidebarBlock = cssBlock(cssSource, "#toggle-right-sidebar");


  assert.match(appearanceBlock, /font-size:\s*13px/);
  assert.match(mapBlock, /font-size:\s*12px/);
  assert.match(leftSidebarBlock, /font-size:\s*14px/);
  assert.match(rightSidebarBlock, /font-size:\s*16px/);
});

test("project toolbar icon controls mirror native plain button chrome", () => {
  const cssSource = read("src/renderer/styles.css");
  const toolbarIconBlock = cssBlock(cssSource, ".toolbar-icon-button");
  const modeButtonBlock = cssBlock(cssSource, ".mode-button");
  const publishButtonBlock = cssBlock(cssSource, ".publish-button");


  assert.match(toolbarIconBlock, /border:\s*0/);
  assert.match(toolbarIconBlock, /border-radius:\s*0/);
  assert.doesNotMatch(toolbarIconBlock, /border:\s*1px solid/);
  assert.doesNotMatch(toolbarIconBlock, /border-radius:\s*6px/);
  assert.match(modeButtonBlock, /border:\s*1px solid var\(--color-sidebar-rule\)/);
  assert.match(publishButtonBlock, /border:\s*1px solid var\(--color-sidebar-rule\)/);
  assert.match(publishButtonBlock, /border-radius:\s*3px/);
});

test("project toolbar icon controls mirror native intrinsic plain sizing", () => {
  const cssSource = read("src/renderer/styles.css");
  const toolbarIconBlock = cssBlock(cssSource, ".toolbar-icon-button");
  const modeButtonBlock = cssBlock(cssSource, ".mode-button");
  const publishButtonBlock = cssBlock(cssSource, ".publish-button");

  assert.match(toolbarIconBlock, /min-width:\s*0/);
  assert.match(toolbarIconBlock, /inline-size:\s*auto/);
  assert.match(toolbarIconBlock, /block-size:\s*auto/);
  assert.match(toolbarIconBlock, /padding:\s*0/);
  assert.doesNotMatch(toolbarIconBlock, /min-width:\s*34px/);
  assert.doesNotMatch(toolbarIconBlock, /inline-size:\s*34px/);
  assert.doesNotMatch(toolbarIconBlock, /block-size:\s*31px/);
  assert.doesNotMatch(toolbarIconBlock, /padding:\s*6px 9px/);
  assert.match(modeButtonBlock, /padding:\s*4px 10px/);
  assert.match(publishButtonBlock, /padding:\s*4px 10px/);
});

test("project toolbar mode switch mirrors native segmented styling", () => {
  const cssSource = read("src/renderer/styles.css");
  const modeSwitchBlock = cssBlock(cssSource, ".mode-switch");
  const modeButtonBlock = cssBlock(cssSource, ".mode-button");
  const selectedModeButtonBlock = cssBlock(cssSource, ".mode-button.selected");
  const firstModeButtonBlock = cssBlock(cssSource, ".mode-button:first-child");
  const lastModeButtonBlock = cssBlock(cssSource, ".mode-button:last-child");
  const publishButtonBlock = cssBlock(cssSource, ".publish-button");

  assert.match(modeSwitchBlock, /border:\s*0/);
  assert.match(modeSwitchBlock, /border-radius:\s*0/);
  assert.match(modeSwitchBlock, /background:\s*transparent/);
  assert.match(modeButtonBlock, /border:\s*1px solid var\(--color-sidebar-rule\)/);
  assert.match(modeButtonBlock, /font-family:\s*ui-monospace,\s*"SFMono-Regular",\s*Menlo,\s*monospace/);
  assert.match(modeButtonBlock, /font-size:\s*10px/);
  assert.match(modeButtonBlock, /letter-spacing:\s*0\.8px/);
  assert.match(modeButtonBlock, /padding:\s*4px 10px/);
  assert.match(modeButtonBlock, /color:\s*var\(--color-sidebar-text-muted\)/);
  assert.match(selectedModeButtonBlock, /background:\s*var\(--color-sidebar-selected-bg\)/);
  assert.match(selectedModeButtonBlock, /color:\s*var\(--color-sidebar-selected-text\)/);
  assert.match(firstModeButtonBlock, /border-radius:\s*3px 0 0 3px/);
  assert.match(lastModeButtonBlock, /border-radius:\s*0 3px 3px 0/);
  assert.match(publishButtonBlock, /font-size:\s*10px/);
});

test("project toolbar mode switch mirrors native enabled behavior", () => {
  const htmlSource = read("src/renderer/index.html");
  const rendererSource = read("src/renderer/renderer.js");


  assert.doesNotMatch(htmlSource, /id="mode-file"[^>]*\sdisabled\b/);
  assert.doesNotMatch(htmlSource, /id="mode-wiki"[^>]*\sdisabled\b/);
  assert.doesNotMatch(rendererSource, /modeFileButton\.disabled\s*=/);
  assert.doesNotMatch(rendererSource, /modeWikiButton\.disabled\s*=/);
  assert.match(rendererSource, /modeWikiButton\.classList\.toggle\("selected",\s*state\.detailMode === "wiki"\)/);
  assert.doesNotMatch(rendererSource, /modeWikiButton\.classList\.toggle\("selected",\s*state\.detailMode === "wiki" && wikiAvailable\)/);
  assert.match(rendererSource, /const shouldShowSourceEditor =/);
  assert.match(rendererSource, /state\.detailMode === "wiki" && !wikiAvailable/);
  assert.match(rendererSource, /sourceEditorFrame\.hidden = !shouldShowSourceEditor/);
  assert.match(rendererSource, /previewFrame\.hidden = !shouldShowPreview/);
  assert.match(
    rendererSource,
    /else if \(hasGeneratedPage\)[\s\S]*generatedPreviewFrame\.src = state\.generatedPage\.fileUrl/
  );
});

test("left sidebar toolbar control mirrors native restore help text", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /function leftSidebarButtonHelpText\(\)/);
  assert.match(rendererSource, /state\.isLeftSidebarVisible\s*\?\s*"Hide Sidebar"\s*:\s*"Show Sidebar"/);
  assert.match(rendererSource, /const leftSidebarHelpText = leftSidebarButtonHelpText\(\)/);
  assert.match(rendererSource, /toggleLeftSidebarButton\.title = leftSidebarHelpText/);
  assert.match(
    rendererSource,
    /toggleLeftSidebarButton\.setAttribute\("aria-label",\s*leftSidebarHelpText\)/
  );
  assert.doesNotMatch(rendererSource, /label:\s*"Toggle left sidebar"/);
});

test("left sidebar toolbar control exposes native split-view affordance states", () => {
  const rendererSource = read("src/renderer/renderer.js");


  assert.match(rendererSource, /function leftSidebarNativeAffordance\(\)/);
  assert.match(
    rendererSource,
    /state\.isLeftSidebarVisible\s*\?\s*"system-split-view-toggle"\s*:\s*"custom-restore-control"/
  );
  assert.match(rendererSource, /function leftSidebarAction\(\)/);
  assert.match(rendererSource, /state\.isLeftSidebarVisible\s*\?\s*"hide"\s*:\s*"show"/);
  assert.match(
    rendererSource,
    /toggleLeftSidebarButton\.dataset\.nativeAffordance = leftSidebarNativeAffordance\(\)/
  );
  assert.match(
    rendererSource,
    /toggleLeftSidebarButton\.dataset\.sidebarAction = leftSidebarAction\(\)/
  );
});

test("sidebar toolbar toggles mirror native plain icon color states", () => {
  const cssSource = read("src/renderer/styles.css");
  const selectedToolbarIconBlock = cssBlock(cssSource, ".toolbar-icon-button.selected");
  const hiddenLeftToggleBlock = cssBlock(cssSource, "#toggle-left-sidebar:not(.selected)");
  const hiddenRightToggleBlock = cssBlock(cssSource, "#toggle-right-sidebar:not(.selected)");

  assert.match(selectedToolbarIconBlock, /background:\s*transparent/);
  assert.match(selectedToolbarIconBlock, /color:\s*var\(--color-toolbar-text\)/);
  assert.doesNotMatch(selectedToolbarIconBlock, /var\(--color-sidebar-selected-bg\)/);
  assert.doesNotMatch(selectedToolbarIconBlock, /var\(--color-sidebar-selected-text\)/);
  assert.match(hiddenLeftToggleBlock, /color:\s*var\(--color-toolbar-disabled\)/);
  assert.match(hiddenRightToggleBlock, /color:\s*var\(--color-toolbar-disabled\)/);
});

test("left sidebar toolbar visibility toggle mirrors native layout animation", () => {
  const cssSource = read("src/renderer/styles.css");
  const projectShellBlock = cssBlock(cssSource, ".project-shell");
  const hiddenLeftSidebarBlock = cssBlock(cssSource, ".project-shell.left-sidebar-hidden");
  const hiddenBothSidebarsBlock = cssBlock(
    cssSource,
    ".project-shell.left-sidebar-hidden.right-sidebar-hidden"
  );
  const hiddenLeftDetailBlock = cssBlock(cssSource, ".project-shell.left-sidebar-hidden .detail");
  const hiddenLeftRightSidebarBlock = cssBlock(
    cssSource,
    ".project-shell.left-sidebar-hidden .right-sidebar"
  );

  assert.match(projectShellBlock, /transition:\s*grid-template-columns 200ms ease-in-out/);
  assert.match(
    hiddenLeftSidebarBlock,
    /grid-template-columns:\s*0px\s+minmax\(0,\s*1fr\)\s+var\(--right-sidebar-width\)/
  );
  assert.match(
    hiddenBothSidebarsBlock,
    /grid-template-columns:\s*0px\s+minmax\(0,\s*1fr\)\s+0px/
  );
  assert.match(hiddenLeftDetailBlock, /grid-column:\s*2/);
  assert.match(hiddenLeftRightSidebarBlock, /grid-column:\s*3/);
});

test("right sidebar toolbar visibility toggle mirrors native layout animation", () => {
  const cssSource = read("src/renderer/styles.css");
  const projectShellBlock = cssBlock(cssSource, ".project-shell");
  const hiddenRightSidebarBlock = cssBlock(cssSource, ".project-shell.right-sidebar-hidden");
  const hiddenBothSidebarsBlock = cssBlock(
    cssSource,
    ".project-shell.left-sidebar-hidden.right-sidebar-hidden"
  );

  assert.match(projectShellBlock, /transition:\s*grid-template-columns 200ms ease-in-out/);
  assert.match(
    hiddenRightSidebarBlock,
    /grid-template-columns:\s*var\(--left-sidebar-width\)\s+minmax\(0,\s*1fr\)\s+0px/
  );
  assert.match(
    hiddenBothSidebarsBlock,
    /grid-template-columns:\s*0px\s+minmax\(0,\s*1fr\)\s+0px/
  );
});

test("active sidebar resize bypasses visibility animation", () => {
  const cssSource = read("src/renderer/styles.css");
  const projectShellBlock = cssBlock(cssSource, ".project-shell");
  const resizeTransitionBypassMatch = cssSource.match(
    /body\.resizing-left-sidebar\s+\.project-shell,\s*body\.resizing-right-sidebar\s+\.project-shell\s*\{([^}]+)\}/
  );

  assert.match(projectShellBlock, /transition:\s*grid-template-columns 200ms ease-in-out/);
  assert.ok(resizeTransitionBypassMatch, "Expected resize-specific project-shell transition bypass");
  assert.match(resizeTransitionBypassMatch[1], /transition:\s*none/);
});

test("project toolbar groups mirror native horizontal spacing", () => {
  const cssSource = read("src/renderer/styles.css");
  const toolbarGroupBlock = cssBlock(cssSource, ".toolbar-group");
  const toolbarGroupEndBlock = cssBlock(cssSource, ".toolbar-group-end");

  assert.match(toolbarGroupBlock, /gap:\s*14px/);
  assert.match(toolbarGroupEndBlock, /gap:\s*10px/);
  assert.doesNotMatch(toolbarGroupBlock, /gap:\s*8px/);
});

test("project toolbar navigation arrows mirror native typography and disabled color", () => {
  const cssSource = read("src/renderer/styles.css");
  const backBlock = cssBlock(cssSource, "#go-back");
  const forwardBlock = cssBlock(cssSource, "#go-forward");
  const disabledNavigationBlock = cssBlock(cssSource, "#go-back:disabled, #go-forward:disabled");

  for (const block of [backBlock, forwardBlock]) {
    assert.match(block, /font-family:\s*ui-monospace,\s*"SFMono-Regular",\s*Menlo,\s*monospace/);
    assert.match(block, /font-size:\s*16px/);
    assert.match(block, /font-weight:\s*400/);
    assert.match(block, /color:\s*var\(--color-toolbar-text\)/);
  }
  assert.match(disabledNavigationBlock, /color:\s*var\(--color-toolbar-disabled\)/);
  assert.match(disabledNavigationBlock, /opacity:\s*1/);
});

test("renderer styles wire native adaptive palette tokens into visible shell surfaces", () => {
  const cssSource = read("src/renderer/styles.css");

  for (const token of [
    "sidebar-bg",
    "sidebar-text",
    "sidebar-selected-text",
    "sidebar-rule",
    "content-bg",
    "detail-bg",
    "accent-primary",
    "accent-primary-text",
    "toolbar-text",
    "tab-active-bg"
  ]) {
    assert.match(cssSource, new RegExp(`--color-${token}:`));
  }

  assert.match(cssSource, /:root\[data-appearance="Dark"\][^{]*{[\s\S]*--color-sidebar-bg:\s*#0e0c08/i);
  assert.match(cssSource, /:root\[data-appearance="Dark"\][^{]*{[\s\S]*--color-content-bg:\s*#1e1b14/i);
  assert.match(cssSource, /:root\[data-appearance="Dark"\][^{]*{[\s\S]*--color-sidebar-selected-text:\s*#f4eacf/i);
  assert.match(cssSource, /:root\[data-appearance="Dark"\][^{]*{[\s\S]*--color-sidebar-rule:\s*#3a3428/i);
  assert.match(cssSource, /:root\[data-appearance="Dark"\][^{]*{[\s\S]*--color-toolbar-text:\s*#8a7d62/i);

  assert.match(cssSource, /\.welcome-panel\s*{[\s\S]*background:\s*var\(--color-content-bg\)/);
  assert.match(cssSource, /\.project-toolbar\s*{[\s\S]*background:\s*var\(--color-sidebar-bg\)/);
  assert.match(cssSource, /\.sidebar\s*{[\s\S]*background:\s*var\(--color-sidebar-bg\)/);
  assert.match(cssSource, /\.detail\s*{[\s\S]*background:\s*var\(--color-detail-bg\)/);
  assert.match(cssSource, /\.right-sidebar\s*{[\s\S]*background:\s*var\(--color-sidebar-bg\)/);
  assert.match(cssSource, /\.modal-panel\s*{[\s\S]*background:\s*var\(--color-detail-bg\)/);
});

test("auto appearance preserves stored mode while resolving system palette state", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const cssSource = read("src/renderer/styles.css");

  assert.match(rendererSource, /const systemDarkAppearanceQuery = window\.matchMedia\("\(prefers-color-scheme: dark\)"\)/);
  assert.match(
    rendererSource,
    /function resolvedAppearanceMode\(\)\s*\{[\s\S]*state\.appearanceMode === "Auto"[\s\S]*systemDarkAppearanceQuery\.matches \? "Dark" : "Light"[\s\S]*return state\.appearanceMode/
  );
  assert.match(
    rendererSource,
    /document\.documentElement\.dataset\.appearance = state\.appearanceMode[\s\S]*document\.documentElement\.dataset\.resolvedAppearance = resolvedAppearanceMode\(\)/
  );
  assert.match(cssSource, /:root\[data-resolved-appearance="Light"\]\s*\{[\s\S]*color-scheme:\s*light/);
  assert.match(cssSource, /:root\[data-resolved-appearance="Dark"\]\s*\{[\s\S]*--color-sidebar-bg:\s*#0e0c08/i);
  assert.match(cssSource, /:root\[data-resolved-appearance="Dark"\]\s*\{[\s\S]*--color-content-bg:\s*#1e1b14/i);
  assert.match(cssSource, /:root\[data-resolved-appearance="Dark"\]\s*\{[\s\S]*color-scheme:\s*dark/);
});

test("auto appearance reacts to system changes without changing explicit modes", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(
    rendererSource,
    /function handleSystemAppearanceChange\(\)\s*\{[\s\S]*if \(state\.appearanceMode !== "Auto"\) return;[\s\S]*applyAppearanceModeToDocument\(\);[\s\S]*renderProjectToolbar\(\);/
  );
  assert.match(rendererSource, /function watchSystemAppearanceChanges\(\)/);
  assert.match(
    rendererSource,
    /systemDarkAppearanceQuery\.addEventListener\?\.\("change",\s*handleSystemAppearanceChange\)/
  );
  assert.match(
    rendererSource,
    /systemDarkAppearanceQuery\.addListener\?\.\(handleSystemAppearanceChange\)/
  );
  assert.match(rendererSource, /watchSystemAppearanceChanges\(\);[\s\S]*bootApp\(\);/);
});

test("appearance changes reload active preview frames like native WebView reload tokens", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const cycleAppearanceSource = functionSource(rendererSource, "cycleAppearanceMode", "currentHistoryEntry");
  const reloadPreviewSource =
    rendererSource.match(/function refreshVisiblePreviewForAppearanceChange\(\) \{[\s\S]*?\n\}/)?.[0] ?? "";


  assert.notEqual(reloadPreviewSource, "");
  assert.match(reloadPreviewSource, /if \(!previewFrame\.hidden[\s\S]*renderPreview\(\)/);
  assert.match(reloadPreviewSource, /if \(!generatedPreviewFrame\.hidden/);
  assert.match(reloadPreviewSource, /generatedPreviewFrame\.getAttribute\("src"\)/);
  assert.match(reloadPreviewSource, /generatedPreviewFrame\.src = generatedSource/);
  assert.doesNotMatch(reloadPreviewSource, /compileMarkdownPreview|openGeneratedPage|pushHistoryEntry/);
  assert.match(
    cycleAppearanceSource,
    /applyAppearanceModeToDocument\(\);\s*refreshVisiblePreviewForAppearanceChange\(\);\s*renderProjectToolbar\(\);/
  );
});
