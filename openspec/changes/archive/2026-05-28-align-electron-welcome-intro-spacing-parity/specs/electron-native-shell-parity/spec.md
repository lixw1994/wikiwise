## ADDED Requirements

### Requirement: Welcome Intro Spacing Parity

The Electron no-folder welcome intro SHALL mirror the native SwiftUI nested spacing between the centered `W` mark and welcome summary.

#### Scenario: Welcome intro is inspected
- **WHEN** the Electron welcome view is rendered before a project is open
- **THEN** the centered `W` mark and welcome summary are grouped together with a 12px internal gap, matching SwiftUI `VStack(spacing: 12)`
- **AND** the outer welcome content keeps a 32px gap between the intro group, action group, and helper hint
- **AND** welcome mark styling, summary text, summary line spacing, action grouping, toolbar brand styling, and welcome behavior remain unchanged
