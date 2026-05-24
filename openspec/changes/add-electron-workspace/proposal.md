## Why

Wikiwise needs a low-risk path toward a cross-platform desktop client without disrupting the current SwiftUI macOS app. A parallel Electron workspace lets the project validate cross-platform packaging, renderer structure, shared wiki resources, and Node-based desktop capabilities while the existing app remains buildable and usable.

## What Changes

- Add a root npm workspace for JavaScript/Electron packages.
- Add `packages/wikiwise-core` as the first shared JavaScript package for reusable Wikiwise resource helpers.
- Add `apps/electron` as a minimal Electron shell that can load a renderer and reach shared core metadata through a secure preload bridge.
- Document the parallel app status so the Swift app remains the current production app.

## Success Criteria

- `packages/wikiwise-core` exists, is testable with the Node built-in test runner, and exposes helpers for the existing bundled web resources.
- `apps/electron` exists with main, preload, renderer, test, and README files.
- The Electron main/preload design keeps renderer Node integration disabled and exposes only a narrow `window.wikiwise` bridge.
- Root npm scripts can run workspace tests without requiring Electron to be installed.
- Existing Swift source and release workflow are not changed.
- OpenSpec artifacts define, plan, and track the work before implementation is marked complete.

## Non-Goals

- Shipping a feature-complete cross-platform Wikiwise app.
- Replacing the SwiftUI macOS app.
- Introducing React, bundling, auto-update, signing, installers, terminal emulation, or full wiki editing in this change.
- Migrating `build.js`, scaffold creation, publishing, or terminal behavior into Electron beyond the first reusable package boundary.

## Capabilities

### New Capabilities

- `wikiwise-core-package`: Shared JavaScript package boundary for reusable Wikiwise resource helpers.
- `cross-platform-electron-workspace`: Parallel Electron application workspace for future cross-platform Wikiwise development.

### Modified Capabilities

- None.

## Impact

- Adds root npm workspace metadata.
- Adds `packages/wikiwise-core`.
- Adds `apps/electron`.
- Adds OpenSpec change artifacts under `openspec/changes/add-electron-workspace`.
- Updates `.gitignore` and README documentation.
- Does not modify `Sources/Wikiwise/`, bundled Swift resources, SwiftPM configuration, or release packaging scripts.
