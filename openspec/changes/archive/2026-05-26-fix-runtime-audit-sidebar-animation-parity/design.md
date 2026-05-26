## Context

Recent parity slices aligned Electron sidebar visibility toggles with SwiftUI `withAnimation(.easeInOut(duration: 0.2))` by adding `transition: grid-template-columns 200ms ease-in-out` to `.project-shell`. That is correct for toolbar hide/show toggles, but it unintentionally affects drag-resize, where native SwiftUI updates the split width directly as the drag moves.

Runtime audit also executes the left-sidebar hide/restore clicks and immediately captures layout evidence inside the same browser evaluation. With the intentional 200ms transition, the sidebar `hidden` state changes immediately but the detail column width and title transform are still animating when measured.

## Goals / Non-Goals

**Goals:**

- Preserve `grid-template-columns 200ms ease-in-out` for toolbar visibility toggles.
- Disable the project-shell grid transition while `body.resizing-left-sidebar` or `body.resizing-right-sidebar` is present.
- Ensure runtime audit waits slightly longer than the native 200ms visibility animation before measuring hidden and restored layout evidence.
- Keep right-sidebar terminal refit evidence intact after resize.

**Non-Goals:**

- Changing left/right sidebar width constraints.
- Changing native visibility animation timing.
- Changing toolbar labels, symbols, or selected state.
- Changing terminal behavior outside the existing resize refit path.

## Decisions

- Add a CSS override for `body.resizing-left-sidebar .project-shell` and `body.resizing-right-sidebar .project-shell` with `transition: none`. This scopes immediate layout updates to active drag gestures while leaving toolbar hide/show animation untouched.
- Add a small `waitForAnimationFrame`/delay helper inside the runtime audit browser evaluation for left-sidebar visibility evidence and wait 240ms after each click. The margin is intentionally above 200ms to let Chromium finish style/layout updates before measurements.
- Cover the source behavior with tests that assert the transition bypass CSS and audit wait calls are present.

## Risks / Trade-offs

- Runtime audit takes a little longer in project scenarios because it waits for the real animation before measuring. This is acceptable because release evidence should measure settled UI, not an animation midpoint.
- Disabling transition while dragging makes resize feel more direct. That is the intended native split-view interaction.
