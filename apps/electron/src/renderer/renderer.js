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
const resourceCount = document.querySelector("#resource-count");
const resourceList = document.querySelector("#resource-list");
const errorMessage = document.querySelector("#error-message");

const state = {
  currentProject: null,
  selectedFile: null,
  detailMode: "file",
  autosaveTimer: null,
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

    state.currentProject = {
      projectRoot: result.project.projectRoot,
      projectName: result.project.projectName
    };
    state.tree = result.project.tree;
    setSelectedFile(result.project.selectedFile);

    renderApp();
  } catch (error) {
    setError(error);
  } finally {
    openExistingButton.disabled = false;
  }
}

async function selectFile(node) {
  setError(null);

  try {
    const content = await window.wikiwise.readFile(node.path);
    const nextFile = {
      path: node.path,
      name: node.name,
      content
    };

    if (isMarkdownFile(node.path)) {
      try {
        nextFile.compiled = await window.wikiwise.compilePage({
          projectRoot: state.currentProject.projectRoot,
          filePath: node.path
        });
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

  selectedFileLabel.textContent = file?.name ?? "Select a file to read";
  sourceEditor.disabled = !hasFile;
  if (document.activeElement !== sourceEditor && sourceEditor.value !== (file?.draftContent ?? "")) {
    sourceEditor.value = file?.draftContent ?? "";
  }

  modeFileButton.disabled = !hasFile;
  modeWikiButton.disabled = !wikiAvailable;
  modeFileButton.classList.toggle("selected", state.detailMode === "file");
  modeWikiButton.classList.toggle("selected", state.detailMode === "wiki" && wikiAvailable);

  sourceEditor.hidden = state.detailMode !== "file";
  previewFrame.hidden = state.detailMode !== "wiki" || !wikiAvailable;
  renderSaveState();

  if (state.detailMode === "wiki" && wikiAvailable) {
    renderPreview();
  } else {
    previewFrame.removeAttribute("src");
  }
}

function renderPreview() {
  previewFrame.src = state.selectedFile.compiled.fileUrl;
}

function renderSaveState() {
  const file = state.selectedFile;

  saveButton.disabled = !file || !file.isDirty || file.isSaving;
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
createNewButton.addEventListener("click", () => {
  setError("Create a New Wiki will be migrated in a later OpenSpec phase.");
});
