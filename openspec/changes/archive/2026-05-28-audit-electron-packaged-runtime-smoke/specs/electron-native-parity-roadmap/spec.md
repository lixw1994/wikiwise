## ADDED Requirements

### Requirement: Packaged Runtime Smoke Phase Tracking
The migration roadmap SHALL record packaged Electron runtime smoke evidence as final app-bundle bootability evidence.

#### Scenario: Packaged runtime smoke phase is archived
- **WHEN** the packaged runtime smoke audit change is archived
- **THEN** retained verification records package command evidence, packaged app launch evidence, packaged renderer/preload evidence, packaged runtime dependency evidence, release-gate ordering coverage, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation
