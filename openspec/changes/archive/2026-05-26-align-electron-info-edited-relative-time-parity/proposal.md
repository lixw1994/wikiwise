## Why

Native SwiftUI formats the INFO `EDITED` row with `RelativeDateTimeFormatter` in full units for all ages, so older files still show relative values such as weeks, months, or years ago. Electron currently switches to an absolute date after one week and uses named relative output for short intervals, leaving selected-document metadata visibly different.

## What Changes

- Format Electron INFO edited timestamps as native-style numeric relative time across seconds, minutes, hours, days, weeks, months, and years.
- Remove the absolute `Intl.DateTimeFormat` fallback from the INFO edited row.
- Preserve document-info IPC, PATH, WORDS, directions, wikilinks, tab switching, and terminal behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-right-sidebar-terminal`: Adds native relative edited-time formatting parity for the INFO metadata section.
- `electron-native-parity-roadmap`: Records INFO edited-time format parity as a right-sidebar metadata closure phase.

## Impact

- Affects Electron renderer INFO metadata rendering.
- Adds renderer/source parity coverage in `apps/electron/test/right-sidebar-terminal.test.js`.
- Updates and archives the `electron-right-sidebar-terminal` and `electron-native-parity-roadmap` OpenSpec contracts.
