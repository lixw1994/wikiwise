## ADDED Requirements

### Requirement: Preview Local Link Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that compiled-preview local links route through the preload bridge and app navigation state.

#### Scenario: Runtime audit records preview local link navigation
- **WHEN** the runtime audit captures an opened-project scenario with scaffold `home.md` selected
- **THEN** it clicks a local link inside the compiled WIKI preview frame
- **AND** it records that `wikiwise:resolvePreviewNavigation` observed the target compiled page URL
- **AND** it records that the resolver returned the matching markdown file result
- **AND** it records that Electron selected `index.md` after the click
- **AND** it records that app Back restored `home.md` with the compiled preview visible

#### Scenario: Runtime audit fails missing preview local link navigation
- **WHEN** preview local link runtime evidence is absent, the local link is unavailable, the preload resolver is not observed, the target markdown file is not selected, or Back does not restore the original markdown preview
- **THEN** runtime audit fails the affected project scenario
