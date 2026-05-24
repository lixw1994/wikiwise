# wikiwise-core-package Specification

## Purpose
TBD - created by archiving change add-electron-workspace. Update Purpose after archive.
## Requirements
### Requirement: Workspace Core Package

The repository SHALL include a private `@wikiwise/core` npm workspace package at `packages/wikiwise-core` that can be used by future JavaScript and Electron code without depending on the Swift app runtime.

#### Scenario: Core package is discoverable

- **WHEN** a developer inspects the root npm workspace configuration
- **THEN** `packages/wikiwise-core` is included through the workspace package pattern
- **AND** the package declares the name `@wikiwise/core`

### Requirement: Bundled Resource Metadata

The core package SHALL expose a stable list of existing Wikiwise bundled resource names that Electron can reuse from `Sources/Wikiwise/Resources`.

#### Scenario: Resource names are requested

- **WHEN** JavaScript imports `getBundledResourceNames` from `@wikiwise/core`
- **THEN** the returned array includes `build.js`, `style.css`, `app.js`, `graph.js`, `map.html`, `map-3d.html`, `markdown-it.min.js`, `katex.min.js`, and `katex.min.css`
- **AND** callers cannot mutate the package's internal resource list by changing the returned array

### Requirement: Repository Resource Resolution

The core package SHALL resolve existing bundled resource file paths from a repository root while rejecting unknown or missing resource names.

#### Scenario: Existing resource is resolved

- **WHEN** JavaScript calls `resolveRepositoryResourcePath` with the repository root and `build.js`
- **THEN** the returned path points to `Sources/Wikiwise/Resources/build.js`
- **AND** the file exists on disk

#### Scenario: Unknown resource is rejected

- **WHEN** JavaScript calls `resolveRepositoryResourcePath` with a resource name not owned by Wikiwise
- **THEN** the function throws an error that identifies the unknown resource

### Requirement: Native-Compatible File Tree Scan

The core package SHALL expose a file tree scan helper that matches the native app's one-level scan behavior for visible Wikiwise files.

#### Scenario: Directory is scanned

- **WHEN** JavaScript calls the scan helper with a project directory
- **THEN** the result includes visible directories and files with extensions `md`, `css`, `js`, `json`, and `html`
- **AND** hidden files are excluded
- **AND** `.min.js` files are excluded
- **AND** directory nodes include empty `children` arrays so the renderer can treat them as expandable

#### Scenario: Native ordering is applied

- **WHEN** the scan helper returns nodes
- **THEN** folders appear before files
- **AND** `wiki` appears before other folders
- **AND** `raw`, `site`, and `sources` appear after middle folders
- **AND** `AGENTS.md` and `CLAUDE.md` appear before other files

### Requirement: Text File Reading

The core package SHALL expose a safe text file read helper for renderer-driven file selection.

#### Scenario: Text file is read

- **WHEN** JavaScript calls the read helper with an existing UTF-8 text file
- **THEN** the file contents are returned as a string

### Requirement: Compiler Lifecycle API

The core package SHALL expose a compiler lifecycle API for scanning, compiling individual pages, compiling all pages, and resolving output HTML paths.

#### Scenario: Compiler is created

- **WHEN** JavaScript creates a compiler for a project root
- **THEN** the output directory matches native behavior: `site/out` when `site/build.js` exists and `wiki-site` otherwise
- **AND** bundled resources are loaded from project `site/` overrides when available, falling back to repository bundled resources

#### Scenario: Individual page is compiled

- **WHEN** JavaScript calls the compiler to compile a markdown file
- **THEN** the returned result identifies the source path, slug, output path, and whether compilation succeeded

### Requirement: Slug Parity

The core package SHALL expose slug helpers matching native page slug behavior.

#### Scenario: File slug is requested

- **WHEN** JavaScript asks for a slug for a file named `My Page.md`
- **THEN** the returned slug is `my-page`
