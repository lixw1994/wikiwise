## ADDED Requirements

### Requirement: Publish Dialog Runtime Evidence Phase Completion Tracking

The migration roadmap SHALL record first-publish dialog runtime evidence as a native runtime parity evidence phase.

#### Scenario: Publish dialog runtime evidence phase is archived

- **WHEN** the publish dialog runtime evidence change is archived
- **THEN** retained verification records runtime audit coverage for dialog opening, URL-row evidence, token-warning evidence, availability evidence, cancel-closure evidence, and restore-state evidence
- **AND** retained verification states that publish success, publish error, and unpublish runtime flows remain separate from this first-publish dialog evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation
