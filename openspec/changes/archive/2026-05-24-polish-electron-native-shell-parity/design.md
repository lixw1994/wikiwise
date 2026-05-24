## Context

The SwiftUI app presents a product-ready welcome view when no folder is open: a `W` mark, `WikiWise` wording, two primary actions, and a short hint about creating a wiki with Claude Code, Codex, or Cursor. The current Electron renderer still shows migration/debug content: "Wikiwise Electron", "Cross-platform workspace", and a visible "Shared resources" panel powered by a preload IPC bridge. That made sense in the initial Electron shell, but it is now a user-visible parity gap.

## Goals / Non-Goals

**Goals:**

- Align Electron product naming and welcome copy with the native SwiftUI welcome state.
- Remove the renderer-visible shared-resources debug panel.
- Remove the `listResources` IPC/preload/renderer API instead of hiding it behind CSS.
- Keep the Electron preload bridge narrow and production-oriented.
- Make the Electron welcome/project shell fill the app window without an outer debug-card layout.
- Add structural tests that fail if the debug shell returns.

**Non-Goals:**

- Do not change SwiftUI source behavior.
- Do not redesign the entire Electron workspace UI or add new native controls.
- Do not change packaging, signing, notarization, or DMG release behavior.
- Do not claim final migration completion; this phase only removes a high-signal shell mismatch.

## Decisions

1. **Remove the resource bridge entirely.** The `window.wikiwise.resources` API and `wikiwise:listResources` handler were scaffolding for early shared-core verification. Production renderer code now uses project, compiler, save, watcher, terminal, publishing, settings, navigation, and map APIs. Removing the debug API narrows the bridge and matches the app's production surface. Alternative: keep the API hidden from the UI. I am avoiding that because the main spec would still require debug metadata and the preload contract would stay broader than needed.

2. **Mirror native welcome content, not the early Electron marketing copy.** The Electron no-folder state will use the native `W` mark, the same multiline `WikiWise helps you...` copy, the same two actions, and the same agent hint. Alternative: keep Electron-specific wording to explain cross-platform status. I am removing it because the user-facing product should not expose implementation technology in the first viewport.

3. **Use structural tests for this phase.** Existing Electron tests inspect source files without launching the GUI. This change will add coverage that checks branding strings, removed debug selectors/APIs, and full-window shell style invariants. Alternative: launch Electron and run pixel assertions. That belongs in a later runtime parity audit because it needs GUI automation, but structural tests are enough to prevent the known regression here.

4. **Keep styling changes scoped.** The Electron shell will drop the two-column debug layout and project outer card treatment while preserving the existing editor, preview, terminal, publishing, and modal markup. This avoids turning a shell polish phase into a broad visual rewrite.

## Risks / Trade-offs

- **Source-level tests can miss live rendering differences** -> Retain a later runtime/manual parity audit under the roadmap before migration completion is claimed.
- **Removing the debug API could surprise future diagnostics** -> The app can add an explicit developer diagnostics surface later if needed; production preload should not expose unused resource metadata.
- **CSS changes could affect project layout spacing** -> Keep selectors narrow and run the existing Electron structural test suite plus root tests.
- **Brand casing differs between title and body copy** -> Use `Wikiwise` for app/window/document title metadata and `WikiWise` where matching the native welcome copy.

## Migration Plan

1. Add failing Electron tests for native shell branding, welcome copy, removed debug resource UI/API, and full-window shell layout.
2. Remove the resource IPC handler, preload method, renderer state, and debug panel markup/styles.
3. Update Electron welcome markup and shell styles to match the native no-folder state more closely.
4. Run Electron tests, root tests, OpenSpec validation, Swift build, and whitespace checks.
5. Archive the change with retained verification evidence. Rollback is a normal git revert because no persisted data or scaffold format changes are introduced.
