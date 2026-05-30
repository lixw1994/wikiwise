import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");

const checkedRoots = [
  ".github/workflows",
  "apps/electron",
  "editor",
  "packages/wikiwise-core",
  "scripts",
  "README.md",
  "CLAUDE.md",
  "openspec/config.yaml",
  "openspec/project.md",
  "openspec/specs"
];

const ignoredPathSegments = new Set(["node_modules", "out", ".git"]);
const forbiddenPatterns = [
  new RegExp([["Sour", "ces"].join(""), ["Wiki", "wise"].join("")].join("/")),
  new RegExp([
    String.raw`["']${["Sour", "ces"].join("")}["']`,
    String.raw`[\s\S]{0,160}`,
    String.raw`["']${["Wiki", "wise"].join("")}["']`
  ].join("")),
  new RegExp(["Package", "swift"].join("\\.")),
  new RegExp(["swift", " build"].join("")),
  new RegExp(["Swi", "ft", "Term"].join("")),
  new RegExp(["Swi", "ft", "UI"].join("")),
  new RegExp(["WK", "WebView"].join("")),
  new RegExp(["FS", "Events"].join("")),
  new RegExp(["JavaScript", "Core"].join(""))
];

function* walk(targetPath) {
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(targetPath)) {
      if (ignoredPathSegments.has(entry)) {
        continue;
      }
      yield* walk(path.join(targetPath, entry));
    }
    return;
  }

  yield targetPath;
}

function readTextIfPossible(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.includes(0)) {
    return null;
  }
  return buffer.toString("utf8");
}

test("active Electron workspace does not depend on retired platform sources", () => {
  const offenders = [];

  for (const checkedRoot of checkedRoots) {
    const rootPath = path.join(repositoryRoot, checkedRoot);
    if (!fs.existsSync(rootPath)) {
      continue;
    }

    for (const filePath of walk(rootPath)) {
      const text = readTextIfPossible(filePath);
      if (text === null) {
        continue;
      }

      for (const pattern of forbiddenPatterns) {
        if (pattern.test(text)) {
          offenders.push(path.relative(repositoryRoot, filePath));
          break;
        }
      }
    }
  }

  assert.deepEqual([...new Set(offenders)].sort(), []);
});
