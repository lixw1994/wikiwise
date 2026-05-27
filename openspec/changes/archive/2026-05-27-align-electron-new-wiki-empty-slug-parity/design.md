## Context

The native create-new-wiki flow has one validation gate before scaffolding: `newWikiName.trimmingCharacters(in: .whitespaces)` must be non-empty. There is no second guard after slug filtering. When every non-whitespace character is filtered out, the native target URL is the selected location plus an empty path component.

## Decisions

- Keep `slugForWikiName` unchanged: names such as `!!!` still return an empty string.
- Remove the extra shared-core empty-slug rejection in `createWikiScaffold`.
- Let `path.join(parentDir, slug)` produce the chosen parent directory when `slug` is empty, matching the native call shape.
- Keep the existing empty trimmed-name rejection so whitespace-only names still fail before writing.
- Add source-alignment coverage proving native has no post-filter slug guard and Electron shared core no longer adds one.

## Risks

- This preserves native behavior even though scaffolding directly into the chosen location can be surprising for punctuation-only names. The migration goal prioritizes identical native behavior.
