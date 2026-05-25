## Why

The native SwiftUI new-wiki sheet renders the selected location path with the system 12pt text font, while Electron still forces a monospace stack. This makes the Electron sheet feel less native even after the surrounding layout and controls were aligned.

## What Changes

- Update Electron's create-new-wiki location path styling to use the sheet's system text font at the native 12px size.
- Preserve middle truncation, muted color, full path metadata, and wiki creation behavior.
- Keep unrelated form and publish dialog styling unchanged.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `electron-new-wiki-scaffold`: Add native system-font parity for the create-new-wiki location path.

## Impact

- Affects Electron renderer styles and new-wiki regression tests.
- Does not change Swift native behavior, scaffold creation, IPC, signing, packaging, or release workflow.
