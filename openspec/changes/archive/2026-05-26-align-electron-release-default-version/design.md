## Context

`scripts/package-electron-macos.mjs` reads `Wikiwise.app/Contents/Info.plist` and uses the native `CFBundleShortVersionString` when no explicit package version is supplied. `scripts/build-release.sh` still resolves `VERSION` with a hard-coded `0.1.0` fallback, so `npm run electron:release:readiness` currently writes a report for `0.1.0` even though the native bundle is `0.1.9`.

## Goals / Non-Goals

**Goals:**
- Align the release script's no-argument version with native app bundle metadata.
- Preserve explicit release-version override behavior for `bash scripts/build-release.sh <version>`.
- Ensure blocked readiness reports prove the version resolution without producing release artifacts.

**Non-Goals:**
- No change to signing identity, notarization profile, DMG creation, stapling, or assessment gates.
- No change to the Electron package script's existing version behavior.
- No automatic production release attempt without the required credentials.

## Decisions

- Resolve the default release version from `Wikiwise.app/Contents/Info.plist` using macOS `plutil`, which is already available on the target release platform and reads plist structure rather than ad hoc XML matching.
- Fall back to the previous `0.1.0` default only if native metadata cannot be read, so non-release inspection remains resilient.
- Add a spawned preflight test with intentionally missing signing/notary credentials and no explicit version argument. That command stops at preflight, writes a readiness report, and verifies the reported version matches native metadata without running expensive release work.

## Risks / Trade-offs

- If the checked-in native plist is missing, release evidence could fall back to `0.1.0` -> Mitigation: tests assert the plist metadata exists and the default readiness report uses it.
- Version resolution must not weaken explicit release overrides -> Mitigation: keep existing explicit-version preflight test and add a no-argument default-version test instead of replacing it.
