## Why

The native SwiftUI right sidebar only renders the `DIRECTIONS` and `LINKED` INFO sections when the selected markdown file actually contains those values. Electron currently keeps both sections visible and fills empty states with placeholder text, which makes a fresh wiki's `home.md` look different from the macOS app.

## What Changes

- Make Electron hide the INFO `DIRECTIONS` section when document frontmatter has no `directions:` value.
- Make Electron hide the INFO `LINKED` section when the selected markdown file has no wikilinks.
- Preserve native behavior for files that do have directions or wikilinks.
- Add source-level and runtime audit evidence for a scaffolded `home.md`, which has neither directions nor wikilinks.

## Capabilities

### New Capabilities
- `electron-info-tab-conditional-parity`: Tracks native conditional rendering for Electron right-sidebar INFO sections.

### Modified Capabilities
- `electron-right-sidebar-terminal`: Tighten INFO tab behavior to hide optional sections when native SwiftUI would omit them.
- `electron-runtime-parity-audit`: Require runtime evidence that empty optional INFO sections are hidden for scaffolded projects.
- `electron-native-parity-roadmap`: Record INFO conditional rendering as a visible right-sidebar parity gap closure phase.

## Impact

- Affected renderer markup and state: `apps/electron/src/renderer/index.html`, `apps/electron/src/renderer/renderer.js`.
- Affected runtime audit: `scripts/audit-electron-runtime.mjs`.
- Affected tests: Electron right-sidebar and runtime-audit source tests.
- No IPC, compiler, terminal, or native Swift source changes.
