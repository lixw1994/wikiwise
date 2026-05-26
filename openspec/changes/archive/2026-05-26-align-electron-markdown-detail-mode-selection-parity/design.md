## Context

Native SwiftUI stores FILE/WIKI as `detailMode` and `navigateTo(_:)` does not mutate that state when a user selects another Markdown file. The Electron renderer currently routes every selected Markdown file through `initialDetailModeForFile(file)`, which returns WIKI and therefore resets users out of FILE mode during source-editing navigation.

## Goals / Non-Goals

**Goals:**
- Match native detail-mode persistence when selecting Markdown files during an existing project/detail session.
- Preserve the initial WIKI mode used by native startup, project open, created wiki home, generated page return, and standalone Markdown fallback.
- Keep non-Markdown editor fallback behavior unchanged.

**Non-Goals:**
- Change the File/Wiki segmented toolbar styling.
- Change preview compilation, scroll preservation, watcher refresh, generated page navigation, or save behavior.
- Change native Swift code.

## Decisions

- Preserve the current renderer `state.detailMode` for selected files instead of deriving WIKI for every Markdown selection. This mirrors Swift because `navigateTo(_:)` sets `selectedFileURL`, loads the file, and increments `webViewReloadToken` without assigning `detailMode`.
- Keep the renderer's initial state as WIKI. Project opens and standalone Markdown opens still begin in WIKI mode because the renderer state starts there before the first selected file is applied.
- Keep generated pages explicitly setting WIKI mode. Native generated pages are compiled HTML views, so this change is limited to selected source files.

## Risks / Trade-offs

- Existing tests assume Markdown selections always reset to WIKI -> Update tests to distinguish initial WIKI state from later selection persistence.
- A selected Markdown file with no compiled preview can still show editor fallback while WIKI remains selected -> Existing fallback behavior already covers this and should remain unchanged.
