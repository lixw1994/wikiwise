## Context

The SwiftUI app stores `lastFolderPath` and `appearanceMode` through `@AppStorage`, restores the last folder for the first window, applies native light/dark/auto appearance, exposes menu shortcuts for back, forward, and refresh, and presents toolbar controls for File/Wiki mode, history, appearance, 3D map, publish, and right-sidebar visibility. Electron currently has project lifecycle, editing, preview, terminal, and publishing, but lacks durable settings, app menu commands, back/forward history, generated map navigation, and native-like toolbar controls.

## Goals / Non-Goals

**Goals:**

- Add main-owned settings persistence using Electron user data storage.
- Restore the last valid project directory on startup.
- Apply and persist `Auto`, `Light`, and `Dark` appearance modes through Electron native theme plus renderer attributes.
- Add native-compatible menu commands for Go Back, Go Forward, and Refresh Page.
- Add preload APIs for settings, restore, generated page loading, and app command events.
- Add renderer toolbar controls and state for back/forward history, appearance cycling, 3D map navigation, refresh, and right-sidebar toggling.

**Non-Goals:**

- Do not change Swift sources.
- Do not complete full visual parity, draggable native titlebar regions, release packaging, or final audit.
- Do not implement full WKWebView-equivalent link interception for every iframe navigation in this phase.
- Do not persist sidebar widths unless a later native parity audit requires it.

## Decisions

1. **Persist settings in Electron main.** Main will read/write a JSON file under `app.getPath("userData")` with `lastFolderPath` and `appearanceMode`. Alternative: use renderer `localStorage`. Main-owned settings match native app-level storage and keep filesystem access out of renderer.

2. **Restore through IPC, not direct renderer bootstrapping.** Renderer asks preload for `restoreLastProject`, and main returns the same serializable project result shape used by open/create. Alternative: main could push the project after window creation, but explicit renderer startup keeps existing `applyProjectResult` as the single project hydration path.

3. **Menu commands are event-based.** Main builds an application menu and sends `wikiwise:appCommand` events to the focused renderer. Renderer decides whether back/forward/refresh are enabled by its own state. This mirrors Swift notifications without needing main to know renderer navigation state.

4. **Generated page navigation uses main-owned compiler paths.** Renderer asks main to open `map-3d.html`; main ensures compiler output exists and returns a file URL. Renderer stores generated pages in the same history stack as selected files.

5. **Appearance is both native and renderer-visible.** Main persists the selected mode and applies `nativeTheme.themeSource`. Renderer stores the mode in state and sets `document.documentElement.dataset.appearance` so CSS and controls can respond.

## Risks / Trade-offs

- **Settings file corruption** -> Fall back to default settings and overwrite on the next save.
- **Menu command drift** -> Static tests verify labels, accelerators, and event channel names.
- **History state complexity** -> Keep entries as small serializable `{ kind, path/name/fileUrl }` objects and centralize `currentHistoryEntry`.
- **Map output missing** -> Main compiles all pages before resolving the generated page and returns null only if the file still does not exist.
- **Visual mismatch remains** -> This phase improves behavior and controls; pixel-level chrome polish remains for final parity/audit phases.
