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

  assert.match(mainSource, /function createProjectResult\(targetPath,\s*webContents = null\)/);
  assert.match(mainSource, /setWebContentsProjectRoot\(webContents,\s*isDirectory \? projectRoot : null\)/);
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

test("renderer treats standalone file opens as non-project service state", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /function isProjectFolder\(\)/);
  assert.match(rendererSource, /projectKind:\s*projectResult\.projectKind \?\? "folder"/);
  assert.match(rendererSource, /if \(!state\.currentProject \|\| !isProjectFolder\(\)\)\s*\{[\s\S]*wikiwise\.stopProjectWatcher/);
  assert.match(rendererSource, /if \(!state\.currentProject \|\| !isProjectFolder\(\)\)\s*\{[\s\S]*wikiwise\.stopTerminal/);
  assert.match(rendererSource, /publishButton\.disabled = !isProjectFolder\(\) \|\| publishBusy/);
  assert.match(rendererSource, /if \(!isProjectFolder\(\) \|\| !state\.generatedPage\?\.name\) return null;/);
  assert.match(rendererSource, /if \(!isProjectFolder\(\)\) return;/);
});
