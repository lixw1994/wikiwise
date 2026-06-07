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

test("main process exposes Cloudflare Hub publishing IPC through core helper", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /publishCloudflareHubSite/);
  assert.match(mainSource, /function publishCloudflareHubProject\(payload\)/);
  assert.match(mainSource, /endpoint:\s*"https:\/\/hub-wiki\.flybullet\.net"/);
  assert.match(mainSource, /url:\s*`https:\/\/\$\{suggestedSlug\}-wiki\.flybullet\.net`/);
  assert.match(mainSource, /wikiwise:publishCloudflareHubSite/);
  assert.match(mainSource, /return publishCloudflareHubSite\(/);
  assert.match(mainSource, /hubEndpoint: payload\.hubEndpoint/);
  assert.match(mainSource, /publishToken: payload\.publishToken/);
  assert.match(mainSource, /visibility: payload\.visibility/);
  assert.match(mainSource, /authRealm: payload\.authRealm/);
  assert.match(mainSource, /policy: payload\.commentPolicy/);
});

test("main process returns target-aware publish config shapes", () => {
  const mainSource = read("src/main/main.js");
  const getPublishConfigStart = mainSource.indexOf("function getPublishConfig(payload)");
  const checkAvailabilityStart = mainSource.indexOf("async function checkProjectPublishAvailability", getPublishConfigStart);
  const getPublishConfigSource = mainSource.slice(getPublishConfigStart, checkAvailabilityStart);

  assert.notEqual(getPublishConfigStart, -1);
  assert.notEqual(checkAvailabilityStart, -1);
  assert.match(getPublishConfigSource, /target:\s*"official"/);
  assert.match(getPublishConfigSource, /config\.target === "cloudflare-hub"/);
  assert.match(getPublishConfigSource, /target:\s*"cloudflare-hub"/);
  assert.match(getPublishConfigSource, /hub:\s*\{[\s\S]*endpoint:\s*config\.hub\.endpoint/);
  assert.match(getPublishConfigSource, /visibility:\s*config\.hub\.visibility/);
  assert.match(getPublishConfigSource, /authRealm:\s*config\.hub\.authRealm/);
  assert.match(getPublishConfigSource, /commentPolicy:\s*config\.hub\.comments\.policy/);
});

test("main process mirrors native publish config refresh fallback", () => {
  const mainSource = read("src/main/main.js");
  const getPublishConfigSource =
    mainSource.match(/function getPublishConfig\(payload\) \{[\s\S]*?\n\}/)?.[0] ?? "";
  const publishProjectSource =
    mainSource.match(/async function publishProject\(payload\) \{[\s\S]*?\n\}/)?.[0] ?? "";
  const unpublishProjectSource =
    mainSource.match(/async function unpublishProject\(payload\) \{[\s\S]*?\n\}/)?.[0] ?? "";


  assert.notEqual(getPublishConfigSource, "");
  assert.match(getPublishConfigSource, /try\s*\{[\s\S]*loadPublishConfig\(projectRoot\)/);
  assert.match(getPublishConfigSource, /catch \(error\) \{[\s\S]*error\?\.code === "corrupt_config"/);
  assert.match(getPublishConfigSource, /return unpublishedPublishConfig\(projectRoot\)/);
  assert.match(getPublishConfigSource, /const suggestedSubdomain = randomPublishSubdomain\(path\.basename\(projectRoot\)\)/);
  assert.doesNotMatch(getPublishConfigSource, /throw error;\s*\}\s*$/);

  assert.notEqual(publishProjectSource, "");
  assert.match(publishProjectSource, /return publishSite\(/);
  assert.doesNotMatch(publishProjectSource, /catch \(error\)/);

  assert.notEqual(unpublishProjectSource, "");
  assert.match(unpublishProjectSource, /return unpublishSite\(/);
  assert.doesNotMatch(unpublishProjectSource, /catch \(error\)/);
});

test("preload exposes publishing APIs without renderer filesystem access", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(preloadSource, /getPublishConfig:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:getPublishConfig"/);
  assert.match(
    preloadSource,
    /checkPublishAvailability:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:checkPublishAvailability"/
  );
  assert.match(preloadSource, /publishSite:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:publishSite"/);
  assert.match(
    preloadSource,
    /publishCloudflareHubSite:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:publishCloudflareHubSite"/
  );
  assert.match(preloadSource, /unpublishSite:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:unpublishSite"/);
});

test("renderer contains native publishing state and project service refresh", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /publishConfig/);
  assert.match(rendererSource, /isPublishDialogOpen/);
  assert.match(rendererSource, /publishSubdomain/);
  assert.match(rendererSource, /publishAvailability/);
  assert.match(rendererSource, /publishTarget/);
  assert.match(rendererSource, /publishHubEndpoint/);
  assert.match(rendererSource, /publishHubEndpoint:\s*"https:\/\/hub-wiki\.flybullet\.net"/);
  assert.match(rendererSource, /publishHubToken/);
  assert.match(rendererSource, /publishHubSlug/);
  assert.match(rendererSource, /publishHubVisibility/);
  assert.match(rendererSource, /publishHubAuthRealm/);
  assert.match(rendererSource, /publishHubCommentPolicy/);
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
  assert.match(rendererSource, /wikiwise\.publishCloudflareHubSite/);
  assert.match(rendererSource, /wikiwise\.unpublishSite/);
  assert.match(rendererSource, /wikiwise\.openExternalUrl/);
  assert.doesNotMatch(rendererSource, /window\.confirm/);
});

test("renderer exposes Cloudflare Hub target controls and URL preview", () => {
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const rendererSource = read("src/renderer/renderer.js");

  for (const id of [
    "publish-target-official",
    "publish-target-cloudflare-hub",
    "publish-hub-endpoint",
    "publish-hub-token",
    "publish-hub-slug",
    "publish-hub-visibility",
    "publish-hub-auth-realm",
    "publish-hub-comment-policy",
    "publish-hub-url-preview"
  ]) {
    assert.match(htmlSource, new RegExp(`id="${id}"`));
  }

  assert.match(normalizedHtml, /<option value="public">Public<\/option>/);
  assert.match(normalizedHtml, /<option value="private">Private<\/option>/);
  assert.match(normalizedHtml, /<option value="shared">Shared<\/option>/);
  assert.match(normalizedHtml, /<option value="per-wiki">Per-wiki<\/option>/);
  assert.match(normalizedHtml, /<option value="disabled">Disabled<\/option>/);
  assert.match(normalizedHtml, /<option value="login-required">Login required<\/option>/);
  assert.match(normalizedHtml, /<option value="members-only">Members only<\/option>/);
  assert.match(rendererSource, /function publishHubUrlPreview\(\)/);
  assert.match(rendererSource, /https:\/\/\$\{state\.publishHubSlug\}-wiki\.flybullet\.net/);
});

test("renderer resets Cloudflare Hub draft when project config has no Hub settings", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const applyDraftSource = rendererSource.match(
    /function applyPublishConfigDraft\(config\) \{([\s\S]*?)\n\}\n\nfunction publishHubUrlPreview/
  )?.[1] ?? "";

  assert.notEqual(applyDraftSource, "");
  assert.match(rendererSource, /function defaultPublishHubDraft\(suggestedSlug/);
  assert.match(applyDraftSource, /const hubDraft = config\?\.hub \?\?/);
  assert.match(applyDraftSource, /config\?\.suggestedSubdomain \?\? config\?\.subdomain \?\? state\.publishSubdomain/);
  assert.match(applyDraftSource, /state\.publishHubToken = hubDraft\.publishToken/);
  assert.doesNotMatch(applyDraftSource, /state\.publishHubToken = config\.hub\.publishToken \?\? state\.publishHubToken/);
});

test("renderer routes official and Cloudflare Hub publish requests separately", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const publishBody = rendererSource.match(
    /async function publishCurrentProject\(\) \{([\s\S]*?)\n\}\n\nfunction openUnpublishConfirmation/
  )?.[1] ?? "";

  assert.notEqual(publishBody, "");
  assert.match(publishBody, /state\.publishTarget === "cloudflare-hub"/);
  assert.match(publishBody, /await window\.wikiwise\.publishCloudflareHubSite\(\{/);
  assert.match(publishBody, /hubEndpoint:\s*state\.publishHubEndpoint/);
  assert.match(publishBody, /publishToken:\s*state\.publishHubToken/);
  assert.match(publishBody, /slug:\s*state\.publishHubSlug/);
  assert.match(publishBody, /visibility:\s*state\.publishHubVisibility/);
  assert.match(publishBody, /authRealm:\s*state\.publishHubAuthRealm/);
  assert.match(publishBody, /commentPolicy:\s*state\.publishHubCommentPolicy/);
  assert.match(publishBody, /await window\.wikiwise\.publishSite\(\{/);
  assert.match(publishBody, /subdomain:\s*state\.publishSubdomain/);
});

test("renderer shows Cloudflare Hub publish feedback through existing surface", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /result\.target === "cloudflare-hub"/);
  assert.match(rendererSource, /Your Cloudflare Hub wiki is live at \$\{result\.url\}/);
  assert.match(rendererSource, /Updated \$\{result\.url\}/);
  assert.match(rendererSource, /state\.publishError = error instanceof Error \? error\.message : String\(error\)/);
});

test("renderer mirrors native publish toolbar help text", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /function publishButtonHelpText/);
  assert.match(rendererSource, /Publish wiki to wiki-wise\.com/);
  assert.match(rendererSource, /Last published: \$\{state\.publishConfig\.lastPublishedAt \?\? "never"\}/);
  assert.match(rendererSource, /\$\{state\.publishConfig\.url\}/);
  assert.match(rendererSource, /⌥-click to change URL/);
  assert.match(rendererSource, /publishButton\.title\s*=\s*publishHelpText/);
  assert.match(rendererSource, /publishButton\.setAttribute\("aria-label",\s*publishHelpText\)/);
});

test("renderer mirrors native publish action labels", () => {
  const rendererSource = read("src/renderer/renderer.js");


  assert.match(rendererSource, /const publishBusy = state\.isPublishing \|\| state\.isUnpublishing/);
  assert.match(rendererSource, /publishLabel\.textContent = publishBusy \? "PUBLISHING…" : "PUBLISH ↑"/);
  assert.match(rendererSource, /confirmPublishButton\.textContent = "Publish"/);
  assert.doesNotMatch(rendererSource, /confirmPublishButton\.textContent = state\.isPublishing/);
  assert.doesNotMatch(rendererSource, /"Publishing"/);
  assert.doesNotMatch(rendererSource, /PUBLISHING\.\.\./);
  assert.doesNotMatch(rendererSource, /state\.publishConfig\?\.published\s*\?\s*"Update"\s*:\s*"Publish"/);
});

test("renderer mirrors native publish toolbar button style", () => {
  const cssSource = read("src/renderer/styles.css");
  const publishButtonBlock = cssBlock(cssSource, ".publish-button");

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
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const rendererSource = read("src/renderer/renderer.js");
  const cssSource = read("src/renderer/styles.css");
  const busyIndicatorBlock = cssBlock(cssSource, ".publish-busy-indicator");
  const publishButtonBlock = cssBlock(cssSource, ".publish-button");

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
  const rendererSource = read("src/renderer/renderer.js");
  const confirmUnpublishBody = rendererSource.match(
    /async function confirmUnpublish\(\) \{([\s\S]*?)\n\}\n\nasync function startProjectWatcher/
  )?.[1] ?? "";

  assert.match(rendererSource, /function isProjectFolder\(\)/);
  assert.match(rendererSource, /publishButton\.disabled = !isProjectFolder\(\) \|\| publishBusy/);
  assert.match(confirmUnpublishBody, /state\.isUnpublishing = true;[\s\S]*renderPublishStatus\(\)/);
});

test("renderer mirrors native publish dialog keyboard shortcuts", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /function handlePublishDialogKeydown\(event\)/);
  assert.match(rendererSource, /event\.key === "Escape"[\s\S]*closePublishDialog\(\)/);
  assert.match(rendererSource, /event\.key === "Enter"[\s\S]*confirmPublishButton\.disabled[\s\S]*publishCurrentProject\(\)/);
  assert.match(rendererSource, /publishDialog\.addEventListener\("keydown", handlePublishDialogKeydown\)/);
});

test("renderer mirrors native publish dialog dismissal before publishing", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const publishBody = rendererSource.match(
    /async function publishCurrentProject\(\) \{([\s\S]*?)\n\}\n\nfunction openUnpublishConfirmation/
  )?.[1] ?? "";


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
  const rendererSource = read("src/renderer/renderer.js");
  const handlerBody = rendererSource.match(
    /function handleUnpublishConfirmationKeydown\(event\) \{([\s\S]*?)\n\}\n\nasync function confirmUnpublish/
  )?.[1] ?? "";

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
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /confirmUnpublishButton\.disabled = state\.isUnpublishing/);
  assert.match(rendererSource, /confirmUnpublishButton\.textContent = "Unpublish"/);
  assert.doesNotMatch(
    rendererSource,
    /confirmUnpublishButton\.textContent = state\.isUnpublishing \? "Unpublishing" : "Unpublish"/
  );
});

test("renderer mirrors native unpublish confirmation dismissal before request", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const confirmUnpublishBody =
    rendererSource.match(/async function confirmUnpublish\(\) \{([\s\S]*?)\n\}/)?.[1] ?? "";


  assert.notEqual(confirmUnpublishBody, "");
  const closeIndex = confirmUnpublishBody.indexOf("state.isUnpublishConfirmOpen = false;");
  const renderIndex = confirmUnpublishBody.indexOf("renderPublishFeedback();", closeIndex);
  const requestIndex = confirmUnpublishBody.indexOf("await window.wikiwise.unpublishSite");
  const successIndex = confirmUnpublishBody.indexOf("state.publishConfig = await refreshPublishConfig();");

  assert.notEqual(closeIndex, -1);
  assert.notEqual(renderIndex, -1);
  assert.notEqual(requestIndex, -1);
  assert.notEqual(successIndex, -1);
  assert.ok(closeIndex < requestIndex, "unpublish confirmation should close before preload request starts");
  assert.ok(renderIndex < requestIndex, "unpublish confirmation close should render before preload request starts");
  assert.equal(
    confirmUnpublishBody.indexOf("state.isUnpublishConfirmOpen = false;", requestIndex),
    -1,
    "confirmation dismissal should not be delayed until after successful unpublish"
  );
});

test("renderer mirrors native unpublish success draft reset", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const confirmUnpublishBody =
    rendererSource.match(/async function confirmUnpublish\(\) \{([\s\S]*?)\n\}/)?.[1] ?? "";


  assert.notEqual(confirmUnpublishBody, "");
  assert.match(confirmUnpublishBody, /await window\.wikiwise\.unpublishSite/);
  assert.match(confirmUnpublishBody, /state\.publishConfig = await refreshPublishConfig\(\)/);
  assert.match(confirmUnpublishBody, /state\.publishSubdomain = "";/);
  assert.match(confirmUnpublishBody, /state\.publishAvailability = "unknown";/);
  assert.ok(
    confirmUnpublishBody.indexOf("state.publishSubdomain = \"\";") >
      confirmUnpublishBody.indexOf("await window.wikiwise.unpublishSite"),
    "publish draft reset should only happen after the unpublish request succeeds"
  );
});

test("renderer mirrors native publish dialog copy", () => {
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(
    normalizedHtml,
    /A publish\.json file will be saved in your project — it contains your publish token\. Treat it like a password: if you lose it, you won’t be able to update this site\./
  );
  assert.doesNotMatch(
    normalizedHtml,
    /A publish\.json file will be saved in your project\. It contains your publish token\./
  );

  assert.match(htmlSource, />\s*Unpublish…\s*<\/button>/);
  assert.match(rendererSource, /unpublishButton\.textContent = "Unpublish…"/);
  assert.doesNotMatch(htmlSource, /Unpublish\.\.\./);
  assert.doesNotMatch(rendererSource, /Unpublish\.\.\./);
  assert.doesNotMatch(
    rendererSource,
    /unpublishButton\.textContent = state\.isUnpublishing \? "Unpublishing" : "Unpublish…"/
  );
});

test("renderer preserves first-publish subdomain draft across cancel like native sheet state", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const openPublishDialogBody =
    rendererSource.match(/async function openPublishDialog\(\) \{([\s\S]*?)\n\}\n\nfunction closePublishDialog/)?.[1] ?? "";


  assert.notEqual(openPublishDialogBody, "");
  assert.match(openPublishDialogBody, /let shouldCheckAvailability = false;/);
  assert.match(openPublishDialogBody, /if \(config\?\.published\) \{/);
  assert.match(openPublishDialogBody, /state\.publishSubdomain = config\.subdomain;/);
  assert.match(openPublishDialogBody, /state\.publishAvailability = "owned";/);
  assert.match(openPublishDialogBody, /\} else if \(!state\.publishSubdomain\) \{/);
  assert.match(openPublishDialogBody, /state\.publishSubdomain = config\?\.suggestedSubdomain \?\? "";/);
  assert.match(openPublishDialogBody, /state\.publishAvailability = "unknown";/);
  assert.match(openPublishDialogBody, /shouldCheckAvailability = Boolean\(state\.publishSubdomain\);/);
  assert.doesNotMatch(openPublishDialogBody, /state\.publishSubdomain = config\?\.published \?/);
  assert.doesNotMatch(openPublishDialogBody, /state\.publishAvailability = config\?\.published \?/);
  assert.match(openPublishDialogBody, /if \(shouldCheckAvailability\) \{[\s\S]*scheduleAvailabilityCheck\(\);/);
});

test("renderer mirrors native publish URL intro font", () => {
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const cssSource = read("src/renderer/styles.css");
  const publishUrlIntroBlock = cssBlock(cssSource, ".publish-url-intro");
  const compactSummaryBlock = cssBlock(cssSource, ".compact-summary");

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
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const cssSource = read("src/renderer/styles.css");
  const publishTokenWarningBlock = cssBlock(cssSource, ".publish-token-warning");
  const summaryBlock = cssBlock(cssSource, ".summary");
  const compactSummaryBlock = cssBlock(cssSource, ".compact-summary");

  assert.match(
    normalizedHtml,
    /<p class="summary compact-summary publish-token-warning">\s*A publish\.json file will be saved in your project — it contains your publish token/
  );
  assert.match(publishTokenWarningBlock, /line-height:\s*calc\(1\.2em \+ 2px\)/);
  assert.match(compactSummaryBlock, /font-size:\s*12px/);
  assert.match(summaryBlock, /line-height:\s*1\.6/);
});

test("renderer mirrors native publish URL row layout", () => {
  const cssSource = read("src/renderer/styles.css");
  const publishUrlRowBlock = cssBlock(cssSource, ".publish-url-row");


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
  const cssSource = read("src/renderer/styles.css");
  const publishUrlRowBlock = cssBlock(cssSource, ".publish-url-row");

  assert.match(publishUrlRowBlock, /border:\s*0/);
  assert.match(publishUrlRowBlock, /border-radius:\s*4px/);
  assert.match(publishUrlRowBlock, /background:\s*var\(--color-sidebar-bg\)/);
  assert.doesNotMatch(publishUrlRowBlock, /border:\s*1px solid/);
  assert.doesNotMatch(publishUrlRowBlock, /border-radius:\s*6px/);
});

test("renderer mirrors native publish URL row font", () => {
  const cssSource = read("src/renderer/styles.css");
  const publishUrlRowBlock = cssBlock(cssSource, ".publish-url-row");
  const publishSubdomainBlock = cssBlock(cssSource, ".publish-subdomain");
  const availabilityIndicatorBlock = cssBlock(cssSource, ".publish-availability-indicator");

  assert.match(publishUrlRowBlock, /font-family:\s*ui-monospace,\s*"SFMono-Regular",\s*Menlo,\s*monospace/);
  assert.match(publishUrlRowBlock, /font-size:\s*13px/);
  assert.match(publishSubdomainBlock, /font-family:\s*inherit/);
  assert.match(publishSubdomainBlock, /font-size:\s*inherit/);
  assert.match(availabilityIndicatorBlock, /width:\s*16px/);
  assert.match(availabilityIndicatorBlock, /height:\s*16px/);
});

test("renderer mirrors native publish URL row color hierarchy", () => {
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const cssSource = read("src/renderer/styles.css");
  const publishUrlAffixBlock = cssBlock(cssSource, ".publish-url-affix");
  const publishUrlRowBlock = cssBlock(cssSource, ".publish-url-row");
  const publishSubdomainBlock = cssBlock(cssSource, ".publish-subdomain");
  const availabilityIndicatorBlock = cssBlock(cssSource, ".publish-availability-indicator");


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
  const cssSource = read("src/renderer/styles.css");
  const publishUrlRowBlock = cssBlock(cssSource, ".publish-url-row");
  const publishSubdomainBlock = cssBlock(cssSource, ".publish-subdomain");

  assert.match(publishUrlRowBlock, /padding:\s*8px/);
  assert.match(publishSubdomainBlock, /padding:\s*0/);
  assert.match(publishSubdomainBlock, /border:\s*0/);
  assert.match(publishSubdomainBlock, /background:\s*transparent/);
});

test("renderer mirrors native publish URL display without duplicate detail row", () => {
  const htmlSource = read("src/renderer/index.html");
  const rendererSource = read("src/renderer/renderer.js");

  assert.doesNotMatch(htmlSource, /id="publish-url"/);
  assert.doesNotMatch(rendererSource, /querySelector\("#publish-url"\)/);
  assert.doesNotMatch(rendererSource, /publishUrl\.textContent/);
  assert.match(htmlSource, /id="publish-result-url"/);
});

test("renderer mirrors native publish dialog panel padding", () => {
  const cssSource = read("src/renderer/styles.css");
  const publishDialogBlock = cssBlock(cssSource, ".publish-dialog");
  const modalPanelBlock = cssBlock(cssSource, ".modal-panel");

  assert.match(publishDialogBlock, /width:\s*min\(480px,\s*100%\)/);
  assert.match(publishDialogBlock, /padding:\s*24px/);
  assert.match(modalPanelBlock, /padding:\s*22px/);
});

test("renderer mirrors native publish dialog content spacing", () => {
  const cssSource = read("src/renderer/styles.css");
  const publishDialogBlock = cssBlock(cssSource, ".publish-dialog");
  const modalPanelBlock = cssBlock(cssSource, ".modal-panel");

  assert.match(publishDialogBlock, /gap:\s*16px/);
  assert.match(modalPanelBlock, /gap:\s*12px/);
});

test("renderer mirrors native publish dialog title typography", () => {
  const cssSource = read("src/renderer/styles.css");
  const publishTitleBlock = cssBlock(cssSource, ".publish-dialog h2");

  assert.match(publishTitleBlock, /font-family:\s*Georgia,\s*serif/);
  assert.match(publishTitleBlock, /font-size:\s*18px/);
  assert.match(publishTitleBlock, /font-weight:\s*500/);
});

test("renderer mirrors native publish dialog title spacing without extra margin", () => {
  const cssSource = read("src/renderer/styles.css");
  const publishDialogBlock = cssBlock(cssSource, ".publish-dialog");
  const publishTitleBlock = cssBlock(cssSource, ".publish-dialog h2");
  const modalTitleBlock = cssBlock(cssSource, ".modal-panel h2");

  assert.match(publishDialogBlock, /gap:\s*16px/);
  assert.match(publishTitleBlock, /margin-bottom:\s*0/);
  assert.match(modalTitleBlock, /margin-bottom:\s*4px/);
});

test("renderer mirrors native publish dialog actions spacing", () => {
  const htmlSource = read("src/renderer/index.html");
  const normalizedHtml = normalized(htmlSource);
  const cssSource = read("src/renderer/styles.css");
  const publishDialogBlock = cssBlock(cssSource, ".publish-dialog");
  const publishActionsBlock = cssBlock(cssSource, ".publish-actions");
  const modalActionsBlock = cssBlock(cssSource, ".modal-actions");

  assert.match(
    normalizedHtml,
    /<div class="modal-actions publish-actions">[\s\S]*id="unpublish-wiki"[\s\S]*id="cancel-publish"[\s\S]*id="confirm-publish"/
  );
  assert.match(publishDialogBlock, /gap:\s*16px/);
  assert.match(publishActionsBlock, /margin-top:\s*0/);
  assert.match(modalActionsBlock, /margin-top:\s*8px/);
});

test("renderer mirrors native publish result copy", () => {
  const rendererSource = read("src/renderer/renderer.js");


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
  const rendererSource = read("src/renderer/renderer.js");


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
  const cssSource = read("src/renderer/styles.css");
  const publishAvailabilityBlock = cssBlock(cssSource, ".publish-availability");
  const ownedHintBlock = cssBlock(cssSource, '.publish-availability[data-state="owned"]');
  const takenHintBlock = cssBlock(cssSource, '.publish-availability[data-state="taken"]');
  const invalidHintBlock = cssBlock(cssSource, '.publish-availability[data-state="invalid"]');
  const ownedIndicatorBlock = cssBlock(cssSource, '.publish-availability-indicator[data-state="owned"]');
  const invalidIndicatorBlock = cssBlock(cssSource, '.publish-availability-indicator[data-state="invalid"]');


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
  const rendererSource = read("src/renderer/renderer.js");
  const sanitizeBody = rendererSource.match(
    /function sanitizePublishSubdomain\(value\) \{([\s\S]*?)\n\}/
  )?.[1] ?? "";

  assert.match(sanitizeBody, /String\(value\)\.toLowerCase\(\)\.replace\(/);
  assert.doesNotMatch(sanitizeBody, /\.slice\(0,\s*48\)|\.substring\(0,\s*48\)|\.substr\(0,\s*48\)/);
});

test("renderer mirrors native publish subdomain sanitizer character behavior", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const sanitizeBody = rendererSource.match(
    /function sanitizePublishSubdomain\(value\) \{([\s\S]*?)\n\}/
  )?.[1] ?? "";

  assert.match(sanitizeBody, /replace\(\/\[\^\\p\{L\}\\p\{N\}-\]\/gu,\s*""\)/);
  assert.doesNotMatch(sanitizeBody, /\[\^a-z0-9-\]/);
});

test("renderer mirrors native publish subdomain character count behavior", () => {
  const rendererSource = read("src/renderer/renderer.js");
  const scheduleBody = rendererSource.match(
    /function scheduleAvailabilityCheck\(\) \{([\s\S]*?)\n\}\n\nasync function checkPublishAvailability/
  )?.[1] ?? "";

  assert.match(rendererSource, /function publishSubdomainCharacterCount\(value\)/);
  assert.match(rendererSource, /Array\.from\(value\)\.length/);
  assert.match(scheduleBody, /publishSubdomainCharacterCount\(subdomain\)\s*<\s*3/);
  assert.doesNotMatch(scheduleBody, /subdomain\.length\s*<\s*3/);
});

test("renderer inherits native random publish subdomain Unicode prefix behavior from core", () => {
  const coreSource = readRepository("packages/wikiwise-core/src/index.js");
  const coreRandomSubdomain = coreSource.match(
    /export function randomPublishSubdomain\(wikiName = ""\) \{[\s\S]*?\n\}/
  )?.[0] ?? "";

  assert.match(coreRandomSubdomain, /replace\(\/\[\^\\p\{L\}\\p\{N\}-\]\/gu,\s*""\)/);
  assert.match(coreRandomSubdomain, /Array\.from\(sanitized\)\s*\.slice\(0,\s*20\)\s*\.join\(""\)/);
  assert.doesNotMatch(
    coreRandomSubdomain,
    /replace\(\/\[\^\\p\{L\}\\p\{N\}-\]\/gu,\s*""\)\s*\.slice\(0,\s*20\)/
  );
});

test("renderer inherits native first-publish conflict retry subdomain behavior from core", () => {
  const coreSource = readRepository("packages/wikiwise-core/src/index.js");
  const corePublishStart = coreSource.indexOf("export async function publishSite");
  const corePublishEnd = coreSource.indexOf("export async function unpublishSite", corePublishStart);
  const corePublishSource = coreSource.slice(corePublishStart, corePublishEnd);
  const uploadStart = coreSource.indexOf("async function uploadPublishFiles");
  const headersStart = coreSource.indexOf("function publishHeaders", uploadStart);
  const uploadSource = coreSource.slice(uploadStart, headersStart);

  assert.notEqual(corePublishStart, -1);
  assert.notEqual(corePublishEnd, -1);
  assert.notEqual(uploadStart, -1);
  assert.notEqual(headersStart, -1);
  assert.match(
    corePublishSource,
    /const randomSubdomain = options\.randomSubdomain \?\? \(\(wikiName\) => randomPublishSubdomain\(wikiName\)\)/
  );
  assert.match(corePublishSource, /const subdomain = options\.subdomain \?\? randomSubdomain\(path\.basename\(projectRoot\)\)/);
  assert.match(uploadSource, /case 409:[\s\S]*config\.subdomain = randomSubdomain\(\)/);
  assert.doesNotMatch(corePublishSource, /randomPublishSubdomain\(path\.basename\(projectRoot\)\)/);
});

test("renderer mirrors native publish availability inline indicator", () => {
  const htmlSource = read("src/renderer/index.html");
  const rendererSource = read("src/renderer/renderer.js");
  const cssSource = read("src/renderer/styles.css");


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
