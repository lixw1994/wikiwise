## ADDED Requirements

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
