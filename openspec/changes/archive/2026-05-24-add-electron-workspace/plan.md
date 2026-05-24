## Scope

Implement the first OpenSpec-driven Electron workspace slice: root npm workspace metadata, `packages/wikiwise-core`, `apps/electron`, documentation, and retained verification evidence.

## Covers

Tasks: 1.1, 1.2, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4

Validation Focus: VF-OpenSpec, VF-Core, VF-Workspace, VF-Swift, VF-Evidence

## Plan Type

full

## Execution Strategy

tdd-required

## Ordered Steps

1. Complete OpenSpec artifacts and remove the old `docs/superpowers` planning artifact.
2. Preserve the existing failing `packages/wikiwise-core/test/resource-paths.test.js` as the RED test for `@wikiwise/core`.
3. Add root `package.json`, `.gitignore` npm outputs, `packages/wikiwise-core/package.json`, and `packages/wikiwise-core/src/index.js`.
4. Run `npm --prefix packages/wikiwise-core test` and fix core implementation until it passes.
5. Add `apps/electron/package.json` and `apps/electron/test/shell-files.test.js` before adding shell implementation files.
6. Run `npm --prefix apps/electron test` and confirm it fails because shell files are missing.
7. Add Electron main, CommonJS preload, renderer HTML, renderer JavaScript, renderer CSS, and app README.
8. Run `npm --prefix apps/electron test` and root `npm test` until both pass without Electron dependency installation.
9. Update root README with the cross-platform workspace note.
10. Run `openspec validate add-electron-workspace --strict`.
11. Run `swift build`.
12. Write `openspec/changes/add-electron-workspace/verification.md` with commands, evidence, manual checks, and residual risks.
13. Mark tasks complete only after matching validation evidence exists.

## Validation Per Step

1. `openspec status --change add-electron-workspace` shows required artifacts present or in progress.
2. `npm --prefix packages/wikiwise-core test` fails with missing package/implementation before core files are added.
3. File inspection confirms no `Sources/Wikiwise/` files are modified.
4. `npm --prefix packages/wikiwise-core test` passes.
5. File inspection confirms Electron tests do not import `electron`.
6. `npm --prefix apps/electron test` fails with missing shell files.
7. File inspection confirms `nodeIntegration: false`, `contextIsolation: true`, and `contextBridge.exposeInMainWorld("wikiwise", ...)`.
8. `npm --prefix apps/electron test` and `npm test` pass.
9. README mentions Swift remains current production app and Electron is parallel cross-platform workspace.
10. OpenSpec strict validation passes.
11. Swift build passes.
12. Verification file records all command outcomes.
13. `tasks.md` checkboxes reflect only completed work.

## Files / Owners

- `openspec/changes/add-electron-workspace/*`
- `package.json`
- `.gitignore`
- `packages/wikiwise-core/package.json`
- `packages/wikiwise-core/src/index.js`
- `packages/wikiwise-core/test/resource-paths.test.js`
- `apps/electron/package.json`
- `apps/electron/src/main/main.js`
- `apps/electron/src/preload/preload.cjs`
- `apps/electron/src/renderer/index.html`
- `apps/electron/src/renderer/renderer.js`
- `apps/electron/src/renderer/styles.css`
- `apps/electron/test/shell-files.test.js`
- `apps/electron/README.md`
- `README.md`

## Completion Checkpoint

The change is complete when OpenSpec strict validation passes, core and Electron workspace tests pass from root npm scripts without launching Electron, `swift build` still passes, README documentation is updated, `tasks.md` is fully checked, and retained verification evidence is written.

## Completion Verification

Write `openspec/changes/add-electron-workspace/verification.md` with:

- Completion Decision
- Commands Run
- Manual Checks
- Evidence
- Residual Risks

Required command evidence:

- `npm --prefix packages/wikiwise-core test`
- `npm --prefix apps/electron test`
- `npm test`
- `openspec validate add-electron-workspace --strict`
- `swift build`

## Debugging Trail

Not active. This is not a bugfix.

## Review Follow-Up

No external review findings yet.

## Delegation Units

Not active. Single-agent execution.

## Parallel Units

Not active. Serial execution because OpenSpec artifacts and task checkboxes must be updated deterministically.

## Isolation Boundaries

Not active.

## Worktree Units

Not active.

## Isolation Reason

Same-tree execution is sufficient because the work is additive, isolated to `apps/`, `packages/`, root npm metadata, docs, and OpenSpec artifacts.

## Integration Owner

Main agent.

## Finish Checklist

- OpenSpec artifacts complete.
- Tests and `swift build` pass.
- Verification evidence retained.
- No Swift source modified.
- Pre-existing untracked `.claude/`, `.codex/`, and `openspec/` baseline content is not reverted.

## Delivery Handoff

Electron runtime launch still requires `npm install` with network access. This first slice intentionally proves structure and package boundaries rather than packaging or feature parity.

## Execution Notes

The branch is `codex-electron-shell`. A previous attempt created a `docs/superpowers` plan, which has been removed so OpenSpec remains the driver.

## Manual Adjustments

The user requested OpenSpec-driven development for `apps/electron` and `packages/wikiwise-core`.
