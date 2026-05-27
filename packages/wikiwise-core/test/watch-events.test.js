import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { summarizeWatchEvents } from "../src/index.js";

const projectRoot = path.join(path.sep, "tmp", "wikiwise-project");
const outputDir = path.join(projectRoot, "site", "out");
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

function event(relativePath, eventType = "change") {
  return {
    path: path.join(projectRoot, ...relativePath.split("/")),
    eventType
  };
}

function readRepository(relativePath) {
  return fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

test("summarizeWatchEvents ignores compiler output paths", () => {
  const summary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [event("site/out/home.html")]
  });

  assert.equal(summary, null);
});

test("summarizeWatchEvents mirrors native output directory prefix filtering", () => {
  const nativeSource = readRepository("Sources/Wikiwise/FileWatcher.swift");
  const outputDescendantSummary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [event("site/out/home.html")]
  });
  const outputSiblingPrefixSummary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [event("site/output-note.md")]
  });
  const nonOutputSummary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [event("site/other-note.md")]
  });

  assert.match(nativeSource, /path\.hasPrefix\(watcher\.outputDir\)/);
  assert.equal(outputDescendantSummary, null);
  assert.equal(outputSiblingPrefixSummary, null);
  assert.deepEqual(nonOutputSummary, {
    kind: "content",
    cssChanged: false,
    changedMarkdownPaths: [path.join(projectRoot, "site", "other-note.md")],
    structureChanged: false
  });
});

test("summarizeWatchEvents gives root rebuild trigger highest priority", () => {
  const summary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [event("site/style.css"), event(".rebuild")]
  });

  assert.deepEqual(summary, {
    kind: "rebuild",
    cssChanged: false,
    changedMarkdownPaths: [],
    structureChanged: false
  });
});

test("summarizeWatchEvents ignores removed rebuild triggers", () => {
  const summary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [{ ...event(".rebuild", "rename"), removed: true }]
  });

  assert.equal(summary, null);
});

test("summarizeWatchEvents gives structure changes priority over content changes", () => {
  const nativeWatcherSource = readRepository("Sources/Wikiwise/FileWatcher.swift");
  const nativeContentSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const summary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [event("wiki/home.md"), event("wiki/New Page.md", "rename")]
  });

  assert.match(nativeWatcherSource, /else if hasStructure \{\s*\/\/ Structure changes are the next most disruptive\s*watcher\.callback\(\.structure\)/);
  assert.match(nativeContentSource, /case \.structure:[\s\S]*Don't recompile current page on structure changes/);
  assert.equal(summary.kind, "structure");
  assert.equal(summary.structureChanged, true);
  assert.deepEqual(summary.changedMarkdownPaths, []);
});

test("summarizeWatchEvents reports CSS and markdown content changes together", () => {
  const summary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [event("site/style.css"), event("wiki/home.md")]
  });

  assert.deepEqual(summary, {
    kind: "content",
    cssChanged: true,
    changedMarkdownPaths: [path.join(projectRoot, "wiki", "home.md")],
    structureChanged: false
  });
});

test("summarizeWatchEvents mirrors native case-sensitive markdown and CSS suffixes", () => {
  const nativeSource = readRepository("Sources/Wikiwise/FileWatcher.swift");
  const upperCaseSummary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [event("site/theme.CSS"), event("wiki/Notes.MD")]
  });
  const lowerCaseSummary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [event("site/theme.css"), event("wiki/notes.md")]
  });

  assert.match(nativeSource, /path\.hasSuffix\("\.css"\)/);
  assert.match(nativeSource, /path\.hasSuffix\("\.md"\)/);
  assert.doesNotMatch(nativeSource, /localizedCaseInsensitiveContains|caseInsensitive/);
  assert.equal(upperCaseSummary, null);
  assert.deepEqual(lowerCaseSummary, {
    kind: "content",
    cssChanged: true,
    changedMarkdownPaths: [path.join(projectRoot, "wiki", "notes.md")],
    structureChanged: false
  });
});

test("summarizeWatchEvents mirrors native wiki assets path containment", () => {
  const nativeSource = readRepository("Sources/Wikiwise/FileWatcher.swift");
  const rootAssetsSummary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [event("wiki/assets/diagram.png")]
  });
  const nestedAssetsSummary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [event("notes/wiki/assets/diagram.png")]
  });
  const lookalikeSummary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [event("notwiki/assets/diagram.png")]
  });

  assert.match(nativeSource, /path\.contains\("\/wiki\/assets\/"\)/);
  assert.deepEqual(rootAssetsSummary, {
    kind: "structure",
    cssChanged: false,
    changedMarkdownPaths: [],
    structureChanged: true
  });
  assert.deepEqual(nestedAssetsSummary, {
    kind: "structure",
    cssChanged: false,
    changedMarkdownPaths: [],
    structureChanged: true
  });
  assert.equal(lookalikeSummary, null);
});
