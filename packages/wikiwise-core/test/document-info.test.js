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

test("summarizeDocumentInfo uses only exact native closing marker before directions", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-document-info-closing-"));
  const target = path.join(root, "wiki", "loose-closing.md");
  const content = ["---", "--- ", "directions: Still native", "---", "Body"].join("\n");

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");

  assert.equal(summarizeDocumentInfo(target).directions, "Still native");
});

test("summarizeDocumentInfo rejects missing files", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-document-info-missing-"));
  const target = path.join(root, "wiki", "missing.md");

  assert.throws(() => summarizeDocumentInfo(target), /Document not found/);
});
