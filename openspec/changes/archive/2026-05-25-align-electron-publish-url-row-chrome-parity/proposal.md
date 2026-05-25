## Why

The native macOS publish URL row is a padded sidebar-colored rounded rectangle with a 4-point corner radius and no stroked border. The Electron publish URL row still has an extra 1px border and a larger 6px radius, leaving a visible chrome mismatch.

## What Changes

- Remove the Electron publish URL row's extra border.
- Align the row corner radius to the native 4px rounded rectangle.
- Preserve the existing row layout, typography, background color, and availability indicator behavior.
- Add regression coverage that compares the native row background chrome with Electron CSS.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: require the publish URL row chrome to match the native rounded, fill-only container.

## Impact

- `apps/electron/src/renderer/styles.css`
- `apps/electron/test/publishing.test.js`
- `openspec/specs/electron-publishing/spec.md`
