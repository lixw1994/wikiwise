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

function cssBlock(source, selector) {
  const pattern = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]+)\\}`);
  return source.match(pattern)?.[1] ?? "";
}

test("main process exposes document info IPC with project path validation", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /summarizeDocumentInfo/);
  assert.match(mainSource, /wikiwise:getDocumentInfo/);
  assert.match(mainSource, /assertProjectPath/);
});

test("main process owns terminal lifecycle and sends output events", () => {
  const mainSource = read("src/main/main.js");

  assert.match(mainSource, /from "node-pty"/);
  assert.match(mainSource, /terminalSessionsByWebContents/);
  assert.match(mainSource, /wikiwise:startTerminal/);
  assert.match(mainSource, /wikiwise:sendTerminalInput/);
  assert.match(mainSource, /wikiwise:resizeTerminal/);
  assert.match(mainSource, /wikiwise:stopTerminal/);
  assert.match(mainSource, /wikiwise:terminalOutput/);
  assert.match(mainSource, /pty\.spawn/);
  assert.match(mainSource, /\.write\(/);
  assert.match(mainSource, /\.resize\(/);
  assert.match(mainSource, /\.kill\(/);
  assert.match(mainSource, /webContents\.once\("destroyed"/);
  assert.doesNotMatch(mainSource, /from "node:child_process"/);
});

test("preload exposes document info and terminal APIs with output listener cleanup", () => {
  const preloadSource = read("src/preload/preload.cjs");

  assert.match(preloadSource, /getDocumentInfo:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:getDocumentInfo"/);
  assert.match(preloadSource, /startTerminal:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:startTerminal"/);
  assert.match(preloadSource, /sendTerminalInput:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:sendTerminalInput"/);
  assert.match(preloadSource, /resizeTerminal:\s*\(payload\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:resizeTerminal"/);
  assert.match(preloadSource, /stopTerminal:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("wikiwise:stopTerminal"\)/);
  assert.match(preloadSource, /onTerminalOutput:\s*\(callback\)\s*=>/);
  assert.match(preloadSource, /ipcRenderer\.on\("wikiwise:terminalOutput"/);
  assert.match(preloadSource, /removeListener\("wikiwise:terminalOutput"/);
});

test("renderer contains right sidebar info and terminal state", () => {
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(rendererSource, /rightSidebarTab:\s*"terminal"/);
  assert.match(rendererSource, /rightSidebarWidth:\s*360/);
  assert.match(rendererSource, /rightSidebarResizeDrag/);
  assert.match(rendererSource, /RIGHT_SIDEBAR_MIN_WIDTH/);
  assert.match(rendererSource, /clampRightSidebarWidth/);
  assert.match(rendererSource, /startRightSidebarResize/);
  assert.match(rendererSource, /updateRightSidebarResize/);
  assert.match(rendererSource, /endRightSidebarResize/);
  assert.match(rendererSource, /applyRightSidebarWidth/);
  assert.match(rendererSource, /documentInfo/);
  assert.match(rendererSource, /terminalInstance/);
  assert.match(rendererSource, /terminalFitAddon/);
  assert.match(rendererSource, /loadTerminalResources/);
  assert.match(rendererSource, /terminalOutputCleanup/);
  assert.match(rendererSource, /startProjectServices/);
  assert.match(rendererSource, /refreshDocumentInfo/);
  assert.match(rendererSource, /renderInfoTab/);
  assert.match(rendererSource, /renderTerminalTab/);
  assert.match(rendererSource, /fitTerminal/);
  assert.match(rendererSource, /resizeTerminal/);
  assert.match(rendererSource, /onData/);
  assert.match(rendererSource, /\.write\(/);
  assert.match(rendererSource, /startTerminal/);
  assert.match(rendererSource, /sendTerminalInput/);
  assert.match(rendererSource, /wikiwise\.getDocumentInfo/);
  assert.match(rendererSource, /wikiwise\.startTerminal/);
  assert.match(rendererSource, /wikiwise\.sendTerminalInput/);
  assert.match(rendererSource, /wikiwise\.resizeTerminal/);
  assert.match(rendererSource, /onTerminalOutput/);
  assert.doesNotMatch(rendererSource, /terminalTranscript/);
});

test("renderer markup and styles include native right sidebar tabs and terminal surface", () => {
  const htmlSource = read("src/renderer/index.html");
  const cssSource = read("src/renderer/styles.css");

  for (const id of [
    "right-sidebar",
    "right-sidebar-resize-handle",
    "right-tab-info",
    "right-tab-terminal",
    "info-path",
    "info-edited",
    "info-words",
    "info-directions",
    "info-links",
    "terminal-surface"
  ]) {
    assert.match(htmlSource, new RegExp(`id="${id}"`));
  }
  assert.doesNotMatch(htmlSource, /id="terminal-output"/);
  assert.doesNotMatch(htmlSource, /id="terminal-input"/);
  assert.doesNotMatch(htmlSource, /id="terminal-send"/);

  assert.match(cssSource, /\.right-sidebar/);
  assert.match(cssSource, /--right-sidebar-width:\s*360px/);
  assert.match(cssSource, /var\(--right-sidebar-width\)/);
  assert.match(cssSource, /\.right-sidebar-resize-handle/);
  assert.match(cssSource, /cursor:\s*col-resize/);
  assert.match(cssSource, /\.right-tab/);
  assert.match(cssSource, /\.terminal-surface/);
  assert.match(cssSource, /\.xterm/);
  assert.match(cssSource, /\.info-links/);
});

test("renderer hides empty optional info sections like native RightSidebar", () => {
  const nativeSource = readRepository("Sources/Wikiwise/RightSidebar.swift");
  const htmlSource = read("src/renderer/index.html");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(nativeSource, /if let file = selectedFileURL,\s*let directions = parseDirections\(from: file\)/);
  assert.match(nativeSource, /if let file = selectedFileURL,\s*!wikilinkTargets\(in: file\)\.isEmpty/);
  assert.match(htmlSource, /id="info-directions-section"[^>]*hidden/);
  assert.match(htmlSource, /id="info-links-section"[^>]*hidden/);
  assert.match(rendererSource, /const hasDirections = Boolean\(info\?\.directions\)/);
  assert.match(rendererSource, /infoDirectionsSection\.hidden = !hasDirections/);
  assert.match(rendererSource, /const hasLinks = links\.length > 0/);
  assert.match(rendererSource, /infoLinksSection\.hidden = !hasLinks/);
  assert.doesNotMatch(rendererSource, /hasMarkdownFile \? "None"/);
});

test("renderer linked info rows use native north-east marker", () => {
  const nativeSource = readRepository("Sources/Wikiwise/RightSidebar.swift");
  const rendererSource = read("src/renderer/renderer.js");

  assert.match(nativeSource, /Text\("\\u\{2197\} \\\(link\)"\)/);
  assert.match(rendererSource, /item\.textContent = `↗ \$\{target\}`/);
  assert.doesNotMatch(rendererSource, /item\.textContent = `-> \$\{target\}`/);
});

test("renderer directions info uses native gold callout styling", () => {
  const nativeSource = readRepository("Sources/Wikiwise/RightSidebar.swift");
  const htmlSource = read("src/renderer/index.html");
  const cssSource = read("src/renderer/styles.css");
  const directionsBlock = cssBlock(cssSource, ".info-directions-callout");
  const directionsAccentBlock = cssBlock(cssSource, ".info-directions-callout::before");
  const infoLinksBlock = cssBlock(cssSource, ".info-links");

  assert.match(
    nativeSource,
    /Text\(directions\)[\s\S]*\.font\(\.custom\("Fraunces",\s*size:\s*12\)\)[\s\S]*\.italic\(\)[\s\S]*\.foregroundStyle\(Color\.infoValue\)[\s\S]*\.lineSpacing\(3\)[\s\S]*\.padding\(\.vertical,\s*10\)[\s\S]*\.padding\(\.horizontal,\s*12\)[\s\S]*\.background\(Color\.accentGold\.opacity\(0\.12\)\)[\s\S]*Rectangle\(\)[\s\S]*\.fill\(Color\.accentGold\)[\s\S]*\.frame\(width:\s*2\)/
  );
  assert.match(htmlSource, /<p id="info-directions" class="info-directions-callout">Select a markdown file<\/p>/);
  assert.match(directionsBlock, /position:\s*relative/);
  assert.match(directionsBlock, /margin:\s*0/);
  assert.match(directionsBlock, /padding:\s*10px 12px/);
  assert.match(directionsBlock, /background:\s*color-mix\(in srgb,\s*var\(--color-accent-gold\) 12%,\s*transparent\)/);
  assert.match(directionsBlock, /color:\s*var\(--color-info-value\)/);
  assert.match(directionsBlock, /font-family:\s*Georgia,\s*serif/);
  assert.match(directionsBlock, /font-size:\s*12px/);
  assert.match(directionsBlock, /font-style:\s*italic/);
  assert.match(directionsBlock, /line-height:\s*calc\(1\.2em \+ 3px\)/);
  assert.match(directionsAccentBlock, /position:\s*absolute/);
  assert.match(directionsAccentBlock, /left:\s*0/);
  assert.match(directionsAccentBlock, /width:\s*2px/);
  assert.match(directionsAccentBlock, /background:\s*var\(--color-accent-gold\)/);
  assert.doesNotMatch(infoLinksBlock, /background:\s*color-mix/);
  assert.doesNotMatch(infoLinksBlock, /font-style:\s*italic/);
});

test("renderer info metadata mirrors native about document section", () => {
  const nativeSource = readRepository("Sources/Wikiwise/RightSidebar.swift");
  const htmlSource = read("src/renderer/index.html");
  const rendererSource = read("src/renderer/renderer.js");
  const cssSource = read("src/renderer/styles.css");
  const infoAboutSectionBlock = cssBlock(cssSource, ".info-about-section");
  const infoListBlock = cssBlock(cssSource, ".info-list");
  const infoRowBlock = cssBlock(cssSource, ".info-row");
  const infoRowLabelBlock = cssBlock(cssSource, ".info-row dt");
  const infoValueBlock = cssBlock(cssSource, ".info-value");
  const infoSectionHeadingBlock = cssBlock(cssSource, ".info-section h3");

  assert.match(nativeSource, /if let file = selectedFileURL \{\s*infoSection\("ABOUT THIS DOCUMENT"\)/);
  assert.match(
    nativeSource,
    /infoSection\("ABOUT THIS DOCUMENT"\)[\s\S]*VStack\(alignment:\s*\.leading,\s*spacing:\s*6\)[\s\S]*infoRow\("PATH"[\s\S]*infoRow\("EDITED"[\s\S]*infoRow\("WORDS"/
  );
  assert.match(
    nativeSource,
    /private func infoSection[\s\S]*VStack\(alignment:\s*\.leading,\s*spacing:\s*8\)[\s\S]*sectionHeader\(title\)/
  );
  assert.match(
    nativeSource,
    /private func sectionHeader[\s\S]*\.font\(\.custom\("JetBrains Mono",\s*size:\s*9\)\)[\s\S]*\.tracking\(1\.6\)[\s\S]*\.textCase\(\.uppercase\)[\s\S]*\.foregroundStyle\(Color\.sidebarHeader\)/
  );
  assert.match(
    nativeSource,
    /private func infoRow[\s\S]*HStack \{[\s\S]*\.font\(\.custom\("JetBrains Mono",\s*size:\s*10\)\)[\s\S]*Spacer\(\)[\s\S]*\.font\(\.custom\("Fraunces",\s*size:\s*12\)\)/
  );

  assert.match(htmlSource, /id="info-about-section" class="info-section info-about-section" hidden/);
  assert.match(htmlSource, /<h3>ABOUT THIS DOCUMENT<\/h3>[\s\S]*<dl class="info-list">/);
  assert.match(htmlSource, /<div class="info-row">[\s\S]*<dt>PATH<\/dt>[\s\S]*<dd id="info-path" class="info-value"><\/dd>/);
  assert.doesNotMatch(htmlSource, /id="info-path">No document<\/dd>/);
  assert.match(rendererSource, /const infoAboutSection = document\.querySelector\("#info-about-section"\)/);
  assert.match(rendererSource, /const hasDocument = Boolean\(file\)/);
  assert.match(rendererSource, /infoAboutSection\.hidden = !hasDocument/);
  assert.match(rendererSource, /infoPath\.textContent = hasDocument \? \(info\?\.name \?\? file\.name\) : ""/);
  assert.match(rendererSource, /infoEdited\.textContent = hasDocument && info\?\.modifiedAt \? formatEditedTime\(info\.modifiedAt\) : ""/);
  assert.match(rendererSource, /infoWords\.textContent = hasDocument && info \? String\(info\.wordCount\) : ""/);
  assert.match(infoAboutSectionBlock, /gap:\s*8px/);
  assert.match(infoListBlock, /gap:\s*6px/);
  assert.match(infoListBlock, /margin:\s*0 0 24px/);
  assert.match(infoRowBlock, /display:\s*flex/);
  assert.match(infoRowBlock, /justify-content:\s*space-between/);
  assert.match(infoRowBlock, /gap:\s*12px/);
  assert.match(infoRowLabelBlock, /font-size:\s*10px/);
  assert.match(infoRowLabelBlock, /font-weight:\s*400/);
  assert.match(infoRowLabelBlock, /color:\s*var\(--color-sidebar-header\)/);
  assert.match(infoValueBlock, /font-family:\s*Georgia,\s*serif/);
  assert.match(infoValueBlock, /font-size:\s*12px/);
  assert.match(infoValueBlock, /color:\s*var\(--color-info-value\)/);
  assert.match(infoSectionHeadingBlock, /font-size:\s*9px/);
  assert.match(infoSectionHeadingBlock, /letter-spacing:\s*1\.6px/);
});

test("renderer right sidebar tabs mirror native compact pill switcher", () => {
  const nativeSource = readRepository("Sources/Wikiwise/RightSidebar.swift");
  const htmlSource = read("src/renderer/index.html");
  const cssSource = read("src/renderer/styles.css");
  const rightTabsBlock = cssBlock(cssSource, ".right-tabs");
  const rightTabSwitchBlock = cssBlock(cssSource, ".right-tab-switch");
  const rightTabBlock = cssBlock(cssSource, ".right-tab");
  const selectedRightTabBlock = cssBlock(cssSource, ".right-tab.selected");

  assert.match(nativeSource, /private var tabBar:[\s\S]*HStack\(spacing:\s*0\)/);
  assert.match(
    nativeSource,
    /Text\(tab\.rawValue\)[\s\S]*\.font\(\.system\(size:\s*10,\s*weight:\s*\.regular,\s*design:\s*\.monospaced\)\)[\s\S]*\.tracking\(0\.8\)[\s\S]*\.foregroundStyle\(activeTab == tab \? Color\.tabActive : Color\.tabInactive\)[\s\S]*\.padding\(\.horizontal,\s*14\)[\s\S]*\.padding\(\.vertical,\s*3\)/
  );
  assert.match(
    nativeSource,
    /RoundedRectangle\(cornerRadius:\s*4\)[\s\S]*\.fill\(Color\.tabActiveBg\)[\s\S]*\.shadow\(color:\s*\.black\.opacity\(0\.1\),\s*radius:\s*0\.5,\s*y:\s*0\.5\)/
  );
  assert.match(
    nativeSource,
    /\.padding\(2\)[\s\S]*RoundedRectangle\(cornerRadius:\s*5\)[\s\S]*\.fill\(Color\.tabBarBg\)[\s\S]*\.padding\(\.horizontal,\s*12\)[\s\S]*\.padding\(\.vertical,\s*8\)/
  );

  assert.match(
    htmlSource,
    /<div class="right-tabs">\s*<div class="right-tab-switch" role="tablist" aria-label="Right sidebar">[\s\S]*id="right-tab-info"[\s\S]*id="right-tab-terminal"[\s\S]*<\/div>\s*<\/div>/
  );
  assert.match(rightTabsBlock, /display:\s*flex/);
  assert.match(rightTabsBlock, /align-items:\s*center/);
  assert.match(rightTabsBlock, /justify-content:\s*flex-start/);
  assert.match(rightTabsBlock, /padding:\s*8px 12px/);
  assert.match(rightTabsBlock, /background:\s*var\(--color-sidebar-bg\)/);
  assert.match(rightTabSwitchBlock, /display:\s*flex/);
  assert.match(rightTabSwitchBlock, /padding:\s*2px/);
  assert.match(rightTabSwitchBlock, /border-radius:\s*5px/);
  assert.match(rightTabSwitchBlock, /background:\s*var\(--color-tab-bar-bg\)/);
  assert.match(rightTabBlock, /padding:\s*3px 14px/);
  assert.match(rightTabBlock, /font-size:\s*10px/);
  assert.match(rightTabBlock, /font-weight:\s*400/);
  assert.match(rightTabBlock, /letter-spacing:\s*0\.8px/);
  assert.match(rightTabBlock, /color:\s*var\(--color-tab-inactive\)/);
  assert.match(selectedRightTabBlock, /border-radius:\s*4px/);
  assert.match(selectedRightTabBlock, /background:\s*var\(--color-tab-active-bg\)/);
  assert.match(selectedRightTabBlock, /color:\s*var\(--color-tab-active\)/);
  assert.match(selectedRightTabBlock, /box-shadow:\s*0 0\.5px 0\.5px rgba\(0,\s*0,\s*0,\s*0\.1\)/);
  assert.doesNotMatch(rightTabsBlock, /grid-template-columns:\s*1fr 1fr/);
  assert.doesNotMatch(rightTabBlock, /font-weight:\s*700/);
});

test("Electron package declares PTY and xterm terminal dependencies", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.match(packageJson.dependencies["node-pty"], /\d/);
  assert.match(packageJson.dependencies["@xterm/xterm"], /\d/);
  assert.match(packageJson.dependencies["@xterm/addon-fit"], /\d/);
});
