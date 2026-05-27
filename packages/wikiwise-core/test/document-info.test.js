import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { summarizeDocumentInfo } from "../src/index.js";

test("summarizeDocumentInfo returns native-compatible markdown info", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-document-info-"));
  const target = path.join(root, "wiki", "daily note.md");
  const content = [
    "---",
    "directions: Keep concise",
    "---",
    "# Note",
    "Hello wiki world.",
    "Link to [[Alpha]] and [[Beta]] and [[Alpha]]."
  ].join("\n");
  const modifiedAt = new Date("2026-05-24T10:30:00.000Z");

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
  fs.utimesSync(target, modifiedAt, modifiedAt);

  const info = summarizeDocumentInfo(target);

  assert.equal(info.path, target);
  assert.equal(info.name, "daily note.md");
  assert.equal(info.modifiedAt, modifiedAt.toISOString());
  assert.equal(info.wordCount, 17);
  assert.equal(info.directions, "Keep concise");
  assert.deepEqual(info.wikilinks, ["Alpha", "Beta"]);
});

test("summarizeDocumentInfo ignores directions syntax native RightSidebar ignores", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-document-info-directions-"));
  const fixtures = [
    {
      name: "leading-open.md",
      content: [" ---", "directions: Leading marker", "---", "Body"].join("\n")
    },
    {
      name: "trailing-open.md",
      content: ["--- ", "directions: Trailing marker", "---", "Body"].join("\n")
    },
    {
      name: "indented-key.md",
      content: ["---", "  directions: Indented key", "---", "Body"].join("\n")
    }
  ];

  for (const fixture of fixtures) {
    const target = path.join(root, "wiki", fixture.name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, fixture.content, "utf8");

    assert.equal(summarizeDocumentInfo(target).directions, null, fixture.name);
  }
});

test("summarizeDocumentInfo ignores CRLF frontmatter directions like native RightSidebar", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-document-info-crlf-directions-"));
  const target = path.join(root, "wiki", "crlf-directions.md");
  const content = "---\r\ndirections: Native ignores CRLF markers\r\n---\r\n# Body";

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");

  const info = summarizeDocumentInfo(target);

  assert.equal(info.directions, null);
  assert.equal(info.wordCount, 9);
});

test("summarizeDocumentInfo uses only exact native closing marker before directions", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-document-info-closing-"));
  const target = path.join(root, "wiki", "loose-closing.md");
  const content = ["---", "--- ", "directions: Still native", "---", "Body"].join("\n");

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");

  assert.equal(summarizeDocumentInfo(target).directions, "Still native");
});

test("summarizeDocumentInfo preserves native raw wikilink targets", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-document-info-links-"));
  const target = path.join(root, "wiki", "raw-links.md");
  const content = [
    "Raw links:",
    "[[ Alpha ]] and [[Alpha]] and [[Alpha ]] and [[ Alpha ]] and [[   ]]"
  ].join("\n");

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");

  assert.deepEqual(summarizeDocumentInfo(target).wikilinks, [" Alpha ", "Alpha", "Alpha ", "   "]);
});

test("summarizeDocumentInfo preserves native wikilink targets containing a single closing bracket", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-document-info-bracket-links-"));
  const target = path.join(root, "wiki", "bracket-links.md");
  const content = [
    "Bracket links:",
    "[[Alpha]Beta]] and [[Gamma]] and [[Alpha]Beta]] and [[]]"
  ].join("\n");

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");

  assert.deepEqual(summarizeDocumentInfo(target).wikilinks, ["Alpha]Beta", "Gamma"]);
});

test("summarizeDocumentInfo rejects missing files", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-document-info-missing-"));
  const target = path.join(root, "wiki", "missing.md");

  assert.throws(() => summarizeDocumentInfo(target), /Document not found/);
});
