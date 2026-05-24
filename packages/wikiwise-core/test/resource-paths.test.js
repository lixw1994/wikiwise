import assert from "node:assert/strict";
import test from "node:test";
import {
  getBundledResourceNames,
  resolveRepositoryResourcePath
} from "../src/index.js";

test("lists the bundled wiki resources Electron should reuse", () => {
  assert.deepEqual(getBundledResourceNames(), [
    "app.js",
    "build.js",
    "graph.js",
    "katex.min.css",
    "katex.min.js",
    "map-3d.html",
    "map.html",
    "markdown-it.min.js",
    "style.css"
  ]);
});

test("resolves existing Swift resource files from the repository root", () => {
  const resourcePath = resolveRepositoryResourcePath(
    new URL("../../../", import.meta.url),
    "build.js"
  );

  assert.match(resourcePath, /Sources\/Wikiwise\/Resources\/build\.js$/);
});
