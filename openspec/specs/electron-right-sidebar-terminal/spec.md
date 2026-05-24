# electron-right-sidebar-terminal Specification

## Purpose
Define Electron right sidebar parity for document metadata and the project-root terminal, including PTY-backed terminal behavior that matches the native SwiftTerm surface.
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
- **AND** it hides the directions section when directions are absent
- **AND** it shows unique wikilink targets found in the file
- **AND** it hides the linked section when wikilinks are absent

### Requirement: Terminal Tab

The Electron right sidebar SHALL provide a PTY-backed interactive shell surface rooted at the opened project.

#### Scenario: Project terminal starts

- **WHEN** a project is opened or created
- **THEN** the renderer asks preload to start a terminal for the project root
- **AND** the main process starts a PTY session in that project root
- **AND** the terminal tab renders shell output through a terminal emulator surface
- **AND** keyboard input entered in the terminal emulator is sent to the PTY session

#### Scenario: Terminal is resized

- **WHEN** the right sidebar terminal surface changes size
- **THEN** the renderer calculates terminal columns and rows
- **AND** sends the dimensions through preload to the main process
- **AND** the main process resizes the PTY session

#### Scenario: Terminal renders ANSI behavior

- **WHEN** the PTY emits ANSI output, cursor movement, colors, or alternate-screen sequences
- **THEN** the renderer terminal emulator interprets those sequences instead of displaying raw escape text
- **AND** the terminal visual palette matches the native warm light/dark terminal palette

### Requirement: Deferred Terminal Gaps

The right sidebar/terminal phase SHALL no longer list PTY-grade terminal emulation, ANSI rendering, resizing, or SwiftTerm parity as deferred after Electron adopts a PTY-backed terminal emulator.

#### Scenario: PTY terminal is available

- **WHEN** Electron can start a project-root terminal and exchange input/output
- **THEN** the phase verification records that PTY-grade terminal emulation, ANSI rendering, resizing, and SwiftTerm parity are implemented
- **AND** any remaining terminal deviations are explicitly tracked as accepted follow-up gaps

### Requirement: Resizable Right Sidebar Surface
The Electron right-sidebar surface SHALL include native resize behavior for both Info and Terminal tabs.

#### Scenario: User resizes right sidebar on terminal tab
- **WHEN** the Terminal tab is active and the user drags the right-sidebar resize handle
- **THEN** the sidebar width updates without changing the active tab
- **AND** the terminal stays mounted and visible

#### Scenario: User resizes right sidebar on info tab
- **WHEN** the Info tab is active and the user drags the right-sidebar resize handle
- **THEN** the sidebar width updates without changing the active tab
- **AND** document metadata remains visible when a document is selected
