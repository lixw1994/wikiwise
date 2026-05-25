## Why

The native macOS INFO tab renders frontmatter directions as a gold callout with serif italic text, padding, warm accent background, and a 2pt leading accent bar. Electron currently displays directions as a plain metadata paragraph, so the guidance callout loses the visual hierarchy present in the SwiftUI app.

## What Changes

- Align the Electron INFO `DIRECTIONS` section with the native gold callout styling.
- Preserve existing directions parsing, conditional visibility, and text rendering behavior.
- Keep ABOUT THIS DOCUMENT, LINKED, tab switching, terminal, and sidebar resize behavior unchanged.
- Add source parity coverage for the native directions callout style.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: Require the INFO tab directions section to render as the native gold callout when directions are present.

## Impact

- Affects Electron renderer markup and CSS for the INFO directions text.
- Adds Electron right sidebar Info visual parity regression coverage.
- Updates the `electron-right-sidebar-terminal` OpenSpec capability.
