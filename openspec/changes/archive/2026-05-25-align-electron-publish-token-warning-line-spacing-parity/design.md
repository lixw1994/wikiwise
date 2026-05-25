## Context

`Sources/Wikiwise/ContentView.swift` renders the publish-token warning as 12pt secondary text with `.lineSpacing(2)`. Electron currently renders the same warning as a generic `.summary.compact-summary`, which inherits `.summary { line-height: 1.6; }`. That global summary treatment is useful elsewhere, but it is too broad for the native publish sheet warning.

## Goals / Non-Goals

**Goals:**

- Make the Electron publish-token warning line spacing match the native 12pt text plus 2pt line spacing contract.
- Keep the warning copy, secondary color, 12px font size, and publish dialog content gap unchanged.
- Keep global `.summary` and other compact summary paragraphs unchanged.

**Non-Goals:**

- Changing publish dialog copy, button behavior, width, padding, or action layout.
- Changing welcome copy, feedback dialogs, or other summary typography.
- Changing the native SwiftUI source.

## Decisions

- Add a scoped `publish-token-warning` class to the warning paragraph. This makes the exception explicit and avoids coupling the override to paragraph order.
- Set `line-height: calc(1.2em + 2px)` for the scoped class. The `1.2em` base approximates native system text's default line box, while the added `2px` mirrors SwiftUI `.lineSpacing(2)` for the 12px Electron text.
- Cover the change with a source parity test that verifies the native `.lineSpacing(2)` contract, the scoped Electron markup hook, the scoped line-height override, and the unchanged generic `.summary` line height.

## Risks / Trade-offs

- The CSS value is an approximation of SwiftUI text layout rather than a byte-for-byte rendering model. The scoped class keeps the approximation isolated to the only paragraph that declares `.lineSpacing(2)` in the native publish sheet.
