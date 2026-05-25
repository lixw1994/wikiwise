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

function normalized(source) {
  return source.replace(/\s+/g, " ").trim();
}

test("main process exposes new-wiki scaffold IPC through main-owned filesystem work", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /createWikiScaffold/);
  assert.match(mainSource, /app\.getPath\("home"\)/);
  assert.match(mainSource, /getDefaultWikiLocation/);
  assert.match(mainSource, /wikiwise:getDefaultWikiLocation/);
  assert.match(mainSource, /wikiwise:chooseNewWikiLocation/);
  assert.match(mainSource, /wikiwise:createNewWiki/);
  assert.match(mainSource, /"createDirectory"/);
  assert.match(mainSource, /createProjectResult/);
});

test("preload exposes new-wiki APIs without renderer filesystem access", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(
    preloadSource,
    /getDefaultWikiLocation:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:getDefaultWikiLocation"\)/
  );
  assert.match(
    preloadSource,
    /chooseNewWikiLocation:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:chooseNewWikiLocation"\)/
  );
  assert.match(preloadSource, /createNewWiki:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:createNewWiki"/);
  assert.doesNotMatch(preloadSource, /require\("node:fs"\)/);
});

test("renderer contains new-wiki dialog state, create flow, and post-create guide", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");

  assert.match(rendererSource, /isNewWikiDialogOpen/);
  assert.match(rendererSource, /newWikiName/);
  assert.match(rendererSource, /newWikiLocation/);
  assert.match(rendererSource, /isCreatingWiki/);
  assert.match(rendererSource, /showPostCreateGuide/);
  assert.match(rendererSource, /openNewWikiDialog/);
  assert.match(rendererSource, /chooseNewWikiLocation/);
  assert.match(rendererSource, /createNewWiki/);
  assert.match(rendererSource, /applyProjectResult/);
  assert.match(rendererSource, /startProjectWatcher/);
  assert.match(rendererSource, /dismissPostCreateGuide/);
  assert.match(rendererSource, /wikiwise\.createNewWiki/);
  assert.match(rendererSource, /wikiwise\.getDefaultWikiLocation/);
  assert.match(rendererSource, /wikiwise\.chooseNewWikiLocation/);

  assert.match(htmlSource, /id="new-wiki-dialog"/);
  assert.match(htmlSource, /id="new-wiki-name"/);
  assert.match(htmlSource, /id="new-wiki-location"/);
  assert.match(htmlSource, /id="confirm-create-new"/);
  assert.match(htmlSource, /id="post-create-guide"/);
  assert.doesNotMatch(htmlSource, /later OpenSpec phase/);
});

test("renderer mirrors native new-wiki and post-create guide copy", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);

  assert.match(nativeSource, /Button\("Create"\)\s*\{[\s\S]*createNewWiki\(\)/);
  assert.match(htmlSource, /id="confirm-create-new"[\s\S]*?>\s*Create\s*<\/button>/);
  assert.match(rendererSource, /confirmCreateNewButton\.textContent = "Create"/);
  assert.doesNotMatch(rendererSource, /confirmCreateNewButton\.textContent = state\.isCreatingWiki \? "Creating" : "Create"/);
  assert.doesNotMatch(rendererSource, /"Creating"/);

  assert.match(nativeSource, /Button\("Choose…"\)/);
  assert.match(htmlSource, /id="choose-new-wiki-location"[\s\S]*?>\s*Choose…\s*<\/button>/);
  assert.doesNotMatch(htmlSource, />\s*Choose\s*<\/button>/);

  assert.match(
    nativeSource,
    /Text\("WikiWise created the folder structure, build tools, and agent skills\. Now seed it with sources\."\)/
  );
  assert.match(
    normalizedHtml,
    /WikiWise created the folder structure, build tools, and agent skills\. Now seed it with sources\./
  );
  assert.doesNotMatch(normalizedHtml, /Wikiwise created the folder structure/);

  assert.match(
    nativeSource,
    /Text\("Use the built-in terminal in the right sidebar, or open your own terminal:"\)/
  );
  assert.match(
    normalizedHtml,
    /Use the built-in terminal in the right sidebar, or open your own terminal:/
  );
  assert.doesNotMatch(
    normalizedHtml,
    /Use the built-in terminal, or open your own terminal:/
  );

  assert.match(nativeSource, /Text\("OPEN YOUR AGENT"\)/);
  assert.match(nativeSource, /Text\("SEED YOUR WIKI"\)/);
  assert.match(normalizedHtml, /OPEN YOUR AGENT/);
  assert.match(normalizedHtml, /SEED YOUR WIKI/);
  assert.doesNotMatch(normalizedHtml, /Open your agent/);
  assert.doesNotMatch(normalizedHtml, /Seed your wiki/);

  assert.match(nativeSource, /Text\("Once your agent is running, try:"\)/);
  assert.match(normalizedHtml, /Once your agent is running, try:/);
  assert.match(
    normalizedHtml,
    /<p class="eyebrow">SEED YOUR WIKI<\/p> <p>Once your agent is running, try:<\/p> <ul>/
  );

  assert.match(
    nativeSource,
    /Text\("This is your project\. You can change anything about it with your agent — the styles, the structure of your wiki pages, the build pipeline\. Make it your own\."\)/
  );
  assert.match(
    normalizedHtml,
    /This is your project\. You can change anything about it with your agent — the styles, the structure of your wiki pages, the build pipeline\. Make it your own\./
  );
  assert.doesNotMatch(normalizedHtml, /You can change the styles, page structure, and build pipeline with your agent\./);

  assert.match(nativeSource, /Button\("Got it — start reading"\)/);
  assert.match(normalizedHtml, /Got it — start reading/);
  assert.doesNotMatch(normalizedHtml, /Got it - start reading/);
});
