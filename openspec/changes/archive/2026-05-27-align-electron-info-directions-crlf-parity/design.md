## Context

The native parser is intentionally small: it checks `text.hasPrefix("---")`, splits with `text.split(separator: "\n", omittingEmptySubsequences: false)`, enters frontmatter only when a line equals `"---"`, and returns the first non-empty exact `directions:` value before a closing exact marker. Because CRLF marker lines include `"\r"`, they are not exact native markers.

## Decisions

- Replace the JavaScript `/\r?\n/` split with `split("\n")` so carriage returns stay attached to CRLF lines.
- Keep the existing exact `line === "---"` marker comparison and exact `line.startsWith("directions:")` key comparison.
- Preserve current LF behavior and all non-directions document metadata helpers.
- Add both behavior and source-level coverage: core tests exercise CRLF content, and Electron source tests anchor native `split(separator: "\n")` to shared core `split("\n")`.

## Risks

- Some CRLF markdown files that Electron previously treated as having directions will now hide the directions callout. This is intentional for native parity: the macOS app currently hides that callout for the same input.
