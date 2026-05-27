## ADDED Requirements

### Requirement: Watcher Output Prefix Parity

Electron live rebuild watching SHALL preserve native `FileWatcher` output-directory prefix filtering semantics.

#### Scenario: Output prefix paths change
- **WHEN** the Electron project watcher receives a changed path whose absolute path starts with the compiler output directory path
- **THEN** the watcher summary ignores the event before scheduling renderer refresh or compiler work

#### Scenario: Non-output paths change
- **WHEN** the Electron project watcher receives changed paths outside the native output-prefix filter
- **THEN** existing live rebuild classification and IPC delivery behavior is retained
