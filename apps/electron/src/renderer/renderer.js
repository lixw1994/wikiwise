const resourceCount = document.querySelector("#resource-count");
const resourceList = document.querySelector("#resource-list");

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
