## Context

`Sources/Wikiwise/RightSidebar.swift` always renders the ABOUT metadata section when `selectedFileURL` is present. Its `formattedModDate` and `formattedWordCount` helpers return `—` when file attributes or UTF-8 text cannot be read, and optional `DIRECTIONS`/`LINKED` sections disappear because their helpers return nil or empty arrays. Electron currently clears `state.documentInfo` after `wikiwise.getDocumentInfo` fails, renders blank EDITED and WORDS values, and calls `setError(error)`, creating visible shell error state that native does not show for metadata fallback.

## Goals / Non-Goals

**Goals:**
- Render selected-file PATH while using native `—` fallbacks for missing EDITED and WORDS metadata.
- Keep optional directions and linked sections hidden when document metadata is unavailable.
- Make document-info refresh failures quiet in the renderer, matching native metadata helper fallback behavior.

**Non-Goals:**
- Changing the main-process document-info validation contract or core package missing-file rejection.
- Changing successful metadata formatting, directions parsing, wikilink extraction, INFO layout styling, or terminal behavior.
- Adding a runtime audit scenario for a deleted selected file in this slice.

## Decisions

- Use a renderer-local `missingInfoValue` constant set to `—` so both EDITED and WORDS share the native fallback glyph.
- Keep the ABOUT section gated on `state.selectedFile`, not on successful metadata. This matches native `if let file = selectedFileURL`.
- On document-info refresh failure, clear stale metadata and re-render the fallback state, but log the error instead of surfacing it through the generic shell error message.

## Risks / Trade-offs

- Quiet metadata failures could hide unexpected IPC issues. The renderer will still log them to the console, and broader project/open/save failures continue to use the existing error display.
- EDITED/WORDS may show `—` briefly while metadata is loading. This is closer to native fallback behavior than blank rows and is replaced once metadata arrives.
