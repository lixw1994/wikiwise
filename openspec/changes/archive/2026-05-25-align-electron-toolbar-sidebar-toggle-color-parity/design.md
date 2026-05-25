## Overview

SwiftUI defines sidebar toolbar controls as `.buttonStyle(.plain)` icon buttons. The right-sidebar toggle uses `Color.toolbarText` when visible and `Color.toolbarDisabled` when hidden. The custom left-sidebar restore button shown while the native split-view sidebar is closed uses `Color.toolbarDisabled`. Electron already tracks the same visible/hidden state with the `selected` class, but the selected rule currently paints a selected background and selected text color.

## Decisions

- Keep the `selected` class as the existing renderer state marker for visible sidebars.
- Change `.toolbar-icon-button.selected` so it uses a transparent background and `--color-toolbar-text`.
- Add targeted rules for `#toggle-left-sidebar:not(.selected)` and `#toggle-right-sidebar:not(.selected)` so hidden sidebar toggles use `--color-toolbar-disabled`.
- Leave generic toolbar icon dimensions, symbols, titles, aria labels, click handlers, and `aria-pressed` behavior unchanged.

## Alternatives Considered

- Removing the `selected` class entirely. Keeping it avoids touching renderer state logic and preserves existing tests and accessibility state while changing only the visible CSS contract.

## Validation

- Add a targeted Node test that reads the native SwiftUI source and Electron CSS, then verifies the sidebar toggle foreground/background state mapping.
- Run the existing chrome/menu/persistence toolbar test file as the red/green target.
- Run full repository verification and OpenSpec strict validation before committing.
