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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cssBlock(source, selector) {
  const pattern = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]+)\\}`);
  return source.match(pattern)?.[1] ?? "";
}

test("main process exposes publishing IPC through core helpers", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /loadPublishConfig/);
  assert.match(mainSource, /checkPublishAvailability/);
  assert.match(mainSource, /publishSite/);
  assert.match(mainSource, /unpublishSite/);
  assert.match(mainSource, /wikiwise:getPublishConfig/);
  assert.match(mainSource, /wikiwise:checkPublishAvailability/);
  assert.match(mainSource, /wikiwise:publishSite/);
  assert.match(mainSource, /wikiwise:unpublishSite/);
  assert.match(mainSource, /compileAll\(\)/);
});

test("preload exposes publishing APIs without renderer filesystem access", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(preloadSource, /getPublishConfig:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:getPublishConfig"/);
  assert.match(
    preloadSource,
    /checkPublishAvailability:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:checkPublishAvailability"/
  );
  assert.match(preloadSource, /publishSite:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:publishSite"/);
  assert.match(preloadSource, /unpublishSite:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:unpublishSite"/);
});

test("renderer contains native publishing state and project service refresh", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /publishConfig/);
  assert.match(rendererSource, /isPublishDialogOpen/);
  assert.match(rendererSource, /publishSubdomain/);
  assert.match(rendererSource, /publishAvailability/);
  assert.match(rendererSource, /isPublishing/);
  assert.match(rendererSource, /publishResult/);
  assert.match(rendererSource, /publishError/);
  assert.match(rendererSource, /refreshPublishConfig/);
  assert.match(rendererSource, /openPublishDialog/);
  assert.match(rendererSource, /checkPublishAvailability/);
  assert.match(rendererSource, /sanitizePublishSubdomain/);
  assert.match(rendererSource, /publishCurrentProject/);
  assert.match(rendererSource, /handlePublishDialogKeydown/);
  assert.match(rendererSource, /renderPublishDialog/);
  assert.match(rendererSource, /renderPublishFeedback/);
  assert.match(rendererSource, /openPublishedUrl/);
  assert.match(rendererSource, /dismissPublishResult/);
  assert.match(rendererSource, /dismissPublishError/);
  assert.match(rendererSource, /openUnpublishConfirmation/);
  assert.match(rendererSource, /confirmUnpublish/);
  assert.match(rendererSource, /handleUnpublishConfirmationKeydown/);
  assert.match(rendererSource, /wikiwise\.getPublishConfig/);
  assert.match(rendererSource, /wikiwise\.checkPublishAvailability/);
  assert.match(rendererSource, /wikiwise\.publishSite/);
  assert.match(rendererSource, /wikiwise\.unpublishSite/);
  assert.match(rendererSource, /wikiwise\.openExternalUrl/);
  assert.doesNotMatch(rendererSource, /window\.confirm/);
});

test("renderer mirrors native publish toolbar help text", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(
    nativeSource,
    /\.help\(publishConfig\.map\s*\{\s*"Last published: \\\(\$0\.lastPublishedAt \?\? "never"\)\\n\\\(\$0\.url\)\\n\\u\{2325\}-click to change URL"\s*\}\s*\?\?\s*"Publish wiki to wiki-wise\.com"\)/
  );
  assert.match(rendererSource, /function publishButtonHelpText/);
  assert.match(rendererSource, /Publish wiki to wiki-wise\.com/);
  assert.match(rendererSource, /Last published: \$\{state\.publishConfig\.lastPublishedAt \?\? "never"\}/);
  assert.match(rendererSource, /\$\{state\.publishConfig\.url\}/);
  assert.match(rendererSource, /⌥-click to change URL/);
  assert.match(rendererSource, /publishButton\.title\s*=\s*publishHelpText/);
  assert.match(rendererSource, /publishButton\.setAttribute\("aria-label",\s*publishHelpText\)/);
});

test("renderer mirrors native publish action labels", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(nativeSource, /Text\("PUBLISHING\\u\{2026\}"\)/);
  assert.match(nativeSource, /Text\("PUBLISH \\u\{2191\}"\)/);
  assert.match(nativeSource, /Button\("Publish"\)/);

  assert.match(rendererSource, /const publishBusy = state\.isPublishing \|\| state\.isUnpublishing/);
  assert.match(rendererSource, /publishLabel\.textContent = publishBusy \? "PUBLISHING…" : "PUBLISH ↑"/);
  assert.match(rendererSource, /confirmPublishButton\.textContent = "Publish"/);
  assert.doesNotMatch(rendererSource, /confirmPublishButton\.textContent = state\.isPublishing/);
  assert.doesNotMatch(rendererSource, /"Publishing"/);
  assert.doesNotMatch(rendererSource, /PUBLISHING\.\.\./);
  assert.doesNotMatch(rendererSource, /state\.publishConfig\?\.published\s*\?\s*"Update"\s*:\s*"Publish"/);
});

test("renderer mirrors native publish toolbar button style", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const cssSource = read("src/renderer/styles.css");
  const publishButtonBlock = cssBlock(cssSource, ".publish-button");

  assert.match(
    nativeSource,
    /Text\("PUBLISH \\u\{2191\}"\)[\s\S]*\.font\(\.system\(size:\s*10,\s*weight:\s*\.regular,\s*design:\s*\.monospaced\)\)[\s\S]*\.tracking\(0\.8\)[\s\S]*\.foregroundStyle\(Color\.sidebarSelectedText\)[\s\S]*\.padding\(\.horizontal,\s*10\)[\s\S]*\.padding\(\.vertical,\s*4\)[\s\S]*RoundedRectangle\(cornerRadius:\s*3\)[\s\S]*\.fill\(Color\.sidebarSelectedBg\)[\s\S]*\.strokeBorder\(Color\.sidebarRule,\s*lineWidth:\s*1\)/
  );
  assert.match(publishButtonBlock, /font-family:\s*ui-monospace,\s*"SFMono-Regular",\s*Menlo,\s*monospace/);
  assert.match(publishButtonBlock, /font-size:\s*10px/);
  assert.match(publishButtonBlock, /letter-spacing:\s*0\.8px/);
  assert.match(publishButtonBlock, /color:\s*var\(--color-sidebar-selected-text\)/);
  assert.match(publishButtonBlock, /background:\s*var\(--color-sidebar-selected-bg\)/);
  assert.match(publishButtonBlock, /border:\s*1px solid var\(--color-sidebar-rule\)/);
  assert.match(publishButtonBlock, /border-radius:\s*3px/);
  assert.match(publishButtonBlock, /padding:\s*4px 10px/);
});

test("renderer mirrors native publish toolbar busy indicator", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const rendererSource = read("src/renderer/renderer.js");
  const cssSource = read("src/renderer/styles.css");
  const busyIndicatorBlock = cssBlock(cssSource, ".publish-busy-indicator");
  const publishButtonBlock = cssBlock(cssSource, ".publish-button");

  assert.match(
    nativeSource,
    /if isPublishing \{[\s\S]*ProgressView\(\)[\s\S]*\.controlSize\(\.small\)[\s\S]*\.frame\(width:\s*12,\s*height:\s*12\)[\s\S]*Text\("PUBLISHING\\u\{2026\}"\)/
  );
  assert.match(
    normalizedHtml,
    /<button id="publish-wiki"[\s\S]*<span id="publish-busy-indicator" class="publish-busy-indicator" hidden aria-hidden="true"><\/span>\s*<span id="publish-label">PUBLISH ↑<\/span>[\s\S]*<\/button>/
  );
  assert.match(rendererSource, /const publishBusyIndicator = document\.querySelector\("#publish-busy-indicator"\)/);
  assert.match(rendererSource, /const publishLabel = document\.querySelector\("#publish-label"\)/);
  assert.match(rendererSource, /publishBusyIndicator\.hidden = !publishBusy/);
  assert.match(rendererSource, /publishLabel\.textContent = publishBusy \? "PUBLISHING…" : "PUBLISH ↑"/);
  assert.doesNotMatch(rendererSource, /publishButton\.textContent = publishBusy \? "PUBLISHING…" : "PUBLISH ↑"/);
  assert.match(publishButtonBlock, /display:\s*inline-flex/);
  assert.match(publishButtonBlock, /align-items:\s*center/);
  assert.match(publishButtonBlock, /gap:\s*4px/);
  assert.match(busyIndicatorBlock, /width:\s*12px/);
  assert.match(busyIndicatorBlock, /height:\s*12px/);
  assert.match(busyIndicatorBlock, /animation:\s*publish-busy-spin/);
  assert.match(cssSource, /@keyframes publish-busy-spin/);
});

test("renderer mirrors native toolbar busy state during unpublish", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const confirmUnpublishBody = rendererSource.match(
    /async function confirmUnpublish\(\) \{([\s\S]*?)\n\}\n\nasync function startProjectWatcher/
  )?.[1] ?? "";

  assert.match(
    nativeSource,
    /private func performUnpublish\(\) \{[\s\S]*isPublishing = true/
  );
  assert.match(nativeSource, /\.disabled\(isPublishing \|\| compiler == nil\)/);
  assert.match(rendererSource, /function isProjectFolder\(\)/);
  assert.match(rendererSource, /publishButton\.disabled = !isProjectFolder\(\) \|\| publishBusy/);
  assert.match(confirmUnpublishBody, /state\.isUnpublishing = true;[\s\S]*renderPublishStatus\(\)/);
});

test("renderer mirrors native publish dialog keyboard shortcuts", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(
    nativeSource,
    /private var publishConfirmSheet[\s\S]*Button\("Cancel"\)\s*\{[\s\S]*showPublishConfirm = false[\s\S]*\.keyboardShortcut\(\.cancelAction\)[\s\S]*Button\("Publish"\)\s*\{[\s\S]*performPublish\(subdomain: pendingSubdomain\)[\s\S]*\.keyboardShortcut\(\.defaultAction\)/
  );
  assert.match(rendererSource, /function handlePublishDialogKeydown\(event\)/);
  assert.match(rendererSource, /event\.key === "Escape"[\s\S]*closePublishDialog\(\)/);
  assert.match(rendererSource, /event\.key === "Enter"[\s\S]*confirmPublishButton\.disabled[\s\S]*publishCurrentProject\(\)/);
  assert.match(rendererSource, /publishDialog\.addEventListener\("keydown", handlePublishDialogKeydown\)/);
});

test("renderer mirrors native publish dialog dismissal before publishing", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const publishBody = rendererSource.match(
    /async function publishCurrentProject\(\) \{([\s\S]*?)\n\}\n\nfunction openUnpublishConfirmation/
  )?.[1] ?? "";

  assert.match(
    nativeSource,
    /Button\("Publish"\)\s*\{[\s\S]*showPublishConfirm = false[\s\S]*performPublish\(subdomain: pendingSubdomain\)/
  );

  const closeIndex = publishBody.indexOf("state.isPublishDialogOpen = false;");
  const renderIndex = publishBody.indexOf("renderPublishDialog();", closeIndex);
  const requestIndex = publishBody.indexOf("await window.wikiwise.publishSite");

  assert.notEqual(closeIndex, -1);
  assert.notEqual(renderIndex, -1);
  assert.notEqual(requestIndex, -1);
  assert.ok(closeIndex < requestIndex, "publish dialog should close before publish request starts");
  assert.ok(renderIndex < requestIndex, "publish dialog close should render before publish request starts");
  assert.equal(publishBody.indexOf("state.isPublishDialogOpen = false;", requestIndex), -1);
});

test("renderer publish error modal surfaces native publish failure descriptions", () => {
  const nativeSource = readRepository("Sources/Wikiwise/Publisher.swift");
  const coreSource = readRepository("packages/wikiwise-core/src/index.js");
  const rendererSource = read("src/renderer/renderer.js");
  const htmlSource = read("src/renderer/index.html");
  const nativeMessages = [
    "publish.json exists but is malformed. Delete it to start fresh, or fix its contents.",
    "Token doesn't match. Check your publish.json.",
    "That subdomain is already taken. Edit the subdomain in publish.json and try again.",
    "Too many publishes. Try again in a few minutes."
  ];

  for (const message of nativeMessages) {
    assert.match(nativeSource, new RegExp(escapeRegExp(`return "${message}"`)));
    assert.match(coreSource, new RegExp(escapeRegExp(message)));
  }

  assert.match(rendererSource, /state\.publishError = error instanceof Error \? error\.message : String\(error\)/);
  assert.match(rendererSource, /publishErrorMessage\.textContent = state\.publishError \?\? ""/);
  assert.match(htmlSource, /<h2 id="publish-error-title">Publish Error<\/h2>/);
  assert.match(htmlSource, /id="dismiss-publish-error"[\s\S]*>\s*OK\s*<\/button>/);
});

test("renderer markup and styles include publish dialog, status, and unpublish controls", () => {
  const htmlSource = read("src/renderer/index.html");
  const cssSource = read("src/renderer/styles.css");

  for (const id of [
    "publish-wiki",
    "publish-dialog",
    "publish-subdomain",
    "publish-availability",
    "cancel-publish",
    "confirm-publish",
    "unpublish-wiki",
    "publish-result-dialog",
    "publish-result-url",
    "open-publish-result",
    "dismiss-publish-result",
    "publish-error-dialog",
    "publish-error-message",
    "dismiss-publish-error",
    "unpublish-confirm-dialog",
    "cancel-unpublish",
    "confirm-unpublish"
  ]) {
    assert.match(htmlSource, new RegExp(`id="${id}"`));
  }

  assert.match(htmlSource, /Published!/);
  assert.match(htmlSource, /Open in Browser/);
  assert.match(htmlSource, /Publish Error/);
  assert.match(htmlSource, /Unpublish wiki\?/);
  assert.match(htmlSource, /Your local files are not affected/);
  assert.match(cssSource, /\.publish-dialog/);
  assert.match(cssSource, /\.publish-feedback-dialog/);
  assert.match(cssSource, /\.publish-url-row/);
  assert.match(cssSource, /\.publish-availability/);
  assert.match(cssSource, /\.danger-action/);
});

test("renderer mirrors native unpublish confirmation cancel keyboard behavior", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const handlerBody = rendererSource.match(
    /function handleUnpublishConfirmationKeydown\(event\) \{([\s\S]*?)\n\}\n\nasync function confirmUnpublish/
  )?.[1] ?? "";

  assert.match(
    nativeSource,
    /\.alert\("Unpublish wiki\?",[\s\S]*Button\("Cancel", role: \.cancel\)/
  );
  assert.match(rendererSource, /function handleUnpublishConfirmationKeydown\(event\)/);
  assert.match(rendererSource, /event\.key === "Escape"[\s\S]*closeUnpublishConfirmation\(\)/);
  assert.doesNotMatch(handlerBody, /event\.key === "Enter"/);
  assert.doesNotMatch(handlerBody, /confirmUnpublish\(\)/);
  assert.match(
    rendererSource,
    /unpublishConfirmDialog\.addEventListener\("keydown", handleUnpublishConfirmationKeydown\)/
  );
});

test("renderer mirrors native unpublish confirmation action label", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(
    nativeSource,
    /\.alert\("Unpublish wiki\?",[\s\S]*Button\("Unpublish", role: \.destructive\)/
  );
  assert.match(rendererSource, /confirmUnpublishButton\.disabled = state\.isUnpublishing/);
  assert.match(rendererSource, /confirmUnpublishButton\.textContent = "Unpublish"/);
  assert.doesNotMatch(
    rendererSource,
    /confirmUnpublishButton\.textContent = state\.isUnpublishing \? "Unpublishing" : "Unpublish"/
  );
});

test("renderer mirrors native publish dialog copy", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(
    nativeSource,
    /Text\("A publish\.json file will be saved in your project \\u\{2014\} it contains your publish token\. Treat it like a password: if you lose it, you won\\u\{2019\}t be able to update this site\."\)/
  );
  assert.match(
    normalizedHtml,
    /A publish\.json file will be saved in your project — it contains your publish token\. Treat it like a password: if you lose it, you won’t be able to update this site\./
  );
  assert.doesNotMatch(
    normalizedHtml,
    /A publish\.json file will be saved in your project\. It contains your publish token\./
  );

  assert.match(nativeSource, /Button\("Unpublish\\u\{2026\}"\)/);
  assert.match(htmlSource, />\s*Unpublish…\s*<\/button>/);
  assert.match(rendererSource, /unpublishButton\.textContent = "Unpublish…"/);
  assert.doesNotMatch(htmlSource, /Unpublish\.\.\./);
  assert.doesNotMatch(rendererSource, /Unpublish\.\.\./);
  assert.doesNotMatch(
    rendererSource,
    /unpublishButton\.textContent = state\.isUnpublishing \? "Unpublishing" : "Unpublish…"/
  );
});

test("renderer mirrors native publish URL intro font", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const cssSource = read("src/renderer/styles.css");
  const publishUrlIntroBlock = cssBlock(cssSource, ".publish-url-intro");
  const compactSummaryBlock = cssBlock(cssSource, ".compact-summary");

  assert.match(
    nativeSource,
    /Text\("Your wiki will be available at:"\)[\s\S]*\.font\(\.system\(size:\s*13\)\)[\s\S]*\.foregroundStyle\(\.secondary\)/
  );
  assert.match(
    normalizedHtml,
    /<p class="summary compact-summary publish-url-intro">\s*Your wiki will be available at:\s*<\/p>/
  );
  assert.match(publishUrlIntroBlock, /font-size:\s*13px/);
  assert.match(compactSummaryBlock, /font-size:\s*12px/);
  assert.match(
    normalizedHtml,
    /<p class="summary compact-summary publish-token-warning">\s*A publish\.json file will be saved in your project — it contains your publish token/
  );
});

test("renderer mirrors native publish token warning line spacing", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const cssSource = read("src/renderer/styles.css");
  const publishTokenWarningBlock = cssBlock(cssSource, ".publish-token-warning");
  const summaryBlock = cssBlock(cssSource, ".summary");
  const compactSummaryBlock = cssBlock(cssSource, ".compact-summary");

  assert.match(
    nativeSource,
    /Text\("A publish\.json file will be saved in your project \\u\{2014\} it contains your publish token[\s\S]*\.font\(\.system\(size:\s*12\)\)[\s\S]*\.foregroundStyle\(\.secondary\)[\s\S]*\.lineSpacing\(2\)/
  );
  assert.match(
    normalizedHtml,
    /<p class="summary compact-summary publish-token-warning">\s*A publish\.json file will be saved in your project — it contains your publish token/
  );
  assert.match(publishTokenWarningBlock, /line-height:\s*calc\(1\.2em \+ 2px\)/);
  assert.match(compactSummaryBlock, /font-size:\s*12px/);
  assert.match(summaryBlock, /line-height:\s*1\.6/);
});

test("renderer mirrors native publish URL row layout", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const cssSource = read("src/renderer/styles.css");
  const publishUrlRowBlock = cssBlock(cssSource, ".publish-url-row");

  assert.match(
    nativeSource,
    /HStack\(spacing:\s*0\)[\s\S]*Text\("https:\/\/"\)[\s\S]*TextField\("subdomain"[\s\S]*\.frame\(maxWidth:\s*200\)[\s\S]*Text\("\.wiki-wise\.com"\)[\s\S]*Spacer\(\)[\s\S]*\.frame\(width:\s*16,\s*height:\s*16\)/
  );

  assert.match(
    cssSource,
    /grid-template-columns:\s*auto minmax\(80px,\s*200px\) auto minmax\(0,\s*1fr\) 16px/
  );
  assert.doesNotMatch(cssSource, /grid-template-columns:\s*auto minmax\(80px,\s*1fr\) auto/);
  assert.match(publishUrlRowBlock, /gap:\s*0/);
  assert.match(cssSource, /max-width:\s*200px/);
  assert.match(cssSource, /grid-column:\s*5/);
});

test("renderer mirrors native publish URL row chrome", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const cssSource = read("src/renderer/styles.css");
  const publishUrlRowBlock = cssBlock(cssSource, ".publish-url-row");

  assert.match(
    nativeSource,
    /\.padding\(8\)[\s\S]*\.background\(RoundedRectangle\(cornerRadius:\s*4\)\.fill\(Color\.sidebarBg\)\)/
  );
  assert.match(publishUrlRowBlock, /border:\s*0/);
  assert.match(publishUrlRowBlock, /border-radius:\s*4px/);
  assert.match(publishUrlRowBlock, /background:\s*var\(--color-sidebar-bg\)/);
  assert.doesNotMatch(publishUrlRowBlock, /border:\s*1px solid/);
  assert.doesNotMatch(publishUrlRowBlock, /border-radius:\s*6px/);
});

test("renderer mirrors native publish URL row font", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const cssSource = read("src/renderer/styles.css");
  const publishUrlRowBlock = cssBlock(cssSource, ".publish-url-row");
  const publishSubdomainBlock = cssBlock(cssSource, ".publish-subdomain");
  const availabilityIndicatorBlock = cssBlock(cssSource, ".publish-availability-indicator");

  assert.match(
    nativeSource,
    /Text\("https:\/\/"\)[\s\S]*\.font\(\.system\(size:\s*13,\s*design:\s*\.monospaced\)\)[\s\S]*TextField\("subdomain"[\s\S]*\.font\(\.system\(size:\s*13,\s*design:\s*\.monospaced\)\)[\s\S]*Text\("\.wiki-wise\.com"\)[\s\S]*\.font\(\.system\(size:\s*13,\s*design:\s*\.monospaced\)\)/
  );
  assert.match(publishUrlRowBlock, /font-family:\s*ui-monospace,\s*"SFMono-Regular",\s*Menlo,\s*monospace/);
  assert.match(publishUrlRowBlock, /font-size:\s*13px/);
  assert.match(publishSubdomainBlock, /font-family:\s*inherit/);
  assert.match(publishSubdomainBlock, /font-size:\s*inherit/);
  assert.match(availabilityIndicatorBlock, /width:\s*16px/);
  assert.match(availabilityIndicatorBlock, /height:\s*16px/);
});

test("renderer mirrors native publish URL row color hierarchy", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const cssSource = read("src/renderer/styles.css");
  const nativePublishSheet = nativeSource.match(
    /private var publishConfirmSheet:[\s\S]*?\n    private var canPublish/
  )?.[0] ?? "";
  const nativeSubdomainField = nativePublishSheet.match(
    /TextField\("subdomain"[\s\S]*?\.frame\(maxWidth:\s*200\)/
  )?.[0] ?? "";
  const publishUrlAffixBlock = cssBlock(cssSource, ".publish-url-affix");
  const publishUrlRowBlock = cssBlock(cssSource, ".publish-url-row");
  const publishSubdomainBlock = cssBlock(cssSource, ".publish-subdomain");
  const availabilityIndicatorBlock = cssBlock(cssSource, ".publish-availability-indicator");

  assert.match(
    nativePublishSheet,
    /Text\("https:\/\/"\)[\s\S]*\.foregroundStyle\(\.secondary\)[\s\S]*TextField\("subdomain"/
  );
  assert.doesNotMatch(nativeSubdomainField, /foregroundStyle\(\.secondary\)/);
  assert.match(
    nativePublishSheet,
    /Text\("\.wiki-wise\.com"\)[\s\S]*\.foregroundStyle\(\.secondary\)/
  );

  assert.match(normalizedHtml, /<span class="publish-url-affix">https:\/\/<\/span>/);
  assert.match(normalizedHtml, /<span class="publish-url-affix">\.wiki-wise\.com<\/span>/);
  assert.match(publishUrlAffixBlock, /color:\s*var\(--color-muted-text\)/);
  assert.match(publishSubdomainBlock, /color:\s*var\(--color-tab-active\)/);
  assert.doesNotMatch(publishUrlRowBlock, /color:\s*var\(--color-linked-text\)/);
  assert.match(publishUrlRowBlock, /grid-template-columns:\s*auto minmax\(80px,\s*200px\) auto minmax\(0,\s*1fr\) 16px/);
  assert.match(publishUrlRowBlock, /font-size:\s*13px/);
  assert.match(availabilityIndicatorBlock, /width:\s*16px/);
  assert.match(availabilityIndicatorBlock, /height:\s*16px/);
});

test("renderer mirrors native publish subdomain plain input padding", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const cssSource = read("src/renderer/styles.css");
  const publishUrlRowBlock = cssBlock(cssSource, ".publish-url-row");
  const publishSubdomainBlock = cssBlock(cssSource, ".publish-subdomain");

  assert.match(
    nativeSource,
    /TextField\("subdomain",\s*text:\s*\$pendingSubdomain\)[\s\S]*\.textFieldStyle\(\.plain\)/
  );
  assert.match(publishUrlRowBlock, /padding:\s*8px/);
  assert.match(publishSubdomainBlock, /padding:\s*0/);
  assert.match(publishSubdomainBlock, /border:\s*0/);
  assert.match(publishSubdomainBlock, /background:\s*transparent/);
});

test("renderer mirrors native publish URL display without duplicate detail row", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const rendererSource = read("src/renderer/renderer.js");
  const nativePublishSheet = nativeSource.match(
    /private var publishConfirmSheet:[\s\S]*?\n    private var canPublish/
  )?.[0] ?? "";

  assert.match(
    nativePublishSheet,
    /HStack\(spacing:\s*0\)[\s\S]*Text\("https:\/\/"\)[\s\S]*TextField\("subdomain"[\s\S]*Text\("\.wiki-wise\.com"\)/
  );
  assert.doesNotMatch(htmlSource, /id="publish-url"/);
  assert.doesNotMatch(rendererSource, /querySelector\("#publish-url"\)/);
  assert.doesNotMatch(rendererSource, /publishUrl\.textContent/);
  assert.match(htmlSource, /id="publish-result-url"/);
});

test("renderer mirrors native publish dialog panel padding", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const cssSource = read("src/renderer/styles.css");
  const publishDialogBlock = cssBlock(cssSource, ".publish-dialog");
  const modalPanelBlock = cssBlock(cssSource, ".modal-panel");

  assert.match(
    nativeSource,
    /private var publishConfirmSheet:[\s\S]*\.padding\(24\)[\s\S]*\.frame\(width:\s*480\)/
  );
  assert.match(publishDialogBlock, /width:\s*min\(480px,\s*100%\)/);
  assert.match(publishDialogBlock, /padding:\s*24px/);
  assert.match(modalPanelBlock, /padding:\s*22px/);
});

test("renderer mirrors native publish dialog content spacing", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const cssSource = read("src/renderer/styles.css");
  const publishDialogBlock = cssBlock(cssSource, ".publish-dialog");
  const modalPanelBlock = cssBlock(cssSource, ".modal-panel");

  assert.match(
    nativeSource,
    /private var publishConfirmSheet:[\s\S]*VStack\(alignment:\s*\.leading,\s*spacing:\s*16\)/
  );
  assert.match(publishDialogBlock, /gap:\s*16px/);
  assert.match(modalPanelBlock, /gap:\s*12px/);
});

test("renderer mirrors native publish dialog title typography", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const cssSource = read("src/renderer/styles.css");
  const publishTitleBlock = cssBlock(cssSource, ".publish-dialog h2");

  assert.match(
    nativeSource,
    /Text\("Publish your wiki"\)[\s\S]*\.font\(\.system\(size:\s*18,\s*weight:\s*\.medium,\s*design:\s*\.serif\)\)/
  );
  assert.match(publishTitleBlock, /font-family:\s*Georgia,\s*serif/);
  assert.match(publishTitleBlock, /font-size:\s*18px/);
  assert.match(publishTitleBlock, /font-weight:\s*500/);
});

test("renderer mirrors native publish dialog title spacing without extra margin", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const cssSource = read("src/renderer/styles.css");
  const publishDialogBlock = cssBlock(cssSource, ".publish-dialog");
  const publishTitleBlock = cssBlock(cssSource, ".publish-dialog h2");
  const modalTitleBlock = cssBlock(cssSource, ".modal-panel h2");

  assert.match(
    nativeSource,
    /private var publishConfirmSheet:[\s\S]*VStack\(alignment:\s*\.leading,\s*spacing:\s*16\)/
  );
  assert.match(publishDialogBlock, /gap:\s*16px/);
  assert.match(publishTitleBlock, /margin-bottom:\s*0/);
  assert.match(modalTitleBlock, /margin-bottom:\s*4px/);
});

test("renderer mirrors native publish dialog actions spacing", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const cssSource = read("src/renderer/styles.css");
  const publishDialogBlock = cssBlock(cssSource, ".publish-dialog");
  const publishActionsBlock = cssBlock(cssSource, ".publish-actions");
  const modalActionsBlock = cssBlock(cssSource, ".modal-actions");

  assert.match(
    nativeSource,
    /VStack\(alignment:\s*\.leading,\s*spacing:\s*16\)[\s\S]*Text\("A publish\.json file will be saved in your project \\u\{2014\} it contains your publish token[\s\S]*\.lineSpacing\(2\)[\s\S]*HStack \{[\s\S]*Button\("Cancel"\)[\s\S]*Button\("Publish"\)/
  );
  assert.match(
    normalizedHtml,
    /<div class="modal-actions publish-actions">[\s\S]*id="unpublish-wiki"[\s\S]*id="cancel-publish"[\s\S]*id="confirm-publish"/
  );
  assert.match(publishDialogBlock, /gap:\s*16px/);
  assert.match(publishActionsBlock, /margin-top:\s*0/);
  assert.match(modalActionsBlock, /margin-top:\s*8px/);
});

test("renderer mirrors native publish result copy", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(
    nativeSource,
    /Your wiki is live at \\\(result\.url\.absoluteString\)\\n\\nA publish\.json file has been saved to your project\. Keep it safe \\u\{2014\} it\\u\{2019\}s your key to update this site\./
  );
  assert.match(nativeSource, /Updated \\\(result\.url\.absoluteString\)/);

  assert.match(rendererSource, /function publishResultMessageText\(result\)/);
  assert.match(
    rendererSource,
    /Your wiki is live at \$\{result\.url\}\\n\\nA publish\.json file has been saved to your project\. Keep it safe — it’s your key to update this site\./
  );
  assert.match(rendererSource, /Updated \$\{result\.url\}/);
  assert.match(rendererSource, /publishResultMessage\.textContent = publishResultMessageText\(result\)/);
  assert.match(rendererSource, /publishResultUrl\.hidden = true/);
  assert.match(rendererSource, /publishResultUrl\.textContent = ""/);
  assert.doesNotMatch(rendererSource, /Your wiki is live at:/);
  assert.doesNotMatch(rendererSource, /Updated:/);
});

test("renderer mirrors native publish availability hint copy", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(
    nativeSource,
    /case \.taken:\s*Text\("This name is already taken\. Try another\."\)/
  );
  assert.match(
    nativeSource,
    /case \.invalid:\s*Text\("3\\u\{2013\}48 characters, letters, numbers, and hyphens only\."\)/
  );
  assert.match(nativeSource, /case \.owned:\s*Text\("You already own this name\."\)/);
  assert.match(
    nativeSource,
    /default:\s*Text\("Anyone with this link can view your wiki\."\)/
  );

  assert.match(rendererSource, /case "taken":\s*return "This name is already taken\. Try another\."/);
  assert.match(
    rendererSource,
    /case "invalid":\s*return "3–48 characters, letters, numbers, and hyphens only\."/
  );
  assert.match(rendererSource, /case "owned":\s*return "You already own this name\."/);
  assert.match(
    rendererSource,
    /case "available":\s*return "Anyone with this link can view your wiki\."/
  );
  assert.match(
    rendererSource,
    /case "checking":\s*return "Anyone with this link can view your wiki\."/
  );
  assert.match(rendererSource, /default:\s*return "Anyone with this link can view your wiki\."/);
  assert.doesNotMatch(rendererSource, /return "Available"/);
  assert.doesNotMatch(rendererSource, /return "Checking\.\.\."/);
  assert.doesNotMatch(rendererSource, /return "3-48 characters, letters, numbers, and hyphens only\."/);
  assert.match(rendererSource, /\["available", "owned"\]\.includes\(state\.publishAvailability\)/);
});

test("renderer mirrors native publish availability hint colors", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const cssSource = read("src/renderer/styles.css");
  const nativePublishSheet = nativeSource.match(
    /private var publishConfirmSheet:[\s\S]*?\n    private var canPublish/
  )?.[0] ?? "";
  const publishAvailabilityBlock = cssBlock(cssSource, ".publish-availability");
  const ownedHintBlock = cssBlock(cssSource, '.publish-availability[data-state="owned"]');
  const takenHintBlock = cssBlock(cssSource, '.publish-availability[data-state="taken"]');
  const invalidHintBlock = cssBlock(cssSource, '.publish-availability[data-state="invalid"]');
  const ownedIndicatorBlock = cssBlock(cssSource, '.publish-availability-indicator[data-state="owned"]');
  const invalidIndicatorBlock = cssBlock(cssSource, '.publish-availability-indicator[data-state="invalid"]');

  assert.match(
    nativePublishSheet,
    /case \.taken:\s*Text\("This name is already taken\. Try another\."\)[\s\S]*?\.foregroundStyle\(\.red\)/
  );
  assert.match(
    nativePublishSheet,
    /case \.invalid:\s*Text\("3\\u\{2013\}48 characters, letters, numbers, and hyphens only\."\)[\s\S]*?\.foregroundStyle\(\.orange\)/
  );
  assert.match(
    nativePublishSheet,
    /case \.owned:\s*Text\("You already own this name\."\)[\s\S]*?\.foregroundStyle\(\.blue\)/
  );
  assert.match(
    nativePublishSheet,
    /default:\s*Text\("Anyone with this link can view your wiki\."\)[\s\S]*?\.foregroundStyle\(\.secondary\)/
  );

  assert.match(publishAvailabilityBlock, /color:\s*var\(--color-muted-text\)/);
  assert.doesNotMatch(cssSource, /\.publish-availability\[data-state="available"\]\s*\{/);
  assert.doesNotMatch(cssSource, /\.publish-availability\[data-state="available"\],/);
  assert.match(ownedHintBlock, /color:\s*#2d66b3/);
  assert.match(takenHintBlock, /color:\s*#b23a3a/);
  assert.match(invalidHintBlock, /color:\s*#b66b00/);
  assert.match(ownedIndicatorBlock, /color:\s*#2d66b3/);
  assert.match(invalidIndicatorBlock, /color:\s*#b66b00/);
});

test("renderer mirrors native publish subdomain sanitizer length behavior", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const nativePublishSheet = nativeSource.match(
    /private var publishConfirmSheet:[\s\S]*?\n    private var canPublish/
  )?.[0] ?? "";
  const sanitizeBody = rendererSource.match(
    /function sanitizePublishSubdomain\(value\) \{([\s\S]*?)\n\}/
  )?.[1] ?? "";

  assert.match(
    nativePublishSheet,
    /let sanitized = newValue\.lowercased\(\)\s*\.filter \{ \$0\.isLetter \|\| \$0\.isNumber \|\| \$0 == "-" \}/
  );
  assert.doesNotMatch(nativePublishSheet, /prefix\(48\)|count\s*>\s*48/);
  assert.match(sanitizeBody, /String\(value\)\.toLowerCase\(\)\.replace\(/);
  assert.doesNotMatch(sanitizeBody, /\.slice\(0,\s*48\)|\.substring\(0,\s*48\)|\.substr\(0,\s*48\)/);
});

test("renderer mirrors native publish subdomain sanitizer character behavior", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const nativePublishSheet = nativeSource.match(
    /private var publishConfirmSheet:[\s\S]*?\n    private var canPublish/
  )?.[0] ?? "";
  const sanitizeBody = rendererSource.match(
    /function sanitizePublishSubdomain\(value\) \{([\s\S]*?)\n\}/
  )?.[1] ?? "";

  assert.match(nativePublishSheet, /\$0\.isLetter \|\| \$0\.isNumber \|\| \$0 == "-"/);
  assert.match(sanitizeBody, /replace\(\/\[\^\\p\{L\}\\p\{N\}-\]\/gu,\s*""\)/);
  assert.doesNotMatch(sanitizeBody, /\[\^a-z0-9-\]/);
});

test("renderer mirrors native publish subdomain character count behavior", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const rendererSource = read("src/renderer/renderer.js");
  const scheduleBody = rendererSource.match(
    /function scheduleAvailabilityCheck\(\) \{([\s\S]*?)\n\}\n\nasync function checkPublishAvailability/
  )?.[1] ?? "";

  assert.match(nativeSource, /guard subdomain\.count >= 3 else/);
  assert.match(rendererSource, /function publishSubdomainCharacterCount\(value\)/);
  assert.match(rendererSource, /Array\.from\(value\)\.length/);
  assert.match(scheduleBody, /publishSubdomainCharacterCount\(subdomain\)\s*<\s*3/);
  assert.doesNotMatch(scheduleBody, /subdomain\.length\s*<\s*3/);
});

test("renderer inherits native random publish subdomain Unicode prefix behavior from core", () => {
  const nativeSource = readRepository("Sources/Wikiwise/Publisher.swift");
  const coreSource = readRepository("packages/wikiwise-core/src/index.js");
  const nativeRandomSubdomain = nativeSource.match(
    /static func randomSubdomain\(wikiName: String\? = nil\) -> String \{[\s\S]*?\n    \}/
  )?.[0] ?? "";
  const coreRandomSubdomain = coreSource.match(
    /export function randomPublishSubdomain\(wikiName = ""\) \{[\s\S]*?\n\}/
  )?.[0] ?? "";

  assert.match(nativeRandomSubdomain, /\.filter \{ \$0\.isLetter \|\| \$0\.isNumber \|\| \$0 == "-" \}/);
  assert.match(nativeRandomSubdomain, /\.prefix\(20\)/);
  assert.match(coreRandomSubdomain, /replace\(\/\[\^\\p\{L\}\\p\{N\}-\]\/gu,\s*""\)/);
  assert.match(coreRandomSubdomain, /Array\.from\(sanitized\)\s*\.slice\(0,\s*20\)\s*\.join\(""\)/);
  assert.doesNotMatch(
    coreRandomSubdomain,
    /replace\(\/\[\^\\p\{L\}\\p\{N\}-\]\/gu,\s*""\)\s*\.slice\(0,\s*20\)/
  );
});

test("renderer inherits native first-publish conflict retry subdomain behavior from core", () => {
  const nativeSource = readRepository("Sources/Wikiwise/Publisher.swift");
  const coreSource = readRepository("packages/wikiwise-core/src/index.js");
  const nativePublishStart = nativeSource.indexOf(
    "static func publish(siteFolder: URL, projectRoot: URL, subdomain: String? = nil)"
  );
  const nativePublishEnd = nativeSource.indexOf("    // MARK: - Private", nativePublishStart);
  const nativePublishSource = nativeSource.slice(nativePublishStart, nativePublishEnd);
  const nativeUploadStart = nativeSource.indexOf("private static func upload", nativePublishEnd);
  const nativeRandomStart = nativeSource.indexOf("static func randomSubdomain", nativeUploadStart);
  const nativeUploadSource = nativeSource.slice(nativeUploadStart, nativeRandomStart);
  const corePublishStart = coreSource.indexOf("export async function publishSite");
  const corePublishEnd = coreSource.indexOf("export async function unpublishSite", corePublishStart);
  const corePublishSource = coreSource.slice(corePublishStart, corePublishEnd);
  const uploadStart = coreSource.indexOf("async function uploadPublishFiles");
  const headersStart = coreSource.indexOf("function publishHeaders", uploadStart);
  const uploadSource = coreSource.slice(uploadStart, headersStart);

  assert.notEqual(nativePublishStart, -1);
  assert.notEqual(nativePublishEnd, -1);
  assert.notEqual(nativeUploadStart, -1);
  assert.notEqual(nativeRandomStart, -1);
  assert.notEqual(corePublishStart, -1);
  assert.notEqual(corePublishEnd, -1);
  assert.notEqual(uploadStart, -1);
  assert.notEqual(headersStart, -1);
  assert.match(nativePublishSource, /randomSubdomain\(wikiName:\s*projectRoot\.lastPathComponent\)/);
  assert.match(nativeUploadSource, /case 409:[\s\S]*config\.subdomain = randomSubdomain\(\)/);
  assert.match(
    corePublishSource,
    /const randomSubdomain = options\.randomSubdomain \?\? \(\(wikiName\) => randomPublishSubdomain\(wikiName\)\)/
  );
  assert.match(corePublishSource, /const subdomain = options\.subdomain \?\? randomSubdomain\(path\.basename\(projectRoot\)\)/);
  assert.match(uploadSource, /case 409:[\s\S]*config\.subdomain = randomSubdomain\(\)/);
  assert.doesNotMatch(corePublishSource, /randomPublishSubdomain\(path\.basename\(projectRoot\)\)/);
});

test("renderer mirrors native publish availability inline indicator", () => {
  const nativeSource = readRepository("Sources/Wikiwise/ContentView.swift");
  const htmlSource = read("src/renderer/index.html");
  const rendererSource = read("src/renderer/renderer.js");
  const cssSource = read("src/renderer/styles.css");

  assert.match(nativeSource, /ProgressView\(\)[\s\S]*\.controlSize\(\.small\)/);
  assert.match(nativeSource, /Image\(systemName: "checkmark\.circle\.fill"\)[\s\S]*\.foregroundStyle\(\.green\)/);
  assert.match(nativeSource, /Image\(systemName: "checkmark\.circle\.fill"\)[\s\S]*\.foregroundStyle\(\.blue\)/);
  assert.match(nativeSource, /Image\(systemName: "xmark\.circle\.fill"\)[\s\S]*\.foregroundStyle\(\.red\)/);
  assert.match(nativeSource, /Image\(systemName: "exclamationmark\.circle\.fill"\)[\s\S]*\.foregroundStyle\(\.orange\)/);
  assert.match(nativeSource, /\.frame\(width:\s*16,\s*height:\s*16\)/);

  assert.match(htmlSource, /id="publish-availability-indicator"/);
  assert.match(rendererSource, /const publishAvailabilityIndicator = document\.querySelector\("#publish-availability-indicator"\)/);
  assert.match(rendererSource, /publishAvailabilityIndicator\.dataset\.state = state\.publishAvailability/);
  assert.match(rendererSource, /publishAvailabilityIndicator\.textContent = availabilityIndicatorText\(state\.publishAvailability\)/);
  assert.match(rendererSource, /function availabilityIndicatorText\(availability\)/);
  assert.match(rendererSource, /case "checking":\s*return ""/);
  assert.doesNotMatch(rendererSource, /case "checking":\s*return "…"/);
  assert.match(rendererSource, /case "available":\s*return "✓"/);
  assert.match(rendererSource, /case "owned":\s*return "✓"/);
  assert.match(rendererSource, /case "taken":\s*return "×"/);
  assert.match(rendererSource, /case "invalid":\s*return "!"/);

  assert.match(cssSource, /\.publish-availability-indicator/);
  assert.match(cssSource, /width:\s*16px/);
  assert.match(cssSource, /height:\s*16px/);
  assert.match(cssSource, /\.publish-availability-indicator\[data-state="checking"\]/);
  assert.match(cssSource, /\.publish-availability-indicator\[data-state="checking"\]::before/);
  assert.match(cssSource, /animation:\s*publish-availability-spin/);
  assert.match(cssSource, /@keyframes publish-availability-spin/);
  assert.match(cssSource, /\.publish-availability-indicator\[data-state="available"\]/);
  assert.match(cssSource, /\.publish-availability-indicator\[data-state="owned"\]/);
  assert.match(cssSource, /\.publish-availability-indicator\[data-state="taken"\]/);
  assert.match(cssSource, /\.publish-availability-indicator\[data-state="invalid"\]/);
});
