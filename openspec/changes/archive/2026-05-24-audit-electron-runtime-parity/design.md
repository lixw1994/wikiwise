## Context

Previous Electron migration phases verified most behavior through source-level Node tests and generated a local macOS app bundle. The remaining roadmap explicitly calls out live runtime visual checks before final parity can be claimed. The repository does not yet have a repeatable command that launches Electron, loads the actual renderer/preload pair, and records visual/DOM evidence for the native shell states.

## Goals / Non-Goals

**Goals:**

- Add a dependency-light runtime audit command that uses the installed Electron runtime.
- Load the real Electron renderer HTML and preload bridge in a BrowserWindow.
- Capture screenshots and DOM evidence for `welcome-light`, `welcome-dark`, `project-light`, and `project-dark`.
- Use a real scaffold-style Wikiwise project for the project-state audit.
- Write artifacts under ignored `apps/electron/out/runtime-audit/`.
- Fail fast when expected product copy, project chrome, debug-panel removal, viewport dimensions, or screenshot nonblank checks are missing.
- Document the audit workflow in the Electron README.

**Non-Goals:**

- Do not add Playwright, Puppeteer, Electron Forge, or other new dependencies.
- Do not replace the existing structural Electron tests.
- Do not perform human visual approval automatically; the audit preserves artifacts for review.
- Do not change SwiftUI source behavior.
- Do not sign, notarize, staple, or build a DMG in this phase.
- Do not claim final migration completion.

## Decisions

1. **Use an Electron-owned audit script.** `scripts/audit-electron-runtime.mjs` will be executed by Electron, not plain Node, so it can create BrowserWindow instances and call `capturePage()`. Alternative: use a browser-only file URL check. I am avoiding that because the renderer depends on the preload bridge and app IPC shape.

2. **Stub production IPC for audit scenarios.** The script will register a minimal set of `wikiwise:*` handlers needed by renderer boot, restore, project services, document info, publishing status, and terminal output. The project scenario will use `@wikiwise/core` to create and compile a temporary scaffold wiki. Alternative: import the production main process directly. I am avoiding that because the main process auto-creates a window and owns app lifecycle, which makes focused scenario capture harder.

3. **Capture both DOM and pixels.** The JSON report will include title/text/state evidence, viewport measurements, and screenshot statistics. PNG files provide manual review artifacts. Alternative: rely only on screenshots. I am keeping DOM checks because they make the command fail deterministically when essential parity markers disappear.

4. **Keep artifacts local and ignored.** Generated screenshots, sample projects, and reports stay under `apps/electron/out/runtime-audit/`, matching the existing local packaging output pattern.

## Risks / Trade-offs

- **Offscreen rendering can differ from a visible user window** -> Treat this as repeatable runtime evidence, and keep final human/manual review as a later acceptance gate.
- **IPC stubs can drift from production handlers** -> Register only renderer-boot handlers and assert against visible app state; production behavior remains covered by existing IPC tests.
- **Screenshot checks can be too weak to prove pixel-perfect parity** -> Use them to catch blank/broken windows and preserve artifacts for review, not to claim final parity by themselves.
- **Electron may require a GUI-capable environment** -> The command is documented as a local runtime audit and writes clear failure output when Electron cannot launch.

## Migration Plan

1. Add failing structural tests for package scripts, audit script behavior, scenario coverage, report output, and README documentation.
2. Implement `scripts/audit-electron-runtime.mjs`.
3. Add root and Electron package audit scripts.
4. Update the Electron README with runtime audit instructions and remove stale shared-resource wording.
5. Run Electron tests, the runtime audit command, root tests, OpenSpec validation, Swift build, and whitespace checks.
