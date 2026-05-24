import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
}

test("main process exposes new-wiki scaffold IPC through main-owned filesystem work", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /createWikiScaffold/);
  assert.match(mainSource, /app\.getPath\("home"\)/);
  assert.match(mainSource, /getDefaultWikiLocation/);
  assert.match(mainSource, /wikiwise:getDefaultWikiLocation/);
  assert.match(mainSource, /wikiwise:chooseNewWikiLocation/);
  assert.match(mainSource, /wikiwise:createNewWiki/);
  assert.match(mainSource, /"createDirectory"/);
  assert.match(mainSource, /createProjectResult/);
});

test("preload exposes new-wiki APIs without renderer filesystem access", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(
    preloadSource,
    /getDefaultWikiLocation:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:getDefaultWikiLocation"\)/
  );
  assert.match(
    preloadSource,
    /chooseNewWikiLocation:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:chooseNewWikiLocation"\)/
  );
  assert.match(preloadSource, /createNewWiki:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:createNewWiki"/);
  assert.doesNotMatch(preloadSource, /require\("node:fs"\)/);
});

test("renderer contains new-wiki dialog state, create flow, and post-create guide", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");

  assert.match(rendererSource, /isNewWikiDialogOpen/);
  assert.match(rendererSource, /newWikiName/);
  assert.match(rendererSource, /newWikiLocation/);
  assert.match(rendererSource, /isCreatingWiki/);
  assert.match(rendererSource, /showPostCreateGuide/);
  assert.match(rendererSource, /openNewWikiDialog/);
  assert.match(rendererSource, /chooseNewWikiLocation/);
  assert.match(rendererSource, /createNewWiki/);
  assert.match(rendererSource, /applyProjectResult/);
  assert.match(rendererSource, /startProjectWatcher/);
  assert.match(rendererSource, /dismissPostCreateGuide/);
  assert.match(rendererSource, /wikiwise\.createNewWiki/);
  assert.match(rendererSource, /wikiwise\.getDefaultWikiLocation/);
  assert.match(rendererSource, /wikiwise\.chooseNewWikiLocation/);

  assert.match(htmlSource, /id="new-wiki-dialog"/);
  assert.match(htmlSource, /id="new-wiki-name"/);
  assert.match(htmlSource, /id="new-wiki-location"/);
  assert.match(htmlSource, /id="confirm-create-new"/);
  assert.match(htmlSource, /id="post-create-guide"/);
  assert.doesNotMatch(htmlSource, /later OpenSpec phase/);
});
