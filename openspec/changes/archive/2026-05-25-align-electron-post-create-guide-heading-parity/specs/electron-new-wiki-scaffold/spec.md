## ADDED Requirements

### Requirement: Post-Create Guide Section Heading Parity
The Electron post-create guide SHALL render its section heading labels with the same native SwiftUI typography, tracking, and color.

#### Scenario: Post-create guide section headings are inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the `OPEN YOUR AGENT` and `SEED YOUR WIKI` labels use native 10px semibold typography
- **AND** the labels use native tracking equivalent to `.tracking(1.5)`
- **AND** the labels use the native sidebar header color
- **AND** non-guide eyebrow styling and existing guide copy, dividers, command rendering, seed options, summary/title styling, and dismiss behavior are preserved
