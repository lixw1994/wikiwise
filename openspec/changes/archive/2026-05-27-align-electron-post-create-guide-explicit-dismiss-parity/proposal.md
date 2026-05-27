## Why

Native SwiftUI keeps the post-creation guide visible until the user explicitly activates `Got it — start reading`. Sidebar file clicks and generated-page toolbar navigation can update selected state behind the guide, but they do not clear `showPostCreateGuide`; the only native clear path is the guide's own button. Electron currently clears the guide when a file is selected or a generated page is shown, which dismisses the guide earlier than the native app.

## What Changes

- Preserve the post-create guide when the user selects a file while the guide is visible.
- Preserve the post-create guide when generated-page navigation is triggered while the guide is visible.
- Keep `Got it — start reading` as the explicit guide dismissal path that hides the guide and selects `wiki/home.md` when available.
- Preserve project opening, successful new-wiki guide display, scaffold failure behavior, history behavior, generated-page state, and existing guide copy/layout.
- Add source-backed regression coverage anchored to the native `showPostCreateGuide` mutation sites.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Post-create guide visibility now follows native explicit-dismiss semantics.
- `electron-native-parity-roadmap`: Track this post-create guide explicit-dismiss parity slice and retained verification evidence.

## Impact

- Electron renderer guide visibility behavior in `apps/electron/src/renderer/renderer.js`.
- Electron new-wiki scaffold regression tests under `apps/electron/test/new-wiki-scaffold.test.js`.
- OpenSpec delta specs for new-wiki scaffold behavior and roadmap tracking.
