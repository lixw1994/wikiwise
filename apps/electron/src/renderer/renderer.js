const welcome = document.querySelector("#welcome");
const project = document.querySelector("#project");
const fileTree = document.querySelector("#file-tree");
const selectedFileLabel = document.querySelector("#selected-file");
const detailEmptyState = document.querySelector("#detail-empty-state");
const sourceEditorFrame = document.querySelector("#source-editor-frame");
const previewFrame = document.querySelector("#preview-frame");
const generatedPreviewFrame = document.querySelector("#generated-preview-frame");
const saveButton = document.querySelector("#save-file");
const saveStatus = document.querySelector("#save-status");
const publishButton = document.querySelector("#publish-wiki");
const publishBusyIndicator = document.querySelector("#publish-busy-indicator");
const publishLabel = document.querySelector("#publish-label");
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
const infoAboutSection = document.querySelector("#info-about-section");
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
const newWikiTranslationTargetSelect = document.querySelector("#new-wiki-translation-target");
const newWikiLocationLabel = document.querySelector("#new-wiki-location");
const chooseNewWikiLocationButton = document.querySelector("#choose-new-wiki-location");
const cancelCreateNewButton = document.querySelector("#cancel-create-new");
const confirmCreateNewButton = document.querySelector("#confirm-create-new");
const publishDialog = document.querySelector("#publish-dialog");
const publishTargetOfficialButton = document.querySelector("#publish-target-official");
const publishTargetCloudflareHubButton = document.querySelector("#publish-target-cloudflare-hub");
const publishOfficialFields = document.querySelector("#publish-official-fields");
const publishHubFields = document.querySelector("#publish-hub-fields");
const publishSubdomainInput = document.querySelector("#publish-subdomain");
const publishAvailability = document.querySelector("#publish-availability");
const publishAvailabilityIndicator = document.querySelector("#publish-availability-indicator");
const publishHubEndpointInput = document.querySelector("#publish-hub-endpoint");
const publishHubTokenInput = document.querySelector("#publish-hub-token");
const publishHubSlugInput = document.querySelector("#publish-hub-slug");
const publishHubUrlPreviewElement = document.querySelector("#publish-hub-url-preview");
const publishHubVisibilitySelect = document.querySelector("#publish-hub-visibility");
const publishHubAuthRealmSelect = document.querySelector("#publish-hub-auth-realm");
const publishHubCommentPolicySelect = document.querySelector("#publish-hub-comment-policy");
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
const FOLDER_ICON_PATH = "M0.5 2.5 C0.5 1.4 1.4 0.5 2.5 0.5 L5 0.5 L6.5 2.5 L11.5 2.5 C12.6 2.5 13.5 3.4 13.5 4.5 L13.5 9.5 C13.5 10.6 12.6 11.5 11.5 11.5 L2.5 11.5 C1.4 11.5 0.5 10.6 0.5 9.5 Z";
const newWikiLocationDisplayLimit = 48;
const missingInfoValue = "—";
const systemDarkAppearanceQuery = window.matchMedia("(prefers-color-scheme: dark)");
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
    glyph: "▤"
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
  detailMode: "wiki",
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
  editorResourceUrl: "",
  sourceEditorFrameReady: false,
  editorLoadedFilePath: "",
  editorLoadedContent: "",
  projectWatcherCleanup: null,
  terminalOutputCleanup: null,
  documentInfo: null,
  terminalInstance: null,
  terminalFitAddon: null,
  terminalCursorOverlay: null,
  terminalFocused: false,
  terminalSessionProjectRoot: null,
  terminalStartPromise: null,
  terminalResizeObserver: null,
  terminalResourcesLoaded: false,
  terminalResizeTimer: null,
  publishConfig: null,
  isPublishDialogOpen: false,
  publishTarget: "official",
  publishSubdomain: "",
  publishAvailability: "unknown",
  publishHubEndpoint: "https://hub.wiki.flybullet.net",
  publishHubToken: "",
  publishHubSlug: "",
  publishHubVisibility: "public",
  publishHubAuthRealm: "shared",
  publishHubCommentPolicy: "login-required",
  isPublishing: false,
  isUnpublishing: false,
  publishResult: null,
  publishError: null,
  isUnpublishConfirmOpen: false,
  availabilityCheckTimer: null,
  isNewWikiDialogOpen: false,
  newWikiName: "",
  newWikiTranslationTargetLanguage: "",
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

function isProjectFolder() {
  return Boolean(state.currentProject && state.currentProject.projectKind !== "file");
}

function middleTruncatePath(pathValue, maxLength = newWikiLocationDisplayLimit) {
  if (!pathValue) return "";
  const pathCharacters = Array.from(pathValue);
  if (pathCharacters.length <= maxLength) return pathValue;
  if (maxLength <= 1) return "…";

  const availableLength = maxLength - 1;
  const headLength = Math.ceil(availableLength / 2);
  const tailLength = Math.floor(availableLength / 2);
  return `${pathCharacters.slice(0, headLength).join("")}…${pathCharacters.slice(-tailLength).join("")}`;
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

function loadStylesheetOnce(id, href) {
  if (scriptLoadPromises.has(id)) return scriptLoadPromises.get(id);

  const existingLink = document.getElementById(id);
  if (existingLink) {
    if (existingLink.sheet) return Promise.resolve();

    const existingLoadPromise = new Promise((resolve, reject) => {
      existingLink.addEventListener("load", () => resolve(), { once: true });
      existingLink.addEventListener("error", () => reject(new Error(`Failed to load ${href}`)), { once: true });
    });
    scriptLoadPromises.set(id, existingLoadPromise);
    return existingLoadPromise;
  }

  const loadPromise = new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load ${href}`));
    document.head.append(link);
  });
  scriptLoadPromises.set(id, loadPromise);
  return loadPromise;
}

async function loadTerminalResources() {
  if (state.terminalResourcesLoaded) return;

  const resource = await window.wikiwise.getTerminalResource();
  await loadStylesheetOnce("wikiwise-terminal-css", resource.xtermCssUrl);
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
    const disclosure = document.createElement("span");
    const folderIcon = document.createElement("span");
    const label = document.createElement("span");

    button.className = "tree-row tree-folder-button";
    button.title = folderTooltip(node.name);
    button.setAttribute("aria-expanded", String(isExpanded));
    disclosure.className = "tree-disclosure";
    disclosure.textContent = isExpanded ? "▾" : "▸";
    folderIcon.className = "tree-folder-icon";
    folderIcon.setAttribute("aria-hidden", "true");
    const folderSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const folderShape = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const folderDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    folderSvg.classList.add("tree-folder-svg");
    folderSvg.setAttribute("viewBox", "0 0 14 12");
    folderSvg.setAttribute("focusable", "false");
    folderShape.classList.add("tree-folder-shape");
    folderShape.setAttribute("d", FOLDER_ICON_PATH);
    folderDot.classList.add("tree-folder-dot");
    folderDot.setAttribute("cx", "7");
    folderDot.setAttribute("cy", "7");
    folderDot.setAttribute("r", "1.5");
    folderSvg.append(folderShape, folderDot);
    folderIcon.append(folderSvg);
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
    return "Wiki pages — your editable knowledge base";
  case "sources":
    return "Source summaries — one page per ingested source";
  case "raw":
    return "Raw source documents — read-only originals";
  case "site":
    return "Build tooling and compiled HTML output";
  default:
    return name;
  }
}

async function toggleTreeFolder(node) {
  if (!node?.isDirectory) return;
  if (state.treeLoadingPaths.has(node.path)) return;

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

function findWikiHomeNode() {
  const wikiFolder = state.tree.find((node) => node.isDirectory && node.name === "wiki");
  return wikiFolder?.children?.find((node) => !node.isDirectory && node.name === "home.md") ?? null;
}

async function restoreExpandedTree(previousExpandedPaths) {
  const topLevelExpandedPaths = new Set(
    state.tree.filter((node) => node.isDirectory && previousExpandedPaths.has(node.path)).map((node) => node.path)
  );
  state.expandedTreePaths = new Set();

  for (const folderPath of topLevelExpandedPaths) {
    const node = findTreeNodeByPath(state.tree, folderPath);
    if (node?.isDirectory) {
      await expandProjectTreeFolder(node, { render: false });
    }
  }

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
  const isActiveFileReselect = state.selectedFile?.path === node.path;
  if (options.pushHistory !== false && !isActiveFileReselect) {
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

    setSelectedFile(nextFile, {
      preserveDetailMode: options.preserveDetailMode !== false
    });
    await setActiveSelectedFile(nextFile.path);
    renderTree(state.tree);
    renderProjectToolbar();
    await refreshDocumentInfo();
  } catch (error) {
    setError(error);
  }
}

function setSelectedFile(file, options = {}) {
  captureEditorScrollFraction();
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
  state.detailMode = detailModeForSelectedFile(file, options);
  renderDetail();
}

function detailModeForSelectedFile(file, options = {}) {
  if (!file) return "wiki";
  if (options.preserveDetailMode) return state.detailMode;
  if (!isMarkdownFile(file.path)) return state.detailMode;
  return "wiki";
}

async function setActiveSelectedFile(filePath = state.selectedFile?.path) {
  if (!state.currentProject || !filePath) return null;
  return window.wikiwise.setActiveFile({
    projectRoot: state.currentProject.projectRoot,
    filePath
  }).catch(() => null);
}

function setDetailMode(mode) {
  if (state.detailMode === "file" && mode !== "file") {
    captureEditorScrollFraction();
  } else if (state.detailMode === "wiki" && mode !== "wiki") {
    capturePreviewScrollFraction();
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
  const shouldShowEmptyState = !showGuide && !hasGeneratedPage && !hasFile;
  const shouldShowSourceEditor =
    !showGuide &&
    !hasGeneratedPage &&
    hasFile &&
    (state.detailMode === "file" || (state.detailMode === "wiki" && !wikiAvailable));
  const shouldShowPreview =
    !showGuide &&
    !hasGeneratedPage &&
    state.detailMode === "wiki" &&
    wikiAvailable;

  selectedFileLabel.textContent = showGuide
    ? "Your wiki is ready"
    : (state.generatedPage?.name ?? file?.name ?? "Select a file to read");

  modeFileButton.classList.toggle("selected", state.detailMode === "file");
  modeWikiButton.classList.toggle("selected", state.detailMode === "wiki");

  detailEmptyState.hidden = !shouldShowEmptyState;
  sourceEditorFrame.hidden = !shouldShowSourceEditor;
  previewFrame.hidden = !shouldShowPreview;
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
  } else if (shouldShowPreview) {
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
  const file = state.selectedFile;
  if (!file?.compiled?.fileUrl) return;

  if (!previewFrame.hidden && previewFrame.getAttribute("src") === file.compiled.fileUrl) {
    capturePreviewScrollFraction();
  }

  previewFrame.src = file.compiled.fileUrl;
}

function refreshVisiblePreviewForAppearanceChange() {
  let didReload = false;

  if (!previewFrame.hidden && state.selectedFile?.compiled?.fileUrl) {
    renderPreview();
    didReload = true;
  }

  if (!generatedPreviewFrame.hidden) {
    const generatedSource = generatedPreviewFrame.getAttribute("src");
    if (generatedSource) {
      generatedPreviewFrame.src = generatedSource;
      didReload = true;
    }
  }

  return didReload;
}

function publishButtonHelpText() {
  if (state.publishConfig?.published && state.publishConfig.url) {
    return `Last published: ${state.publishConfig.lastPublishedAt ?? "never"}\n${state.publishConfig.url}\n⌥-click to change URL`;
  }

  return "Publish wiki to wiki-wise.com";
}

function renderPublishStatus() {
  const publishHelpText = publishButtonHelpText();
  const publishBusy = state.isPublishing || state.isUnpublishing;
  publishButton.disabled = !isProjectFolder() || publishBusy;
  publishBusyIndicator.hidden = !publishBusy;
  publishLabel.textContent = publishBusy ? "PUBLISHING…" : "PUBLISH ↑";
  publishButton.title = publishHelpText;
  publishButton.setAttribute("aria-label", publishHelpText);
  renderPublishFeedback();
}

function publishResultMessageText(result) {
  if (!result) return "";

  if (result.target === "cloudflare-hub") {
    return `Your Cloudflare Hub wiki is live at ${result.url}\n\nA publish.json file has been saved to your project. Keep it safe — it’s your key to update this site.`;
  }

  return result.isFirstPublish
    ? `Your wiki is live at ${result.url}\n\nA publish.json file has been saved to your project. Keep it safe — it’s your key to update this site.`
    : `Updated ${result.url}`;
}

function renderPublishFeedback() {
  const result = state.publishResult;
  publishResultDialog.hidden = !result;
  publishResultMessage.textContent = publishResultMessageText(result);
  publishResultUrl.hidden = true;
  publishResultUrl.textContent = "";
  openPublishResultButton.disabled = !result?.url;

  publishErrorDialog.hidden = !state.publishError;
  publishErrorMessage.textContent = state.publishError ?? "";

  unpublishConfirmDialog.hidden = !state.isUnpublishConfirmOpen;
  confirmUnpublishButton.disabled = state.isUnpublishing;
  confirmUnpublishButton.textContent = "Unpublish";
}

function renderProjectToolbar() {
  goBackButton.disabled = state.backHistory.length === 0;
  goForwardButton.disabled = state.forwardHistory.length === 0;
  setToolbarButtonSymbol(appearanceModeButton, toolbarSymbols[state.appearanceMode] ?? toolbarSymbols.Auto);
  setToolbarButtonSymbol(openMapButton, toolbarSymbols.map);
  setToolbarButtonSymbol(
    toggleRightSidebarButton,
    state.isRightSidebarVisible ? toolbarSymbols.rightSidebarVisible : toolbarSymbols.rightSidebarHidden
  );
  openMapButton.disabled = !state.currentProject;
  applyLeftSidebarWidth();
  toggleLeftSidebarButton.classList.toggle("selected", state.isLeftSidebarVisible);
  toggleLeftSidebarButton.setAttribute("aria-pressed", String(state.isLeftSidebarVisible));
  const leftSidebarHelpText = leftSidebarButtonHelpText();
  toggleLeftSidebarButton.dataset.nativeAffordance = leftSidebarNativeAffordance();
  toggleLeftSidebarButton.dataset.sidebarAction = leftSidebarAction();
  setToolbarButtonSymbol(toggleLeftSidebarButton, {
    ...toolbarSymbols.leftSidebar,
    label: leftSidebarHelpText
  });
  toggleLeftSidebarButton.title = leftSidebarHelpText;
  toggleLeftSidebarButton.setAttribute("aria-label", leftSidebarHelpText);
  toggleRightSidebarButton.classList.toggle("selected", state.isRightSidebarVisible);
  leftSidebar.hidden = !state.isLeftSidebarVisible;
  project.classList.toggle("left-sidebar-hidden", !state.isLeftSidebarVisible);
  project.classList.toggle("right-sidebar-hidden", !state.isRightSidebarVisible);
  updateToolbarTitleOffset();
  if (state.currentProject && state.isRightSidebarVisible) {
    applyRightSidebarWidth();
  }
}

function leftSidebarButtonHelpText() {
  return state.isLeftSidebarVisible ? "Hide Sidebar" : "Show Sidebar";
}

function leftSidebarNativeAffordance() {
  return state.isLeftSidebarVisible ? "system-split-view-toggle" : "custom-restore-control";
}

function leftSidebarAction() {
  return state.isLeftSidebarVisible ? "hide" : "show";
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
  const toolbarTitleOffset = state.isLeftSidebarVisible
    ? -Math.round(state.leftSidebarWidth / 2)
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
  if (tab === "terminal") {
    requestAnimationFrame(focusTerminalIfVisible);
  } else {
    setTerminalFocused(false);
    updateTerminalCursorOverlay();
  }
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

  const hasDocument = Boolean(file);
  infoAboutSection.hidden = !hasDocument;
  infoPath.textContent = hasDocument ? (info?.name ?? file.name) : "";
  infoEdited.textContent = hasDocument ? (info?.modifiedAt ? formatEditedTime(info.modifiedAt) : missingInfoValue) : "";
  infoWords.textContent = hasDocument ? (info ? formatWordCount(info.wordCount) : missingInfoValue) : "";

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
    if (isProjectFolder() && !state.terminalSessionProjectRoot) {
      startTerminal().catch(setError);
      return;
    }
    ensureTerminalInstance().catch(setError);
    fitTerminal();
  }
}

function focusTerminalIfVisible() {
  if (state.rightSidebarTab !== "terminal" || terminalPanel.hidden || !state.terminalInstance) return;
  state.terminalInstance.focus();
  setTerminalFocused(true);
  updateTerminalCursorOverlay();
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
    cursorBlink: false,
    cursorStyle: "block",
    cursorInactiveStyle: "outline",
    drawBoldTextInBrightColors: true,
    minimumContrastRatio: 1,
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
    sendTerminalData(input).catch(setError);
  });
  terminalSurface.addEventListener("focusin", handleTerminalFocusIn);
  terminalSurface.addEventListener("focusout", handleTerminalFocusOut);
  terminalInstance.onCursorMove(() => updateTerminalCursorOverlay());
  terminalInstance.onRender(() => updateTerminalCursorOverlay());

  state.terminalInstance = terminalInstance;
  state.terminalFitAddon = terminalFitAddon;
  window.__wikiwiseTerminal = terminalInstance;
  window.__wikiwiseTerminalText = "";
  ensureTerminalCursorOverlay();
  observeTerminalResize();
  fitTerminal();
  return terminalInstance;
}

function setTerminalFocused(focused) {
  state.terminalFocused = focused;
  terminalSurface.classList.toggle("terminal-focused", focused);
  updateTerminalCursorOverlay();
}

function handleTerminalFocusIn() {
  setTerminalFocused(true);
}

function handleTerminalFocusOut(event) {
  if (event.relatedTarget instanceof Node && terminalSurface.contains(event.relatedTarget)) return;

  requestAnimationFrame(() => {
    setTerminalFocused(terminalSurface.contains(document.activeElement));
  });
}

function observeTerminalResize() {
  if (state.terminalResizeObserver || !window.ResizeObserver) return;

  state.terminalResizeObserver = new ResizeObserver(() => fitTerminal());
  state.terminalResizeObserver.observe(terminalSurface);
}

function terminalTheme() {
  const isDark = resolvedAppearanceMode() === "Dark";

  return isDark
    ? {
        background: "#0E0C08",
        foreground: "#CFC3A3",
        cursor: "#80ADAD",
        cursorAccent: "#0E0C08",
        selectionBackground: "#C2A96B33",
        black: "#1E1B14",
        red: "#B85E5E",
        green: "#8DBB6B",
        yellow: "#C2A96B",
        blue: "#6B7FA3",
        magenta: "#A36B8F",
        cyan: "#75B8BC",
        white: "#A89A7C",
        brightBlack: "#6F6450",
        brightRed: "#D07070",
        brightGreen: "#A4D27A",
        brightYellow: "#D4BE80",
        brightBlue: "#8096B8",
        brightMagenta: "#B880A3",
        brightCyan: "#8ED0D4",
        brightWhite: "#F4EACF"
      }
    : {
        background: "#F3EDDE",
        foreground: "#5B5240",
        cursor: "#D6E8F7",
        cursorAccent: "#5B5240",
        selectionBackground: "#B89B5A33",
        black: "#3A2F1C",
        red: "#9B3D3D",
        green: "#5E8E3E",
        yellow: "#B89B5A",
        blue: "#5B6A8A",
        magenta: "#8A5B7A",
        cyan: "#2F7F83",
        white: "#D9CFB9",
        brightBlack: "#7A6E54",
        brightRed: "#B84E4E",
        brightGreen: "#6FA24F",
        brightYellow: "#C8AE6B",
        brightBlue: "#6B7FA3",
        brightMagenta: "#A36B8F",
        brightCyan: "#3F9CA1",
        brightWhite: "#F3EDDE"
      };
}

function applyTerminalTheme() {
  if (!state.terminalInstance) return;
  state.terminalInstance.options.theme = terminalTheme();
  updateTerminalCursorOverlay();
}

function ensureTerminalCursorOverlay() {
  if (state.terminalCursorOverlay) return state.terminalCursorOverlay;

  const overlay = document.createElement("div");
  overlay.className = "terminal-cursor-overlay";
  overlay.hidden = true;
  overlay.setAttribute("aria-hidden", "true");
  terminalSurface.append(overlay);
  state.terminalCursorOverlay = overlay;
  return overlay;
}

function updateTerminalCursorOverlay() {
  if (!state.terminalInstance) {
    if (state.terminalCursorOverlay) {
      state.terminalCursorOverlay.hidden = true;
    }
    return;
  }

  const overlay = ensureTerminalCursorOverlay();
  if (terminalPanel.hidden || state.rightSidebarTab !== "terminal" || !state.currentProject) {
    overlay.hidden = true;
    return;
  }

  const screen = terminalSurface.querySelector(".xterm-screen");
  const screenRect = screen?.getBoundingClientRect();
  const surfaceRect = terminalSurface.getBoundingClientRect();
  if (!screenRect || screenRect.width <= 0 || screenRect.height <= 0) {
    overlay.hidden = true;
    return;
  }

  const cols = Math.max(1, state.terminalInstance.cols || 0);
  const rows = Math.max(1, state.terminalInstance.rows || 0);
  const cellWidth = screenRect.width / cols;
  const cellHeight = screenRect.height / rows;
  const activeBuffer = state.terminalInstance.buffer?.active;
  const cursorX = Math.min(Math.max(activeBuffer?.cursorX ?? 0, 0), cols - 1);
  const cursorY = Math.min(Math.max(activeBuffer?.cursorY ?? 0, 0), rows - 1);

  overlay.style.left = `${screenRect.left - surfaceRect.left + cursorX * cellWidth}px`;
  overlay.style.top = `${screenRect.top - surfaceRect.top + cursorY * cellHeight}px`;
  overlay.style.width = `${Math.max(2, cellWidth)}px`;
  overlay.style.height = `${Math.max(2, cellHeight)}px`;
  overlay.hidden = false;
}

function fitTerminal() {
  if (!state.terminalInstance || !state.terminalFitAddon || terminalPanel.hidden) return;

  try {
    state.terminalFitAddon.fit();
    updateTerminalCursorOverlay();
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
    projectKind: projectResult.projectKind ?? "folder",
    projectName: projectResult.projectName
  };
  state.tree = normalizeTreeNodes(projectResult.tree);
  state.expandedTreePaths = new Set();
  state.treeLoadingPaths = new Set();
  if (options.showPostCreateGuide === true) {
    state.showPostCreateGuide = true;
  }
  state.generatedPage = null;
  if (isProjectFolder()) {
    state.backHistory = [];
    state.forwardHistory = [];
  }
  setSelectedFile(projectResult.selectedFile);

  renderApp();
  if (isProjectFolder()) {
    await autoExpandInitialTree();
  }
  await setActiveSelectedFile();
  await startProjectServices();
}

async function openNewWikiDialog() {
  setError(null);
  state.isNewWikiDialogOpen = true;
  state.newWikiName = "";
  state.newWikiTranslationTargetLanguage = "";
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

function handleNewWikiDialogKeydown(event) {
  if (!state.isNewWikiDialogOpen) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeNewWikiDialog();
    return;
  }

  if (event.key === "Enter") {
    if (event.target instanceof HTMLButtonElement) return;
    if (confirmCreateNewButton.disabled) return;

    event.preventDefault();
    createNewWiki();
  }
}

function renderNewWikiDialog() {
  newWikiDialog.hidden = !state.isNewWikiDialogOpen;
  if (!state.isNewWikiDialogOpen) return;

  if (document.activeElement !== newWikiNameInput) {
    newWikiNameInput.value = state.newWikiName;
  }
  if (document.activeElement !== newWikiTranslationTargetSelect) {
    newWikiTranslationTargetSelect.value = state.newWikiTranslationTargetLanguage;
  }
  const fullLocationPath = state.newWikiLocation || "~/wikis";
  newWikiLocationLabel.textContent = middleTruncatePath(fullLocationPath);
  newWikiLocationLabel.title = fullLocationPath;
  newWikiLocationLabel.setAttribute("aria-label", fullLocationPath);
  newWikiNameInput.disabled = false;
  newWikiTranslationTargetSelect.disabled = false;
  chooseNewWikiLocationButton.disabled = false;
  cancelCreateNewButton.disabled = false;
  confirmCreateNewButton.disabled = state.newWikiName.trim().length === 0;
  confirmCreateNewButton.textContent = "Create";
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
      parentDir: state.newWikiLocation,
      translationTargetLanguage: state.newWikiTranslationTargetLanguage
    });

    state.isNewWikiDialogOpen = false;
    await applyProjectResult(result.project, { showPostCreateGuide: true });
  } catch (error) {
    console.error(error);
    state.isNewWikiDialogOpen = false;
    state.showPostCreateGuide = false;
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

async function dismissPostCreateGuide() {
  state.showPostCreateGuide = false;
  const homeNode = findWikiHomeNode();
  if (homeNode) {
    await selectFile(homeNode, { pushHistory: false });
    return;
  }
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
  document.documentElement.dataset.resolvedAppearance = resolvedAppearanceMode();
  applyTerminalTheme();
}

function resolvedAppearanceMode() {
  if (state.appearanceMode === "Auto") {
    return systemDarkAppearanceQuery.matches ? "Dark" : "Light";
  }

  return state.appearanceMode;
}

function handleSystemAppearanceChange() {
  if (state.appearanceMode !== "Auto") return;
  applyAppearanceModeToDocument();
  renderProjectToolbar();
}

function watchSystemAppearanceChanges() {
  if (systemDarkAppearanceQuery.addEventListener) {
    systemDarkAppearanceQuery.addEventListener?.("change", handleSystemAppearanceChange);
  } else {
    systemDarkAppearanceQuery.addListener?.(handleSystemAppearanceChange);
  }
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
  refreshVisiblePreviewForAppearanceChange();
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
  if (!isProjectFolder()) return;

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
  if (!isProjectFolder() || !state.generatedPage?.name) return null;

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

async function reloadSelectedFileFromDisk(filePath) {
  const content = await window.wikiwise.readFile(filePath);
  if (state.selectedFile?.path === filePath) {
    state.selectedFile.content = content;
    state.selectedFile.draftContent = content;
    state.selectedFile.lastSavedContent = content;
    state.selectedFile.isDirty = false;
    renderDetail();
    await setActiveSelectedFile(filePath);
    await refreshDocumentInfo();
    return true;
  }
  return false;
}

async function refreshCurrentView() {
  if (!state.selectedFile?.path) return;
  if (isMarkdownFile(state.selectedFile.path)) {
    await refreshSelectedMarkdown({ invalidate: true });
    await refreshDocumentInfo();
    return;
  }

  const selectedPath = state.selectedFile.path;
  const content = await window.wikiwise.readFile(selectedPath);
  if (state.selectedFile?.path === selectedPath) {
    state.selectedFile.content = content;
    state.selectedFile.draftContent = content;
    state.selectedFile.lastSavedContent = content;
    state.selectedFile.isDirty = false;
    renderDetail();
    await setActiveSelectedFile(selectedPath);
    await refreshDocumentInfo();
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
    showGeneratedPage(result, {
      pushHistory: Boolean(state.selectedFile)
    });
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
  if (!state.currentProject || !isProjectFolder()) {
    state.publishConfig = null;
    renderPublishStatus();
    return null;
  }

  const config = await window.wikiwise.getPublishConfig({
    projectRoot: state.currentProject.projectRoot
  });
  state.publishConfig = config;
  applyPublishConfigDraft(config);
  renderPublishStatus();
  return config;
}

function applyPublishConfigDraft(config) {
  state.publishTarget = config?.target ?? "official";

  const hubDraft = config?.hub ?? defaultPublishHubDraft(
    config?.suggestedSubdomain ?? config?.subdomain ?? state.publishSubdomain
  );
  state.publishHubEndpoint = hubDraft.endpoint;
  state.publishHubToken = hubDraft.publishToken;
  state.publishHubSlug = hubDraft.slug;
  state.publishHubVisibility = hubDraft.visibility;
  state.publishHubAuthRealm = hubDraft.authRealm;
  state.publishHubCommentPolicy = hubDraft.commentPolicy;

  if (!state.publishHubSlug && state.publishSubdomain) {
    state.publishHubSlug = state.publishSubdomain;
  }
}

function defaultPublishHubDraft(suggestedSlug = "") {
  return {
    endpoint: "https://hub.wiki.flybullet.net",
    publishToken: "",
    slug: suggestedSlug,
    visibility: "public",
    authRealm: "shared",
    commentPolicy: "login-required"
  };
}

function publishHubUrlPreview() {
  if (!state.publishHubSlug) {
    return "https://<slug>.wiki.flybullet.net";
  }

  return `https://${state.publishHubSlug}.wiki.flybullet.net`;
}

function selectPublishTarget(target) {
  state.publishTarget = target === "cloudflare-hub" ? "cloudflare-hub" : "official";
  if (state.publishTarget === "cloudflare-hub") {
    state.publishAvailability = "owned";
  } else if (!["available", "owned"].includes(state.publishAvailability)) {
    scheduleAvailabilityCheck();
  }
  renderPublishDialog();
}

async function openPublishDialog() {
  if (!isProjectFolder()) return;

  setError(null);
  state.publishError = null;
  const config = state.publishConfig ?? (await refreshPublishConfig());
  applyPublishConfigDraft(config);
  let shouldCheckAvailability = false;
  if (config?.published) {
    state.publishSubdomain = config.subdomain;
    if (state.publishSubdomain === undefined) {
      state.publishSubdomain = "";
    }
    state.publishAvailability = "owned";
  } else if (!state.publishSubdomain) {
    state.publishSubdomain = config?.suggestedSubdomain ?? "";
    state.publishAvailability = "unknown";
    shouldCheckAvailability = Boolean(state.publishSubdomain);
  }
  state.isPublishDialogOpen = true;
  renderPublishDialog();

  if (shouldCheckAvailability) {
    scheduleAvailabilityCheck();
  }
}

function closePublishDialog() {
  if (state.isPublishing || state.isUnpublishing) return;

  state.isPublishDialogOpen = false;
  renderPublishDialog();
}

function handlePublishDialogKeydown(event) {
  if (!state.isPublishDialogOpen) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closePublishDialog();
    return;
  }

  if (event.key === "Enter") {
    if (event.target instanceof HTMLButtonElement) return;
    if (confirmPublishButton.disabled) return;

    event.preventDefault();
    publishCurrentProject();
  }
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

  const isCloudflareHub = state.publishTarget === "cloudflare-hub";
  publishTargetOfficialButton.dataset.selected = String(!isCloudflareHub);
  publishTargetCloudflareHubButton.dataset.selected = String(isCloudflareHub);
  publishTargetOfficialButton.setAttribute("aria-pressed", String(!isCloudflareHub));
  publishTargetCloudflareHubButton.setAttribute("aria-pressed", String(isCloudflareHub));
  publishOfficialFields.hidden = isCloudflareHub;
  publishHubFields.hidden = !isCloudflareHub;

  if (document.activeElement !== publishSubdomainInput) {
    publishSubdomainInput.value = state.publishSubdomain;
  }
  if (document.activeElement !== publishHubEndpointInput) {
    publishHubEndpointInput.value = state.publishHubEndpoint;
  }
  if (document.activeElement !== publishHubTokenInput) {
    publishHubTokenInput.value = state.publishHubToken;
  }
  if (document.activeElement !== publishHubSlugInput) {
    publishHubSlugInput.value = state.publishHubSlug;
  }
  publishHubUrlPreviewElement.textContent = publishHubUrlPreview();
  publishHubVisibilitySelect.value = state.publishHubVisibility;
  publishHubAuthRealmSelect.value = state.publishHubAuthRealm;
  publishHubCommentPolicySelect.value = state.publishHubCommentPolicy;
  publishAvailability.textContent = availabilityMessage(state.publishAvailability);
  publishAvailability.dataset.state = state.publishAvailability;
  publishAvailabilityIndicator.dataset.state = state.publishAvailability;
  publishAvailabilityIndicator.textContent = availabilityIndicatorText(state.publishAvailability);
  publishSubdomainInput.disabled = state.isPublishing || state.isUnpublishing || isCloudflareHub;
  publishHubEndpointInput.disabled = state.isPublishing || state.isUnpublishing;
  publishHubTokenInput.disabled = state.isPublishing || state.isUnpublishing;
  publishHubSlugInput.disabled = state.isPublishing || state.isUnpublishing;
  publishHubVisibilitySelect.disabled = state.isPublishing || state.isUnpublishing;
  publishHubAuthRealmSelect.disabled = state.isPublishing || state.isUnpublishing;
  publishHubCommentPolicySelect.disabled = state.isPublishing || state.isUnpublishing;
  cancelPublishButton.disabled = state.isPublishing || state.isUnpublishing;
  confirmPublishButton.disabled = !canPublish();
  confirmPublishButton.textContent = "Publish";
  unpublishButton.hidden = !state.publishConfig?.published || isCloudflareHub;
  unpublishButton.disabled = state.isPublishing || state.isUnpublishing;
  unpublishButton.textContent = "Unpublish…";
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

function availabilityIndicatorText(availability) {
  switch (availability) {
  case "checking":
    return "";
  case "available":
    return "✓";
  case "owned":
    return "✓";
  case "taken":
    return "×";
  case "invalid":
    return "!";
  default:
    return "";
  }
}

function canPublish() {
  if (state.publishTarget === "cloudflare-hub") {
    return Boolean(
      state.currentProject &&
      !state.isPublishing &&
      !state.isUnpublishing &&
      state.publishHubEndpoint &&
      state.publishHubToken &&
      state.publishHubSlug
    );
  }

  return (
    state.currentProject &&
    !state.isPublishing &&
    !state.isUnpublishing &&
    ["available", "owned"].includes(state.publishAvailability)
  );
}

function sanitizePublishSubdomain(value) {
  return String(value).toLowerCase().replace(/[^\p{L}\p{N}-]/gu, "");
}

function publishSubdomainCharacterCount(value) {
  return Array.from(value).length;
}

function scheduleAvailabilityCheck() {
  if (state.publishTarget === "cloudflare-hub") {
    state.publishAvailability = "owned";
    renderPublishDialog();
    return;
  }

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
  if (publishSubdomainCharacterCount(subdomain) < 3) {
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
  if (state.publishTarget === "cloudflare-hub") return;
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
  state.isPublishDialogOpen = false;
  renderPublishDialog();
  renderPublishStatus();

  try {
    const result = state.publishTarget === "cloudflare-hub"
      ? await window.wikiwise.publishCloudflareHubSite({
        projectRoot: state.currentProject.projectRoot,
        hubEndpoint: state.publishHubEndpoint,
        publishToken: state.publishHubToken,
        slug: state.publishHubSlug,
        visibility: state.publishHubVisibility,
        authRealm: state.publishHubAuthRealm,
        commentPolicy: state.publishHubCommentPolicy
      })
      : await window.wikiwise.publishSite({
        projectRoot: state.currentProject.projectRoot,
        subdomain: state.publishSubdomain
      });
    state.publishResult = result;
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

function handleUnpublishConfirmationKeydown(event) {
  if (!state.isUnpublishConfirmOpen) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeUnpublishConfirmation();
  }
}

async function confirmUnpublish() {
  if (!state.currentProject || !state.publishConfig?.published) return;

  state.isUnpublishing = true;
  state.publishError = null;
  state.isUnpublishConfirmOpen = false;
  renderPublishStatus();
  renderPublishFeedback();

  try {
    await window.wikiwise.unpublishSite({
      projectRoot: state.currentProject.projectRoot
    });
    state.publishConfig = await refreshPublishConfig();
    state.publishSubdomain = "";
    state.publishAvailability = "unknown";
    state.isPublishDialogOpen = false;
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
  if (!state.currentProject || !isProjectFolder()) {
    return;
  }

  if (state.projectWatcherCleanup) {
    state.projectWatcherCleanup();
    state.projectWatcherCleanup = null;
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
  if (state.terminalStartPromise) {
    return state.terminalStartPromise;
  }

  const startPromise = startTerminalSession();
  state.terminalStartPromise = startPromise;
  try {
    return await startPromise;
  } finally {
    if (state.terminalStartPromise === startPromise) {
      state.terminalStartPromise = null;
    }
  }
}

async function startTerminalSession() {
  if (!state.currentProject || !isProjectFolder()) {
    renderTerminalTab();
    return;
  }

  if (state.terminalOutputCleanup) {
    state.terminalOutputCleanup();
    state.terminalOutputCleanup = null;
  }

  const terminalInstance = await ensureTerminalInstance();
  const previousTerminalProjectRoot = state.terminalSessionProjectRoot;
  if (!state.terminalSessionProjectRoot) {
    state.terminalSessionProjectRoot = state.currentProject.projectRoot;
  }
  const cleanup = window.wikiwise.onTerminalOutput(handleTerminalOutput);
  try {
    const terminalResult = await window.wikiwise.startTerminal({
      projectRoot: state.currentProject.projectRoot,
      cols: terminalInstance.cols,
      rows: terminalInstance.rows
    });
    state.terminalSessionProjectRoot = terminalResult.projectRoot ?? state.currentProject.projectRoot;
    if (terminalResult.started) {
      terminalInstance.clear();
      window.__wikiwiseTerminalText = "";
      focusTerminalIfVisible();
    }
    await sendTerminalResize();
    state.terminalOutputCleanup = cleanup;
  } catch (error) {
    state.terminalSessionProjectRoot = previousTerminalProjectRoot;
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
  if (!state.terminalSessionProjectRoot || output.projectRoot !== state.terminalSessionProjectRoot) {
    return;
  }

  ensureTerminalInstance()
    .then((terminalInstance) => {
      window.__wikiwiseTerminalText = `${window.__wikiwiseTerminalText ?? ""}${output.data}`.slice(-4000);
      terminalInstance.write(output.data, () => updateTerminalCursorOverlay());
      if (output.source === "system" && output.data.includes("[process exited")) {
        state.terminalSessionProjectRoot = null;
      }
    })
    .catch(setError);
}

async function sendTerminalData(input) {
  if (!state.terminalSessionProjectRoot || state.terminalStartPromise) {
    await startTerminal();
  }
  if (!state.terminalSessionProjectRoot) return;

  await window.wikiwise.sendTerminalInput({ input });
}

async function sendTerminalInput() {
  if (!state.currentProject || !state.terminalInstance) return;
  state.terminalInstance.focus();
}

async function refreshDocumentInfo() {
  const file = state.selectedFile;
  if (!state.currentProject || !file?.path) {
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
    console.error(error);
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
  const selectedNonMarkdownSourceChanged = Boolean(
    currentPath &&
    !currentMarkdownSelected &&
    (change.kind === "rebuild" || change.cssChanged)
  );

  try {
    if (change.kind === "structure" || change.kind === "rebuild") {
      const previousExpandedPaths = new Set(state.expandedTreePaths);
      state.tree = normalizeTreeNodes(await window.wikiwise.scanProject(state.currentProject.projectRoot));
      await restoreExpandedTree(previousExpandedPaths);
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

    if (selectedNonMarkdownSourceChanged && state.selectedFile && !state.selectedFile.isDirty) {
      await reloadSelectedFileFromDisk(currentPath);
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
    await setActiveSelectedFile(refreshedPath);
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
  const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: "always", style: "long" });

  if (absoluteSeconds < 60) return relativeFormatter.format(deltaSeconds, "second");
  if (absoluteSeconds < 3600) return relativeFormatter.format(Math.round(deltaSeconds / 60), "minute");
  if (absoluteSeconds < 86400) return relativeFormatter.format(Math.round(deltaSeconds / 3600), "hour");
  if (absoluteSeconds < 604800) return relativeFormatter.format(Math.round(deltaSeconds / 86400), "day");
  if (absoluteSeconds < 2629800) return relativeFormatter.format(Math.round(deltaSeconds / 604800), "week");
  if (absoluteSeconds < 31557600) return relativeFormatter.format(Math.round(deltaSeconds / 2629800), "month");
  return relativeFormatter.format(Math.round(deltaSeconds / 31557600), "year");
}

function formatWordCount(wordCount) {
  const numericWordCount = Number(wordCount);
  return Number.isFinite(numericWordCount) ? new Intl.NumberFormat().format(numericWordCount) : "";
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

function capturePreviewScrollFraction() {
  if (!state.selectedFile || previewFrame.hidden) return;

  try {
    const previewWindow = previewFrame.contentWindow;
    const previewDocument = previewWindow?.document;
    if (!previewWindow || !previewDocument?.body) return;

    const fraction =
      previewWindow.scrollY / Math.max(1, previewDocument.body.scrollHeight - previewWindow.innerHeight);
    if (Number.isFinite(fraction)) {
      state.selectedFile.scrollFraction = fraction;
    }
  } catch {
    // A future non-local preview should not break mode switching.
  }
}

function restorePreviewScrollFraction(scrollFraction = 0) {
  const fraction = Number(scrollFraction);
  if (!Number.isFinite(fraction) || fraction <= 0) return;

  try {
    const previewWindow = previewFrame.contentWindow;
    const previewDocument = previewWindow?.document;
    if (!previewWindow || !previewDocument?.body) return;

    window.requestAnimationFrame(() => {
      const maxScroll = Math.max(1, previewDocument.body.scrollHeight - previewWindow.innerHeight);
      previewWindow.scrollTo(0, fraction * maxScroll);
    });
  } catch {
    // Ignore inaccessible preview frames and keep rendering the page.
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

  const nextContent = String(content ?? "");
  if (!nextContent) return;

  file.draftContent = nextContent;
  state.editorLoadedContent = file.draftContent;
  file.isDirty = file.draftContent !== file.lastSavedContent;
  renderSaveState();
  saveSelectedFile({ reason: "editorContentChanged" });
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

async function saveSelectedFile() {
  const file = state.selectedFile;
  if (!file || !file.isDirty || file.isSaving) return;

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
      saveSelectedFile({ reason: "followUp" });
    }
    if (isMarkdownFile(savedPath) && result.compiled && state.detailMode === "wiki") {
      renderPreview();
    }
    await refreshDocumentInfo();
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

watchSystemAppearanceChanges();
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
previewFrame.addEventListener("load", () => {
  attachPreviewNavigation(previewFrame);
  restorePreviewScrollFraction(state.selectedFile?.scrollFraction ?? 0);
});
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
publishTargetOfficialButton.addEventListener("click", () => selectPublishTarget("official"));
publishTargetCloudflareHubButton.addEventListener("click", () => selectPublishTarget("cloudflare-hub"));
publishSubdomainInput.addEventListener("input", () => {
  const sanitized = sanitizePublishSubdomain(publishSubdomainInput.value);
  if (publishSubdomainInput.value !== sanitized) {
    publishSubdomainInput.value = sanitized;
  }
  state.publishSubdomain = sanitized;
  scheduleAvailabilityCheck();
});
publishHubEndpointInput.addEventListener("input", () => {
  state.publishHubEndpoint = publishHubEndpointInput.value.trim();
  renderPublishDialog();
});
publishHubTokenInput.addEventListener("input", () => {
  state.publishHubToken = publishHubTokenInput.value.trim();
  renderPublishDialog();
});
publishHubSlugInput.addEventListener("input", () => {
  const sanitized = sanitizePublishSubdomain(publishHubSlugInput.value);
  if (publishHubSlugInput.value !== sanitized) {
    publishHubSlugInput.value = sanitized;
  }
  state.publishHubSlug = sanitized;
  renderPublishDialog();
});
publishHubVisibilitySelect.addEventListener("change", () => {
  state.publishHubVisibility = publishHubVisibilitySelect.value;
  renderPublishDialog();
});
publishHubAuthRealmSelect.addEventListener("change", () => {
  state.publishHubAuthRealm = publishHubAuthRealmSelect.value;
  renderPublishDialog();
});
publishHubCommentPolicySelect.addEventListener("change", () => {
  state.publishHubCommentPolicy = publishHubCommentPolicySelect.value;
  renderPublishDialog();
});
cancelPublishButton.addEventListener("click", closePublishDialog);
confirmPublishButton.addEventListener("click", publishCurrentProject);
publishDialog.addEventListener("keydown", handlePublishDialogKeydown);
unpublishButton.addEventListener("click", openUnpublishConfirmation);
openPublishResultButton.addEventListener("click", openPublishedUrl);
dismissPublishResultButton.addEventListener("click", dismissPublishResult);
dismissPublishErrorButton.addEventListener("click", dismissPublishError);
cancelUnpublishButton.addEventListener("click", closeUnpublishConfirmation);
confirmUnpublishButton.addEventListener("click", confirmUnpublish);
unpublishConfirmDialog.addEventListener("keydown", handleUnpublishConfirmationKeydown);
newWikiNameInput.addEventListener("input", () => {
  state.newWikiName = newWikiNameInput.value;
  renderNewWikiDialog();
});
newWikiTranslationTargetSelect.addEventListener("change", () => {
  state.newWikiTranslationTargetLanguage = newWikiTranslationTargetSelect.value;
  renderNewWikiDialog();
});
chooseNewWikiLocationButton.addEventListener("click", chooseNewWikiLocation);
cancelCreateNewButton.addEventListener("click", closeNewWikiDialog);
confirmCreateNewButton.addEventListener("click", createNewWiki);
newWikiDialog.addEventListener("keydown", handleNewWikiDialogKeydown);
dismissPostCreateGuideButton.addEventListener("click", () => {
  dismissPostCreateGuide().catch(setError);
});
