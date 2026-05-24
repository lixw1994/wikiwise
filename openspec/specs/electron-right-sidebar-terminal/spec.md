# electron-right-sidebar-terminal Specification

## Purpose
TBD - created by archiving change migrate-electron-right-sidebar-terminal. Update Purpose after archive.
## Requirements
### Requirement: Right Sidebar Layout

The Electron app SHALL show a right sidebar for opened projects with INFO and TERMINAL tabs.

#### Scenario: Project is open

- **WHEN** a project is open
- **THEN** the renderer displays a right sidebar next to the detail pane
- **AND** the sidebar has INFO and TERMINAL tab controls
- **AND** TERMINAL is the default active tab, matching native startup behavior

### Requirement: Info Tab

The Electron right sidebar SHALL show selected-document metadata matching native INFO behavior.

#### Scenario: Markdown file is selected

- **WHEN** a markdown file is selected
- **THEN** the INFO tab shows the selected document path label, modified time label, and word count
- **AND** it shows directions from frontmatter when present
- **AND** it shows unique wikilink targets found in the file

### Requirement: Terminal Tab

The Electron right sidebar SHALL provide an interactive shell surface rooted at the opened project.

#### Scenario: Project terminal starts

- **WHEN** a project is opened or created
- **THEN** the renderer asks preload to start a terminal for the project root
- **AND** the terminal tab displays shell output sent by the main process
- **AND** command input entered in the renderer is sent to the main process terminal session

### Requirement: Deferred Terminal Gaps

The right sidebar/terminal phase SHALL identify native terminal gaps that remain for later OpenSpec phases.

#### Scenario: Basic terminal is available

- **WHEN** Electron can start a project-root shell and exchange input/output
- **THEN** the phase verification records that PTY-grade terminal emulation, ANSI rendering, resizing, and full SwiftTerm parity remain deferred

