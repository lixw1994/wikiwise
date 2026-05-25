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

function readRepository(relativePath) {
  return fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

function cssBlock(source, selector) {
  const pattern = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]+)\\}`);
  return source.match(pattern)?.[1] ?? "";
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

test("app menu navigation commands match the native File command group", () => {
  const mainSource = read("src/main/main.js");
  const swiftSource = readRepository("Sources/Wikiwise/WikiwiseApp.swift");

  assert.match(
    swiftSource,
    /CommandGroup\(after:\s*\.newItem\)\s*\{[\s\S]*Button\("Go Back"\)[\s\S]*Button\("Go Forward"\)[\s\S]*Button\("Refresh Page"\)/
  );
  assert.match(
    mainSource,
    /label:\s*"File"[\s\S]*submenu:\s*\[[\s\S]*label:\s*"Open Existing Folder"[\s\S]*label:\s*"Go Back"[\s\S]*accelerator:\s*"CommandOrControl\+\["[\s\S]*label:\s*"Go Forward"[\s\S]*accelerator:\s*"CommandOrControl\+\]"[\s\S]*label:\s*"Refresh Page"[\s\S]*accelerator:\s*"CommandOrControl\+R"/
  );
  assert.doesNotMatch(mainSource, /label:\s*"Navigate"/);
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

test("project toolbar icon controls mirror native SwiftUI symbol semantics", () => {
  const swiftSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const rendererSource = read("src/renderer/renderer.js");
  const cssSource = read("src/renderer/styles.css");

  assert.match(
    swiftSource,
    /Image\(systemName:\s*currentMode == \.dark \? "moon\.fill" : currentMode == \.light \? "sun\.max\.fill" : "circle\.lefthalf\.filled"\)/
  );
  assert.match(swiftSource, /Image\(systemName:\s*"map"\)/);
  assert.match(swiftSource, /Image\(systemName:\s*"sidebar\.left"\)/);
  assert.match(swiftSource, /Image\(systemName:\s*"sidebar\.right"\)/);

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

test("project toolbar mode switch mirrors native segmented styling", () => {
  const swiftSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const cssSource = read("src/renderer/styles.css");
  const modeSwitchBlock = cssBlock(cssSource, ".mode-switch");
  const modeButtonBlock = cssBlock(cssSource, ".mode-button");
  const selectedModeButtonBlock = cssBlock(cssSource, ".mode-button.selected");
  const firstModeButtonBlock = cssBlock(cssSource, ".mode-button:first-child");
  const lastModeButtonBlock = cssBlock(cssSource, ".mode-button:last-child");
  const publishButtonBlock = cssBlock(cssSource, ".publish-button");

  assert.match(swiftSource, /let fileShape = UnevenRoundedRectangle\([\s\S]*topLeadingRadius:\s*3[\s\S]*bottomLeadingRadius:\s*3/);
  assert.match(swiftSource, /let wikiShape = UnevenRoundedRectangle\([\s\S]*bottomTrailingRadius:\s*3[\s\S]*topTrailingRadius:\s*3/);
  assert.match(
    swiftSource,
    /Text\("FILE"\)[\s\S]*\.font\(\.system\(size:\s*10,\s*weight:\s*\.regular,\s*design:\s*\.monospaced\)\)[\s\S]*\.tracking\(0\.8\)[\s\S]*\.foregroundStyle\(detailMode == \.raw \? Color\.sidebarSelectedText : Color\.sidebarTextMuted\)[\s\S]*\.padding\(\.horizontal,\s*10\)[\s\S]*\.padding\(\.vertical,\s*4\)[\s\S]*\.background\(fileShape\.fill\(detailMode == \.raw \? Color\.sidebarSelectedBg : Color\.clear\)\)[\s\S]*\.overlay\(fileShape\.strokeBorder\(Color\.sidebarRule,\s*lineWidth:\s*1\)\)/
  );
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

test("left sidebar toolbar control mirrors native restore help text", () => {
  const swiftSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(swiftSource, /Image\(systemName:\s*"sidebar\.left"\)[\s\S]*\.help\("Show Sidebar"\)/);
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

test("sidebar toolbar toggles mirror native plain icon color states", () => {
  const swiftSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const cssSource = read("src/renderer/styles.css");
  const selectedToolbarIconBlock = cssBlock(cssSource, ".toolbar-icon-button.selected");
  const hiddenLeftToggleBlock = cssBlock(cssSource, "#toggle-left-sidebar:not(.selected)");
  const hiddenRightToggleBlock = cssBlock(cssSource, "#toggle-right-sidebar:not(.selected)");

  assert.match(
    swiftSource,
    /Image\(systemName:\s*"sidebar\.left"\)[\s\S]*\.font\(\.system\(size:\s*14\)\)[\s\S]*\.foregroundStyle\(Color\.toolbarDisabled\)[\s\S]*\.buttonStyle\(\.plain\)[\s\S]*\.help\("Show Sidebar"\)/
  );
  assert.match(
    swiftSource,
    /Image\(systemName:\s*"sidebar\.right"\)[\s\S]*\.font\(\.system\(size:\s*16\)\)[\s\S]*\.foregroundStyle\(showRightSidebar \? Color\.toolbarText : Color\.toolbarDisabled\)[\s\S]*\.buttonStyle\(\.plain\)/
  );
  assert.match(selectedToolbarIconBlock, /background:\s*transparent/);
  assert.match(selectedToolbarIconBlock, /color:\s*var\(--color-toolbar-text\)/);
  assert.doesNotMatch(selectedToolbarIconBlock, /var\(--color-sidebar-selected-bg\)/);
  assert.doesNotMatch(selectedToolbarIconBlock, /var\(--color-sidebar-selected-text\)/);
  assert.match(hiddenLeftToggleBlock, /color:\s*var\(--color-toolbar-disabled\)/);
  assert.match(hiddenRightToggleBlock, /color:\s*var\(--color-toolbar-disabled\)/);
});

test("project toolbar groups mirror native horizontal spacing", () => {
  const swiftSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const cssSource = read("src/renderer/styles.css");
  const toolbarGroupBlock = cssBlock(cssSource, ".toolbar-group");
  const toolbarGroupEndBlock = cssBlock(cssSource, ".toolbar-group-end");

  assert.match(
    swiftSource,
    /ToolbarItem\(placement:\s*\.navigation\)[\s\S]*HStack\(spacing:\s*14\)/
  );
  assert.match(
    swiftSource,
    /ToolbarItem\(placement:\s*\.primaryAction\)[\s\S]*HStack\(spacing:\s*10\)/
  );
  assert.match(toolbarGroupBlock, /gap:\s*14px/);
  assert.match(toolbarGroupEndBlock, /gap:\s*10px/);
  assert.doesNotMatch(toolbarGroupBlock, /gap:\s*8px/);
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

  assert.match(cssSource, /:root\[data-appearance="Dark"\]\s*{[\s\S]*--color-sidebar-bg:\s*#0e0c08/i);
  assert.match(cssSource, /:root\[data-appearance="Dark"\]\s*{[\s\S]*--color-content-bg:\s*#1e1b14/i);
  assert.match(cssSource, /:root\[data-appearance="Dark"\]\s*{[\s\S]*--color-sidebar-selected-text:\s*#f4eacf/i);
  assert.match(cssSource, /:root\[data-appearance="Dark"\]\s*{[\s\S]*--color-sidebar-rule:\s*#3a3428/i);
  assert.match(cssSource, /:root\[data-appearance="Dark"\]\s*{[\s\S]*--color-toolbar-text:\s*#8a7d62/i);

  assert.match(cssSource, /\.welcome-panel\s*{[\s\S]*background:\s*var\(--color-content-bg\)/);
  assert.match(cssSource, /\.project-toolbar\s*{[\s\S]*background:\s*var\(--color-sidebar-bg\)/);
  assert.match(cssSource, /\.sidebar\s*{[\s\S]*background:\s*var\(--color-sidebar-bg\)/);
  assert.match(cssSource, /\.detail\s*{[\s\S]*background:\s*var\(--color-detail-bg\)/);
  assert.match(cssSource, /\.right-sidebar\s*{[\s\S]*background:\s*var\(--color-sidebar-bg\)/);
  assert.match(cssSource, /\.modal-panel\s*{[\s\S]*background:\s*var\(--color-detail-bg\)/);
});
