## MODIFIED Requirements

### Requirement: Runtime Parity Assertions

The runtime audit SHALL fail when required native-shell parity markers are missing, including the native default WIKI preview for markdown detail views.

#### Scenario: Audit assertions are evaluated

- **WHEN** the runtime audit evaluates a scenario
- **THEN** it verifies the document title is `Wikiwise`
- **AND** it verifies the renderer does not expose the shared-resources debug panel
- **AND** it verifies screenshots are nonblank at the expected viewport size
- **AND** welcome scenarios verify native welcome text and hidden project state
- **AND** project scenarios verify opened project chrome, selected document state, preview surface, and right sidebar state
- **AND** project scenarios verify markdown files initially show the WIKI preview before the audit switches to FILE editor mode
