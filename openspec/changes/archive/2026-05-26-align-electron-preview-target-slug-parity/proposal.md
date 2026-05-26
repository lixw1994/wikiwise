## Why

Native preview navigation normalizes the clicked HTML target filename with the same slug helper used for markdown files, including replacing spaces with hyphens. Electron currently lowercases the target filename without replacing spaces, so local preview links such as `My Page.html` can fail to select the matching `My Page.md` file even though native resolves them.

## What Changes

- Align Electron preview target slug derivation with native Swift filename slug behavior.
- Preserve existing markdown lookup order and generated-page fallback semantics.
- Add regression coverage that compares Swift `handleWikilink(_:)` slug derivation with Electron `resolvePreviewNavigation`.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-preview-navigation-map-graph`: Add local preview link target slug normalization parity for filenames containing spaces.

## Impact

- `apps/electron/src/main/main.js`: preview navigation target slug derivation.
- `apps/electron/test/preview-navigation-map-graph.test.js`: regression coverage for target filename slug normalization.
- `openspec/specs/electron-preview-navigation-map-graph/spec.md`: parity requirement update after archive.
