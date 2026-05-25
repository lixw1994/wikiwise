## Overview

SwiftUI renders the Back and Forward controls with `Text("←")` and `Text("→")`, `.font(.system(size: 16, weight: .regular, design: .monospaced))`, and `foregroundStyle(backHistory.isEmpty ? Color.toolbarDisabled : Color.toolbarText)` or the forward equivalent. Electron already has the correct glyphs, disabled state, and help labels, but the CSS comes from the generic `.toolbar-icon-button` 12px rule and the global `button:disabled` opacity.

## Decisions

- Add targeted `#go-back` and `#go-forward` CSS rules for 16px regular monospaced typography.
- Add targeted disabled rules for both controls using `--color-toolbar-disabled` and no opacity reduction.
- Leave all other toolbar icon controls on the existing generic icon style for this slice.
- Leave renderer history state, disabled attributes, titles, aria labels, and menu command routing unchanged.

## Alternatives Considered

- Changing the generic `.toolbar-icon-button` font size. That would also affect appearance, map, and sidebar icons, which have distinct native symbol sizes and should be handled separately.

## Validation

- Add a targeted Node test that reads SwiftUI toolbar source and Electron CSS, then verifies Back/Forward typography and disabled color handling.
- Run the existing chrome/menu/persistence toolbar test file as the red/green target.
- Run full repository verification and OpenSpec strict validation before committing.
