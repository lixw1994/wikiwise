import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { WikiCompiler, slugForPath } from "../src/index.js";

const repositoryRoot = path.resolve(new URL("../../../", import.meta.url).pathname);

function copyResource(name, destination) {
  fs.copyFileSync(
    path.join(repositoryRoot, "Sources", "Wikiwise", "Resources", name),
    path.join(destination, name)
  );
}

function makeWikiFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-compiler-"));
  const wikiDir = path.join(root, "wiki");
  const siteDir = path.join(root, "site");

  fs.mkdirSync(wikiDir, { recursive: true });
  fs.mkdirSync(siteDir, { recursive: true });
  fs.writeFileSync(path.join(root, "CLAUDE.md"), "# Compiler Fixture - schema\n");
  fs.writeFileSync(
    path.join(wikiDir, "home.md"),
    "# Home\n\nWelcome to [[Second Page]].\n"
  );
  fs.writeFileSync(path.join(wikiDir, "Second Page.md"), "# Second Page\n");

  for (const resource of [
    "build.js",
    "style.css",
    "markdown-it.min.js",
    "app.js",
    "graph.js",
    "map.html",
    "map-3d.html"
  ]) {
    copyResource(resource, siteDir);
  }

  return root;
}

test("slugForPath matches native lowercase hyphen behavior", () => {
  assert.equal(slugForPath("/tmp/My Page.md"), "my-page");
});

test("WikiCompiler scans and compiles a scaffold-style wiki home page", () => {
  const root = makeWikiFixture();
  const compiler = new WikiCompiler({
    sourceDir: root,
    repositoryRoot
  });

  assert.equal(compiler.outputDir, path.join(root, "site", "out"));
  assert.equal(compiler.scanPages(), 3);

  const result = compiler.compileMarkdownFile(path.join(root, "wiki", "home.md"));

  assert.equal(result.slug, "home");
  assert.equal(result.success, true);
  assert.equal(result.outputPath, path.join(root, "site", "out", "home.html"));
  assert.equal(fs.existsSync(result.outputPath), true);
  assert.match(fs.readFileSync(result.outputPath, "utf8"), /Home/);
  assert.equal(fs.existsSync(path.join(root, "site", "out", "search.json")), true);
});
