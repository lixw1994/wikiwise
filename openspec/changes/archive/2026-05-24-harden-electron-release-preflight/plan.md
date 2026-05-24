## Scope

Implement and verify Electron release preflight evidence for the canonical release script. This plan covers tests, script behavior, docs, retained verification, OpenSpec archive, and commit.

## Covers

`1.1`, `1.2`, `2.1`, `2.2`, `2.3`, `3.1`, `3.2`, `4.1`, `4.2`, `4.3`, release preflight blocker evidence, and preservation of the signed/notarized production release gate.

## Plan Type

full

## Execution Strategy

tdd-preferred

## Ordered Steps

1. Add failing static tests in `apps/electron/test/macos-packaging.test.js` for the root npm preflight script, `--preflight` parsing, preflight-only success text, early exit before `[1/7]`, notary profile validation, and full release preservation.
2. Run the focused packaging tests and confirm the new assertions fail before implementation.
3. Update `scripts/build-release.sh` with `--preflight` argument parsing, notary profile validation, and preflight-only success/exit behavior.
4. Add `electron:release:preflight` to the root `package.json`.
5. Update `apps/electron/README.md`, `CLAUDE.md`, and `openspec/project.md` to document preflight evidence and the remaining signed/notarized release requirement.
6. Re-run the focused packaging tests and fix any script/docs contract failures.
7. Run `bash scripts/build-release.sh --preflight 0.0.0` and record either success or the exact prerequisite blocker.
8. Mark completed implementation tasks in `tasks.md`.
9. Run full verification: `npm test`, `swift build`, change-specific OpenSpec validation, all OpenSpec validation, `git diff --check`, and `npm run electron:package:mac`.
10. Add `verification.md` with red/green evidence, local preflight result, full verification commands, and residual signed/notarized release gap.
11. Archive the OpenSpec change, patch generated purpose/task metadata if needed, re-run OpenSpec validation and `git diff --check`.
12. Stage and commit the phase as `feat: harden electron release preflight`.

## Validation Per Step

1. Static tests must assert exact script/docs surfaces rather than only broad keywords.
2. Expected focused test failure should point to missing `electron:release:preflight`, missing `--preflight`, or missing notary-profile check.
3. `bash scripts/build-release.sh --preflight 0.0.0` must not print `[1/7] Running Electron runtime parity audit...`.
4. `npm test` must see the root package script.
5. Documentation tests must find `bash scripts/build-release.sh --preflight <version>` and still find `bash scripts/build-release.sh <version>`.
6. Focused packaging tests must pass after implementation.
7. Local preflight command may fail on this machine; it is acceptable only if the output names a specific release prerequisite and exits before artifact work.
8. Task checkboxes should be updated only after their corresponding verification has run.
9. Full verification commands must all exit zero except the credential-dependent preflight evidence command if it fails with an expected prerequisite blocker.
10. `verification.md` must not claim final migration completion from preflight-only evidence.
11. Archive output must create/update the expected specs and leave `openspec validate --all --strict` clean.
12. `git status --short` must be clean after commit.

## Files / Owners

- `scripts/build-release.sh`
- `package.json`
- `apps/electron/test/macos-packaging.test.js`
- `apps/electron/README.md`
- `CLAUDE.md`
- `openspec/project.md`
- `openspec/changes/harden-electron-release-preflight/**`
- `openspec/specs/electron-release-distribution/spec.md`
- `openspec/specs/electron-native-parity-roadmap/spec.md`
- `openspec/specs/electron-release-preflight-evidence/spec.md`

## Completion Checkpoint

Implementation is complete when the release preflight command exists, exits before artifact-producing release steps, validates signing/notarization prerequisites, preserves the full production release path, and has retained verification evidence.

## Completion Verification

Before presenting this phase as complete, retain `verification.md` and run:

```bash
node --test apps/electron/test/macos-packaging.test.js
bash scripts/build-release.sh --preflight 0.0.0
npm test
swift build
openspec validate harden-electron-release-preflight --strict
openspec validate --all --strict
git diff --check
npm run electron:package:mac
```

The local preflight command may exit non-zero if Apple release credentials are unavailable; in that case, completion requires the output to identify a concrete release prerequisite blocker and the verification note to preserve that blocker.

## Debugging Trail

Not applicable.

## Review Follow-Up

No review findings are pending.

## Delegation Units

Not used; this change is small enough for single-agent execution.

## Parallel Units

Static reads and independent validation commands may run in parallel after implementation. Release preflight and packaging commands should run serially.

## Isolation Boundaries

Keep release script changes in `scripts/build-release.sh`; tests in `apps/electron/test/macos-packaging.test.js`; docs in release docs only.

## Worktree Units

Not used.

## Isolation Reason

Same-tree execution is sufficient because the active branch is dedicated to the Electron migration.

## Integration Owner

Codex integrates all changes in this thread.

## Finish Checklist

- All tasks checked.
- Change archived.
- Specs validated.
- Commit created.
- Goal remains active until actual signed/notarized release or accepted deviation exists.

## Delivery Handoff

Preflight evidence may reduce ambiguity, but it does not replace the final release gate.

## Execution Notes

None yet.

## Manual Adjustments

None.
