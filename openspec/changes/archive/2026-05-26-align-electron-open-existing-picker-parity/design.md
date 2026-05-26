## Context

The SwiftUI app's `openFolder()` action uses `NSOpenPanel` with directories enabled, files enabled, `allowedContentTypes = [.folder, .plainText]`, single selection, and the message "Choose a markdown file or a folder". Electron already mirrors the folder-or-file lifecycle after a path is chosen, but its picker filter still advertises code and web asset extensions (`css`, `js`, `json`, `html`) plus `All Files`.

This is a visible native-parity mismatch in the project lifecycle surface, not a new architecture concern.

## Goals / Non-Goals

**Goals:**

- Make Electron's open-existing dialog advertise folder plus markdown/plain-text file choices.
- Preserve single-selection folder and file opening behavior.
- Add regression coverage that anchors the Electron picker contract to the native SwiftUI picker contract.
- Retain OpenSpec verification evidence for the migration roadmap.

**Non-Goals:**

- No change to path safety, selected-file loading, standalone-file state, or folder compilation behavior after the picker returns a path.
- No new dependency or custom file picker UI.
- No change to release signing, notarization, or DMG packaging.

## Decisions

- Use Electron's native `dialog.showOpenDialog` filters rather than a renderer-side picker. This keeps the app on the operating system picker path and preserves existing IPC flow.
- Narrow the file filter to markdown/plain-text-style extensions (`md`, `markdown`, `txt`, `text`). This is closer to the native panel's plain-text intent than the current code/web/all-files list while still keeping the visible "markdown file or folder" workflow explicit.
- Remove the `All Files` filter. Native SwiftUI constrains allowed content types, so Electron should not present a broad escape hatch during parity migration.
- Test the contract statically against the SwiftUI source and Electron main process source. Opening native file dialogs is not reliable in headless runtime audit, so this slice is best covered by source-level parity tests plus the existing package/build gates.

## Risks / Trade-offs

- Some plain-text files with uncommon extensions may not appear in the Electron picker. Mitigation: the native-facing workflow is markdown/text wiki content; broader UTType parity can be added later if user evidence shows a real document type is blocked.
- Electron filters differ from macOS UTType semantics. Mitigation: keep the requirement at the visible contract level and verify that broad non-native code/web/all-file filters are absent.
- Narrowing filters could surprise users who relied on opening arbitrary files. Mitigation: standalone-file editing remains available for markdown/text content, and this is aligned with the native app contract.

## Migration Plan

1. Add a failing project-lifecycle test for the picker contract.
2. Update Electron main-process dialog filters.
3. Run focused tests, full Electron/core tests, Swift build, OpenSpec validation, package validation, and runtime audit sanity.
4. Archive the OpenSpec change with retained verification.

Rollback is a single-file main-process dialog option revert plus the associated test/spec removal if this parity decision changes.
