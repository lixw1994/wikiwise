import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
}

test("main process exposes project lifecycle IPC channels", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /dialog\.showOpenDialog/);
  assert.match(mainSource, /wikiwise:openExisting/);
  assert.match(mainSource, /wikiwise:scanProject/);
  assert.match(mainSource, /wikiwise:readFile/);
  assert.match(mainSource, /scanOneLevel/);
  assert.match(mainSource, /readTextFile/);
});

test("preload bridge exposes project lifecycle APIs", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(preloadSource, /openExisting:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:openExisting"\)/);
  assert.match(preloadSource, /scanProject:\s*\(projectPath\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:scanProject"/);
  assert.match(preloadSource, /readFile:\s*\(filePath\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:readFile"/);
});

test("renderer contains project lifecycle state and deferred feature messaging", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");

  assert.match(rendererSource, /currentProject/);
  assert.match(rendererSource, /selectedFile/);
  assert.match(rendererSource, /openExisting/);
  assert.match(rendererSource, /renderTree/);
  assert.match(rendererSource, /wikiwise\.readFile/);
  assert.match(htmlSource, /id="open-existing"/);
  assert.match(htmlSource, /id="create-new"/);
  assert.match(htmlSource, /id="file-tree"/);
  assert.match(htmlSource, /id="file-content"/);
  assert.match(htmlSource, /later OpenSpec phase/);
});
