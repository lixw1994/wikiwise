# wikiwise-core-package Specification

## Purpose
Define the shared JavaScript core package that mirrors native wiki compilation, file-tree, scaffold, watcher, publishing, and resource-path behavior for Electron reuse.

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

### Requirement: Text File Writing

The core package SHALL expose a UTF-8 text file write helper for main-process save operations.

#### Scenario: Text file is written

- **WHEN** JavaScript calls the write helper with a file path and content
- **THEN** the file contents are written as UTF-8 text
- **AND** the returned result identifies the written path and byte count

### Requirement: Active File Tracking

The core package SHALL expose an active-file tracking helper compatible with the native `.claude/active-file` behavior.

#### Scenario: Active file is tracked for a scaffolded project
- **WHEN** JavaScript records an active file for a project root that already contains `.claude`
- **THEN** `.claude/active-file` is written under the project root
- **AND** its contents are the selected file path relative to the project root

#### Scenario: Active file tracking does not create agent metadata directories
- **WHEN** JavaScript records an active file for a project root that does not contain `.claude`
- **THEN** the helper does not create `.claude`
- **AND** it does not create `.claude/active-file`
- **AND** it still reports the selected file path relative to the project root

### Requirement: Watch Event Classification

The core package SHALL expose helpers that classify and coalesce watched filesystem events according to native FileWatcher rules.

#### Scenario: Watched events are summarized

- **WHEN** JavaScript summarizes changed paths for a project root and output directory
- **THEN** paths inside the output directory are ignored
- **AND** root `.rebuild` events produce a rebuild summary
- **AND** markdown create/delete/rename, support JS/map files, and `wiki/assets` changes produce a structure summary
- **AND** CSS changes and markdown content changes produce a content summary

### Requirement: Native-Compatible Wiki Scaffold

The core package SHALL expose helpers that create a scaffolded wiki matching the native `WikiScaffold` output.

#### Scenario: Wiki scaffold is created

- **WHEN** JavaScript creates a wiki scaffold with a repository root, parent directory, and wiki name
- **THEN** the target directory uses the native slug behavior for the wiki name
- **AND** native scaffold directories are created
- **AND** `CLAUDE.md` receives the human-readable wiki name
- **AND** `wiki/home.md` receives the created wiki path
- **AND** seed pages, agent instructions, skills, settings, build tooling, support files, scaffold version, and `.gitignore` are written

#### Scenario: Invalid scaffold input is rejected

- **WHEN** JavaScript creates a wiki scaffold with an empty wiki name
- **THEN** the helper rejects the request before writing scaffold content

### Requirement: Native-Compatible Document Info

The core package SHALL expose helpers that summarize selected markdown document metadata for the Electron INFO tab.

#### Scenario: Markdown document info is requested

- **WHEN** JavaScript summarizes an existing markdown file
- **THEN** the result includes the file path, basename, modification timestamp, word count, directions frontmatter value when present, and unique wikilink targets

#### Scenario: Missing document info is requested

- **WHEN** JavaScript summarizes a missing file
- **THEN** the helper rejects the request instead of returning fabricated metadata

### Requirement: Native-Compatible Publish Config

The core package SHALL read and write native-compatible publish configuration.

#### Scenario: Publish config is loaded

- **WHEN** JavaScript loads publish config from a project root
- **THEN** missing config returns null
- **AND** valid config returns `subdomain`, `token`, `lastPublishedAt`, and `url`
- **AND** malformed config is rejected

### Requirement: Native-Compatible Publish Availability

The core package SHALL check wiki subdomain availability using the native service contract.

#### Scenario: Availability is checked

- **WHEN** JavaScript checks a subdomain
- **THEN** the helper calls the check endpoint with the subdomain query parameter
- **AND** an existing token is sent as bearer authorization when provided
- **AND** the helper maps service reasons to available, owned, taken, invalid, or unknown

### Requirement: Native-Compatible Publish Upload

The core package SHALL publish compiled site output using the native upload contract.

#### Scenario: Site is published

- **WHEN** JavaScript publishes a compiled site folder
- **THEN** files are sent as base64 path/data entries
- **AND** existing config is reused when present
- **AND** new config is created when missing
- **AND** `publish.json` is saved after success with a fresh `lastPublishedAt`

#### Scenario: Root home rewrite is applied

- **WHEN** a compiled site includes `home.html` and `index.html`
- **THEN** `home.html` is also uploaded as root `index.html`
- **AND** original `index.html` is uploaded as `catalog.html`
- **AND** HTML links to `index.html` are rewritten to `catalog.html`

#### Scenario: Publish errors are mapped

- **WHEN** the publish service returns native error status codes
- **THEN** token mismatch, subdomain taken, upload too large, rate limited, and server errors are rejected with stable error codes

### Requirement: Native-Compatible Unpublish

The core package SHALL unpublish a wiki using the native delete contract.

#### Scenario: Wiki is unpublished

- **WHEN** JavaScript unpublishes a project with valid publish config
- **THEN** the helper sends a DELETE request with bearer token and subdomain
- **AND** local `publish.json` is removed after successful or already-gone responses

### Requirement: Progressive Cache Full Compile Compatibility
The core compiler SHALL complete full generated output after progressive scan or page compilation has seeded cache entries with deferred HTML.

#### Scenario: Full compile follows progressive scan
- **WHEN** a project has been scanned progressively and at least one markdown page has been compiled on demand
- **AND** a fresh compiler instance performs a full compile for the same project
- **THEN** full compilation succeeds without treating deferred HTML cache entries as rendered pages
- **AND** generated map output such as `map-3d.html` exists in the output directory

### Requirement: Native-Compatible Directions Frontmatter Parsing
The core document-info helper SHALL extract directions using the same exact frontmatter semantics as the native right sidebar.

#### Scenario: Exact directions frontmatter is requested
- **WHEN** JavaScript summarizes a markdown document whose first frontmatter line is exactly `---` and contains a line beginning exactly with `directions:`
- **THEN** the document info includes the trimmed directions value

#### Scenario: Loose frontmatter opening is ignored
- **WHEN** JavaScript summarizes a markdown document whose opening marker has leading or trailing whitespace instead of an exact `---` line
- **THEN** the document info directions value is absent

#### Scenario: Indented directions key is ignored
- **WHEN** JavaScript summarizes a markdown document whose frontmatter contains an indented `directions:` key
- **THEN** the document info directions value is absent

#### Scenario: Loose closing marker does not end frontmatter
- **WHEN** JavaScript summarizes a markdown document whose exact opening frontmatter marker is followed by a whitespace-padded `---` line before `directions:`
- **THEN** the document info still includes the later directions value that native parsing would find

### Requirement: Native-Compatible Document Info Wikilink Targets
The core document-info helper SHALL extract wikilink targets using the same raw target semantics as the native right sidebar.

#### Scenario: Raw wikilink target is requested
- **WHEN** JavaScript summarizes a markdown document containing a wikilink target with surrounding whitespace inside `[[` and `]]`
- **THEN** the document info includes the target exactly as written between the delimiters

#### Scenario: Exact duplicate wikilink targets are requested
- **WHEN** JavaScript summarizes a markdown document containing repeated identical raw wikilink targets
- **THEN** the document info includes that raw target once

#### Scenario: Trimmed-equivalent wikilink targets are requested
- **WHEN** JavaScript summarizes a markdown document containing multiple wikilink targets that differ only by surrounding whitespace
- **THEN** the document info keeps each distinct raw target in native encounter order
