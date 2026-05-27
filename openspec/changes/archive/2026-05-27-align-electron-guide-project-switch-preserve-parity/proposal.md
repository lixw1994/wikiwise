## Why

Native SwiftUI keeps the post-create guide visible across project replacement paths until the user explicitly activates `Got it — start reading`. Electron currently collapses `showPostCreateGuide` to `false` whenever a normal project result is applied, so opening an existing wiki immediately after creating one dismisses the guide earlier than the native app.

## What Changes

- Preserve an already-visible Electron post-create guide when applying ordinary project results such as Open Existing or restore flows.
- Continue showing the guide explicitly after successful new-wiki creation.
- Keep scaffold failure handling and `Got it — start reading` as the explicit guide dismissal paths.
- Add source-backed regression coverage anchored to the native `openURL(_:)` folder branch and Electron `applyProjectResult` state transition.
- Preserve existing project loading, tree reset, history reset, generated-page reset, service startup, and guide rendering behavior.

## Capabilities

### New Capabilities

### Modified Capabilities

- `electron-new-wiki-scaffold`: Post-create guide visibility follows native persistence across project result application.
- `electron-native-parity-roadmap`: Track this post-create guide project-switch parity slice and retained verification evidence.

## Impact

- Electron renderer project application behavior in `apps/electron/src/renderer/renderer.js`.
- Electron new-wiki scaffold regression tests in `apps/electron/test/new-wiki-scaffold.test.js`.
- OpenSpec delta specs and roadmap tracking for the Electron native parity migration.
