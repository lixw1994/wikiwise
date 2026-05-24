import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
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
