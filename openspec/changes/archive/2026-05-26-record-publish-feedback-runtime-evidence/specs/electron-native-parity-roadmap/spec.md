## ADDED Requirements

### Requirement: Publish Feedback Runtime Evidence Phase Completion Tracking

The migration roadmap SHALL record publish feedback runtime evidence as a native runtime parity evidence phase.

#### Scenario: Publish feedback runtime evidence phase is archived

- **WHEN** the publish feedback runtime evidence change is archived
- **THEN** retained verification records runtime audit coverage for first-publish success feedback, external browser routing, publish error feedback, unpublish confirmation, unpublish cleanup, and restore-state evidence
- **AND** retained verification states that the evidence uses audit-only mocked publishing IPC and does not contact the production publishing service
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation
