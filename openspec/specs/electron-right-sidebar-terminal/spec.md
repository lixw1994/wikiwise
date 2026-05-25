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
- **AND** each linked target uses the native `↗ target` marker
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

### Requirement: Right Sidebar Tab Switch Style Parity
The Electron right sidebar SHALL render the INFO/TERMINAL tabs with native compact pill-style switcher styling.

#### Scenario: Right sidebar tab switch uses native pill styling
- **WHEN** a project right sidebar is rendered
- **THEN** the INFO/TERMINAL switcher is left-aligned within the sidebar header area
- **AND** the switcher uses native 2px inner padding, tab-bar background fill, 5px container radius, 10px regular monospaced text, 0.8px tracking, 3px by 14px tab padding, inactive text color, active text color, active tab background, 4px active tab radius, and subtle active shadow
- **AND** right tab IDs, selected state, default Terminal tab, panel switching behavior, and right sidebar resizing behavior are not changed for this requirement

### Requirement: Info About Section Parity
The Electron INFO tab SHALL render selected-document metadata with the native `ABOUT THIS DOCUMENT` grouping and row styling.

#### Scenario: Metadata section is hidden without a selected document
- **WHEN** no document is selected
- **THEN** the INFO tab does not show the `ABOUT THIS DOCUMENT` section
- **AND** it does not show a `No document` placeholder in the metadata section

#### Scenario: Metadata section uses native grouping when a document is selected
- **WHEN** a document is selected
- **THEN** the INFO tab shows an `ABOUT THIS DOCUMENT` section above PATH, EDITED, and WORDS
- **AND** the section header uses native uppercase monospaced 9px text with 1.6px tracking and sidebar-header color
- **AND** metadata rows use native horizontal label/value layout with 10px monospaced labels, 12px serif values, sidebar-header label color, and info-value value color
- **AND** document info IPC, formatted edited time, word count, directions, linked targets, tab switching, and sidebar resizing behavior are not changed for this requirement

### Requirement: Info Directions Callout Parity
The Electron INFO tab SHALL render frontmatter directions with the native gold callout styling.

#### Scenario: Directions section uses native callout styling
- **WHEN** a selected document has frontmatter directions
- **THEN** the INFO tab shows the `DIRECTIONS` section with the existing directions text
- **AND** the directions text uses native 12px serif italic typography, info-value text color, 3px line-spacing equivalent, 10px vertical and 12px horizontal padding, accent-gold translucent background, and a 2px leading accent-gold strip
- **AND** directions parsing, directions section visibility, linked targets, metadata rows, tab switching, terminal behavior, and sidebar resizing behavior are not changed for this requirement

### Requirement: Info Linked Rows Style Parity
The Electron INFO tab SHALL render wikilink target rows with the native linked-row visual styling.

#### Scenario: Linked section rows use native typography and spacing
- **WHEN** a selected document contains wikilink targets
- **THEN** the INFO tab shows the `LINKED` section with the existing linked target rows
- **AND** each linked target keeps the native `↗ target` marker
- **AND** linked rows use native 13px serif typography, linked-text color, and 4px row spacing
- **AND** wikilink extraction, linked section visibility, directions callout, metadata rows, tab switching, terminal behavior, and sidebar resizing behavior are not changed for this requirement
