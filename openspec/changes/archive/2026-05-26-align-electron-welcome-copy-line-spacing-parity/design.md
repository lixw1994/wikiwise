## Context

The native no-folder welcome screen uses SwiftUI text modifiers rather than proportional browser line-height values: the main welcome summary is 15px text with `.lineSpacing(4)`, and the helper hint is 12px text with `.lineSpacing(3)`. Electron currently uses `line-height: 1.55` and `line-height: 1.45`, which produces looser line boxes than the native view.

## Goals / Non-Goals

**Goals:**
- Match the Electron welcome summary copy to Swift's 15px text plus 4px line spacing.
- Match the Electron welcome hint copy to Swift's 12px text plus 3px line spacing.
- Preserve copy text, intentional line breaks, action styling, toolbar brand styling, color tokens, and overall welcome spacing.

**Non-Goals:**
- Rework welcome layout, toolbar titlebar spacing, button symbols, action behavior, or runtime audit scenarios.
- Change shared `.summary` typography outside the welcome panel.
- Introduce JavaScript layout logic.

## Decisions

- Use explicit pixel line heights for welcome-only copy.
  Alternative considered: keep unitless ratios and approximate the native spacing. Pixel values make the contract directly traceable to Swift's fixed font sizes and `lineSpacing` modifiers.
- Scope the CSS to `.welcome-panel .summary` and `.welcome-hint`.
  This avoids changing publish dialogs, post-create guide text, or other shared summary surfaces.
- Derive values as font size plus native line spacing.
  The main summary becomes `19px` (`15px + 4px`) and the hint becomes `15px` (`12px + 3px`).

## Risks / Trade-offs

- Browser text metrics are not identical to SwiftUI text rendering -> Mitigation: match the explicit line-box rhythm while preserving existing fonts and colors.
- Shared summary styles might be unintentionally affected -> Mitigation: change only the welcome-specific selectors and add focused parity coverage.
