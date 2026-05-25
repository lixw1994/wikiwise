## Context

`Sources/Wikiwise/ContentView.swift` renders the publish sheet title with `.font(.system(size: 18, weight: .medium, design: .serif))`. The Electron dialog has `<h2 id="publish-title">Publish your wiki</h2>`, but its typography currently comes from generic dialog and heading rules. Other Electron serif headings already use `Georgia, serif` with medium-like weight.

## Goals / Non-Goals

**Goals:**

- Match the native publish sheet title's 18px serif, medium-weight treatment.
- Scope the title typography to the publish dialog.
- Preserve current publish dialog spacing, padding, width, copy, and behavior.

**Non-Goals:**

- Changing global `h2` typography.
- Changing publish result, error, or unpublish confirmation dialog title typography.
- Changing SwiftUI source.

## Decisions

- Add a `.publish-dialog h2` rule instead of changing global `h2` or `.modal-panel h2`. The native evidence applies to the publish sheet title, and other modal headings are governed by their own parity requirements.
- Use the existing Electron serif convention (`Georgia, serif`) and `font-weight: 500` as the closest local CSS expression of SwiftUI's medium serif system font.
- Keep `font-size: 18px`, matching the native 18pt size already expected for the publish title.

## Risks / Trade-offs

- The browser serif stack is not a perfect match for SwiftUI's system serif renderer, but using the app's existing serif convention keeps the Electron implementation consistent while moving closer to the native visual contract.
