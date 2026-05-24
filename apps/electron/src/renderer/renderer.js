const welcome = document.querySelector("#welcome");
const project = document.querySelector("#project");
const fileTree = document.querySelector("#file-tree");
const selectedFileLabel = document.querySelector("#selected-file");
const sourceEditorFrame = document.querySelector("#source-editor-frame");
const previewFrame = document.querySelector("#preview-frame");
const generatedPreviewFrame = document.querySelector("#generated-preview-frame");
const saveButton = document.querySelector("#save-file");
const saveStatus = document.querySelector("#save-status");
const publishButton = document.querySelector("#publish-wiki");
const modeFileButton = document.querySelector("#mode-file");
const modeWikiButton = document.querySelector("#mode-wiki");
const goBackButton = document.querySelector("#go-back");
const goForwardButton = document.querySelector("#go-forward");
const toggleLeftSidebarButton = document.querySelector("#toggle-left-sidebar");
const appearanceModeButton = document.querySelector("#appearance-mode");
const openMapButton = document.querySelector("#open-map");
const toggleRightSidebarButton = document.querySelector("#toggle-right-sidebar");
const toolbarProjectName = document.querySelector("#toolbar-project-name");
const leftSidebar = document.querySelector("#left-sidebar");
const leftSidebarResizeHandle = document.querySelector("#left-sidebar-resize-handle");
const rightSidebar = document.querySelector("#right-sidebar");
const rightSidebarResizeHandle = document.querySelector("#right-sidebar-resize-handle");
const rightTabInfoButton = document.querySelector("#right-tab-info");
const rightTabTerminalButton = document.querySelector("#right-tab-terminal");
const infoPanel = document.querySelector("#info-panel");
const infoPath = document.querySelector("#info-path");
const infoEdited = document.querySelector("#info-edited");
const infoWords = document.querySelector("#info-words");
const infoDirectionsSection = document.querySelector("#info-directions-section");
const infoDirections = document.querySelector("#info-directions");
const infoLinksSection = document.querySelector("#info-links-section");
const infoLinks = document.querySelector("#info-links");
const terminalPanel = document.querySelector("#terminal-panel");
const terminalSurface = document.querySelector("#terminal-surface");
const openExistingButton = document.querySelector("#open-existing");
const createNewButton = document.querySelector("#create-new");
const newWikiDialog = document.querySelector("#new-wiki-dialog");
const newWikiNameInput = document.querySelector("#new-wiki-name");
const newWikiLocationLabel = document.querySelector("#new-wiki-location");
const chooseNewWikiLocationButton = document.querySelector("#choose-new-wiki-location");
const cancelCreateNewButton = document.querySelector("#cancel-create-new");
const confirmCreateNewButton = document.querySelector("#confirm-create-new");
const publishDialog = document.querySelector("#publish-dialog");
const publishSubdomainInput = document.querySelector("#publish-subdomain");
const publishUrl = document.querySelector("#publish-url");
const publishAvailability = document.querySelector("#publish-availability");
const cancelPublishButton = document.querySelector("#cancel-publish");
const confirmPublishButton = document.querySelector("#confirm-publish");
const unpublishButton = document.querySelector("#unpublish-wiki");
const publishResultDialog = document.querySelector("#publish-result-dialog");
const publishResultMessage = document.querySelector("#publish-result-message");
const publishResultUrl = document.querySelector("#publish-result-url");
const openPublishResultButton = document.querySelector("#open-publish-result");
const dismissPublishResultButton = document.querySelector("#dismiss-publish-result");
const publishErrorDialog = document.querySelector("#publish-error-dialog");
const publishErrorMessage = document.querySelector("#publish-error-message");
const dismissPublishErrorButton = document.querySelector("#dismiss-publish-error");
const unpublishConfirmDialog = document.querySelector("#unpublish-confirm-dialog");
const cancelUnpublishButton = document.querySelector("#cancel-unpublish");
const confirmUnpublishButton = document.querySelector("#confirm-unpublish");
const postCreateGuide = document.querySelector("#post-create-guide");
const guideClaudeCommand = document.querySelector("#guide-claude-command");
const guideCodexCommand = document.querySelector("#guide-codex-command");
const guideCursorCommand = document.querySelector("#guide-cursor-command");
const dismissPostCreateGuideButton = document.querySelector("#dismiss-post-create-guide");
const errorMessage = document.querySelector("#error-message");
const scriptLoadPromises = new Map();
const LEFT_SIDEBAR_DEFAULT_WIDTH = 200;
const LEFT_SIDEBAR_MIN_WIDTH = 110;
const LEFT_SIDEBAR_MAX_WIDTH = 360;
const RIGHT_SIDEBAR_DEFAULT_WIDTH = 360;
const RIGHT_SIDEBAR_MIN_WIDTH = 200;
const toolbarSymbols = Object.freeze({
  Auto: {
    nativeSymbol: "circle.lefthalf.filled",
    glyph: "◐",
    label: "Appearance: Auto"
  },
  Light: {
    nativeSymbol: "sun.max.fill",
    glyph: "☀",
    label: "Appearance: Light"
  },
  Dark: {
    nativeSymbol: "moon.fill",
    glyph: "☾",
    label: "Appearance: Dark"
  },
  map: {
    nativeSymbol: "map",
    glyph: "⌖",
    label: "Open 3D Map"
  },
  leftSidebar: {
    nativeSymbol: "sidebar.left",
    glyph: "▤",
    label: "Toggle left sidebar"
  },
  rightSidebarVisible: {
    nativeSymbol: "sidebar.right",
    glyph: "▣",
    label: "Hide Right Sidebar"
  },
  rightSidebarHidden: {
    nativeSymbol: "sidebar.right",
    glyph: "▣",
    label: "Show Right Sidebar"
  }
});

const state = {
  currentProject: null,
  selectedFile: null,
  generatedPage: null,
  detailMode: "file",
  appearanceMode: "Auto",
  rightSidebarTab: "terminal",
  leftSidebarWidth: LEFT_SIDEBAR_DEFAULT_WIDTH,
  leftSidebarResizeDrag: null,
  rightSidebarWidth: 360,
  rightSidebarResizeDrag: null,
  isLeftSidebarVisible: true,
  isRightSidebarVisible: true,
  backHistory: [],
  forwardHistory: [],
  appCommandCleanup: null,
  autosaveTimer: null,
  editorResourceUrl: "",
  sourceEditorFrameReady: false,
  editorLoadedFilePath: "",
  editorLoadedContent: "",
  projectWatcherCleanup: null,
  terminalOutputCleanup: null,
  documentInfo: null,
  terminalInstance: null,
  terminalFitAddon: null,
  terminalResizeObserver: null,
  terminalResourcesLoaded: false,
  terminalResizeTimer: null,
  publishConfig: null,
  isPublishDialogOpen: false,
  publishSubdomain: "",
  publishAvailability: "unknown",
  isPublishing: false,
  isUnpublishing: false,
  publishResult: null,
  publishError: null,
  isUnpublishConfirmOpen: false,
  availabilityCheckTimer: null,
  isNewWikiDialogOpen: false,
  newWikiName: "",
  newWikiLocation: "",
  isCreatingWiki: false,
  showPostCreateGuide: false,
  expandedTreePaths: new Set(),
  treeLoadingPaths: new Set(),
  tree: []
};

function setError(error) {
  if (!error) {
    errorMessage.hidden = true;
    errorMessage.textContent = "";
    return;
  }

  errorMessage.hidden = false;
  errorMessage.textContent = error instanceof Error ? error.message : String(error);
}

function clearAutosave() {
  if (state.autosaveTimer) {
    clearTimeout(state.autosaveTimer);
    state.autosaveTimer = null;
  }
}

async function loadEditorResource() {
  if (state.editorResourceUrl) return state.editorResourceUrl;

  const resource = await window.wikiwise.getEditorResource();
  state.editorResourceUrl = resource.fileUrl;
  sourceEditorFrame.src = resource.fileUrl;
  return state.editorResourceUrl;
}

function loadScriptOnce(id, src) {
  if (scriptLoadPromises.has(id)) return scriptLoadPromises.get(id);
  if (document.getElementById(id)) return Promise.resolve();

  const loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.append(script);
  });
  scriptLoadPromises.set(id, loadPromise);
  return loadPromise;
}

async function loadTerminalResources() {
  if (state.terminalResourcesLoaded) return;

  const resource = await window.wikiwise.getTerminalResource();
  if (!document.getElementById("wikiwise-terminal-css")) {
    const link = document.createElement("link");
    link.id = "wikiwise-terminal-css";
    link.rel = "stylesheet";
    link.href = resource.xtermCssUrl;
    document.head.append(link);
  }

  await loadScriptOnce("wikiwise-xterm-script", resource.xtermScriptUrl);
  await loadScriptOnce("wikiwise-xterm-fit-script", resource.fitScriptUrl);
  state.terminalResourcesLoaded = true;
}

function renderApp() {
  const hasProject = Boolean(state.currentProject);

  welcome.hidden = hasProject;
  project.hidden = !hasProject;
  renderNewWikiDialog();
  renderPublishDialog();
  renderPublishStatus();
  renderPublishFeedback();

  if (hasProject) {
    toolbarProjectName.textContent = state.currentProject.projectName;
    renderTree(state.tree);
    renderDetail();
    renderRightSidebar();
  } else {
    toolbarProjectName.textContent = "Wikiwise";
    renderRightSidebar();
  }
  renderProjectToolbar();
}

function renderTree(nodes) {
  fileTree.replaceChildren(...nodes.map((node) => renderNode(node, 0)));
}

function renderNode(node, depth) {
  const item = document.createElement("li");
  const button = document.createElement("button");

  item.className = node.isDirectory ? "tree-folder" : "tree-file";
  item.style.setProperty("--tree-depth", String(depth));
  item.dataset.path = node.path;
  item.setAttribute("data-path", node.path);
  button.type = "button";
  button.dataset.path = node.path;
  button.setAttribute("data-path", node.path);

  if (node.isDirectory) {
    const isExpanded = state.expandedTreePaths.has(node.path);
    const isLoading = state.treeLoadingPaths.has(node.path);
    const disclosure = document.createElement("span");
    const folderIcon = document.createElement("span");
    const label = document.createElement("span");

    button.className = "tree-row tree-folder-button";
    button.title = folderTooltip(node.name);
    button.setAttribute("aria-expanded", String(isExpanded));
    button.disabled = isLoading;
    disclosure.className = "tree-disclosure";
    disclosure.textContent = isLoading ? "..." : (isExpanded ? "▾" : "▸");
    folderIcon.className = "tree-folder-icon";
    folderIcon.setAttribute("aria-hidden", "true");
    label.className = "tree-label";
    label.textContent = node.name;

    if (node.name === "raw" || node.name === "site") {
      item.classList.add("special-folder");
    }

    button.append(disclosure, folderIcon, label);
    button.addEventListener("click", () => {
      toggleTreeFolder(node).catch(setError);
    });
    item.append(button);

    if (isExpanded && Array.isArray(node.children) && node.children.length > 0) {
      const children = document.createElement("ul");
      children.className = "tree-children";
      children.replaceChildren(...node.children.map((child) => renderNode(child, depth + 1)));
      item.append(children);
    }

    return item;
  }

  button.className = "tree-row tree-file-button";
  if (state.selectedFile?.path === node.path) {
    button.classList.add("selected");
    button.setAttribute("data-selected", "true");
  }
  if (["home.md", "index.md", "log.md"].includes(node.name)) {
    button.classList.add("special-file");
  }
  if (button.classList.contains("selected")) {
    const selectedAccent = document.createElement("span");
    selectedAccent.className = "tree-selected-accent";
    selectedAccent.setAttribute("aria-hidden", "true");
    button.append(selectedAccent);
  }
  const label = document.createElement("span");
  label.className = "tree-label";
  label.textContent = node.name;
  button.append(label);
  if (!node.isDirectory) {
    button.addEventListener("click", () => selectFile(node));
  }

  item.append(button);
  return item;
}

function normalizeTreeNodes(nodes) {
  return (nodes ?? []).map((node) => {
    if (!node.isDirectory) return { ...node };
    const children = Array.isArray(node.children) ? normalizeTreeNodes(node.children) : [];
    return {
      ...node,
      children,
      childrenLoaded: Boolean(node.childrenLoaded || children.length > 0)
    };
  });
}

function folderTooltip(name) {
  switch (name) {
  case "wiki":
    return "Wiki pages - your editable knowledge base";
  case "sources":
    return "Source summaries - one page per ingested source";
  case "raw":
    return "Raw source documents - read-only originals";
  case "site":
    return "Build tooling and compiled HTML output";
  default:
    return name;
  }
}

async function toggleTreeFolder(node) {
  if (!node?.isDirectory) return;

  if (state.expandedTreePaths.has(node.path)) {
    state.expandedTreePaths.delete(node.path);
    renderTree(state.tree);
    return;
  }

  await expandProjectTreeFolder(node);
}

async function expandProjectTreeFolder(node, options = {}) {
  if (!state.currentProject || !node?.isDirectory) return [];
  if (state.treeLoadingPaths.has(node.path)) return node.children ?? [];

  state.expandedTreePaths.add(node.path);
  if (node.childrenLoaded) {
    if (options.render !== false) renderTree(state.tree);
    return node.children ?? [];
  }

  state.treeLoadingPaths.add(node.path);
  if (options.render !== false) renderTree(state.tree);

  try {
    const children = await window.wikiwise.expandTreeDirectory({
      projectRoot: state.currentProject.projectRoot,
      directoryPath: node.path
    });
    node.children = normalizeTreeNodes(children);
    node.childrenLoaded = true;
    return node.children;
  } finally {
    state.treeLoadingPaths.delete(node.path);
    if (options.render !== false) renderTree(state.tree);
  }
}

async function autoExpandInitialTree() {
  const defaultFolders = state.tree.filter((node) => node.isDirectory && node.name !== "site");
  await Promise.all(defaultFolders.map((node) => expandProjectTreeFolder(node, { render: false })));
  renderTree(state.tree);
}

function findTreeNodeByPath(nodes, targetPath) {
  for (const node of nodes ?? []) {
    if (node.path === targetPath) return node;
    if (node.isDirectory) {
      const found = findTreeNodeByPath(node.children, targetPath);
      if (found) return found;
    }
  }
  return null;
}

function pruneExpandedTreePaths(nodes, expandedPaths) {
  const allDirectoryPaths = new Set();
  const visit = (entries) => {
    for (const node of entries ?? []) {
      if (!node.isDirectory) continue;
      allDirectoryPaths.add(node.path);
      visit(node.children);
    }
  };
  visit(nodes);

  return new Set([...expandedPaths].filter((folderPath) => allDirectoryPaths.has(folderPath)));
}

async function restoreExpandedTree(previousExpandedPaths) {
  const sortedPaths = [...previousExpandedPaths].sort((a, b) => a.length - b.length);
  state.expandedTreePaths = new Set();

  for (const folderPath of sortedPaths) {
    const node = findTreeNodeByPath(state.tree, folderPath);
    if (node?.isDirectory) {
      await expandProjectTreeFolder(node, { render: false });
    }
  }

  state.expandedTreePaths = pruneExpandedTreePaths(state.tree, state.expandedTreePaths);
  renderTree(state.tree);
}

async function openExisting() {
  setError(null);
  openExistingButton.disabled = true;

  try {
    const result = await window.wikiwise.openExisting();
    if (result.canceled) return;

    await applyProjectResult(result.project);
  } catch (error) {
    setError(error);
  } finally {
    openExistingButton.disabled = false;
  }
}

async function selectFile(node, options = {}) {
  setError(null);
  state.showPostCreateGuide = false;
  if (options.pushHistory !== false) {
    pushHistoryEntry(currentHistoryEntry());
    state.forwardHistory = [];
  }
  state.generatedPage = null;

  try {
    const content = await window.wikiwise.readFile(node.path);
    const nextFile = {
      path: node.path,
      name: node.name,
      content
    };

    if (isMarkdownFile(node.path)) {
      try {
        nextFile.compiled = await compileMarkdownPreview(node.path);
      } catch (error) {
        setError(error);
      }
    }

    setSelectedFile(nextFile);
    await setActiveSelectedFile(nextFile.path);
    renderTree(state.tree);
    renderProjectToolbar();
    await refreshDocumentInfo();
  } catch (error) {
    setError(error);
  }
}

function setSelectedFile(file) {
  captureEditorScrollFraction();
  clearAutosave();
  state.documentInfo = null;
  state.generatedPage = null;
  state.selectedFile = file
    ? {
        ...file,
        draftContent: file.content ?? "",
        lastSavedContent: file.content ?? "",
        scrollFraction: file.scrollFraction ?? 0,
        isDirty: false,
        isSaving: false
      }
    : null;
  state.detailMode = hasCompiledPreview(file) ? "wiki" : "file";
  renderDetail();
}

async function setActiveSelectedFile(filePath = state.selectedFile?.path) {
  if (!state.currentProject || !filePath) return null;
  return window.wikiwise.setActiveFile({
    projectRoot: state.currentProject.projectRoot,
    filePath
  }).catch((error) => {
    setError(error);
    return null;
  });
}

function setDetailMode(mode) {
  if (state.detailMode === "file" && mode !== "file") {
    captureEditorScrollFraction();
  }
  state.detailMode = mode;
  renderDetail();
}

function renderDetail() {
  const file = state.selectedFile;
  const hasFile = Boolean(file);
  const hasGeneratedPage = Boolean(state.generatedPage);
  const wikiAvailable = hasCompiledPreview(file);
  const showGuide = Boolean(state.showPostCreateGuide && state.currentProject);

  selectedFileLabel.textContent = showGuide
    ? "Your wiki is ready"
    : (state.generatedPage?.name ?? file?.name ?? "Select a file to read");

  modeFileButton.disabled = showGuide || hasGeneratedPage || !hasFile;
  modeWikiButton.disabled = showGuide || hasGeneratedPage || !wikiAvailable;
  modeFileButton.classList.toggle("selected", state.detailMode === "file");
  modeWikiButton.classList.toggle("selected", state.detailMode === "wiki" && wikiAvailable);

  sourceEditorFrame.hidden = showGuide || hasGeneratedPage || state.detailMode !== "file";
  previewFrame.hidden = showGuide || hasGeneratedPage || state.detailMode !== "wiki" || !wikiAvailable;
  generatedPreviewFrame.hidden = !hasGeneratedPage;
  postCreateGuide.hidden = !showGuide;
  renderSaveState();

  if (showGuide) {
    renderPostCreateGuide();
    previewFrame.removeAttribute("src");
    generatedPreviewFrame.removeAttribute("src");
  } else if (hasGeneratedPage) {
    generatedPreviewFrame.src = state.generatedPage.fileUrl;
    previewFrame.removeAttribute("src");
  } else if (state.detailMode === "wiki" && wikiAvailable) {
    renderPreview();
    generatedPreviewFrame.removeAttribute("src");
  } else {
    previewFrame.removeAttribute("src");
    generatedPreviewFrame.removeAttribute("src");
    renderSourceEditor(file);
  }

  renderRightSidebar();
  renderProjectToolbar();
}

function renderSourceEditor(file) {
  if (!file || sourceEditorFrame.hidden) return;

  if (!state.editorResourceUrl) {
    loadEditorResource()
      .then(() => renderSourceEditor(state.selectedFile))
      .catch(setError);
    return;
  }

  if (sourceEditorFrame.getAttribute("src") !== state.editorResourceUrl) {
    state.sourceEditorFrameReady = false;
    sourceEditorFrame.src = state.editorResourceUrl;
  }

  if (state.sourceEditorFrameReady) {
    setEditorContent(file.draftContent, file.scrollFraction ?? 0, file.path);
  }
}

function setEditorContent(content, scrollFraction = 0, filePath = "") {
  const editorWindow = sourceEditorFrame.contentWindow;
  if (!editorWindow?.setContent) return false;
  if (state.editorLoadedFilePath === filePath && state.editorLoadedContent === content) return true;

  editorWindow.setContent(content);
  state.editorLoadedFilePath = filePath;
  state.editorLoadedContent = content;
  window.requestAnimationFrame(() => {
    editorWindow.__scrollToFraction?.(scrollFraction);
  });
  return true;
}

function renderPreview() {
  previewFrame.src = state.selectedFile.compiled.fileUrl;
}

function publishButtonHelpText() {
  if (state.publishConfig?.published && state.publishConfig.url) {
    return `Last published: ${state.publishConfig.lastPublishedAt ?? "never"}\n${state.publishConfig.url}\n⌥-click to change URL`;
  }

  return "Publish wiki to wiki-wise.com";
}

function renderPublishStatus() {
  const publishHelpText = publishButtonHelpText();
  publishButton.disabled = !state.currentProject || state.isPublishing;
  publishButton.textContent = state.isPublishing ? "PUBLISHING..." : "PUBLISH ↑";
  publishButton.title = publishHelpText;
  publishButton.setAttribute("aria-label", publishHelpText);
  renderPublishFeedback();
}

function renderPublishFeedback() {
  const result = state.publishResult;
  publishResultDialog.hidden = !result;
  publishResultMessage.textContent = result
    ? (result.isFirstPublish
        ? "Your wiki is live at:"
        : "Updated:")
    : "";
  publishResultUrl.textContent = result?.url ?? "";
  openPublishResultButton.disabled = !result?.url;

  publishErrorDialog.hidden = !state.publishError;
  publishErrorMessage.textContent = state.publishError ?? "";

  unpublishConfirmDialog.hidden = !state.isUnpublishConfirmOpen;
  confirmUnpublishButton.disabled = state.isUnpublishing;
  confirmUnpublishButton.textContent = state.isUnpublishing ? "Unpublishing" : "Unpublish";
}

function renderProjectToolbar() {
  goBackButton.disabled = state.backHistory.length === 0;
  goForwardButton.disabled = state.forwardHistory.length === 0;
  setToolbarButtonSymbol(appearanceModeButton, toolbarSymbols[state.appearanceMode] ?? toolbarSymbols.Auto);
  setToolbarButtonSymbol(openMapButton, toolbarSymbols.map);
  setToolbarButtonSymbol(toggleLeftSidebarButton, toolbarSymbols.leftSidebar);
  setToolbarButtonSymbol(
    toggleRightSidebarButton,
    state.isRightSidebarVisible ? toolbarSymbols.rightSidebarVisible : toolbarSymbols.rightSidebarHidden
  );
  openMapButton.disabled = !state.currentProject;
  applyLeftSidebarWidth();
  toggleLeftSidebarButton.classList.toggle("selected", state.isLeftSidebarVisible);
  toggleLeftSidebarButton.setAttribute("aria-pressed", String(state.isLeftSidebarVisible));
  toggleRightSidebarButton.classList.toggle("selected", state.isRightSidebarVisible);
  leftSidebar.hidden = !state.isLeftSidebarVisible;
  project.classList.toggle("left-sidebar-hidden", !state.isLeftSidebarVisible);
  project.classList.toggle("right-sidebar-hidden", !state.isRightSidebarVisible);
  updateToolbarTitleOffset();
  if (state.currentProject && state.isRightSidebarVisible) {
    applyRightSidebarWidth();
  }
}

function setToolbarButtonSymbol(button, symbol) {
  if (!button || !symbol) return;

  let icon = button.querySelector(".toolbar-symbol");
  if (!icon) {
    icon = document.createElement("span");
    icon.className = "toolbar-symbol";
    icon.setAttribute("aria-hidden", "true");
    button.replaceChildren(icon);
  }

  icon.dataset.nativeSymbol = symbol.nativeSymbol;
  icon.textContent = symbol.glyph;
  button.title = symbol.label;
  button.setAttribute("aria-label", symbol.label);
}

function updateToolbarTitleOffset() {
  const leftSidebarWidth = state.isLeftSidebarVisible
    ? Math.round(leftSidebar.getBoundingClientRect().width)
    : 0;
  const toolbarTitleOffset = state.isLeftSidebarVisible
    ? -Math.round(leftSidebarWidth / 2)
    : 0;
  project.style.setProperty("--toolbar-title-offset", `${toolbarTitleOffset}px`);
}

function clampLeftSidebarWidth(width) {
  const numericWidth = Number(width);
  const targetWidth = Number.isFinite(numericWidth) ? numericWidth : LEFT_SIDEBAR_DEFAULT_WIDTH;
  return Math.min(
    Math.max(Math.round(targetWidth), LEFT_SIDEBAR_MIN_WIDTH),
    LEFT_SIDEBAR_MAX_WIDTH
  );
}

function applyLeftSidebarWidth(width = state.leftSidebarWidth) {
  state.leftSidebarWidth = clampLeftSidebarWidth(width);
  project.style.setProperty("--left-sidebar-width", `${state.leftSidebarWidth}px`);
  window.__wikiwiseLeftSidebarWidth = state.leftSidebarWidth;
  updateToolbarTitleOffset();

  if (state.currentProject) {
    window.requestAnimationFrame(() => fitTerminal());
  }

  return state.leftSidebarWidth;
}

function maxRightSidebarWidth() {
  const projectWidth = Math.round(project.getBoundingClientRect().width);
  const viewportWidth = projectWidth > 0 ? projectWidth : window.innerWidth;
  return Math.max(RIGHT_SIDEBAR_MIN_WIDTH, Math.floor(viewportWidth / 2));
}

function clampRightSidebarWidth(width) {
  const numericWidth = Number(width);
  const targetWidth = Number.isFinite(numericWidth) ? numericWidth : RIGHT_SIDEBAR_DEFAULT_WIDTH;
  return Math.min(
    Math.max(Math.round(targetWidth), RIGHT_SIDEBAR_MIN_WIDTH),
    maxRightSidebarWidth()
  );
}

function applyRightSidebarWidth(width = state.rightSidebarWidth) {
  if (!state.currentProject) {
    project.style.setProperty("--right-sidebar-width", `${state.rightSidebarWidth}px`);
    window.__wikiwiseRightSidebarWidth = state.rightSidebarWidth;
    return state.rightSidebarWidth;
  }

  state.rightSidebarWidth = clampRightSidebarWidth(width);
  project.style.setProperty("--right-sidebar-width", `${state.rightSidebarWidth}px`);
  window.__wikiwiseRightSidebarWidth = state.rightSidebarWidth;

  if (state.isRightSidebarVisible) {
    window.requestAnimationFrame(() => fitTerminal());
  }

  return state.rightSidebarWidth;
}

function startRightSidebarResize(event) {
  if (!state.currentProject || !state.isRightSidebarVisible) return;
  if (event.button !== undefined && event.button !== 0) return;

  event.preventDefault();
  applyRightSidebarWidth();
  state.rightSidebarResizeDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startWidth: state.rightSidebarWidth
  };
  document.body.classList.add("resizing-right-sidebar");

  try {
    rightSidebarResizeHandle.setPointerCapture?.(event.pointerId);
  } catch {
    // Synthetic audit events do not create an active pointer capture target.
  }
}

function updateRightSidebarResize(event) {
  const drag = state.rightSidebarResizeDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;

  event.preventDefault();
  applyRightSidebarWidth(drag.startWidth - (event.clientX - drag.startX));
}

function endRightSidebarResize(event) {
  const drag = state.rightSidebarResizeDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;

  event.preventDefault();
  state.rightSidebarResizeDrag = null;
  document.body.classList.remove("resizing-right-sidebar");

  try {
    rightSidebarResizeHandle.releasePointerCapture?.(event.pointerId);
  } catch {
    // Pointer capture may already be gone after cancellation.
  }

  fitTerminal();
}

function startLeftSidebarResize(event) {
  if (!state.currentProject || !state.isLeftSidebarVisible) return;
  if (event.button !== undefined && event.button !== 0) return;

  event.preventDefault();
  applyLeftSidebarWidth();
  state.leftSidebarResizeDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startWidth: state.leftSidebarWidth
  };
  document.body.classList.add("resizing-left-sidebar");

  try {
    leftSidebarResizeHandle.setPointerCapture?.(event.pointerId);
  } catch {
    // Synthetic audit events do not create an active pointer capture target.
  }
}

function updateLeftSidebarResize(event) {
  const drag = state.leftSidebarResizeDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;

  event.preventDefault();
  applyLeftSidebarWidth(drag.startWidth + (event.clientX - drag.startX));
}

function endLeftSidebarResize(event) {
  const drag = state.leftSidebarResizeDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;

  event.preventDefault();
  state.leftSidebarResizeDrag = null;
  document.body.classList.remove("resizing-left-sidebar");

  try {
    leftSidebarResizeHandle.releasePointerCapture?.(event.pointerId);
  } catch {
    // Pointer capture may already be gone after cancellation.
  }

  fitTerminal();
}

function setRightSidebarTab(tab) {
  state.rightSidebarTab = tab;
  renderRightSidebar();
}

function renderRightSidebar() {
  const hasProject = Boolean(state.currentProject);

  rightSidebar.hidden = !hasProject || !state.isRightSidebarVisible;
  if (!hasProject) return;

  rightTabInfoButton.classList.toggle("selected", state.rightSidebarTab === "info");
  rightTabTerminalButton.classList.toggle("selected", state.rightSidebarTab === "terminal");
  rightTabInfoButton.setAttribute("aria-selected", String(state.rightSidebarTab === "info"));
  rightTabTerminalButton.setAttribute("aria-selected", String(state.rightSidebarTab === "terminal"));

  infoPanel.hidden = state.rightSidebarTab !== "info";
  terminalPanel.hidden = state.rightSidebarTab !== "terminal";

  renderInfoTab();
  renderTerminalTab();
}

function renderInfoTab() {
  const file = state.selectedFile;
  const info = state.documentInfo;

  infoPath.textContent = info?.name ?? file?.name ?? "No document";
  infoEdited.textContent = info?.modifiedAt ? formatEditedTime(info.modifiedAt) : "";
  infoWords.textContent = info ? String(info.wordCount) : "";

  const hasDirections = Boolean(info?.directions);
  infoDirectionsSection.hidden = !hasDirections;
  infoDirections.textContent = hasDirections ? info.directions : "";

  const links = info?.wikilinks ?? [];
  const hasLinks = links.length > 0;
  infoLinksSection.hidden = !hasLinks;
  infoLinks.replaceChildren(...(hasLinks ? links.map(renderInfoLink) : []));
}

function renderInfoLink(target) {
  const item = document.createElement("li");
  item.textContent = `↗ ${target}`;
  return item;
}

function renderTerminalTab() {
  terminalSurface.classList.toggle("inactive", !state.currentProject);
  if (state.currentProject && state.rightSidebarTab === "terminal") {
    ensureTerminalInstance().catch(setError);
    fitTerminal();
  }
}

async function ensureTerminalInstance() {
  if (state.terminalInstance) return state.terminalInstance;

  await loadTerminalResources();
  const TerminalCtor = window.Terminal?.Terminal ?? window.Terminal;
  const FitAddonCtor = window.FitAddon?.FitAddon ?? window.FitAddon;
  if (!TerminalCtor || !FitAddonCtor) {
    throw new Error("Terminal resources did not expose xterm constructors.");
  }

  const terminalInstance = new TerminalCtor({
    cursorBlink: true,
    fontFamily: '"JetBrains Mono", "SFMono-Regular", Menlo, monospace',
    fontSize: 12,
    lineHeight: 1.1,
    scrollback: 5000,
    convertEol: true,
    theme: terminalTheme()
  });
  const terminalFitAddon = new FitAddonCtor();

  terminalInstance.loadAddon(terminalFitAddon);
  terminalInstance.open(terminalSurface);
  terminalInstance.onData((input) => {
    window.wikiwise.sendTerminalInput({ input }).catch(setError);
  });

  state.terminalInstance = terminalInstance;
  state.terminalFitAddon = terminalFitAddon;
  window.__wikiwiseTerminal = terminalInstance;
  window.__wikiwiseTerminalText = "";
  observeTerminalResize();
  fitTerminal();
  return terminalInstance;
}

function observeTerminalResize() {
  if (state.terminalResizeObserver || !window.ResizeObserver) return;

  state.terminalResizeObserver = new ResizeObserver(() => fitTerminal());
  state.terminalResizeObserver.observe(terminalSurface);
}

function terminalTheme() {
  const isDark = state.appearanceMode === "Dark"
    || (state.appearanceMode === "Auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return isDark
    ? {
        background: "#0E0C08",
        foreground: "#CFC3A3",
        cursor: "#C2A96B",
        selectionBackground: "#C2A96B33",
        black: "#1E1B14",
        red: "#B85E5E",
        green: "#7F965B",
        yellow: "#C2A96B",
        blue: "#6B7FA3",
        magenta: "#A36B8F",
        cyan: "#6B9696",
        white: "#A89A7C",
        brightBlack: "#6F6450",
        brightRed: "#D07070",
        brightGreen: "#96AD70",
        brightYellow: "#D4BE80",
        brightBlue: "#8096B8",
        brightMagenta: "#B880A3",
        brightCyan: "#80ADAD",
        brightWhite: "#F4EACF"
      }
    : {
        background: "#F3EDDE",
        foreground: "#5B5240",
        cursor: "#7A1F1F",
        selectionBackground: "#B89B5A33",
        black: "#3A2F1C",
        red: "#9B3D3D",
        green: "#6B7F4A",
        yellow: "#B89B5A",
        blue: "#5B6A8A",
        magenta: "#8A5B7A",
        cyan: "#5B7F7F",
        white: "#D9CFB9",
        brightBlack: "#7A6E54",
        brightRed: "#B84E4E",
        brightGreen: "#7F965B",
        brightYellow: "#C8AE6B",
        brightBlue: "#6B7FA3",
        brightMagenta: "#A36B8F",
        brightCyan: "#6B9696",
        brightWhite: "#F3EDDE"
      };
}

function applyTerminalTheme() {
  if (!state.terminalInstance) return;
  state.terminalInstance.options.theme = terminalTheme();
}

function fitTerminal() {
  if (!state.terminalInstance || !state.terminalFitAddon || terminalPanel.hidden) return;

  try {
    state.terminalFitAddon.fit();
    resizeTerminal();
  } catch {
    // xterm cannot fit until fonts and cell metrics are ready.
  }
}

function resizeTerminal() {
  if (!state.currentProject || !state.terminalInstance) return;

  clearTimeout(state.terminalResizeTimer);
  state.terminalResizeTimer = setTimeout(() => sendTerminalResize(), 40);
}

function sendTerminalResize() {
  if (!state.currentProject || !state.terminalInstance) return Promise.resolve({ resized: false });

  return window.wikiwise.resizeTerminal({
    cols: state.terminalInstance.cols,
    rows: state.terminalInstance.rows
  }).catch((error) => {
    setError(error);
    return { resized: false };
  });
}

async function applyProjectResult(projectResult, options = {}) {
  state.currentProject = {
    projectRoot: projectResult.projectRoot,
    projectName: projectResult.projectName
  };
  state.tree = normalizeTreeNodes(projectResult.tree);
  state.expandedTreePaths = new Set();
  state.treeLoadingPaths = new Set();
  state.showPostCreateGuide = Boolean(options.showPostCreateGuide);
  state.generatedPage = null;
  state.backHistory = [];
  state.forwardHistory = [];
  setSelectedFile(projectResult.selectedFile);

  renderApp();
  await autoExpandInitialTree();
  await setActiveSelectedFile();
  await startProjectServices();
}

async function openNewWikiDialog() {
  setError(null);
  state.isNewWikiDialogOpen = true;
  state.newWikiName = "";
  state.isCreatingWiki = false;

  try {
    state.newWikiLocation = await window.wikiwise.getDefaultWikiLocation();
  } catch (error) {
    setError(error);
  }

  renderNewWikiDialog();
  newWikiNameInput.focus();
}

function closeNewWikiDialog() {
  if (state.isCreatingWiki) return;

  state.isNewWikiDialogOpen = false;
  renderNewWikiDialog();
}

function renderNewWikiDialog() {
  newWikiDialog.hidden = !state.isNewWikiDialogOpen;
  if (!state.isNewWikiDialogOpen) return;

  if (document.activeElement !== newWikiNameInput) {
    newWikiNameInput.value = state.newWikiName;
  }
  newWikiLocationLabel.textContent = state.newWikiLocation || "";
  newWikiNameInput.disabled = state.isCreatingWiki;
  chooseNewWikiLocationButton.disabled = state.isCreatingWiki;
  cancelCreateNewButton.disabled = state.isCreatingWiki;
  confirmCreateNewButton.disabled =
    state.isCreatingWiki || state.newWikiName.trim().length === 0 || !state.newWikiLocation;
  confirmCreateNewButton.textContent = state.isCreatingWiki ? "Creating" : "Create";
}

async function chooseNewWikiLocation() {
  setError(null);

  try {
    const result = await window.wikiwise.chooseNewWikiLocation();
    if (!result.canceled && result.path) {
      state.newWikiLocation = result.path;
      renderNewWikiDialog();
    }
  } catch (error) {
    setError(error);
  }
}

async function createNewWiki() {
  const name = state.newWikiName.trim();
  if (!name || !state.newWikiLocation || state.isCreatingWiki) return;

  state.isCreatingWiki = true;
  renderNewWikiDialog();
  setError(null);

  try {
    const result = await window.wikiwise.createNewWiki({
      name,
      parentDir: state.newWikiLocation
    });

    state.isNewWikiDialogOpen = false;
    await applyProjectResult(result.project, { showPostCreateGuide: true });
  } catch (error) {
    setError(error);
  } finally {
    state.isCreatingWiki = false;
    renderNewWikiDialog();
  }
}

function renderPostCreateGuide() {
  if (!state.currentProject) return;

  const projectRoot = state.currentProject.projectRoot;
  guideClaudeCommand.textContent = `cd ${projectRoot} && claude`;
  guideCodexCommand.textContent = `cd ${projectRoot} && codex`;
  guideCursorCommand.textContent = `Open ${projectRoot} in Cursor`;
}

function dismissPostCreateGuide() {
  state.showPostCreateGuide = false;
  renderDetail();
}

async function loadAppSettings() {
  const settings = await window.wikiwise.getAppSettings();
  state.appearanceMode = settings.appearanceMode ?? "Auto";
  applyAppearanceModeToDocument();
  renderProjectToolbar();
  return settings;
}

function applyAppearanceModeToDocument() {
  document.documentElement.dataset.appearance = state.appearanceMode;
  applyTerminalTheme();
}

async function restoreLastProject() {
  try {
    const projectResult = await window.wikiwise.restoreLastProject();
    if (projectResult) {
      await applyProjectResult(projectResult);
    }
  } catch (error) {
    setError(error);
  }
}

async function cycleAppearanceMode() {
  const modes = ["Auto", "Light", "Dark"];
  const currentIndex = modes.indexOf(state.appearanceMode);
  const nextMode = modes[(currentIndex + 1) % modes.length];
  const settings = await window.wikiwise.setAppearanceMode(nextMode);
  state.appearanceMode = settings.appearanceMode ?? nextMode;
  applyAppearanceModeToDocument();
  renderProjectToolbar();
}

function currentHistoryEntry() {
  if (state.generatedPage) {
    return {
      kind: "generated",
      name: state.generatedPage.name,
      fileUrl: state.generatedPage.fileUrl,
      path: state.generatedPage.path
    };
  }
  if (state.selectedFile) {
    return {
      kind: "file",
      name: state.selectedFile.name,
      path: state.selectedFile.path
    };
  }
  return null;
}

function pushHistoryEntry(entry) {
  if (!entry) return;
  const previous = state.backHistory.at(-1);
  if (previous?.kind === entry.kind && previous?.path === entry.path) return;
  state.backHistory.push(entry);
}

async function restoreHistoryEntry(entry) {
  if (!entry) return;
  if (entry.kind === "generated") {
    showGeneratedPage(entry, { pushHistory: false });
    return;
  }

  await selectFile({ path: entry.path, name: entry.name }, { pushHistory: false });
}

function showGeneratedPage(generatedPage, options = {}) {
  if (!generatedPage) return;
  if (options.pushHistory !== false) {
    pushHistoryEntry(currentHistoryEntry());
    state.forwardHistory = [];
  }

  clearAutosave();
  state.showPostCreateGuide = false;
  state.selectedFile = null;
  state.documentInfo = null;
  state.generatedPage = generatedPage;
  state.detailMode = "wiki";
  renderTree(state.tree);
  renderDetail();
  renderInfoTab();
}

async function navigateBack() {
  const previous = state.backHistory.pop();
  if (!previous) return;
  const current = currentHistoryEntry();
  if (current) state.forwardHistory.push(current);
  await restoreHistoryEntry(previous);
  renderProjectToolbar();
}

async function navigateForward() {
  const next = state.forwardHistory.pop();
  if (!next) return;
  const current = currentHistoryEntry();
  if (current) state.backHistory.push(current);
  await restoreHistoryEntry(next);
  renderProjectToolbar();
}

async function openMap() {
  if (!state.currentProject) return;

  setError(null);
  try {
    const generatedPage = await window.wikiwise.openGeneratedPage({
      projectRoot: state.currentProject.projectRoot,
      pageName: "map-3d.html"
    });
    if (!generatedPage) return;

    showGeneratedPage(generatedPage);
  } catch (error) {
    setError(error);
  }
}

async function refreshGeneratedPage() {
  if (!state.currentProject || !state.generatedPage?.name) return null;

  const refreshed = await window.wikiwise.openGeneratedPage({
    projectRoot: state.currentProject.projectRoot,
    pageName: state.generatedPage.name
  });
  if (refreshed) {
    state.generatedPage = refreshed;
    renderDetail();
  }
  return refreshed;
}

async function refreshCurrentView() {
  if (state.generatedPage?.name) {
    await refreshGeneratedPage();
    return;
  }

  if (state.selectedFile?.path && isMarkdownFile(state.selectedFile.path)) {
    await refreshSelectedMarkdown({ invalidate: true });
  }
}

function attachPreviewNavigation(frame) {
  let frameDocument;
  try {
    frameDocument = frame.contentDocument;
  } catch {
    return;
  }
  if (!frameDocument) return;

  frameDocument.addEventListener("click", (event) => {
    handlePreviewFrameClick(event, frame);
  }, true);
}

async function handlePreviewFrameClick(event, frame) {
  try {
    const anchor = event.target?.closest?.("a[href]");
    if (!anchor || !state.currentProject) return;

    const rawHref = anchor.getAttribute("href") ?? "";
    if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("javascript:")) {
      return;
    }

    const frameUrl = frame.contentWindow?.location?.href || frame.src;
    const targetUrl = new URL(anchor.href || rawHref, frameUrl);
    if (isSamePageAnchorNavigation(frameUrl, targetUrl.href)) {
      return;
    }

    if (targetUrl.protocol === "http:" || targetUrl.protocol === "https:") {
      event.preventDefault();
      await window.wikiwise.openExternalUrl(targetUrl.href);
      return;
    }

    if (targetUrl.protocol !== "file:") return;

    event.preventDefault();
    const result = await window.wikiwise.resolvePreviewNavigation({
      projectRoot: state.currentProject.projectRoot,
      url: targetUrl.href
    });
    await navigateFromPreviewResult(result);
  } catch (error) {
    setError(error);
  }
}

function isSamePageAnchorNavigation(currentUrl, targetUrl) {
  try {
    const current = new URL(currentUrl);
    const target = new URL(targetUrl, current);
    const hasAnchor = target.hash.length > 0;
    current.hash = "";
    target.hash = "";
    return hasAnchor && current.href === target.href;
  } catch {
    return false;
  }
}

async function navigateFromPreviewResult(result) {
  if (!result) return;

  if (result.kind === "external" && result.url) {
    await window.wikiwise.openExternalUrl(result.url);
    return;
  }

  if (result.kind === "generated") {
    showGeneratedPage(result);
    return;
  }

  if (result.kind === "file") {
    await selectFile({ path: result.path, name: result.name });
  }
}

function toggleRightSidebar() {
  state.isRightSidebarVisible = !state.isRightSidebarVisible;
  renderRightSidebar();
  renderProjectToolbar();
}

function toggleLeftSidebar() {
  state.isLeftSidebarVisible = !state.isLeftSidebarVisible;
  renderProjectToolbar();
  window.requestAnimationFrame(() => fitTerminal());
}

function handleAppCommand(payload) {
  const command = typeof payload === "string" ? payload : payload?.command;
  if (command === "openExisting") {
    openExisting();
  } else if (command === "goBack") {
    navigateBack();
  } else if (command === "goForward") {
    navigateForward();
  } else if (command === "refreshWiki") {
    refreshCurrentView();
  }
}

async function startProjectServices() {
  await startProjectWatcher();
  await startTerminal();
  await refreshDocumentInfo();
  await refreshPublishConfig();
}

async function refreshPublishConfig() {
  if (!state.currentProject) {
    state.publishConfig = null;
    renderPublishStatus();
    return null;
  }

  const config = await window.wikiwise.getPublishConfig({
    projectRoot: state.currentProject.projectRoot
  });
  state.publishConfig = config;
  renderPublishStatus();
  return config;
}

async function openPublishDialog() {
  if (!state.currentProject) return;

  setError(null);
  state.publishError = null;
  const config = state.publishConfig ?? (await refreshPublishConfig());
  state.publishSubdomain = config?.published ? config.subdomain : (config?.suggestedSubdomain ?? "");
  state.publishAvailability = config?.published ? "owned" : "unknown";
  state.isPublishDialogOpen = true;
  renderPublishDialog();

  if (!config?.published && state.publishSubdomain) {
    scheduleAvailabilityCheck();
  }
}

function closePublishDialog() {
  if (state.isPublishing || state.isUnpublishing) return;

  state.isPublishDialogOpen = false;
  renderPublishDialog();
}

function dismissPublishResult() {
  state.publishResult = null;
  renderPublishFeedback();
}

function dismissPublishError() {
  state.publishError = null;
  renderPublishFeedback();
  renderPublishStatus();
}

async function openPublishedUrl() {
  const url = state.publishResult?.url;
  if (!url) return;

  try {
    await window.wikiwise.openExternalUrl(url);
    dismissPublishResult();
  } catch (error) {
    setError(error);
  }
}

function renderPublishDialog() {
  publishDialog.hidden = !state.isPublishDialogOpen;
  if (!state.isPublishDialogOpen) return;

  if (document.activeElement !== publishSubdomainInput) {
    publishSubdomainInput.value = state.publishSubdomain;
  }
  publishUrl.textContent = `https://${state.publishSubdomain || "subdomain"}.wiki-wise.com`;
  publishAvailability.textContent = availabilityMessage(state.publishAvailability);
  publishAvailability.dataset.state = state.publishAvailability;
  publishSubdomainInput.disabled = state.isPublishing || state.isUnpublishing;
  cancelPublishButton.disabled = state.isPublishing || state.isUnpublishing;
  confirmPublishButton.disabled = !canPublish();
  confirmPublishButton.textContent = state.isPublishing
    ? "Publishing"
    : state.publishConfig?.published
      ? "Update"
      : "Publish";
  unpublishButton.hidden = !state.publishConfig?.published;
  unpublishButton.disabled = state.isPublishing || state.isUnpublishing;
  unpublishButton.textContent = state.isUnpublishing ? "Unpublishing" : "Unpublish…";
}

function availabilityMessage(availability) {
  switch (availability) {
  case "available":
    return "Anyone with this link can view your wiki.";
  case "owned":
    return "You already own this name.";
  case "taken":
    return "This name is already taken. Try another.";
  case "invalid":
    return "3–48 characters, letters, numbers, and hyphens only.";
  case "checking":
    return "Anyone with this link can view your wiki.";
  default:
    return "Anyone with this link can view your wiki.";
  }
}

function canPublish() {
  return (
    state.currentProject &&
    !state.isPublishing &&
    !state.isUnpublishing &&
    ["available", "owned"].includes(state.publishAvailability)
  );
}

function sanitizePublishSubdomain(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 48);
}

function scheduleAvailabilityCheck() {
  if (state.availabilityCheckTimer) {
    clearTimeout(state.availabilityCheckTimer);
    state.availabilityCheckTimer = null;
  }

  const subdomain = state.publishSubdomain;
  if (!subdomain) {
    state.publishAvailability = "unknown";
    renderPublishDialog();
    return;
  }
  if (subdomain.length < 3) {
    state.publishAvailability = "invalid";
    renderPublishDialog();
    return;
  }

  state.publishAvailability = "checking";
  renderPublishDialog();
  state.availabilityCheckTimer = setTimeout(() => {
    state.availabilityCheckTimer = null;
    checkPublishAvailability(subdomain);
  }, 400);
}

async function checkPublishAvailability(subdomain = state.publishSubdomain) {
  if (!state.currentProject) return;

  try {
    const result = await window.wikiwise.checkPublishAvailability({
      projectRoot: state.currentProject.projectRoot,
      subdomain
    });
    if (state.publishSubdomain === subdomain) {
      state.publishAvailability = result.availability;
      renderPublishDialog();
    }
  } catch (error) {
    state.publishAvailability = "unknown";
    renderPublishDialog();
    setError(error);
  }
}

async function publishCurrentProject() {
  if (!canPublish()) return;

  state.isPublishing = true;
  state.publishError = null;
  state.publishResult = null;
  renderPublishDialog();
  renderPublishStatus();

  try {
    const result = await window.wikiwise.publishSite({
      projectRoot: state.currentProject.projectRoot,
      subdomain: state.publishSubdomain
    });
    state.publishResult = result;
    state.isPublishDialogOpen = false;
    await refreshPublishConfig();
  } catch (error) {
    state.publishError = error instanceof Error ? error.message : String(error);
  } finally {
    state.isPublishing = false;
    renderPublishDialog();
    renderPublishStatus();
  }
}

function openUnpublishConfirmation() {
  if (!state.currentProject || !state.publishConfig?.published) return;

  state.isPublishDialogOpen = false;
  state.isUnpublishConfirmOpen = true;
  renderPublishDialog();
  renderPublishFeedback();
}

function closeUnpublishConfirmation() {
  if (state.isUnpublishing) return;

  state.isUnpublishConfirmOpen = false;
  renderPublishFeedback();
}

async function confirmUnpublish() {
  if (!state.currentProject || !state.publishConfig?.published) return;

  state.isUnpublishing = true;
  state.publishError = null;
  renderPublishFeedback();

  try {
    await window.wikiwise.unpublishSite({
      projectRoot: state.currentProject.projectRoot
    });
    state.publishConfig = await refreshPublishConfig();
    state.publishAvailability = "unknown";
    state.isPublishDialogOpen = false;
    state.isUnpublishConfirmOpen = false;
  } catch (error) {
    state.publishError = error instanceof Error ? error.message : String(error);
  } finally {
    state.isUnpublishing = false;
    renderPublishDialog();
    renderPublishStatus();
    renderPublishFeedback();
  }
}

async function startProjectWatcher() {
  if (state.projectWatcherCleanup) {
    state.projectWatcherCleanup();
    state.projectWatcherCleanup = null;
  }
  if (!state.currentProject) {
    await window.wikiwise.stopProjectWatcher();
    return;
  }

  const cleanup = window.wikiwise.onProjectChanged(handleProjectChanged);
  try {
    await window.wikiwise.startProjectWatcher({
      projectRoot: state.currentProject.projectRoot
    });
    state.projectWatcherCleanup = cleanup;
  } catch (error) {
    cleanup();
    throw error;
  }
}

async function startTerminal() {
  if (state.terminalOutputCleanup) {
    state.terminalOutputCleanup();
    state.terminalOutputCleanup = null;
  }
  if (!state.currentProject) {
    await window.wikiwise.stopTerminal();
    state.terminalInstance?.clear?.();
    renderTerminalTab();
    return;
  }

  const terminalInstance = await ensureTerminalInstance();
  terminalInstance.clear();
  terminalInstance.writeln("Starting shell...");
  window.__wikiwiseTerminalText = "Starting shell...\n";
  const cleanup = window.wikiwise.onTerminalOutput(handleTerminalOutput);
  try {
    await window.wikiwise.startTerminal({
      projectRoot: state.currentProject.projectRoot,
      cols: terminalInstance.cols,
      rows: terminalInstance.rows
    });
    await sendTerminalResize();
    state.terminalOutputCleanup = cleanup;
  } catch (error) {
    cleanup();
    throw error;
  }
}

function disposeTerminalView() {
  clearTimeout(state.terminalResizeTimer);
  state.terminalResizeObserver?.disconnect();
  state.terminalResizeObserver = null;
}

function handleTerminalOutput(output) {
  if (!state.currentProject || output.projectRoot !== state.currentProject.projectRoot) {
    return;
  }

  ensureTerminalInstance()
    .then((terminalInstance) => {
      window.__wikiwiseTerminalText = `${window.__wikiwiseTerminalText ?? ""}${output.data}`.slice(-4000);
      terminalInstance.write(output.data);
    })
    .catch(setError);
}

async function sendTerminalInput() {
  if (!state.currentProject || !state.terminalInstance) return;
  state.terminalInstance.focus();
}

async function refreshDocumentInfo() {
  const file = state.selectedFile;
  if (!state.currentProject || !file?.path || !isMarkdownFile(file.path)) {
    state.documentInfo = null;
    renderInfoTab();
    return null;
  }

  const selectedPath = file.path;
  try {
    const info = await window.wikiwise.getDocumentInfo({
      projectRoot: state.currentProject.projectRoot,
      filePath: selectedPath
    });

    if (state.selectedFile?.path === selectedPath) {
      state.documentInfo = info;
      renderInfoTab();
    }
    return info;
  } catch (error) {
    if (state.selectedFile?.path === selectedPath) {
      state.documentInfo = null;
      renderInfoTab();
    }
    setError(error);
    return null;
  }
}

async function handleProjectChanged(change) {
  if (!state.currentProject || change.projectRoot !== state.currentProject.projectRoot) {
    return;
  }

  const currentFile = state.selectedFile;
  const currentPath = currentFile?.path;
  const currentMarkdownSelected = Boolean(currentPath && isMarkdownFile(currentPath));
  const changedMarkdownPaths = change.changedMarkdownPaths ?? [];
  const selectedMarkdownChanged =
    currentMarkdownSelected && changedMarkdownPaths.includes(currentPath);
  const generatedPageActive = Boolean(state.generatedPage?.name);
  const generatedOutputChanged =
    generatedPageActive &&
    (change.kind === "rebuild" || change.cssChanged || changedMarkdownPaths.length > 0);

  try {
    if (change.kind === "structure" || change.kind === "rebuild") {
      const previousExpandedPaths = new Set(state.expandedTreePaths);
      state.tree = normalizeTreeNodes(await window.wikiwise.scanProject(state.currentProject.projectRoot));
      await restoreExpandedTree(previousExpandedPaths);
    }

    if (generatedOutputChanged) {
      await refreshGeneratedPage();
    }

    if (selectedMarkdownChanged && state.selectedFile && !state.selectedFile.isDirty) {
      const content = await window.wikiwise.readFile(currentPath);
      if (state.selectedFile?.path === currentPath) {
        state.selectedFile.content = content;
        state.selectedFile.draftContent = content;
        state.selectedFile.lastSavedContent = content;
        state.selectedFile.isDirty = false;
        renderDetail();
      }
    }

    if (
      currentMarkdownSelected &&
      (change.kind === "rebuild" || change.cssChanged || selectedMarkdownChanged)
    ) {
      await refreshSelectedMarkdown({
        invalidate: true,
        reloadCSS: Boolean(change.cssChanged)
      });
    }

    if (currentMarkdownSelected && (change.kind === "rebuild" || selectedMarkdownChanged)) {
      await refreshDocumentInfo();
    }
  } catch (error) {
    setError(error);
  }
}

async function refreshSelectedMarkdown(options = {}) {
  const file = state.selectedFile;
  if (!state.currentProject || !file || !isMarkdownFile(file.path)) return null;

  const refreshedPath = file.path;
  const compiled = await compileMarkdownPreview(refreshedPath, {
    invalidate: Boolean(options.invalidate),
    reloadCSS: Boolean(options.reloadCSS)
  });
  if (state.selectedFile?.path === refreshedPath) {
    state.selectedFile.compiled = compiled;
    renderDetail();
  }
  return compiled;
}

function compileMarkdownPreview(filePath, options = {}) {
  return window.wikiwise.compilePage({
    projectRoot: state.currentProject.projectRoot,
    filePath,
    invalidate: Boolean(options.invalidate),
    reloadCSS: Boolean(options.reloadCSS)
  });
}

function formatEditedTime(modifiedAt) {
  const date = new Date(modifiedAt);
  const deltaSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(deltaSeconds);
  const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  if (absoluteSeconds < 60) return relativeFormatter.format(deltaSeconds, "second");
  if (absoluteSeconds < 3600) return relativeFormatter.format(Math.round(deltaSeconds / 60), "minute");
  if (absoluteSeconds < 86400) return relativeFormatter.format(Math.round(deltaSeconds / 3600), "hour");
  if (absoluteSeconds < 604800) return relativeFormatter.format(Math.round(deltaSeconds / 86400), "day");

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function renderSaveState() {
  const file = state.selectedFile;

  saveButton.disabled = state.showPostCreateGuide || state.generatedPage || !file || !file.isDirty || file.isSaving;
  if (!file) {
    saveStatus.textContent = "";
  } else if (file.isSaving) {
    saveStatus.textContent = "Saving";
  } else if (file.isDirty) {
    saveStatus.textContent = "Unsaved";
  } else {
    saveStatus.textContent = "Saved";
  }
}

function readEditorContent() {
  return sourceEditorFrame.contentWindow?.getContent?.() ?? state.selectedFile?.draftContent ?? "";
}

function captureEditorScrollFraction() {
  if (!state.selectedFile || !state.sourceEditorFrameReady) return;

  const fraction = sourceEditorFrame.contentWindow?.__getScrollFraction?.();
  if (Number.isFinite(fraction)) {
    state.selectedFile.scrollFraction = fraction;
  }
}

function syncEditorContentToSelectedFile() {
  const file = state.selectedFile;
  if (!file) return;

  if (state.sourceEditorFrameReady && !sourceEditorFrame.hidden) {
    file.draftContent = readEditorContent();
    state.editorLoadedContent = file.draftContent;
  }
}

function handleEditorContentChanged(content) {
  const file = state.selectedFile;
  if (!file) return;

  file.draftContent = String(content ?? "");
  state.editorLoadedContent = file.draftContent;
  file.isDirty = file.draftContent !== file.lastSavedContent;
  renderSaveState();
  scheduleAutosave();
}

function handleEditorMessage(event) {
  if (event.source !== sourceEditorFrame.contentWindow) return;

  if (event.data?.type === "wikiwise:editorReady") {
    state.sourceEditorFrameReady = true;
    renderSourceEditor(state.selectedFile);
  }
  if (event.data?.type === "wikiwise:editorContentChanged") {
    handleEditorContentChanged(event.data.payload);
  }
}

function scheduleAutosave() {
  clearAutosave();
  if (!state.selectedFile?.isDirty) return;

  state.autosaveTimer = setTimeout(() => {
    state.autosaveTimer = null;
    saveSelectedFile({ reason: "debounce" });
  }, 500);
}

async function saveSelectedFile() {
  const file = state.selectedFile;
  if (!file || !file.isDirty || file.isSaving) return;

  clearAutosave();
  syncEditorContentToSelectedFile();
  const savedPath = file.path;
  const savedContent = file.draftContent;

  file.isSaving = true;
  renderSaveState();
  setError(null);

  try {
    const result = await window.wikiwise.saveFile({
      projectRoot: state.currentProject.projectRoot,
      filePath: savedPath,
      content: savedContent
    });

    if (state.selectedFile?.path !== savedPath) return;

    state.selectedFile.content = savedContent;
    state.selectedFile.lastSavedContent = savedContent;
    state.selectedFile.isDirty = state.selectedFile.draftContent !== savedContent;
    state.selectedFile.compiled = result.compiled ?? state.selectedFile.compiled;
    state.selectedFile.isSaving = false;

    renderDetail();
    if (state.selectedFile.isDirty) {
      scheduleAutosave();
    }
    if (isMarkdownFile(savedPath) && result.compiled && state.detailMode === "wiki") {
      renderPreview();
    }
    if (isMarkdownFile(savedPath)) {
      await refreshDocumentInfo();
    }
  } catch (error) {
    if (state.selectedFile?.path === savedPath) {
      state.selectedFile.isSaving = false;
      renderSaveState();
    }
    setError(error);
  }
}

function hasCompiledPreview(file) {
  return Boolean(file?.compiled?.fileUrl && (file.compiled.ok || file.compiled.success));
}

function isMarkdownFile(filePath) {
  return /\.md$/i.test(filePath);
}

async function bootApp() {
  renderApp();
  await loadEditorResource();
  await loadAppSettings();
  await restoreLastProject();
  state.appCommandCleanup = window.wikiwise.onAppCommand(handleAppCommand);
}

bootApp();

openExistingButton.addEventListener("click", openExisting);
window.addEventListener("message", handleEditorMessage);
window.addEventListener("beforeunload", disposeTerminalView);
window.addEventListener("resize", () => {
  applyLeftSidebarWidth();
  applyRightSidebarWidth();
  fitTerminal();
});
saveButton.addEventListener("click", () => saveSelectedFile({ reason: "button" }));
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveSelectedFile({ reason: "keyboard" });
  }
});
modeFileButton.addEventListener("click", () => setDetailMode("file"));
modeWikiButton.addEventListener("click", () => setDetailMode("wiki"));
previewFrame.addEventListener("load", () => attachPreviewNavigation(previewFrame));
generatedPreviewFrame.addEventListener("load", () => attachPreviewNavigation(generatedPreviewFrame));
publishButton.addEventListener("click", openPublishDialog);
goBackButton.addEventListener("click", navigateBack);
goForwardButton.addEventListener("click", navigateForward);
toggleLeftSidebarButton.addEventListener("click", toggleLeftSidebar);
leftSidebarResizeHandle.addEventListener("pointerdown", startLeftSidebarResize);
leftSidebarResizeHandle.addEventListener("pointermove", updateLeftSidebarResize);
leftSidebarResizeHandle.addEventListener("pointerup", endLeftSidebarResize);
leftSidebarResizeHandle.addEventListener("pointercancel", endLeftSidebarResize);
appearanceModeButton.addEventListener("click", cycleAppearanceMode);
openMapButton.addEventListener("click", openMap);
toggleRightSidebarButton.addEventListener("click", toggleRightSidebar);
rightSidebarResizeHandle.addEventListener("pointerdown", startRightSidebarResize);
rightSidebarResizeHandle.addEventListener("pointermove", updateRightSidebarResize);
rightSidebarResizeHandle.addEventListener("pointerup", endRightSidebarResize);
rightSidebarResizeHandle.addEventListener("pointercancel", endRightSidebarResize);
rightTabInfoButton.addEventListener("click", () => setRightSidebarTab("info"));
rightTabTerminalButton.addEventListener("click", () => setRightSidebarTab("terminal"));
createNewButton.addEventListener("click", openNewWikiDialog);
publishSubdomainInput.addEventListener("input", () => {
  const sanitized = sanitizePublishSubdomain(publishSubdomainInput.value);
  if (publishSubdomainInput.value !== sanitized) {
    publishSubdomainInput.value = sanitized;
  }
  state.publishSubdomain = sanitized;
  scheduleAvailabilityCheck();
});
cancelPublishButton.addEventListener("click", closePublishDialog);
confirmPublishButton.addEventListener("click", publishCurrentProject);
unpublishButton.addEventListener("click", openUnpublishConfirmation);
openPublishResultButton.addEventListener("click", openPublishedUrl);
dismissPublishResultButton.addEventListener("click", dismissPublishResult);
dismissPublishErrorButton.addEventListener("click", dismissPublishError);
cancelUnpublishButton.addEventListener("click", closeUnpublishConfirmation);
confirmUnpublishButton.addEventListener("click", confirmUnpublish);
newWikiNameInput.addEventListener("input", () => {
  state.newWikiName = newWikiNameInput.value;
  renderNewWikiDialog();
});
chooseNewWikiLocationButton.addEventListener("click", chooseNewWikiLocation);
cancelCreateNewButton.addEventListener("click", closeNewWikiDialog);
confirmCreateNewButton.addEventListener("click", createNewWiki);
dismissPostCreateGuideButton.addEventListener("click", dismissPostCreateGuide);
