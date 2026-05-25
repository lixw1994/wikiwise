## ADDED Requirements

### Requirement: Right Sidebar Tab Switch Style Parity
The Electron right sidebar SHALL render the INFO/TERMINAL tabs with native compact pill-style switcher styling.

#### Scenario: Right sidebar tab switch uses native pill styling
- **WHEN** a project right sidebar is rendered
- **THEN** the INFO/TERMINAL switcher is left-aligned within the sidebar header area
- **AND** the switcher uses native 2px inner padding, tab-bar background fill, 5px container radius, 10px regular monospaced text, 0.8px tracking, 3px by 14px tab padding, inactive text color, active text color, active tab background, 4px active tab radius, and subtle active shadow
- **AND** right tab IDs, selected state, default Terminal tab, panel switching behavior, and right sidebar resizing behavior are not changed for this requirement
