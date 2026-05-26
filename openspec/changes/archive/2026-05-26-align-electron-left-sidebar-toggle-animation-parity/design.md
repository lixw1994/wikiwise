## Context

The native project toolbar restores the left sidebar with `withAnimation(.easeInOut(duration: 0.2))`. The visible split-view effect is the detail area contracting or expanding as the sidebar appears or disappears. Electron already has the correct state transitions and toolbar affordance metadata, but `.project-shell.left-sidebar-hidden` switches to a shorter grid track list, which prevents the layout from interpolating consistently.

## Goals / Non-Goals

**Goals:**
- Animate Electron left-sidebar hide/show layout changes over 200ms ease-in-out.
- Keep left-sidebar visibility state, restore/help labels, native affordance metadata, saved width, file-tree state, detail state, right-sidebar state, terminal state, and resizing behavior unchanged.
- Keep the implementation in renderer CSS because the existing JavaScript already sets the correct final state.

**Non-Goals:**
- Rework left-sidebar state management, file-tree rendering, toolbar command routing, or resize handlers.
- Add JavaScript timers or delayed hidden-state bookkeeping.
- Change right-sidebar behavior beyond preserving the already compatible hidden-right track shape.

## Decisions

- Animate the project shell grid track list.
  Alternative considered: animate the sidebar element itself. The native behavior changes the split-view layout, so transitioning `grid-template-columns` stays closest to the existing shell boundary.
- Keep a zero-width left track when the left sidebar is hidden.
  Alternative considered: keep the existing two-column hidden layout. That final state is visually correct but cannot interpolate from the visible three-column grid. Using `0px minmax(0, 1fr) ...` preserves the logical track list.
- Keep detail and right-sidebar content on logical tracks after the left sidebar is hidden.
  With a zero-width left track, the detail pane remains on column 2 and the right sidebar remains on column 3. This avoids shifting content into different grid columns as a side effect of the animation.
- Reuse `200ms ease-in-out`.
  This maps directly to Swift's `0.2` second ease-in-out animation.

## Risks / Trade-offs

- CSS grid interpolation can be browser-dependent for mismatched track lists -> Mitigation: keep visible and hidden desktop states at compatible track counts.
- Hidden sidebar DOM remains controlled by the existing `hidden` state -> Mitigation: the layout track animates independently while existing hidden state prevents interaction and preserves the current renderer behavior.
- Runtime layout assertions could assume the old two-column hidden grid -> Mitigation: update static parity coverage to prove the same visual behavior is achieved through the native-compatible three-track shape.
