## Verification

Date: 2026-05-25

## Red / Green

- Red: `node --test apps/electron/test/macos-packaging.test.js` failed with 3 failures after adding preflight contracts. The missing surfaces were `electron:release:preflight`, `PREFLIGHT_ONLY` / `--preflight` script behavior, and `bash scripts/build-release.sh --preflight <version>` documentation.
- Green: after adding the npm script, release script preflight mode, notary profile check, and docs, `node --test apps/electron/test/macos-packaging.test.js` passed with 8 tests, 0 failures.

## Release Preflight Evidence

Command:

```bash
bash scripts/build-release.sh --preflight 0.0.0
```

Result:

```text
=== Building Electron Wikiwise v0.0.0 ===
Release prerequisite failed: missing Developer ID signing identity 'Developer ID Application: Readwise, Inc (QV36BMA4LN)'
```

This is expected blocker evidence for the current machine: preflight identified the missing Developer ID signing identity and exited before `[1/7] Running Electron runtime parity audit...`, packaging, signing, DMG creation, notarization, stapling, or assessment.

## Full Verification Commands

```bash
bash -n scripts/build-release.sh
node --test apps/electron/test/macos-packaging.test.js
npm test
swift build
openspec validate harden-electron-release-preflight --strict
openspec validate --all --strict
git diff --check
npm run electron:package:mac
```

Results:

- Release script syntax check passed.
- Focused packaging/release tests passed with 8 tests, 0 failures.
- `npm test` passed with 68 Electron tests and 26 core tests.
- `swift build` completed successfully.
- Change-specific and all-spec OpenSpec validation passed.
- `git diff --check` reported no whitespace errors.
- Local unsigned Electron macOS bundle was packaged at `apps/electron/out/Wikiwise.app`.

## Residual Migration Gap

This phase adds repeatable release preflight evidence and an early credential blocker. It does not complete the final release gate. Overall Electron migration completion still requires an actual signed and notarized release run, or an explicitly accepted OpenSpec deviation.
