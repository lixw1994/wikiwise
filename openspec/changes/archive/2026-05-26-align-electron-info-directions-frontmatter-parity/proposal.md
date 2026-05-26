## Why

The native INFO tab only displays `directions:` when `RightSidebar.parseDirections` finds it inside exact frontmatter syntax. Electron currently trims the opening marker and frontmatter lines, so it can show directions for markdown the native app ignores.

## What Changes

- Align the core document-info directions parser with the native SwiftUI parser's exact frontmatter handling.
- Add focused tests for loose opening markers and indented `directions:` lines that Electron must ignore.
- Preserve existing INFO tab rendering, callout styling, word count, edited time, and wikilink behavior.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `wikiwise-core-package`: Document-info directions extraction must match native exact frontmatter parsing.
- `electron-right-sidebar-terminal`: INFO directions visibility must rely on native-compatible exact frontmatter extraction.
- `electron-native-parity-roadmap`: Record this right-sidebar metadata parser parity slice when archived.

## Impact

- Affects `packages/wikiwise-core/src/index.js` document-info parsing.
- Adds core package tests for native-compatible directions edge cases.
- Updates OpenSpec requirements and verification records for the Electron migration roadmap.
