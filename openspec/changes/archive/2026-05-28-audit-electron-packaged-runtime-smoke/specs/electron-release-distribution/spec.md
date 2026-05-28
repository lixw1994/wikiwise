## ADDED Requirements

### Requirement: Packaged Runtime Smoke Release Gate
The full Electron release command SHALL run packaged runtime smoke after package creation and before signing.

#### Scenario: Full release includes packaged smoke gate
- **WHEN** `bash scripts/build-release.sh <version>` runs with release credentials available
- **THEN** it runs the detailed Electron runtime parity audit before packaging
- **AND** it packages `apps/electron/out/Wikiwise.app`
- **AND** it runs the packaged runtime smoke audit against `apps/electron/out/Wikiwise.app` before app signing
- **AND** it records `packaged-runtime-smoke` in retained release success evidence
- **AND** signing, DMG creation, notarization, stapling, and assessment still run after the packaged smoke gate passes
