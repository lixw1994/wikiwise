## Context

The native publish helper filters a Swift `String` and then calls `.prefix(20)`, which counts Swift characters. JavaScript string `.slice(0, 20)` counts UTF-16 code units, so a wiki name made from retained supplementary-plane letters can produce only ten visible characters before the suffix instead of the native twenty.

## Decisions

- Keep the current native filter parity: lowercase, replace literal spaces with hyphens, keep Unicode letters, Unicode numbers, and hyphen.
- Build the truncated slug from `Array.from(sanitized).slice(0, 20).join("")` so retained supplementary-plane characters count as one prefix element.
- Leave the six-character random suffix and empty-slug behavior unchanged.
- Retain source-level tests that verify native `Publisher.randomSubdomain(wikiName:)` still uses `.prefix(20)` and shared core code still uses iterable character truncation.

## Risks

- Swift `Character` can model some extended grapheme clusters more richly than JavaScript code point iteration. The retained publish filter removes marks outside the native letter/number/hyphen set, so code point iteration is the closest practical parity layer without adding a larger Unicode segmentation dependency.
