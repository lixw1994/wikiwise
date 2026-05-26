## ADDED Requirements

### Requirement: Window Resource Cleanup Phase Completion Tracking
The migration roadmap SHALL record Electron window resource cleanup parity as a native lifecycle gap closure phase.

#### Scenario: Window resource cleanup parity phase is archived
- **WHEN** the Electron window resource cleanup parity change is archived
- **THEN** retained verification records native Swift `onDisappear` cleanup evidence, Electron webContents project-root ownership, watcher cleanup, background compilation cleanup, terminal cleanup, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation
