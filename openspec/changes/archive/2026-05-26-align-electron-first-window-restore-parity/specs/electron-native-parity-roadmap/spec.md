## ADDED Requirements

### Requirement: First-Window Restore Phase Completion Tracking
The migration roadmap SHALL record Electron first-window startup restore parity as a session-behavior gap closure phase.

#### Scenario: First-window restore parity phase is archived
- **WHEN** the Electron first-window restore parity change is archived
- **THEN** retained verification records native Swift `ContentView.instanceCount` behavior, Electron main-process window-creation tracking, sender-scoped restore IPC gating, first-window restore preservation, later-window welcome behavior, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation
