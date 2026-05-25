## Context

SwiftUI displays `newWikiLocation?.path ?? "~/wikis"` with `.lineLimit(1)` and `.truncationMode(.middle)`. Electron currently sets the full path directly as text and uses CSS `text-overflow: ellipsis`, which truncates at the end. For long paths, end truncation hides the selected folder name, while the native sheet preserves both ends.

## Goals / Non-Goals

**Goals:**

- Display long new-wiki location paths with a middle ellipsis.
- Preserve the full path for hover/tooling and assistive technologies.
- Keep short paths unchanged.

**Non-Goals:**

- Change the actual selected location value used for wiki creation.
- Change the main-process folder picker or default location behavior.
- Add a general-purpose path rendering framework outside this dialog.

## Decisions

- Add a small renderer helper that returns a display string from the full path. It keeps short paths intact and inserts a single ellipsis in the middle when the path is long enough to need truncation.
- Continue storing `state.newWikiLocation` as the full selected path. Only the label text is shortened.
- Set the location label `title` and `aria-label` to the full path so users can still inspect the complete destination.

## Risks / Trade-offs

- Character-count truncation cannot know the exact rendered pixel width. The helper uses a conservative fixed display budget because the native requirement is to preserve middle-truncation semantics, not pixel-perfect path fitting.
- Tests will assert that the original full path remains available separately from the shortened label, preventing display-only truncation from corrupting create behavior.
