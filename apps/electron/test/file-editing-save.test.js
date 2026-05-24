import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
}

test("main process exposes path-safe save IPC with markdown recompilation", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /wikiwise:saveFile/);
  assert.match(mainSource, /assertProjectPath/);
  assert.match(mainSource, /writeTextFile/);
  assert.match(mainSource, /writeActiveFile/);
  assert.match(mainSource, /compileMarkdownFile/);
  assert.match(mainSource, /invalidatePage/);
});

test("preload exposes the save API without renderer filesystem access", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(preloadSource, /saveFile:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:saveFile"/);
});

test("renderer has editable source state, save controls, keyboard save, and debounce save", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");

  assert.match(htmlSource, /id="source-editor"/);
  assert.match(htmlSource, /id="save-file"/);
  assert.match(htmlSource, /id="save-status"/);
  assert.match(rendererSource, /isDirty/);
  assert.match(rendererSource, /lastSavedContent/);
  assert.match(rendererSource, /saveSelectedFile/);
  assert.match(rendererSource, /scheduleAutosave/);
  assert.match(rendererSource, /keydown/);
  assert.match(rendererSource, /metaKey/);
  assert.match(rendererSource, /wikiwise\.saveFile/);
});

test("renderer refreshes compiled preview state after saving markdown", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /result\.compiled/);
  assert.match(rendererSource, /renderPreview/);
  assert.match(rendererSource, /isMarkdownFile/);
});
