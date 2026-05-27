## ADDED Requirements

### Requirement: Watch Output Prefix Parity

The core package SHALL filter watched output paths using the same output-directory prefix semantics as native `FileWatcher`.

#### Scenario: Output directory descendants change
- **WHEN** JavaScript summarizes a watched path below the compiler output directory
- **THEN** that event is ignored before watcher classification

#### Scenario: Output sibling-prefix paths change
- **WHEN** JavaScript summarizes a watched path whose absolute path starts with the compiler output directory path but is not a path-contained descendant
- **THEN** that event is ignored like native `path.hasPrefix(watcher.outputDir)`

#### Scenario: Non-output paths change
- **WHEN** JavaScript summarizes a watched path that does not start with the compiler output directory path
- **THEN** existing watcher classification remains available for markdown, CSS, structure, rebuild, support-file, and assets events
