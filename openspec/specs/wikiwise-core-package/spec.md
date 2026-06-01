# wikiwise-core-package Specification

## Purpose
Define the shared JavaScript core package that owns wiki compilation, file-tree, scaffold, watcher, publishing, and resource-path behavior for Electron reuse.
## Requirements
### Requirement: Workspace Core Package

The repository SHALL include a private `@wikiwise/core` npm workspace package at `packages/wikiwise-core` that can be used by future JavaScript and Electron code without depending on an app runtime.

#### Scenario: Core package is discoverable

- **WHEN** a developer inspects the root npm workspace configuration
- **THEN** `packages/wikiwise-core` is included through the workspace package pattern
- **AND** the package declares the name `@wikiwise/core`

### Requirement: Bundled Resource Metadata

The core package SHALL expose a stable list of existing Wikiwise bundled resource names that Electron can reuse from `apps/electron/resources`.

#### Scenario: Resource names are requested

- **WHEN** JavaScript imports `getBundledResourceNames` from `@wikiwise/core`
- **THEN** the returned array includes `build.js`, `style.css`, `app.js`, `graph.js`, `map.html`, `map-3d.html`, `markdown-it.min.js`, `katex.min.js`, and `katex.min.css`
- **AND** callers cannot mutate the package's internal resource list by changing the returned array

### Requirement: Repository Resource Resolution

The core package SHALL resolve existing bundled resource file paths from a repository root while rejecting unknown or missing resource names.

#### Scenario: Existing resource is resolved

- **WHEN** JavaScript calls `resolveRepositoryResourcePath` with the repository root and `build.js`
- **THEN** the returned path points to `apps/electron/resources/build.js`
- **AND** the file exists on disk

#### Scenario: Unknown resource is rejected

- **WHEN** JavaScript calls `resolveRepositoryResourcePath` with a resource name not owned by Wikiwise
- **THEN** the function throws an error that identifies the unknown resource

### Requirement: Compatible File Tree Scan

The core package SHALL expose a file tree scan helper for visible Wikiwise files.

#### Scenario: Directory is scanned

- **WHEN** JavaScript calls the scan helper with a project directory
- **THEN** the result includes visible directories and files with extensions `md`, `css`, `js`, `json`, and `html`
- **AND** hidden files are excluded
- **AND** `.min.js` files are excluded
- **AND** directory nodes include empty `children` arrays so the renderer can treat them as expandable

#### Scenario: Wikiwise ordering is applied

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

### Requirement: Slug Behavior

The core package SHALL expose slug helpers for page paths.

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

The core package SHALL expose an active-file tracking helper compatible with the `.claude/active-file` behavior.

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

The core package SHALL expose helpers that classify and coalesce watched filesystem events for Electron watcher behavior.

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

### Requirement: Target-Aware Publish Config

The core package SHALL support publish configuration that distinguishes official Wikiwise publishing from Cloudflare Hub publishing.

#### Scenario: Existing official publish config is loaded

- **WHEN** a project contains the current official `publish.json` shape with `subdomain`, `token`, and `url`
- **THEN** the core package treats it as an official publish config
- **AND** existing callers can continue to publish through the official service

#### Scenario: Cloudflare Hub publish config is loaded

- **WHEN** a project contains Cloudflare Hub publish settings
- **THEN** the core package returns the Hub endpoint, wiki slug, visibility, auth realm, comment policy, and published URL
- **AND** malformed Hub configs are rejected with stable publish config errors

### Requirement: Cloudflare Hub Publish Payload

The core package SHALL prepare compiled wiki output for Cloudflare Hub publishing.

#### Scenario: Hub payload is prepared

- **WHEN** the core package prepares a Cloudflare Hub publish payload from a compiled site folder
- **THEN** static files are included as path/data entries
- **AND** root home rewrite behavior remains consistent with existing publishing
- **AND** wiki settings are included with the payload

#### Scenario: Hub publish excludes local secrets

- **WHEN** a Cloudflare Hub publish payload is prepared
- **THEN** OAuth client secrets, session secrets, and local-only credentials are not included in the payload

### Requirement: Cloudflare Hub Publish API Client

The core package SHALL expose helpers for publishing compiled wiki output to a Cloudflare Hub.

#### Scenario: Wiki is published to Hub

- **WHEN** JavaScript calls the Cloudflare Hub publish helper with a project root, site folder, Hub endpoint, publish token, wiki slug, and wiki settings
- **THEN** the helper sends the publish request to the Hub
- **AND** saves local publish config after success
- **AND** returns the published URL and uploaded file count

#### Scenario: Hub publish errors are mapped

- **WHEN** the Hub returns auth, validation, payload-size, rate-limit, or server errors
- **THEN** the helper rejects with stable error codes suitable for Electron error feedback

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

### Requirement: Watch Event Extension Case Parity

The core package SHALL classify watched markdown and CSS events with the same case-sensitive suffix semantics as native `FileWatcher`.

#### Scenario: Upper-case markdown and CSS watcher paths change
- **WHEN** JavaScript summarizes watched paths ending in `.MD` or `.CSS`
- **THEN** those events do not produce markdown or CSS watch summaries solely because of the upper-case extension

#### Scenario: Lower-case markdown and CSS watcher paths change
- **WHEN** JavaScript summarizes watched paths ending in `.md` or `.css`
- **THEN** existing native-compatible markdown and CSS content summaries remain available

### Requirement: Watch Assets Path Parity

The core package SHALL classify watched asset paths using the same `/wiki/assets/` containment semantics as native `FileWatcher`.

#### Scenario: Nested wiki assets path changes
- **WHEN** JavaScript summarizes a watched path containing `/wiki/assets/` below the project root
- **THEN** that event produces a structure summary

#### Scenario: Non-assets lookalike path changes
- **WHEN** JavaScript summarizes a watched path such as `notwiki/assets/image.png`
- **THEN** the path does not produce a structure summary solely because it contains the text `wiki/assets`

### Requirement: Watch Output Prefix Parity

The core package SHALL filter watched output paths using the same output-directory prefix semantics as native `FileWatcher`.

#### Scenario: Output directory descendants change
- **WHEN** JavaScript summarizes a watched path below the compiler output directory
- **THEN** that event is ignored before watcher classification

#### Scenario: Output sibling-prefix paths change
- **WHEN** JavaScript summarizes a watched path whose absolute path starts with the compiler output directory path but is not a path-contained descendant
- **THEN** that event is ignored like native `path.hasPrefix(watcher.outputDir)`

#### Scenario: Non-output paths change
- **WHEN** JavaScript summarizes a watched path that does not start with the compiler output directory path
- **THEN** existing watcher classification remains available for markdown, CSS, structure, rebuild, support-file, and assets events

### Requirement: Watch Structure Priority Payload Parity

The core package SHALL omit markdown path payloads from structure-priority watch summaries, matching native `FileWatcher` structure callbacks.

#### Scenario: Markdown and structure events coalesce
- **WHEN** JavaScript summarizes a debounce batch containing both markdown content paths and structure-triggering paths
- **THEN** the result is a structure summary
- **AND** the structure summary contains no changed markdown paths

#### Scenario: Markdown content events without structure
- **WHEN** JavaScript summarizes markdown content paths without rebuild or structure events
- **THEN** the result retains changed markdown paths for content refresh behavior

### Requirement: Native-Compatible Publish Error Copy
The core package SHALL expose native publish failure descriptions while preserving stable machine-readable error codes.

#### Scenario: Malformed publish config is rejected
- **WHEN** JavaScript loads a malformed `publish.json`
- **THEN** the helper rejects with the native corrupt-config description
- **AND** the helper preserves the existing corrupt-config error code

#### Scenario: Publish service returns mapped failure statuses
- **WHEN** JavaScript publishes or unpublishes and the service returns token mismatch, subdomain taken, rate-limited, or server failure responses
- **THEN** the helper rejects with the native description for the mapped failure where native defines a fixed description
- **AND** the helper preserves the existing stable error code for the mapped failure

#### Scenario: Upload is too large
- **WHEN** JavaScript publishes and the service returns an upload-too-large response body
- **THEN** the helper preserves the native behavior of using the service response body as the user-facing description

### Requirement: Native-Compatible Publish Subdomain Candidate
The core package SHALL generate random publish subdomain candidates with native `Publisher.randomSubdomain(wikiName:)` slug-prefix behavior.

#### Scenario: Wiki name candidate is generated
- **WHEN** JavaScript requests a random publish subdomain for a non-empty wiki name
- **THEN** the helper lowercases the name
- **AND** replaces spaces with hyphens
- **AND** removes characters other than Unicode letters, Unicode numbers, and hyphens
- **AND** truncates the sanitized slug to the first 20 native-compatible characters, not the first 20 UTF-16 code units
- **AND** appends a hyphen plus a six-character lowercase alphanumeric suffix

#### Scenario: Empty candidate uses suffix only
- **WHEN** JavaScript requests a random publish subdomain with no wiki name or with a name that sanitizes to an empty slug
- **THEN** the helper returns only a six-character lowercase alphanumeric suffix

### Requirement: Native-Compatible Directions Newline Parsing
The core package SHALL extract INFO directions from markdown frontmatter using native `RightSidebar.parseDirections(from:)` newline and exact-marker behavior.

#### Scenario: LF frontmatter directions are extracted
- **WHEN** JavaScript summarizes a markdown document whose text starts with LF-delimited frontmatter marker lines exactly equal to `---`
- **THEN** a non-empty exact `directions:` value inside the opening marker is returned after trimming spaces

#### Scenario: CRLF marker lines are ignored
- **WHEN** JavaScript summarizes a markdown document whose frontmatter marker lines are CRLF-delimited and therefore retain `\r` when split by native LF semantics
- **THEN** directions are not returned
- **AND** the rest of the document metadata summary remains available

### Requirement: Native-Compatible Wikilink Bracket Target Parsing
The core package SHALL extract INFO wikilink targets using native `RightSidebar.wikilinkTargets(in:)` scanner semantics.

#### Scenario: Target contains a single closing bracket
- **WHEN** JavaScript summarizes a markdown document containing a wikilink such as `[[Alpha]Beta]]`
- **THEN** the linked target list includes `Alpha]Beta`
- **AND** duplicate occurrences of the same raw target are still returned only once

#### Scenario: Existing raw target behavior remains
- **WHEN** JavaScript summarizes wikilinks with raw whitespace or empty target text
- **THEN** non-empty raw targets preserve their original whitespace
- **AND** empty targets remain omitted

### Requirement: Native-Compatible Publish Conflict Retry Subdomain
The core package SHALL generate automatic first-publish conflict retry subdomains using native `Publisher.publish` retry semantics.

#### Scenario: Initial candidate uses wiki name and retry uses suffix only
- **WHEN** JavaScript publishes a project with no existing `publish.json`
- **AND** the first upload receives a `409` conflict that triggers an automatic first-publish retry
- **THEN** the initial generated subdomain includes the native project-name slug prefix
- **AND** the automatic retry subdomain is generated without the project-name prefix and contains only the six-character lowercase alphanumeric suffix
- **AND** the helper preserves the native retry limit and existing `subdomain_taken` failure after retry exhaustion

#### Scenario: Explicit or existing subdomains remain stable
- **WHEN** JavaScript publishes with an explicit subdomain or an existing publish config
- **THEN** the helper continues to use the requested or saved subdomain unless the user explicitly changes it

### Requirement: Native-Compatible New Wiki Empty Slug Handling
The core package SHALL create new wiki scaffolds with native `ContentView.createNewWiki()` empty-slug semantics.

#### Scenario: Non-empty name filters to an empty slug
- **WHEN** JavaScript creates a new wiki with a name that is non-empty after trimming but sanitizes to an empty slug
- **THEN** the helper does not reject the name as unsluggable
- **AND** the target path resolves to the selected parent directory, matching native empty path-component behavior
- **AND** scaffold files and template replacements are still written

#### Scenario: Whitespace-only name remains rejected
- **WHEN** JavaScript creates a new wiki with a name that is empty after trimming whitespace
- **THEN** the helper rejects before writing target content

### Requirement: Native-Compatible Display File Read Fallback
The core package SHALL provide a display-oriented text-file read helper that mirrors native `ContentView.loadFile(_:)` fallback behavior without changing ordinary throwing file reads.

#### Scenario: Display read fails
- **WHEN** JavaScript reads selected-file content for display and the UTF-8 file read fails
- **THEN** the helper returns the exact native fallback text `Could not read file.`
- **AND** the caller can continue presenting the selected file state

#### Scenario: Internal read remains throwing
- **WHEN** JavaScript uses the ordinary text-file read helper for a missing or unreadable file
- **THEN** the helper continues to throw so internal configuration and validation paths keep their existing error semantics
