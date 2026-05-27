import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

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
const PUBLISH_ENDPOINT = "https://publish.wiki-wise.com/_publish";
const PUBLISH_CHECK_ENDPOINT = "https://publish.wiki-wise.com/_check";

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

export function readTextFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

export function writeTextFile(filePath, content) {
  const text = String(content);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");

  return {
    path: filePath,
    bytes: Buffer.byteLength(text, "utf8")
  };
}

export function writeActiveFile(projectRoot, filePath) {
  const activeFileDirectory = path.join(projectRoot, ".claude");
  const activeFilePath = path.join(activeFileDirectory, "active-file");
  const relativePath = path.relative(projectRoot, filePath).split(path.sep).join("/");

  if (!fs.existsSync(activeFileDirectory)) {
    return {
      path: activeFilePath,
      relativePath,
      written: false
    };
  }

  writeTextFile(activeFilePath, relativePath);

  return {
    path: activeFilePath,
    relativePath,
    written: true
  };
}

export function summarizeDocumentInfo(filePath) {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Document not found: ${resolvedPath}`);
  }

  const stat = fs.statSync(resolvedPath);
  if (!stat.isFile()) {
    throw new Error(`Document not found: ${resolvedPath}`);
  }

  const content = readTextFile(resolvedPath);

  return {
    path: resolvedPath,
    name: path.basename(resolvedPath),
    modifiedAt: stat.mtime.toISOString(),
    wordCount: countWords(content),
    directions: extractDirections(content),
    wikilinks: extractWikilinks(content)
  };
}

export function loadPublishConfig(projectRoot) {
  const configPath = path.join(path.resolve(projectRoot), "publish.json");
  if (!fs.existsSync(configPath)) return null;

  try {
    const config = JSON.parse(readTextFile(configPath));
    if (
      typeof config.subdomain !== "string" ||
      typeof config.token !== "string" ||
      typeof config.url !== "string"
    ) {
      throw new Error("Missing publish config fields");
    }
    return config;
  } catch {
    throw publishError(
      "corrupt_config",
      "publish.json exists but is malformed. Delete it to start fresh, or fix its contents."
    );
  }
}

export function randomPublishSubdomain(wikiName = "") {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const suffix = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const sanitized = String(wikiName)
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
  const slug = Array.from(sanitized).slice(0, 20).join("");

  return slug ? `${slug}-${suffix}` : suffix;
}

export async function checkPublishAvailability(subdomain, options = {}) {
  const requestFetch = resolveFetch(options.fetch);
  const url = new URL(PUBLISH_CHECK_ENDPOINT);
  url.searchParams.set("subdomain", String(subdomain));
  const headers = {};
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  try {
    const response = await requestFetch(url, { headers });
    if (response.status !== 200) return "unknown";

    const json = await response.json();
    switch (json?.reason) {
    case "free":
      return "available";
    case "owned":
      return "owned";
    case "taken":
      return "taken";
    case "invalid":
      return "invalid";
    default:
      return "unknown";
    }
  } catch {
    return "unknown";
  }
}

export async function publishSite(options = {}) {
  if (!options.projectRoot || !options.siteFolder) {
    throw new Error("publishSite requires projectRoot and siteFolder");
  }

  const projectRoot = path.resolve(options.projectRoot);
  const siteFolder = path.resolve(options.siteFolder);
  const requestFetch = resolveFetch(options.fetch);
  const now = options.now ?? (() => new Date());
  const randomSubdomain = options.randomSubdomain ?? (() => randomPublishSubdomain(path.basename(projectRoot)));
  const tokenGenerator = options.tokenGenerator ?? (() => `ww_${randomHex(32)}`);

  const existingConfig = loadPublishConfig(projectRoot);
  let config;
  let isFirstPublish = false;

  if (existingConfig) {
    config = { ...existingConfig };
    if (options.subdomain && options.subdomain !== config.subdomain) {
      config.subdomain = options.subdomain;
      config.url = `https://${options.subdomain}.wiki-wise.com`;
    }
  } else {
    const subdomain = options.subdomain ?? randomSubdomain();
    config = {
      subdomain,
      token: tokenGenerator(),
      url: `https://${subdomain}.wiki-wise.com`
    };
    isFirstPublish = true;
  }

  const files = preparePublishFiles(enumeratePublishFiles(siteFolder));
  const result = await uploadPublishFiles({
    requestFetch,
    config,
    files,
    isFirstPublish,
    randomSubdomain,
    attempt: 0
  });

  config.lastPublishedAt = now().toISOString();
  writeTextFile(path.join(projectRoot, "publish.json"), `${JSON.stringify(sortPublishConfig(config), null, 2)}\n`);

  return {
    url: config.url,
    isFirstPublish,
    fileCount: result.fileCount
  };
}

export async function unpublishSite(options = {}) {
  if (!options.projectRoot) {
    throw new Error("unpublishSite requires projectRoot");
  }

  const projectRoot = path.resolve(options.projectRoot);
  const configPath = path.join(projectRoot, "publish.json");
  const config = loadPublishConfig(projectRoot);
  if (!config) {
    throw publishError(
      "corrupt_config",
      "publish.json exists but is malformed. Delete it to start fresh, or fix its contents."
    );
  }

  const requestFetch = resolveFetch(options.fetch);
  const response = await requestFetch(PUBLISH_ENDPOINT, {
    method: "DELETE",
    headers: publishHeaders(config)
  });

  switch (response.status) {
  case 200:
  case 404:
    fs.rmSync(configPath, { force: true });
    return { unpublished: true };
  case 403:
    throw publishError("token_mismatch", "Token doesn't match. Check your publish.json.", response.status);
  default:
    throw publishError("server_error", await responseText(response), response.status);
  }
}

export function slugForWikiName(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
}

export function createWikiScaffold(options = {}) {
  const name = String(options.name ?? "").trim();
  if (!name) {
    throw new Error("createWikiScaffold requires a wiki name");
  }
  if (!options.parentDir) {
    throw new Error("createWikiScaffold requires parentDir");
  }

  const repositoryRoot = path.resolve(options.repositoryRoot ?? defaultRepositoryRoot());
  const parentDir = path.resolve(options.parentDir);
  const slug = slugForWikiName(name);
  if (!slug) {
    throw new Error("createWikiScaffold requires a sluggable wiki name");
  }

  const wikiPath = path.join(parentDir, slug);
  const scaffoldDir = path.join(repositoryRoot, "Sources", "Wikiwise", "Resources", "scaffold");
  if (!fs.existsSync(scaffoldDir)) {
    throw new Error(`Missing Wikiwise scaffold resources: ${scaffoldDir}`);
  }

  for (const directoryPath of [
    wikiPath,
    path.join(wikiPath, "raw"),
    path.join(wikiPath, "wiki"),
    path.join(wikiPath, "wiki", "sources"),
    path.join(wikiPath, "site"),
    path.join(wikiPath, "site", "out"),
    path.join(wikiPath, ".claude"),
    path.join(wikiPath, ".claude", "skills")
  ]) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  copyTemplateFile(
    path.join(scaffoldDir, "CLAUDE.md"),
    path.join(wikiPath, "CLAUDE.md"),
    [["{{WIKI_NAME}}", name]]
  );
  fs.copyFileSync(path.join(scaffoldDir, "AGENTS.md"), path.join(wikiPath, "AGENTS.md"));

  const llmWikiPath = path.join(scaffoldDir, "llm-wiki.md");
  if (fs.existsSync(llmWikiPath)) {
    fs.copyFileSync(llmWikiPath, path.join(wikiPath, "llm-wiki.md"));
  }

  for (const fileName of ["home.md", "index.md", "log.md"]) {
    const sourcePath = path.join(scaffoldDir, "wiki", fileName);
    const destinationPath = path.join(wikiPath, "wiki", fileName);
    if (fileName === "home.md") {
      copyTemplateFile(sourcePath, destinationPath, [["{{WIKI_PATH}}", wikiPath]]);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }

  for (const skill of [
    "ingest",
    "digest",
    "lint",
    "ingest-tweets",
    "import-readwise",
    "fetch-readwise-document",
    "fetch-readwise-highlights",
    "upgrade"
  ]) {
    fs.cpSync(path.join(scaffoldDir, "skills", skill), path.join(wikiPath, ".claude", "skills", skill), {
      recursive: true
    });
  }

  writeTextFile(path.join(wikiPath, ".claude", "settings.json"), scaffoldSettingsJson());
  fs.copyFileSync(resolveRepositoryResourcePath(repositoryRoot, "build.js"), path.join(wikiPath, "site", "build.js"));
  fs.copyFileSync(resolveRepositoryResourcePath(repositoryRoot, "style.css"), path.join(wikiPath, "site", "style.css"));

  for (const resourceName of [
    "markdown-it.min.js",
    "app.js",
    "graph.js",
    "map.html",
    "map-3d.html"
  ]) {
    fs.copyFileSync(
      resolveRepositoryResourcePath(repositoryRoot, resourceName),
      path.join(wikiPath, "site", resourceName)
    );
  }

  const createdDate = options.createdDate ?? currentISODate();
  writeTextFile(path.join(wikiPath, ".claude", "scaffold-version"), `created:${createdDate}\n`);
  writeTextFile(path.join(wikiPath, ".gitignore"), "site/out/\npublish.json\n.rebuild\n");

  return {
    path: wikiPath,
    name,
    slug
  };
}

export function summarizeWatchEvents({ projectRoot, outputDir, events }) {
  let cssChanged = false;
  let rebuildTriggered = false;
  let structureChanged = false;
  const changedMarkdownPaths = new Set();

  for (const event of events ?? []) {
    const eventPath = path.resolve(event.path);
    if (isNativeOutputPath(eventPath, outputDir)) continue;

    const fileName = path.basename(eventPath);
    const relativePath = path.relative(projectRoot, eventPath).split(path.sep).join("/");

    if (relativePath === ".rebuild" && !event.removed) {
      rebuildTriggered = true;
    } else if (eventPath.endsWith(".css")) {
      cssChanged = true;
    } else if (eventPath.endsWith(".md")) {
      if (event.eventType === "rename" || event.created || event.removed || event.renamed) {
        structureChanged = true;
      } else {
        changedMarkdownPaths.add(eventPath);
      }
    } else if (["build.js", "app.js", "graph.js", "map.html"].includes(fileName)) {
      structureChanged = true;
    } else if (isNativeWikiAssetsPath(relativePath)) {
      structureChanged = true;
    }
  }

  const sortedMarkdownPaths = [...changedMarkdownPaths].sort();

  if (rebuildTriggered) {
    return createWatchSummary("rebuild", false, [], false);
  }

  if (structureChanged) {
    return createWatchSummary("structure", false, [], true);
  }

  if (cssChanged || sortedMarkdownPaths.length > 0) {
    return createWatchSummary("content", cssChanged, sortedMarkdownPaths, false);
  }

  return null;
}

function isNativeWikiAssetsPath(relativePath) {
  return relativePath.startsWith("wiki/assets/") || relativePath.includes("/wiki/assets/");
}

function isNativeOutputPath(eventPath, outputDir) {
  return eventPath.startsWith(path.resolve(outputDir));
}

export function slugForPath(filePath) {
  const fileName = path.basename(filePath);
  let slug = fileName.replace(/\.md$/i, "").toLowerCase().replace(/ /g, "-");
  const parts = filePath.split(path.sep);
  if (parts.includes("raw") && parts.indexOf("raw") >= parts.length - 2) {
    slug = `raw-${slug}`;
  }
  return slug;
}

export class WikiCompiler {
  constructor(options = {}) {
    const sourceDir = options.sourceDir ?? options.projectRoot;
    if (!sourceDir) {
      throw new Error("WikiCompiler requires sourceDir or projectRoot");
    }

    this.sourceDir = path.resolve(sourceDir);
    this.projectRoot = this.sourceDir;
    this.repositoryRoot = path.resolve(options.repositoryRoot ?? defaultRepositoryRoot());
    this.outputDir = fs.existsSync(path.join(this.sourceDir, "site", "build.js"))
      ? path.join(this.sourceDir, "site", "out")
      : path.join(this.sourceDir, "wiki-site");
    this.logs = [];
    this.context = this.createContext();
    this.loadScripts();
  }

  scanPages() {
    return Number(this.callFunction("scanPages", this.sourceDir, this.outputDir) ?? 0);
  }

  compileAll() {
    const pageCount = Number(this.callFunction("compile", this.sourceDir, this.outputDir) ?? 0);
    this.callFunction("compileMap", this.sourceDir, this.outputDir);
    return pageCount;
  }

  compileMarkdownFile(filePath) {
    const sourcePath = path.resolve(filePath);
    const slug = slugForPath(sourcePath);
    const outputPath = this.outputHtmlPathForSlug(slug);
    let success = Boolean(this.callFunction("compilePage", slug));

    if (!success) {
      success = Boolean(this.callFunction("compileAdhoc", sourcePath, outputPath));
    }

    return {
      success,
      ok: success,
      sourcePath,
      slug,
      outputPath
    };
  }

  compileFile(filePath) {
    return this.compileMarkdownFile(filePath);
  }

  compilePage(slug) {
    const success = Boolean(this.callFunction("compilePage", slug));
    return {
      success,
      ok: success,
      slug,
      outputPath: this.outputHtmlPathForSlug(slug)
    };
  }

  compileNextBatch(size = 5) {
    return Number(this.callFunction("compileNextBatch", size) ?? 0);
  }

  compileAdhoc(filePath, outputPath) {
    return Boolean(this.callFunction("compileAdhoc", filePath, outputPath));
  }

  invalidatePage(slug) {
    return Boolean(this.callFunction("invalidatePage", slug));
  }

  invalidateAll() {
    return Number(this.callFunction("invalidateAll") ?? 0);
  }

  reloadCSS() {
    this.setBundledString("bundledCSS", this.readProjectOrRepositoryResource("style.css"));
    this.callFunction("reloadCSS", this.sourceDir);
  }

  rescan() {
    this.callFunction("rescan", this.sourceDir, this.outputDir);
  }

  outputHtmlPathForSlug(slug) {
    return path.join(this.outputDir, `${slug}.html`);
  }

  createContext() {
    const bridge = {
      readFile: (targetPath) => {
        try {
          return fs.readFileSync(targetPath, "utf8");
        } catch {
          return "";
        }
      },
      writeFile: (targetPath, content) => {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, content, "utf8");
      },
      listDir: (targetPath) => {
        try {
          return fs.readdirSync(targetPath).filter((name) => !name.startsWith("."));
        } catch {
          return [];
        }
      },
      mkdirp: (targetPath) => {
        fs.mkdirSync(targetPath, { recursive: true });
      },
      fileExists: (targetPath) => fs.existsSync(targetPath),
      copyFile: (sourcePath, destinationPath) => {
        try {
          fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
          if (fs.existsSync(destinationPath)) {
            fs.unlinkSync(destinationPath);
          }
          fs.copyFileSync(sourcePath, destinationPath);
          return true;
        } catch (error) {
          this.logs.push(`copyFile failed: ${sourcePath} -> ${destinationPath}: ${error.message}`);
          return false;
        }
      },
      fileMtime: (targetPath) => {
        try {
          return fs.statSync(targetPath).mtime.getTime() / 1000;
        } catch {
          return 0;
        }
      },
      log: (message) => {
        this.logs.push(String(message));
      },
      console
    };

    const context = vm.createContext(bridge);
    context.globalThis = context;
    context.self = context;
    return context;
  }

  loadScripts() {
    this.evaluateResourceScript(this.projectResourcePath("markdown-it.min.js", "markdown-it.min.js"));
    this.evaluateResourceScript(this.repositoryResourcePath("katex.min.js"));
    this.setBundledString("bundledKatexCSS", this.readRepositoryResource("katex.min.css"));
    this.setBundledString(
      "bundledKatexFontsDir",
      path.join(this.repositoryRoot, "Sources", "Wikiwise", "Resources", "katex-fonts"),
      { asPath: true }
    );
    this.setBundledString("bundledCSS", this.readProjectOrRepositoryResource("style.css"));
    this.setBundledString("bundledAppJS", this.readProjectOrRepositoryResource("app.js"));
    this.setBundledString("bundledGraphJS", this.readProjectOrRepositoryResource("graph.js"));
    this.setBundledString("bundledMapHTML", this.readProjectOrRepositoryResource("map.html"));
    this.setBundledString("bundledMap3dHTML", this.readProjectOrRepositoryResource("map-3d.html"));
    this.evaluateResourceScript(this.projectResourcePath("build.js", "build.js"));
  }

  callFunction(name, ...args) {
    const fn = this.context[name];
    if (typeof fn !== "function") {
      throw new Error(`Compiler function is not loaded: ${name}`);
    }
    return fn(...args);
  }

  evaluateResourceScript(resourcePath) {
    const source = fs.readFileSync(resourcePath, "utf8");
    const script = new vm.Script(source, { filename: resourcePath });
    return script.runInContext(this.context);
  }

  evaluateScript(source, filename = "wikiwise-compiler.js") {
    const script = new vm.Script(source, { filename });
    return script.runInContext(this.context);
  }

  setBundledString(variableName, value, options = {}) {
    if (value == null) return;
    const literal = JSON.stringify(value);
    this.evaluateScript(`var ${variableName} = ${literal};`, options.asPath ? variableName : `${variableName}.js`);
  }

  projectResourcePath(projectName, repositoryName = projectName) {
    const projectPath = path.join(this.sourceDir, "site", projectName);
    if (fs.existsSync(projectPath)) return projectPath;
    return this.repositoryResourcePath(repositoryName);
  }

  repositoryResourcePath(resourceName) {
    return resolveRepositoryResourcePath(this.repositoryRoot, resourceName);
  }

  readProjectOrRepositoryResource(resourceName) {
    return fs.readFileSync(this.projectResourcePath(resourceName), "utf8");
  }

  readRepositoryResource(resourceName) {
    return fs.readFileSync(this.repositoryResourcePath(resourceName), "utf8");
  }
}

export function scanOneLevel(rootPath) {
  const entries = fs
    .readdirSync(rootPath, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith("."))
    .map((entry) => ({
      name: entry.name,
      path: path.join(rootPath, entry.name),
      isDirectory: entry.isDirectory()
    }));

  const folders = sortFolders(entries.filter((entry) => entry.isDirectory));
  const files = sortFiles(
    entries.filter((entry) => {
      if (entry.isDirectory) return false;
      if (entry.name.endsWith(".min.js")) return false;
      return ["md", "css", "js", "json", "html"].includes(extension(entry.name));
    })
  );

  return [
    ...folders.map((entry) => ({
      id: entry.path,
      name: entry.name,
      path: entry.path,
      isDirectory: true,
      children: []
    })),
    ...files.map((entry) => ({
      id: entry.path,
      name: entry.name,
      path: entry.path,
      isDirectory: false
    }))
  ];
}

export function expandTreeDirectory(projectRoot, directoryPath) {
  const resolvedRoot = path.resolve(projectRoot);
  const resolvedDirectory = path.resolve(directoryPath);

  if (!isPathInside(resolvedDirectory, resolvedRoot)) {
    throw new Error("Directory must be inside the project root");
  }

  const stat = fs.statSync(resolvedDirectory);
  if (!stat.isDirectory()) {
    throw new Error("Tree expansion target must be a directory");
  }

  return scanOneLevel(resolvedDirectory);
}

function defaultRepositoryRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
}

function createWatchSummary(kind, cssChanged, changedMarkdownPaths, structureChanged) {
  return {
    kind,
    cssChanged,
    changedMarkdownPaths,
    structureChanged
  };
}

function copyTemplateFile(sourcePath, destinationPath, replacements) {
  let content = fs.readFileSync(sourcePath, "utf8");
  for (const [placeholder, value] of replacements) {
    content = content.split(placeholder).join(value);
  }
  writeTextFile(destinationPath, content);
}

function scaffoldSettingsJson() {
  return `{
  "permissions": {
    "allow": ["Read", "Write", "Edit", "Glob", "Grep", "Bash(*)"]
  },
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "echo \\"[Active file: $(cat .claude/active-file 2>/dev/null || echo none)]\\"",
            "timeout": 2000
          }
        ]
      }
    ]
  }
}
`;
}

function currentISODate() {
  return new Date().toISOString().slice(0, 10);
}

function resolveFetch(fetchOption) {
  const requestFetch = fetchOption ?? globalThis.fetch;
  if (typeof requestFetch !== "function") {
    throw new Error("Publishing requires a fetch implementation");
  }
  return requestFetch;
}

function publishError(code, message, status) {
  const error = new Error(message);
  error.code = code;
  if (status) error.status = status;
  return error;
}

function enumeratePublishFiles(folderPath) {
  const entries = [];
  const root = path.resolve(folderPath);

  function visit(directoryPath) {
    for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const entryPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        visit(entryPath);
      } else if (entry.isFile()) {
        entries.push({
          relativePath: path.relative(root, entryPath).split(path.sep).join("/"),
          data: fs.readFileSync(entryPath)
        });
      }
    }
  }

  visit(root);
  return entries;
}

function preparePublishFiles(entries) {
  if (!entries.some((entry) => entry.relativePath === "home.html")) {
    return entries;
  }

  const prepared = entries.map((entry) => {
    const data = entry.relativePath.endsWith(".html") ? rewriteIndexLinks(entry.data) : entry.data;
    if (entry.relativePath === "index.html") {
      return { relativePath: "catalog.html", data };
    }
    return { ...entry, data };
  });
  const home = entries.find((entry) => entry.relativePath === "home.html");
  prepared.push({
    relativePath: "index.html",
    data: rewriteIndexLinks(home.data)
  });
  return prepared;
}

function rewriteIndexLinks(data) {
  const html = data.toString("utf8");
  const rewritten = html
    .replaceAll('href="index.html"', 'href="catalog.html"')
    .replaceAll('href="index.html#', 'href="catalog.html#');
  return Buffer.from(rewritten, "utf8");
}

async function uploadPublishFiles({ requestFetch, config, files, isFirstPublish, randomSubdomain, attempt }) {
  const payload = {
    files: files.map((entry) => ({
      path: entry.relativePath,
      data: entry.data.toString("base64")
    }))
  };

  const response = await requestFetch(PUBLISH_ENDPOINT, {
    method: "PUT",
    headers: {
      ...publishHeaders(config),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  switch (response.status) {
  case 200:
    return { fileCount: payload.files.length };
  case 403:
    throw publishError("token_mismatch", "Token doesn't match. Check your publish.json.", response.status);
  case 409:
    if (isFirstPublish && attempt < 3) {
      config.subdomain = randomSubdomain();
      config.url = `https://${config.subdomain}.wiki-wise.com`;
      return uploadPublishFiles({
        requestFetch,
        config,
        files,
        isFirstPublish,
        randomSubdomain,
        attempt: attempt + 1
      });
    }
    throw publishError(
      "subdomain_taken",
      "That subdomain is already taken. Edit the subdomain in publish.json and try again.",
      response.status
    );
  case 413:
    throw publishError("too_large", await responseText(response), response.status);
  case 429:
    throw publishError("rate_limited", "Too many publishes. Try again in a few minutes.", response.status);
  default:
    throw publishError("server_error", await responseText(response), response.status);
  }
}

function publishHeaders(config) {
  return {
    Authorization: `Bearer ${config.token}`,
    "X-Subdomain": config.subdomain
  };
}

async function responseText(response) {
  if (typeof response.text === "function") {
    return response.text();
  }
  return "Unknown error";
}

function sortPublishConfig(config) {
  const sorted = {
    lastPublishedAt: config.lastPublishedAt,
    subdomain: config.subdomain,
    token: config.token,
    url: config.url
  };
  if (!sorted.lastPublishedAt) {
    delete sorted.lastPublishedAt;
  }
  return sorted;
}

function randomHex(length) {
  const chars = "0123456789abcdef";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function countWords(content) {
  return String(content).split(/\s+/).filter(Boolean).length;
}

function extractDirections(content) {
  const text = String(content);
  if (!text.startsWith("---")) return null;

  const lines = text.split("\n");
  if (lines.length <= 1) return null;

  let inFrontmatter = false;
  for (const line of lines) {
    if (line === "---") {
      if (inFrontmatter) return null;
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter && line.startsWith("directions:")) {
      const directions = line.slice("directions:".length).trim();
      return directions || null;
    }
  }

  return null;
}

function extractWikilinks(content) {
  const seen = new Set();
  const links = [];
  const pattern = /\[\[([\s\S]*?)\]\]/g;
  let match;

  while ((match = pattern.exec(String(content))) !== null) {
    const target = match[1];
    if (!target || seen.has(target)) continue;
    seen.add(target);
    links.push(target);
  }

  return links;
}

function isPathInside(filePath, directoryPath) {
  const relativePath = path.relative(path.resolve(directoryPath), path.resolve(filePath));
  return (
    relativePath === "" ||
    (relativePath !== ".." &&
      !relativePath.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relativePath))
  );
}

function extension(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return ext.startsWith(".") ? ext.slice(1) : ext;
}

function sortFolders(folders) {
  const topFolders = ["wiki"];
  const bottomFolders = ["raw", "site", "sources"];

  return folders.toSorted((a, b) => {
    const aTop = topFolders.indexOf(a.name);
    const bTop = topFolders.indexOf(b.name);
    const aBottom = bottomFolders.indexOf(a.name);
    const bBottom = bottomFolders.indexOf(b.name);

    if (aTop >= 0 && bTop >= 0) return aTop - bTop;
    if (aTop >= 0) return -1;
    if (bTop >= 0) return 1;
    if (aBottom >= 0 && bBottom >= 0) return aBottom - bBottom;
    if (aBottom >= 0) return 1;
    if (bBottom >= 0) return -1;

    return a.name.localeCompare(b.name, undefined, { sensitivity: "accent" });
  });
}

function sortFiles(files) {
  const pinnedFiles = ["AGENTS.md", "CLAUDE.md"];

  return files.toSorted((a, b) => {
    const aPin = pinnedFiles.indexOf(a.name);
    const bPin = pinnedFiles.indexOf(b.name);

    if (aPin >= 0 && bPin >= 0) return aPin - bPin;
    if (aPin >= 0) return -1;
    if (bPin >= 0) return 1;

    return a.name.localeCompare(b.name, undefined, { sensitivity: "accent" });
  });
}
