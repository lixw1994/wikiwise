## Context

The native project toolbar right-sidebar control wraps `showRightSidebar.toggle()` in `withAnimation(.easeInOut(duration: 0.2))`, so the detail surface expands or contracts smoothly when the right sidebar is hidden or restored. Electron currently uses `right-sidebar-hidden` to switch the project grid immediately.

## Goals / Non-Goals

**Goals:**
- Animate Electron right-sidebar hide/show layout changes over 200ms ease-in-out.
- Keep the current right-sidebar visibility state, toolbar icon labels, saved sidebar width, terminal state, Info state, and resize behavior unchanged.
- Keep the implementation in renderer CSS because the existing state and DOM updates already represent the correct final states.

**Non-Goals:**
- Rework right-sidebar rendering, terminal lifecycle, Info metadata refresh, or toolbar command routing.
- Add JavaScript timers or delayed hidden-state bookkeeping.
- Change left-sidebar visibility behavior in this slice.

## Decisions

- Add the animation to the project shell grid track transition.
  Alternative considered: animate the right-sidebar element itself. The visible native effect is the detail/sidebar layout expansion, so transitioning the grid columns is the closest existing boundary.
- Keep a zero-width right-sidebar track when the right sidebar is hidden.
  Alternative considered: keep the existing two-column hidden grid. A zero-width third track gives CSS the same track list shape to interpolate from `var(--right-sidebar-width)` to `0px`.
- Use `200ms ease-in-out`.
  This maps directly to Swift's `0.2` second ease-in-out animation.

## Risks / Trade-offs

- CSS grid interpolation can be browser-dependent for mismatched track lists -> Mitigation: keep right-sidebar-visible and right-sidebar-hidden desktop states at compatible track counts.
- The hidden sidebar element remains controlled by existing renderer state -> Mitigation: the layout track animates while existing `hidden` state continues to prevent interaction and terminal/Info behavior remains unchanged.
