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

test("generated preview links only push source-file history like native", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const nativeGeneratedLinkSource = sourceBetween(
    nativeSource,
    "else if let c = compiler {",
    "    /// Find a .md file"
  );
  const rendererPreviewNavigationSource = sourceBetween(
    rendererSource,
    "async function navigateFromPreviewResult(result)",
    "function toggleRightSidebar()"
  );
  const rendererToolbarMapSource = sourceBetween(
    rendererSource,
    "async function openMap()",
    "async function refreshGeneratedPage()"
  );

  assert.match(
    nativeGeneratedLinkSource,
    /if let current = selectedFileURL \{\s*backHistory\.append\(current\)\s*forwardHistory = \[\]\s*\}/
  );
  assert.doesNotMatch(nativeGeneratedLinkSource, /else if let compiled = compiledFileURL/);
  assert.match(
    rendererPreviewNavigationSource,
    /if \(result\.kind === "generated"\) \{\s*showGeneratedPage\(result,\s*\{\s*pushHistory:\s*Boolean\(state\.selectedFile\)\s*\}\);\s*return;\s*\}/
  );
  assert.doesNotMatch(rendererPreviewNavigationSource, /if \(result\.kind === "generated"\) \{\s*showGeneratedPage\(result\);\s*return;\s*\}/);
  assert.match(rendererToolbarMapSource, /showGeneratedPage\(generatedPage\);/);
});

test("raw generated preview links fall through to generated HTML like native", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const mainSource = read("src/main/main.js");
  const coreSource = readRepository("packages/wikiwise-core/src/index.js");
  const nativeMarkdownLookupSource = sourceBetween(
    nativeSource,
    "private func findMarkdownFile(slug: String, in dir: URL) -> URL?",
    "    // MARK: - Actions"
  );
  const electronMarkdownLookupSource = sourceBetween(
    mainSource,
    "function findMarkdownFileForSlug(projectRoot, slug)",
    "function markdownSlugForPath(filePath)"
  );
  const electronCompileSource = sourceBetween(
    mainSource,
    "function compileMarkdownFile(projectRoot, filePath, options = {})",
    "function settingsPath()"
  );

  assert.match(nativeMarkdownLookupSource, /self\.slug\(for: file\) == slug/);
  assert.doesNotMatch(nativeMarkdownLookupSource, /raw-/);
  assert.match(coreSource, /if \(parts\.includes\("raw"\)[\s\S]*slug = `raw-\$\{slug\}`/);
  assert.match(electronCompileSource, /compiler\.invalidatePage\(slugForPath\(filePath\)\)/);
  assert.match(electronMarkdownLookupSource, /markdownSlugForPath\(filePath\) === slug/);
  assert.doesNotMatch(electronMarkdownLookupSource, /slugForPath\(filePath\) === slug/);
});

test("preview navigation normalizes clicked HTML target slugs like native", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const mainSource = read("src/main/main.js");
  const nativeSlugSource = sourceBetween(
    nativeSource,
    "private func slug(for url: URL) -> String",
    "    /// Map an HTML URL"
  );
  const electronResolveSource = sourceBetween(
    mainSource,
    "function resolvePreviewNavigation(payload)",
    "function findMarkdownFileForSlug(projectRoot, slug)"
  );

  assert.match(nativeSlugSource, /deletingPathExtension\(\)\.lastPathComponent/);
  assert.match(nativeSlugSource, /\.lowercased\(\)\.replacingOccurrences\(of: " ", with: "-"\)/);
  assert.match(electronResolveSource, /const pageSlug = markdownSlugForPath\(targetPath\);/);
  assert.doesNotMatch(
    electronResolveSource,
    /const pageSlug = path\.basename\(targetPath,\s*path\.extname\(targetPath\)\)\.toLowerCase\(\);/
  );
  assert.match(electronResolveSource, /findMarkdownFileForSlug\(projectRoot,\s*pageSlug\)/);
  assert.match(electronResolveSource, /const pageName = `\$\{pageSlug\}\.html`;/);
});

test("preview markdown lookup uses native lowercase md extension candidates", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const mainSource = read("src/main/main.js");
  const nativeMarkdownLookupSource = sourceBetween(
    nativeSource,
    "private func findMarkdownFile(slug: String, in dir: URL) -> URL?",
    "    // MARK: - Actions"
  );
  const electronMarkdownLookupSource = sourceBetween(
    mainSource,
    "function findMarkdownFileForSlug(projectRoot, slug)",
    "function markdownSlugForPath(filePath)"
  );
  const electronGlobalMarkdownHelperSource = sourceBetween(
    mainSource,
    "function isMarkdownFile(filePath)",
    "\n}"
  );

  assert.match(nativeMarkdownLookupSource, /for file in files where file\.pathExtension == "md"/);
  assert.match(electronMarkdownLookupSource, /isPreviewMarkdownLookupCandidate\(entry\.name\)/);
  assert.doesNotMatch(electronMarkdownLookupSource, /isMarkdownFile\(entry\.name\)/);
  assert.match(electronGlobalMarkdownHelperSource, /\/\\\.md\$\/i\.test\(filePath\)/);
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

test("watcher-driven output changes leave active generated pages unchanged like native", () => {
  const nativeContentSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const nativeWebViewSource = readRepository("Sources/Wikiwise/WebView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const nativeWatcherSource = sourceBetween(
    nativeContentSource,
    "private func startFileWatcher(directory: URL, compiler c: Compiler)",
    "    /// Rescan the sidebar file tree"
  );
  const nativeWebViewUpdateSource = sourceBetween(
    nativeWebViewSource,
    "func updateNSView(_ wv: WKWebView, context: Context)",
    "    final class Coordinator"
  );
  const projectChangedSource = sourceBetween(
    rendererSource,
    "async function handleProjectChanged(change)",
    "async function refreshSelectedMarkdown"
  );

  assert.match(nativeWatcherSource, /if selectedFileURL != nil \{\s*recompileCurrentPage\(c\)\s*\}/);
  assert.match(nativeWatcherSource, /if let current = selectedFileURL,[\s\S]*changedPaths\.contains\(current\.path\) \{\s*recompileCurrentPage\(c\)\s*\}/);
  assert.match(nativeWebViewUpdateSource, /if wv\.url != fileURL \|\| context\.coordinator\.lastReloadToken != reloadToken/);
  assert.doesNotMatch(projectChangedSource, /generatedOutputChanged/);
  assert.doesNotMatch(projectChangedSource, /await refreshGeneratedPage\(\)/);
  assert.match(projectChangedSource, /currentMarkdownSelected/);
  assert.match(projectChangedSource, /refreshSelectedMarkdown\(\{/);
});
