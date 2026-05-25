## Overview

SwiftUI implements the right-sidebar resize affordance as a `Rectangle().fill(Color.clear)` overlay aligned to the sidebar leading edge. The Electron shell already matches the interaction model and 5px hit target, but its hover/focus state paints `--color-resize-hover`, creating a visible edge highlight that the native implementation does not have.

## Decisions

- Keep `.right-sidebar-resize-handle` positioned on the left edge with `width: 5px`, transparent base background, `cursor: col-resize`, and `touch-action: none`.
- Change the hover/focus visual state to remain transparent instead of using `--color-resize-hover`.
- Leave right-sidebar resize state management, width clamping, tab selection, terminal refit, and IPC behavior unchanged.

## Alternatives Considered

- Remove the hover/focus selector entirely. Keeping an explicit transparent hover/focus rule makes the parity intent easier to verify and prevents broad resize-handle hover styles from accidentally bleeding into the right sidebar later.

## Validation

- Add a targeted Node test that reads the native SwiftUI source and Electron CSS, then verifies the right resize handle mirrors the native transparent overlay and does not use `--color-resize-hover`.
- Run the existing Electron right-sidebar terminal test file as the red/green target.
- Run full repository verification and OpenSpec strict validation before commit.
