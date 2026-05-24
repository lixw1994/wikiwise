## Scope

Implement the first functional native-parity slice in Electron: open an existing folder/file, scan the project file tree with native-compatible rules, select files, and display their text content.

## Covers

Tasks: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5

Validation Focus: VF-Core-TDD, VF-Electron-TDD, VF-Workspace, VF-OpenSpec, VF-Native, VF-Evidence

## Plan Type

full

## Execution Strategy

tdd-required

## Ordered Steps

1. Write core tests for native-compatible file tree scanning and text reads.
2. Run `npm --prefix packages/wikiwise-core test` and confirm the tests fail because helpers do not exist.
3. Implement helpers in `packages/wikiwise-core/src/index.js`.
4. Run core tests and fix until they pass.
5. Write Electron structural tests for IPC channel names, preload API names, renderer state hooks, and deferred feature copy.
6. Run `npm --prefix apps/electron test` and confirm failure before implementation.
7. Implement main-process IPC handlers and preload bridge APIs.
8. Implement renderer state and UI for welcome/open/tree/selection/content.
9. Run Electron tests and fix until they pass.
10. Run `npm test`.
11. Run `openspec validate migrate-electron-project-lifecycle --strict`.
12. Confirm `git diff --name-only Sources/Wikiwise` is empty.
13. Write retained verification evidence and mark tasks complete.

## Validation Per Step

1. Test file exists and references `scanOneLevel` and `readTextFile`.
2. Failure message identifies missing exports.
3. Implementation returns serializable node objects.
4. Core tests pass.
5. Electron tests inspect source without importing Electron.
6. Failure message identifies missing lifecycle implementation.
7. Main/preload files contain IPC channels and sandbox-safe APIs.
8. Renderer contains project state and UI hooks.
9. Electron tests pass.
10. Workspace tests pass.
11. OpenSpec strict validation passes.
12. No Swift source file is modified.
13. Verification file records commands and gaps.

## Files / Owners

- `openspec/changes/migrate-electron-project-lifecycle/*`
- `packages/wikiwise-core/src/index.js`
- `packages/wikiwise-core/test/file-tree.test.js`
- `apps/electron/src/main/main.js`
- `apps/electron/src/preload/preload.cjs`
- `apps/electron/src/renderer/index.html`
- `apps/electron/src/renderer/renderer.js`
- `apps/electron/src/renderer/styles.css`
- `apps/electron/test/project-lifecycle.test.js`
- `package-lock.json`

## Completion Checkpoint

Complete when tests and OpenSpec validation pass, Electron can open/scan/select files through IPC, no Swift source changes exist, and verification evidence records implemented behavior and deferred gaps.

## Completion Verification

Write `openspec/changes/migrate-electron-project-lifecycle/verification.md` with commands, manual checks, evidence, and residual risks.

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

- Core tests pass.
- Electron tests pass.
- Root npm tests pass.
- OpenSpec strict validation passes.
- Swift source untouched.
- Verification written.

## Delivery Handoff

This phase leaves new wiki scaffolding, compiler/preview, editor save parity, watcher, terminal, publishing, menus, and packaging for later phases.

## Execution Notes

The dependency lockfile was generated while launching the Electron preview app and should be included with this phase.

## Manual Adjustments

None.
