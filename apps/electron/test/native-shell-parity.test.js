import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mainSource = fs.readFileSync(path.join(packageRoot, "src/main/main.js"), "utf8");
const preloadSource = fs.readFileSync(
  path.join(packageRoot, "src/preload/preload.cjs"),
  "utf8"
);
const htmlSource = fs.readFileSync(
  path.join(packageRoot, "src/renderer/index.html"),
  "utf8"
);
const rendererSource = fs.readFileSync(
  path.join(packageRoot, "src/renderer/renderer.js"),
  "utf8"
);
const styleSource = fs.readFileSync(
  path.join(packageRoot, "src/renderer/styles.css"),
  "utf8"
);

function normalized(source) {
  return source.replace(/\s+/g, " ").trim();
}

function cssBlock(selector) {
  const pattern = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]+)\\}`);
  return styleSource.match(pattern)?.[1] ?? "";
}

test("uses product-facing shell title and native welcome copy", () => {
  const normalizedHtml = normalized(htmlSource);

  assert.match(htmlSource, /<title>Wikiwise<\/title>/);
  assert.equal(htmlSource.includes("Wikiwise Electron"), false);
  assert.equal(htmlSource.includes("Cross-platform workspace"), false);
  assert.match(mainSource, /title:\s*"Wikiwise"/);
  assert.doesNotMatch(mainSource, /title:\s*"[^"]*Electron[^"]*"/);
  assert.match(normalizedHtml, />W</);
  assert.match(
    normalizedHtml,
    /WikiWise helps you turn any folder of markdown files into a browsable, publishable wiki\./
  );
  assert.match(normalizedHtml, /Create a New Wiki/);
  assert.match(normalizedHtml, /Open Existing Folder/);
  assert.match(
    normalizedHtml,
    /Don't have a wiki yet\? Create one above and use Claude Code, Codex, or Cursor to build it out\./
  );
});

test("removes shared resource debug UI from renderer shell", () => {
  assert.equal(htmlSource.includes("Shared resources"), false);
  assert.equal(htmlSource.includes("resources-panel"), false);
  assert.equal(htmlSource.includes("resource-count"), false);
  assert.equal(htmlSource.includes("resource-list"), false);
  assert.doesNotMatch(styleSource, /#resource-count/);
  assert.doesNotMatch(styleSource, /\.resource-list/);
});

test("removes shared resource debug bridge and renderer state", () => {
  assert.equal(mainSource.includes("wikiwise:listResources"), false);
  assert.equal(mainSource.includes("getResourceManifest"), false);
  assert.equal(mainSource.includes("getBundledResourceNames"), false);
  assert.equal(mainSource.includes("resolveRepositoryResourcePath"), false);
  assert.equal(preloadSource.includes("resources:"), false);
  assert.equal(preloadSource.includes("wikiwise:listResources"), false);
  assert.equal(rendererSource.includes("resourceCount"), false);
  assert.equal(rendererSource.includes("resourceList"), false);
  assert.equal(rendererSource.includes("renderResource"), false);
  assert.equal(rendererSource.includes("loadResources"), false);
  assert.equal(rendererSource.includes("window.wikiwise.resources"), false);
});

test("uses full-window shell layout instead of outer debug cards", () => {
  const shellBlock = cssBlock(".shell");
  const projectShellBlock = cssBlock(".project-shell");

  assert.match(shellBlock, /min-height:\s*100vh/);
  assert.match(shellBlock, /height:\s*100vh/);
  assert.match(shellBlock, /overflow:\s*hidden/);
  assert.match(shellBlock, /padding:\s*0/);
  assert.doesNotMatch(styleSource, /\.shell:has/);
  assert.match(projectShellBlock, /min-height:\s*100vh/);
  assert.match(projectShellBlock, /height:\s*100vh/);
  assert.match(projectShellBlock, /max-height:\s*100vh/);
  assert.doesNotMatch(projectShellBlock, /border-radius/);
});

test("hides non-native detail save chrome while preserving save wiring", () => {
  const detailBlock = cssBlock(".detail");
  const sourceFrameBlock = cssBlock(".source-editor-frame");
  const previewFrameBlock = cssBlock(".preview-frame");

  assert.match(htmlSource, /<div class="detail-header" hidden>/);
  assert.match(htmlSource, /id="selected-file"/);
  assert.match(htmlSource, /id="save-status"/);
  assert.match(htmlSource, /id="save-file"/);
  assert.match(rendererSource, /saveSelectedFile/);
  assert.match(rendererSource, /saveButton\.addEventListener\("click"/);
  assert.match(detailBlock, /grid-template-rows:\s*minmax\(0,\s*1fr\)/);
  assert.match(detailBlock, /overflow:\s*hidden/);
  assert.match(sourceFrameBlock, /min-height:\s*0/);
  assert.match(previewFrameBlock, /min-height:\s*0/);
});

test("keeps hidden dialogs and inactive panels out of the visual shell", () => {
  assert.match(styleSource, /\[hidden\]\s*\{[^}]*display:\s*none\s*!important/);
});
