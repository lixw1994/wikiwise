import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(
  fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")
);

function assertPackageFile(relativePath) {
  assert.equal(
    fs.existsSync(path.join(packageRoot, relativePath)),
    true,
    `${relativePath} should exist`
  );
}

test("declares the Electron package entrypoints", () => {
  assert.equal(packageJson.name, "@wikiwise/electron-app");
  assert.equal(packageJson.main, "src/main/main.js");
  assert.equal(packageJson.scripts.dev, "electron .");
});

test("contains the minimal Electron shell files", () => {
  assertPackageFile("src/main/main.js");
  assertPackageFile("src/preload/preload.cjs");
  assertPackageFile("src/renderer/index.html");
  assertPackageFile("src/renderer/renderer.js");
  assertPackageFile("src/renderer/styles.css");
});

test("uses a narrow preload bridge instead of renderer Node integration", () => {
  const mainSource = fs.readFileSync(path.join(packageRoot, "src/main/main.js"), "utf8");
  const preloadSource = fs.readFileSync(
    path.join(packageRoot, "src/preload/preload.cjs"),
    "utf8"
  );

  assert.match(mainSource, /nodeIntegration:\s*false/);
  assert.match(mainSource, /contextIsolation:\s*true/);
  assert.match(preloadSource, /exposeInMainWorld\("wikiwise"/);
  assert.match(preloadSource, /openExisting:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:openExisting"\)/);
  assert.equal(preloadSource.includes("resources:"), false);
});

test("keeps verification dependency-light", () => {
  const testSource = fs.readFileSync(fileURLToPath(import.meta.url), "utf8");

  assert.equal(testSource.includes("from \"electron\""), false);
  assert.equal(testSource.includes("require(\"electron\")"), false);
});
