## Context

Swift `handleWikilink(_:)` calls `slug(for:)` on the clicked HTML URL before markdown lookup or generated-page fallback. That helper removes the extension, lowercases the filename, and replaces spaces with hyphens.

Electron `resolvePreviewNavigation` currently derives `pageSlug` by lowercasing the clicked HTML filename only. A link target such as `My Page.html` therefore becomes `my page`, while the markdown lookup helper expects `my-page`. Native resolves that link to `My Page.md`; Electron can fail to resolve it.

## Goals / Non-Goals

**Goals:**

- Match native local preview target slug derivation for filenames containing spaces.
- Preserve the existing routing order: external links, same file-scheme target handling, markdown lookup, then generated output fallback.
- Keep raw generated-page behavior from the previous parity slice intact.

**Non-Goals:**

- Change compiler slug generation, wikilink output, or generated HTML filenames.
- Change renderer iframe interception or app history semantics.
- Add a new runtime audit scenario for this narrow source-level resolver correction.

## Decisions

- Reuse the existing JavaScript filename slug helper for clicked HTML target paths. This mirrors Swift `slug(for:)` directly because both source and target filenames need the same lowercase/space-to-hyphen transformation.
- Keep `findMarkdownFileForSlug` unchanged. The mismatch is in target slug derivation, not in the markdown lookup order.
- Cover the behavior in `preview-navigation-map-graph.test.js`, alongside the neighboring preview navigation resolver parity tests.

## Risks / Trade-offs

- Links with literal spaces in filenames are uncommon because generated wikilinks already use hyphenated slugs, but native still supports the broader filename form. The regression keeps Electron aligned for hand-authored local HTML links and future output variants.
- The test is source-level. That is enough for this resolver branch because runtime audit already covers the broader local preview navigation path.
