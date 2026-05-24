const welcome = document.querySelector("#welcome");
const project = document.querySelector("#project");
const projectName = document.querySelector("#project-name");
const fileTree = document.querySelector("#file-tree");
const selectedFileLabel = document.querySelector("#selected-file");
const sourceEditor = document.querySelector("#source-editor");
const previewFrame = document.querySelector("#preview-frame");
const generatedPreviewFrame = document.querySelector("#generated-preview-frame");
const saveButton = document.querySelector("#save-file");
const saveStatus = document.querySelector("#save-status");
const publishButton = document.querySelector("#publish-wiki");
const modeFileButton = document.querySelector("#mode-file");
const modeWikiButton = document.querySelector("#mode-wiki");
const goBackButton = document.querySelector("#go-back");
const goForwardButton = document.querySelector("#go-forward");
const appearanceModeButton = document.querySelector("#appearance-mode");
const openMapButton = document.querySelector("#open-map");
const toggleRightSidebarButton = document.querySelector("#toggle-right-sidebar");
const toolbarProjectName = document.querySelector("#toolbar-project-name");
const rightSidebar = document.querySelector("#right-sidebar");
const rightTabInfoButton = document.querySelector("#right-tab-info");
const rightTabTerminalButton = document.querySelector("#right-tab-terminal");
const infoPanel = document.querySelector("#info-panel");
const infoPath = document.querySelector("#info-path");
const infoEdited = document.querySelector("#info-edited");
const infoWords = document.querySelector("#info-words");
const infoDirections = document.querySelector("#info-directions");
const infoLinks = document.querySelector("#info-links");
const terminalPanel = document.querySelector("#terminal-panel");
const terminalOutput = document.querySelector("#terminal-output");
const terminalInput = document.querySelector("#terminal-input");
const terminalSendButton = document.querySelector("#terminal-send");
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
const publishResult = document.querySelector("#publish-result");
const publishResultUrl = document.querySelector("#publish-result-url");
const publishError = document.querySelector("#publish-error");
const postCreateGuide = document.querySelector("#post-create-guide");
const guideClaudeCommand = document.querySelector("#guide-claude-command");
const guideCodexCommand = document.querySelector("#guide-codex-command");
const guideCursorCommand = document.querySelector("#guide-cursor-command");
const dismissPostCreateGuideButton = document.querySelector("#dismiss-post-create-guide");
const resourceCount = document.querySelector("#resource-count");
const resourceList = document.querySelector("#resource-list");
const errorMessage = document.querySelector("#error-message");

const state = {
  currentProject: null,
  selectedFile: null,
  generatedPage: null,
  detailMode: "file",
  appearanceMode: "Auto",
  rightSidebarTab: "terminal",
  isRightSidebarVisible: true,
  backHistory: [],
  forwardHistory: [],
  appCommandCleanup: null,
  autosaveTimer: null,
  projectWatcherCleanup: null,
  terminalOutputCleanup: null,
  documentInfo: null,
  terminalTranscript: "",
  publishConfig: null,
  isPublishDialogOpen: false,
  publishSubdomain: "",
  publishAvailability: "unknown",
  isPublishing: false,
  isUnpublishing: false,
  publishResult: null,
  publishError: null,
  availabilityCheckTimer: null,
  isNewWikiDialogOpen: false,
  newWikiName: "",
  newWikiLocation: "",
  isCreatingWiki: false,
  showPostCreateGuide: false,
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

function renderApp() {
  const hasProject = Boolean(state.currentProject);

  welcome.hidden = hasProject;
  project.hidden = !hasProject;
  renderNewWikiDialog();
  renderPublishDialog();
  renderPublishStatus();

  if (hasProject) {
    projectName.textContent = state.currentProject.projectName;
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
  fileTree.replaceChildren(...nodes.map(renderNode));
}

function renderNode(node) {
  const item = document.createElement("li");
  const button = document.createElement("button");

  item.className = node.isDirectory ? "tree-folder" : "tree-file";
  button.type = "button";
  button.textContent = node.isDirectory ? `▸ ${node.name}` : node.name;
  button.disabled = node.isDirectory;

  if (!node.isDirectory && state.selectedFile?.path === node.path) {
    button.classList.add("selected");
  }

  if (!node.isDirectory) {
    button.addEventListener("click", () => selectFile(node));
  }

  item.append(button);
  return item;
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
    renderTree(state.tree);
    renderProjectToolbar();
    await refreshDocumentInfo();
  } catch (error) {
    setError(error);
  }
}

function setSelectedFile(file) {
  clearAutosave();
  state.documentInfo = null;
  state.generatedPage = null;
  state.selectedFile = file
    ? {
        ...file,
        draftContent: file.content ?? "",
        lastSavedContent: file.content ?? "",
        isDirty: false,
        isSaving: false
      }
    : null;
  state.detailMode = hasCompiledPreview(file) ? "wiki" : "file";
  renderDetail();
}

function setDetailMode(mode) {
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
  sourceEditor.disabled = !hasFile || hasGeneratedPage;
  if (document.activeElement !== sourceEditor && sourceEditor.value !== (file?.draftContent ?? "")) {
    sourceEditor.value = file?.draftContent ?? "";
  }

  modeFileButton.disabled = showGuide || hasGeneratedPage || !hasFile;
  modeWikiButton.disabled = showGuide || hasGeneratedPage || !wikiAvailable;
  modeFileButton.classList.toggle("selected", state.detailMode === "file");
  modeWikiButton.classList.toggle("selected", state.detailMode === "wiki" && wikiAvailable);

  sourceEditor.hidden = showGuide || hasGeneratedPage || state.detailMode !== "file";
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
  }

  renderRightSidebar();
  renderProjectToolbar();
}

function renderPreview() {
  previewFrame.src = state.selectedFile.compiled.fileUrl;
}

function renderPublishStatus() {
  publishButton.disabled = !state.currentProject || state.isPublishing;
  publishButton.textContent = state.isPublishing ? "PUBLISHING..." : "PUBLISH ↑";

  publishResult.hidden = !state.publishResult;
  publishResultUrl.textContent = state.publishResult?.url ?? "";
  publishError.hidden = !state.publishError;
  publishError.textContent = state.publishError ?? "";
}

function renderProjectToolbar() {
  goBackButton.disabled = state.backHistory.length === 0;
  goForwardButton.disabled = state.forwardHistory.length === 0;
  appearanceModeButton.textContent = state.appearanceMode;
  openMapButton.disabled = !state.currentProject;
  toggleRightSidebarButton.classList.toggle("selected", state.isRightSidebarVisible);
  project.classList.toggle("right-sidebar-hidden", !state.isRightSidebarVisible);
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
  const hasMarkdownFile = Boolean(file?.path && isMarkdownFile(file.path));

  infoPath.textContent = info?.name ?? file?.name ?? "No document";
  infoEdited.textContent = info?.modifiedAt ? formatEditedTime(info.modifiedAt) : "";
  infoWords.textContent = info ? String(info.wordCount) : "";
  infoDirections.textContent = info?.directions || (hasMarkdownFile ? "None" : "Select a markdown file");

  const links = info?.wikilinks ?? [];
  infoLinks.replaceChildren(...links.map(renderInfoLink));
  if (links.length === 0) {
    const item = document.createElement("li");
    item.textContent = hasMarkdownFile ? "None" : "";
    infoLinks.append(item);
  }
}

function renderInfoLink(target) {
  const item = document.createElement("li");
  item.textContent = `-> ${target}`;
  return item;
}

function renderTerminalTab() {
  terminalOutput.textContent = state.terminalTranscript || "Starting shell...";
  terminalInput.disabled = !state.currentProject;
  terminalSendButton.disabled = !state.currentProject;
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

async function applyProjectResult(projectResult, options = {}) {
  state.currentProject = {
    projectRoot: projectResult.projectRoot,
    projectName: projectResult.projectName
  };
  state.tree = projectResult.tree;
  state.showPostCreateGuide = Boolean(options.showPostCreateGuide);
  state.generatedPage = null;
  state.backHistory = [];
  state.forwardHistory = [];
  setSelectedFile(projectResult.selectedFile);

  renderApp();
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
    clearAutosave();
    state.selectedFile = null;
    state.documentInfo = null;
    state.generatedPage = entry;
    state.detailMode = "wiki";
    renderTree(state.tree);
    renderDetail();
    renderInfoTab();
    return;
  }

  await selectFile({ path: entry.path, name: entry.name }, { pushHistory: false });
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

    pushHistoryEntry(currentHistoryEntry());
    state.forwardHistory = [];
    clearAutosave();
    state.selectedFile = null;
    state.documentInfo = null;
    state.generatedPage = generatedPage;
    state.detailMode = "wiki";
    renderTree(state.tree);
    renderDetail();
  } catch (error) {
    setError(error);
  }
}

async function refreshCurrentView() {
  if (state.generatedPage?.name) {
    const refreshed = await window.wikiwise.openGeneratedPage({
      projectRoot: state.currentProject.projectRoot,
      pageName: state.generatedPage.name
    });
    if (refreshed) {
      state.generatedPage = refreshed;
      renderDetail();
    }
    return;
  }

  if (state.selectedFile?.path && isMarkdownFile(state.selectedFile.path)) {
    await refreshSelectedMarkdown({ invalidate: true });
  }
}

function toggleRightSidebar() {
  state.isRightSidebarVisible = !state.isRightSidebarVisible;
  renderRightSidebar();
  renderProjectToolbar();
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
  unpublishButton.textContent = state.isUnpublishing ? "Unpublishing" : "Unpublish...";
}

function availabilityMessage(availability) {
  switch (availability) {
  case "available":
    return "Available";
  case "owned":
    return "You already own this name.";
  case "taken":
    return "This name is already taken. Try another.";
  case "invalid":
    return "3-48 characters, letters, numbers, and hyphens only.";
  case "checking":
    return "Checking...";
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

async function unpublishCurrentProject() {
  if (!state.currentProject || !state.publishConfig?.published) return;
  if (!window.confirm("Unpublish wiki?")) return;

  state.isUnpublishing = true;
  state.publishError = null;
  renderPublishDialog();

  try {
    await window.wikiwise.unpublishSite({
      projectRoot: state.currentProject.projectRoot
    });
    state.publishConfig = await refreshPublishConfig();
    state.publishAvailability = "unknown";
    state.isPublishDialogOpen = false;
  } catch (error) {
    state.publishError = error instanceof Error ? error.message : String(error);
  } finally {
    state.isUnpublishing = false;
    renderPublishDialog();
    renderPublishStatus();
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
    state.terminalTranscript = "";
    await window.wikiwise.stopTerminal();
    renderTerminalTab();
    return;
  }

  state.terminalTranscript = "";
  renderTerminalTab();

  const cleanup = window.wikiwise.onTerminalOutput(handleTerminalOutput);
  try {
    await window.wikiwise.startTerminal({
      projectRoot: state.currentProject.projectRoot
    });
    state.terminalOutputCleanup = cleanup;
  } catch (error) {
    cleanup();
    throw error;
  }
}

function handleTerminalOutput(output) {
  if (!state.currentProject || output.projectRoot !== state.currentProject.projectRoot) {
    return;
  }

  state.terminalTranscript = `${state.terminalTranscript}${output.data}`;
  if (state.terminalTranscript.length > 24000) {
    state.terminalTranscript = state.terminalTranscript.slice(-24000);
  }
  renderTerminalTab();
}

async function sendTerminalInput() {
  if (!state.currentProject) return;

  const command = terminalInput.value;
  if (!command.trim()) return;

  terminalInput.value = "";
  state.terminalTranscript = `${state.terminalTranscript}$ ${command}\n`;
  renderTerminalTab();

  try {
    await window.wikiwise.sendTerminalInput({
      input: `${command}\n`
    });
  } catch (error) {
    setError(error);
  }
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

  try {
    if (change.kind === "structure" || change.kind === "rebuild") {
      state.tree = await window.wikiwise.scanProject(state.currentProject.projectRoot);
      renderTree(state.tree);
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

function handleEditorInput() {
  const file = state.selectedFile;
  if (!file) return;

  file.draftContent = sourceEditor.value;
  file.isDirty = file.draftContent !== file.lastSavedContent;
  renderSaveState();
  scheduleAutosave();
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

function renderResource(resource) {
  const item = document.createElement("li");
  const name = document.createElement("strong");
  const path = document.createElement("span");

  name.textContent = resource.name;
  path.textContent = resource.path;

  item.append(name, path);
  return item;
}

async function loadResources() {
  try {
    const resources = await window.wikiwise.resources();

    resourceCount.textContent = `${resources.length} files`;
    resourceList.replaceChildren(...resources.map(renderResource));
  } catch (error) {
    resourceCount.textContent = "Unavailable";
    resourceList.replaceChildren();

    const item = document.createElement("li");
    item.className = "error";
    item.textContent = error instanceof Error ? error.message : String(error);
    resourceList.append(item);
  }
}

async function bootApp() {
  renderApp();
  await loadAppSettings();
  await loadResources();
  await restoreLastProject();
  state.appCommandCleanup = window.wikiwise.onAppCommand(handleAppCommand);
}

bootApp();

openExistingButton.addEventListener("click", openExisting);
sourceEditor.addEventListener("input", handleEditorInput);
saveButton.addEventListener("click", () => saveSelectedFile({ reason: "button" }));
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveSelectedFile({ reason: "keyboard" });
  }
});
modeFileButton.addEventListener("click", () => setDetailMode("file"));
modeWikiButton.addEventListener("click", () => setDetailMode("wiki"));
publishButton.addEventListener("click", openPublishDialog);
goBackButton.addEventListener("click", navigateBack);
goForwardButton.addEventListener("click", navigateForward);
appearanceModeButton.addEventListener("click", cycleAppearanceMode);
openMapButton.addEventListener("click", openMap);
toggleRightSidebarButton.addEventListener("click", toggleRightSidebar);
rightTabInfoButton.addEventListener("click", () => setRightSidebarTab("info"));
rightTabTerminalButton.addEventListener("click", () => setRightSidebarTab("terminal"));
terminalSendButton.addEventListener("click", sendTerminalInput);
terminalInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendTerminalInput();
  }
});
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
unpublishButton.addEventListener("click", unpublishCurrentProject);
newWikiNameInput.addEventListener("input", () => {
  state.newWikiName = newWikiNameInput.value;
  renderNewWikiDialog();
});
chooseNewWikiLocationButton.addEventListener("click", chooseNewWikiLocation);
cancelCreateNewButton.addEventListener("click", closeNewWikiDialog);
confirmCreateNewButton.addEventListener("click", createNewWiki);
dismissPostCreateGuideButton.addEventListener("click", dismissPostCreateGuide);
