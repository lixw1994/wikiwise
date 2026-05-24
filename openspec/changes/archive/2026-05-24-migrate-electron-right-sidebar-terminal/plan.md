## Scope

Implement Electron right sidebar INFO/TERMINAL behavior while keeping filesystem and shell access in main/preload.

## Covers

Tasks: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5

Validation Focus: VF-Core-TDD, VF-Electron-TDD, VF-Workspace, VF-OpenSpec, VF-Swift, VF-Evidence

## Plan Type

full

## Execution Strategy

tdd-required

## Ordered Steps

1. Write core document info tests for directions, wikilinks, word count, modified timestamp, and missing-file rejection.
2. Run `npm --prefix packages/wikiwise-core test` and confirm failure due to missing document info export.
3. Implement document info helpers.
4. Run core tests until green.
5. Write Electron structural tests for right sidebar/terminal IPC/preload/renderer behavior.
6. Run `npm --prefix apps/electron test` and confirm failure due to missing sidebar/terminal code.
7. Implement main-process document info IPC and safe path validation.
8. Implement main-process terminal lifecycle and cleanup.
9. Implement preload document info/terminal APIs and output subscription cleanup.
10. Implement renderer right sidebar tabs, info refresh, terminal transcript/input, and project-service startup.
11. Update renderer HTML/CSS.
12. Run Electron tests until green.
13. Run `npm test`.
14. Run `openspec validate migrate-electron-right-sidebar-terminal --strict`.
15. Confirm `git diff --name-only Sources/Wikiwise` is empty and run `swift build`.
16. Run `git diff --check`.
17. Write retained verification and mark tasks complete.

## Validation Per Step

1. Tests use temporary markdown files with deterministic mtime.
2. RED failure mentions missing document info export.
3. Core helper mirrors native INFO parsing.
4. Core tests pass.
5. Electron tests inspect source without launching Electron.
6. RED failure mentions missing sidebar/terminal IPC and renderer hooks.
7. Main source has `wikiwise:getDocumentInfo` and path validation.
8. Main source has terminal session map, `child_process.spawn`, start/input/stop IPC, output events, and cleanup.
9. Preload exposes document info and terminal APIs with listener cleanup.
10. Renderer has `rightSidebarTab`, `documentInfo`, `terminalTranscript`, `startProjectServices`, INFO refresh, and terminal input.
11. HTML/CSS contain right sidebar, INFO, and TERMINAL surfaces.
12. Electron tests pass.
13. Workspace tests pass.
14. OpenSpec validates.
15. Swift source untouched and Swift build passes.
16. Diff check passes.
17. Verification evidence exists.

## Files / Owners

- `openspec/changes/migrate-electron-right-sidebar-terminal/*`
- `packages/wikiwise-core/src/index.js`
- `packages/wikiwise-core/test/document-info.test.js`
- `apps/electron/src/main/main.js`
- `apps/electron/src/preload/preload.cjs`
- `apps/electron/src/renderer/index.html`
- `apps/electron/src/renderer/renderer.js`
- `apps/electron/src/renderer/styles.css`
- `apps/electron/test/right-sidebar-terminal.test.js`

## Completion Checkpoint

Complete when Electron has a right sidebar with INFO and TERMINAL tabs, INFO reflects the selected markdown document, terminal starts in the project root and exchanges input/output through main/preload, all tests/OpenSpec checks pass, and retained evidence records PTY/app chrome gaps.

## Completion Verification

Write `openspec/changes/migrate-electron-right-sidebar-terminal/verification.md` with commands, manual checks, evidence, and residual risks.

## Debugging Trail

Not active.

## Review Follow-Up

No external findings.

## Delegation Units

Not active.

## Parallel Units

Not active.

## Isolation Boundaries

Not active.

## Worktree Units

Not active.

## Isolation Reason

Same-tree execution is sufficient.

## Integration Owner

Main agent.

## Finish Checklist

- Core document info tests pass.
- Electron sidebar/terminal tests pass.
- Root npm tests pass.
- OpenSpec strict validation passes before and after archive.
- Swift source untouched and Swift build passes.
- Verification written.

## Delivery Handoff

PTY-grade terminal emulation, ANSI rendering, terminal resizing, right-sidebar drag resize, toolbar show/hide, publishing, menus, packaging, and final parity audit remain later phases.

## Execution Notes

This phase builds on archived `migrate-electron-new-wiki-scaffold`.

## Manual Adjustments

None.
