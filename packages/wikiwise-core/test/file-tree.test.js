import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { readTextFile, scanOneLevel } from "../src/index.js";

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-tree-"));

  for (const directory of ["raw", "site", "sources", "wiki", "notes", ".hidden-dir"]) {
    fs.mkdirSync(path.join(root, directory), { recursive: true });
  }

  const files = {
    "CLAUDE.md": "# Claude",
    "AGENTS.md": "# Agents",
    "zeta.md": "# Zeta",
    "alpha.js": "console.log('alpha')",
    "theme.css": "body {}",
    "data.json": "{\"ok\":true}",
    "page.html": "<h1>Page</h1>",
    "bundle.min.js": "ignored",
    ".hidden.md": "ignored",
    "image.png": "ignored"
  };

  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(root, name), content);
  }

  return root;
}

test("scanOneLevel matches native file filtering and ordering", () => {
  const root = makeFixture();

  const nodes = scanOneLevel(root);

  assert.deepEqual(
    nodes.map((node) => node.name),
    [
      "wiki",
      "notes",
      "raw",
      "site",
      "sources",
      "AGENTS.md",
      "CLAUDE.md",
      "alpha.js",
      "data.json",
      "page.html",
      "theme.css",
      "zeta.md"
    ]
  );

  assert.equal(nodes[0].isDirectory, true);
  assert.deepEqual(nodes[0].children, []);
  assert.equal(nodes.at(-1).isDirectory, false);
});

test("readTextFile returns UTF-8 file contents", () => {
  const root = makeFixture();
  const filePath = path.join(root, "CLAUDE.md");

  assert.equal(readTextFile(filePath), "# Claude");
});
