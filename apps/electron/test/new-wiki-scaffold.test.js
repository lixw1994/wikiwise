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

function sourceBetween(source, startSignature, endSignature) {
  const start = source.indexOf(startSignature);
  const end = source.indexOf(endSignature, start + startSignature.length);

  assert.notEqual(start, -1);
  assert.notEqual(end, -1);

  return source.slice(start, end);
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
  const chooseLocationStart = mainSource.indexOf("async function chooseNewWikiLocation");
  const chooseLocationEnd = mainSource.indexOf("function createProjectResult", chooseLocationStart);
  const chooseLocationSource = mainSource.slice(chooseLocationStart, chooseLocationEnd);

  assert.notEqual(chooseLocationStart, -1);
  assert.notEqual(chooseLocationEnd, -1);
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
  assert.match(rendererSource, /newWikiTranslationTargetLanguage/);
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
  assert.match(htmlSource, /id="new-wiki-translation-target"/);
  assert.match(htmlSource, /id="confirm-create-new"/);
  assert.match(htmlSource, /id="post-create-guide"/);
  assert.doesNotMatch(htmlSource, /later OpenSpec phase/);
});

test("new-wiki flow offers common auto-translation languages and sends the selection", () => {
  const htmlSource = read("src/renderer/index.html");
  const rendererSource = read("src/renderer/renderer.js");
  const mainSource = read("src/main/main.js");
  const createNewWikiSource = sourceBetween(
    rendererSource,
    "async function createNewWiki()",
    "function renderPostCreateGuide()"
  );

  assert.match(htmlSource, /<label class="field-label" for="new-wiki-translation-target">Auto-translate raw sources<\/label>/);
  assert.match(htmlSource, /<select id="new-wiki-translation-target"/);
  assert.match(htmlSource, /<option value="">Off<\/option>/);
  for (const language of [
    "Simplified Chinese",
    "Traditional Chinese",
    "English",
    "Japanese",
    "Korean",
    "Spanish",
    "French",
    "German",
    "Portuguese",
    "Italian"
  ]) {
    assert.match(htmlSource, new RegExp(`>${language}<`));
  }

  assert.match(rendererSource, /const newWikiTranslationTargetSelect = document\.querySelector\("#new-wiki-translation-target"\)/);
  assert.match(rendererSource, /newWikiTranslationTargetLanguage:\s*""/);
  assert.match(rendererSource, /newWikiTranslationTargetSelect\.value = state\.newWikiTranslationTargetLanguage/);
  assert.match(rendererSource, /newWikiTranslationTargetSelect\.addEventListener\("change"/);
  assert.match(createNewWikiSource, /translationTargetLanguage:\s*state\.newWikiTranslationTargetLanguage/);
  assert.match(mainSource, /translationTargetLanguage:\s*payload\.translationTargetLanguage/);
});

test("renderer mirrors native scaffold failure dismissal behavior", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const rendererStart = rendererSource.indexOf("async function createNewWiki()");
  const rendererEnd = rendererSource.indexOf("function renderPostCreateGuide", rendererStart);
  const createNewWikiSource = rendererSource.slice(rendererStart, rendererEnd);

  assert.notEqual(createNewWikiSource, "");

  assert.match(
    createNewWikiSource,
    /catch \(error\) \{[\s\S]*console\.error\(error\)[\s\S]*state\.isNewWikiDialogOpen = false[\s\S]*state\.showPostCreateGuide = false/
  );
  assert.doesNotMatch(createNewWikiSource, /catch \(error\) \{[\s\S]*setError\(error\)/);
  assert.doesNotMatch(createNewWikiSource, /catch \(error\) \{[\s\S]*applyProjectResult/);
});

test("shared scaffold helper mirrors native empty slug behavior", () => {
  const coreSource = readRepository("packages/wikiwise-core/src/index.js");
  const coreScaffoldSource =
    coreSource.match(/export function createWikiScaffold\(options = \{\}\) \{[\s\S]*?\n\}/)?.[0] ?? "";

  assert.notEqual(coreScaffoldSource, "");
  assert.match(coreScaffoldSource, /const slug = slugForWikiName\(name\)/);
  assert.match(coreScaffoldSource, /const wikiPath = path\.join\(parentDir,\s*slug\)/);
  assert.doesNotMatch(coreScaffoldSource, /if \(!slug\) \{/);
  assert.doesNotMatch(coreScaffoldSource, /requires a sluggable wiki name/);
});

test("renderer mirrors native new-wiki sheet layout and typography", () => {
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const panelBlock = cssBlock(styleSource, ".new-wiki-panel");
  const titleBlock = cssBlock(styleSource, ".new-wiki-panel h2");
  const fieldBlock = cssBlock(styleSource, ".new-wiki-form-field");
  const fieldLabelBlock = cssBlock(styleSource, ".new-wiki-panel .field-label");


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
  const styleSource = read("src/renderer/styles.css");
  const globalFieldLabelBlock = styleSource.match(/\n\.field-label\s*\{([^}]+)\}/)?.[1] ?? "";
  const newWikiFieldLabelBlock = cssBlock(styleSource, ".new-wiki-panel .field-label");

  assert.match(globalFieldLabelBlock, /color:\s*var\(--color-toolbar-text\)/);
  assert.match(newWikiFieldLabelBlock, /color:\s*var\(--color-sidebar-text\)/);
  assert.match(newWikiFieldLabelBlock, /font-size:\s*12px/);
  assert.match(newWikiFieldLabelBlock, /font-weight:\s*500/);
});

test("renderer mirrors native new-wiki location middle truncation", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const styleSource = read("src/renderer/styles.css");
  const locationPathBlock = cssBlock(styleSource, ".location-path");


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
  const middleTruncatePath = rendererFunction("middleTruncatePath", "loadScriptOnce");
  const longPath = "\u{10400}".repeat(8);
  const shortPath = "\u{10400}".repeat(3);
  const truncated = middleTruncatePath(longPath, 7);

  assert.equal(middleTruncatePath(shortPath, 7), shortPath);
  assert.equal(truncated, `${"\u{10400}".repeat(3)}…${"\u{10400}".repeat(3)}`);
  assert.equal(Array.from(truncated).length, 7);
  assert.equal(containsUnpairedSurrogate(truncated), false);
});

test("renderer mirrors native new-wiki location path font", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const styleSource = read("src/renderer/styles.css");
  const locationPathBlock = cssBlock(styleSource, ".location-path");

  assert.match(locationPathBlock, /font-size:\s*12px/);
  assert.doesNotMatch(locationPathBlock, /ui-monospace|SFMono-Regular|Menlo|monospace/);
  assert.match(rendererSource, /newWikiLocationLabel\.title = fullLocationPath/);
  assert.match(rendererSource, /newWikiLocationLabel\.setAttribute\("aria-label", fullLocationPath\)/);
  assert.match(rendererSource, /parentDir:\s*state\.newWikiLocation/);
});

test("renderer mirrors native new-wiki location label spacing", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const styleSource = read("src/renderer/styles.css");
  const locationPathBlock = cssBlock(styleSource, ".location-path");

  assert.match(locationPathBlock, /margin:\s*6px 0 0/);
  assert.match(locationPathBlock, /color:\s*var\(--color-sidebar-text-muted\)/);
  assert.match(locationPathBlock, /white-space:\s*nowrap/);
  assert.match(rendererSource, /newWikiLocationLabel\.title = fullLocationPath/);
  assert.match(rendererSource, /parentDir:\s*state\.newWikiLocation/);
});

test("renderer mirrors native new-wiki location path color", () => {
  const styleSource = read("src/renderer/styles.css");
  const locationPathBlock = cssBlock(styleSource, ".location-path");
  const publishUrlAffixBlock = cssBlock(styleSource, ".publish-url-affix");

  assert.match(locationPathBlock, /color:\s*var\(--color-sidebar-text-muted\)/);
  assert.match(locationPathBlock, /font-size:\s*12px/);
  assert.match(locationPathBlock, /margin:\s*6px 0 0/);
  assert.match(locationPathBlock, /white-space:\s*nowrap/);
  assert.match(publishUrlAffixBlock, /color:\s*var\(--color-muted-text\)/);
});

test("renderer mirrors native new-wiki action row spacing", () => {
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const modalActionsBlock = cssBlock(styleSource, ".modal-actions");
  const newWikiActionsBlock = cssBlock(styleSource, ".new-wiki-actions");


  assert.match(
    htmlSource,
    /<div class="modal-actions new-wiki-actions">[\s\S]*id="cancel-create-new"[\s\S]*Cancel[\s\S]*id="confirm-create-new"[\s\S]*Create[\s\S]*<\/div>/
  );
  assert.match(modalActionsBlock, /margin-top:\s*8px/);
  assert.match(newWikiActionsBlock, /margin-top:\s*0/);
});

test("renderer mirrors native new-wiki action button chrome", () => {
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const newWikiButtonBlock = cssBlock(styleSource, ".new-wiki-button");
  const newWikiDefaultButtonBlock = cssBlock(styleSource, ".new-wiki-default-button");


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

test("renderer mirrors native new-wiki disabled state and fallback location", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const renderDialogSource =
    rendererSource.match(/function renderNewWikiDialog\(\) \{[\s\S]*?\n\}/)?.[0] ?? "";


  assert.notEqual(renderDialogSource, "");
  assert.match(renderDialogSource, /const fullLocationPath = state\.newWikiLocation \|\| "~\/wikis";/);
  assert.match(renderDialogSource, /confirmCreateNewButton\.disabled = state\.newWikiName\.trim\(\)\.length === 0;/);
  assert.doesNotMatch(renderDialogSource, /newWikiNameInput\.disabled = state\.isCreatingWiki/);
  assert.doesNotMatch(renderDialogSource, /chooseNewWikiLocationButton\.disabled = state\.isCreatingWiki/);
  assert.doesNotMatch(renderDialogSource, /cancelCreateNewButton\.disabled = state\.isCreatingWiki/);
  assert.doesNotMatch(renderDialogSource, /state\.isCreatingWiki \|\| state\.newWikiName\.trim\(\)\.length === 0/);
  assert.doesNotMatch(renderDialogSource, /\|\| !state\.newWikiLocation/);
});

test("renderer mirrors native new-wiki location chooser button chrome", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const newWikiButtonBlock = cssBlock(styleSource, ".new-wiki-button");
  const newWikiChooseButtonBlock = cssBlock(styleSource, ".new-wiki-choose-button");


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
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const textInputBlock = cssBlock(styleSource, ".text-input");
  const newWikiNameInputBlock = cssBlock(styleSource, ".new-wiki-name-input");


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
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);

  assert.match(htmlSource, /id="confirm-create-new"[\s\S]*?>\s*Create\s*<\/button>/);
  assert.match(rendererSource, /confirmCreateNewButton\.textContent = "Create"/);
  assert.doesNotMatch(rendererSource, /confirmCreateNewButton\.textContent = state\.isCreatingWiki \? "Creating" : "Create"/);
  assert.doesNotMatch(rendererSource, /"Creating"/);

  assert.match(rendererSource, /function handleNewWikiDialogKeydown\(event\)/);
  assert.match(rendererSource, /event\.key === "Escape"[\s\S]*closeNewWikiDialog\(\)/);
  assert.match(rendererSource, /event\.key === "Enter"[\s\S]*confirmCreateNewButton\.disabled[\s\S]*createNewWiki\(\)/);
  assert.match(rendererSource, /newWikiDialog\.addEventListener\("keydown", handleNewWikiDialogKeydown\)/);

  assert.match(htmlSource, /id="choose-new-wiki-location"[\s\S]*?>\s*Choose…\s*<\/button>/);
  assert.doesNotMatch(htmlSource, />\s*Choose\s*<\/button>/);

  assert.match(
    normalizedHtml,
    /WikiWise created the folder structure, build tools, and agent skills\. Now seed it with sources\./
  );
  assert.doesNotMatch(normalizedHtml, /Wikiwise created the folder structure/);

  assert.match(
    normalizedHtml,
    /Use the built-in terminal in the right sidebar, or open your own terminal:/
  );
  assert.doesNotMatch(
    normalizedHtml,
    /Use the built-in terminal, or open your own terminal:/
  );

  assert.match(normalizedHtml, /OPEN YOUR AGENT/);
  assert.match(normalizedHtml, /SEED YOUR WIKI/);
  assert.doesNotMatch(normalizedHtml, /Open your agent/);
  assert.doesNotMatch(normalizedHtml, /Seed your wiki/);

  assert.match(normalizedHtml, /Once your agent is running, try:/);
  assert.match(
    normalizedHtml,
    /<p class="eyebrow">SEED YOUR WIKI<\/p> <p>Once your agent is running, try:<\/p> <ul class="guide-seed-options">/
  );

  assert.match(
    normalizedHtml,
    /This is your project\. You can change anything about it with your agent — the styles, the structure of your wiki pages, the build pipeline\. Make it your own\./
  );
  assert.doesNotMatch(normalizedHtml, /You can change the styles, page structure, and build pipeline with your agent\./);

  assert.match(normalizedHtml, /Got it — start reading/);
  assert.doesNotMatch(normalizedHtml, /Got it - start reading/);
});

test("renderer mirrors native post-create guide container layout", () => {
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const guideBlock = cssBlock(styleSource, ".post-create-guide");

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
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const guideTitleBlock = cssBlock(styleSource, ".post-create-guide h2");

  assert.match(htmlSource, /<h2>Your wiki is ready<\/h2>/);
  assert.match(guideTitleBlock, /font-family:\s*Georgia,\s*serif/);
  assert.match(guideTitleBlock, /font-size:\s*20px/);
  assert.match(guideTitleBlock, /font-weight:\s*500/);
  assert.match(guideTitleBlock, /color:\s*var\(--color-sidebar-selected-text\)/);
  assert.match(styleSource, /h2\s*\{[^}]*font-size:\s*18px/);
});

test("renderer mirrors native post-create guide summary text", () => {
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const summaryRule =
    styleSource.match(/\.post-create-guide > \.guide-block:first-of-type p\s*\{([^}]+)\}/)?.[1] ?? "";
  const sharedParagraphRule =
    styleSource.match(/\.post-create-guide p,\s*\.post-create-guide li\s*\{([^}]+)\}/)?.[1] ?? "";

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
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const widthGroup =
    styleSource.match(/\.post-create-guide > \.guide-block,[\s\S]*?\{[^}]+\}/)?.[0] ?? "";
  const dividerRules = styleSource.match(/\.post-create-guide > \.guide-divider\s*\{[^}]+\}/g) ?? [];
  const dividerRule = dividerRules[dividerRules.length - 1] ?? "";

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
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const guideHeadingRule = cssBlock(styleSource, ".post-create-guide .eyebrow");
  const globalEyebrowRule = styleSource.match(/\n\.eyebrow\s*\{([^}]+)\}/)?.[1] ?? "";

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
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const introRule =
    styleSource.match(/\.post-create-guide \.guide-block:not\(:first-of-type\) > p:not\(\.eyebrow\)\s*\{([^}]+)\}/)?.[1] ??
    "";
  const sharedParagraphRule =
    styleSource.match(/\.post-create-guide p,\s*\.post-create-guide li\s*\{([^}]+)\}/)?.[1] ?? "";

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
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const finalRule = cssBlock(styleSource, ".post-create-guide > p");
  const sharedParagraphRule =
    styleSource.match(/\.post-create-guide p,\s*\.post-create-guide li\s*\{([^}]+)\}/)?.[1] ?? "";

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
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const commandRule = cssBlock(styleSource, ".guide-command");
  const labelRule = cssBlock(styleSource, ".post-create-guide .guide-command-agent");

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
  const rendererSource = read("src/renderer/renderer.js");
  const styleSource = read("src/renderer/styles.css");
  const commandChromeRule = cssBlock(styleSource, ".post-create-guide pre");
  const commandTextRule = cssBlock(styleSource, ".post-create-guide code");

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
  const htmlSource = read("src/renderer/index.html");
  const styleSource = read("src/renderer/styles.css");
  const seedListRule = cssBlock(styleSource, ".guide-seed-options");
  const seedOptionRule = cssBlock(styleSource, ".post-create-guide .guide-seed-option");
  const seedIconRule = cssBlock(styleSource, ".guide-seed-icon");
  const seedCopyRule = cssBlock(styleSource, ".guide-seed-copy");
  const seedTitleRule = cssBlock(styleSource, ".guide-seed-title");
  const seedCommandRule = cssBlock(styleSource, ".guide-seed-command");


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
  const rendererSource = read("src/renderer/renderer.js");
  const dismissFunctionSource =
    rendererSource.match(/async function dismissPostCreateGuide\(\)[\s\S]*?\n\}/)?.[0] ?? "";

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

test("renderer keeps post-create guide visible across incidental navigation like native", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const selectFileSource = sourceBetween(
    rendererSource,
    "async function selectFile(node, options = {})",
    "function setSelectedFile"
  );
  const showGeneratedPageSource = sourceBetween(
    rendererSource,
    "function showGeneratedPage(generatedPage, options = {})",
    "async function navigateBack"
  );
  const dismissFunctionSource = sourceBetween(
    rendererSource,
    "async function dismissPostCreateGuide()",
    "async function loadAppSettings"
  );


  assert.doesNotMatch(selectFileSource, /state\.showPostCreateGuide = false/);
  assert.doesNotMatch(showGeneratedPageSource, /state\.showPostCreateGuide = false/);
  assert.match(dismissFunctionSource, /state\.showPostCreateGuide = false/);
});

test("renderer preserves post-create guide across project result application like native", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const applyProjectResultSource = sourceBetween(
    rendererSource,
    "async function applyProjectResult(projectResult, options = {})",
    "async function openNewWikiDialog()"
  );
  const createNewWikiSource = sourceBetween(
    rendererSource,
    "async function createNewWiki()",
    "function renderPostCreateGuide()"
  );
  const dismissFunctionSource = sourceBetween(
    rendererSource,
    "async function dismissPostCreateGuide()",
    "async function loadAppSettings"
  );


  assert.notEqual(applyProjectResultSource, "");
  assert.doesNotMatch(applyProjectResultSource, /state\.showPostCreateGuide\s*=\s*Boolean\(options\.showPostCreateGuide\)/);
  assert.doesNotMatch(applyProjectResultSource, /state\.showPostCreateGuide\s*=\s*false/);
  assert.match(
    applyProjectResultSource,
    /if \(options\.showPostCreateGuide === true\) \{[\s\S]*state\.showPostCreateGuide = true/
  );

  assert.match(createNewWikiSource, /applyProjectResult\(result\.project,\s*\{\s*showPostCreateGuide:\s*true\s*\}\)/);
  assert.match(createNewWikiSource, /catch \(error\)[\s\S]*state\.showPostCreateGuide = false/);
  assert.match(dismissFunctionSource, /state\.showPostCreateGuide = false/);
});
