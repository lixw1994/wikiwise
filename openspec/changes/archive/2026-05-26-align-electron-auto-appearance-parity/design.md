## Context

The native SwiftUI app stores `appearanceMode` as `Auto`, `Light`, or `Dark`. `Auto` maps to `nil` `NSAppearance`, so the app follows macOS system appearance. Electron already mirrors that in the main process by setting `nativeTheme.themeSource` to `system`, but the renderer currently stores `data-appearance="Auto"` and only defines dark tokens for `data-appearance="Dark"`. As a result, Auto on a dark system can still render the warm light shell.

## Goals / Non-Goals

**Goals:**
- Preserve the user-facing stored mode label and toolbar symbol cycle: Auto, Light, Dark.
- Add a separate resolved renderer appearance state for palette decisions: Light or Dark.
- Keep CSS explicit mode overrides working exactly as before.
- Make Auto respond to system color-scheme changes while the app is running.

**Non-Goals:**
- Change native SwiftUI behavior.
- Change the appearance mode cycle order or persisted settings schema.
- Add a new Electron dependency or a custom native appearance bridge.
- Complete signed/notarized release execution; that remains credential-dependent.

## Decisions

- Resolve palette state in the renderer rather than changing persisted mode. This keeps settings compatible with SwiftUI and preserves the toolbar label while giving CSS a concrete `data-resolved-appearance` value.
- Use `window.matchMedia("(prefers-color-scheme: dark)")` for Auto resolution. This aligns with Electron's system theme behavior in the renderer process and lets the page react to system changes without a main-process round trip.
- Keep existing `data-appearance` for stored-mode audit evidence and add `data-resolved-appearance` for palette evidence. This avoids confusing "Auto" with the concrete palette currently applied.
- Add tests at source level first because the gap is deterministic from CSS and renderer code. Runtime audit remains the broader visual gate.

## Risks / Trade-offs

- System appearance changes while the app is open could leave the terminal theme stale if no listener runs. Mitigation: add a media-query change listener that reapplies the document and terminal theme.
- Runtime audit scenarios currently set explicit Light/Dark modes. Mitigation: keep explicit mode behavior unchanged and make Auto coverage source-level in this slice.
- Some browser environments may not support `addEventListener` on `MediaQueryList`. Mitigation: use a small compatibility wrapper for `addListener` fallback.
