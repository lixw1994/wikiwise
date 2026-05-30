# electron-file-tree-visual-parity Specification

## Purpose
Define Electron project-browser visual parity for native folder icons, special raw/site folder markers, and selected-file accent evidence.
## Requirements
### Requirement: Native Folder Icon Visuals
The Electron file tree SHALL render native-like folder icons for directory rows.

#### Scenario: Directory rows are displayed
- **WHEN** a project tree contains directory rows
- **THEN** each directory row displays a folder icon before the folder name
- **AND** the icon uses fixed dimensions aligned with the disclosure marker and label
- **AND** the folder label keeps native serif typography and ellipsis behavior

#### Scenario: Special folders are displayed
- **WHEN** the project tree contains `raw` or `site` folders
- **THEN** those directory rows use the special folder icon treatment
- **AND** the special icon includes a center dot marker

### Requirement: Native Selected File Accent
The Electron file tree SHALL render the native selected-file visual accent.

#### Scenario: File row is selected
- **WHEN** a file row is selected in the Electron tree
- **THEN** the row keeps the selected background and italic file label
- **AND** the row displays a 2px leading accent bar aligned to the row indentation
- **AND** the selected visual does not change file loading or navigation behavior

### Requirement: Runtime Audit Evidence
The Electron runtime audit SHALL verify file-tree visual markers.

#### Scenario: Runtime audit captures file tree visuals
- **WHEN** runtime audit captures an opened-project scenario
- **THEN** it records whether folder icons are present
- **AND** it records whether a special folder marker is present
- **AND** it records whether the selected file row has accent evidence
- **AND** it fails if any required marker is missing

### Requirement: Native Sidebar Header

The Electron project sidebar SHALL match the Electron macOS sidebar header structure and styling.

#### Scenario: Project sidebar header is displayed

- **WHEN** a project is open and the left sidebar is visible
- **THEN** the sidebar displays a literal `FILES` header before the file tree
- **AND** the header uses regular monospaced typography with 9px font size and 1.6px letter spacing
- **AND** the header uses 18px horizontal padding, 6px top padding, and 10px bottom padding
- **AND** the sidebar content does not add extra top padding outside the header
- **AND** the file tree follows the header without an additional top margin
- **AND** the sidebar does not display a project-name heading
- **AND** the toolbar remains the project-name display location

### Requirement: Native Folder Tooltip Copy
The Electron file tree SHALL expose native folder help text for directory row tooltips.

#### Scenario: Special top-level folders are displayed
- **WHEN** the Electron project tree renders `wiki`, `sources`, `raw`, or `site` folder rows
- **THEN** their row tooltips match the Electron macOS `folderTooltip(_:)` strings
- **AND** `wiki`, `sources`, and `raw` tooltip copy uses the native em dash punctuation
- **AND** the `site` tooltip remains `Build tooling and compiled HTML output`

### Requirement: File Tree Row Spacing Parity
The Electron file tree SHALL match the Electron macOS zero-spacing layout between both root rows and expanded child rows.

#### Scenario: File tree row spacing is inspected
- **WHEN** the Electron project browser renders root file-tree rows
- **THEN** the root file-tree container has no inter-row grid gap beyond each row's native padding
- **AND** expanded child-row containers also have no inter-row grid gap
- **AND** row padding, indentation, disclosure icons, folder icons, selected-file accent, expansion behavior, and file navigation are unchanged

### Requirement: Special File Row Weight Parity

Electron file-tree rows for native special files SHALL render with the same medium typography weight as Electron macOS.

#### Scenario: Special file rows are rendered
- **WHEN** Electron renders file-tree rows for `home.md`, `index.md`, or `log.md`
- **THEN** those rows use a medium font weight matching Electron macOS `.medium`
- **AND** regular file rows remain regular weight
- **AND** file-tree indentation, selected accent, serif typography, and special filename membership remain unchanged

### Requirement: File Tree Row Typography Parity

Electron file-tree folder and file row labels SHALL render with the same native 13px regular serif typography as Electron macOS, while preserving native medium weight for special file rows.

#### Scenario: File-tree rows are rendered
- **WHEN** Electron renders folder rows in the project file tree
- **THEN** their labels use 13px regular serif typography matching Electron macOS
- **AND** regular file labels use 13px regular serif typography matching Electron macOS
- **AND** `home.md`, `index.md`, and `log.md` continue to use the native medium special-file weight
- **AND** file-tree indentation, row padding, selected-row italic styling, selected accent, folder icons, and expansion behavior remain unchanged

### Requirement: Selected File Accent Height Parity

Electron selected file-tree rows SHALL render the leading accent as a full-height row overlay matching Electron macOS.

#### Scenario: File row is selected
- **WHEN** Electron renders the selected file row in the project tree
- **THEN** the leading accent spans the full selected row background height
- **AND** the accent remains 2px wide
- **AND** the accent keeps the native leading offset aligned to `indent + 4`
- **AND** selected row background, italic label styling, row padding, typography, folder icons, and expansion behavior remain unchanged

### Requirement: Folder Icon Aspect Parity

Electron file-tree folder icons SHALL use the same native 13px-scaled 14-by-12 SVG aspect and special-folder marker geometry as Electron macOS `FolderIcon(size: 13)`.

#### Scenario: Folder rows are rendered
- **WHEN** Electron renders a directory row in the project file tree
- **THEN** the folder icon remains 13px wide
- **AND** the folder icon height matches native `13 * 12 / 14`
- **AND** special `raw` and `site` folder marker dots match the native scaled dot diameter
- **AND** special marker dots use the native scaled center point
- **AND** folder icon colors, folder row typography, disclosure marker, indentation, and expansion behavior remain unchanged

### Requirement: Folder Icon Stroke Weight Parity

Electron file-tree folder icons SHALL use the same native scaled stroke width as Electron macOS `FolderIcon(size: 13)`.

#### Scenario: Folder rows are rendered
- **WHEN** Electron renders a directory row in the project file tree
- **THEN** the folder icon body stroke width matches native `0.8 * 13 / 14`
- **AND** the folder icon tab stroke width matches native `0.8 * 13 / 14`
- **AND** special `raw` and `site` folder icons keep their special stroke color with the same stroke width
- **AND** folder icon aspect, special marker geometry, folder row typography, disclosure marker, indentation, and expansion behavior remain unchanged

### Requirement: Folder Row Trailing Padding Parity

Electron file-tree folder rows SHALL match the Electron macOS folder-row trailing padding behavior.

#### Scenario: Folder and file rows are rendered
- **WHEN** Electron renders folder and file rows in the project file tree
- **THEN** folder rows omit the native file-row-only 8px trailing inset
- **AND** file rows keep the native 8px trailing inset
- **AND** row leading indentation, vertical padding, typography, selected-file accent alignment, folder icons, and expansion behavior remain unchanged

### Requirement: Folder Icon Path Parity

Electron file-tree folder icons SHALL render the same Paper 14-by-12 folder path as Electron macOS `FolderIcon`.

#### Scenario: Folder rows are rendered
- **WHEN** Electron renders directory rows in the project file tree
- **THEN** each folder icon uses an SVG path matching the native Canvas move, curve, line, and close commands
- **AND** the path keeps native scaled dimensions, fill color, stroke color, and stroke width
- **AND** special `raw` and `site` folder icons render the native center dot inside the same SVG coordinate system
- **AND** folder row layout, typography, indentation, disclosure marker, selected-file styling, tooltips, and expansion behavior remain unchanged
