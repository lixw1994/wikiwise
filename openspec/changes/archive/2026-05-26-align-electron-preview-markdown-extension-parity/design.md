## Context

Swift `findMarkdownFile(slug:in:)` searches immediate files in `wiki/`, `raw/`, and the project root with `file.pathExtension == "md"`. That check is case-sensitive. Electron `findMarkdownFileForSlug` currently uses the broader `isMarkdownFile` helper, which is case-insensitive and is also used by direct file selection, editing, and compilation paths.

This creates a narrow preview-navigation mismatch: a generated local link can select `Foo.MD` in Electron, while native preview navigation would not use that uppercase-extension file as a markdown-backed source and would instead continue to generated output handling.

## Goals / Non-Goals

**Goals:**

- Match native preview markdown-source candidate filtering for extension case.
- Preserve broader case-insensitive markdown support outside preview back-mapping.
- Keep raw generated-page and target slug normalization parity intact.

**Non-Goals:**

- Change file-tree visibility, direct file open behavior, save behavior, or compiler slug behavior for uppercase markdown extensions.
- Change renderer history, iframe interception, or generated-page routing semantics.

## Decisions

- Add a preview-lookup-local candidate predicate instead of changing the global `isMarkdownFile` helper. This keeps direct file workflows compatible while aligning the native preview resolver.
- Keep the candidate search directories and slug comparison unchanged. The only mismatch is whether uppercase markdown extensions are eligible in this resolver branch.
- Cover this with a focused source-level regression in `preview-navigation-map-graph.test.js`, next to the raw-link and target-slug resolver tests.

## Risks / Trade-offs

- Users can still directly open and compile uppercase markdown files in Electron. That matches the broader app behavior and avoids introducing a migration-wide extension policy change.
- Preview navigation for uppercase-extension source files may display generated output instead of selecting the source, but this is the native behavior being matched.
