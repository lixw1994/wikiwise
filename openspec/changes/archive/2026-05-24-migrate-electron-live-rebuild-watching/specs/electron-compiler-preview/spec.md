## MODIFIED Requirements

### Requirement: Compiled Preview Mode

The Electron renderer SHALL offer File and Wiki modes for markdown files once compiled HTML is available, SHALL refresh that compiled HTML after markdown source saves, and SHALL refresh compiled HTML when watcher events affect the selected markdown page.

#### Scenario: Markdown file has compiled HTML

- **WHEN** a markdown file is selected and its compiled page exists
- **THEN** File mode displays the source text
- **AND** Wiki mode displays the compiled HTML in a sandboxed preview iframe

#### Scenario: Markdown file is saved

- **WHEN** a markdown file save returns an updated compiled page result
- **THEN** the renderer updates the selected file's compiled state
- **AND** Wiki mode loads the updated compiled file URL

#### Scenario: Watcher refresh affects selected markdown

- **WHEN** CSS changes, rebuild changes, or selected markdown file changes are reported by the project watcher
- **THEN** the renderer requests a compiled preview refresh
- **AND** the main process invalidates or reloads compiler state as needed before returning the preview file URL
