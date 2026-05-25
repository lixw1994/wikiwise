## Why

The native macOS publish sheet shows a small `ProgressView` while checking subdomain availability. The Electron renderer currently shows a visible ellipsis character in the same 16x16 indicator slot, which is a small but noticeable visual parity gap.

## What Changes

- Render the Electron `checking` availability state as a small in-progress spinner instead of text punctuation.
- Preserve the existing 16x16 indicator slot and existing success, failure, warning, and empty states.
- Add regression coverage that compares the native `ProgressView` behavior to Electron's non-text progress indicator.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: require the checking availability indicator to be an in-progress visual indicator rather than visible status text or punctuation.

## Impact

- `apps/electron/src/renderer/renderer.js`
- `apps/electron/src/renderer/styles.css`
- `apps/electron/test/publishing.test.js`
- `openspec/specs/electron-publishing/spec.md`
