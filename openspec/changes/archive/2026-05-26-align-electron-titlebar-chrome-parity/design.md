## Context

The SwiftUI app configures window chrome in two places: `WikiwiseApp` uses `.windowStyle(.titleBar)` and `ContentView.onAppear` clears the `NSWindow` title while setting `titlebarSeparatorStyle = .none`. The Electron app already recreates the toolbar content in renderer HTML/CSS, but `createMainWindow()` still uses default BrowserWindow titlebar behavior, so the OS titlebar can expose title/separator chrome that the native app removes.

## Goals / Non-Goals

**Goals:**
- Hide the visible Electron titlebar title/separator with native macOS hidden-inset chrome while keeping `Wikiwise` as the app/document identity.
- Keep welcome and project toolbars draggable like native titlebar toolbar surfaces.
- Protect toolbar content from macOS traffic-light overlap.
- Preserve existing window geometry, runtime audit, packaging, and release workflows.

**Non-Goals:**
- Rework the toolbar controls or visual palette beyond the titlebar chrome/inset changes.
- Replace the renderer toolbar with a fully native macOS toolbar.
- Claim final release readiness; signed/notarized release evidence remains gated by Apple credentials.

## Decisions

- Use BrowserWindow `titleBarStyle: "hiddenInset"` instead of `frame: false`. This keeps native macOS window controls and accessibility behavior while hiding the visible titlebar text, whereas frameless windows would require recreating too much OS chrome.
- Keep `title: "Wikiwise"` rather than blanking the BrowserWindow title. The native app clears visible `NSWindow.title`, but Electron still needs a product-facing identity for document title, app switcher, and tests that prevent Electron implementation labels from leaking.
- Add explicit traffic-light positioning and CSS leading inset for the renderer toolbars. Hidden-inset titlebars place macOS window controls over the content area, so the toolbar needs a stable reserved leading region.
- Mark toolbar backgrounds as draggable and interactive controls as no-drag. This restores native titlebar drag behavior after the renderer owns the visible toolbar surface.

## Risks / Trade-offs

- Hidden-inset titlebar behavior is macOS-specific → keep this scoped to Electron BrowserWindow options and verify with the existing runtime audit and macOS packaging commands.
- Toolbar leading inset could shift content too far on non-macOS platforms → this app is currently packaged and audited for macOS, and the inset is tied to native macOS titlebar parity.
- CSS app-region can make controls unclickable if applied too broadly → tests will require no-drag on buttons, inputs, and toolbar control groups.
