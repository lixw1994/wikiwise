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
    "translation",
    "wiki",
    "wiki/sources",
    "site",
    "site/out",
    ".agents",
    ".agents/skills",
    ".agents/skills/upgrade",
    ".agents/skills/ingest",
    ".agents/skills/translate-raw",
    ".agents/skills/translate-imports",
    ".claude",
    ".claude/skills",
    ".claude/skills/upgrade",
    ".claude/skills/ingest",
    ".claude/skills/translate-raw",
    ".claude/skills/translate-imports",
    "wiki/home.md",
    "wiki/index.md",
    "wiki/log.md",
    "CLAUDE.md",
    "AGENTS.md",
    "llm-wiki.md",
    "wikiwise.json",
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

  const agents = fs.readFileSync(path.join(result.path, "AGENTS.md"), "utf8");
  assert.match(agents, /\.agents\/skills\/<name>\/SKILL\.md/);
  assert.match(agents, /\.agents\/skills\/ingest\/SKILL\.md/);
  assert.doesNotMatch(agents, /CLAUDE\.md/);
  assert.doesNotMatch(agents, /\.claude\/skills/);

  assert.equal(
    fs.readFileSync(path.join(result.path, ".agents", "skills", "ingest", "SKILL.md"), "utf8"),
    fs.readFileSync(path.join(result.path, ".claude", "skills", "ingest", "SKILL.md"), "utf8")
  );

  const translateRawSkill = fs.readFileSync(
    path.join(result.path, ".agents", "skills", "translate-raw", "SKILL.md"),
    "utf8"
  );
  assert.match(translateRawSkill, /# Translate Raw Source/);
  assert.match(translateRawSkill, /Core principle: translate the reading experience/);
  assert.match(translateRawSkill, /Technical article brief/);
  assert.match(translateRawSkill, /Be faithful to facts, not literal phrasing/);
  assert.match(translateRawSkill, /LatePost/);
  assert.match(translateRawSkill, /GeekPark/);
  assert.match(translateRawSkill, /Founder Park/);
  assert.match(translateRawSkill, /General article brief/);
  assert.match(translateRawSkill, /You are a professional translator/);
  assert.match(translateRawSkill, /Preserve all Markdown structure/);
  assert.match(translateRawSkill, /Replace every `<target-language>`/);
  assert.match(translateRawSkill, /Translate the article into `<target-language>`/);
  assert.match(translateRawSkill, /Translate the content into `<target-language>`/);
  assert.match(translateRawSkill, /The reader should feel the article was originally written in `<target-language>`/);
  assert.match(translateRawSkill, /Translate the article body, not the container/);
  assert.match(translateRawSkill, /Do not translate YAML frontmatter keys/);
  assert.match(translateRawSkill, /Copy code fences and inline code exactly/);
  assert.match(translateRawSkill, /Build a small terminology map/);
  assert.match(translateRawSkill, /Classify by reader expectation, not keyword count/);
  assert.match(translateRawSkill, /Use the technical brief for technology-industry writing/);
  assert.match(translateRawSkill, /Final self-check/);
  assert.match(translateRawSkill, /raw file is unchanged/);
  assert.doesNotMatch(translateRawSkill, /对应语言/);
  assert.doesNotMatch(translateRawSkill, /[\u4E00-\u9FFF]/);

  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(result.path, "wikiwise.json"), "utf8")), {
    translation: {
      enabled: false,
      targetLanguage: null,
      targetLanguageName: null
    }
  });
});

test("createWikiScaffold writes selected auto-translation language settings", () => {
  const parentDir = makeTempDir();
  const result = createWikiScaffold({
    repositoryRoot,
    parentDir,
    name: "Translated Wiki",
    createdDate: "2026-05-31",
    translationTargetLanguage: "zh-Hans"
  });

  assert.equal(fs.existsSync(path.join(result.path, "translation")), true);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(result.path, "wikiwise.json"), "utf8")), {
    translation: {
      enabled: true,
      targetLanguage: "zh-Hans",
      targetLanguageName: "Simplified Chinese"
    }
  });
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
