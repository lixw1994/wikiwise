import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");
const mainSource = fs.readFileSync(path.join(packageRoot, "src/main/main.js"), "utf8");
const preloadSource = fs.readFileSync(
  path.join(packageRoot, "src/preload/preload.cjs"),
  "utf8"
);
const nativeAppSource = fs.readFileSync(
  path.join(repositoryRoot, "Sources/Wikiwise/WikiwiseApp.swift"),
  "utf8"
);
const nativeContentViewSource = fs.readFileSync(
  path.join(repositoryRoot, "Sources/Wikiwise/ContentView.swift"),
  "utf8"
);
const htmlSource = fs.readFileSync(
  path.join(packageRoot, "src/renderer/index.html"),
  "utf8"
);
const rendererSource = fs.readFileSync(
  path.join(packageRoot, "src/renderer/renderer.js"),
  "utf8"
);
const styleSource = fs.readFileSync(
  path.join(packageRoot, "src/renderer/styles.css"),
  "utf8"
);

function normalized(source) {
  return source.replace(/\s+/g, " ").trim();
}

function cssBlock(selector) {
  const pattern = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]+)\\}`);
  return styleSource.match(pattern)?.[1] ?? "";
}

function buttonBodyById(id) {
  const match = htmlSource.match(
    new RegExp(`<button\\b(?=[^>]*id="${id}")[^>]*>([\\s\\S]*?)<\\/button>`)
  );

  assert.ok(match, `Expected #${id} button to exist`);
  return match[1];
}

test("uses product-facing shell title and native welcome copy", () => {
  const normalizedHtml = normalized(htmlSource);

  assert.match(htmlSource, /<title>Wikiwise<\/title>/);
  assert.equal(htmlSource.includes("Wikiwise Electron"), false);
  assert.equal(htmlSource.includes("Cross-platform workspace"), false);
  assert.match(mainSource, /title:\s*"Wikiwise"/);
  assert.doesNotMatch(mainSource, /title:\s*"[^"]*Electron[^"]*"/);
  assert.match(normalizedHtml, />W</);
  assert.match(
    normalizedHtml,
    /WikiWise helps you turn any folder of markdown files into a browsable, publishable wiki\./
  );
  assert.match(normalizedHtml, /Create a New Wiki/);
  assert.match(normalizedHtml, /Open Existing Folder/);
  assert.match(
    normalizedHtml,
    /Don't have a wiki yet\? Create one above and use Claude Code, Codex, or Cursor to build it out\./
  );
});

test("matches native welcome action symbols and preserves entry labels", () => {
  assert.match(
    nativeContentViewSource,
    /Image\(systemName:\s*"plus\.circle"\)[\s\S]*Text\("Create a New Wiki"\)/
  );
  assert.match(
    nativeContentViewSource,
    /Image\(systemName:\s*"folder"\)[\s\S]*Text\("Open Existing Folder"\)/
  );

  const createAction = buttonBodyById("create-new");
  const openAction = buttonBodyById("open-existing");

  assert.match(createAction, /data-native-symbol="plus\.circle"[\s\S]*Create a New Wiki/);
  assert.match(openAction, /data-native-symbol="folder"[\s\S]*Open Existing Folder/);
  assert.match(createAction, /aria-hidden="true"/);
  assert.match(openAction, /aria-hidden="true"/);
  assert.match(htmlSource, /id="create-new"/);
  assert.match(htmlSource, /id="open-existing"/);
});

test("matches native welcome toolbar brand chrome", () => {
  const welcomeToolbarBlock = cssBlock(".welcome-toolbar");
  const welcomeToolbarBrandBlock = cssBlock(".welcome-toolbar-brand");
  const welcomeToolbarMarkBlock = cssBlock(".welcome-toolbar-mark");
  const welcomeToolbarTitleBlock = cssBlock(".welcome-toolbar-title");
  const welcomeContentBlock = cssBlock(".welcome-content");

  assert.match(
    nativeContentViewSource,
    /ToolbarItem\(placement:\s*\.navigation\)\s*\{[\s\S]*Text\("W"\)[\s\S]*\.font\(\.system\(size:\s*18,\s*weight:\s*\.medium,\s*design:\s*\.serif\)\)[\s\S]*\.italic\(\)[\s\S]*Text\("WikiWise"\)[\s\S]*\.font\(\.system\(size:\s*13,\s*weight:\s*\.medium\)\)/
  );
  assert.match(
    htmlSource,
    /<div id="welcome-toolbar" class="welcome-toolbar">[\s\S]*<div class="welcome-toolbar-brand">[\s\S]*<span class="welcome-toolbar-mark" aria-hidden="true">W<\/span>[\s\S]*<span class="welcome-toolbar-title">WikiWise<\/span>/
  );
  assert.match(htmlSource, /<div class="welcome-content">[\s\S]*id="create-new"/);
  assert.match(welcomeToolbarBlock, /display:\s*flex/);
  assert.match(welcomeToolbarBlock, /align-items:\s*center/);
  assert.match(welcomeToolbarBlock, /border-bottom:\s*1px solid var\(--color-sidebar-rule\)/);
  assert.match(welcomeToolbarBlock, /background:\s*var\(--color-sidebar-bg\)/);
  assert.match(welcomeToolbarBrandBlock, /gap:\s*10px/);
  assert.match(welcomeToolbarBrandBlock, /padding-inline:\s*12px/);
  assert.match(welcomeToolbarMarkBlock, /font-family:\s*Georgia,\s*"Times New Roman",\s*serif/);
  assert.match(welcomeToolbarMarkBlock, /font-size:\s*18px/);
  assert.match(welcomeToolbarMarkBlock, /font-style:\s*italic/);
  assert.match(welcomeToolbarMarkBlock, /font-weight:\s*500/);
  assert.match(welcomeToolbarTitleBlock, /font-size:\s*13px/);
  assert.match(welcomeToolbarTitleBlock, /font-weight:\s*500/);
  assert.match(welcomeContentBlock, /align-content:\s*center/);
  assert.match(welcomeContentBlock, /gap:\s*32px/);
});

test("matches native macOS default and minimum window geometry", () => {
  assert.match(nativeAppSource, /\.defaultSize\(width:\s*1500,\s*height:\s*1000\)/);
  assert.match(nativeContentViewSource, /\.frame\(minWidth:\s*800,\s*minHeight:\s*500\)/);
  assert.match(
    mainSource,
    /const nativeWindowDefaultSize = Object\.freeze\(\{\s*width:\s*1500,\s*height:\s*1000\s*\}\);/
  );
  assert.match(
    mainSource,
    /const nativeWindowMinimumSize = Object\.freeze\(\{\s*width:\s*800,\s*height:\s*500\s*\}\);/
  );
  assert.match(mainSource, /width:\s*nativeWindowDefaultSize\.width/);
  assert.match(mainSource, /height:\s*nativeWindowDefaultSize\.height/);
  assert.match(mainSource, /minWidth:\s*nativeWindowMinimumSize\.width/);
  assert.match(mainSource, /minHeight:\s*nativeWindowMinimumSize\.height/);
});

test("matches native runtime app icon branding", () => {
  const nativeIconPath = path.join(repositoryRoot, "Sources/Wikiwise/Resources/Wikiwise.icns");

  assert.equal(fs.existsSync(nativeIconPath), true);
  assert.match(
    nativeAppSource,
    /wikiwiseBundle\.url\(forResource:\s*"Wikiwise",\s*withExtension:\s*"icns"\)[\s\S]*NSImage\(contentsOf:\s*icnsURL\)[\s\S]*NSApplication\.shared\.applicationIconImage = icon/
  );
  assert.match(
    mainSource,
    /const nativeAppIconPath = path\.join\(nativeResourcesRoot,\s*"Wikiwise\.icns"\);/
  );
  assert.match(
    mainSource,
    /import \{ app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, nativeTheme, shell \} from "electron";/
  );
  assert.match(mainSource, /function resolveNativeAppIconPath\(\)/);
  assert.match(mainSource, /function extractLargestPngFromIcns\(iconBuffer\)/);
  assert.match(mainSource, /function createNativeAppIcon\(\)/);
  assert.match(mainSource, /nativeImage\.createFromBuffer\(pngBuffer\)/);
  assert.match(mainSource, /function applyNativeAppIcon\(\)/);
  assert.match(mainSource, /app\.dock\?\.setIcon\(appIcon\)/);
  assert.match(
    mainSource,
    /app\.whenReady\(\)\.then\(async \(\) => \{\s*applyNativeActivationPolicy\(\);\s*applyNativeAppIcon\(\);\s*if \(isRuntimeAudit\)/
  );
  assert.match(mainSource, /const appIcon = createNativeAppIcon\(\);[\s\S]*icon:\s*appIcon/);
});

test("matches native startup activation behavior", () => {
  assert.match(nativeAppSource, /NSApplication\.shared\.setActivationPolicy\(\.regular\)/);
  assert.match(nativeAppSource, /NSApplication\.shared\.activate\(ignoringOtherApps:\s*true\)/);
  assert.match(mainSource, /function applyNativeActivationPolicy\(\)/);
  assert.match(mainSource, /app\.setActivationPolicy\?\.\("regular"\)/);
  assert.match(mainSource, /app\.focus\(\{\s*steal:\s*true\s*\}\)/);
  assert.match(
    mainSource,
    /app\.whenReady\(\)\.then\(async \(\) => \{\s*applyNativeActivationPolicy\(\);\s*applyNativeAppIcon\(\);\s*if \(isRuntimeAudit\)/
  );
});

test("matches native visible titlebar chrome", () => {
  const welcomeToolbarBlock = cssBlock(".welcome-toolbar");
  const projectToolbarBlock = cssBlock(".project-toolbar");

  assert.match(nativeAppSource, /\.windowStyle\(\.titleBar\)/);
  assert.match(nativeContentViewSource, /\.navigationTitle\(""\)/);
  assert.match(nativeContentViewSource, /window\.titlebarSeparatorStyle\s*=\s*\.none/);
  assert.match(nativeContentViewSource, /window\.title\s*=\s*""/);
  assert.match(mainSource, /title:\s*"Wikiwise"/);
  assert.match(mainSource, /titleBarStyle:\s*"hiddenInset"/);
  assert.match(mainSource, /trafficLightPosition:\s*\{\s*x:\s*12,\s*y:\s*13\s*\}/);
  assert.match(styleSource, /--native-titlebar-leading-inset:\s*78px/);
  assert.match(welcomeToolbarBlock, /padding-inline-start:\s*var\(--native-titlebar-leading-inset\)/);
  assert.match(welcomeToolbarBlock, /-webkit-app-region:\s*drag/);
  assert.match(projectToolbarBlock, /padding-inline-start:\s*var\(--native-titlebar-leading-inset\)/);
  assert.match(projectToolbarBlock, /-webkit-app-region:\s*drag/);
  assert.match(styleSource, /button,\s*input,\s*\.toolbar-group,\s*\.toolbar-group-end\s*\{[\s\S]*-webkit-app-region:\s*no-drag/);
});

test("removes shared resource debug UI from renderer shell", () => {
  assert.equal(htmlSource.includes("Shared resources"), false);
  assert.equal(htmlSource.includes("resources-panel"), false);
  assert.equal(htmlSource.includes("resource-count"), false);
  assert.equal(htmlSource.includes("resource-list"), false);
  assert.doesNotMatch(styleSource, /#resource-count/);
  assert.doesNotMatch(styleSource, /\.resource-list/);
});

test("removes shared resource debug bridge and renderer state", () => {
  assert.equal(mainSource.includes("wikiwise:listResources"), false);
  assert.equal(mainSource.includes("getResourceManifest"), false);
  assert.equal(mainSource.includes("getBundledResourceNames"), false);
  assert.equal(mainSource.includes("resolveRepositoryResourcePath"), false);
  assert.equal(preloadSource.includes("resources:"), false);
  assert.equal(preloadSource.includes("wikiwise:listResources"), false);
  assert.equal(rendererSource.includes("resourceCount"), false);
  assert.equal(rendererSource.includes("resourceList"), false);
  assert.equal(rendererSource.includes("renderResource"), false);
  assert.equal(rendererSource.includes("loadResources"), false);
  assert.equal(rendererSource.includes("window.wikiwise.resources"), false);
});

test("uses full-window shell layout instead of outer debug cards", () => {
  const shellBlock = cssBlock(".shell");
  const projectShellBlock = cssBlock(".project-shell");

  assert.match(shellBlock, /min-height:\s*100vh/);
  assert.match(shellBlock, /height:\s*100vh/);
  assert.match(shellBlock, /overflow:\s*hidden/);
  assert.match(shellBlock, /padding:\s*0/);
  assert.doesNotMatch(styleSource, /\.shell:has/);
  assert.match(projectShellBlock, /min-height:\s*100vh/);
  assert.match(projectShellBlock, /height:\s*100vh/);
  assert.match(projectShellBlock, /max-height:\s*100vh/);
  assert.doesNotMatch(projectShellBlock, /border-radius/);
});

test("offsets toolbar project title like native left-sidebar compensation", () => {
  const toolbarTitleBlock = cssBlock(".toolbar-project-title");

  assert.match(
    nativeContentViewSource,
    /\.offset\(x:\s*sidebarVisibility == \.all \? -\(leftSidebarWidth \/ 2\) : 0\)/
  );
  assert.match(styleSource, /--toolbar-title-offset:\s*0px/);
  assert.match(toolbarTitleBlock, /transform:\s*translateX\(var\(--toolbar-title-offset\)\)/);
  assert.match(rendererSource, /function updateToolbarTitleOffset/);
  assert.match(rendererSource, /leftSidebar\.getBoundingClientRect\(\)\.width/);
  assert.match(rendererSource, /-Math\.round\(leftSidebarWidth \/ 2\)/);
  assert.match(rendererSource, /project\.style\.setProperty\("--toolbar-title-offset",\s*`\$\{toolbarTitleOffset\}px`\)/);
});

test("matches native toolbar navigation help labels", () => {
  assert.match(nativeContentViewSource, /\.help\("Go Back \(\\u\{2318\}\[\)"\)/);
  assert.match(nativeContentViewSource, /\.help\("Go Forward \(\\u\{2318\}\]\)"\)/);

  assert.match(
    htmlSource,
    /id="go-back"[^>]*title="Go Back \(⌘\[\)"[^>]*aria-label="Go Back \(⌘\[\)"/
  );
  assert.match(
    htmlSource,
    /id="go-forward"[^>]*title="Go Forward \(⌘\]\)"[^>]*aria-label="Go Forward \(⌘\]\)"/
  );
  assert.doesNotMatch(htmlSource, /id="go-back"[^>]*title="Go Back"/);
  assert.doesNotMatch(htmlSource, /id="go-forward"[^>]*title="Go Forward"/);
});

test("matches native left-sidebar header structure and typography", () => {
  const sidebarBlock = cssBlock(".sidebar");
  const sidebarHeaderBlock = cssBlock(".sidebar .eyebrow");
  const fileTreeBlock = cssBlock(".file-tree");

  assert.match(
    nativeContentViewSource,
    /Text\("FILES"\)\s*\.font\(\.system\(size:\s*9,\s*weight:\s*\.regular,\s*design:\s*\.monospaced\)\)\s*\.tracking\(1\.6\)\s*\.foregroundStyle\(Color\.sidebarHeader\)\s*\.padding\(\.horizontal,\s*18\)\s*\.padding\(\.top,\s*6\)\s*\.padding\(\.bottom,\s*10\)/
  );
  assert.match(
    htmlSource,
    /<aside id="left-sidebar" class="sidebar">\s*<p class="eyebrow">FILES<\/p>\s*<ul id="file-tree" class="file-tree"><\/ul>/
  );
  assert.doesNotMatch(htmlSource, /id="project-name"/);
  assert.doesNotMatch(rendererSource, /const projectName =/);
  assert.doesNotMatch(rendererSource, /projectName\.textContent/);
  assert.match(htmlSource, /id="toolbar-project-name"/);
  assert.match(rendererSource, /toolbarProjectName\.textContent = state\.currentProject\.projectName/);

  assert.match(sidebarHeaderBlock, /padding-inline:\s*18px/);
  assert.match(sidebarHeaderBlock, /padding-top:\s*6px/);
  assert.match(sidebarHeaderBlock, /padding-bottom:\s*10px/);
  assert.match(sidebarHeaderBlock, /margin:\s*0/);
  assert.match(
    sidebarHeaderBlock,
    /font-family:\s*ui-monospace,\s*"SFMono-Regular",\s*Menlo,\s*monospace/
  );
  assert.match(sidebarHeaderBlock, /font-size:\s*9px/);
  assert.match(sidebarHeaderBlock, /font-weight:\s*400/);
  assert.match(sidebarHeaderBlock, /letter-spacing:\s*1\.6px/);
  assert.match(sidebarHeaderBlock, /text-transform:\s*none/);
  assert.match(fileTreeBlock, /margin:\s*0/);
  assert.match(sidebarBlock, /padding:\s*0 0 20px/);
});

test("hides non-native detail save chrome while preserving save wiring", () => {
  const detailBlock = cssBlock(".detail");
  const sourceFrameBlock = cssBlock(".source-editor-frame");
  const previewFrameBlock = cssBlock(".preview-frame");

  assert.match(htmlSource, /<div class="detail-header" hidden>/);
  assert.match(htmlSource, /id="selected-file"/);
  assert.match(htmlSource, /id="save-status"/);
  assert.match(htmlSource, /id="save-file"/);
  assert.match(rendererSource, /saveSelectedFile/);
  assert.match(rendererSource, /saveButton\.addEventListener\("click"/);
  assert.match(detailBlock, /grid-template-rows:\s*minmax\(0,\s*1fr\)/);
  assert.match(detailBlock, /overflow:\s*hidden/);
  assert.match(sourceFrameBlock, /min-height:\s*0/);
  assert.match(previewFrameBlock, /min-height:\s*0/);
});

test("keeps hidden dialogs and inactive panels out of the visual shell", () => {
  assert.match(styleSource, /\[hidden\]\s*\{[^}]*display:\s*none\s*!important/);
});
