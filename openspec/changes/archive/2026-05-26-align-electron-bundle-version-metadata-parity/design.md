## Context

The local Electron package command uses `apps/electron/package.json` version metadata when no CLI version is supplied, so `npm run electron:package:mac` currently produces `CFBundleShortVersionString = 0.0.0` and `CFBundleVersion = 0.0.0`. The checked-in native app bundle currently declares `CFBundleShortVersionString = 0.1.9` and `CFBundleVersion = 1`.

The canonical production release command already passes an explicit `<version>` to the Electron package script. This change only improves the no-argument local package default so parity review of the generated app bundle matches the current native app baseline.

## Goals / Non-Goals

**Goals:**

- Make no-argument local Electron packaging default to the current native app bundle version metadata.
- Preserve explicit release-version override behavior for `bash scripts/build-release.sh <version>`.
- Keep all other `Info.plist` metadata work unchanged, including bundle identity, icon, minimum macOS version, privacy key cleanup, and Electron runtime-required keys.

**Non-Goals:**

- No claim that a signed/notarized release has been produced.
- No change to package manifest versions or npm workspace versioning.
- No introduction of a separate release build number flow.

## Decisions

- Read native version metadata from the checked-in `Wikiwise.app/Contents/Info.plist` when available. That app bundle is already used as the current native parity evidence in packaging tests.
- Use the explicit CLI version as the highest-priority short version, preserving the release script contract. When a CLI version is supplied, keep the current behavior of using that value for both short version and bundle version.
- When no CLI version is supplied, use native `CFBundleShortVersionString` and native `CFBundleVersion`; fall back to the Electron package version only if native metadata is missing.
- Parse only string plist values with the existing lightweight regex style used by the package script. This avoids adding a package-time dependency.

## Risks / Trade-offs

- [Risk] The checked-in native app bundle version could become stale. -> Mitigation: tests compare the package script behavior to the current checked-in native bundle, and future native version updates will expose drift.
- [Risk] Release build numbers remain tied to the explicit release version. -> Mitigation: this preserves the existing signed release contract; adding independent build-number management should be a separate release-process change.
- [Risk] Regex plist parsing is limited. -> Mitigation: only top-level string keys are read, and package verification inspects the produced bundle.

## Migration Plan

1. Add a failing packaging test for default bundle version metadata parity and explicit release override preservation.
2. Update `scripts/package-electron-macos.mjs` to read native version metadata and resolve package versions from CLI/native/package fallbacks.
3. Repackage and inspect the generated `Info.plist`.
4. Run the standard verification suite, archive the OpenSpec change, and keep the final signed/notarized release gate open.
