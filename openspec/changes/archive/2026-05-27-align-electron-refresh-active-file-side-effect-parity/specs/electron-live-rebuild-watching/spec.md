## ADDED Requirements

### Requirement: Watcher Refresh Active File Side Effect Parity

Electron live rebuild watching SHALL mirror native selected-file watcher refreshes by rewriting the active-file marker after watcher paths refresh the currently selected source file.

#### Scenario: Watcher refreshes selected Markdown active-file side effect
- **WHEN** a watched CSS, rebuild, or selected Markdown content change refreshes the currently selected Markdown source file
- **THEN** Electron refreshes the selected Markdown preview with the existing watcher semantics
- **AND** Electron rewrites `.claude/active-file` with the selected Markdown file path through the same silent active-file helper used by selection and save paths
- **AND** generated pages remain unaffected by watcher refreshes when no source file is selected

#### Scenario: Watcher refreshes selected non-Markdown active-file side effect
- **WHEN** a watched CSS or rebuild event reloads the currently selected non-Markdown source file from disk
- **AND** the selected file has no unsaved draft
- **THEN** Electron updates selected-file content, draft content, saved content, and clean state from disk
- **AND** Electron rewrites `.claude/active-file` with the selected non-Markdown file path through the same silent active-file helper used by selection and save paths
- **AND** Electron refreshes selected-file INFO metadata without requesting Markdown compiled-preview refresh for that selected non-Markdown file

#### Scenario: Watcher preserves dirty non-Markdown draft
- **WHEN** a watched CSS or rebuild event arrives while the selected non-Markdown file is dirty
- **THEN** Electron preserves the unsaved draft content
- **AND** Electron does not write active-file as a side effect of a skipped disk reload
