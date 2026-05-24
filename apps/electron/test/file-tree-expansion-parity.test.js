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
  assert.match(styleSource, /tree-disclosure/);
  assert.match(styleSource, /padding-left:\s*calc\(/);
});

test("renderer auto-expands native default folders and preserves expansion on refresh", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /autoExpandInitialTree/);
  assert.match(rendererSource, /node\.name !== "site"/);
  assert.match(rendererSource, /restoreExpandedTree/);
  assert.match(rendererSource, /expandedTreePaths\.has/);
  assert.match(rendererSource, /scanProject/);
});
