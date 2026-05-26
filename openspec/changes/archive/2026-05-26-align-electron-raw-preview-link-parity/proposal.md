## Why

Electron preview navigation currently resolves generated raw-page links back to the raw markdown source, while the native Swift app treats those links as compiled HTML output. This creates a visible navigation-state mismatch for raw source references in compiled wiki pages.

## What Changes

- Align Electron preview-link resolution with the native Swift resolver for raw generated pages.
- Keep raw markdown compilation behavior unchanged: raw files still compile with the `raw-` slug namespace.
- Ensure `raw-*.html` preview links display generated output instead of selecting `raw/*.md`.
- Add regression coverage that compares Swift resolver semantics with Electron main-process resolution.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-preview-navigation-map-graph`: Add raw generated-page preview-link routing parity for links such as `raw-source.html`.

## Impact

- `apps/electron/src/main/main.js`: preview navigation markdown lookup.
- `apps/electron/test/preview-navigation-map-graph.test.js`: regression coverage for raw generated-link resolution.
- `openspec/specs/electron-preview-navigation-map-graph/spec.md`: parity requirement update after archive.
