## ADDED Requirements

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
