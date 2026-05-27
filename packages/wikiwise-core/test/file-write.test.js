import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { writeActiveFile, writeTextFile } from "../src/index.js";

test("writeTextFile writes UTF-8 content and returns write metadata", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-write-"));
  const target = path.join(root, "wiki", "notes.md");
  const content = "# Notes\n\nhello from Wikiwise\n";

  const result = writeTextFile(target, content);

  assert.equal(fs.readFileSync(target, "utf8"), content);
  assert.equal(result.path, target);
  assert.equal(result.bytes, Buffer.byteLength(content, "utf8"));
});

test("writeActiveFile records the selected file relative to the project root", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-active-file-"));
  const selected = path.join(root, "wiki", "home.md");
  fs.mkdirSync(path.join(root, ".claude"), { recursive: true });

  const result = writeActiveFile(root, selected);

  assert.equal(fs.readFileSync(path.join(root, ".claude", "active-file"), "utf8"), "wiki/home.md");
  assert.equal(result.path, path.join(root, ".claude", "active-file"));
  assert.equal(result.relativePath, "wiki/home.md");
  assert.equal(result.written, true);
});

test("writeActiveFile mirrors native best-effort behavior when .claude is missing", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-active-file-missing-"));
  const selected = path.join(root, "wiki", "home.md");
  fs.mkdirSync(path.dirname(selected), { recursive: true });
  fs.writeFileSync(selected, "# Home\n", "utf8");

  const result = writeActiveFile(root, selected);

  assert.equal(fs.existsSync(path.join(root, ".claude")), false);
  assert.equal(fs.existsSync(path.join(root, ".claude", "active-file")), false);
  assert.equal(result.path, path.join(root, ".claude", "active-file"));
  assert.equal(result.relativePath, "wiki/home.md");
  assert.equal(result.written, false);
});
