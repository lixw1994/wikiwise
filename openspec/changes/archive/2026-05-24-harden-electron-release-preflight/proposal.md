## Why

The Electron migration is close to visible feature parity, but final acceptance still depends on a signed and notarized macOS release run. The current release script preserves the full gate, but there is no lightweight way to run and retain release prerequisite evidence without starting the full audit/package/sign/notarize flow. That makes the remaining blocker harder to distinguish from ordinary implementation gaps.

## What Changes

- Add an explicit Electron release preflight mode that validates local release prerequisites and exits before audit, packaging, signing, DMG creation, notarization, or artifact output.
- Expose the preflight mode through an npm script while preserving `bash scripts/build-release.sh <version>` as the canonical production release command.
- Harden release prerequisite checks so missing Developer ID identity, notary profile, tooling, or entitlements fail early with a concrete reason.
- Document how preflight evidence should be retained when actual Apple signing/notarization credentials are unavailable.

## Success Criteria

- Running the preflight mode either reports that all release prerequisites are available or exits non-zero with the specific missing prerequisite.
- Preflight mode does not create `Wikiwise.app`, `Wikiwise-macOS.dmg`, or any signed/notarized release artifact.
- The full release command still runs runtime audit, packages the Electron app, signs with hardened runtime entitlements, creates and signs the DMG, submits notarization, staples the ticket, and assesses the DMG.
- Tests and specs cover the preflight-only path, early failure behavior, and release evidence expectations.

## Non-Goals

- Do not bypass Developer ID signing, Apple notarization, stapling, or final DMG assessment.
- Do not replace the production release command with a mock or unsigned artifact.
- Do not claim the migration is complete unless a real signed/notarized release succeeds or a later OpenSpec change explicitly accepts a deviation.

## Capabilities

### New Capabilities

- `electron-release-preflight-evidence`: Covers explicit Electron release prerequisite checks and retained blocker evidence before final signed release.

### Modified Capabilities

- `electron-release-distribution`: Adds a release preflight mode while preserving the canonical signed/notarized release path.
- `electron-native-parity-roadmap`: Records release preflight hardening as a final distribution gate support phase, while keeping actual signed/notarized execution as the remaining completion gate.

## Impact

- `scripts/build-release.sh`: Add argument parsing, preflight-only exit behavior, and notary profile validation.
- `package.json`: Expose an npm release preflight command.
- `apps/electron/test/macos-packaging.test.js`: Add static contract coverage for preflight behavior.
- `apps/electron/README.md`, `CLAUDE.md`, and `openspec/project.md`: Document retained preflight evidence and the remaining actual release requirement.
- OpenSpec specs and verification artifacts retain release blocker evidence.
