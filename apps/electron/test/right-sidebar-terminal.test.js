import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
}

test("main process exposes document info IPC with project path validation", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /summarizeDocumentInfo/);
  assert.match(mainSource, /wikiwise:getDocumentInfo/);
  assert.match(mainSource, /assertProjectPath/);
});

test("main process owns terminal lifecycle and sends output events", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /from "node-pty"/);
  assert.match(mainSource, /terminalSessionsByWebContents/);
  assert.match(mainSource, /wikiwise:startTerminal/);
  assert.match(mainSource, /wikiwise:sendTerminalInput/);
  assert.match(mainSource, /wikiwise:resizeTerminal/);
  assert.match(mainSource, /wikiwise:stopTerminal/);
  assert.match(mainSource, /wikiwise:terminalOutput/);
  assert.match(mainSource, /pty\.spawn/);
  assert.match(mainSource, /\.write\(/);
  assert.match(mainSource, /\.resize\(/);
  assert.match(mainSource, /\.kill\(/);
  assert.match(mainSource, /webContents\.once\("destroyed"/);
  assert.doesNotMatch(mainSource, /from "node:child_process"/);
});

test("preload exposes document info and terminal APIs with output listener cleanup", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(preloadSource, /getDocumentInfo:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:getDocumentInfo"/);
  assert.match(preloadSource, /startTerminal:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:startTerminal"/);
  assert.match(preloadSource, /sendTerminalInput:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:sendTerminalInput"/);
  assert.match(preloadSource, /resizeTerminal:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:resizeTerminal"/);
  assert.match(preloadSource, /stopTerminal:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:stopTerminal"\)/);
  assert.match(preloadSource, /onTerminalOutput:\s*\(callback\)\s*=>/);
  assert.match(preloadSource, /ipcRenderer\.on\("wikiwise:terminalOutput"/);
  assert.match(preloadSource, /removeListener\("wikiwise:terminalOutput"/);
});

test("renderer contains right sidebar info and terminal state", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /rightSidebarTab:\s*"terminal"/);
  assert.match(rendererSource, /documentInfo/);
  assert.match(rendererSource, /terminalInstance/);
  assert.match(rendererSource, /terminalFitAddon/);
  assert.match(rendererSource, /loadTerminalResources/);
  assert.match(rendererSource, /terminalOutputCleanup/);
  assert.match(rendererSource, /startProjectServices/);
  assert.match(rendererSource, /refreshDocumentInfo/);
  assert.match(rendererSource, /renderInfoTab/);
  assert.match(rendererSource, /renderTerminalTab/);
  assert.match(rendererSource, /fitTerminal/);
  assert.match(rendererSource, /resizeTerminal/);
  assert.match(rendererSource, /onData/);
  assert.match(rendererSource, /\.write\(/);
  assert.match(rendererSource, /startTerminal/);
  assert.match(rendererSource, /sendTerminalInput/);
  assert.match(rendererSource, /wikiwise\.getDocumentInfo/);
  assert.match(rendererSource, /wikiwise\.startTerminal/);
  assert.match(rendererSource, /wikiwise\.sendTerminalInput/);
  assert.match(rendererSource, /wikiwise\.resizeTerminal/);
  assert.match(rendererSource, /onTerminalOutput/);
  assert.doesNotMatch(rendererSource, /terminalTranscript/);
});

test("renderer markup and styles include native right sidebar tabs and terminal surface", () => {
  const htmlSource = read("src/renderer/index.html");
  const cssSource = read("src/renderer/styles.css");

  for (const id of [
    "right-sidebar",
    "right-tab-info",
    "right-tab-terminal",
    "info-path",
    "info-edited",
    "info-words",
    "info-directions",
    "info-links",
    "terminal-surface"
  ]) {
    assert.match(htmlSource, new RegExp(`id="${id}"`));
  }
  assert.doesNotMatch(htmlSource, /id="terminal-output"/);
  assert.doesNotMatch(htmlSource, /id="terminal-input"/);
  assert.doesNotMatch(htmlSource, /id="terminal-send"/);

  assert.match(cssSource, /\.right-sidebar/);
  assert.match(cssSource, /\.right-tab/);
  assert.match(cssSource, /\.terminal-surface/);
  assert.match(cssSource, /\.xterm/);
  assert.match(cssSource, /\.info-links/);
});

test("Electron package declares PTY and xterm terminal dependencies", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.match(packageJson.dependencies["node-pty"], /\d/);
  assert.match(packageJson.dependencies["@xterm/xterm"], /\d/);
  assert.match(packageJson.dependencies["@xterm/addon-fit"], /\d/);
});
