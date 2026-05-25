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

function cssBlock(source, selector) {
  const pattern = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]+)\\}`);
  return source.match(pattern)?.[1] ?? "";
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
  assert.match(rendererSource, /handleNewWikiDialogKeydown/);
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

test("renderer mirrors native new-wiki sheet layout and typography", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const panelBlock = cssBlock(styleSource, ".new-wiki-panel");
  const titleBlock = cssBlock(styleSource, ".new-wiki-panel h2");
  const fieldBlock = cssBlock(styleSource, ".new-wiki-form-field");
  const fieldLabelBlock = cssBlock(styleSource, ".new-wiki-panel .field-label");

  assert.match(nativeSource, /private var newWikiSheet: some View/);
  assert.match(nativeSource, /VStack\(spacing:\s*20\)/);
  assert.match(nativeSource, /Text\("Create a New Wiki"\)\s*\.font\(\.system\(size:\s*16,\s*weight:\s*\.semibold\)\)/);
  assert.match(nativeSource, /Text\("Name"\)\s*\.font\(\.system\(size:\s*12,\s*weight:\s*\.medium\)\)/);
  assert.match(nativeSource, /\.padding\(24\)\s*\.frame\(width:\s*400\)/);

  assert.match(htmlSource, /<div class="modal-panel new-wiki-panel"[^>]*>/);
  assert.match(panelBlock, /width:\s*min\(400px,\s*100%\)/);
  assert.match(panelBlock, /padding:\s*24px/);
  assert.match(panelBlock, /gap:\s*20px/);
  assert.match(titleBlock, /font-size:\s*16px/);
  assert.match(titleBlock, /font-weight:\s*600/);
  assert.match(fieldBlock, /gap:\s*6px/);
  assert.match(fieldLabelBlock, /font-size:\s*12px/);
  assert.match(fieldLabelBlock, /font-weight:\s*500/);

  assert.match(htmlSource, /id="new-wiki-name"/);
  assert.match(htmlSource, /id="new-wiki-location"/);
  assert.match(htmlSource, /id="choose-new-wiki-location"[\s\S]*?>\s*Choose…\s*<\/button>/);
  assert.match(htmlSource, /id="cancel-create-new"[\s\S]*?>Cancel<\/button>/);
  assert.match(htmlSource, /id="confirm-create-new"[\s\S]*?>\s*Create\s*<\/button>/);
});

test("renderer mirrors native new-wiki field label color", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const styleSource = read("src/renderer/styles.css");
  const newWikiSheetSource =
    nativeSource.match(/private var newWikiSheet: some View[\s\S]*?\.frame\(width:\s*400\)/)?.[0] ?? "";
  const globalFieldLabelBlock = styleSource.match(/\n\.field-label\s*\{([^}]+)\}/)?.[1] ?? "";
  const newWikiFieldLabelBlock = cssBlock(styleSource, ".new-wiki-panel .field-label");

  assert.notEqual(newWikiSheetSource, "");
  assert.match(
    newWikiSheetSource,
    /Text\("Name"\)[\s\S]*\.font\(\.system\(size:\s*12,\s*weight:\s*\.medium\)\)[\s\S]*\.foregroundStyle\(Color\.sidebarText\)[\s\S]*Text\("Location"\)[\s\S]*\.font\(\.system\(size:\s*12,\s*weight:\s*\.medium\)\)[\s\S]*\.foregroundStyle\(Color\.sidebarText\)/
  );
  assert.match(globalFieldLabelBlock, /color:\s*var\(--color-toolbar-text\)/);
  assert.match(newWikiFieldLabelBlock, /color:\s*var\(--color-sidebar-text\)/);
  assert.match(newWikiFieldLabelBlock, /font-size:\s*12px/);
  assert.match(newWikiFieldLabelBlock, /font-weight:\s*500/);
});

test("renderer mirrors native new-wiki location middle truncation", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const styleSource = read("src/renderer/styles.css");
  const locationPathBlock = cssBlock(styleSource, ".location-path");

  assert.match(
    nativeSource,
    /Text\(newWikiLocation\?\.path \?\? "~\/wikis"\)[\s\S]*\.lineLimit\(1\)[\s\S]*\.truncationMode\(\.middle\)/
  );

  assert.match(rendererSource, /const newWikiLocationDisplayLimit = \d+/);
  assert.match(rendererSource, /function middleTruncatePath\(pathValue/);
  assert.match(rendererSource, /return `\$\{pathValue\.slice\(0,\s*headLength\)\}…\$\{pathValue\.slice\(-tailLength\)\}`/);
  assert.match(rendererSource, /newWikiLocationLabel\.textContent = middleTruncatePath\(fullLocationPath\)/);
  assert.match(rendererSource, /newWikiLocationLabel\.title = fullLocationPath/);
  assert.match(rendererSource, /newWikiLocationLabel\.setAttribute\("aria-label", fullLocationPath\)/);
  assert.match(rendererSource, /parentDir:\s*state\.newWikiLocation/);
  assert.match(locationPathBlock, /white-space:\s*nowrap/);
  assert.doesNotMatch(locationPathBlock, /text-overflow:\s*ellipsis/);
});

test("renderer mirrors native new-wiki location path font", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const styleSource = read("src/renderer/styles.css");
  const newWikiSheetSource =
    nativeSource.match(/private var newWikiSheet: some View[\s\S]*?\.frame\(width:\s*400\)/)?.[0] ?? "";
  const locationPathBlock = cssBlock(styleSource, ".location-path");

  assert.notEqual(newWikiSheetSource, "");
  assert.match(
    newWikiSheetSource,
    /Text\(newWikiLocation\?\.path \?\? "~\/wikis"\)[\s\S]*\.font\(\.system\(size:\s*12\)\)/
  );
  assert.match(locationPathBlock, /font-size:\s*12px/);
  assert.doesNotMatch(locationPathBlock, /ui-monospace|SFMono-Regular|Menlo|monospace/);
  assert.match(rendererSource, /newWikiLocationLabel\.title = fullLocationPath/);
  assert.match(rendererSource, /newWikiLocationLabel\.setAttribute\("aria-label", fullLocationPath\)/);
  assert.match(rendererSource, /parentDir:\s*state\.newWikiLocation/);
});

test("renderer mirrors native new-wiki location label spacing", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const styleSource = read("src/renderer/styles.css");
  const newWikiSheetSource =
    nativeSource.match(/private var newWikiSheet: some View[\s\S]*?\.frame\(width:\s*400\)/)?.[0] ?? "";
  const locationPathBlock = cssBlock(styleSource, ".location-path");

  assert.notEqual(newWikiSheetSource, "");
  assert.match(
    newWikiSheetSource,
    /VStack\(alignment:\s*\.leading,\s*spacing:\s*6\)\s*\{[\s\S]*Text\("Location"\)[\s\S]*HStack\s*\{/
  );
  assert.match(locationPathBlock, /margin:\s*6px 0 0/);
  assert.match(locationPathBlock, /color:\s*var\(--color-sidebar-text-muted\)/);
  assert.match(locationPathBlock, /white-space:\s*nowrap/);
  assert.match(rendererSource, /newWikiLocationLabel\.title = fullLocationPath/);
  assert.match(rendererSource, /parentDir:\s*state\.newWikiLocation/);
});

test("renderer mirrors native new-wiki location path color", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const styleSource = read("src/renderer/styles.css");
  const newWikiSheetSource =
    nativeSource.match(/private var newWikiSheet: some View[\s\S]*?\.frame\(width:\s*400\)/)?.[0] ?? "";
  const locationPathBlock = cssBlock(styleSource, ".location-path");
  const publishUrlAffixBlock = cssBlock(styleSource, ".publish-url-affix");

  assert.notEqual(newWikiSheetSource, "");
  assert.match(
    newWikiSheetSource,
    /Text\(newWikiLocation\?\.path \?\? "~\/wikis"\)[\s\S]*\.foregroundStyle\(Color\.sidebarTextMuted\)/
  );
  assert.match(locationPathBlock, /color:\s*var\(--color-sidebar-text-muted\)/);
  assert.match(locationPathBlock, /font-size:\s*12px/);
  assert.match(locationPathBlock, /margin:\s*6px 0 0/);
  assert.match(locationPathBlock, /white-space:\s*nowrap/);
  assert.match(publishUrlAffixBlock, /color:\s*var\(--color-muted-text\)/);
});

test("renderer mirrors native new-wiki action row spacing", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const newWikiSheetSource =
    nativeSource.match(/private var newWikiSheet: some View[\s\S]*?\.frame\(width:\s*400\)/)?.[0] ?? "";
  const modalActionsBlock = cssBlock(styleSource, ".modal-actions");
  const newWikiActionsBlock = cssBlock(styleSource, ".new-wiki-actions");

  assert.notEqual(newWikiSheetSource, "");
  assert.match(
    newWikiSheetSource,
    /VStack\(spacing:\s*20\)[\s\S]*HStack\s*\{[\s\S]*Button\("Cancel"\)[\s\S]*Spacer\(\)[\s\S]*Button\("Create"\)/
  );
  assert.doesNotMatch(
    newWikiSheetSource,
    /HStack\s*\{[\s\S]*Button\("Cancel"\)[\s\S]*Button\("Create"\)[\s\S]*\.padding\(\.top/
  );

  assert.match(
    htmlSource,
    /<div class="modal-actions new-wiki-actions">[\s\S]*id="cancel-create-new"[\s\S]*Cancel[\s\S]*id="confirm-create-new"[\s\S]*Create[\s\S]*<\/div>/
  );
  assert.match(modalActionsBlock, /margin-top:\s*8px/);
  assert.match(newWikiActionsBlock, /margin-top:\s*0/);
});

test("renderer mirrors native new-wiki action button chrome", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const newWikiSheetSource =
    nativeSource.match(/private var newWikiSheet: some View[\s\S]*?\.frame\(width:\s*400\)/)?.[0] ?? "";
  const nativeActionRowSource =
    newWikiSheetSource.match(
      /HStack\s*\{\s*Button\("Cancel"\)[\s\S]*?Spacer\(\)[\s\S]*?Button\("Create"\)[\s\S]*?\.disabled\(newWikiName\.trimmingCharacters\(in:\s*\.whitespaces\)\.isEmpty\)[\s\S]*?\n\s*\}/
    )?.[0] ?? "";
  const newWikiButtonBlock = cssBlock(styleSource, ".new-wiki-button");
  const newWikiDefaultButtonBlock = cssBlock(styleSource, ".new-wiki-default-button");

  assert.notEqual(newWikiSheetSource, "");
  assert.notEqual(nativeActionRowSource, "");
  assert.match(nativeActionRowSource, /Button\("Cancel"\)[\s\S]*\.keyboardShortcut\(\.cancelAction\)/);
  assert.match(
    nativeActionRowSource,
    /Button\("Create"\)[\s\S]*\.keyboardShortcut\(\.defaultAction\)[\s\S]*\.disabled\(newWikiName\.trimmingCharacters\(in:\s*\.whitespaces\)\.isEmpty\)/
  );
  assert.doesNotMatch(nativeActionRowSource, /\.buttonStyle|\.foregroundStyle|\.background|\.clipShape/);

  assert.match(htmlSource, /id="cancel-create-new" class="new-wiki-button"[^>]*>Cancel<\/button>/);
  assert.match(
    htmlSource,
    /id="confirm-create-new" class="new-wiki-button new-wiki-default-button"[^>]*disabled>[\s\S]*Create[\s\S]*<\/button>/
  );
  assert.doesNotMatch(htmlSource, /id="cancel-create-new" class="secondary-action"/);
  assert.doesNotMatch(htmlSource, /id="confirm-create-new" class="primary-action"/);
  assert.match(newWikiButtonBlock, /border:\s*1px solid var\(--color-sidebar-rule\)/);
  assert.match(newWikiDefaultButtonBlock, /background:\s*var\(--color-accent-primary\)/);
  assert.match(htmlSource, /id="cancel-publish" class="secondary-action"/);
  assert.match(htmlSource, /id="confirm-publish" class="primary-action"/);
});

test("renderer mirrors native new-wiki location chooser button chrome", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const newWikiSheetSource =
    nativeSource.match(/private var newWikiSheet: some View[\s\S]*?\.frame\(width:\s*400\)/)?.[0] ?? "";
  const nativeChooseButtonSource = newWikiSheetSource.match(/Button\("Choose…"\)[\s\S]*?^\s*\}/m)?.[0] ?? "";
  const newWikiButtonBlock = cssBlock(styleSource, ".new-wiki-button");
  const newWikiChooseButtonBlock = cssBlock(styleSource, ".new-wiki-choose-button");

  assert.notEqual(newWikiSheetSource, "");
  assert.notEqual(nativeChooseButtonSource, "");
  assert.match(nativeChooseButtonSource, /Button\("Choose…"\)/);
  assert.doesNotMatch(nativeChooseButtonSource, /\.buttonStyle|\.foregroundStyle|\.background|\.clipShape/);

  assert.match(
    htmlSource,
    /id="choose-new-wiki-location" class="new-wiki-button new-wiki-choose-button"[^>]*>[\s\S]*Choose…[\s\S]*<\/button>/
  );
  assert.doesNotMatch(htmlSource, /id="choose-new-wiki-location" class="secondary-action compact"/);
  assert.match(rendererSource, /chooseNewWikiLocationButton\.addEventListener\("click", chooseNewWikiLocation\)/);
  assert.match(newWikiButtonBlock, /border:\s*1px solid var\(--color-sidebar-rule\)/);
  assert.match(newWikiChooseButtonBlock, /align-self:\s*end/);
  assert.match(htmlSource, /id="open-existing" class="secondary-action welcome-action"/);
  assert.match(htmlSource, /id="cancel-publish" class="secondary-action"/);
});

test("renderer mirrors native new-wiki name field rounded border", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const newWikiSheetSource =
    nativeSource.match(/private var newWikiSheet: some View[\s\S]*?\.frame\(width:\s*400\)/)?.[0] ?? "";
  const textInputBlock = cssBlock(styleSource, ".text-input");
  const newWikiNameInputBlock = cssBlock(styleSource, ".new-wiki-name-input");

  assert.notEqual(newWikiSheetSource, "");
  assert.match(
    newWikiSheetSource,
    /TextField\("My Wiki",\s*text:\s*\$newWikiName\)\s*\.textFieldStyle\(\.roundedBorder\)/
  );

  assert.match(
    htmlSource,
    /<input id="new-wiki-name" class="text-input new-wiki-name-input" type="text" placeholder="My Wiki" \/>/
  );
  assert.match(rendererSource, /newWikiNameInput\.addEventListener\("input",/);
  assert.match(textInputBlock, /width:\s*100%/);
  assert.match(newWikiNameInputBlock, /min-height:\s*24px/);
  assert.match(newWikiNameInputBlock, /padding:\s*3px 6px/);
  assert.match(newWikiNameInputBlock, /font-size:\s*13px/);
  assert.match(htmlSource, /id="publish-subdomain"[\s\S]*class="text-input publish-subdomain"/);
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

  assert.match(
    nativeSource,
    /Button\("Cancel"\)\s*\{[\s\S]*showNewWikiSheet = false[\s\S]*\.keyboardShortcut\(\.cancelAction\)/
  );
  assert.match(
    nativeSource,
    /Button\("Create"\)\s*\{[\s\S]*createNewWiki\(\)[\s\S]*\.keyboardShortcut\(\.defaultAction\)/
  );
  assert.match(rendererSource, /function handleNewWikiDialogKeydown\(event\)/);
  assert.match(rendererSource, /event\.key === "Escape"[\s\S]*closeNewWikiDialog\(\)/);
  assert.match(rendererSource, /event\.key === "Enter"[\s\S]*confirmCreateNewButton\.disabled[\s\S]*createNewWiki\(\)/);
  assert.match(rendererSource, /newWikiDialog\.addEventListener\("keydown", handleNewWikiDialogKeydown\)/);

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
