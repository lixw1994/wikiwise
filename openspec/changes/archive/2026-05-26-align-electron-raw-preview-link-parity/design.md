## Context

Native preview navigation derives a link slug from the target HTML filename, searches only immediate markdown files in `wiki/`, `raw/`, and the project root by last filename slug, and only then falls back to compiled HTML output. Raw markdown files compile with a `raw-` namespace, so native clicks on `raw-*.html` fall through to generated HTML instead of selecting `raw/*.md`.

Electron currently keeps the same raw compilation namespace, but its preview markdown lookup also compares against the compiler slug helper. That lets `raw/foo.md` match `raw-foo.html`, selecting the raw markdown source where native shows compiled raw output.

## Goals / Non-Goals

**Goals:**

- Make Electron preview-link resolution match native Swift behavior for raw generated HTML links.
- Preserve raw markdown compilation and direct raw file selection behavior.
- Add source-level regression coverage that makes the Swift/Electron resolver contract explicit.

**Non-Goals:**

- Change compiler slug generation or raw-page output filenames.
- Change renderer history semantics beyond the existing generated-page path.
- Add new runtime audit coverage for this narrow resolver branch.

## Decisions

- Match Swift lookup semantics in `findMarkdownFileForSlug` by comparing only the filename-derived markdown slug. Alternative considered: special-case `raw-` links before markdown lookup. That would fix this symptom, but it would encode generated-page knowledge in a generic markdown search helper instead of matching the native helper directly.
- Leave `compileMarkdownFile` on `slugForPath`. Directly selecting a raw markdown file should still compile to `raw-foo.html`, matching the existing compiler contract and bundled `build.js` behavior.
- Add the regression to `preview-navigation-map-graph.test.js`, where related preview navigation parity tests already live.

## Risks / Trade-offs

- Raw files with hand-authored `foo.html` links can still be selected through the app resolver, because native also compares raw filenames without the `raw-` prefix. This is intentional parity rather than a new routing policy.
- The regression is source-level rather than a full Electron runtime test. Existing runtime coverage already audits local preview navigation and generated-page routing; this slice protects the resolver branch with a focused test.
