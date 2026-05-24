## 1. Contracts

- [x] 1.1 Add static tests for the release preflight npm script, `--preflight` argument parsing, and no-artifact messaging.
- [x] 1.2 Add static tests for early notary profile validation and preservation of the full signed/notarized release path.

## 2. Release Script

- [x] 2.1 Add `--preflight <version>` mode to `scripts/build-release.sh` without changing `bash scripts/build-release.sh <version>`.
- [x] 2.2 Validate the configured notary keychain profile during release preflight.
- [x] 2.3 Ensure preflight exits before runtime audit, packaging, signing, DMG creation, notarization, stapling, or assessment.

## 3. Documentation

- [x] 3.1 Expose an npm release preflight command.
- [x] 3.2 Document preflight evidence and the remaining actual signed/notarized release requirement.

## 4. Verification

- [x] 4.1 Run focused packaging tests and local release preflight command, retaining the pass/blocker evidence.
- [x] 4.2 Run `npm test`, `swift build`, `openspec validate harden-electron-release-preflight --strict`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 4.3 Archive the OpenSpec change and commit.
