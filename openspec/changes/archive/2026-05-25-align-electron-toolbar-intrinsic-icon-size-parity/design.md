## Context

The native opened-project toolbar puts icon-only controls inside `HStack` containers and applies `.buttonStyle(.plain)` to those buttons. Unlike the segmented FILE/WIKI control and publish action, these icon-only controls do not add explicit `.padding` or `.frame` modifiers to their labels.

Electron still gives `.toolbar-icon-button` fixed `34px` inline and `31px` block sizes plus `6px 9px` padding. With visible chrome removed, those invisible boxes still widen the apparent icon rhythm compared with SwiftUI.

## Decisions

- Treat `.toolbar-icon-button` as intrinsic-sized content: `min-width: 0`, `inline-size: auto`, `block-size: auto`, and `padding: 0`.
- Keep existing icon font sizes, symbols, colors, disabled behavior, title/aria labels, navigation arrow typography, toolbar group gaps, and sidebar behavior.
- Do not modify `.mode-button` or `.publish-button`; their native SwiftUI equivalents explicitly use `.padding` and rounded rectangle overlays.

## Risks

- Shrinking button boxes changes clickable area. This is aligned with the current visual parity goal, and click behavior remains bound to the same buttons.
- Generic `button` padding could leak back in if `.toolbar-icon-button` does not explicitly set `padding: 0`; the regression test guards that.

## Verification

- Add a targeted regression test for native lack of `.frame`/`.padding` on icon-only toolbar controls and Electron intrinsic CSS.
- Run the targeted Electron chrome/menu toolbar test for red and green.
- Run full repository verification, OpenSpec strict validation, Electron macOS packaging, archive the change, and rerun verification.
