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
  const activeFilePath = path.join(projectRoot, ".claude", "active-file");
  const relativePath = path.relative(projectRoot, filePath).split(path.sep).join("/");

  writeTextFile(activeFilePath, relativePath);

  return {
    path: activeFilePath,
    relativePath
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
    if (isPathInside(eventPath, outputDir)) continue;

    const fileName = path.basename(eventPath);
    const relativePath = path.relative(projectRoot, eventPath).split(path.sep).join("/");

    if (relativePath === ".rebuild" && !event.removed) {
      rebuildTriggered = true;
    } else if (/\.css$/i.test(eventPath)) {
      cssChanged = true;
    } else if (/\.md$/i.test(eventPath)) {
      if (event.eventType === "rename" || event.created || event.removed || event.renamed) {
        structureChanged = true;
      } else {
        changedMarkdownPaths.add(eventPath);
      }
    } else if (["build.js", "app.js", "graph.js", "map.html"].includes(fileName)) {
      structureChanged = true;
    } else if (relativePath.startsWith("wiki/assets/")) {
      structureChanged = true;
    }
  }

  const sortedMarkdownPaths = [...changedMarkdownPaths].sort();

  if (rebuildTriggered) {
    return createWatchSummary("rebuild", false, [], false);
  }

  if (structureChanged) {
    return createWatchSummary("structure", false, sortedMarkdownPaths, true);
  }

  if (cssChanged || sortedMarkdownPaths.length > 0) {
    return createWatchSummary("content", cssChanged, sortedMarkdownPaths, false);
  }

  return null;
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

function countWords(content) {
  return String(content).split(/\s+/).filter(Boolean).length;
}

function extractDirections(content) {
  const lines = String(content).split(/\r?\n/);
  if (lines[0]?.trim() !== "---") return null;

  for (const line of lines.slice(1)) {
    const trimmed = line.trim();
    if (trimmed === "---") return null;
    if (trimmed.startsWith("directions:")) {
      const directions = trimmed.slice("directions:".length).trim();
      return directions || null;
    }
  }

  return null;
}

function extractWikilinks(content) {
  const seen = new Set();
  const links = [];
  const pattern = /\[\[([^\]]+)\]\]/g;
  let match;

  while ((match = pattern.exec(String(content))) !== null) {
    const target = match[1].trim();
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
