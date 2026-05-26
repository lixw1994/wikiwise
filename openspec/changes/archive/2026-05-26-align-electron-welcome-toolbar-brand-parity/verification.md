## Verification

Date: 2026-05-26

## Red / Green

- Red: `node --test apps/electron/test/native-shell-parity.test.js apps/electron/test/runtime-parity-audit.test.js` failed with 2 failures after adding welcome toolbar parity contracts. Missing surfaces were the Electron welcome toolbar brand markup/style and runtime audit welcome toolbar evidence.
- Green: after adding the welcome toolbar row, styles, and runtime audit assertions, the same focused test command passed with 25 tests, 0 failures.

## Runtime Evidence

Command:

```bash
npm run electron:audit:runtime
```

Result:

- Runtime audit captured and passed `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `project-light`, and `project-dark`.
- Report path: `apps/electron/out/runtime-audit/report.json`.
- Screenshot path: `apps/electron/out/runtime-audit/screenshots`.
- Welcome scenario DOM evidence now records `welcomeToolbarEvidence`, `welcomeToolbarVisible`, `welcomeToolbarMarkText`, `welcomeToolbarTitleText`, and `welcomeToolbarRect`.

## Full Verification Commands

```bash
node --test apps/electron/test/native-shell-parity.test.js apps/electron/test/runtime-parity-audit.test.js
npm test
swift build
npm run electron:audit:runtime
openspec validate align-electron-welcome-toolbar-brand-parity --strict
openspec validate --all --strict
git diff --check
npm run electron:package:mac
```

Results:

- Focused native shell/runtime audit tests passed with 25 tests, 0 failures.
- `npm test` passed with 165 Electron tests and 28 core tests.
- `swift build` completed successfully.
- Runtime audit passed all 6 retained scenarios.
- Change-specific and all-spec OpenSpec validation passed.
- `git diff --check` reported no whitespace errors.
- Local unsigned Electron macOS bundle was packaged at `apps/electron/out/Wikiwise.app`.

## Residual Migration Gate

This phase closes a visible no-folder shell parity gap. It does not complete the
Electron migration by itself; final completion still requires a successful
`bash scripts/build-release.sh <version>` signed and notarized release run, or an
explicitly accepted OpenSpec deviation.
