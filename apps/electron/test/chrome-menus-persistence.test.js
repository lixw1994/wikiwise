import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
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
