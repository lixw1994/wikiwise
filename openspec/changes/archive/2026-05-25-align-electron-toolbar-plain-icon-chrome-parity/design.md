## Context

The native toolbar's icon-only controls are declared as SwiftUI `Button` labels and apply `.buttonStyle(.plain)`. Recent slices aligned symbol semantics, colors, group spacing, navigation arrow typography, and icon sizes, but the Electron base `.toolbar-icon-button` still includes a `1px solid` border and `6px` radius.

## Decisions

- Treat `.toolbar-icon-button` as the Electron equivalent of the native plain icon-only toolbar buttons.
- Set the base icon-only toolbar border to `0` and border radius to `0` so selected and unselected icon controls do not show custom boxed chrome.
- Keep the existing fixed hit target, padding, fonts, icon-size overrides, disabled colors, navigation arrow typography, toolbar group spacing, and sidebar behavior intact.
- Do not change `.mode-button` or `.publish-button` because those controls have explicit native rounded-rectangle/segmented chrome in SwiftUI.

## Risks

- Removing border chrome could accidentally affect segmented mode or publish buttons if selectors are too broad. The change remains scoped to `.toolbar-icon-button`.
- Removing chrome could be confused with changing layout. The implementation keeps current dimensions and spacing to isolate visual chrome only.

## Verification

- Add a targeted regression test for SwiftUI plain button style and Electron border/radius removal.
- Run the targeted Electron chrome/menu toolbar test for red and green.
- Run full repository verification, OpenSpec strict validation, Electron macOS packaging, archive the change, and rerun verification.
