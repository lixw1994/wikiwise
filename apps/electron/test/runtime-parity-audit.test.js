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
    /new-wiki-light/,
    /new-wiki-dark/,
    /standalone-file-light/,
    /project-light/,
    /project-dark/,
    /WikiWise helps you turn any folder/,
    /Create a New Wiki/,
    /Open Existing Folder/,
    /welcomeToolbarEvidence/,
    /welcomeToolbarVisible/,
    /welcomeToolbarMarkText/,
    /welcomeToolbarTitleText/,
    /welcomeToolbarRect/,
    /createAuditStandaloneFileProject/,
    /standaloneFileEvidence/,
    /standaloneFileTreeEmpty/,
    /standaloneFileWatcherStopped/,
    /standaloneFileTerminalStopped/,
    /standaloneFilePublishDisabled/,
    /standaloneFileGeneratedMapStayedHidden/,
    /resource-panel|resources-panel/,
    /selectedFileLabel/,
    /projectName:\s*textFor\("#project-name"\)\s*\|\|\s*textFor\("#toolbar-project-name"\)/,
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
    /leftSidebarVisibleNativeAffordance/,
    /leftSidebarVisibleSidebarAction/,
    /leftSidebarVisibleToolbarTitle/,
    /leftSidebarVisibleToolbarAriaLabel/,
    /leftSidebarVisibleNativeSymbol/,
    /leftSidebarHiddenNativeAffordance/,
    /leftSidebarHiddenSidebarAction/,
    /leftSidebarHiddenToolbarTitle/,
    /leftSidebarHiddenToolbarAriaLabel/,
    /leftSidebarHiddenNativeSymbol/,
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
    /Welcome toolbar brand evidence is missing/,
    /Welcome toolbar brand text does not match native/,
    /Standalone file runtime evidence is missing/,
    /Standalone file tree is not empty/,
    /Standalone file project services started/,
    /Standalone file publish action is enabled/,
    /Standalone file generated map flow ran/,
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
    /Visible split-view toolbar affordance metadata is missing/,
    /Hidden split-view toolbar affordance metadata is missing/,
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

test("runtime audit script records compiled preview scroll restoration evidence", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /capturePreviewScrollPreservationEvidence/,
    /window\.__wikiwisePreviewScrollEvidence/,
    /previewScrollEvidence/,
    /previewScrollFrameScrollable/,
    /previewScrollTargetFraction/,
    /previewScrollRestoredFraction/,
    /previewScrollWithinTolerance/,
    /#preview-frame/,
    /contentWindow/,
    /scrollTo/,
    /#mode-file/,
    /#mode-wiki/,
    /Preview scroll preservation evidence is missing/,
    /Compiled preview frame could not scroll/,
    /Compiled preview scroll was not restored/
  ]);
});

test("runtime audit script records generated map toolbar flow evidence", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /captureGeneratedMapFlowEvidence/,
    /window\.__wikiwiseGeneratedMapEvidence/,
    /generatedMapEvidence/,
    /generatedMapControlPresent/,
    /generatedMapFrameVisible/,
    /generatedMapFrameSrc/,
    /generatedMapName/,
    /generatedMapBackRestoredMarkdown/,
    /generatedMapBackSelectedFileLabel/,
    /#open-map/,
    /#generated-preview-frame/,
    /#go-back/,
    /map-3d\.html/,
    /Generated map runtime evidence is missing/,
    /Generated map toolbar control is missing/,
    /Generated map page did not render/,
    /Generated map back navigation did not restore markdown/
  ]);
});

test("runtime audit script records compiled-preview local link navigation evidence", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /capturePreviewNavigationRuntimeEvidence/,
    /window\.__wikiwisePreviewNavigationRuntimeEvidence/,
    /previewNavigationRuntimeEvidence/,
    /previewNavigationLinkPresent/,
    /previewNavigationResolveObserved/,
    /previewNavigationResolvedKind/,
    /previewNavigationTargetFileName/,
    /previewNavigationSelectedFileAfterClick/,
    /previewNavigationBackRestoredMarkdown/,
    /previewNavigationBackSelectedFileLabel/,
    /previewNavigationPreviewVisibleAfterBack/,
    /previewNavigationResolvePayloads/,
    /findAuditMarkdownFileForSlug/,
    /auditMarkdownSlugForPath/,
    /audit-local-index-link/,
    /index\.html/,
    /index\.md/,
    /Preview navigation runtime evidence is missing/,
    /Preview local link was not available in the audit preview/,
    /Preview local link did not resolve through preload/,
    /Preview local link did not select the linked markdown file/,
    /Preview navigation back did not restore the original markdown page/
  ]);
});

test("runtime audit script records new-wiki creation workflow evidence", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /new-wiki-light/,
    /new-wiki-dark/,
    /captureNewWikiCreationEvidence/,
    /window\.__wikiwiseNewWikiRuntimeEvidence/,
    /newWikiRuntimeEvidence/,
    /newWikiDialogEvidence/,
    /newWikiCreateDisabledWhenEmpty/,
    /newWikiCreateEnabledWhenNamed/,
    /newWikiCreatedScaffoldEvidence/,
    /newWikiProjectOpened/,
    /newWikiProjectWatcherStarted/,
    /newWikiTerminalStarted/,
    /newWikiPostCreateGuideVisible/,
    /newWikiGuideCommandEvidence/,
    /newWikiSeedOptionCount/,
    /newWikiDismissedGuide/,
    /newWikiHomeSelectedAfterDismiss/,
    /wikiwise:createNewWiki/,
    /createWikiScaffold/,
    /#create-new/,
    /#new-wiki-dialog/,
    /#new-wiki-name/,
    /#confirm-create-new/,
    /#post-create-guide/,
    /#dismiss-post-create-guide/,
    /New-wiki runtime evidence is missing/,
    /New-wiki dialog did not match native creation sheet behavior/,
    /Runtime new-wiki scaffold was not created/,
    /Runtime new-wiki project did not open with services started/,
    /Runtime new-wiki post-create guide did not render/,
    /Runtime new-wiki guide dismissal did not select home/
  ]);
});

test("runtime audit script records watcher-driven selected preview refresh evidence", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /captureWatcherRuntimeEvidence/,
    /window\.__wikiwiseWatcherRuntimeEvidence/,
    /watcherRuntimeEvidence/,
    /watcherRuntimeStarted/,
    /watcherRuntimeEventSent/,
    /watcherRuntimeReadFileObserved/,
    /watcherRuntimeCompileObserved/,
    /watcherRuntimeCompileInvalidate/,
    /watcherRuntimeCompileReloadCSS/,
    /wikiwise:projectChanged/,
    /changedMarkdownPaths/,
    /cssChanged/,
    /Watcher runtime evidence is missing/,
    /Project watcher was not started through the preload bridge/,
    /Runtime watcher event did not refresh the selected markdown preview/,
    /Runtime watcher refresh did not use CSS reload semantics/,
    /Runtime watcher refresh did not preserve selected markdown state/
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
