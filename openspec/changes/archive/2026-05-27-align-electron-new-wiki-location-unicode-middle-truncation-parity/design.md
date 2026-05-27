## Context

The native app delegates middle truncation to SwiftUI text layout. Electron uses a small helper because CSS does not provide middle ellipsis. The helper should not be treated as an exact pixel-for-pixel text layout replacement, but it must preserve the native-visible invariant that displayed text consists of whole characters.

## Decisions

- Convert the input path to an array of JavaScript iterable characters with `Array.from(pathValue)`.
- Compare the character count against the existing display limit instead of comparing UTF-16 code units.
- Build the shortened value from whole-character slices before and after the ellipsis.
- Keep returning the original path for short values and `…` for maximum lengths of one or less.
- Keep the full path in `title`, `aria-label`, and the create request payload.

## Risks

- SwiftUI truncates based on rendered width, while Electron still uses a fixed character budget. This change narrows a concrete Unicode correctness gap without introducing a larger text measurement system into the dialog.
