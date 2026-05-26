## Why

The native right sidebar displays wikilink targets exactly as they appear between `[[` and `]]`. Electron currently trims document-info wikilink targets before dedupe and display, so the INFO `LINKED` section can diverge from native macOS for links with surrounding whitespace.

## What Changes

- Align core document-info wikilink extraction with native `RightSidebar.wikilinkTargets` raw target behavior.
- Preserve exact target strings, including surrounding spaces, and dedupe only exact duplicate target strings.
- Add focused regression tests for raw target preservation and exact duplicate handling.
- Preserve compiler wikilink behavior, INFO row rendering, directions parsing, word count, edited time, and terminal behavior.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `wikiwise-core-package`: Document-info wikilink extraction must preserve raw native target strings and exact duplicate semantics.
- `electron-right-sidebar-terminal`: INFO linked target rows must display native-compatible raw targets from document metadata.
- `electron-native-parity-roadmap`: Record this right-sidebar metadata parser parity slice when archived.

## Impact

- Affects `packages/wikiwise-core/src/index.js` document-info wikilink extraction.
- Adds core package tests for native-compatible raw wikilink target handling.
- Updates OpenSpec requirements and retained roadmap evidence for the Electron migration.
