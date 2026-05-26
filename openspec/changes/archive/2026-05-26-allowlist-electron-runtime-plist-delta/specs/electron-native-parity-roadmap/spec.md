## ADDED Requirements

### Requirement: Runtime Info.plist Delta Allowlist Phase Completion Tracking

The migration roadmap SHALL record Electron runtime `Info.plist` delta allowlisting as a packaging/release gap closure phase.

#### Scenario: Runtime Info.plist delta allowlist phase is archived

- **WHEN** the Electron runtime `Info.plist` delta allowlist change is archived
- **THEN** retained verification records native app plist key evidence, Electron package script allowlist coverage, packaged plist inspection, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation
