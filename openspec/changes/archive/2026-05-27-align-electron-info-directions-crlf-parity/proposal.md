## Why

Native `RightSidebar.parseDirections(from:)` splits markdown text only on `"\n"` and compares frontmatter markers to the exact string `"---"`. Files with CRLF frontmatter therefore keep `"\r"` on marker lines and do not show a `DIRECTIONS` callout in the native INFO tab. The Electron shared core currently splits with `/\r?\n/`, accepts the same CRLF frontmatter, and can display directions that the native app hides.

## What Changes

- Align shared document-info directions extraction with native exact newline and marker behavior for CRLF frontmatter.
- Preserve existing LF frontmatter directions, empty-value handling, wikilink extraction, word count, metadata rendering, terminal behavior, and right-sidebar styling.
- Add regression coverage anchored to `Sources/Wikiwise/RightSidebar.swift` so future newline handling changes are deliberate.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wikiwise-core-package`: Require native-compatible directions extraction for exact LF frontmatter markers while ignoring CRLF marker lines like the native parser.
- `electron-right-sidebar-terminal`: Require the Electron INFO tab to inherit native CRLF directions visibility behavior from shared document-info helpers.
- `electron-native-parity-roadmap`: Track INFO directions CRLF parity as a native right-sidebar behavior correction phase.

## Impact

- Affected code: `packages/wikiwise-core/src/index.js`
- Affected tests: `packages/wikiwise-core/test/document-info.test.js`, `apps/electron/test/right-sidebar-terminal.test.js`
- Affected specs: `openspec/specs/wikiwise-core-package`, `openspec/specs/electron-right-sidebar-terminal`, `openspec/specs/electron-native-parity-roadmap`
- No renderer style, terminal, IPC, release, dependency, or network changes.
