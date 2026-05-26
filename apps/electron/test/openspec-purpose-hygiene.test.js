import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");
const specsRoot = path.join(repositoryRoot, "openspec", "specs");

const generatedPurposePatterns = [
  /TBD - created by archiving change/,
  /Update Purpose after archive/
];

function listMarkdownFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(entryPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }

  return files;
}

test("archived OpenSpec specs do not retain generated purpose placeholders", () => {
  const offenders = listMarkdownFiles(specsRoot).flatMap((filePath) => {
    const source = fs.readFileSync(filePath, "utf8");
    const relativePath = path.relative(repositoryRoot, filePath);

    return generatedPurposePatterns
      .filter((pattern) => pattern.test(source))
      .map((pattern) => `${relativePath}: ${pattern.source}`);
  });

  assert.deepEqual(offenders, []);
});
