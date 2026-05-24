const welcome = document.querySelector("#welcome");
const project = document.querySelector("#project");
const projectName = document.querySelector("#project-name");
const fileTree = document.querySelector("#file-tree");
const selectedFileLabel = document.querySelector("#selected-file");
const sourceEditor = document.querySelector("#source-editor");
const previewFrame = document.querySelector("#preview-frame");
const saveButton = document.querySelector("#save-file");
const saveStatus = document.querySelector("#save-status");
const modeFileButton = document.querySelector("#mode-file");
const modeWikiButton = document.querySelector("#mode-wiki");
const openExistingButton = document.querySelector("#open-existing");
const createNewButton = document.querySelector("#create-new");
const newWikiDialog = document.querySelector("#new-wiki-dialog");
const newWikiNameInput = document.querySelector("#new-wiki-name");
const newWikiLocationLabel = document.querySelector("#new-wiki-location");
const chooseNewWikiLocationButton = document.querySelector("#choose-new-wiki-location");
const cancelCreateNewButton = document.querySelector("#cancel-create-new");
const confirmCreateNewButton = document.querySelector("#confirm-create-new");
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
  detailMode: "file",
  autosaveTimer: null,
  projectWatcherCleanup: null,
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

  if (hasProject) {
    projectName.textContent = state.currentProject.projectName;
    renderTree(state.tree);
    renderDetail();
  }
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

async function selectFile(node) {
  setError(null);
  state.showPostCreateGuide = false;

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
  } catch (error) {
    setError(error);
  }
}

function setSelectedFile(file) {
  clearAutosave();
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
  const wikiAvailable = hasCompiledPreview(file);
  const showGuide = Boolean(state.showPostCreateGuide && state.currentProject);

  selectedFileLabel.textContent = showGuide ? "Your wiki is ready" : (file?.name ?? "Select a file to read");
  sourceEditor.disabled = !hasFile;
  if (document.activeElement !== sourceEditor && sourceEditor.value !== (file?.draftContent ?? "")) {
    sourceEditor.value = file?.draftContent ?? "";
  }

  modeFileButton.disabled = showGuide || !hasFile;
  modeWikiButton.disabled = showGuide || !wikiAvailable;
  modeFileButton.classList.toggle("selected", state.detailMode === "file");
  modeWikiButton.classList.toggle("selected", state.detailMode === "wiki" && wikiAvailable);

  sourceEditor.hidden = showGuide || state.detailMode !== "file";
  previewFrame.hidden = showGuide || state.detailMode !== "wiki" || !wikiAvailable;
  postCreateGuide.hidden = !showGuide;
  renderSaveState();

  if (showGuide) {
    renderPostCreateGuide();
    previewFrame.removeAttribute("src");
  } else if (state.detailMode === "wiki" && wikiAvailable) {
    renderPreview();
  } else {
    previewFrame.removeAttribute("src");
  }
}

function renderPreview() {
  previewFrame.src = state.selectedFile.compiled.fileUrl;
}

async function applyProjectResult(projectResult, options = {}) {
  state.currentProject = {
    projectRoot: projectResult.projectRoot,
    projectName: projectResult.projectName
  };
  state.tree = projectResult.tree;
  state.showPostCreateGuide = Boolean(options.showPostCreateGuide);
  setSelectedFile(projectResult.selectedFile);

  renderApp();
  await startProjectWatcher();
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

function renderSaveState() {
  const file = state.selectedFile;

  saveButton.disabled = state.showPostCreateGuide || !file || !file.isDirty || file.isSaving;
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

loadResources();
renderApp();

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
createNewButton.addEventListener("click", openNewWikiDialog);
newWikiNameInput.addEventListener("input", () => {
  state.newWikiName = newWikiNameInput.value;
  renderNewWikiDialog();
});
chooseNewWikiLocationButton.addEventListener("click", chooseNewWikiLocation);
cancelCreateNewButton.addEventListener("click", closeNewWikiDialog);
confirmCreateNewButton.addEventListener("click", createNewWiki);
dismissPostCreateGuideButton.addEventListener("click", dismissPostCreateGuide);
