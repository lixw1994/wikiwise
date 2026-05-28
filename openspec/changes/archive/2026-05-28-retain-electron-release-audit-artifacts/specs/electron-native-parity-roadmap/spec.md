## ADDED Requirements

### Requirement: Release Audit Artifact Retention Phase Tracking
The migration roadmap SHALL record release workflow retention of detailed runtime and packaged runtime audit artifacts as final release evidence hardening.

#### Scenario: Release audit artifact retention phase is archived
- **WHEN** the release audit artifact retention change is archived
- **THEN** retained verification records workflow artifact upload coverage for the DMG, release report, runtime audit report/screenshots, packaged runtime smoke report, release documentation coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation
