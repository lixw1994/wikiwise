import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createWikiScaffold, slugForWikiName } from "../src/index.js";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-scaffold-"));
}

test("slugForWikiName matches native lowercase hyphen filtering", () => {
  assert.equal(slugForWikiName("My Wiki 2026!"), "my-wiki-2026");
  assert.equal(slugForWikiName("  Research Notes  "), "research-notes");
});

test("createWikiScaffold writes native scaffold structure and template replacements", () => {
  const parentDir = makeTempDir();
  const result = createWikiScaffold({
    repositoryRoot,
    parentDir,
    name: "My Wiki 2026",
    createdDate: "2026-05-25"
  });

  assert.equal(result.name, "My Wiki 2026");
  assert.equal(result.slug, "my-wiki-2026");
  assert.equal(result.path, path.join(parentDir, "my-wiki-2026"));

  for (const relativePath of [
    "raw",
    "wiki",
    "wiki/sources",
    "site",
    "site/out",
    ".claude",
    ".claude/skills",
    ".claude/skills/upgrade",
    ".claude/skills/ingest",
    "wiki/home.md",
    "wiki/index.md",
    "wiki/log.md",
    "CLAUDE.md",
    "AGENTS.md",
    "llm-wiki.md",
    ".claude/settings.json",
    ".claude/scaffold-version",
    ".gitignore",
    "site/build.js",
    "site/style.css",
    "site/markdown-it.min.js",
    "site/app.js",
    "site/graph.js",
    "site/map.html",
    "site/map-3d.html"
  ]) {
    assert.equal(fs.existsSync(path.join(result.path, ...relativePath.split("/"))), true);
  }

  const claude = fs.readFileSync(path.join(result.path, "CLAUDE.md"), "utf8");
  assert.match(claude, /^# My Wiki 2026 — schema/m);
  assert.doesNotMatch(claude, /\{\{WIKI_NAME\}\}/);

  const home = fs.readFileSync(path.join(result.path, "wiki", "home.md"), "utf8");
  assert.match(home, new RegExp(`cd ${escapeRegExp(result.path)} && claude`));
  assert.doesNotMatch(home, /\{\{WIKI_PATH\}\}/);

  assert.equal(
    fs.readFileSync(path.join(result.path, ".claude", "scaffold-version"), "utf8"),
    "created:2026-05-25\n"
  );
  assert.equal(
    fs.readFileSync(path.join(result.path, ".gitignore"), "utf8"),
    "site/out/\npublish.json\n.rebuild\n"
  );

  const settings = fs.readFileSync(path.join(result.path, ".claude", "settings.json"), "utf8");
  assert.match(settings, /"Bash\(\*\)"/);
});

test("createWikiScaffold allows native empty slug for non-empty names", () => {
  const parentDir = makeTempDir();
  const result = createWikiScaffold({
    repositoryRoot,
    parentDir,
    name: "!!!",
    createdDate: "2026-05-25"
  });

  assert.equal(slugForWikiName("!!!"), "");
  assert.equal(result.name, "!!!");
  assert.equal(result.slug, "");
  assert.equal(result.path, parentDir);
  assert.equal(fs.existsSync(path.join(parentDir, "wiki", "home.md")), true);
  assert.match(fs.readFileSync(path.join(parentDir, "CLAUDE.md"), "utf8"), /^# !!! — schema/m);
  assert.match(
    fs.readFileSync(path.join(parentDir, "wiki", "home.md"), "utf8"),
    new RegExp(`cd ${escapeRegExp(parentDir)} && claude`)
  );
});

test("createWikiScaffold rejects empty names before writing target content", () => {
  const parentDir = makeTempDir();

  assert.throws(
    () =>
      createWikiScaffold({
        repositoryRoot,
        parentDir,
        name: "   ",
        createdDate: "2026-05-25"
      }),
    /requires a wiki name/
  );
  assert.deepEqual(fs.readdirSync(parentDir), []);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
