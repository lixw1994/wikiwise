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

function sourceBetween(source, startSignature, endSignature) {
  const start = source.indexOf(startSignature);
  const end = source.indexOf(endSignature, start + startSignature.length);

  assert.notEqual(start, -1);
  assert.notEqual(end, -1);

  return source.slice(start, end);
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

test("selected markdown preview compilation uses existing scan lifecycle like native", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const mainSource = read("src/main/main.js");
  const nativeFolderOpenSource = sourceBetween(
    nativeSource,
    "let c = Compiler(sourceDir: url)",
    "            // Background drip: compile remaining pages"
  );
  const nativeLoadFileSource = sourceBetween(
    nativeSource,
    "private func loadFile(_ url: URL)",
    "    /// Write the currently open file path"
  );
  const nativeWatcherSource = sourceBetween(
    nativeSource,
    "private func startFileWatcher(directory: URL, compiler c: Compiler)",
    "    /// Rescan the sidebar file tree"
  );
  const electronCompileSource = sourceBetween(
    mainSource,
    "function compileMarkdownFile(projectRoot, filePath, options = {})",
    "function settingsPath()"
  );
  const electronProjectOpenSource = sourceBetween(
    mainSource,
    "function createProjectResult(targetPath, webContents = null)",
    "function openExistingProject(browserWindow)"
  );
  const electronWatcherSource = sourceBetween(
    mainSource,
    "function applyWatchSummary(projectRoot, summary)",
    "function closeProjectWatcher(webContentsId)"
  );

  assert.match(nativeFolderOpenSource, /c\.scanPages\(\)/);
  assert.match(nativeLoadFileSource, /compileSingle\(slug:\s*pageSlug\)/);
  assert.match(nativeLoadFileSource, /compileAdhoc\(filePath:\s*url\.path,\s*outputPath:\s*htmlFile\.path\)/);
  assert.doesNotMatch(nativeLoadFileSource, /scanPages\(\)|rescan\(\)/);
  assert.match(nativeWatcherSource, /case \.markdown\(let changedPaths\):[\s\S]*c\.rescan\(\)/);
  assert.match(nativeWatcherSource, /case \.rebuild:[\s\S]*c\.rescan\(\)/);
  assert.match(nativeWatcherSource, /case \.structure:[\s\S]*c\.rescan\(\)/);

  assert.match(electronProjectOpenSource, /getCompiler\(projectRoot\)\.scanPages\(\)/);
  assert.match(electronCompileSource, /compiler\.compileMarkdownFile\(filePath\)/);
  assert.doesNotMatch(electronCompileSource, /compiler\.scanPages\(\)/);
  assert.match(electronWatcherSource, /summary\.kind === "rebuild"[\s\S]*compiler\.rescan\(\)/);
  assert.match(electronWatcherSource, /summary\.kind === "structure"[\s\S]*compiler\.rescan\(\)/);
  assert.match(electronWatcherSource, /summary\.changedMarkdownPaths\.length > 0[\s\S]*compiler\.rescan\(\)/);
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

test("renderer preserves selected mode for subsequent file selections like native", () => {
  const nativeContentViewSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const nativeNavigateToSource =
    nativeContentViewSource.match(/private func navigateTo\(_ url: URL\) \{[\s\S]*?\n    \}/)?.[0] ?? "";

  assert.match(
    nativeContentViewSource,
    /else if let url = selectedFileURL,\s*url\.pathExtension\.lowercased\(\) != "md" \{[\s\S]*EditorWebView\(fileURL:\s*url,[\s\S]*\}\s*else\s*\{[\s\S]*switch detailMode/
  );
  assert.match(
    nativeContentViewSource,
    /private func navigateTo\(_ url: URL\) \{[\s\S]*selectedFileURL = url[\s\S]*loadFile\(url\)[\s\S]*webViewReloadToken \+= 1[\s\S]*\}/
  );
  assert.doesNotMatch(nativeNavigateToSource, /detailMode\s*=/);
  assert.match(
    rendererSource,
    /function detailModeForSelectedFile\(file,\s*options = \{\}\)\s*\{[\s\S]*if \(!file\) return "wiki";[\s\S]*if \(options\.preserveDetailMode\) return state\.detailMode;[\s\S]*if \(!isMarkdownFile\(file\.path\)\) return state\.detailMode;[\s\S]*return "wiki";[\s\S]*\}/
  );
  assert.match(
    rendererSource,
    /function setSelectedFile\(file,\s*options = \{\}\)[\s\S]*state\.detailMode = detailModeForSelectedFile\(file,\s*options\)/
  );
  assert.match(
    rendererSource,
    /setSelectedFile\(nextFile,\s*\{\s*preserveDetailMode:\s*options\.preserveDetailMode !== false\s*\}\)/
  );
  assert.doesNotMatch(rendererSource, /if \(!isMarkdownFile\(file\.path\)\) return "file"/);
  assert.doesNotMatch(
    rendererSource,
    /function initialDetailModeForFile\(file\)\s*\{[\s\S]*if \(!isMarkdownFile\(file\.path\)\) return state\.detailMode;[\s\S]*return "wiki";[\s\S]*\}/
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
