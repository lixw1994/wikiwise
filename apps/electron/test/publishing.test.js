import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
}

test("main process exposes publishing IPC through core helpers", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /loadPublishConfig/);
  assert.match(mainSource, /checkPublishAvailability/);
  assert.match(mainSource, /publishSite/);
  assert.match(mainSource, /unpublishSite/);
  assert.match(mainSource, /wikiwise:getPublishConfig/);
  assert.match(mainSource, /wikiwise:checkPublishAvailability/);
  assert.match(mainSource, /wikiwise:publishSite/);
  assert.match(mainSource, /wikiwise:unpublishSite/);
  assert.match(mainSource, /compileAll\(\)/);
});

test("preload exposes publishing APIs without renderer filesystem access", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(preloadSource, /getPublishConfig:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:getPublishConfig"/);
  assert.match(
    preloadSource,
    /checkPublishAvailability:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:checkPublishAvailability"/
  );
  assert.match(preloadSource, /publishSite:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:publishSite"/);
  assert.match(preloadSource, /unpublishSite:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:unpublishSite"/);
});

test("renderer contains native publishing state and project service refresh", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /publishConfig/);
  assert.match(rendererSource, /isPublishDialogOpen/);
  assert.match(rendererSource, /publishSubdomain/);
  assert.match(rendererSource, /publishAvailability/);
  assert.match(rendererSource, /isPublishing/);
  assert.match(rendererSource, /publishResult/);
  assert.match(rendererSource, /publishError/);
  assert.match(rendererSource, /refreshPublishConfig/);
  assert.match(rendererSource, /openPublishDialog/);
  assert.match(rendererSource, /checkPublishAvailability/);
  assert.match(rendererSource, /sanitizePublishSubdomain/);
  assert.match(rendererSource, /publishCurrentProject/);
  assert.match(rendererSource, /unpublishCurrentProject/);
  assert.match(rendererSource, /renderPublishDialog/);
  assert.match(rendererSource, /wikiwise\.getPublishConfig/);
  assert.match(rendererSource, /wikiwise\.checkPublishAvailability/);
  assert.match(rendererSource, /wikiwise\.publishSite/);
  assert.match(rendererSource, /wikiwise\.unpublishSite/);
});

test("renderer markup and styles include publish dialog, status, and unpublish controls", () => {
  const htmlSource = read("src/renderer/index.html");
  const cssSource = read("src/renderer/styles.css");

  for (const id of [
    "publish-wiki",
    "publish-dialog",
    "publish-subdomain",
    "publish-url",
    "publish-availability",
    "cancel-publish",
    "confirm-publish",
    "unpublish-wiki",
    "publish-result",
    "publish-error"
  ]) {
    assert.match(htmlSource, new RegExp(`id="${id}"`));
  }

  assert.match(cssSource, /\.publish-dialog/);
  assert.match(cssSource, /\.publish-url-row/);
  assert.match(cssSource, /\.publish-availability/);
  assert.match(cssSource, /\.publish-result/);
  assert.match(cssSource, /\.danger-action/);
});
