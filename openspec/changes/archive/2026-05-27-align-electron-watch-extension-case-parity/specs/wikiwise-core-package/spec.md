## ADDED Requirements

### Requirement: Watch Event Extension Case Parity

The core package SHALL classify watched markdown and CSS events with the same case-sensitive suffix semantics as native `FileWatcher`.

#### Scenario: Upper-case markdown and CSS watcher paths change
- **WHEN** JavaScript summarizes watched paths ending in `.MD` or `.CSS`
- **THEN** those events do not produce markdown or CSS watch summaries solely because of the upper-case extension

#### Scenario: Lower-case markdown and CSS watcher paths change
- **WHEN** JavaScript summarizes watched paths ending in `.md` or `.css`
- **THEN** existing native-compatible markdown and CSS content summaries remain available
