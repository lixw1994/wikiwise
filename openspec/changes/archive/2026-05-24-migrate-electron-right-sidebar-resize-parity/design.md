## Context

SwiftUI `RightSidebar` overlays a clear 5px drag handle on the left edge. Dragging uses the start width minus horizontal translation, clamps to at least 200px, and the parent clamps the width to half of the current window. The Electron app already has right-sidebar tabs and an xterm-backed terminal, but the layout uses a fixed `360px` third grid column.

## Goals / Non-Goals

**Goals:**
- Add pointer-driven resize behavior for the Electron right sidebar.
- Match native constraints: default 360px, min 200px, max half viewport.
- Keep right-sidebar toggle behavior intact.
- Refit xterm and send resize IPC after sidebar width changes.
- Add runtime evidence for resized width and terminal resize after drag.

**Non-Goals:**
- Persist sidebar width across launches; native code keeps it as window state.
- Add left-sidebar resize parity in this phase.
- Change terminal PTY behavior beyond refitting after sidebar resize.

## Decisions

1. Store sidebar width in renderer state and CSS custom property.

   `state.rightSidebarWidth` mirrors the SwiftUI `@State` value. The project shell uses `--right-sidebar-width` in `grid-template-columns`, so updates are isolated to layout styling and do not require rebuilding the DOM.

2. Use pointer events on a dedicated handle element.

   Pointer capture provides mouse/trackpad drag behavior without global document listeners leaking after drag. The handle lives inside the right sidebar, matching the native overlay-on-left-edge structure.

3. Clamp width from the project shell viewport.

   Width uses `Math.min(Math.max(width, 200), project.clientWidth / 2)`. This matches the Swift parent binding that clamps to half of the available geometry.

4. Refit terminal after layout updates.

   The existing xterm fit addon and `resizeTerminal()` path already know how to send PTY resize IPC. Sidebar resize will schedule a fit after the CSS variable updates, then runtime audit can assert terminal resize evidence.

## Risks / Trade-offs

- [Risk] Drag state could remain stuck if pointer capture is lost. → Listen for `pointerup`, `pointercancel`, and release capture defensively.
- [Risk] Width changes could produce text overlap in narrow windows. → Keep min width at native 200px and max at half viewport.
- [Risk] xterm fit can run before layout settles. → Use `requestAnimationFrame` after width updates.

## Migration Plan

1. Add tests for handle markup, CSS variable layout, renderer drag state, clamp logic, and runtime audit evidence.
2. Implement right-sidebar width state, pointer handlers, CSS variable, and handle styling.
3. Extend runtime audit to simulate a drag and capture resized width.
4. Run focused and full verification, archive the OpenSpec change, and commit.

Rollback is limited to removing the handle, width state, and CSS variable; the fixed 360px sidebar behavior would return.

## Open Questions

None for this phase.
