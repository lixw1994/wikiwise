## Context

The native macOS app declares its window geometry in two SwiftUI places: `WikiwiseApp` sets `.defaultSize(width: 1500, height: 1000)`, and `ContentView` sets `.frame(minWidth: 800, minHeight: 500)`. Electron currently hard-codes different values in the main process and the runtime audit captures screenshots at that smaller Electron size, so the audit cannot catch a first-window-size drift from native behavior.

## Goals / Non-Goals

**Goals:**
- Make the Electron app open with the same default window dimensions as the SwiftUI app.
- Make Electron minimum window constraints match the native content minimum.
- Make runtime audit screenshots and report metadata use the same native default viewport.
- Guard those values with source-level tests so later UI work does not silently reintroduce drift.

**Non-Goals:**
- Change renderer layout, sidebar widths, or responsive breakpoints beyond what is needed to pass the native-size runtime audit.
- Add a shared runtime config package for geometry constants.
- Claim final migration completion or signed/notarized release completion.

## Decisions

- Keep geometry constants in the Electron main process near other app-shell constants.
  - Rationale: `BrowserWindow` owns the actual window contract, and explicit names make the native source mapping easy to inspect.
  - Alternative considered: inline the numeric values in `createMainWindow`; rejected because the current drift came from anonymous literals.

- Keep the runtime audit viewport as an explicit native viewport constant in `scripts/audit-electron-runtime.mjs`.
  - Rationale: the audit runs outside the packaged app and already owns its BrowserWindow setup; duplicating the two visible native values is simpler than introducing a shared module boundary only for test constants.
  - Alternative considered: importing constants from Electron main code; rejected because the main process file performs Electron app setup and IPC registration that is not a clean import target for a script-level contract test.

- Use source-inspection tests for the geometry contract.
  - Rationale: the existing Electron parity tests already inspect checked-in main, renderer, and audit sources for user-visible shell contracts. This keeps the test lightweight and independent of a graphical environment.
  - Alternative considered: only relying on the runtime audit report; rejected because a source test can fail faster and makes the native numbers explicit during normal `npm test`.

## Risks / Trade-offs

- Larger audit viewport can expose layout issues hidden at 1180x780 → run the runtime audit after the implementation and treat any failures as real parity defects.
- Larger default Electron window may feel different on small displays → native SwiftUI already declares this default, and Electron minimum constraints still allow resizing down to the native 800x500 floor.
- Duplicated native geometry numbers can drift again → tests assert both the app-window constants and the audit viewport values.
