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

test("shared watch summaries mirror native case-sensitive markdown and CSS suffixes", () => {
  const nativeSource = readRepository("Sources/Wikiwise/FileWatcher.swift");
  const coreSource = readRepository("packages/wikiwise-core/src/index.js");
  const mainSource = read("src/main/main.js");
  const summarizeWatchEventsSource =
    coreSource.match(/export function summarizeWatchEvents\(\{[\s\S]*?\n\}/)?.[0] ?? "";

  assert.match(nativeSource, /path\.hasSuffix\("\.css"\)/);
  assert.match(nativeSource, /path\.hasSuffix\("\.md"\)/);
  assert.notEqual(summarizeWatchEventsSource, "");
  assert.match(summarizeWatchEventsSource, /eventPath\.endsWith\("\.css"\)/);
  assert.match(summarizeWatchEventsSource, /eventPath\.endsWith\("\.md"\)/);
  assert.doesNotMatch(summarizeWatchEventsSource, /\/\\\.css\$\/i/);
  assert.doesNotMatch(summarizeWatchEventsSource, /\/\\\.md\$\/i/);
  assert.match(mainSource, /summarizeWatchEvents\(\{[\s\S]*projectRoot:\s*resolvedRoot[\s\S]*outputDir:\s*compiler\.outputDir/);
});

test("shared watch summaries mirror native output directory prefix filtering", () => {
  const nativeSource = readRepository("Sources/Wikiwise/FileWatcher.swift");
  const coreSource = readRepository("packages/wikiwise-core/src/index.js");
  const mainSource = read("src/main/main.js");
  const summarizeWatchEventsSource =
    coreSource.match(/export function summarizeWatchEvents\(\{[\s\S]*?\n\}/)?.[0] ?? "";

  assert.match(nativeSource, /path\.hasPrefix\(watcher\.outputDir\)/);
  assert.notEqual(summarizeWatchEventsSource, "");
  assert.match(coreSource, /function isNativeOutputPath\(eventPath, outputDir\) \{[\s\S]*eventPath\.startsWith\(path\.resolve\(outputDir\)\)/);
  assert.match(summarizeWatchEventsSource, /isNativeOutputPath\(eventPath, outputDir\)/);
  assert.doesNotMatch(summarizeWatchEventsSource, /isPathInside\(eventPath,\s*outputDir\)/);
  assert.match(mainSource, /summarizeWatchEvents\(\{[\s\S]*projectRoot:\s*resolvedRoot[\s\S]*outputDir:\s*compiler\.outputDir/);
});

test("shared watch summaries mirror native wiki assets path containment", () => {
  const nativeSource = readRepository("Sources/Wikiwise/FileWatcher.swift");
  const coreSource = readRepository("packages/wikiwise-core/src/index.js");
  const mainSource = read("src/main/main.js");
  const summarizeWatchEventsSource =
    coreSource.match(/export function summarizeWatchEvents\(\{[\s\S]*?\n\}/)?.[0] ?? "";

  assert.match(nativeSource, /path\.contains\("\/wiki\/assets\/"\)/);
  assert.notEqual(summarizeWatchEventsSource, "");
  assert.match(coreSource, /function isNativeWikiAssetsPath\(relativePath\) \{[\s\S]*relativePath\.startsWith\("wiki\/assets\/"\)[\s\S]*relativePath\.includes\("\/wiki\/assets\/"\)/);
  assert.match(summarizeWatchEventsSource, /isNativeWikiAssetsPath\(relativePath\)/);
  assert.doesNotMatch(summarizeWatchEventsSource, /else if \(relativePath\.startsWith\("wiki\/assets\/"\)\)/);
  assert.match(mainSource, /summarizeWatchEvents\(\{[\s\S]*projectRoot:\s*resolvedRoot[\s\S]*outputDir:\s*compiler\.outputDir/);
});

test("main process compile IPC accepts invalidation and CSS reload refresh flags", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /payload\.invalidate/);
  assert.match(mainSource, /payload\.reloadCSS/);
  assert.match(mainSource, /invalidatePage/);
  assert.match(mainSource, /reloadCSS/);
});

test("main process restarts background compilation after watcher compiler changes", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /applyWatchSummary/);
  assert.match(mainSource, /summary\.kind === "rebuild"[\s\S]*startBackgroundCompilation\(projectRoot\)/);
  assert.match(mainSource, /summary\.kind === "structure"[\s\S]*startBackgroundCompilation\(projectRoot\)/);
  assert.match(mainSource, /summary\.cssChanged[\s\S]*startBackgroundCompilation\(projectRoot\)/);
  assert.match(mainSource, /summary\.changedMarkdownPaths\.length > 0[\s\S]*startBackgroundCompilation\(projectRoot\)/);
});

test("shared watch summaries mirror native structure priority payloads", () => {
  const nativeWatcherSource = readRepository("Sources/Wikiwise/FileWatcher.swift");
  const nativeContentSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const coreSource = readRepository("packages/wikiwise-core/src/index.js");
  const rendererSource = read("src/renderer/renderer.js");
  const summarizeWatchEventsSource =
    coreSource.match(/export function summarizeWatchEvents\(\{[\s\S]*?\n\}/)?.[0] ?? "";

  assert.match(nativeWatcherSource, /else if hasStructure \{[\s\S]*watcher\.callback\(\.structure\)/);
  assert.match(nativeContentSource, /case \.structure:[\s\S]*Don't recompile current page on structure changes/);
  assert.notEqual(summarizeWatchEventsSource, "");
  assert.match(summarizeWatchEventsSource, /if \(structureChanged\) \{\s*return createWatchSummary\("structure", false, \[\], true\);/);
  assert.doesNotMatch(summarizeWatchEventsSource, /return createWatchSummary\("structure", false, sortedMarkdownPaths, true\);/);
  assert.match(rendererSource, /const changedMarkdownPaths = change\.changedMarkdownPaths \?\? \[\];/);
  assert.match(rendererSource, /selectedMarkdownChanged[\s\S]*changedMarkdownPaths\.includes\(currentPath\)/);
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
