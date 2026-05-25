## Overview

SwiftUI places the left toolbar controls in `ToolbarItem(placement: .navigation)` with `HStack(spacing: 14)` and the right toolbar controls in `ToolbarItem(placement: .primaryAction)` with `HStack(spacing: 10)`. Electron currently uses `.toolbar-group { gap: 8px }` for both groups and `.toolbar-group-end` only sets alignment.

## Decisions

- Set the base `.toolbar-group` gap to `14px` to match the native navigation toolbar group.
- Add a `.toolbar-group-end` gap override of `10px` to match the native primary action group.
- Leave `.project-toolbar` grid layout, title offset, button styling, toolbar symbols, labels, disabled state, and click handlers unchanged.

## Alternatives Considered

- Keeping one shared group gap for both sides. That keeps CSS smaller, but it preserves a visible mismatch with the native toolbar because SwiftUI uses two distinct spacings.

## Validation

- Add a targeted Node test that reads SwiftUI toolbar source and Electron CSS, then verifies the 14px/10px group spacing contract.
- Run the existing chrome/menu/persistence toolbar test file as the red/green target.
- Run full repository verification and OpenSpec strict validation before committing.
