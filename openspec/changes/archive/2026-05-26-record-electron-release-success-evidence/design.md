## Context

The canonical Electron release command already performs runtime audit, packaging, Developer ID signing, DMG creation, DMG signing, notarization, stapling, and Gatekeeper assessment. A separate readiness command writes retained blocker evidence without producing artifacts. What is missing is the symmetric retained evidence for a successful production release: the final console output is not enough to prove, later, which artifact completed the gate.

## Goals / Non-Goals

**Goals:**

- Add an optional full-release report path to `scripts/build-release.sh`.
- Record success evidence only after all production release gates complete.
- Include enough artifact metadata for review: version, DMG path, checksum, command, completed gates, and final migration requirement status.
- Expose a convenience npm script for full release with the retained report path.
- Document how success reports differ from readiness/preflight reports.

**Non-Goals:**

- Do not bypass Developer ID signing, notarization, stapling, Gatekeeper assessment, or the runtime parity audit.
- Do not fabricate success reports from preflight-only runs.
- Do not require credentials for normal tests; tests should inspect contracts and exercise blocked/no-artifact paths without running a real release.
- Do not change SwiftUI macOS release behavior.

## Decisions

- Add `--release-report <path>` for production release only.
  The flag belongs in the canonical release script so release evidence stays coupled to the steps it proves. Alternative considered: a separate post-processing script, but that would be easier to run against the wrong artifact or without all gates completing.
- Reject `--release-report` with `--preflight`.
  Preflight reports already exist and explicitly mean no artifact was produced. Keeping report modes mutually exclusive prevents a blocked readiness check from looking like release success.
- Write the release report after `spctl` assessment succeeds.
  Earlier report writes would risk retaining a success-looking artifact for a release that failed notarization, stapling, or assessment.
- Include a SHA-256 checksum using platform tools.
  The report should identify the reviewed DMG without introducing new npm dependencies. If checksum tooling is unavailable, the production release should fail through the same prerequisite model rather than record weak artifact evidence.

## Risks / Trade-offs

- [Risk] The report could be mistaken as proof without checking the signed artifact. -> Mitigation: include artifact path, checksum, and completed gate names, and only write it after final assessment.
- [Risk] More shell JSON generation increases maintenance burden. -> Mitigation: reuse the existing JSON helpers and keep the success report schema small.
- [Risk] Convenience scripts could imply releases are credential-free. -> Mitigation: docs keep the Developer ID and notarization requirements explicit, and tests ensure preflight/readiness remains separate from full release success.
