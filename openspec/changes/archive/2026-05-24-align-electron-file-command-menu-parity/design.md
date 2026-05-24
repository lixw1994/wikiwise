## Context

SwiftUI defines Wikiwise's extra Go Back, Go Forward, and Refresh Page commands inside `CommandGroup(after: .newItem)`, so they appear in the File command area on macOS. Electron currently builds a separate top-level Navigate menu for those commands in `apps/electron/src/main/main.js`, creating a visible menu bar difference from the native app.

## Goals / Non-Goals

**Goals:**

- Match the native File command placement for Go Back, Go Forward, and Refresh Page.
- Keep the existing accelerators and `sendAppCommand` dispatch path unchanged.
- Remove the extra Navigate top-level menu from the Electron menu template.

**Non-Goals:**

- Change renderer navigation behavior or history state.
- Add new IPC channels, settings, or menu commands.
- Change packaging, signing, or release workflow.

## Decisions

- Update only `createApplicationMenu()` so the behavioral surface remains narrow and reversible.
- Test the source-level menu template against the SwiftUI command placement because runtime menu introspection is not needed for this placement-only change.
- Preserve `CommandOrControl+[` / `CommandOrControl+]` / `CommandOrControl+R` to keep cross-platform shortcuts intact while matching the native command names.

## Risks / Trade-offs

- File menu becomes denser on non-macOS platforms too -> mitigated by matching the app's native reference surface and keeping command labels recognizable.
- Regex-based tests can become brittle -> mitigated by testing the surrounding File submenu structure and absence of the Navigate menu rather than exact full-file formatting.
