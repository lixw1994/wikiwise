## ADDED Requirements

### Requirement: Background Preview Warmup
Opening or creating a wiki folder SHALL warm up compiled previews beyond the selected home page using background batches.

#### Scenario: Project preview warmup starts
- **WHEN** Electron opens a wiki folder and compiler resources are available
- **THEN** the compiler scans project pages
- **AND** selected page preview remains available immediately
- **AND** unselected markdown pages are queued for background compilation

#### Scenario: On-demand preview remains deterministic
- **WHEN** a user selects or saves a markdown file before background compilation reaches it
- **THEN** Electron still compiles and returns that selected page on demand
- **AND** background compilation does not block the selected preview
