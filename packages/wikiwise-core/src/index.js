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
