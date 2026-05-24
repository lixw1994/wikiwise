## ADDED Requirements

### Requirement: Electron Release Hardening Phase Completion Tracking

The migration roadmap SHALL record Electron release hardening as the final distribution gate that enables migration completion only after signed/notarized release evidence is retained.

#### Scenario: Electron release hardening phase is archived

- **WHEN** the Electron release hardening change is archived
- **THEN** retained verification records release script guardrails, Electron package usage, signing/notarization/stapling checks, DMG output expectations, and any credential-dependent steps that could not run locally
- **AND** final migration completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation
