## Why

Native `RightSidebar.wikilinkTargets(in:)` scans from `[[` to the next `]]`, so a target can contain a single `]` character and still appear in the INFO tab's linked section. The Electron shared core currently extracts wikilinks with a regex that forbids any `]` inside the target, so links such as `[[Alpha]Beta]]` are silently omitted from Electron's INFO tab.

## What Changes

- Align shared document-info wikilink extraction with native scanner behavior for targets containing single closing brackets.
- Preserve existing target order, de-duplication, empty-target filtering, raw whitespace preservation, directions parsing, word count, metadata rendering, and right-sidebar styling.
- Add regression coverage anchored to `Sources/Wikiwise/RightSidebar.swift` so future wikilink extraction changes are deliberate.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wikiwise-core-package`: Require native-compatible wikilink target extraction for single-bracket target text.
- `electron-right-sidebar-terminal`: Require the Electron INFO linked section to inherit native wikilink target extraction from shared document-info helpers.
- `electron-native-parity-roadmap`: Track INFO wikilink bracket target parity as a native right-sidebar behavior correction phase.

## Impact

- Affected code: `packages/wikiwise-core/src/index.js`
- Affected tests: `packages/wikiwise-core/test/document-info.test.js`, `apps/electron/test/right-sidebar-terminal.test.js`
- Affected specs: `openspec/specs/wikiwise-core-package`, `openspec/specs/electron-right-sidebar-terminal`, `openspec/specs/electron-native-parity-roadmap`
- No renderer style, terminal, IPC, release, dependency, or network changes.
