## Context

`Sources/Wikiwise/RightSidebar.swift` reads directions directly from the selected markdown file. Its parser only enters frontmatter after an exact `---` line, stops when it sees the next exact `---`, and only accepts lines that begin exactly with `directions:`. `packages/wikiwise-core/src/index.js` currently trims the opening marker and each candidate line before parsing, which makes Electron display directions for indented keys or whitespace-padded delimiters that native macOS ignores.

## Goals / Non-Goals

**Goals:**
- Make core document-info directions extraction match the native exact parser semantics.
- Keep valid native frontmatter such as `---`, `directions: Keep concise`, `---` working unchanged.
- Cover ignored loose syntax with regression tests before changing implementation.

**Non-Goals:**
- Replacing the parser with a YAML parser.
- Changing directions callout styling, INFO tab visibility rules, word count formatting, edited time formatting, or wikilink extraction.
- Changing native Swift code.

## Decisions

- Mirror native string checks directly in the JavaScript helper. This keeps the Electron result tied to `RightSidebar.parseDirections` instead of broad YAML interpretation.
- Keep directions values trimmed for surrounding horizontal whitespace after the exact `directions:` prefix, matching the Swift `trimmingCharacters(in: .whitespaces)` call.
- Leave CRLF handling in place while comparing logical lines. This preserves cross-platform markdown reads while keeping the exact marker and key semantics.
- Treat only an exact `---` line as the second delimiter. Whitespace-padded delimiter-like lines remain ordinary frontmatter content, matching the native loop.

## Risks / Trade-offs

- Previously accepted loose frontmatter will stop showing directions in Electron. This is intentional native parity, and users can restore directions by using exact native-compatible frontmatter.
- The parser remains deliberately narrow. That avoids accidental divergence from native behavior, but it means richer YAML forms stay unsupported until the native app supports them too.
