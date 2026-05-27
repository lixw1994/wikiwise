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

test("main process exposes path-safe save IPC with markdown recompilation", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /wikiwise:saveFile/);
  assert.match(mainSource, /assertProjectPath/);
  assert.match(mainSource, /writeTextFile/);
  assert.match(mainSource, /writeActiveFile/);
  assert.match(mainSource, /compileMarkdownFile/);
  assert.match(mainSource, /invalidatePage/);
});

test("save active-file tracking preserves native no-directory side effect", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const coreSource = readRepository("packages/wikiwise-core/src/index.js");
  const mainSource = read("src/main/main.js");
  const nativeWriteActiveSource =
    nativeSource.match(/private func writeActiveFile\(_ url: URL\) \{[\s\S]*?\n    \}/)?.[0] ?? "";
  const saveFileSource = mainSource.match(/function saveFile\(payload\) \{[\s\S]*?\n\}/)?.[0] ?? "";
  const writeActiveFileSource =
    coreSource.match(/export function writeActiveFile\(projectRoot, filePath\) \{[\s\S]*?\n\}/)?.[0] ?? "";

  assert.notEqual(nativeWriteActiveSource, "");
  assert.match(nativeWriteActiveSource, /try\? relativePath\.write\(to:\s*activeFile/);
  assert.doesNotMatch(nativeWriteActiveSource, /createDirectory/);

  assert.notEqual(saveFileSource, "");
  assert.match(saveFileSource, /const activeFile = writeActiveFile\(projectRoot,\s*filePath\)/);
  assert.match(saveFileSource, /activeFile,/);

  assert.notEqual(writeActiveFileSource, "");
  assert.match(writeActiveFileSource, /if \(!fs\.existsSync\(activeFileDirectory\)\) \{/);
  assert.match(writeActiveFileSource, /written:\s*false/);
  assert.match(writeActiveFileSource, /writeTextFile\(activeFilePath,\s*relativePath\)/);
});

test("preload exposes the save API without renderer filesystem access", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(preloadSource, /saveFile:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:saveFile"/);
});

test("main and preload expose shared CodeMirror editor resource without renderer filesystem access", () => {
  const mainSource = read("src/main/main.js");
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(mainSource, /wikiwise:getEditorResource/);
  assert.match(mainSource, /editor\.html/);
  assert.match(mainSource, /codemirror-bundle\.js/);
  assert.match(mainSource, /pathToFileURL/);
  assert.match(preloadSource, /getEditorResource:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:getEditorResource"/);
});

test("renderer uses shared CodeMirror iframe for source editing, save, and scroll state", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");
  const setDetailModeSource = rendererSource.match(/function setDetailMode\(mode\) \{[\s\S]*?\n\}/)?.[0] ?? "";

  assert.match(htmlSource, /id="source-editor-frame"/);
  assert.match(htmlSource, /title="Source editor"/);
  assert.doesNotMatch(htmlSource, /<textarea[\s\S]*id="source-editor"/);
  assert.match(htmlSource, /id="save-file"/);
  assert.match(htmlSource, /id="save-status"/);
  assert.match(rendererSource, /sourceEditorFrame/);
  assert.match(rendererSource, /getEditorResource/);
  assert.match(rendererSource, /wikiwise:editorReady/);
  assert.match(rendererSource, /wikiwise:editorContentChanged/);
  assert.match(rendererSource, /setContent/);
  assert.match(rendererSource, /getContent/);
  assert.match(rendererSource, /__getScrollFraction/);
  assert.match(rendererSource, /__scrollToFraction/);
  assert.match(
    setDetailModeSource,
    /if \(state\.detailMode === "file" && mode !== "file"\) \{\s*captureEditorScrollFraction\(\);/
  );
  assert.ok(
    setDetailModeSource.indexOf("captureEditorScrollFraction();") <
      setDetailModeSource.indexOf("state.detailMode = mode;")
  );
  assert.match(rendererSource, /isDirty/);
  assert.match(rendererSource, /lastSavedContent/);
  assert.match(rendererSource, /saveSelectedFile/);
  assert.match(rendererSource, /keydown/);
  assert.match(rendererSource, /metaKey/);
  assert.match(rendererSource, /wikiwise\.saveFile/);
});

test("renderer mirrors native editor save timing after shared bridge debounce", () => {
  const nativeSource = readRepository("Sources/Wikiwise/EditorWebView.swift");
  const editorBundleSource = readRepository("Sources/Wikiwise/Resources/codemirror-bundle.js");
  const rendererSource = read("src/renderer/renderer.js");
  const handleEditorContentChangedSource =
    rendererSource.match(/function handleEditorContentChanged\(content\) \{[\s\S]*?\n\}/)?.[0] ?? "";
  const saveSelectedFileSource =
    rendererSource.match(/async function saveSelectedFile\(\) \{[\s\S]*?\n\}\n\nfunction hasCompiledPreview/)?.[0] ?? "";
  const nativeContentChangedSource =
    nativeSource.match(/case "contentChanged":[\s\S]*?default:/)?.[0] ?? "";

  assert.match(
    nativeSource,
    /guard let content = message\.body as\? String,\s*!content\.isEmpty,\s*let fileURL = currentFileURL else \{ return \}/
  );
  assert.match(nativeSource, /never save empty content/);
  assert.notEqual(nativeContentChangedSource, "");
  assert.match(nativeContentChangedSource, /try\? content\.write\(to:\s*fileURL/);
  assert.ok(
    nativeContentChangedSource.indexOf("try? content.write") <
      nativeContentChangedSource.indexOf("DispatchQueue.main.async"),
    "native writes the editor payload before dispatching UI state updates"
  );
  assert.match(editorBundleSource, /setTimeout\(function\(\)\{window\.webkit[\s\S]*contentChanged[\s\S]*\},500\)/);

  assert.notEqual(handleEditorContentChangedSource, "");
  assert.match(handleEditorContentChangedSource, /const nextContent = String\(content \?\? ""\)/);
  assert.match(handleEditorContentChangedSource, /if \(!nextContent\) return/);
  assert.match(handleEditorContentChangedSource, /file\.draftContent = nextContent/);
  assert.match(handleEditorContentChangedSource, /state\.editorLoadedContent = file\.draftContent/);
  assert.match(handleEditorContentChangedSource, /file\.isDirty = file\.draftContent !== file\.lastSavedContent/);
  assert.match(handleEditorContentChangedSource, /saveSelectedFile\(\{ reason: "editorContentChanged" \}\)/);
  assert.doesNotMatch(handleEditorContentChangedSource, /scheduleAutosave\(\)/);
  assert.notEqual(saveSelectedFileSource, "");
  assert.match(saveSelectedFileSource, /if \(state\.selectedFile\.isDirty\) \{\s*saveSelectedFile\(\{ reason: "followUp" \}\);/);
  assert.doesNotMatch(rendererSource, /setTimeout\(\(\) => \{[\s\S]*saveSelectedFile\(\{ reason: "debounce" \}\)/);
  assert.doesNotMatch(handleEditorContentChangedSource, /file\.draftContent = String\(content \?\? ""\)/);
});

test("renderer refreshes compiled preview state after saving markdown", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /result\.compiled/);
  assert.match(rendererSource, /renderPreview/);
  assert.match(rendererSource, /isMarkdownFile/);
});

test("shared native editor resource keeps WebKit bridge and adds Electron parent bridge", () => {
  const editorHtml = fs.readFileSync(
    path.join(packageRoot, "..", "..", "Sources", "Wikiwise", "Resources", "editor.html"),
    "utf8"
  );

  assert.match(editorHtml, /window\.webkit/);
  assert.match(editorHtml, /messageHandlers\.contentChanged/);
  assert.match(editorHtml, /messageHandlers\.editorReady/);
  assert.match(editorHtml, /window\.parent\.postMessage/);
  assert.match(editorHtml, /wikiwise:editorReady/);
  assert.match(editorHtml, /wikiwise:editorContentChanged/);
});
