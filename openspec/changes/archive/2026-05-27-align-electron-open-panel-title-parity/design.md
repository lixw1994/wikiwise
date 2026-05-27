## Context

The SwiftUI app uses `NSOpenPanel` in two user-facing picker flows:

- Open Existing sets directory/file constraints, plain-text content types, single selection, and `panel.message = "Choose a markdown file or a folder"`.
- New Wiki Location sets directory-only selection, directory creation, and `panel.message = "Choose where to create your wiki"`.

Neither native picker sets an explicit title. Electron's equivalent `dialog.showOpenDialog` calls currently set both `title` and `message` with the same copy, creating extra non-native dialog chrome.

## Goals / Non-Goals

**Goals:**

- Match native picker chrome by removing explicit Electron dialog titles for Open Existing and new-wiki location selection.
- Preserve existing picker constraints, default paths, renderer IPC flows, and scaffold behavior.
- Add tests that anchor the behavior to the Swift source rather than only to Electron implementation preferences.

**Non-Goals:**

- Changing allowed file types, selection behavior, or default wiki location.
- Changing the in-app new-wiki modal layout or welcome screen actions.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Use source-level regression tests for both picker functions. These tests can prove that the Swift source does not set `panel.title`, while Electron preserves the matching `message` and omits `title`.
- Keep `message` in Electron. This is the visible copy the native app explicitly configures, and removing it would weaken parity.
- Do not introduce a shared helper for two dialog calls. The change is small, and direct configuration keeps each picker's existing constraints easy to audit.

## Risks / Trade-offs

- Electron platform behavior may show default system dialog titles when `title` is omitted -> Mitigation: this matches the native app's reliance on platform defaults and avoids app-specific duplicate copy.
- Regex-based source tests can be brittle -> Mitigation: scope assertions to the picker function blocks and pair them with OpenSpec validation and package/build checks.
