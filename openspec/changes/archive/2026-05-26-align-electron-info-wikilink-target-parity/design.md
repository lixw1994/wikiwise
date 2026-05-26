## Context

`Sources/Wikiwise/RightSidebar.swift` extracts linked targets by scanning the raw markdown between `[[` and `]]`. The native helper keeps the substring exactly as written and dedupes with `targets.contains(target)`, so `[[Alpha]]`, `[[ Alpha ]]`, and `[[Alpha ]]` are distinct INFO targets. `packages/wikiwise-core/src/index.js` currently trims each captured target before dedupe, which changes both the displayed linked row and duplicate behavior in Electron's INFO tab.

## Goals / Non-Goals

**Goals:**
- Make document-info wikilink extraction preserve native raw target strings.
- Keep exact duplicate suppression for identical raw targets.
- Cover whitespace-sensitive targets with failing tests before production changes.

**Non-Goals:**
- Changing compiled-site wikilink resolution or generated HTML.
- Normalizing wiki content or recommending whitespace in wikilinks.
- Changing linked-row typography, marker text, optional-section visibility, directions parsing, word count, edited time, or terminal behavior.

## Decisions

- Remove trimming from the document-info wikilink target extraction path so the INFO tab receives the same target strings native SwiftUI would render.
- Continue rejecting empty captures caused by `[[ ]]` only when the raw captured string is empty. Whitespace-only captures are non-empty in Swift and therefore remain visible.
- Keep dedupe based on the raw target string. This matches the native array `contains` check and avoids treating visually similar but different strings as one link.

## Risks / Trade-offs

- Documents with whitespace inside wikilinks may now show that whitespace in Electron's INFO `LINKED` rows. This is intentional because native macOS already does so.
- Exact raw-target dedupe can show multiple rows that look similar. This preserves native semantics and keeps any future normalization decision anchored in a separate native change.
