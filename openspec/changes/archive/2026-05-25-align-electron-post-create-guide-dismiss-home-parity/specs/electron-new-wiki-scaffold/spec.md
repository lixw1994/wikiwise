## ADDED Requirements

### Requirement: Post-Create Guide Dismiss Home Selection Parity
The Electron post-create guide SHALL explicitly start reading `wiki/home.md` when the user dismisses the guide and the file exists.

#### Scenario: User dismisses the post-create guide
- **WHEN** the user activates `Got it — start reading`
- **THEN** Electron hides the post-create guide
- **AND** Electron selects the `wiki/home.md` tree node when it is present
- **AND** Electron loads `wiki/home.md` through the existing renderer file-selection flow
- **AND** Electron does not add a navigation history entry for this automatic start-reading transition
- **AND** if `wiki/home.md` is unavailable, Electron still hides the guide without changing the current file
