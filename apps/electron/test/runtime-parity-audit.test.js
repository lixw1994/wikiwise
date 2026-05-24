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

function assertSourceContains(source, patterns) {
  for (const pattern of patterns) {
    assert.match(source, pattern);
  }
}

test("package manifests expose Electron runtime audit commands", () => {
  const rootPackage = readJson("package.json");
  const electronPackage = readJson("apps/electron/package.json");

  assert.equal(rootPackage.scripts["electron:audit:runtime"], "npm --workspace @wikiwise/electron-app run audit:runtime");
  assert.equal(electronPackage.scripts["audit:runtime"], "electron . --audit-runtime");
});

test("runtime audit script loads real renderer through Electron BrowserWindow", () => {
  const scriptPath = path.join(repositoryRoot, "scripts/audit-electron-runtime.mjs");

  assert.equal(fs.existsSync(scriptPath), true);

  const script = fs.readFileSync(scriptPath, "utf8");
  assertSourceContains(script, [
    /from "electron"/,
    /BrowserWindow/,
    /capturePage/,
    /useContentSize:\s*true/,
    /contextIsolation:\s*true/,
    /nodeIntegration:\s*false/,
    /sandbox:\s*true/,
    /src",\s*"preload",\s*"preload\.cjs"/,
    /src",\s*"renderer",\s*"index\.html"/
  ]);
});

test("runtime audit script covers native shell scenarios and assertions", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /welcome-light/,
    /welcome-dark/,
    /project-light/,
    /project-dark/,
    /WikiWise helps you turn any folder/,
    /Create a New Wiki/,
    /Open Existing Folder/,
    /resource-panel|resources-panel/,
    /selectedFileLabel/,
    /publishDialogHidden/,
    /newWikiDialogHidden/,
    /sourceEditorFramePresent/,
    /sourceEditorFrameReady/,
    /codeMirrorEditorPresent/,
    /rightSidebarHidden/,
    /previewFrameHidden/,
    /differentFromFirstPixelCount/
  ]);
});

test("runtime audit script creates scaffold project evidence through core helpers", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /createWikiScaffold/,
    /WikiCompiler/,
    /scanOneLevel/,
    /summarizeDocumentInfo/,
    /pathToFileURL/,
    /wikiwise:getAppSettings/,
    /wikiwise:restoreLastProject/,
    /wikiwise:startProjectWatcher/,
    /wikiwise:startTerminal/
  ]);
});

test("runtime audit script writes report and screenshot artifacts", () => {
  const script = read("scripts/audit-electron-runtime.mjs");

  assertSourceContains(script, [
    /apps",\s*"electron",\s*"out",\s*"runtime-audit"/,
    /report\.json/,
    /screenshots/,
    /\.png/,
    /JSON\.stringify/,
    /Runtime audit report/
  ]);
});

test("main process delegates audit mode to checked-in runtime audit script", () => {
  const mainSource = read("apps/electron/src/main/main.js");

  assertSourceContains(mainSource, [
    /--audit-runtime/,
    /audit-electron-runtime\.mjs/,
    /runElectronRuntimeAudit/
  ]);
});

test("README documents runtime audit workflow without stale debug resource wording", () => {
  const readme = read("apps/electron/README.md");

  assert.match(readme, /npm run electron:audit:runtime/);
  assert.match(readme, /apps\/electron\/out\/runtime-audit\/report\.json/);
  assert.match(readme, /apps\/electron\/out\/runtime-audit\/screenshots/);
  assert.doesNotMatch(readme, /shared resource metadata/i);
});
