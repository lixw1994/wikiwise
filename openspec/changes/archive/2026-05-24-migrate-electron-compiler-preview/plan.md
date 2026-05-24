## Scope

Implement Node-backed wiki compilation and compiled HTML preview for Electron while preserving renderer sandboxing.

## Covers

Tasks: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4

Validation Focus: VF-Core-TDD, VF-Electron-TDD, VF-Workspace, VF-OpenSpec, VF-Swift, VF-Evidence

## Plan Type

full

## Execution Strategy

tdd-required

## Ordered Steps

1. Write core compiler tests for `slugForPath`, output directory selection, scan, and compile-home behavior.
2. Run `npm --prefix packages/wikiwise-core test` and confirm failure due to missing compiler exports.
3. Implement `WikiCompiler` and supporting bridge/resource functions.
4. Run core tests until green.
5. Write Electron structural tests for compiler IPC, preload APIs, main project open compilation, and renderer preview hooks.
6. Run `npm --prefix apps/electron test` and confirm failure due to missing compiler preview code.
7. Implement main-process compiler lifecycle and file URL conversion.
8. Implement preload compiler APIs.
9. Implement renderer File/Wiki mode and preview iframe.
10. Run Electron tests until green.
11. Run `npm test`.
12. Run `openspec validate migrate-electron-compiler-preview --strict`.
13. Confirm `git diff --name-only Sources/Wikiwise` is empty.
14. Write retained verification and mark tasks complete.

## Validation Per Step

1. Tests create a temporary wiki with `CLAUDE.md`, `wiki/home.md`, `site/build.js`, and `site/style.css`.
2. RED failure mentions missing compiler export.
3. Compiler loads bundled resources and bridge functions.
4. Core tests pass and generated `home.html` contains expected title.
5. Electron tests inspect source without launching Electron.
6. RED failure mentions missing compiler IPC/renderer hooks.
7. Main source has `wikiwise:compilePage` and `pathToFileURL`.
8. Preload source exposes `compilePage`.
9. Renderer source has `detailMode`, `renderPreview`, and `preview-frame`.
10. Electron tests pass.
11. Workspace tests pass.
12. OpenSpec validates.
13. Swift source untouched.
14. Verification evidence exists.

## Files / Owners

- `openspec/changes/migrate-electron-compiler-preview/*`
- `packages/wikiwise-core/src/index.js`
- `packages/wikiwise-core/test/compiler.test.js`
- `apps/electron/src/main/main.js`
- `apps/electron/src/preload/preload.cjs`
- `apps/electron/src/renderer/index.html`
- `apps/electron/src/renderer/renderer.js`
- `apps/electron/src/renderer/styles.css`
- `apps/electron/test/compiler-preview.test.js`

## Completion Checkpoint

Complete when Electron can compile a wiki page through main/core APIs, renderer can switch between File and Wiki preview modes, all tests and OpenSpec validation pass, and retained evidence records deferred preview parity gaps.

## Completion Verification

Write `openspec/changes/migrate-electron-compiler-preview/verification.md` with commands, manual checks, evidence, and residual risks.

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

- Core compiler tests pass.
- Electron compiler preview tests pass.
- Root npm tests pass.
- OpenSpec strict validation passes.
- Swift source untouched.
- Verification written.

## Delivery Handoff

Live rebuild, editor save integration, preview navigation/scroll parity, maps polish, terminal, publishing, and packaging remain later phases.

## Execution Notes

This phase builds on archived `migrate-electron-project-lifecycle`.
Native `build.js` includes root-level markdown such as `CLAUDE.md` in
`scanPages()`, so the compiler fixture expects three scanned pages:
`CLAUDE.md`, `wiki/home.md`, and `wiki/Second Page.md`.

## Manual Adjustments

None.
