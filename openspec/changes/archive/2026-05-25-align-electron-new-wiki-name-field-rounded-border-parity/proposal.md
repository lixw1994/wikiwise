## Why

The Electron create-new-wiki sheet still renders the name input with the shared `.text-input` form chrome, while the native SwiftUI sheet uses a rounded-border `TextField`. Scoping the name field brings the sheet closer to the macOS native control density and visual treatment.

## What Changes

- Add scoped Electron renderer styling for the create-new-wiki name field to mirror the native rounded-border text field treatment.
- Preserve the existing field ID, placeholder, input behavior, Create enablement behavior, and shared `.text-input` base class.
- Keep shared `.text-input` styling available for publish and other non-new-wiki form fields.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `electron-new-wiki-scaffold`: Add native rounded-border text field parity for the create-new-wiki name field.

## Impact

- Affects Electron renderer markup/styles and regression tests for the create-new-wiki dialog.
- Does not change Swift native behavior, scaffold creation, IPC, signing, packaging, or release workflow.
