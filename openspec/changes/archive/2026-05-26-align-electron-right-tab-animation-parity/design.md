## Context

The SwiftUI right sidebar uses a compact INFO/TERMINAL pill switcher. Its tab button action wraps `activeTab = tab` in `withAnimation(.easeInOut(duration: 0.15))`, so the active pill color/shadow change is eased instead of instant. Electron already matches the layout, colors, default tab, selected state, panel switching, and resize behavior, but `.right-tab` has no transition.

## Goals / Non-Goals

**Goals:**
- Match the native 150ms ease-in-out tab state transition for Electron right-sidebar tabs.
- Keep the existing right-sidebar DOM, state model, terminal lifecycle, and resize behavior unchanged.
- Add regression coverage that references both the Swift animation source and the Electron CSS.

**Non-Goals:**
- Rework the right-sidebar tab markup or panel switching logic.
- Animate panel opacity/content changes.
- Change terminal startup, INFO metadata refresh, or sidebar sizing behavior.

## Decisions

- Add the animation as CSS on `.right-tab`.
  Alternative considered: animate in JavaScript from `setRightSidebarTab`. CSS is simpler, declarative, and keeps interaction logic unchanged.
- Transition only the visible active-state properties: background color, text color, and shadow.
  Alternative considered: transition all properties. Explicit properties avoid accidental layout or padding animation.
- Use `150ms ease-in-out`.
  This mirrors Swift's `0.15` second ease-in-out animation and keeps the timing close to native.

## Risks / Trade-offs

- CSS easing is not pixel-identical to SwiftUI's animation curve -> Mitigation: use the same duration and standard ease-in-out curve while preserving the current native-matched static end states.
- Transition support varies only in very old browsers -> Mitigation: Electron supports CSS transitions; if unsupported, the final state remains correct.
