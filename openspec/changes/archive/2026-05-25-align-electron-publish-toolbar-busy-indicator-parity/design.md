## Context

`Sources/Wikiwise/ContentView.swift` renders the publish toolbar label with a `Group` that conditionally shows `ProgressView().controlSize(.small).frame(width: 12, height: 12)` before `Text("PUBLISHING…")` when `isPublishing` is true. Electron currently calls `publishButton.textContent = publishBusy ? "PUBLISHING…" : "PUBLISH ↑"`, which removes any possibility of preserving a spinner element.

## Goals / Non-Goals

**Goals:**

- Mirror the native busy publish button structure with a 12px inline indicator before the busy label.
- Keep the normal `PUBLISH ↑` and busy `PUBLISHING…` labels unchanged.
- Preserve publish help text, disabled state, and toolbar button badge styling.

**Non-Goals:**

- Changing publish/unpublish IPC, dialog behavior, or result/error dialogs.
- Changing native SwiftUI source.
- Introducing a shared loading component outside this publish toolbar control.

## Decisions

- Replace direct `textContent` updates on the button with a stable label span and a scoped busy indicator span. This preserves semantic button text while keeping the spinner element available.
- Hide the busy indicator with the `hidden` attribute when idle. Renderer code toggles `hidden` from the same `publishBusy` state that already controls disabled state and busy label text.
- Style the indicator as a small CSS spinner with 12px width/height to match native `ProgressView().frame(width: 12, height: 12)`.
- Cover the change with source parity tests for the native `ProgressView`, Electron markup, renderer state toggling, and CSS size/animation.

## Risks / Trade-offs

- The CSS spinner is not a byte-identical macOS `ProgressView`. It is scoped to the Electron toolbar publish button and keeps the same size and placement contract as native.
