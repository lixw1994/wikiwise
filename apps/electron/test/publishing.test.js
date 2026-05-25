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
  assert.match(rendererSource, /publishButton\.textContent = publishBusy \? "PUBLISHING…" : "PUBLISH ↑"/);
  assert.match(rendererSource, /confirmPublishButton\.textContent = "Publish"/);
  assert.doesNotMatch(rendererSource, /confirmPublishButton\.textContent = state\.isPublishing/);
  assert.doesNotMatch(rendererSource, /"Publishing"/);
  assert.doesNotMatch(rendererSource, /PUBLISHING\.\.\./);
  assert.doesNotMatch(rendererSource, /state\.publishConfig\?\.published\s*\?\s*"Update"\s*:\s*"Publish"/);
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
  assert.match(rendererSource, /publishButton\.disabled = !state\.currentProject \|\| publishBusy/);
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

test("renderer markup and styles include publish dialog, status, and unpublish controls", () => {
  const htmlSource = read("src/renderer/index.html");
  const cssSource = read("src/renderer/styles.css");

  for (const id of [
    "publish-wiki",
    "publish-dialog",
    "publish-subdomain",
    "publish-url",
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
  assert.match(rendererSource, /state\.isUnpublishing \? "Unpublishing" : "Unpublish…"/);
  assert.doesNotMatch(htmlSource, /Unpublish\.\.\./);
  assert.doesNotMatch(rendererSource, /Unpublish\.\.\./);
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
