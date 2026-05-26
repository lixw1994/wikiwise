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

function sourceBetween(source, startSignature, endSignature) {
  const start = source.indexOf(startSignature);
  const end = source.indexOf(endSignature, start + startSignature.length);

  assert.notEqual(start, -1);
  assert.notEqual(end, -1);

  return source.slice(start, end);
}

test("main process resolves preview navigation and opens external links safely", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /shell/);
  assert.match(mainSource, /resolvePreviewNavigation/);
  assert.match(mainSource, /findMarkdownFileForSlug/);
  assert.match(mainSource, /openExternalUrl/);
  assert.match(mainSource, /wikiwise:resolvePreviewNavigation/);
  assert.match(mainSource, /wikiwise:openExternalUrl/);
  assert.match(mainSource, /protocol\s*===\s*"http:"/);
  assert.match(mainSource, /protocol\s*===\s*"https:"/);
  assert.match(mainSource, /shell\.openExternal/);
  assert.match(mainSource, /"graph\.html"/);
});

test("preload exposes preview navigation and external URL APIs", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(
    preloadSource,
    /resolvePreviewNavigation:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:resolvePreviewNavigation"/
  );
  assert.match(
    preloadSource,
    /openExternalUrl:\s*\(url\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:openExternalUrl"/
  );
});

test("renderer intercepts preview and generated frame links through app navigation", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");

  assert.match(rendererSource, /attachPreviewNavigation/);
  assert.match(rendererSource, /handlePreviewFrameClick/);
  assert.match(rendererSource, /isSamePageAnchorNavigation/);
  assert.match(rendererSource, /navigateFromPreviewResult/);
  assert.match(rendererSource, /refreshGeneratedPage/);
  assert.match(rendererSource, /wikiwise\.resolvePreviewNavigation/);
  assert.match(rendererSource, /wikiwise\.openExternalUrl/);
  assert.match(rendererSource, /previewFrame\.addEventListener\("load"/);
  assert.match(rendererSource, /generatedPreviewFrame\.addEventListener\("load"/);
  assert.match(rendererSource, /state\.generatedPage/);
  assert.match(rendererSource, /pushHistoryEntry\(currentHistoryEntry\(\)\)/);
  assert.match(rendererSource, /change\.changedMarkdownPaths/);
  assert.match(htmlSource, /sandbox="allow-scripts allow-same-origin"/);
});

test("manual Refresh Page command stays scoped to selected markdown like native", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const nativeRefreshSource = sourceBetween(
    nativeSource,
    "private func recompileCurrentPage(_ c: Compiler)",
    "    // MARK: - Publish"
  );
  const rendererRefreshSource = sourceBetween(
    rendererSource,
    "async function refreshCurrentView()",
    "function attachPreviewNavigation"
  );

  assert.match(nativeRefreshSource, /guard let url = selectedFileURL else \{ return \}/);
  assert.match(rendererRefreshSource, /state\.selectedFile\?\.path && isMarkdownFile\(state\.selectedFile\.path\)/);
  assert.match(rendererRefreshSource, /refreshSelectedMarkdown\(\{ invalidate:\s*true \}\)/);
  assert.doesNotMatch(rendererRefreshSource, /refreshGeneratedPage\(/);
});

test("watcher-driven output changes still refresh active generated pages", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const projectChangedSource = sourceBetween(
    rendererSource,
    "async function handleProjectChanged(change)",
    "async function refreshSelectedMarkdown"
  );

  assert.match(projectChangedSource, /const generatedPageActive = Boolean\(state\.generatedPage\?\.name\)/);
  assert.match(projectChangedSource, /const generatedOutputChanged =/);
  assert.match(projectChangedSource, /if \(generatedOutputChanged\) \{\s*await refreshGeneratedPage\(\);\s*\}/);
});
