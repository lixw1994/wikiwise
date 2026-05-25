## Why

The native SwiftUI new-wiki sheet spaces the `Location` label and its path/action row with a 6pt vertical gap. Electron currently uses a 4px top margin on the path text, leaving the location group slightly tighter than the native sheet.

## What Changes

- Align the Electron create-new-wiki location label-to-path spacing with the native 6px sheet spacing.
- Preserve middle truncation, system path font, muted color, full-path metadata, chooser behavior, and wiki creation behavior.
- Keep unrelated new-wiki and publish dialog spacing unchanged.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `electron-new-wiki-scaffold`: Add native location label spacing parity for the create-new-wiki sheet.

## Impact

- Affects Electron renderer styles and new-wiki regression tests.
- Does not change Swift native behavior, scaffold creation, IPC, signing, packaging, or release workflow.
