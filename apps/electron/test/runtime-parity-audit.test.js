import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function assertSourceContains(source, patterns) {
  for (const pattern of patterns) {
    assert.match(source, pattern);
  }
}

test("package manifests expose Electron runtime audit commands", () => {
  const rootPackage = readJson("package.json");
  const electronPackage = readJson("apps/electron/package.json");

  assert.equal(rootPackage.scripts["electron:audit:runtime"], "npm --workspace @wikiwise/electron-app run audit:runtime");
  assert.equal(electronPackage.scripts["audit:runtime"], "electron . --audit-runtime");
});

test("runtime audit script loads real renderer through Electron BrowserWindow", () => {
  const scriptPath = path.join(repositoryRoot, "scripts/audit-electron-runtime.mjs");

  assert.equal(fs.existsSync(scriptPath), true);

  const script = fs.readFileSync(scriptPath, "utf8");
  assertSourceContains(script, [
    /from "electron"/,
    /BrowserWindow/,
    /capturePage/,
    /useContentSize:\s*true/,
    /contextIsolation:\s*true/,
    /nodeIntegration:\s*false/,
    /sandbox:\s*true/,
    /src",\s*"preload",\s*"preload\.cjs"/,
    /src",\s*"renderer",\s*"index\.html"/
  ]);
});

test("runtime audit captures native default window viewport evidence", () => {
  const swiftAppSource = read("Sources/Wikiwise/WikiwiseApp.swift");
  const script = read("scripts/audit-electron-runtime.mjs");

  assert.match(swiftAppSource, /\.defaultSize\(width:\s*1500,\s*height:\s*1000\)/);
  assertSourceContains(script, [
    /const nativeDefaultWindowViewport = Object\.freeze\(\{\s*width:\s*1500,\s*height:\s*1000\s*\}\);/,
    /const viewport = nativeDefaultWindowViewport;/,
    /width:\s*viewport\.width/,
    /height:\s*viewport\.height/,
    /viewport,/,
    /screenshot\.width < viewport\.width/,
    /screenshot\.height < viewport\.height/
  ]);
});

test("runtime audit script covers native shell scenarios and assertions", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /welcome-light/,
    /welcome-dark/,
    /project-light/,
    /project-dark/,
    /WikiWise helps you turn any folder/,
    /Create a New Wiki/,
    /Open Existing Folder/,
    /resource-panel|resources-panel/,
    /selectedFileLabel/,
    /detailHeaderVisible/,
    /projectViewportBounded/,
    /publishDialogHidden/,
    /newWikiDialogHidden/,
    /sourceEditorFramePresent/,
    /sourceEditorFrameReady/,
    /codeMirrorEditorPresent/,
    /captureDefaultWikiPreviewEvidence/,
    /defaultWikiPreviewEvidence/,
    /defaultWikiModeSelected/,
    /defaultWikiPreviewVisible/,
    /defaultWikiEditorHidden/,
    /expandedTreeEvidence/,
    /nestedSelectionEvidence/,
    /fileTreeFolderIconPresent/,
    /fileTreeSpecialFolderMarkerPresent/,
    /fileTreeSelectedAccentPresent/,
    /leftSidebarTogglePresent/,
    /leftSidebarResizeHandlePresent/,
    /leftSidebarNativeMinWidth/,
    /leftSidebarNativeIdealWidth/,
    /leftSidebarNativeMaxWidth/,
    /leftSidebarInitialWidth/,
    /leftSidebarResizedWidth/,
    /leftSidebarResizeObserved/,
    /leftSidebarInitiallyVisible/,
    /leftSidebarHiddenAfterToggle/,
    /leftSidebarRestoredVisible/,
    /leftSidebarDetailExpanded/,
    /infoOptionalSectionEvidence/,
    /toolbarIconEvidence/,
    /appearanceNativeSymbol/,
    /mapNativeSymbol/,
    /leftSidebarNativeSymbol/,
    /rightSidebarNativeSymbol/,
    /toolbarIconTextVisible/,
    /toolbarTitleOffsetEvidence/,
    /toolbarTitleInitialOffset/,
    /toolbarTitleHiddenOffset/,
    /toolbarTitleRestoredOffset/,
    /toolbarTitleExpectedVisibleOffset/,
    /infoDirectionsSectionVisible/,
    /infoLinksSectionVisible/,
    /xtermTerminalPresent/,
    /rightSidebarResizeHandlePresent/,
    /rightSidebarInitialWidth/,
    /rightSidebarResizedWidth/,
    /rightSidebarResizeObserved/,
    /terminalResizeObserved/,
    /terminalInputObserved/,
    /computedShellColors/,
    /rootAppearance/,
    /appearancePaletteEvidence/,
    /darkAppearancePaletteEvidence/,
    /backgroundCompilationEvidence/,
    /backgroundCompilationComplete/,
    /rightSidebarHidden/,
    /previewFrameHidden/,
    /Dark appearance palette is not active/,
    /Background compilation did not complete/,
    /Project shell exceeds viewport/,
    /Non-native detail save chrome is visible/,
    /Default WIKI preview evidence is missing/,
    /Markdown detail did not default to WIKI mode/,
    /Compiled preview frame is not visible before switching to editor mode/,
    /Source editor is visible before switching to editor mode/,
    /File tree folder icons are missing/,
    /File tree special folder marker is missing/,
    /File tree selected accent is missing/,
    /Left sidebar toggle control is missing/,
    /Left sidebar resize handle is missing/,
    /Left sidebar initial width does not match native ideal/,
    /Left sidebar width did not change after drag/,
    /Left sidebar resized width violates native constraints/,
    /Toolbar title offset does not match resized left sidebar/,
    /Left sidebar did not hide after toggle/,
    /Left sidebar did not restore after toggle/,
    /Detail area did not expand after hiding left sidebar/,
    /Empty directions section is visible/,
    /Empty linked section is visible/,
    /Toolbar icon text is visible/,
    /Toolbar native symbol evidence is missing/,
    /Toolbar title offset evidence is missing/,
    /Toolbar title offset does not match native left-sidebar compensation/,
    /Toolbar title offset did not reset while left sidebar was hidden/,
    /Right sidebar resize handle is missing/,
    /Right sidebar width did not change after drag/,
    /differentFromFirstPixelCount/
  ]);
});

test("runtime audit script creates scaffold project evidence through core helpers", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /createWikiScaffold/,
    /WikiCompiler/,
    /scanOneLevel/,
    /summarizeDocumentInfo/,
    /pathToFileURL/,
    /wikiwise:getAppSettings/,
    /wikiwise:restoreLastProject/,
    /wikiwise:expandTreeDirectory/,
    /wikiwise:startProjectWatcher/,
    /wikiwise:startTerminal/,
    /wikiwise:resizeTerminal/,
    /wikiwise:sendTerminalInput/
  ]);
});

test("runtime audit script writes report and screenshot artifacts", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /apps",\s*"electron",\s*"out",\s*"runtime-audit"/,
    /report\.json/,
    /screenshots/,
    /\.png/,
    /JSON\.stringify/,
    /Runtime audit report/
  ]);
});

test("main process delegates audit mode to checked-in runtime audit script", () => {
  const mainSource = read("apps/electron/src/main/main.js");

  assertSourceContains(mainSource, [
    /--audit-runtime/,
    /audit-electron-runtime\.mjs/,
    /runElectronRuntimeAudit/,
    /process\.exitCode\s*=\s*0/,
    /app\.quit\(\)/
  ]);
});

test("README documents runtime audit workflow without stale debug resource wording", () => {
  const readme = read("apps/electron/README.md");

  assert.match(readme, /npm run electron:audit:runtime/);
  assert.match(readme, /apps\/electron\/out\/runtime-audit\/report\.json/);
  assert.match(readme, /apps\/electron\/out\/runtime-audit\/screenshots/);
  assert.doesNotMatch(readme, /shared resource metadata/i);
});
