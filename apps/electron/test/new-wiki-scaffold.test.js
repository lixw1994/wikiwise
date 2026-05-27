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

function rendererFunction(name, nextName) {
  const source = read("src/renderer/renderer.js");
  const start = source.indexOf(`function ${name}`);
  const end = source.indexOf(`\n}\n\nfunction ${nextName}`, start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  return new Function(`${source.slice(start, end)}\n}\nreturn ${name};`)();
}

function containsUnpairedSurrogate(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return true;
    }
    if (code >= 0xdc00 && code <= 0xdfff) {
      const previous = value.charCodeAt(index - 1);
      if (!(previous >= 0xd800 && previous <= 0xdbff)) return true;
    }
  }
  return false;
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

test("main process mirrors native new-wiki location picker message-only chrome", () => {
  const mainSource = read("src/main/main.js");
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const chooseLocationStart = mainSource.indexOf("async function chooseNewWikiLocation");
  const chooseLocationEnd = mainSource.indexOf("function createProjectResult", chooseLocationStart);
  const chooseLocationSource = mainSource.slice(chooseLocationStart, chooseLocationEnd);
  const nativeChooseLocationSource =
    nativeSource.match(/Button\("Choose…"\) \{[\s\S]*?if panel\.runModal\(\) == \.OK,[\s\S]*?\n\s*\}/)?.[0] ?? "";

  assert.notEqual(chooseLocationStart, -1);
  assert.notEqual(chooseLocationEnd, -1);
  assert.notEqual(nativeChooseLocationSource, "");
  assert.match(nativeChooseLocationSource, /panel\.canChooseDirectories = true/);
  assert.match(nativeChooseLocationSource, /panel\.canChooseFiles = false/);
  assert.match(nativeChooseLocationSource, /panel\.canCreateDirectories = true/);
  assert.match(nativeChooseLocationSource, /panel\.message = "Choose where to create your wiki"/);
  assert.doesNotMatch(nativeChooseLocationSource, /panel\.title/);
  assert.match(chooseLocationSource, /message:\s*"Choose where to create your wiki"/);
  assert.doesNotMatch(chooseLocationSource, /\btitle:\s*"Choose where to create your wiki"/);
  assert.match(chooseLocationSource, /defaultPath:\s*getDefaultWikiLocation\(\)/);
  assert.match(chooseLocationSource, /properties:\s*\["openDirectory", "createDirectory"\]/);
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

test("renderer mirrors native scaffold failure dismissal behavior", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const nativeStart = nativeSource.indexOf("private func createNewWiki()");
  const nativeEnd = nativeSource.indexOf("/// Tracks how many ContentViews", nativeStart);
  const rendererStart = rendererSource.indexOf("async function createNewWiki()");
  const rendererEnd = rendererSource.indexOf("function renderPostCreateGuide", rendererStart);
  const nativeCreateSource = nativeSource.slice(nativeStart, nativeEnd);
  const nativeCatchSource = nativeCreateSource.slice(nativeCreateSource.indexOf("} catch {"));
  const createNewWikiSource = rendererSource.slice(rendererStart, rendererEnd);

  assert.notEqual(nativeCreateSource, "");
  assert.notEqual(createNewWikiSource, "");
  assert.match(
    nativeCatchSource,
    /print\("\[scaffold\] Error creating wiki: \\\(error\)"\)[\s\S]*showNewWikiSheet = false/
  );
  assert.doesNotMatch(nativeCatchSource, /showPostCreateGuide = true/);
  assert.doesNotMatch(nativeCatchSource, /openURL\(wikiURL\)/);

  assert.match(
    createNewWikiSource,
    /catch \(error\) \{[\s\S]*console\.error\(error\)[\s\S]*state\.isNewWikiDialogOpen = false[\s\S]*state\.showPostCreateGuide = false/
  );
  assert.doesNotMatch(createNewWikiSource, /catch \(error\) \{[\s\S]*setError\(error\)/);
  assert.doesNotMatch(createNewWikiSource, /catch \(error\) \{[\s\S]*applyProjectResult/);
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
  assert.match(rendererSource, /Array\.from\(pathValue\)/);
  assert.match(rendererSource, /pathCharacters\.slice\(0,\s*headLength\)\.join\(""\)/);
  assert.match(rendererSource, /pathCharacters\.slice\(-tailLength\)\.join\(""\)/);
  assert.match(rendererSource, /newWikiLocationLabel\.textContent = middleTruncatePath\(fullLocationPath\)/);
  assert.match(rendererSource, /newWikiLocationLabel\.title = fullLocationPath/);
  assert.match(rendererSource, /newWikiLocationLabel\.setAttribute\("aria-label", fullLocationPath\)/);
  assert.match(rendererSource, /parentDir:\s*state\.newWikiLocation/);
  assert.match(locationPathBlock, /white-space:\s*nowrap/);
  assert.doesNotMatch(locationPathBlock, /text-overflow:\s*ellipsis/);
});

test("renderer middle-truncates Unicode new-wiki locations without splitting characters", () => {
  const middleTruncatePath = rendererFunction("middleTruncatePath", "clearAutosave");
  const longPath = "\u{10400}".repeat(8);
  const shortPath = "\u{10400}".repeat(3);
  const truncated = middleTruncatePath(longPath, 7);

  assert.equal(middleTruncatePath(shortPath, 7), shortPath);
  assert.equal(truncated, `${"\u{10400}".repeat(3)}…${"\u{10400}".repeat(3)}`);
  assert.equal(Array.from(truncated).length, 7);
  assert.equal(containsUnpairedSurrogate(truncated), false);
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
    /<p class="eyebrow">SEED YOUR WIKI<\/p> <p>Once your agent is running, try:<\/p> <ul class="guide-seed-options">/
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

test("renderer mirrors native post-create guide container layout", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const postCreateGuideSource =
    nativeSource.match(/private func postCreateGuide\(wikiURL: URL\) -> some View[\s\S]*?private func agentCommand/)?.[0] ??
    "";
  const guideBlock = cssBlock(styleSource, ".post-create-guide");

  assert.notEqual(postCreateGuideSource, "");
  assert.match(
    postCreateGuideSource,
    /\.padding\(40\)[\s\S]*\.frame\(maxWidth:\s*560,\s*alignment:\s*\.leading\)[\s\S]*\.background\(Color\.contentBg\)/
  );
  assert.match(htmlSource, /id="post-create-guide" class="post-create-guide"/);
  assert.match(guideBlock, /padding:\s*40px/);
  assert.match(guideBlock, /background:\s*var\(--color-content-bg\)/);
  assert.match(
    styleSource,
    /\.post-create-guide > \.guide-block,\s*\.post-create-guide > p,\s*\.post-create-guide > button,\s*\.post-create-guide > \.guide-divider\s*\{[^}]*max-width:\s*560px/
  );
  assert.match(styleSource, /\.post-create-guide p,\s*\.post-create-guide li\s*\{[^}]*color:\s*var\(--color-linked-text\)/);
  assert.match(htmlSource, /id="dismiss-post-create-guide" class="primary-action"/);
});

test("renderer mirrors native post-create guide title typography", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const postCreateGuideSource =
    nativeSource.match(/private func postCreateGuide\(wikiURL: URL\) -> some View[\s\S]*?private func agentCommand/)?.[0] ??
    "";
  const guideTitleBlock = cssBlock(styleSource, ".post-create-guide h2");

  assert.notEqual(postCreateGuideSource, "");
  assert.match(
    postCreateGuideSource,
    /Text\("Your wiki is ready"\)[\s\S]*\.font\(\.system\(size:\s*20,\s*weight:\s*\.medium,\s*design:\s*\.serif\)\)[\s\S]*\.foregroundStyle\(Color\.sidebarSelectedText\)/
  );
  assert.match(htmlSource, /<h2>Your wiki is ready<\/h2>/);
  assert.match(guideTitleBlock, /font-family:\s*Georgia,\s*serif/);
  assert.match(guideTitleBlock, /font-size:\s*20px/);
  assert.match(guideTitleBlock, /font-weight:\s*500/);
  assert.match(guideTitleBlock, /color:\s*var\(--color-sidebar-selected-text\)/);
  assert.match(styleSource, /h2\s*\{[^}]*font-size:\s*18px/);
});

test("renderer mirrors native post-create guide summary text", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const postCreateGuideSource =
    nativeSource.match(/private func postCreateGuide\(wikiURL: URL\) -> some View[\s\S]*?private func agentCommand/)?.[0] ??
    "";
  const summaryRule =
    styleSource.match(/\.post-create-guide > \.guide-block:first-of-type p\s*\{([^}]+)\}/)?.[1] ?? "";
  const sharedParagraphRule =
    styleSource.match(/\.post-create-guide p,\s*\.post-create-guide li\s*\{([^}]+)\}/)?.[1] ?? "";

  assert.notEqual(postCreateGuideSource, "");
  assert.match(
    postCreateGuideSource,
    /Text\("WikiWise created the folder structure, build tools, and agent skills\. Now seed it with sources\."\)[\s\S]*\.font\(\.system\(size:\s*14\)\)[\s\S]*\.foregroundStyle\(Color\.sidebarText\)[\s\S]*\.lineSpacing\(3\)/
  );
  assert.match(
    htmlSource,
    /<div class="guide-block">\s*<h2>Your wiki is ready<\/h2>\s*<p>[\s\S]*WikiWise created the folder structure, build tools, and agent skills\.[\s\S]*Now seed it with sources\.[\s\S]*<\/p>\s*<\/div>/
  );
  assert.match(summaryRule, /font-size:\s*14px/);
  assert.match(summaryRule, /color:\s*var\(--color-sidebar-text\)/);
  assert.match(summaryRule, /line-height:\s*calc\(1\.2em \+ 3px\)/);
  assert.match(sharedParagraphRule, /color:\s*var\(--color-linked-text\)/);
  assert.match(sharedParagraphRule, /line-height:\s*1\.6/);
});

test("renderer mirrors native post-create guide dividers", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const postCreateGuideSource =
    nativeSource.match(/private func postCreateGuide\(wikiURL: URL\) -> some View[\s\S]*?private func agentCommand/)?.[0] ??
    "";
  const widthGroup =
    styleSource.match(/\.post-create-guide > \.guide-block,[\s\S]*?\{[^}]+\}/)?.[0] ?? "";
  const dividerRules = styleSource.match(/\.post-create-guide > \.guide-divider\s*\{[^}]+\}/g) ?? [];
  const dividerRule = dividerRules[dividerRules.length - 1] ?? "";

  assert.equal((postCreateGuideSource.match(/\bDivider\(\)/g) ?? []).length, 3);
  assert.equal((htmlSource.match(/class="guide-divider"/g) ?? []).length, 3);
  assert.match(
    htmlSource,
    /<\/div>\s*<hr class="guide-divider" aria-hidden="true" \/>\s*<div class="guide-block">\s*<p class="eyebrow">OPEN YOUR AGENT<\/p>/
  );
  assert.match(
    htmlSource,
    /id="guide-cursor-command"><\/code><\/pre>\s*<\/div>\s*<\/div>\s*<hr class="guide-divider" aria-hidden="true" \/>\s*<div class="guide-block">\s*<p class="eyebrow">SEED YOUR WIKI<\/p>/
  );
  assert.match(
    htmlSource,
    /<\/ul>\s*<\/div>\s*<hr class="guide-divider" aria-hidden="true" \/>\s*<p>\s*This is your project\./
  );
  assert.match(widthGroup, /\.post-create-guide > \.guide-divider/);
  assert.match(widthGroup, /max-width:\s*560px/);
  assert.match(dividerRule, /border-top:\s*1px solid var\(--color-sidebar-rule\)/);
  assert.match(dividerRule, /margin:\s*0 0 24px/);
});

test("renderer mirrors native post-create guide section headings", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const postCreateGuideSource =
    nativeSource.match(/private func postCreateGuide\(wikiURL: URL\) -> some View[\s\S]*?private func agentCommand/)?.[0] ??
    "";
  const guideHeadingRule = cssBlock(styleSource, ".post-create-guide .eyebrow");
  const globalEyebrowRule = styleSource.match(/\n\.eyebrow\s*\{([^}]+)\}/)?.[1] ?? "";

  assert.notEqual(postCreateGuideSource, "");
  assert.match(
    postCreateGuideSource,
    /Text\("OPEN YOUR AGENT"\)[\s\S]*?\.font\(\.system\(size:\s*10,\s*weight:\s*\.semibold\)\)[\s\S]*?\.tracking\(1\.5\)[\s\S]*?\.foregroundStyle\(Color\.sidebarHeader\)/
  );
  assert.match(
    postCreateGuideSource,
    /Text\("SEED YOUR WIKI"\)[\s\S]*?\.font\(\.system\(size:\s*10,\s*weight:\s*\.semibold\)\)[\s\S]*?\.tracking\(1\.5\)[\s\S]*?\.foregroundStyle\(Color\.sidebarHeader\)/
  );
  assert.match(htmlSource, /<p class="eyebrow">OPEN YOUR AGENT<\/p>/);
  assert.match(htmlSource, /<p class="eyebrow">SEED YOUR WIKI<\/p>/);
  assert.match(guideHeadingRule, /font-size:\s*10px/);
  assert.match(guideHeadingRule, /font-weight:\s*600/);
  assert.match(guideHeadingRule, /letter-spacing:\s*1\.5px/);
  assert.match(guideHeadingRule, /color:\s*var\(--color-sidebar-header\)/);
  assert.match(guideHeadingRule, /text-transform:\s*none/);
  assert.match(globalEyebrowRule, /font-size:\s*12px/);
  assert.match(globalEyebrowRule, /font-weight:\s*700/);
});

test("renderer mirrors native post-create guide intro copy", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const postCreateGuideSource =
    nativeSource.match(/private func postCreateGuide\(wikiURL: URL\) -> some View[\s\S]*?private func agentCommand/)?.[0] ??
    "";
  const introRule =
    styleSource.match(/\.post-create-guide \.guide-block:not\(:first-of-type\) > p:not\(\.eyebrow\)\s*\{([^}]+)\}/)?.[1] ??
    "";
  const sharedParagraphRule =
    styleSource.match(/\.post-create-guide p,\s*\.post-create-guide li\s*\{([^}]+)\}/)?.[1] ?? "";

  assert.notEqual(postCreateGuideSource, "");
  assert.match(
    postCreateGuideSource,
    /Text\("Use the built-in terminal in the right sidebar, or open your own terminal:"\)[\s\S]*?\.font\(\.system\(size:\s*13\)\)[\s\S]*?\.foregroundStyle\(Color\.sidebarText\)/
  );
  assert.match(
    postCreateGuideSource,
    /Text\("Once your agent is running, try:"\)[\s\S]*?\.font\(\.system\(size:\s*13\)\)[\s\S]*?\.foregroundStyle\(Color\.sidebarText\)/
  );
  assert.match(
    htmlSource,
    /<p class="eyebrow">OPEN YOUR AGENT<\/p>\s*<p>Use the built-in terminal in the right sidebar, or open your own terminal:<\/p>/
  );
  assert.match(htmlSource, /<p class="eyebrow">SEED YOUR WIKI<\/p>\s*<p>Once your agent is running, try:<\/p>/);
  assert.match(introRule, /font-size:\s*13px/);
  assert.match(introRule, /color:\s*var\(--color-sidebar-text\)/);
  assert.match(introRule, /line-height:\s*1\.2/);
  assert.match(sharedParagraphRule, /color:\s*var\(--color-linked-text\)/);
  assert.match(sharedParagraphRule, /line-height:\s*1\.6/);
});

test("renderer mirrors native post-create guide final guidance", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const postCreateGuideSource =
    nativeSource.match(/private func postCreateGuide\(wikiURL: URL\) -> some View[\s\S]*?private func agentCommand/)?.[0] ??
    "";
  const finalRule = cssBlock(styleSource, ".post-create-guide > p");
  const sharedParagraphRule =
    styleSource.match(/\.post-create-guide p,\s*\.post-create-guide li\s*\{([^}]+)\}/)?.[1] ?? "";

  assert.notEqual(postCreateGuideSource, "");
  assert.match(
    postCreateGuideSource,
    /Text\("This is your project\. You can change anything about it with your agent — the styles, the structure of your wiki pages, the build pipeline\. Make it your own\."\)[\s\S]*?\.font\(\.system\(size:\s*13\)\)[\s\S]*?\.foregroundStyle\(Color\.sidebarText\)[\s\S]*?\.lineSpacing\(2\)/
  );
  assert.match(
    htmlSource,
    /<hr class="guide-divider" aria-hidden="true" \/>\s*<p>\s*This is your project\. You can change anything about it with your agent[\s\S]*Make it your own\.\s*<\/p>\s*<button id="dismiss-post-create-guide"/
  );
  assert.match(finalRule, /font-size:\s*13px/);
  assert.match(finalRule, /color:\s*var\(--color-sidebar-text\)/);
  assert.match(finalRule, /line-height:\s*calc\(1\.2em \+ 2px\)/);
  assert.match(sharedParagraphRule, /color:\s*var\(--color-linked-text\)/);
  assert.match(sharedParagraphRule, /line-height:\s*1\.6/);
});

test("renderer mirrors native post-create guide agent command labels", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const agentCommandSource =
    nativeSource.match(/private func agentCommand\(agent: String, command: String\) -> some View[\s\S]*?private func seedOption/)?.[0] ??
    "";
  const commandRule = cssBlock(styleSource, ".guide-command");
  const labelRule = cssBlock(styleSource, ".post-create-guide .guide-command-agent");

  assert.notEqual(agentCommandSource, "");
  assert.match(
    agentCommandSource,
    /Text\(agent\)[\s\S]*?\.font\(\.system\(size:\s*12,\s*weight:\s*\.semibold\)\)[\s\S]*?\.foregroundStyle\(Color\.sidebarText\)/
  );
  assert.match(agentCommandSource, /VStack\(alignment:\s*\.leading,\s*spacing:\s*4\)/);
  assert.match(nativeSource, /agentCommand\(\s*agent:\s*"Claude Code"/);
  assert.match(nativeSource, /agentCommand\(\s*agent:\s*"Codex"/);
  assert.match(nativeSource, /agentCommand\(\s*agent:\s*"Cursor"/);
  assert.match(
    htmlSource,
    /<div class="guide-command">\s*<p class="guide-command-agent">Claude Code<\/p>\s*<pre><code id="guide-claude-command"><\/code><\/pre>\s*<\/div>/
  );
  assert.match(
    htmlSource,
    /<div class="guide-command">\s*<p class="guide-command-agent">Codex<\/p>\s*<pre><code id="guide-codex-command"><\/code><\/pre>\s*<\/div>/
  );
  assert.match(
    htmlSource,
    /<div class="guide-command">\s*<p class="guide-command-agent">Cursor<\/p>\s*<pre><code id="guide-cursor-command"><\/code><\/pre>\s*<\/div>/
  );
  assert.match(rendererSource, /document\.querySelector\("#guide-claude-command"\)/);
  assert.match(rendererSource, /document\.querySelector\("#guide-codex-command"\)/);
  assert.match(rendererSource, /document\.querySelector\("#guide-cursor-command"\)/);
  assert.match(commandRule, /display:\s*grid/);
  assert.match(commandRule, /gap:\s*4px/);
  assert.match(labelRule, /font-size:\s*12px/);
  assert.match(labelRule, /font-weight:\s*600/);
  assert.match(labelRule, /color:\s*var\(--color-sidebar-text\)/);
  assert.match(labelRule, /line-height:\s*1\.2/);
});

test("renderer mirrors native post-create guide agent command chrome", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const styleSource = read("src/renderer/styles.css");
  const agentCommandSource =
    nativeSource.match(/private func agentCommand\(agent: String, command: String\) -> some View[\s\S]*?private func seedOption/)?.[0] ??
    "";
  const commandChromeRule = cssBlock(styleSource, ".post-create-guide pre");
  const commandTextRule = cssBlock(styleSource, ".post-create-guide code");

  assert.notEqual(agentCommandSource, "");
  assert.match(
    agentCommandSource,
    /Text\(command\)[\s\S]*?\.font\(\.system\(size:\s*12,\s*design:\s*\.monospaced\)\)[\s\S]*?\.foregroundStyle\(Color\.sidebarTextMuted\)[\s\S]*?\.padding\(\.horizontal,\s*10\)[\s\S]*?\.padding\(\.vertical,\s*6\)[\s\S]*?\.background\(Color\.sidebarBg\)[\s\S]*?\.clipShape\(RoundedRectangle\(cornerRadius:\s*4\)\)[\s\S]*?\.textSelection\(\.enabled\)/
  );
  assert.match(commandTextRule, /font-family:\s*ui-monospace,\s*"SFMono-Regular",\s*Menlo,\s*monospace/);
  assert.match(commandTextRule, /font-size:\s*12px/);
  assert.match(commandChromeRule, /border:\s*0/);
  assert.doesNotMatch(commandChromeRule, /border:\s*1px solid var\(--color-sidebar-rule\)/);
  assert.match(commandChromeRule, /border-radius:\s*4px/);
  assert.match(commandChromeRule, /padding:\s*6px 10px/);
  assert.match(commandChromeRule, /background:\s*var\(--color-sidebar-bg\)/);
  assert.doesNotMatch(commandChromeRule, /background:\s*var\(--color-guide-code-bg\)/);
  assert.match(commandChromeRule, /color:\s*var\(--color-sidebar-text-muted\)/);
  assert.doesNotMatch(commandChromeRule, /color:\s*var\(--color-info-value\)/);
  assert.match(commandChromeRule, /overflow:\s*auto/);
  assert.match(rendererSource, /guideClaudeCommand\.textContent = `cd \$\{projectRoot\} && claude`/);
  assert.match(rendererSource, /guideCodexCommand\.textContent = `cd \$\{projectRoot\} && codex`/);
  assert.match(rendererSource, /guideCursorCommand\.textContent = `Open \$\{projectRoot\} in Cursor`/);
});

test("renderer mirrors native post-create guide seed option rows", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const seedOptionSource = nativeSource.match(/private func seedOption\(icon: String, title: String, command: String\) -> some View[\s\S]*?\n\s*\}\n\}/)?.[0] ?? "";
  const seedListRule = cssBlock(styleSource, ".guide-seed-options");
  const seedOptionRule = cssBlock(styleSource, ".post-create-guide .guide-seed-option");
  const seedIconRule = cssBlock(styleSource, ".guide-seed-icon");
  const seedCopyRule = cssBlock(styleSource, ".guide-seed-copy");
  const seedTitleRule = cssBlock(styleSource, ".guide-seed-title");
  const seedCommandRule = cssBlock(styleSource, ".guide-seed-command");

  assert.notEqual(seedOptionSource, "");
  assert.match(
    seedOptionSource,
    /HStack\(alignment:\s*\.top,\s*spacing:\s*10\)[\s\S]*?Image\(systemName:\s*icon\)[\s\S]*?\.font\(\.system\(size:\s*13\)\)[\s\S]*?\.foregroundStyle\(Color\.accentPrimary\)[\s\S]*?\.frame\(width:\s*20\)[\s\S]*?VStack\(alignment:\s*\.leading,\s*spacing:\s*2\)[\s\S]*?Text\(title\)[\s\S]*?\.font\(\.system\(size:\s*13,\s*weight:\s*\.medium\)\)[\s\S]*?\.foregroundStyle\(Color\.sidebarSelectedText\)[\s\S]*?Text\(command\)[\s\S]*?\.font\(\.system\(size:\s*12,\s*design:\s*\.monospaced\)\)[\s\S]*?\.foregroundStyle\(Color\.sidebarTextMuted\)/
  );
  assert.match(nativeSource, /seedOption\(\s*icon:\s*"book",\s*title:\s*"Import from Readwise",\s*command:\s*"\/import-readwise"/);
  assert.match(nativeSource, /seedOption\(\s*icon:\s*"link",\s*title:\s*"Ingest an article",\s*command:\s*"Ingest this article: \[paste URL\]"/);
  assert.match(nativeSource, /seedOption\(\s*icon:\s*"folder",\s*title:\s*"Import existing files",\s*command:\s*"Ingest the files in ~\/my-notes\/ into this wiki"/);
  assert.match(nativeSource, /seedOption\(\s*icon:\s*"text\.bubble",\s*title:\s*"Start from a topic",\s*command:\s*"Start a wiki about \[your topic\]"/);

  assert.match(htmlSource, /<ul class="guide-seed-options">/);
  assert.match(
    htmlSource,
    /<li class="guide-seed-option">\s*<span class="guide-seed-icon" data-native-symbol="book" aria-hidden="true">[\s\S]*?<\/span>\s*<div class="guide-seed-copy">\s*<span class="guide-seed-title">Import from Readwise<\/span>\s*<code class="guide-seed-command">\/import-readwise<\/code>\s*<\/div>\s*<\/li>/
  );
  assert.match(
    htmlSource,
    /<li class="guide-seed-option">\s*<span class="guide-seed-icon" data-native-symbol="link" aria-hidden="true">[\s\S]*?<\/span>\s*<div class="guide-seed-copy">\s*<span class="guide-seed-title">Ingest an article<\/span>\s*<code class="guide-seed-command">Ingest this article: \[paste URL\]<\/code>\s*<\/div>\s*<\/li>/
  );
  assert.match(
    htmlSource,
    /<li class="guide-seed-option">\s*<span class="guide-seed-icon" data-native-symbol="folder" aria-hidden="true">[\s\S]*?<\/span>\s*<div class="guide-seed-copy">\s*<span class="guide-seed-title">Import existing files<\/span>\s*<code class="guide-seed-command">Ingest the files in ~\/my-notes\/ into this wiki<\/code>\s*<\/div>\s*<\/li>/
  );
  assert.match(
    htmlSource,
    /<li class="guide-seed-option">\s*<span class="guide-seed-icon" data-native-symbol="text\.bubble" aria-hidden="true">[\s\S]*?<\/span>\s*<div class="guide-seed-copy">\s*<span class="guide-seed-title">Start from a topic<\/span>\s*<code class="guide-seed-command">Start a wiki about \[your topic\]<\/code>\s*<\/div>\s*<\/li>/
  );
  assert.doesNotMatch(htmlSource, /<li><strong>Import from Readwise:/);

  assert.match(seedListRule, /display:\s*grid/);
  assert.match(seedListRule, /gap:\s*10px/);
  assert.match(seedListRule, /list-style:\s*none/);
  assert.match(seedOptionRule, /grid-template-columns:\s*20px minmax\(0,\s*1fr\)/);
  assert.match(seedOptionRule, /column-gap:\s*10px/);
  assert.match(seedOptionRule, /align-items:\s*start/);
  assert.match(seedIconRule, /width:\s*20px/);
  assert.match(seedIconRule, /color:\s*var\(--color-accent-primary\)/);
  assert.match(seedIconRule, /font-size:\s*13px/);
  assert.match(seedCopyRule, /display:\s*grid/);
  assert.match(seedCopyRule, /gap:\s*2px/);
  assert.match(seedTitleRule, /color:\s*var\(--color-sidebar-selected-text\)/);
  assert.match(seedTitleRule, /font-size:\s*13px/);
  assert.match(seedTitleRule, /font-weight:\s*500/);
  assert.match(seedCommandRule, /color:\s*var\(--color-sidebar-text-muted\)/);
  assert.match(seedCommandRule, /font-family:\s*ui-monospace,\s*"SFMono-Regular",\s*Menlo,\s*monospace/);
  assert.match(seedCommandRule, /font-size:\s*12px/);
});

test("renderer mirrors native post-create guide dismiss home selection", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const postCreateGuideSource =
    nativeSource.match(/private func postCreateGuide\(wikiURL: URL\) -> some View[\s\S]*?private func agentCommand/)?.[0] ??
    "";
  const dismissFunctionSource =
    rendererSource.match(/async function dismissPostCreateGuide\(\)[\s\S]*?\n\}/)?.[0] ?? "";

  assert.notEqual(postCreateGuideSource, "");
  assert.match(
    postCreateGuideSource,
    /Button\("Got it — start reading"\)[\s\S]*?showPostCreateGuide = false[\s\S]*?let home = root\.appendingPathComponent\("wiki\/home\.md"\)[\s\S]*?FileManager\.default\.fileExists\(atPath:\s*home\.path\)[\s\S]*?selectedFileURL = home[\s\S]*?loadFile\(home\)/
  );
  assert.match(rendererSource, /function findWikiHomeNode\(\)/);
  assert.match(rendererSource, /state\.tree\.find\(\(node\) => node\.isDirectory && node\.name === "wiki"\)/);
  assert.match(rendererSource, /wikiFolder\?\.children\?\.find\(\(node\) => !node\.isDirectory && node\.name === "home\.md"\)/);
  assert.notEqual(dismissFunctionSource, "");
  assert.match(dismissFunctionSource, /state\.showPostCreateGuide = false/);
  assert.match(dismissFunctionSource, /const homeNode = findWikiHomeNode\(\)/);
  assert.match(dismissFunctionSource, /if \(homeNode\) \{[\s\S]*?await selectFile\(homeNode,\s*\{\s*pushHistory:\s*false\s*\}\)[\s\S]*?return/);
  assert.match(dismissFunctionSource, /renderDetail\(\)/);
  assert.match(rendererSource, /dismissPostCreateGuideButton\.addEventListener\("click",\s*\(\) => \{[\s\S]*?dismissPostCreateGuide\(\)\.catch\(setError\)/);
});
