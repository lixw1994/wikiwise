# electron-new-wiki-scaffold Specification

## Purpose
TBD - created by archiving change migrate-electron-new-wiki-scaffold. Update Purpose after archive.
## Requirements
### Requirement: New Wiki Dialog

The Electron app SHALL provide a create-new-wiki flow from the welcome screen that captures a wiki name and target location.

#### Scenario: User opens create flow

- **WHEN** the user chooses Create a New Wiki from the welcome screen
- **THEN** Electron shows a dialog with a wiki name field
- **AND** it shows a target location initialized to the user's `wikis` folder
- **AND** it lets the user choose a different parent directory through the main process
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
- **THEN** the phase verification records that built-in terminal, publishing setup, persistence, and full native modal polish remain deferred

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
