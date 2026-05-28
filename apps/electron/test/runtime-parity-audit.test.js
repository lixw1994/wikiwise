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
  assert.equal(rootPackage.scripts["electron:audit:packaged"], "npm --workspace @wikiwise/electron-app run audit:packaged");
  assert.equal(electronPackage.scripts["audit:runtime"], "electron . --audit-runtime");
  assert.equal(electronPackage.scripts["audit:packaged"], "node ../../scripts/audit-electron-packaged-runtime.mjs");
});

test("runtime audit success path uses graceful Electron shutdown", () => {
  const mainProcessSource = read("apps/electron/src/main/main.js");

  assert.match(
    mainProcessSource,
    /await auditModule\.runElectronRuntimeAudit\(\);\s*process\.exitCode = 0;\s*app\.quit\(\);\s*return;/s
  );
  assert.doesNotMatch(
    mainProcessSource,
    /await auditModule\.runElectronRuntimeAudit\(\);\s*process\.exitCode = 0;\s*app\.exit\(0\);/s
  );
});

test("runtime audit closes its BrowserWindow before app shutdown", () => {
  const auditSource = read("scripts/audit-electron-runtime.mjs");

  assert.match(auditSource, /await closeAuditWindow\(window\);/);
  assert.match(
    auditSource,
    /function closeAuditWindow\(window\) \{[\s\S]*window\.once\("closed"[\s\S]*window\.close\(\)/
  );
  assert.doesNotMatch(auditSource, /window\.destroy\(\);/);
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
    /\.tree-folder\.special-folder \.tree-folder-dot/,
    /window\.getComputedStyle\(specialFolderDot\)\.display/,
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
    /rightSidebarTerminalResizeObserved/,
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

test("runtime audit uses production terminal IPC for real PTY evidence", () => {
  const script = read("scripts/audit-electron-runtime.mjs");
  const auditChannels =
    script.match(/const auditIpcChannels = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] ?? "";

  assert.notEqual(auditChannels, "");
  assert.doesNotMatch(auditChannels, /"wikiwise:startTerminal"/);
  assert.doesNotMatch(auditChannels, /"wikiwise:sendTerminalInput"/);
  assert.doesNotMatch(script, /ipcMain\.handle\("wikiwise:startTerminal"/);
  assert.doesNotMatch(script, /ipcMain\.handle\("wikiwise:sendTerminalInput"/);
  assert.match(script, /const realTerminalAuditCommand = "echo WIKIWISE_REAL_TERMINAL_AUDIT"/);
  assert.match(script, /window\.__wikiwiseTerminal\?\.input\([\s\S]*realTerminalAuditCommand[\s\S]*\\\\r/);
  assert.match(script, /window\.__wikiwiseTerminalText[\s\S]*WIKIWISE_REAL_TERMINAL_AUDIT/);
  assert.match(script, /realTerminalOutputObserved/);
  assert.match(script, /Real terminal input did not echo audit command/);
});

test("runtime audit waits for native sidebar visibility animation before measuring", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /const sidebarVisibilityAnimationSettleMs = 240;/,
    /const waitForSidebarVisibilityAnimation = \(\) => \([\s\S]*new Promise\(\(resolve\) => setTimeout\(resolve,\s*sidebarVisibilityAnimationSettleMs\)\)/,
    /toggle\.click\(\);\s*await waitForSidebarVisibilityAnimation\(\);[\s\S]*const hidden = \{/,
    /toggle\.click\(\);\s*await waitForSidebarVisibilityAnimation\(\);[\s\S]*const restored = \{/
  ]);
});

test("runtime audit measures sidebar resize while drag transition bypass is active", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /handle\.dispatchEvent\(new PointerEvent\("pointermove",\s*\{[\s\S]*clientX:\s*startX - 80[\s\S]*\}\)\);\s*const after = Math\.round\(rightSidebar\.getBoundingClientRect\(\)\.width\);\s*handle\.dispatchEvent\(new PointerEvent\("pointerup"/,
    /handle\.dispatchEvent\(new PointerEvent\("pointermove",\s*\{[\s\S]*clientX:\s*startX \+ 60[\s\S]*\}\)\);\s*const after = Math\.round\(leftSidebar\.getBoundingClientRect\(\)\.width\);\s*const afterTitleOffset = titleOffset\(\);\s*handle\.dispatchEvent\(new PointerEvent\("pointerup"/
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

test("runtime audit script records populated INFO tab evidence", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /info-runtime\.md/,
    /directions:\s*Verify populated INFO runtime evidence/,
    /\[\[home\]\]/,
    /captureInfoPopulatedSectionEvidence/,
    /window\.__wikiwiseInfoPopulatedSectionEvidence/,
    /infoPopulatedSectionEvidence/,
    /infoPopulatedFixtureSelected/,
    /infoPopulatedInfoTabActivated/,
    /infoPopulatedDirectionsSectionVisible/,
    /infoPopulatedDirectionsText/,
    /infoPopulatedLinksSectionVisible/,
    /infoPopulatedLinksText/,
    /infoPopulatedExpectedDirections/,
    /infoPopulatedExpectedLink/,
    /infoPopulatedRestoredHome/,
    /infoPopulatedRestoredEditorMode/,
    /Populated INFO runtime evidence is missing/,
    /Populated INFO fixture was not selected/,
    /Populated directions section is missing/,
    /Populated linked section is missing/,
    /Populated INFO capture did not restore home editor state/
  ]);
});

test("runtime audit script records first-publish dialog evidence", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /capturePublishDialogRuntimeEvidence/,
    /window\.__wikiwisePublishDialogRuntimeEvidence/,
    /publishDialogRuntimeEvidence/,
    /publishDialogOpened/,
    /publishDialogTitle/,
    /publishDialogSubdomain/,
    /publishDialogUrlShape/,
    /publishDialogTokenWarning/,
    /publishDialogAvailabilityState/,
    /publishDialogAvailabilityText/,
    /publishDialogAvailabilityIndicatorText/,
    /publishDialogConfirmDisabled/,
    /publishDialogUnpublishHidden/,
    /publishDialogClosedWithCancel/,
    /publishDialogRestoredHome/,
    /publishDialogRestoredEditorMode/,
    /Publish your wiki/,
    /A publish\.json file will be saved in your project/,
    /Anyone with this link can view your wiki\./,
    /wiki-wise\.com/,
    /Publish dialog runtime evidence is missing/,
    /Publish dialog did not open/,
    /Publish dialog URL row evidence is missing/,
    /Publish dialog token warning is missing/,
    /Publish dialog availability evidence is missing/,
    /Publish dialog allowed publishing before availability/,
    /First-publish dialog showed unpublish action/,
    /Publish dialog did not close through cancel/,
    /Publish dialog capture did not restore home editor state/
  ]);
});

test("runtime audit script records publish feedback runtime evidence", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /capturePublishFeedbackRuntimeEvidence/,
    /window\.__wikiwisePublishFeedbackRuntimeEvidence/,
    /publishFeedbackRuntimeEvidence/,
    /auditPublishConfig/,
    /auditPublishSiteCalls/,
    /auditUnpublishSiteCalls/,
    /auditPublishedUrlOpened/,
    /publishFeedbackSuccessEvidence/,
    /publishFeedbackSuccessTitle/,
    /publishFeedbackSuccessMessage/,
    /publishFeedbackResultUrlHidden/,
    /publishFeedbackExternalOpenObserved/,
    /publishFeedbackExternalOpenUrl/,
    /publishFeedbackResultDismissed/,
    /publishFeedbackErrorEvidence/,
    /publishFeedbackErrorTitle/,
    /publishFeedbackErrorMessage/,
    /publishFeedbackErrorDismissed/,
    /publishFeedbackUnpublishEvidence/,
    /publishFeedbackUnpublishDialogOpened/,
    /publishFeedbackUnpublishConfirmed/,
    /publishFeedbackUnpublishCallObserved/,
    /publishFeedbackPublishedConfigCleared/,
    /publishFeedbackRestoredHome/,
    /publishFeedbackRestoredEditorMode/,
    /Published!/,
    /Your wiki is live at/,
    /A publish\.json file has been saved to your project/,
    /Open in Browser/,
    /Publish Error/,
    /Runtime audit publish failed/,
    /Unpublish wiki\?/,
    /Your local files are not affected/,
    /Publish feedback runtime evidence is missing/,
    /Publish success feedback evidence is missing/,
    /Publish result external-open routing is missing/,
    /Publish error feedback evidence is missing/,
    /Unpublish feedback evidence is missing/,
    /Publish feedback capture did not restore home editor state/
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
    /wikiwise:resizeTerminal/,
    /realTerminalAuditCommand/,
    /WIKIWISE_REAL_TERMINAL_AUDIT/
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

test("main process owns packaged runtime smoke audit mode", () => {
  const mainSource = read("apps/electron/src/main/main.js");

  assertSourceContains(mainSource, [
    /--audit-packaged-runtime/,
    /function runPackagedRuntimeSmokeAudit\(\)/,
    /function packagedRuntimeAuditReportPath\(\)/,
    /function writePackagedRuntimeAuditReport/,
    /BrowserWindow/,
    /src",\s*"renderer",\s*"index\.html"/,
    /src",\s*"preload",\s*"preload\.cjs"/,
    /node_modules",\s*"@wikiwise",\s*"core"/,
    /node_modules",\s*"node-pty"/,
    /entry\.name\.startsWith\("darwin-"\)/,
    /spawn-helper/,
    /function packagedRuntimeAuditTerminalEvidence/,
    /PACKAGED_RUNTIME_TERMINAL_AUDIT/,
    /pty\.spawn/,
    /terminalEchoObserved/,
    /window\.webContents\.executeJavaScript/,
    /window\.close\(\)/,
    /app\.quit\(\)/
  ]);
});

test("packaged runtime audit launcher runs Wikiwise.app and validates retained report", () => {
  const script = read("scripts/audit-electron-packaged-runtime.mjs");

  assertSourceContains(script, [
    /apps",\s*"electron",\s*"out",\s*"Wikiwise\.app"/,
    /Contents",\s*"MacOS",\s*"Wikiwise"/,
    /--audit-packaged-runtime/,
    /--audit-report/,
    /apps",\s*"electron",\s*"out",\s*"packaged-runtime-audit",\s*"report\.json"/,
    /spawn\(/,
    /status !== "passed"/,
    /rendererLoaded !== true/,
    /preloadBridgeObserved !== true/,
    /terminal\?\.terminalEchoObserved !== true/,
    /Packaged runtime audit report/
  ]);
});

test("README documents runtime audit workflow without stale debug resource wording", () => {
  const readme = read("apps/electron/README.md");

  assert.match(readme, /npm run electron:audit:runtime/);
  assert.match(readme, /npm run electron:audit:packaged/);
  assert.match(readme, /apps\/electron\/out\/runtime-audit\/report\.json/);
  assert.match(readme, /apps\/electron\/out\/runtime-audit\/screenshots/);
  assert.match(readme, /apps\/electron\/out\/packaged-runtime-audit\/report\.json/);
  assert.doesNotMatch(readme, /shared resource metadata/i);
});
