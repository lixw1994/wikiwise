## ADDED Requirements

### Requirement: Watch Structure Priority Payload Parity

The core package SHALL omit markdown path payloads from structure-priority watch summaries, matching native `FileWatcher` structure callbacks.

#### Scenario: Markdown and structure events coalesce
- **WHEN** JavaScript summarizes a debounce batch containing both markdown content paths and structure-triggering paths
- **THEN** the result is a structure summary
- **AND** the structure summary contains no changed markdown paths

#### Scenario: Markdown content events without structure
- **WHEN** JavaScript summarizes markdown content paths without rebuild or structure events
- **THEN** the result retains changed markdown paths for content refresh behavior
