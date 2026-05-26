## Verification

Date: 2026-05-26

## Red / Green

- Red: `node --test apps/electron/test/project-lifecycle.test.js apps/electron/test/runtime-parity-audit.test.js` failed with 3 failures after adding standalone-file parity contracts. Missing surfaces were explicit `projectKind`, empty standalone-file tree/service guards, and runtime audit standalone-file evidence.
- Green: after adding folder/file project-kind metadata, renderer service guards, and runtime audit standalone-file evidence, the same focused command passed with 18 tests, 0 failures.

## Runtime Evidence

Command:

```bash
npm run electron:audit:runtime
```

Result:

- Runtime audit captured and passed `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, and `project-dark`.
- Report path: `apps/electron/out/runtime-audit/report.json`.
- Screenshot path: `apps/electron/out/runtime-audit/screenshots`.
- Standalone-file evidence records empty file tree, selected `standalone.md`, stopped watcher/terminal services, disabled publish action, and no generated-map service invocation.

## Full Verification Commands

```bash
node --test apps/electron/test/project-lifecycle.test.js apps/electron/test/runtime-parity-audit.test.js
npm test
swift build
npm run electron:audit:runtime
openspec validate align-electron-standalone-file-open-parity --strict
openspec validate --all --strict
git diff --check
npm run electron:package:mac
```

Results:

- Focused project lifecycle/runtime audit tests passed with 18 tests, 0 failures.
- `npm test` passed with 167 Electron tests and 28 core tests.
- `swift build` completed successfully.
- Runtime audit passed all 7 retained scenarios, including `standalone-file-light`.
- Change-specific and all-spec OpenSpec validation passed.
- `git diff --check` reported no whitespace errors.
- Local unsigned Electron macOS bundle was packaged at `apps/electron/out/Wikiwise.app`.

## Residual Migration Gate

This phase closes the standalone-file open behavior mismatch. It does not
complete the Electron migration by itself; final completion still requires a
successful `bash scripts/build-release.sh <version>` signed and notarized
release run, or an explicitly accepted OpenSpec deviation.
