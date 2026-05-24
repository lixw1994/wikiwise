## ADDED Requirements

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
