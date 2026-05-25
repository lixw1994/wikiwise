## Why

The native macOS publish sheet constrains the editable subdomain field to a maximum width of 200 points and uses a spacer before the 16x16 availability indicator. The Electron publish URL row currently lets the subdomain field expand across the row and places the indicator immediately after the domain suffix, leaving a visible layout parity gap.

## What Changes

- Constrain the Electron publish subdomain field to the native max-width behavior.
- Add a flexible spacer column before the availability indicator so the indicator sits at the row's trailing edge.
- Preserve the existing inline `https://`, `.wiki-wise.com`, availability indicator, and hint copy behavior.
- Add regression coverage comparing the native SwiftUI row structure with the Electron CSS layout.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: require the publish URL row layout to match the native max-width subdomain field and trailing availability indicator.

## Impact

- `apps/electron/src/renderer/styles.css`
- `apps/electron/test/publishing.test.js`
- `openspec/specs/electron-publishing/spec.md`
