## Context

SwiftUI uses explicit `.font(.system(size: ...))` calls for the icon-only toolbar controls in the opened-project toolbar:

- Appearance mode: 13
- 3D map: 12
- Left sidebar restore: 14
- Right sidebar toggle: 16

Electron currently gives all `.toolbar-icon-button` controls the same 12px font size. Recent toolbar parity slices already aligned symbols, disabled color states, group spacing, and Back/Forward arrow typography, so this change must be limited to the non-navigation icon-only controls.

## Decisions

- Keep the shared `.toolbar-icon-button` base size at 12px for the default control baseline.
- Add selector-specific font sizes for `#appearance-mode`, `#open-map`, `#toggle-left-sidebar`, and `#toggle-right-sidebar`.
- Leave `#go-back` and `#go-forward` untouched because their arrow typography is governed by the navigation-arrow parity requirement.

## Risks

- CSS selector ordering could accidentally override navigation arrow styles or disabled sidebar colors. The regression test will inspect per-control CSS blocks so each mapping remains explicit.

## Verification

- Add a targeted regression test that reads `ContentView.swift` and `styles.css`.
- Run the targeted Electron chrome/menu toolbar test for red and green.
- Run full repository verification, OpenSpec strict validation, Electron macOS packaging, archive the change, and rerun verification.
