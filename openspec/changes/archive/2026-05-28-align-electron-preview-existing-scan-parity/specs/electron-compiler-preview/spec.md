## ADDED Requirements

### Requirement: Selected Preview Existing Scan Parity

Electron selected Markdown preview compilation SHALL match native SwiftUI by using existing compiler scan state instead of scanning the whole wiki from the selected preview compile path.

#### Scenario: Folder open prepares scan state
- **WHEN** Electron opens a wiki folder with a compiler-backed project
- **THEN** it scans project metadata before compiling the selected home preview
- **AND** this mirrors native folder open calling `scanPages()` before `loadFile(_:)`

#### Scenario: Selected Markdown preview compiles without rescanning
- **WHEN** Electron compiles a selected Markdown file for preview after the project has been scanned
- **THEN** it compiles the selected page or ad-hoc fallback from existing compiler state
- **AND** it does not rescan the whole wiki from the selected preview compile request

#### Scenario: Watcher changes own rescanning
- **WHEN** watcher summaries report markdown, rebuild, or structure changes
- **THEN** Electron rescans compiler metadata before any watcher-driven selected preview refresh depends on that changed project state
- **AND** selected preview compilation itself remains free of whole-wiki scan side effects
