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

function normalized(source) {
  return source.replace(/\s+/g, " ").trim();
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
  assert.match(rendererSource, /renderPublishDialog/);
  assert.match(rendererSource, /renderPublishFeedback/);
  assert.match(rendererSource, /openPublishedUrl/);
  assert.match(rendererSource, /dismissPublishResult/);
  assert.match(rendererSource, /dismissPublishError/);
  assert.match(rendererSource, /openUnpublishConfirmation/);
  assert.match(rendererSource, /confirmUnpublish/);
  assert.match(rendererSource, /wikiwise\.getPublishConfig/);
  assert.match(rendererSource, /wikiwise\.checkPublishAvailability/);
  assert.match(rendererSource, /wikiwise\.publishSite/);
  assert.match(rendererSource, /wikiwise\.unpublishSite/);
  assert.match(rendererSource, /wikiwise\.openExternalUrl/);
  assert.doesNotMatch(rendererSource, /window\.confirm/);
});

test("renderer mirrors native publish toolbar help text", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(
    nativeSource,
    /\.help\(publishConfig\.map\s*\{\s*"Last published: \\\(\$0\.lastPublishedAt \?\? "never"\)\\n\\\(\$0\.url\)\\n\\u\{2325\}-click to change URL"\s*\}\s*\?\?\s*"Publish wiki to wiki-wise\.com"\)/
  );
  assert.match(rendererSource, /function publishButtonHelpText/);
  assert.match(rendererSource, /Publish wiki to wiki-wise\.com/);
  assert.match(rendererSource, /Last published: \$\{state\.publishConfig\.lastPublishedAt \?\? "never"\}/);
  assert.match(rendererSource, /\$\{state\.publishConfig\.url\}/);
  assert.match(rendererSource, /⌥-click to change URL/);
  assert.match(rendererSource, /publishButton\.title\s*=\s*publishHelpText/);
  assert.match(rendererSource, /publishButton\.setAttribute\("aria-label",\s*publishHelpText\)/);
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
    "publish-result-dialog",
    "publish-result-url",
    "open-publish-result",
    "dismiss-publish-result",
    "publish-error-dialog",
    "publish-error-message",
    "dismiss-publish-error",
    "unpublish-confirm-dialog",
    "cancel-unpublish",
    "confirm-unpublish"
  ]) {
    assert.match(htmlSource, new RegExp(`id="${id}"`));
  }

  assert.match(htmlSource, /Published!/);
  assert.match(htmlSource, /Open in Browser/);
  assert.match(htmlSource, /Publish Error/);
  assert.match(htmlSource, /Unpublish wiki\?/);
  assert.match(htmlSource, /Your local files are not affected/);
  assert.match(cssSource, /\.publish-dialog/);
  assert.match(cssSource, /\.publish-feedback-dialog/);
  assert.match(cssSource, /\.publish-url-row/);
  assert.match(cssSource, /\.publish-availability/);
  assert.match(cssSource, /\.danger-action/);
});

test("renderer mirrors native publish dialog copy", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(
    nativeSource,
    /Text\("A publish\.json file will be saved in your project \\u\{2014\} it contains your publish token\. Treat it like a password: if you lose it, you won\\u\{2019\}t be able to update this site\."\)/
  );
  assert.match(
    normalizedHtml,
    /A publish\.json file will be saved in your project — it contains your publish token\. Treat it like a password: if you lose it, you won’t be able to update this site\./
  );
  assert.doesNotMatch(
    normalizedHtml,
    /A publish\.json file will be saved in your project\. It contains your publish token\./
  );

  assert.match(nativeSource, /Button\("Unpublish\\u\{2026\}"\)/);
  assert.match(htmlSource, />\s*Unpublish…\s*<\/button>/);
  assert.match(rendererSource, /state\.isUnpublishing \? "Unpublishing" : "Unpublish…"/);
  assert.doesNotMatch(htmlSource, /Unpublish\.\.\./);
  assert.doesNotMatch(rendererSource, /Unpublish\.\.\./);
});
