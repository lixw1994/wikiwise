## Why

The native SwiftUI app defaults markdown detail views to the compiled WIKI preview. The Electron runtime audit currently clicks into FILE mode before collecting project evidence, so it can miss regressions where the opened-project first view is not the native compiled preview.

## What Changes

- Add runtime audit evidence for the initial markdown detail mode before switching to FILE editor mode.
- Assert that the WIKI segmented control is selected, the compiled preview frame is visible, and the source editor is hidden on the initial markdown view.
- Keep the existing editor-mode audit by switching to FILE after default-preview evidence is captured.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-runtime-parity-audit`: Project scenarios must prove the native default WIKI preview state before exercising FILE editor behavior.

## Impact

- Affects `scripts/audit-electron-runtime.mjs`.
- Updates runtime audit source tests and OpenSpec runtime audit requirements.
- No renderer, preload, IPC, or packaging behavior changes are required.
