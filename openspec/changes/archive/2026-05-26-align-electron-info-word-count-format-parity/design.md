## Context

Native `RightSidebar.formattedWordCount(_:)` reads the selected file, counts words, and formats the value with `NumberFormatter.numberStyle = .decimal`. Electron receives the numeric word count from `summarizeDocumentInfo()` and currently renders it with `String(info.wordCount)`, which skips the native decimal grouping step in the INFO metadata row.

## Goals / Non-Goals

**Goals:**
- Match native decimal word-count formatting in the Electron INFO tab.
- Keep `wordCount` as a numeric document-info payload for existing IPC/core behavior.
- Keep missing-document behavior blank in Electron, matching current INFO section visibility.

**Non-Goals:**
- Change the core word-count algorithm.
- Change edited-time formatting, path labels, directions parsing, wikilink rendering, terminal behavior, or sidebar layout.
- Add dependencies or locale configuration.

## Decisions

- Add a small renderer formatting helper that uses `Intl.NumberFormat().format(...)` for finite numeric word counts. This mirrors Swift `NumberFormatter` at the UI layer while keeping the underlying metadata numeric.
- Keep the fallback empty string for missing or invalid INFO values so hidden/empty metadata behavior remains unchanged.
- Cover this with source-level parity tests that pin the Swift `NumberFormatter` usage and require Electron to stop rendering `String(info.wordCount)` directly.

## Risks / Trade-offs

- Locale grouping can differ by user locale, just like native `NumberFormatter`. Mitigation: use the platform default `Intl.NumberFormat()` rather than a hard-coded locale.
- Source-level tests do not execute a browser DOM. Mitigation: they verify the renderer path responsible for the displayed WORDS value and preserve the existing core numeric tests.
