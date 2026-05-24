## Scope

Implement Electron project watching and live rebuild refresh behavior while preserving renderer sandboxing.

## Covers

Tasks: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4

Validation Focus: VF-Core-TDD, VF-Electron-TDD, VF-Workspace, VF-OpenSpec, VF-Swift, VF-Evidence

## Plan Type

full

## Execution Strategy

tdd-required

## Ordered Steps

1. Write core watcher tests for output filtering, `.rebuild` priority, structure priority, and CSS/markdown content summaries.
2. Run `npm --prefix packages/wikiwise-core test` and confirm failure due to missing watcher summary exports.
3. Implement watcher classification/coalescing helpers.
4. Run core tests until green.
5. Write Electron structural tests for watcher IPC, preload APIs, event subscription cleanup, main debounce sending, compile refresh flags, renderer watcher startup, tree refresh, and current-page refresh.
6. Run `npm --prefix apps/electron test` and confirm failure due to missing watcher code.
7. Implement main-process watcher lifecycle and summary event sending.
8. Implement compile invalidation and CSS reload flags.
9. Implement preload watcher APIs and event subscription cleanup.
10. Implement renderer watcher startup and project-change handling.
11. Run Electron tests until green.
12. Run `npm test`.
13. Run `openspec validate migrate-electron-live-rebuild-watching --strict`.
14. Confirm `git diff --name-only Sources/Wikiwise` is empty.
15. Write retained verification and mark tasks complete.

## Validation Per Step

1. Tests use synthetic paths and events.
2. RED failure mentions missing watcher summary export.
3. Core helper mirrors native priority and ignores output paths.
4. Core tests pass.
5. Electron tests inspect source without launching Electron.
6. RED failure mentions missing watcher IPC/renderer hooks.
7. Main source has `wikiwise:startProjectWatcher`, `fs.watch`, debounce, and `projectChanged`.
8. Compile path accepts `invalidate` and `reloadCSS`.
9. Preload source exposes `startProjectWatcher`, `stopProjectWatcher`, and `onProjectChanged`.
10. Renderer starts watching after open, handles structure/rebuild/content, reloads selected file when clean, and requests preview refresh.
11. Electron tests pass.
12. Workspace tests pass.
13. OpenSpec validates.
14. Swift source untouched.
15. Verification evidence exists.

## Files / Owners

- `openspec/changes/migrate-electron-live-rebuild-watching/*`
- `packages/wikiwise-core/src/index.js`
- `packages/wikiwise-core/test/watch-events.test.js`
- `apps/electron/src/main/main.js`
- `apps/electron/src/preload/preload.cjs`
- `apps/electron/src/renderer/renderer.js`
- `apps/electron/test/live-rebuild-watching.test.js`

## Completion Checkpoint

Complete when Electron starts a main-owned watcher for opened folders, emits native-priority project-change summaries, renderer refreshes file tree/current markdown/preview for relevant events, all tests and OpenSpec validation pass, and retained evidence records deferred runtime watcher gaps.

## Completion Verification

Write `openspec/changes/migrate-electron-live-rebuild-watching/verification.md` with commands, manual checks, evidence, and residual risks.

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

- Core watcher tests pass.
- Electron watcher tests pass.
- Root npm tests pass.
- OpenSpec strict validation passes.
- Swift source untouched.
- Verification written.

## Delivery Handoff

Background drip compilation, scroll preservation, runtime watcher QA, CodeMirror parity, preview navigation parity, scaffold/new wiki, terminal, publishing, menus, packaging, and final audit remain later phases.

## Execution Notes

This phase builds on archived `migrate-electron-file-editing-save`.

## Manual Adjustments

None.
