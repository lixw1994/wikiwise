## MODIFIED Requirements

### Requirement: Tree Refresh Preserves Expansion
The Electron app SHALL match native project tree refresh depth by preserving only compatible top-level expanded folders across project tree refreshes.

#### Scenario: Project watcher reports a structure change
- **WHEN** the project watcher reports added or removed files
- **THEN** the Electron app rescans the top-level project tree
- **AND** re-expands top-level folders that still exist and were expanded before the refresh
- **AND** drops nested folder expansion state for that refresh path
- **AND** removes expansion state for top-level folders that no longer exist
