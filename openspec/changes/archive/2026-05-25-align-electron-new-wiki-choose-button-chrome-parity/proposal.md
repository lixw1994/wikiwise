## Why

The Electron create-new-wiki sheet still renders the location `Choose…` control with the shared branded secondary modal style, while the native SwiftUI sheet uses a default sheet button. Aligning this control completes another visible part of the new-wiki sheet parity work.

## What Changes

- Scope the Electron new-wiki location `Choose…` button to native sheet button styling instead of shared `secondary-action compact` styling.
- Preserve the existing button ID, label, and main-process location chooser behavior.
- Keep shared secondary action styling available for welcome, publish, unpublish, feedback, and other non-new-wiki surfaces.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `electron-new-wiki-scaffold`: Add native chrome parity for the create-new-wiki location chooser button.

## Impact

- Affects Electron renderer markup/styles and regression tests for the create-new-wiki dialog.
- Does not change Swift native behavior, location chooser IPC, scaffold creation, signing, packaging, or release workflow.
