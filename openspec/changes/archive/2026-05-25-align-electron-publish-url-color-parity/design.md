## Context

`Sources/Wikiwise/ContentView.swift` renders `https://` and `.wiki-wise.com` with `.foregroundStyle(.secondary)` inside the publish URL row. The editable `TextField` has the same 13pt monospaced font but does not apply secondary foreground styling. Electron currently models the row with plain spans and a row-level color, so the fixed URL affixes are not independently tied to the native secondary treatment.

## Goals / Non-Goals

**Goals:**

- Match the native color hierarchy in Electron: fixed URL affixes are secondary, while the editable subdomain field remains primary.
- Keep URL row layout, typography, padding, background, availability indicator, and behavior unchanged.
- Keep the change scoped to the publish dialog URL row.

**Non-Goals:**

- Changing the publish URL row font size, spacing, columns, or chrome.
- Changing availability indicator colors or availability hint text colors.
- Changing publish dialog copy or publish state behavior.

## Decisions

- Add a dedicated class to the `https://` and `.wiki-wise.com` spans. This mirrors the native separation between fixed Text views and the editable TextField.
- Style the affix class with `var(--color-muted-text)`, the Electron token already used for secondary publish copy and related muted text.
- Make the subdomain input color explicit with `var(--color-tab-active)` in `.publish-subdomain`, matching the native field's non-secondary foreground and preventing row-level styling from accidentally muting the editable value.
- Cover the change with a source parity test that verifies the native affixes use `.foregroundStyle(.secondary)`, the native TextField does not, the Electron spans have the affix class, and the CSS preserves primary input color.

## Risks / Trade-offs

- The URL affixes become slightly more subdued than the current row-level linked color. That is intentional because native marks those fixed text segments as secondary while keeping the editable value visually primary.
