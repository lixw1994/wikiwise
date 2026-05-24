## Why

The native macOS app presents the project browser as an expandable, lazy-loaded file tree, while the Electron app currently renders only one level and disables folders. This leaves nested wiki pages, source files, and agent-facing project structure harder to inspect or open in the Electron migration.

## What Changes

- Add Electron file tree expansion parity for native folder disclosure behavior.
- Keep project scanning lazy: top-level folders are returned first, and nested folders are expanded on demand.
- Auto-expand native default top-level folders on project open, excluding `site/`.
- Preserve native file ordering, filtering, selected-row styling, and folder labels for nested levels.
- Ensure selecting nested files uses the existing editor, preview, document-info, active-file, and history paths.
- Update runtime audit evidence so project scenarios prove nested tree expansion and nested file selection.

## Capabilities

### New Capabilities
- `electron-file-tree-expansion-parity`: Covers expandable Electron project tree behavior, default folder expansion, nested file selection, and native file-browser presentation parity.

### Modified Capabilities
- `electron-native-parity-roadmap`: Records the file-tree expansion phase and remaining final migration gates.

## Impact

- `packages/wikiwise-core/src/index.js`: May need a reusable project-tree expansion helper that preserves native filtering and ordering.
- `apps/electron/src/main/main.js`: Adds path-safe directory expansion IPC rooted in the current project.
- `apps/electron/src/preload/preload.cjs`: Exposes the narrow expansion API.
- `apps/electron/src/renderer/index.html`, `renderer.js`, and `styles.css`: Render nested folder disclosure, default expansion, and nested file selection.
- `scripts/audit-electron-runtime.mjs`: Captures runtime evidence for expanded folders and nested file selection.
- Electron tests and OpenSpec specs cover the new parity behavior.
