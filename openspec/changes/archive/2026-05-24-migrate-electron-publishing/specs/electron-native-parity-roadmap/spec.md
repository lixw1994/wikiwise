## ADDED Requirements

### Requirement: Publishing Phase Completion Tracking

The migration roadmap SHALL record Electron publishing as a phase that advances native parity while preserving later phases.

#### Scenario: Publishing phase is archived

- **WHEN** the Electron publishing change is archived
- **THEN** retained verification records publish config, availability, publish, and unpublish evidence
- **AND** remaining phases still include app chrome, menus, persistence, maps, packaging, and final parity audit
