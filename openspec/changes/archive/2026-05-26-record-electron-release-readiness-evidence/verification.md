## Verification

Date: 2026-05-26

## Red / Green

- Red: `node --test apps/electron/test/macos-packaging.test.js` failed with 4 failures after adding release readiness contracts. Missing surfaces were `electron:release:readiness`, `--preflight-report` report generation, blocked report output, and retained readiness documentation.
- Green: after adding the release script report mode, npm command, and README documentation, `node --test apps/electron/test/macos-packaging.test.js` passed with 11 tests, 0 failures.

## Release Readiness Evidence

Command:

```bash
npm run electron:release:readiness
```

Result:

```text
=== Building Electron Wikiwise v0.1.0 ===
Release prerequisite failed: missing Developer ID signing identity 'Developer ID Application: Readwise, Inc (QV36BMA4LN)'
Release prerequisite failed: missing or unusable Apple notarization keychain profile 'notarytool'
```

The command exited non-zero as expected on this machine and wrote
`apps/electron/out/release-readiness/report.json`. The report records passed
tooling checks, blocked `signing-identity` and `notary-profile` checks, no
release artifact production, and the remaining final requirement for an actual
signed/notarized release run or accepted OpenSpec deviation.

## Full Verification Commands

```bash
bash -n scripts/build-release.sh
node --test apps/electron/test/macos-packaging.test.js
npm run electron:release:readiness
npm test
swift build
openspec validate record-electron-release-readiness-evidence --strict
openspec validate --all --strict
git diff --check
npm run electron:package:mac
```

Results:

- Release script syntax check passed.
- Focused packaging/release tests passed with 11 tests, 0 failures.
- Readiness command produced the expected credential-dependent blocker report.
- `npm test` passed with 164 Electron tests and 28 core tests.
- `swift build` completed successfully.
- Change-specific and all-spec OpenSpec validation passed.
- `git diff --check` reported no whitespace errors.
- Local unsigned Electron macOS bundle was packaged at `apps/electron/out/Wikiwise.app`.

## Residual Migration Gate

This phase improves retained evidence for the final release gate. It does not
complete the Electron migration by itself; final completion still requires a
successful `bash scripts/build-release.sh <version>` signed and notarized release
run, or an explicitly accepted OpenSpec deviation.
