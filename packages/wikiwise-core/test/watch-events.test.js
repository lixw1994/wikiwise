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
  const summary = summarizeWatchEvents({
    projectRoot,
    outputDir,
    events: [event("wiki/home.md"), event("wiki/New Page.md", "rename")]
  });

  assert.equal(summary.kind, "structure");
  assert.equal(summary.structureChanged, true);
  assert.deepEqual(summary.changedMarkdownPaths, [path.join(projectRoot, "wiki", "home.md")]);
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
