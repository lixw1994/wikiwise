## Context

`Sources/Wikiwise/RightSidebar.swift` renders document metadata only when `selectedFileURL` is present. It wraps PATH, EDITED, and WORDS inside `infoSection("ABOUT THIS DOCUMENT")`, where the section header uses 9pt JetBrains Mono, 1.6 tracking, uppercase text, and sidebar header color. The metadata rows use horizontal `HStack` layout: a 10pt JetBrains Mono label on the left, spacer, and a 12pt Fraunces value on the right. Electron already computes the same metadata values, but its markup renders the definition list directly and keeps a `No document` placeholder visible.

## Goals / Non-Goals

**Goals:**

- Add the native `ABOUT THIS DOCUMENT` grouping to the Electron INFO tab.
- Hide the metadata group when no document is selected.
- Align metadata rows to native horizontal label/value layout and typography.
- Preserve existing document info IPC, formatted edited time, word count, directions, and wikilink behavior.

**Non-Goals:**

- Changing how document metadata is calculated.
- Changing optional DIRECTIONS/LINKED conditional behavior.
- Changing terminal behavior, right sidebar resizing, or tab switching.
- Changing native SwiftUI source.

## Decisions

- Add an `info-about-section` wrapper containing the existing `info-list` and a native section header. This keeps the existing IDs for PATH/EDITED/WORDS values while giving the renderer a single section to hide.
- Update `renderInfoTab()` to toggle the wrapper from `state.selectedFile` rather than from optional `documentInfo`, because native visibility is based on selected document presence.
- Scope CSS to `.info-about-section`, `.info-row`, and `.info-value` so existing DIRECTIONS/LINKED styles continue to behave independently.
- Cover the change with a source parity test in the right sidebar suite that verifies the native conditional section, the Electron wrapper, hidden placeholder removal, horizontal row layout, and typography tokens.

## Risks / Trade-offs

- The INFO panel will show less content when no document is selected because the `No document` placeholder disappears. This is intentional native parity.
- Values will align right within the metadata rows, which can truncate or wrap differently than the old vertical definition list. The rows use existing overflow wrapping to avoid clipping long values.
