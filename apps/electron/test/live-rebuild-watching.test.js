import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
}

test("main process owns debounced project watchers and sends change summaries", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /summarizeWatchEvents/);
  assert.match(mainSource, /watchersByWebContents/);
  assert.match(mainSource, /wikiwise:startProjectWatcher/);
  assert.match(mainSource, /wikiwise:stopProjectWatcher/);
  assert.match(mainSource, /fs\.watch\(/);
  assert.match(mainSource, /setTimeout\(/);
  assert.match(mainSource, /200/);
  assert.match(mainSource, /wikiwise:projectChanged/);
  assert.match(mainSource, /\.rebuild/);
  assert.match(mainSource, /fs\.(rmSync|unlinkSync)/);
});

test("main process compile IPC accepts invalidation and CSS reload refresh flags", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /payload\.invalidate/);
  assert.match(mainSource, /payload\.reloadCSS/);
  assert.match(mainSource, /invalidatePage/);
  assert.match(mainSource, /reloadCSS/);
});

test("preload exposes watcher APIs and cleans up project-change listeners", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(
    preloadSource,
    /startProjectWatcher:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:startProjectWatcher"/
  );
  assert.match(preloadSource, /stopProjectWatcher:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:stopProjectWatcher"\)/);
  assert.match(preloadSource, /onProjectChanged:\s*\(callback\)\s*=>/);
  assert.match(preloadSource, /ipcRenderer\.on\("wikiwise:projectChanged"/);
  assert.match(preloadSource, /removeListener\("wikiwise:projectChanged"/);
});

test("renderer starts watching projects and refreshes tree, source, and preview from watcher events", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /projectWatcherCleanup/);
  assert.match(rendererSource, /startProjectWatcher/);
  assert.match(rendererSource, /onProjectChanged/);
  assert.match(rendererSource, /handleProjectChanged/);
  assert.match(rendererSource, /scanProject/);
  assert.match(rendererSource, /refreshSelectedMarkdown/);
  assert.match(rendererSource, /readFile/);
  assert.match(rendererSource, /compilePage/);
  assert.match(rendererSource, /reloadCSS/);
  assert.match(rendererSource, /invalidate/);
  assert.match(rendererSource, /!state\.selectedFile\.isDirty/);
});
