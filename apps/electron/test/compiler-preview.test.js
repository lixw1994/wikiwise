import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");

function read(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
}

function readRepository(relativePath) {
  return fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

test("main process wires compiler preview through IPC and main-created file URLs", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /WikiCompiler/);
  assert.match(mainSource, /pathToFileURL/);
  assert.match(mainSource, /wikiwise:compilePage/);
  assert.match(mainSource, /compileMarkdownFile/);
  assert.match(mainSource, /fileUrl/);
});

test("main process compiles wiki home when opening scaffolded folders", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /wiki\/home\.md/);
  assert.match(mainSource, /scanPages/);
  assert.match(mainSource, /selectedFile/);
});

test("main process schedules native-style background compilation batches", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /backgroundCompilationJobsByProjectRoot/);
  assert.match(mainSource, /backgroundCompilationBatchSize\s*=\s*3/);
  assert.match(mainSource, /backgroundCompilationIntervalMs\s*=\s*100/);
  assert.match(mainSource, /function startBackgroundCompilation/);
  assert.match(mainSource, /function stopBackgroundCompilation/);
  assert.match(mainSource, /compileNextBatch\(backgroundCompilationBatchSize\)/);
  assert.match(mainSource, /setInterval/);
  assert.match(mainSource, /clearInterval/);
  assert.match(mainSource, /startBackgroundCompilation\(projectRoot\)/);
});

test("main process ties background compilation to native window resource cleanup", () => {
  const mainSource = read("src/main/main.js");
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");

  assert.match(
    nativeSource,
    /\.onDisappear\s*\{[\s\S]*backgroundTimer\?\.invalidate\(\)[\s\S]*backgroundTimer = nil[\s\S]*fileWatcher\?\.stop\(\)[\s\S]*fileWatcher = nil/
  );
  assert.match(mainSource, /const projectRootsByWebContents = new Map\(\)/);
  assert.match(mainSource, /function setWebContentsProjectRoot\(webContents,\s*projectRoot\)/);
  assert.match(mainSource, /const previousRoot = projectRootsByWebContents\.get\(webContentsId\)/);
  assert.match(
    mainSource,
    /if \(previousRoot && previousRoot !== nextRoot\) \{[\s\S]*stopBackgroundCompilation\(previousRoot\)/
  );
  assert.match(mainSource, /function stopBackgroundCompilationForWebContents\(webContentsId\)/);
  assert.match(
    mainSource,
    /function closeWindowScopedResources\(webContentsId\) \{[\s\S]*closeProjectWatcher\(webContentsId\)[\s\S]*stopBackgroundCompilationForWebContents\(webContentsId\)[\s\S]*closeTerminal\(webContentsId\)/
  );
  assert.match(
    mainSource,
    /mainWindow\.webContents\.once\("destroyed",\s*\(\) => \{[\s\S]*closeWindowScopedResources\(webContentsId\)[\s\S]*startupRestoreByWebContentsId\.delete\(webContentsId\)/
  );
});

test("preload exposes compiler preview APIs", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(preloadSource, /compilePage:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:compilePage"/);
});

test("renderer exposes File and Wiki modes with preview iframe wiring", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");

  assert.match(rendererSource, /detailMode/);
  assert.match(rendererSource, /renderPreview/);
  assert.match(rendererSource, /wikiwise\.compilePage/);
  assert.match(htmlSource, /id="mode-file"/);
  assert.match(htmlSource, /id="mode-wiki"/);
  assert.match(htmlSource, /id="preview-frame"/);
});

test("renderer keeps WIKI selected for markdown fallback and FILE selected for non-markdown files", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(
    rendererSource,
    /function initialDetailModeForFile\(file\)\s*\{[\s\S]*if \(!file\) return "wiki";[\s\S]*if \(!isMarkdownFile\(file\.path\)\) return "file";[\s\S]*return "wiki";[\s\S]*\}/
  );
  assert.doesNotMatch(rendererSource, /state\.detailMode = hasCompiledPreview\(file\) \? "wiki" : "file"/);
  assert.match(
    rendererSource,
    /const shouldShowSourceEditor =[\s\S]*state\.detailMode === "file" \|\| \(state\.detailMode === "wiki" && !wikiAvailable\)/
  );
  assert.match(
    rendererSource,
    /modeWikiButton\.classList\.toggle\("selected",\s*state\.detailMode === "wiki"\)/
  );
});

test("renderer mirrors native compiled preview scroll preservation", () => {
  const nativeContentViewSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const nativeWebViewSource = readRepository("Sources/Wikiwise/WebView.swift");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(
    nativeContentViewSource,
    /private func captureScrollAndSwitch\(to mode: DetailMode\)[\s\S]*activeWebView\.captureScrollFraction\(isEditor:\s*isEditor\)[\s\S]*scrollFraction = fraction[\s\S]*detailMode = mode/
  );
  assert.match(
    nativeWebViewSource,
    /window\.scrollY \/ Math\.max\(1,\s*document\.body\.scrollHeight - window\.innerHeight\)/
  );
  assert.match(
    nativeWebViewSource,
    /func webView\(_ webView: WKWebView,\s*didFinish navigation: WKNavigation!\)[\s\S]*window\.scrollTo\(0,[\s\S]*document\.body\.scrollHeight - window\.innerHeight/
  );

  assert.match(rendererSource, /function capturePreviewScrollFraction\(\)/);
  assert.match(rendererSource, /previewFrame\.contentWindow/);
  assert.match(rendererSource, /scrollY \/ Math\.max\(1,\s*previewDocument\.body\.scrollHeight - previewWindow\.innerHeight\)/);
  assert.match(rendererSource, /state\.selectedFile\.scrollFraction = fraction/);
  assert.match(rendererSource, /function restorePreviewScrollFraction/);
  assert.match(rendererSource, /previewWindow\.scrollTo\(0,\s*fraction \* maxScroll\)/);
  assert.match(
    rendererSource,
    /state\.detailMode === "wiki" && mode !== "wiki"[\s\S]*capturePreviewScrollFraction\(\)[\s\S]*state\.detailMode = mode/
  );
  assert.match(
    rendererSource,
    /if \(!previewFrame\.hidden && previewFrame\.getAttribute\("src"\) === file\.compiled\.fileUrl\) \{[\s\S]*capturePreviewScrollFraction\(\)/
  );
  assert.match(
    rendererSource,
    /previewFrame\.addEventListener\("load",\s*\(\) => \{[\s\S]*restorePreviewScrollFraction\(state\.selectedFile\?\.scrollFraction \?\? 0\)/
  );
});
