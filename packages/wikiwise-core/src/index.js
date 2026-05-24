import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RESOURCE_NAMES = Object.freeze([
  "app.js",
  "build.js",
  "graph.js",
  "katex.min.css",
  "katex.min.js",
  "map-3d.html",
  "map.html",
  "markdown-it.min.js",
  "style.css"
]);

export function getBundledResourceNames() {
  return [...RESOURCE_NAMES];
}

export function resolveRepositoryResourcePath(repositoryRootUrl, resourceName) {
  if (!RESOURCE_NAMES.includes(resourceName)) {
    throw new Error(`Unknown Wikiwise resource: ${resourceName}`);
  }

  const repositoryRoot =
    repositoryRootUrl instanceof URL ? fileURLToPath(repositoryRootUrl) : repositoryRootUrl;
  const resourcePath = path.join(
    repositoryRoot,
    "Sources",
    "Wikiwise",
    "Resources",
    resourceName
  );

  if (!fs.existsSync(resourcePath)) {
    throw new Error(`Missing Wikiwise resource: ${resourcePath}`);
  }

  return resourcePath;
}
