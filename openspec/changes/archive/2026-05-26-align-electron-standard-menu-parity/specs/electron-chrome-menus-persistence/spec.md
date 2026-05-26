## ADDED Requirements

### Requirement: Standard macOS Menu Role Parity
The Electron app SHALL preserve standard macOS menu role coverage while adding Wikiwise-specific File commands.

#### Scenario: App menu includes standard macOS roles
- **WHEN** the Electron application menu is created on macOS
- **THEN** the app menu includes About, Services, Hide, Hide Others, Show All, and Quit roles
- **AND** those roles are grouped with standard macOS separators

#### Scenario: Edit menu includes standard editing roles
- **WHEN** the Electron application menu is created
- **THEN** the menu bar includes an Edit menu
- **AND** the Edit menu includes Undo, Redo, Cut, Copy, Paste, Paste and Match Style, Delete, and Select All roles

#### Scenario: Window menu includes standard window roles
- **WHEN** the Electron application menu is created
- **THEN** the menu bar includes a Window menu
- **AND** the Window menu includes Minimize, Zoom, and Bring All to Front roles
- **AND** existing Wikiwise File commands and View fullscreen behavior are preserved
