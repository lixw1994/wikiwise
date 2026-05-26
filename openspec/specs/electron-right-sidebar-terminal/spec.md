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

### Requirement: Info Optional Section Divider Parity
The Electron INFO tab SHALL render optional `DIRECTIONS` and `LINKED` sections with the native top divider and spacing.

#### Scenario: Optional info sections use native top divider rhythm
- **WHEN** a selected document has directions or wikilink targets
- **THEN** the corresponding optional INFO section uses a 1px sidebar-rule top divider
- **AND** the section content starts 18px below the divider
- **AND** the base `ABOUT THIS DOCUMENT` metadata list does not add artificial bottom margin in place of the optional divider
- **AND** directions callout styling, linked row styling, optional section visibility, document metadata, tab switching, terminal behavior, and sidebar resizing behavior are not changed for this requirement

### Requirement: Info Panel Padding Parity
The Electron INFO tab SHALL use the native 14px content inset.

#### Scenario: Info panel uses native content padding
- **WHEN** the Electron INFO tab is rendered
- **THEN** the INFO panel content uses 14px padding around the metadata and optional sections
- **AND** terminal panel padding, terminal emulator padding, Info section spacing, optional dividers, directions callout styling, linked row styling, tab switching, terminal behavior, and sidebar resizing behavior are not changed for this requirement

### Requirement: Terminal Panel Inset Parity
The Electron terminal tab SHALL place the xterm surface with the native top and leading inset.

#### Scenario: Terminal tab uses native asymmetric inset
- **WHEN** the Electron terminal tab is rendered
- **THEN** the terminal panel uses 4px top padding and 8px leading padding
- **AND** the terminal panel does not add trailing or bottom padding
- **AND** the xterm container does not add extra internal padding on every side
- **AND** PTY startup, terminal input/output, terminal resizing, ANSI rendering, Info tab behavior, tab switching, and sidebar resizing behavior are not changed for this requirement

### Requirement: Terminal CSS Palette Parity
The Electron terminal panel and surface CSS SHALL use native SwiftTerm background and foreground colors for light and dark appearances.

#### Scenario: Terminal CSS fallback uses native palette
- **WHEN** the Electron terminal tab is rendered before or around xterm initialization
- **THEN** the terminal panel and terminal surface backgrounds use the native terminal background color for the active appearance
- **AND** the terminal surface foreground fallback uses the native terminal foreground color for the active appearance
- **AND** the light colors are `#F3EDDE` background and `#5B5240` foreground
- **AND** the dark colors are `#0E0C08` background and `#CFC3A3` foreground
- **AND** xterm runtime theme, PTY startup, terminal input/output, terminal resizing, terminal inset, ANSI rendering, Info tab behavior, tab switching, and sidebar resizing behavior are not changed for this requirement

### Requirement: Right Sidebar Tab Header Divider Parity
The Electron right sidebar tab header SHALL render native top and bottom sidebar-rule dividers around the tab bar.

#### Scenario: Right sidebar tab header uses divider pair
- **WHEN** a project right sidebar is rendered
- **THEN** the right tab header has a 1px top divider using the sidebar-rule color
- **AND** it keeps the existing 1px bottom divider using the sidebar-rule color
- **AND** tab switcher alignment, tab padding, text styling, active tab styling, selected state, panel switching, terminal behavior, Info tab behavior, and sidebar resizing behavior are not changed for this requirement

### Requirement: Right Sidebar Resize Handle Visual Parity
The Electron right-sidebar resize handle SHALL visually match the native macOS transparent resize overlay while preserving the existing resize interaction.

#### Scenario: Right sidebar resize handle remains visually transparent
- **WHEN** a project right sidebar is rendered
- **THEN** the resize handle uses a 5px leading-edge hit target with a column-resize cursor
- **AND** the base handle background is transparent
- **AND** hover and focus-visible states remain visually transparent
- **AND** the handle does not use the generic resize hover fill
- **AND** right-sidebar width dragging, tab selection, terminal behavior, Info tab behavior, and layout constraints are not changed for this requirement

### Requirement: Standalone File Terminal Boundary
The Electron app SHALL not start a project-root terminal for standalone-file opens.

#### Scenario: Standalone file opens
- **WHEN** the renderer applies a standalone-file project result
- **THEN** it does not start a PTY terminal for the file's parent directory
- **AND** any previous terminal output subscription is stopped or cleaned up
- **AND** selected-document INFO metadata may still render for the standalone file

#### Scenario: Folder project opens
- **WHEN** the renderer applies a folder project result
- **THEN** existing project-root terminal startup behavior is retained

### Requirement: Info Word Count Format Parity
The Electron INFO tab SHALL render selected-document word counts with the same native decimal grouping behavior used by SwiftUI.

#### Scenario: Large word count is displayed
- **WHEN** the selected document metadata contains a numeric word count large enough to use decimal grouping in the user's locale
- **THEN** the INFO tab WORDS value is formatted with locale-aware decimal grouping
- **AND** the renderer does not display the raw unformatted numeric string
- **AND** document-info IPC continues to expose the underlying numeric word count
- **AND** PATH, EDITED, directions, linked targets, tab switching, terminal behavior, and sidebar resizing behavior are unchanged

### Requirement: Info Edited Relative Time Format Parity
The Electron INFO tab SHALL render selected-document edited timestamps with native numeric relative time formatting.

#### Scenario: Old edited timestamp is displayed
- **WHEN** the selected document metadata contains a modified timestamp older than one week
- **THEN** the INFO tab EDITED value remains a localized relative time value
- **AND** weeks, months, or years are used instead of an absolute date/time string
- **AND** named shortcuts such as `yesterday` are not used in place of numeric relative values
- **AND** document-info IPC continues to expose the underlying modified timestamp
- **AND** PATH, WORDS, directions, linked targets, tab switching, terminal behavior, and sidebar resizing behavior are unchanged

### Requirement: Info Directions Parser Parity
The Electron INFO tab SHALL display directions only when core document-info extraction matches the native `RightSidebar.parseDirections` frontmatter rules.

#### Scenario: Native-compatible directions are displayed
- **WHEN** a selected markdown document has an exact opening `---` line and a frontmatter line beginning exactly with `directions:`
- **THEN** the INFO tab shows the `DIRECTIONS` section with the trimmed directions text

#### Scenario: Native-incompatible loose directions are hidden
- **WHEN** a selected markdown document only has directions in loose frontmatter that native `RightSidebar.parseDirections` ignores
- **THEN** the INFO tab hides the `DIRECTIONS` section
- **AND** the renderer does not display directions text that native macOS would omit

#### Scenario: Native-compatible loose closing delimiter behavior is preserved
- **WHEN** a selected markdown document has an exact opening frontmatter marker and a whitespace-padded `---` line before an exact `directions:` line
- **THEN** the INFO tab shows the `DIRECTIONS` section with the directions text native macOS would find

### Requirement: Info Wikilink Target Parser Parity
The Electron INFO tab SHALL display linked target rows from document metadata using native raw wikilink target semantics.

#### Scenario: Raw linked target row is displayed
- **WHEN** a selected markdown document contains a wikilink target with surrounding whitespace inside `[[` and `]]`
- **THEN** the INFO tab shows the `LINKED` section with the target text exactly as native macOS would render it

#### Scenario: Distinct raw linked targets are displayed
- **WHEN** a selected markdown document contains wikilink targets that differ only by surrounding whitespace
- **THEN** the INFO tab keeps distinct linked rows for each raw target in native encounter order
- **AND** exact duplicate raw targets are still displayed only once

### Requirement: Info Metadata Fallback Parity
The Electron INFO tab SHALL mirror native right-sidebar fallback behavior when selected-document metadata is unavailable.

#### Scenario: Selected document metadata is unavailable
- **WHEN** a selected document has no available document-info metadata
- **THEN** the INFO tab keeps the `ABOUT THIS DOCUMENT` section visible
- **AND** PATH displays the selected file name
- **AND** EDITED displays `—`
- **AND** WORDS displays `—`
- **AND** DIRECTIONS and LINKED sections stay hidden

#### Scenario: Document info refresh fails
- **WHEN** a selected document-info refresh rejects or cannot read metadata
- **THEN** Electron clears stale document metadata and re-renders the native fallback rows
- **AND** it does not show the generic shell error message for that metadata miss
