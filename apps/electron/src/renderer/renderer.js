const welcome = document.querySelector("#welcome");
const project = document.querySelector("#project");
const projectName = document.querySelector("#project-name");
const fileTree = document.querySelector("#file-tree");
const selectedFileLabel = document.querySelector("#selected-file");
const fileContent = document.querySelector("#file-content");
const previewFrame = document.querySelector("#preview-frame");
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
  state.selectedFile = file;
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
  fileContent.textContent = file?.content ?? "";

  modeFileButton.disabled = !hasFile;
  modeWikiButton.disabled = !wikiAvailable;
  modeFileButton.classList.toggle("selected", state.detailMode === "file");
  modeWikiButton.classList.toggle("selected", state.detailMode === "wiki" && wikiAvailable);

  fileContent.hidden = state.detailMode !== "file";
  previewFrame.hidden = state.detailMode !== "wiki" || !wikiAvailable;

  if (state.detailMode === "wiki" && wikiAvailable) {
    renderPreview();
  } else {
    previewFrame.removeAttribute("src");
  }
}

function renderPreview() {
  previewFrame.src = state.selectedFile.compiled.fileUrl;
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
modeFileButton.addEventListener("click", () => setDetailMode("file"));
modeWikiButton.addEventListener("click", () => setDetailMode("wiki"));
createNewButton.addEventListener("click", () => {
  setError("Create a New Wiki will be migrated in a later OpenSpec phase.");
});
