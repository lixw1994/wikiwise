## Scope

Implement editable File mode and sandboxed save flow for Electron, including markdown save recompilation and preview refresh.

## Covers

Tasks: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4

Validation Focus: VF-Core-TDD, VF-Electron-TDD, VF-Workspace, VF-OpenSpec, VF-Swift, VF-Evidence

## Plan Type

full

## Execution Strategy

tdd-required

## Ordered Steps

1. Write core write tests for `writeTextFile` and `writeActiveFile`.
2. Run `npm --prefix packages/wikiwise-core test` and confirm failure due to missing write exports.
3. Implement core write helpers.
4. Run core tests until green.
5. Write Electron structural tests for save IPC, preload API, path safety, renderer edit/save state, keyboard/debounce save, and preview refresh.
6. Run `npm --prefix apps/electron test` and confirm failure due to missing save/editing code.
7. Implement main-process save lifecycle and path safety.
8. Implement preload save API.
9. Implement renderer editable source mode and save controls.
10. Run Electron tests until green.
11. Run `npm test`.
12. Run `openspec validate migrate-electron-file-editing-save --strict`.
13. Confirm `git diff --name-only Sources/Wikiwise` is empty.
14. Write retained verification and mark tasks complete.

## Validation Per Step

1. Tests write temporary UTF-8 content and `.claude/active-file`.
2. RED failure mentions missing write export.
3. Core writes parent directories where needed and returns serializable results.
4. Core tests pass.
5. Electron tests inspect source without launching Electron.
6. RED failure mentions missing save IPC/renderer hooks.
7. Main source has `wikiwise:saveFile`, `assertProjectPath`, `writeTextFile`, and markdown recompile.
8. Preload source exposes `saveFile`.
9. Renderer source has `source-editor`, `isDirty`, `saveSelectedFile`, keyboard save, debounce save, and preview refresh.
10. Electron tests pass.
11. Workspace tests pass.
12. OpenSpec validates.
13. Swift source untouched.
14. Verification evidence exists.

## Files / Owners

- `openspec/changes/migrate-electron-file-editing-save/*`
- `packages/wikiwise-core/src/index.js`
- `packages/wikiwise-core/test/file-write.test.js`
- `apps/electron/src/main/main.js`
- `apps/electron/src/preload/preload.cjs`
- `apps/electron/src/renderer/index.html`
- `apps/electron/src/renderer/renderer.js`
- `apps/electron/src/renderer/styles.css`
- `apps/electron/test/file-editing-save.test.js`

## Completion Checkpoint

Complete when Electron can edit and save selected text files through main/core APIs, saved markdown recompiles and refreshes Wiki preview state, all tests and OpenSpec validation pass, and retained evidence records deferred native editor fidelity gaps.

## Completion Verification

Write `openspec/changes/migrate-electron-file-editing-save/verification.md` with commands, manual checks, evidence, and residual risks.

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

- Core write tests pass.
- Electron file editing/save tests pass.
- Root npm tests pass.
- OpenSpec strict validation passes.
- Swift source untouched.
- Verification written.

## Delivery Handoff

Full CodeMirror parity, scroll preservation, watcher/live rebuild, preview navigation parity, scaffold/new wiki, terminal, publishing, menus, packaging, and final audit remain later phases.

## Execution Notes

This phase builds on archived `migrate-electron-compiler-preview`.

## Manual Adjustments

None.
