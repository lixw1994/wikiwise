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

test("main and preload expose path-safe tree expansion IPC", () => {
  const mainSource = read("src/main/main.js");
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(mainSource, /expandTreeDirectory/);
  assert.match(mainSource, /wikiwise:expandTreeDirectory/);
  assert.match(mainSource, /assertProjectPath\(projectRoot,\s*payload\.directoryPath\)/);
  assert.match(
    preloadSource,
    /expandTreeDirectory:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:expandTreeDirectory",\s*payload\)/
  );
});

test("main, preload, and renderer mark nested selections as the active file", () => {
  const mainSource = read("src/main/main.js");
  const preloadSource = read("src/preload/preload.cjs");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(mainSource, /function setActiveFile/);
  assert.match(mainSource, /wikiwise:setActiveFile/);
  assert.match(mainSource, /writeActiveFile\(projectRoot,\s*filePath\)/);
  assert.match(
    preloadSource,
    /setActiveFile:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:setActiveFile",\s*payload\)/
  );
  assert.match(rendererSource, /setActiveSelectedFile/);
  assert.match(rendererSource, /wikiwise\.setActiveFile/);
});

test("renderer renders expandable nested file tree rows", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const styleSource = read("src/renderer/styles.css");

  assert.match(rendererSource, /expandedTreePaths/);
  assert.match(rendererSource, /treeLoadingPaths/);
  assert.match(rendererSource, /toggleTreeFolder/);
  assert.match(rendererSource, /expandProjectTreeFolder/);
  assert.match(rendererSource, /renderNode\(node,\s*depth/);
  assert.match(rendererSource, /aria-expanded/);
  assert.match(rendererSource, /data-path/);
  assert.match(rendererSource, /--tree-depth/);
  assert.match(rendererSource, /tree-folder-icon/);
  assert.match(rendererSource, /tree-selected-accent/);
  assert.match(styleSource, /tree-disclosure/);
  assert.match(styleSource, /tree-folder-icon/);
  assert.match(styleSource, /padding-left:\s*calc\(/);
});

test("renderer includes native file tree visual affordances", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const styleSource = read("src/renderer/styles.css");

  assert.match(rendererSource, /special-folder/);
  assert.match(rendererSource, /tree-folder-icon/);
  assert.match(rendererSource, /tree-selected-accent/);
  assert.match(rendererSource, /data-selected/);
  assert.match(styleSource, /\.tree-folder-icon/);
  assert.match(styleSource, /\.tree-folder\.special-folder\s+\.tree-folder-icon/);
  assert.match(styleSource, /\.tree-folder\.special-folder\s+\.tree-folder-icon::after/);
  assert.match(styleSource, /\.tree-selected-accent/);
  assert.match(styleSource, /width:\s*2px/);
});

test("renderer mirrors native file tree folder tooltip copy", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(nativeSource, /case "wiki": return "Wiki pages — your editable knowledge base"/);
  assert.match(nativeSource, /case "sources": return "Source summaries — one page per ingested source"/);
  assert.match(nativeSource, /case "raw": return "Raw source documents — read-only originals"/);
  assert.match(nativeSource, /case "site": return "Build tooling and compiled HTML output"/);

  assert.match(rendererSource, /case "wiki":[\s\S]*return "Wiki pages — your editable knowledge base"/);
  assert.match(rendererSource, /case "sources":[\s\S]*return "Source summaries — one page per ingested source"/);
  assert.match(rendererSource, /case "raw":[\s\S]*return "Raw source documents — read-only originals"/);
  assert.match(rendererSource, /case "site":[\s\S]*return "Build tooling and compiled HTML output"/);

  assert.doesNotMatch(rendererSource, /Wiki pages - your editable knowledge base/);
  assert.doesNotMatch(rendererSource, /Source summaries - one page per ingested source/);
  assert.doesNotMatch(rendererSource, /Raw source documents - read-only originals/);
});

test("renderer auto-expands native default folders and preserves expansion on refresh", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /autoExpandInitialTree/);
  assert.match(rendererSource, /node\.name !== "site"/);
  assert.match(rendererSource, /restoreExpandedTree/);
  assert.match(rendererSource, /expandedTreePaths\.has/);
  assert.match(rendererSource, /scanProject/);
});

test("renderer preserves file tree state across left sidebar visibility changes", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");

  assert.match(htmlSource, /id="toggle-left-sidebar"/);
  assert.match(rendererSource, /isLeftSidebarVisible:\s*true/);
  assert.match(rendererSource, /toggleLeftSidebar/);
  assert.match(rendererSource, /left-sidebar-hidden/);
  assert.match(rendererSource, /leftSidebar\.hidden\s*=\s*!state\.isLeftSidebarVisible/);
  assert.match(styleSource, /\.project-shell\.left-sidebar-hidden/);
  assert.match(styleSource, /\.project-shell\.left-sidebar-hidden\s+\.detail/);
});

test("renderer matches native left sidebar width constraints and resize affordance", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");

  assert.match(nativeSource, /\.navigationSplitViewColumnWidth\(min:\s*110,\s*ideal:\s*200,\s*max:\s*360\)/);
  assert.match(htmlSource, /id="left-sidebar-resize-handle"/);
  assert.match(styleSource, /--left-sidebar-width:\s*200px/);
  assert.match(styleSource, /grid-template-columns:\s*var\(--left-sidebar-width\)\s+minmax\(0,\s*1fr\)\s+var\(--right-sidebar-width\)/);
  assert.match(styleSource, /\.project-shell\.right-sidebar-hidden\s*{[\s\S]*grid-template-columns:\s*var\(--left-sidebar-width\)\s+minmax\(0,\s*1fr\)/);
  assert.match(styleSource, /\.left-sidebar-resize-handle/);
  assert.match(styleSource, /body\.resizing-left-sidebar/);

  assert.match(rendererSource, /const LEFT_SIDEBAR_DEFAULT_WIDTH = 200/);
  assert.match(rendererSource, /const LEFT_SIDEBAR_MIN_WIDTH = 110/);
  assert.match(rendererSource, /const LEFT_SIDEBAR_MAX_WIDTH = 360/);
  assert.match(rendererSource, /leftSidebarWidth:\s*LEFT_SIDEBAR_DEFAULT_WIDTH/);
  assert.match(rendererSource, /leftSidebarResizeDrag:\s*null/);
  assert.match(rendererSource, /function clampLeftSidebarWidth/);
  assert.match(rendererSource, /function applyLeftSidebarWidth/);
  assert.match(rendererSource, /function startLeftSidebarResize/);
  assert.match(rendererSource, /function updateLeftSidebarResize/);
  assert.match(rendererSource, /function endLeftSidebarResize/);
  assert.match(rendererSource, /project\.style\.setProperty\("--left-sidebar-width"/);
});
