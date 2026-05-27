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

test("main process exposes project lifecycle IPC channels", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /dialog\.showOpenDialog/);
  assert.match(mainSource, /wikiwise:openExisting/);
  assert.match(mainSource, /wikiwise:scanProject/);
  assert.match(mainSource, /wikiwise:readFile/);
  assert.match(mainSource, /scanOneLevel/);
  assert.match(mainSource, /readTextFile/);
});

test("main process mirrors native selected-file read fallback", () => {
  const mainSource = read("src/main/main.js");
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const nativeLoadFileSource =
    nativeSource.match(/private func loadFile\(_ url: URL\) \{[\s\S]*?\n    \}/)?.[0] ?? "";
  const compileWikiHomeSource =
    mainSource.match(/function compileWikiHomeIfPresent\(projectRoot\) \{[\s\S]*?\n\}/)?.[0] ?? "";
  const createProjectResultSource =
    mainSource.match(/function createProjectResult\(targetPath,\s*webContents = null\) \{[\s\S]*?\n\}/)?.[0] ?? "";
  const readFileHandlerSource =
    mainSource.match(/ipcMain\.handle\("wikiwise:readFile"[\s\S]*?\n\}\);/)?.[0] ?? "";

  assert.notEqual(nativeLoadFileSource, "");
  assert.match(nativeLoadFileSource, /\(try\? String\(contentsOf:\s*url,\s*encoding:\s*\.utf8\)\)\s*\?\?\s*"Could not read file\."/);
  assert.match(mainSource, /readDisplayTextFile/);
  assert.match(compileWikiHomeSource, /content:\s*readDisplayTextFile\(homePath\)/);
  assert.match(createProjectResultSource, /content:\s*readDisplayTextFile\(targetPath\)/);
  assert.match(readFileHandlerSource, /return readDisplayTextFile\(filePath\)/);
  assert.doesNotMatch(compileWikiHomeSource, /content:\s*readTextFile\(homePath\)/);
  assert.doesNotMatch(createProjectResultSource, /content:\s*readTextFile\(targetPath\)/);
  assert.doesNotMatch(readFileHandlerSource, /return readTextFile\(filePath\)/);
  assert.match(mainSource, /function readAppSettings\(\)[\s\S]*JSON\.parse\(readTextFile\(settingsPath\(\)\)\)/);
});

test("open existing picker mirrors native folder and plain text contract", () => {
  const mainSource = read("src/main/main.js");
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const openExistingStart = mainSource.indexOf("async function openExistingProject");
  const openExistingEnd = mainSource.indexOf("function createMainWindow", openExistingStart);
  const openExistingSource = mainSource.slice(openExistingStart, openExistingEnd);

  assert.notEqual(openExistingStart, -1);
  assert.notEqual(openExistingEnd, -1);
  assert.match(nativeSource, /panel\.canChooseDirectories = true/);
  assert.match(nativeSource, /panel\.canChooseFiles = true/);
  assert.match(nativeSource, /panel\.allowedContentTypes = \[\.folder, \.plainText\]/);
  assert.match(nativeSource, /panel\.allowsMultipleSelection = false/);
  assert.match(nativeSource, /panel\.message = "Choose a markdown file or a folder"/);
  assert.doesNotMatch(nativeSource, /panel\.title/);
  assert.match(openExistingSource, /message:\s*"Choose a markdown file or a folder"/);
  assert.doesNotMatch(openExistingSource, /\btitle:\s*"Choose a markdown file or a folder"/);
  assert.match(openExistingSource, /properties:\s*\["openFile", "openDirectory"\]/);
  assert.match(
    openExistingSource,
    /filters:\s*\[\s*\{\s*name:\s*"Markdown or text files",\s*extensions:\s*\["md", "markdown", "txt", "text"\]\s*\}\s*\]/
  );
  assert.doesNotMatch(openExistingSource, /"css"|"js"|"json"|"html"/);
  assert.doesNotMatch(openExistingSource, /All Files/);
  assert.doesNotMatch(openExistingSource, /multiSelections/);
});

test("preload bridge exposes project lifecycle APIs", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(preloadSource, /openExisting:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:openExisting"\)/);
  assert.match(preloadSource, /scanProject:\s*\(projectPath\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:scanProject"/);
  assert.match(preloadSource, /readFile:\s*\(filePath\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:readFile"/);
});

test("renderer contains project lifecycle state and welcome entry points", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");

  assert.match(rendererSource, /currentProject/);
  assert.match(rendererSource, /selectedFile/);
  assert.match(rendererSource, /openExisting/);
  assert.match(rendererSource, /renderTree/);
  assert.match(rendererSource, /wikiwise\.readFile/);
  assert.match(htmlSource, /id="open-existing"/);
  assert.match(htmlSource, /id="create-new"/);
  assert.match(htmlSource, /id="file-tree"/);
  assert.match(htmlSource, /id="source-editor-frame"/);
  assert.match(htmlSource, /id="new-wiki-dialog"/);
});

test("main process mirrors native standalone file open state", () => {
  const mainSource = read("src/main/main.js");
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");

  assert.match(
    nativeSource,
    /else\s*\{\s*rootURL = url\.deletingLastPathComponent\(\)\s*tree = \[\]\s*selectedFileURL = url\s*loadFile\(url\)/
  );
  assert.match(mainSource, /const projectKind = isDirectory \? "folder" : "file";/);
  assert.match(mainSource, /const tree = isDirectory \? scanOneLevel\(projectRoot\) : \[\];/);
  assert.match(mainSource, /projectKind,/);
  assert.match(mainSource, /projectName:\s*path\.basename\(projectRoot\),\s*tree,\s*selectedFile/);
  assert.doesNotMatch(mainSource, /const tree = scanOneLevel\(projectRoot\);/);
});

test("renderer mirrors native standalone file initial WIKI mode with editor fallback", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(nativeSource, /@State private var detailMode:\s*DetailMode = \.compiled/);
  assert.match(
    nativeSource,
    /else\s*\{\s*rootURL = url\.deletingLastPathComponent\(\)\s*tree = \[\]\s*selectedFileURL = url\s*loadFile\(url\)\s*\}/
  );
  assert.match(
    nativeSource,
    /else if let url = selectedFileURL,\s*url\.pathExtension\.lowercased\(\) != "md" \{[\s\S]*EditorWebView\(fileURL:\s*url,[\s\S]*\}\s*else\s*\{[\s\S]*switch detailMode/
  );
  assert.match(
    nativeSource,
    /case \.compiled:[\s\S]*if let url = compiledFileURL[\s\S]*else if let url = selectedFileURL[\s\S]*EditorWebView/
  );
  assert.match(rendererSource, /detailMode:\s*"wiki"/);
  assert.match(
    rendererSource,
    /function detailModeForSelectedFile\(file,\s*options = \{\}\)\s*\{[\s\S]*if \(!file\) return "wiki";[\s\S]*if \(options\.preserveDetailMode\) return state\.detailMode;[\s\S]*if \(!isMarkdownFile\(file\.path\)\) return state\.detailMode;[\s\S]*return "wiki";[\s\S]*\}/
  );
  assert.doesNotMatch(rendererSource, /if \(!isMarkdownFile\(file\.path\)\) return "file"/);
  assert.match(rendererSource, /state\.detailMode = detailModeForSelectedFile\(file,\s*options\)/);
  assert.match(rendererSource, /setSelectedFile\(projectResult\.selectedFile\);/);
  assert.match(
    rendererSource,
    /state\.detailMode === "wiki" && !wikiAvailable[\s\S]*sourceEditorFrame\.hidden = !shouldShowSourceEditor/
  );
});

test("main process updates window project root ownership at project result boundaries", () => {
  const mainSource = read("src/main/main.js");
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const nativeOpenURLSource =
    nativeSource.match(/private func openURL\(_ url: URL\) \{[\s\S]*?\n    \}/)?.[0] ?? "";
  const nativeFolderBranch =
    nativeOpenURLSource.match(/if isDir\.boolValue \{[\s\S]*?\} else \{/)?.[0] ?? "";
  const nativeStandaloneBranch =
    nativeOpenURLSource.match(/\} else \{[\s\S]*?loadFile\(url\)\n        \}/)?.[0] ?? "";
  const createProjectResultSource =
    mainSource.match(/function createProjectResult\(targetPath,\s*webContents = null\) \{[\s\S]*?\n\}/)?.[0] ?? "";

  assert.match(mainSource, /function createProjectResult\(targetPath,\s*webContents = null\)/);
  assert.match(nativeFolderBranch, /backgroundTimer\?\.invalidate\(\)/);
  assert.match(nativeFolderBranch, /fileWatcher\?\.stop\(\)/);
  assert.match(nativeFolderBranch, /compiler = c/);
  assert.match(nativeFolderBranch, /startBackgroundCompilation\(c\)/);
  assert.match(nativeFolderBranch, /startFileWatcher\(directory:\s*url,\s*compiler:\s*c\)/);
  assert.notEqual(nativeStandaloneBranch, "");
  assert.doesNotMatch(nativeStandaloneBranch, /backgroundTimer/);
  assert.doesNotMatch(nativeStandaloneBranch, /fileWatcher/);
  assert.doesNotMatch(nativeStandaloneBranch, /compiler/);
  assert.doesNotMatch(createProjectResultSource, /setWebContentsProjectRoot\(webContents,\s*isDirectory \? projectRoot : null\)/);
  assert.match(
    createProjectResultSource,
    /if \(isDirectory\) \{[\s\S]*setWebContentsProjectRoot\(webContents,\s*projectRoot\)[\s\S]*getCompiler\(projectRoot\)\.scanPages\(\)/
  );
  assert.match(
    mainSource,
    /function restoreLastProject\(webContents = null\)[\s\S]*createProjectResult\(settings\.lastFolderPath,\s*webContents\)/
  );
  assert.match(
    mainSource,
    /function restoreLastProjectForWebContents\(webContents\)[\s\S]*return restoreLastProject\(webContents\)/
  );
  assert.match(
    mainSource,
    /async function openExistingProject\(browserWindow\)[\s\S]*return \{[\s\S]*project:\s*createProjectResult\(targetPath,\s*browserWindow\?\.webContents\)/
  );
  assert.match(
    mainSource,
    /function createNewWiki\(payload,\s*webContents = null\)[\s\S]*project:\s*createProjectResult\(scaffold\.path,\s*webContents\)/
  );
  assert.match(
    mainSource,
    /ipcMain\.handle\("wikiwise:createNewWiki",\s*\(event,\s*payload\) => \{[\s\S]*return createNewWiki\(payload,\s*event\.sender\)/
  );
  assert.match(
    mainSource,
    /function startProjectWatcher\(webContents,\s*payload\)[\s\S]*setWebContentsProjectRoot\(webContents,\s*resolvedRoot\)/
  );
});

test("renderer treats standalone file opens as non-project services without stopping native terminal state", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const nativeOpenURLSource =
    nativeSource.match(/private func openURL\(_ url: URL\) \{[\s\S]*?\n    \}/)?.[0] ?? "";
  const nativeStandaloneBranch =
    nativeOpenURLSource.match(/\} else \{[\s\S]*?loadFile\(url\)\n        \}/)?.[0] ?? "";
  const rendererStartTerminalStart = rendererSource.indexOf("async function startTerminal()");
  const disposeTerminalStart = rendererSource.indexOf("function disposeTerminalView", rendererStartTerminalStart);
  const rendererStartTerminalSource = rendererSource.slice(rendererStartTerminalStart, disposeTerminalStart);
  const standaloneBoundaryIndex = rendererStartTerminalSource.indexOf("if (!state.currentProject || !isProjectFolder())");
  const listenerCleanupIndex = rendererStartTerminalSource.indexOf("if (state.terminalOutputCleanup)");
  const rendererStandaloneBranch =
    rendererStartTerminalSource.match(/if \(!state\.currentProject \|\| !isProjectFolder\(\)\) \{[\s\S]*?return;\n  \}/)?.[0] ?? "";
  const rendererStartWatcherStart = rendererSource.indexOf("async function startProjectWatcher()");
  const rendererStartTerminalStartForWatcher = rendererSource.indexOf("async function startTerminal()", rendererStartWatcherStart);
  const rendererStartWatcherSource = rendererSource.slice(rendererStartWatcherStart, rendererStartTerminalStartForWatcher);
  const rendererWatcherStandaloneBranch =
    rendererStartWatcherSource.match(/if \(!state\.currentProject \|\| !isProjectFolder\(\)\) \{[\s\S]*?return;\n  \}/)?.[0] ?? "";
  const watcherCleanupIndex = rendererStartWatcherSource.indexOf("if (state.projectWatcherCleanup)");
  const watcherBoundaryIndex = rendererStartWatcherSource.indexOf("if (!state.currentProject || !isProjectFolder())");

  assert.match(rendererSource, /function isProjectFolder\(\)/);
  assert.match(rendererSource, /projectKind:\s*projectResult\.projectKind \?\? "folder"/);
  assert.match(nativeOpenURLSource, /terminalSession\.startIfNeeded\(workingDirectory:\s*url\)/);
  assert.notEqual(nativeStandaloneBranch, "");
  assert.match(nativeStandaloneBranch, /rootURL = url\.deletingLastPathComponent\(\)/);
  assert.match(nativeStandaloneBranch, /tree = \[\]/);
  assert.match(nativeStandaloneBranch, /selectedFileURL = url/);
  assert.match(nativeStandaloneBranch, /loadFile\(url\)/);
  assert.doesNotMatch(nativeStandaloneBranch, /fileWatcher/);
  assert.doesNotMatch(nativeStandaloneBranch, /backgroundTimer/);
  assert.doesNotMatch(nativeStandaloneBranch, /terminalSession/);
  assert.notEqual(rendererStartWatcherStart, -1);
  assert.notEqual(rendererStartTerminalStartForWatcher, -1);
  assert.ok(watcherBoundaryIndex >= 0, "renderer startProjectWatcher should branch for standalone files");
  assert.ok(
    watcherCleanupIndex > watcherBoundaryIndex,
    "renderer should preserve an existing project watcher listener for standalone files"
  );
  assert.notEqual(rendererWatcherStandaloneBranch, "");
  assert.doesNotMatch(rendererWatcherStandaloneBranch, /wikiwise\.stopProjectWatcher/);
  assert.doesNotMatch(rendererWatcherStandaloneBranch, /projectWatcherCleanup/);
  assert.notEqual(rendererStartTerminalStart, -1);
  assert.notEqual(disposeTerminalStart, -1);
  assert.ok(standaloneBoundaryIndex >= 0, "renderer startTerminal should branch for standalone files");
  assert.ok(
    listenerCleanupIndex > standaloneBoundaryIndex,
    "renderer should preserve an existing terminal output listener for standalone files"
  );
  assert.notEqual(rendererStandaloneBranch, "");
  assert.match(rendererStandaloneBranch, /renderTerminalTab\(\)/);
  assert.doesNotMatch(rendererStandaloneBranch, /wikiwise\.stopTerminal/);
  assert.doesNotMatch(rendererStandaloneBranch, /terminalSessionProjectRoot = null/);
  assert.doesNotMatch(rendererStandaloneBranch, /terminalInstance\?\.clear/);
  assert.match(rendererSource, /publishButton\.disabled = !isProjectFolder\(\) \|\| publishBusy/);
  assert.match(rendererSource, /if \(!isProjectFolder\(\) \|\| !state\.generatedPage\?\.name\) return null;/);
  assert.match(rendererSource, /if \(!isProjectFolder\(\)\) return;/);
});

test("standalone active-file tracking preserves native no-directory side effect", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const coreSource = readRepository("packages/wikiwise-core/src/index.js");
  const mainSource = read("src/main/main.js");
  const rendererSource = read("src/renderer/renderer.js");
  const nativeWriteActiveSource =
    nativeSource.match(/private func writeActiveFile\(_ url: URL\) \{[\s\S]*?\n    \}/)?.[0] ?? "";
  const writeActiveFileSource =
    coreSource.match(/export function writeActiveFile\(projectRoot, filePath\) \{[\s\S]*?\n\}/)?.[0] ?? "";

  assert.notEqual(nativeWriteActiveSource, "");
  assert.match(nativeWriteActiveSource, /root\.appendingPathComponent\("\.claude\/active-file"\)/);
  assert.match(nativeWriteActiveSource, /try\? relativePath\.write\(to:\s*activeFile/);
  assert.doesNotMatch(nativeWriteActiveSource, /createDirectory/);

  assert.notEqual(writeActiveFileSource, "");
  assert.match(writeActiveFileSource, /const activeFileDirectory = path\.join\(projectRoot,\s*"\.claude"\)/);
  assert.match(writeActiveFileSource, /if \(!fs\.existsSync\(activeFileDirectory\)\) \{/);
  assert.match(writeActiveFileSource, /written:\s*false/);

  assert.match(
    nativeSource,
    /else\s*\{\s*rootURL = url\.deletingLastPathComponent\(\)\s*tree = \[\]\s*selectedFileURL = url\s*loadFile\(url\)/
  );
  assert.match(mainSource, /const projectKind = isDirectory \? "folder" : "file";/);
  assert.match(mainSource, /const projectRoot = isDirectory \? targetPath : path\.dirname\(targetPath\);/);
  assert.match(mainSource, /projectRoot,\s*projectKind,\s*projectName:\s*path\.basename\(projectRoot\)/);
  assert.match(rendererSource, /await setActiveSelectedFile\(\)/);
  assert.match(mainSource, /function setActiveFile\(payload\)[\s\S]*return writeActiveFile\(projectRoot,\s*filePath\)/);
});

test("renderer active-file selection failures stay silent like native try-optional writes", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const mainSource = read("src/main/main.js");
  const rendererSource = read("src/renderer/renderer.js");
  const nativeWriteActiveSource =
    nativeSource.match(/private func writeActiveFile\(_ url: URL\) \{[\s\S]*?\n    \}/)?.[0] ?? "";
  const rendererStart = rendererSource.indexOf("async function setActiveSelectedFile");
  const rendererEnd = rendererSource.indexOf("function setDetailMode", rendererStart);
  const setActiveSelectedFileSource = rendererSource.slice(rendererStart, rendererEnd);
  const setActiveFileSource =
    mainSource.match(/function setActiveFile\(payload\) \{[\s\S]*?\n\}/)?.[0] ?? "";

  assert.notEqual(nativeWriteActiveSource, "");
  assert.match(nativeWriteActiveSource, /try\? relativePath\.write\(to:\s*activeFile/);
  assert.notEqual(rendererStart, -1);
  assert.notEqual(rendererEnd, -1);
  assert.match(setActiveSelectedFileSource, /window\.wikiwise\.setActiveFile/);
  assert.match(setActiveSelectedFileSource, /\.catch\(/);
  assert.doesNotMatch(setActiveSelectedFileSource, /setError\(/);
  assert.doesNotMatch(setActiveSelectedFileSource, /throw\s+error/);

  assert.notEqual(setActiveFileSource, "");
  assert.match(setActiveFileSource, /const projectRoot = assertProjectRoot\(payload\.projectRoot\)/);
  assert.match(setActiveFileSource, /const filePath = assertProjectPath\(projectRoot,\s*payload\.filePath\)/);
  assert.match(setActiveFileSource, /return writeActiveFile\(projectRoot,\s*filePath\)/);
});
