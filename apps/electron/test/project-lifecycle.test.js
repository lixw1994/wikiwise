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

test("renderer contains project lifecycle state and welcome entry points", () => {
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
  assert.match(htmlSource, /id="source-editor-frame"/);
  assert.match(htmlSource, /id="new-wiki-dialog"/);
});

test("main process mirrors native standalone file open state", () => {
  const mainSource = read("src/main/main.js");
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");

  assert.match(
    nativeSource,
    /else\s*\{\s*rootURL = url\.deletingLastPathComponent\(\)\s*tree = \[\]\s*selectedFileURL = url\s*loadFile\(url\)/
  );
  assert.match(mainSource, /const projectKind = isDirectory \? "folder" : "file";/);
  assert.match(mainSource, /const tree = isDirectory \? scanOneLevel\(projectRoot\) : \[\];/);
  assert.match(mainSource, /projectKind,/);
  assert.match(mainSource, /projectName:\s*path\.basename\(projectRoot\),\s*tree,\s*selectedFile/);
  assert.doesNotMatch(mainSource, /const tree = scanOneLevel\(projectRoot\);/);
});

test("renderer treats standalone file opens as non-project service state", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /function isProjectFolder\(\)/);
  assert.match(rendererSource, /projectKind:\s*projectResult\.projectKind \?\? "folder"/);
  assert.match(rendererSource, /if \(!state\.currentProject \|\| !isProjectFolder\(\)\)\s*\{[\s\S]*wikiwise\.stopProjectWatcher/);
  assert.match(rendererSource, /if \(!state\.currentProject \|\| !isProjectFolder\(\)\)\s*\{[\s\S]*wikiwise\.stopTerminal/);
  assert.match(rendererSource, /publishButton\.disabled = !isProjectFolder\(\) \|\| publishBusy/);
  assert.match(rendererSource, /if \(!isProjectFolder\(\) \|\| !state\.generatedPage\?\.name\) return null;/);
  assert.match(rendererSource, /if \(!isProjectFolder\(\)\) return;/);
});
