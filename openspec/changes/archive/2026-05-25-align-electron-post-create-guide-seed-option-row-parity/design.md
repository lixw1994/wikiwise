## Context

Native SwiftUI uses `seedOption(icon:title:command:)` for each suggestion in the seed section. That helper renders an `HStack(alignment: .top, spacing: 10)` with a 20px-wide accent icon and a leading text stack with 2px spacing. The title is 13px medium `Color.sidebarSelectedText`; the command is 12px monospaced `Color.sidebarTextMuted`. Electron currently keeps the copy in plain `<li><strong>...:</strong> <code>...</code></li>` rows, which preserves text but not the native visual hierarchy.

## Goals / Non-Goals

**Goals:**
- Render the four seed suggestions as native-like icon/title/command rows.
- Preserve native symbol identifiers in markup for parity coverage and future icon rendering.
- Match native spacing, icon width, icon color, title style, and command style.
- Keep the existing seed option titles and commands unchanged.

**Non-Goals:**
- Change seed suggestion copy or add new seed actions.
- Change the agent command quick-start section, final guidance, summary, headings, or dismiss behavior.
- Introduce an icon library or change app-wide symbol rendering.

## Decisions

- Keep the semantic `<ul>`/`<li>` container while styling it to match native rows.
  - Rationale: The existing list semantics are useful for accessibility and minimize markup churn, while CSS can mirror the SwiftUI `VStack` and `HStack` layout.
  - Alternative considered: replace the list with plain `<div>` rows. That would be closer to SwiftUI implementation details but would remove useful HTML semantics without improving parity.
- Add `.guide-seed-icon` spans with `data-native-symbol` values.
  - Rationale: Existing Electron toolbar/welcome markup uses `data-native-symbol` to document SwiftUI symbol parity. Reusing that pattern keeps this slice consistent.
  - Alternative considered: render only text titles and commands. That would leave the native accent icon column missing.
- Scope all styling under the post-create guide seed classes.
  - Rationale: Existing guide list/code styles are shared and should remain available for other copy until separately aligned.

## Risks / Trade-offs

- Browser fallback glyphs cannot be exact SF Symbols -> mitigated by preserving `data-native-symbol` identifiers and matching native icon box, size, and accent color.
- Keeping `<ul>` semantics means the DOM differs from SwiftUI's `VStack` implementation -> accepted because the rendered structure and behavior move closer to native while preserving accessible list semantics.
