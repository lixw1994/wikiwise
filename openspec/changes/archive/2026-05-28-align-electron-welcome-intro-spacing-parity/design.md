## Context

SwiftUI welcome content uses three visual groups inside the centered stack: an intro group (`W` mark plus summary) with 12pt spacing, an action group with 12pt spacing, and a hint below those groups. The outer stack separates the intro group, actions, and hint with 32pt spacing. Electron already has the 32px outer gap and the 12px action gap, but the mark and summary are direct children of `.welcome-content`, so they inherit the 32px outer gap.

## Goals / Non-Goals

**Goals:**
- Match the native 12px spacing between the centered `W` mark and summary copy.
- Preserve the native 32px spacing between the intro group, action group, and hint.
- Preserve existing welcome mark typography/color, summary typography/line spacing, action labels/symbols, toolbar brand, and welcome behavior.
- Keep the change local to renderer markup/CSS and native-shell parity tests.

**Non-Goals:**
- Change native SwiftUI source.
- Change welcome copy text or line breaks.
- Change action button sizes, action symbols, toolbar chrome, or project shell layout.
- Change package, runtime audit, release, or signing workflows.

## Decisions

- Introduce a `.welcome-intro` wrapper around `.welcome-mark` and the welcome summary. This mirrors the native nested `VStack(spacing: 12)` without changing the outer `.welcome-content` grid.
- Style `.welcome-intro` as a centered grid with `gap: 12px`. The existing `.welcome-content` remains `gap: 32px`, keeping native spacing between the intro, actions, and hint.
- Keep `.welcome-panel .summary` unchanged so prior line-height and color parity coverage remains valid.

## Risks / Trade-offs

- The DOM wrapper is a structural change around existing copy. Mitigation: keep IDs/actions untouched, retain text and symbol coverage, and run the full Electron suite plus runtime audit.
