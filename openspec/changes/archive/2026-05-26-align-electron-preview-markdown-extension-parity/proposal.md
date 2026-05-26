## Why

Native preview navigation only maps a clicked HTML link back to a markdown source when the candidate source file has the exact lowercase `md` extension. Electron currently uses a case-insensitive markdown check in that preview lookup, so `Foo.MD` can be selected from preview navigation where native would fall through to generated output.

## What Changes

- Align Electron preview markdown source lookup with the native lowercase `.md` candidate rule.
- Preserve case-insensitive markdown handling for direct file selection, editing, and compilation paths.
- Add regression coverage that compares Swift `findMarkdownFile(slug:in:)` with Electron preview lookup behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-preview-navigation-map-graph`: Add preview markdown-source extension case parity for local link routing.

## Impact

- `apps/electron/src/main/main.js`: preview markdown lookup candidate filtering.
- `apps/electron/test/preview-navigation-map-graph.test.js`: regression coverage for preview lookup extension case parity.
- `openspec/specs/electron-preview-navigation-map-graph/spec.md`: parity requirement update after archive.
