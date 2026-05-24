import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

test("package manifests expose Electron macOS packaging commands", () => {
  const rootPackage = readJson("package.json");
  const electronPackage = readJson("apps/electron/package.json");

  assert.equal(rootPackage.scripts["electron:package:mac"], "npm --workspace @wikiwise/electron-app run package:mac");
  assert.equal(electronPackage.scripts["package:mac"], "node ../../scripts/package-electron-macos.mjs");
});

test("packaging script assembles a Wikiwise macOS app from installed Electron", () => {
  const script = read("scripts/package-electron-macos.mjs");

  assert.match(script, /node_modules\/electron\/dist\/Electron\.app/);
  assert.match(script, /apps\/electron\/out\/Wikiwise\.app/);
  assert.match(script, /Contents\/Resources\/app/);
  assert.match(script, /Contents\/MacOS\/Electron/);
  assert.match(script, /Contents\/MacOS\/Wikiwise/);
  assert.match(script, /CFBundleDisplayName/);
  assert.match(script, /CFBundleName/);
  assert.match(script, /CFBundleExecutable/);
  assert.match(script, /CFBundleIdentifier/);
  assert.match(script, /CFBundleShortVersionString/);
  assert.match(script, /com\.readwise\.wikiwise/);
  assert.match(script, /copyElectronAppSource/);
  assert.match(script, /copyCorePackage/);
});

test("packaging script embeds the Electron app and shared core package layout", () => {
  const script = read("scripts/package-electron-macos.mjs");

  assert.match(script, /src\/main/);
  assert.match(script, /src\/preload/);
  assert.match(script, /src\/renderer/);
  assert.match(script, /node_modules\/@wikiwise\/core/);
  assert.match(script, /packages\/wikiwise-core\/src/);
  assert.match(script, /packages\/wikiwise-core\/package\.json/);
});

test("README documents local unsigned packaging and release guardrails", () => {
  const readme = read("apps/electron/README.md");

  assert.match(readme, /npm run electron:package:mac/);
  assert.match(readme, /apps\/electron\/out\/Wikiwise\.app/);
  assert.match(readme, /unsigned/i);
  assert.match(readme, /signed/i);
  assert.match(readme, /notarized/i);
  assert.match(readme, /DMG/);
});
