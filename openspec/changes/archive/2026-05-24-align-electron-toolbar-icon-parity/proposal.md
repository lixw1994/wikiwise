# Change: Align Electron Toolbar Icon Parity

## Why
The SwiftUI macOS toolbar renders appearance, 3D map, and sidebar controls as icon-only buttons backed by SF Symbols, with labels exposed through help text. The Electron toolbar still shows visible `Auto` and `Map` text in icon-sized controls, which makes the opened-project chrome visibly diverge from the native app.

## What Changes
- Replace visible Electron toolbar text for appearance and map controls with stable icon-only symbol spans.
- Preserve native-style `title` and `aria-label` labels so icon-only controls remain accessible and inspectable.
- Map Electron toolbar controls to the same SwiftUI symbol semantics (`circle.lefthalf.filled`, `sun.max.fill`, `moon.fill`, `map`, `sidebar.left`, `sidebar.right`) using DOM data attributes and deterministic fallback glyphs.
- Extend the runtime parity audit to record toolbar icon evidence and fail if native icon controls expose text labels such as `Auto`, `Light`, `Dark`, or `Map`.

## Impact
- Advances visible project toolbar parity without introducing new dependencies.
- Keeps existing toolbar actions, shortcuts, history, map routing, publishing, and sidebar toggles unchanged.
- Does not yet attempt to reproduce SwiftUI's system-provided split-view sidebar toolbar affordance; the Electron left-sidebar toggle remains available for hide/show behavior.

## Out of Scope
- Replacing fallback glyphs with platform font rendering for actual SF Symbols.
- Changing left-sidebar toggle visibility rules.
- Signed/notarized release completion.
