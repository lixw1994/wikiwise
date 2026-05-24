## Context

`ContentView.swift` initializes `detailMode` to `.compiled`, so an opened markdown page starts in WIKI preview mode when compiled output exists. Electron already has renderer logic that selects WIKI for compiled markdown, but the runtime audit immediately switches to FILE mode to inspect CodeMirror, leaving the default-view contract weakly verified.

## Goals / Non-Goals

**Goals:**

- Capture initial WIKI preview DOM state after selecting `home.md` and before clicking FILE.
- Fail project runtime audit scenarios if the WIKI control is not selected, the preview frame is hidden, or the source editor is visible at that point.
- Preserve the existing FILE-mode editor audit and screenshot flow.

**Non-Goals:**

- Change Electron renderer detail-mode behavior.
- Add new user-facing controls or change compiled preview content.
- Replace the editor-mode audit.

## Decisions

- Use a dedicated `captureDefaultWikiPreviewEvidence()` helper so the audit report records both default preview evidence and later editor evidence.
- Keep the helper in the audit script rather than the renderer because this is verification instrumentation, not app behavior.
- Source-test the audit markers first, then run the real runtime audit after implementation to prove the evidence path works in Electron.

## Risks / Trade-offs

- Capturing evidence before the iframe finishes loading could be flaky -> mitigated by waiting for the WIKI selected/preview-visible/editor-hidden condition before recording.
- The final screenshot still captures FILE mode after the switch -> accepted because the report records default WIKI evidence separately while preserving existing editor screenshot coverage.
