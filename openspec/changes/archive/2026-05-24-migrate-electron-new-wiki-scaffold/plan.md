## Scope

Implement Electron new-wiki scaffold creation while preserving renderer sandboxing and native-parity scaffold output.

## Covers

Tasks: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5

Validation Focus: VF-Core-TDD, VF-Electron-TDD, VF-Workspace, VF-OpenSpec, VF-Swift, VF-Evidence

## Plan Type

full

## Execution Strategy

tdd-required

## Ordered Steps

1. Write core scaffold tests for slugging, directory creation, template replacement, settings, version marker, `.gitignore`, skills, and build-tool copying.
2. Run `npm --prefix packages/wikiwise-core test` and confirm failure due to missing scaffold exports.
3. Implement `slugForWikiName` and `createWikiScaffold` in `@wikiwise/core`.
4. Run core tests until green.
5. Write Electron structural tests for default location, choose-location IPC, create-new-wiki IPC, preload APIs, renderer dialog state, post-create guide, and created project opening.
6. Run `npm --prefix apps/electron test` and confirm failure due to missing scaffold UI/IPC.
7. Implement main-process default location, location picker, create-new-wiki IPC, and created project result wiring.
8. Implement preload scaffold APIs.
9. Implement renderer dialog state, choose-location, create flow, post-create guide, and guide dismissal.
10. Update HTML/CSS for modal dialog and guide surface.
11. Run Electron tests until green.
12. Run `npm test`.
13. Run `openspec validate migrate-electron-new-wiki-scaffold --strict`.
14. Confirm `git diff --name-only Sources/Wikiwise` is empty and run `swift build`.
15. Run `git diff --check`.
16. Write retained verification and mark tasks complete.

## Validation Per Step

1. Tests use a temp directory and deterministic `createdDate`.
2. RED failure mentions missing scaffold helper exports.
3. Core helper mirrors native scaffold file layout and resource copying.
4. Core tests pass.
5. Electron tests inspect source without launching Electron.
6. RED failure mentions missing new-wiki IPC/preload/renderer hooks.
7. Main source has `wikiwise:getDefaultWikiLocation`, `wikiwise:chooseNewWikiLocation`, `wikiwise:createNewWiki`, `dialog.showOpenDialog`, `createDirectory`, and `createProjectResult`.
8. Preload source exposes `getDefaultWikiLocation`, `chooseNewWikiLocation`, and `createNewWiki`.
9. Renderer has dialog state, validation, create flow, project opening, watcher startup, post-create guide, and guide dismissal.
10. HTML/CSS contain dialog and guide elements without deferred phase note copy.
11. Electron tests pass.
12. Workspace tests pass.
13. OpenSpec validates.
14. Swift source untouched and Swift build passes.
15. Diff check passes.
16. Verification evidence exists.

## Files / Owners

- `openspec/changes/migrate-electron-new-wiki-scaffold/*`
- `packages/wikiwise-core/src/index.js`
- `packages/wikiwise-core/test/scaffold.test.js`
- `apps/electron/src/main/main.js`
- `apps/electron/src/preload/preload.cjs`
- `apps/electron/src/renderer/index.html`
- `apps/electron/src/renderer/renderer.js`
- `apps/electron/src/renderer/styles.css`
- `apps/electron/test/new-wiki-scaffold.test.js`

## Completion Checkpoint

Complete when Electron can create a native-shaped scaffolded wiki from the welcome screen, open it as the current project, start watching it, compile/select `wiki/home.md`, show and dismiss the post-create guide, and all retained validation passes.

## Completion Verification

Write `openspec/changes/migrate-electron-new-wiki-scaffold/verification.md` with commands, manual checks, evidence, and residual risks.

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

- Core scaffold tests pass.
- Electron scaffold tests pass.
- Root npm tests pass.
- OpenSpec strict validation passes before and after archive.
- Swift source untouched and Swift build passes.
- Verification written.

## Delivery Handoff

Built-in terminal, publishing setup, last-folder persistence, CodeMirror parity, menus, packaging, and final runtime packaged-app QA remain later phases.

## Execution Notes

This phase builds on archived `migrate-electron-live-rebuild-watching`.

## Manual Adjustments

None.
