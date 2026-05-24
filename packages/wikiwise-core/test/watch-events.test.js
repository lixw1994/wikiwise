import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { summarizeWatchEvents } from "../src/index.js";

const projectRoot = path.join(path.sep, "tmp", "wikiwise-project");
const outputDir = path.join(projectRoot, "site", "out");

function event(relativePath, eventType = "change") {
  return {
    path: path.join(projectRoot, ...relativePath.split("/")),
    eventType
  };
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
