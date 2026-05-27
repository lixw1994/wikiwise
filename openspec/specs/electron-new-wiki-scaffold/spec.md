# electron-new-wiki-scaffold Specification

## Purpose
Define Electron new-wiki creation parity, including native sheet behavior, scaffold generation, post-create guide presentation, and runtime evidence for opening the created wiki.
## Requirements
### Requirement: New Wiki Dialog

The Electron app SHALL provide a create-new-wiki flow from the welcome screen that captures a wiki name and target location.

#### Scenario: User opens create flow

- **WHEN** the user chooses Create a New Wiki from the welcome screen
- **THEN** Electron shows a dialog with a wiki name field
- **AND** it shows a target location initialized to the user's `wikis` folder
- **AND** it lets the user choose a different parent directory through the main process
- **AND** the location chooser uses the native message copy `Choose where to create your wiki`
- **AND** the location chooser does not set an explicit dialog title because the current SwiftUI `NSOpenPanel` does not set `panel.title`
- **AND** the location chooser action uses the native `Choose…` label
- **AND** the confirm action uses the native `Create` label
- **AND** the Create action is disabled while the trimmed wiki name is empty
- **AND** the Create action remains disabled while a create request is in progress
- **AND** the dialog closes through the native cancel keyboard shortcut
- **AND** the dialog submits through the native default keyboard shortcut when Create is enabled

### Requirement: Scaffolded Wiki Creation

The Electron app SHALL create the same scaffolded wiki folder shape as the native app.

#### Scenario: User creates a wiki

- **WHEN** the user submits a valid wiki name and location
- **THEN** Electron creates a slug-named wiki directory under the chosen parent location
- **AND** it creates native scaffold directories, seed wiki pages, agent instructions, skills, settings, version marker, `.gitignore`, and build tooling
- **AND** template placeholders are replaced with the human-readable wiki name and created wiki path

### Requirement: Post-Creation Guide

The Electron app SHALL show a post-creation guide after opening a newly created wiki.

#### Scenario: Wiki is created successfully

- **WHEN** Electron finishes creating a new wiki
- **THEN** it opens the created project as the current wiki
- **AND** it starts project watching for that wiki
- **AND** it displays native guide copy explaining agent startup and seed options
- **AND** it uses the native `WikiWise created the folder structure, build tools, and agent skills. Now seed it with sources.` summary
- **AND** it uses the native `Use the built-in terminal in the right sidebar, or open your own terminal:` terminal instruction
- **AND** it uses the native `OPEN YOUR AGENT` and `SEED YOUR WIKI` guide headings
- **AND** it uses the native `Once your agent is running, try:` seed intro
- **AND** it uses the native final guidance about changing anything with the user's agent
- **AND** the user can dismiss the guide with `Got it — start reading` and start reading `wiki/home.md`

### Requirement: Deferred Scaffold Gaps

The scaffold/new wiki phase SHALL identify native creation gaps that remain for later OpenSpec phases.

#### Scenario: New wiki creation is available

- **WHEN** Electron can create and open scaffolded wikis
- **THEN** the phase verification records only scaffold/new-wiki gaps that remain deferred after later parity slices are archived
- **AND** built-in terminal, publishing setup, persistence, and native modal polish are not listed as deferred once their parity evidence has been archived

### Requirement: New Wiki Sheet Layout Parity
The Electron create-new-wiki dialog SHALL match the native SwiftUI new-wiki sheet's core layout and typography.

#### Scenario: New wiki sheet is inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** its panel uses the native 400px sheet width
- **AND** it uses the native 24px sheet padding
- **AND** it uses the native 20px vertical form spacing
- **AND** its title uses 16px semibold typography
- **AND** its field labels use 12px medium typography
- **AND** the existing name, location, choose, cancel, and create controls keep their IDs and labels

### Requirement: New Wiki Location Middle Truncation Parity
The Electron create-new-wiki dialog SHALL mirror the native sheet's one-line middle truncation for the selected location path.

#### Scenario: Long new-wiki location is displayed
- **WHEN** the Electron create-new-wiki dialog displays a long selected location path
- **THEN** the visible location text preserves the beginning and trailing folder name with an ellipsis in the middle
- **AND** the full selected location remains available as label metadata
- **AND** wiki creation continues to use the full selected location path
- **AND** short selected location paths remain unchanged

### Requirement: New Wiki Action Row Spacing Parity
The Electron create-new-wiki dialog SHALL match the native sheet's action row spacing.

#### Scenario: New wiki action row is inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** the Cancel/Create action row uses only the parent sheet's native 20px vertical spacing
- **AND** it does not add extra top margin above the action row
- **AND** the Cancel and Create controls keep their IDs and labels
- **AND** shared modal action spacing remains available for non-new-wiki dialogs

### Requirement: New Wiki Action Button Chrome Parity
The Electron create-new-wiki dialog SHALL use native sheet action button chrome instead of app-branded shared modal action styles.

#### Scenario: New wiki action buttons are inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** the Cancel and Create buttons do not use the shared app-branded primary or secondary action classes
- **AND** the Cancel and Create controls keep their IDs and labels
- **AND** the Create control keeps native default-action semantics and disabled behavior
- **AND** publish, unpublish, feedback, and other non-new-wiki dialogs keep their existing shared action button styling

### Requirement: New Wiki Location Chooser Button Chrome Parity
The Electron create-new-wiki dialog SHALL render the location `Choose…` control with native sheet button chrome instead of shared app-branded secondary action styling.

#### Scenario: New wiki location chooser is inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** the location chooser keeps the `choose-new-wiki-location` ID and native `Choose…` label
- **AND** the location chooser does not use shared `secondary-action` or `compact` classes
- **AND** the location chooser uses scoped new-wiki sheet button styling
- **AND** welcome, publish, unpublish, feedback, and other non-new-wiki controls keep their existing shared action button styling

### Requirement: New Wiki Name Field Rounded Border Parity
The Electron create-new-wiki dialog SHALL render the name field with native rounded-border text field density instead of relying only on shared form input chrome.

#### Scenario: New wiki name field is inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** the name field keeps the `new-wiki-name` ID and native `My Wiki` placeholder
- **AND** the name field keeps the shared text input base class for behavior consistency
- **AND** the name field uses scoped new-wiki rounded-border styling for compact native sheet density
- **AND** publish and other non-new-wiki text inputs keep their existing shared input styling

### Requirement: New Wiki Location Path Font Parity
The Electron create-new-wiki dialog SHALL render the selected location path using the native system text font rather than a monospace font stack.

#### Scenario: New wiki location path is inspected
- **WHEN** the Electron create-new-wiki dialog displays the selected location path
- **THEN** the path uses the native 12px system text font treatment
- **AND** the path does not use a monospace font family
- **AND** middle truncation, muted color, and full-path metadata remain available
- **AND** wiki creation continues to use the full selected location path

### Requirement: New Wiki Location Label Spacing Parity
The Electron create-new-wiki dialog SHALL mirror the native sheet's 6px spacing between the `Location` label and the selected path row.

#### Scenario: New wiki location spacing is inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** the `Location` label-to-path gap matches the native 6px field spacing
- **AND** the path keeps native system-font styling, muted color, and middle truncation
- **AND** the full selected path metadata remains available
- **AND** wiki creation continues to use the full selected location path

### Requirement: New Wiki Field Label Color Parity
The Electron create-new-wiki dialog SHALL render its field labels with the same sidebar text color used by the native SwiftUI sheet.

#### Scenario: New wiki field labels are inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** the `Name` and `Location` labels use the native sidebar text color
- **AND** the labels keep the native 12px medium typography
- **AND** shared field label color remains available for non-new-wiki dialogs

### Requirement: New Wiki Location Path Color Parity
The Electron create-new-wiki dialog SHALL render the selected location path with the same muted sidebar text color used by the native SwiftUI sheet.

#### Scenario: New wiki location path color is inspected
- **WHEN** the Electron create-new-wiki dialog displays the selected location path
- **THEN** the path uses the native muted sidebar text color
- **AND** the path keeps native system-font styling, spacing, and middle truncation
- **AND** shared muted text color remains available for non-new-wiki surfaces

### Requirement: Post-Create Guide Container Layout Parity
The Electron post-create guide SHALL match the native SwiftUI guide surface background, inset, and leading content column width.

#### Scenario: Post-create guide container is inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the guide surface uses the native content background color
- **AND** the guide content uses the native 40px inset
- **AND** direct guide content is constrained to the native 560px leading-aligned column
- **AND** existing guide copy, command rendering, and dismiss behavior are preserved

### Requirement: Post-Create Guide Title Parity
The Electron post-create guide SHALL render its title with the same native SwiftUI typography and selected text color.

#### Scenario: Post-create guide title is inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the `Your wiki is ready` title uses native 20px medium serif typography
- **AND** the title uses the native selected sidebar text color
- **AND** existing guide copy, container layout, command rendering, and dismiss behavior are preserved

### Requirement: Post-Create Guide Summary Text Parity
The Electron post-create guide SHALL render its opening summary paragraph with the same native SwiftUI typography, color, and line spacing.

#### Scenario: Post-create guide summary is inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the `WikiWise created the folder structure...` summary uses native 14px typography
- **AND** the summary uses the native sidebar text color
- **AND** the summary uses line spacing equivalent to native `.lineSpacing(3)`
- **AND** later guide paragraphs, guide copy, command rendering, and dismiss behavior are preserved

### Requirement: Post-Create Guide Divider Parity
The Electron post-create guide SHALL render native-style section dividers between the same guide sections separated by SwiftUI `Divider()` rows.

#### Scenario: Post-create guide dividers are inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the guide renders three dividers between the title summary, agent quick-start, seed options, and final guidance sections
- **AND** each divider uses the native sidebar rule color
- **AND** each divider is constrained to the native guide content column
- **AND** existing guide copy, command rendering, seed options, summary/title styling, and dismiss behavior are preserved

### Requirement: Post-Create Guide Section Heading Parity
The Electron post-create guide SHALL render its section heading labels with the same native SwiftUI typography, tracking, and color.

#### Scenario: Post-create guide section headings are inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the `OPEN YOUR AGENT` and `SEED YOUR WIKI` labels use native 10px semibold typography
- **AND** the labels use native tracking equivalent to `.tracking(1.5)`
- **AND** the labels use the native sidebar header color
- **AND** non-guide eyebrow styling and existing guide copy, dividers, command rendering, seed options, summary/title styling, and dismiss behavior are preserved

### Requirement: Post-Create Guide Intro Copy Parity
The Electron post-create guide SHALL render its agent and seed intro paragraphs with the same native SwiftUI typography and color.

#### Scenario: Post-create guide intro copy is inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the `Use the built-in terminal...` paragraph uses native 13px typography
- **AND** the `Once your agent is running, try:` paragraph uses native 13px typography
- **AND** both paragraphs use the native sidebar text color
- **AND** summary text, final guidance, lists, command rendering, headings, dividers, and dismiss behavior are preserved

### Requirement: Post-Create Guide Final Guidance Parity
The Electron post-create guide SHALL render its final guidance paragraph with the same native SwiftUI typography, color, and line spacing.

#### Scenario: Post-create guide final guidance is inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the final `This is your project...` guidance paragraph uses native 13px typography
- **AND** the paragraph uses the native sidebar text color
- **AND** the paragraph uses line spacing equivalent to native `.lineSpacing(2)`
- **AND** summary text, intro copy, headings, dividers, lists, command rendering, and dismiss behavior are preserved

### Requirement: Post-Create Guide Agent Command Label Parity
The Electron post-create guide SHALL render visible agent labels above each quick-start command with native SwiftUI typography and color.

#### Scenario: Post-create guide agent command labels are inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the Claude Code command is labeled `Claude Code`
- **AND** the Codex command is labeled `Codex`
- **AND** the Cursor command is labeled `Cursor`
- **AND** each label uses native 12px semibold typography and sidebar text color
- **AND** existing command code IDs, command population behavior, guide copy, dividers, headings, and dismiss behavior are preserved

### Requirement: Post-Create Guide Agent Command Chrome Parity
The Electron post-create guide SHALL render each quick-start command with native SwiftUI command text chrome.

#### Scenario: Post-create guide agent command chrome is inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** each agent command uses native 12px monospaced typography
- **AND** each command uses the native sidebar muted text color
- **AND** each command uses the native sidebar background
- **AND** each command uses native 10px horizontal and 6px vertical padding
- **AND** each command uses a native 4px rounded rectangle without an added border
- **AND** existing command labels, command code IDs, command population behavior, guide copy, dividers, headings, and dismiss behavior are preserved

### Requirement: Post-Create Guide Seed Option Row Parity
The Electron post-create guide SHALL render each seed suggestion as a native-style seed option row with icon, title, and command hierarchy.

#### Scenario: Post-create guide seed option rows are inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the seed section renders four rows for `Import from Readwise`, `Ingest an article`, `Import existing files`, and `Start from a topic`
- **AND** each row includes the corresponding native symbol identifier: `book`, `link`, `folder`, and `text.bubble`
- **AND** each icon uses native 13px accent-primary styling and a 20px column
- **AND** each row uses native 10px icon-to-text spacing
- **AND** each text stack uses native 2px title-to-command spacing
- **AND** each title uses native 13px medium sidebar-selected text styling
- **AND** each command uses native 12px monospaced sidebar-muted text styling
- **AND** existing seed option copy, command quick-start rows, guide copy, dividers, headings, and dismiss behavior are preserved

### Requirement: Post-Create Guide Dismiss Home Selection Parity
The Electron post-create guide SHALL explicitly start reading `wiki/home.md` when the user dismisses the guide and the file exists.

#### Scenario: User dismisses the post-create guide
- **WHEN** the user activates `Got it — start reading`
- **THEN** Electron hides the post-create guide
- **AND** Electron selects the `wiki/home.md` tree node when it is present
- **AND** Electron loads `wiki/home.md` through the existing renderer file-selection flow
- **AND** Electron does not add a navigation history entry for this automatic start-reading transition
- **AND** if `wiki/home.md` is unavailable, Electron still hides the guide without changing the current file

### Requirement: New Wiki Runtime Creation Evidence
The Electron scaffold/new-wiki phase SHALL retain runtime evidence for the complete create-new-wiki workflow.

#### Scenario: New wiki is created during runtime audit
- **WHEN** Electron creates a new wiki from the welcome screen in runtime audit
- **THEN** it creates the native scaffolded wiki under the selected parent directory
- **AND** it opens the created project
- **AND** it starts project services for the created wiki
- **AND** it displays the native post-create guide
- **AND** dismissing the guide starts reading `wiki/home.md`

### Requirement: New Wiki Failure Dismissal Parity
The Electron new-wiki flow SHALL mirror native SwiftUI scaffold failure behavior by dismissing the create dialog without opening a project or showing the post-create guide.

#### Scenario: Scaffold creation fails
- **WHEN** the user submits a valid new-wiki name and location
- **AND** scaffold creation fails
- **THEN** the Electron create dialog is dismissed
- **AND** no project result is applied
- **AND** the post-create guide is not shown
- **AND** the renderer does not keep a visible create-failure error panel in the shell

### Requirement: New Wiki Location Picker Title Parity
The Electron new-wiki location picker SHALL preserve native message-only dialog chrome.

#### Scenario: New wiki location picker is configured
- **WHEN** the Electron main process opens the new-wiki location picker
- **THEN** the dialog message matches the native SwiftUI `NSOpenPanel` message
- **AND** the dialog does not set an explicit title override
- **AND** directory-only selection, directory creation, and the default `~/wikis` path remain unchanged

### Requirement: New Wiki Location Unicode Middle Truncation Parity
The Electron create-new-wiki dialog SHALL middle-truncate selected location paths without splitting Unicode characters.

#### Scenario: Unicode long path is displayed
- **WHEN** the Electron create-new-wiki dialog displays a long selected location path containing retained supplementary-plane Unicode characters
- **THEN** the visible location text preserves whole characters on both sides of the middle ellipsis
- **AND** the visible text does not contain unpaired surrogate code units
- **AND** the full selected location remains available through the label title and accessibility metadata
- **AND** wiki creation continues to use the full selected location path

#### Scenario: Short Unicode path is displayed
- **WHEN** the selected location path fits within the display budget by character count
- **THEN** the visible location text remains unchanged
