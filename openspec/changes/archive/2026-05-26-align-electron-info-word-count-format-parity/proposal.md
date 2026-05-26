## Why

The native INFO sidebar formats the WORDS value with `NumberFormatter` using decimal grouping, while Electron currently renders the raw numeric value. Large documents therefore show visibly different metadata, such as `1234` in Electron instead of the native grouped `1,234`.

## What Changes

- Format Electron INFO word counts with locale-aware decimal grouping before rendering.
- Keep the document-info IPC payload numeric so core metadata behavior remains unchanged.
- Preserve PATH, EDITED, directions, wikilinks, tab switching, and terminal behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-right-sidebar-terminal`: Adds native decimal word-count formatting parity for the INFO metadata section.
- `electron-native-parity-roadmap`: Records INFO word-count format parity as a right-sidebar metadata closure phase.

## Impact

- Affects Electron renderer INFO metadata rendering.
- Adds renderer/source parity coverage in `apps/electron/test/right-sidebar-terminal.test.js`.
- Updates and archives the `electron-right-sidebar-terminal` and `electron-native-parity-roadmap` OpenSpec contracts.
