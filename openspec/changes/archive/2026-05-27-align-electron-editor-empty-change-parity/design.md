## Context

Native `EditorWebView` handles `contentChanged` messages with:

```swift
guard let content = message.body as? String,
      !content.isEmpty,
      let fileURL = currentFileURL else { return }
```

That guard sits at the bridge boundary before disk writes and before updating SwiftUI state. Electron uses the same shared editor resource through a parent-window bridge, but its renderer currently converts every payload to a string and treats `""` as a real edit.

## Goals / Non-Goals

**Goals:**

- Match the native empty-content guard for Electron editor bridge payloads.
- Keep non-empty editor changes, dirty-state updates, debounce autosave, explicit save, and markdown preview refresh unchanged.
- Add RED/GREEN regression coverage that ties the Electron renderer behavior to the native Swift guard.

**Non-Goals:**

- Changing the shared `editor.html` resource or CodeMirror bundle.
- Adding a new way to intentionally save a fully empty source file. The native bridge currently rejects empty content, so Electron should preserve that parity boundary.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Guard inside `handleEditorContentChanged()` rather than `saveSelectedFile()`. This mirrors native placement at the WebKit message boundary and prevents empty payloads from mutating dirty state or scheduling autosave.
- Normalize the payload once with `String(content ?? "")`, then return when the normalized value is empty. This preserves existing handling for non-empty values while aligning nullish payload behavior with the native guard.
- Use a source-level renderer test anchored to `Sources/Wikiwise/EditorWebView.swift`. The behavior is a small bridge parity contract, and the existing test suite already validates the renderer/editor integration through source assertions.

## Risks / Trade-offs

- Users cannot use this editor bridge path to save a deliberately empty file. This matches the current native behavior and keeps this phase scoped to parity rather than product redesign.
- If CodeMirror emits an empty payload after a legitimate user deletion, Electron will ignore it. That is the same behavior native ships today.
