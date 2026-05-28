## MODIFIED Requirements

### Requirement: Runtime Parity Assertions

The runtime audit SHALL fail when required native-shell parity markers are missing, including the native default WIKI preview for markdown detail views.

#### Scenario: Audit assertions are evaluated

- **WHEN** the runtime audit evaluates a scenario
- **THEN** it verifies the document title is `Wikiwise`
- **AND** it verifies the renderer does not expose the shared-resources debug panel
- **AND** it verifies screenshots are nonblank at the expected viewport size
- **AND** welcome scenarios verify native welcome text and hidden project state
- **AND** project scenarios verify opened project chrome, selected document state, preview surface, and right sidebar state
- **AND** project scenarios verify markdown files initially show the WIKI preview before the audit switches to FILE editor mode
- **AND** project scenarios verify terminal output comes from PTY data instead of Electron-only startup placeholder text
- **AND** project scenarios record prompt ANSI sequence, xterm cell color, and terminal cursor evidence for visual parity review

### Requirement: Terminal Cursor Runtime Evidence

The Electron runtime parity audit SHALL retain evidence that opened-project terminal scenarios render a visible terminal cursor.

#### Scenario: Project runtime audit records cursor evidence

- **WHEN** the runtime audit opens a folder project and shows the TERMINAL tab
- **THEN** the report records that xterm cursor evidence is present for the visible terminal surface
- **AND** the report records that focused cursor style is block and inactive cursor style is outline
- **AND** the report records that xterm cursor blink is disabled for stable overlay positioning
- **AND** the report records that the focused rendered cursor overlay uses the terminal cursor blink animation
- **AND** the report records that the cursor color uses the native-like insertion cursor color
- **AND** the report records that a rendered cursor overlay is visible in the terminal surface
- **AND** existing terminal startup, resize, input, echo, screenshot, and appearance evidence remain unchanged

#### Scenario: Missing cursor fails runtime parity

- **WHEN** an opened-project runtime scenario has no xterm cursor evidence, does not use the native focused/inactive cursor styles, or lacks focused cursor blink evidence
- **THEN** the runtime audit fails that scenario
- **AND** the failure message identifies terminal cursor parity as the missing evidence

### Requirement: Terminal Prompt Color Runtime Evidence

The Electron runtime parity audit SHALL retain evidence that project terminal prompts preserve ANSI color rendering through xterm.

#### Scenario: Project runtime audit records prompt color evidence

- **WHEN** the runtime audit opens a folder project and captures terminal evidence
- **THEN** the report records bright-green and cyan ANSI prompt sequences from PTY output
- **AND** the report records xterm buffer cells with green and cyan palette foregrounds for the rendered prompt
- **AND** the report records the configured native-like prompt palette used by xterm

#### Scenario: Missing prompt color evidence fails runtime parity

- **WHEN** an opened-project runtime scenario lacks prompt ANSI evidence or xterm prompt cell color evidence
- **THEN** the runtime audit fails that scenario
- **AND** the failure message identifies terminal prompt color or terminal prompt cell color evidence as missing
