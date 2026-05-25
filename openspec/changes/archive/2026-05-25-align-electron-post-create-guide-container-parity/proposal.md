## Why

The native post-create guide uses a content-background full surface with a 40px inset and a 560px leading-aligned content column. Electron currently renders the guide with different asymmetric padding, the detail background token, and no equivalent 560px content width, leaving the first-run creation handoff visibly different from the macOS app.

## What Changes

- Align the Electron post-create guide surface background with native `Color.contentBg`.
- Align the guide content inset to the native 40px padding.
- Add a scoped 560px maximum width for direct guide content, preserving the existing guide copy and controls.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds post-create guide container layout parity for the create-new-wiki completion flow.

## Impact

- Affects `apps/electron/src/renderer/styles.css` for post-create guide layout styling.
- Adds renderer parity coverage in `apps/electron/test/new-wiki-scaffold.test.js`.
- Updates and archives the `electron-new-wiki-scaffold` OpenSpec contract.
