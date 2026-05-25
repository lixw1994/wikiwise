## ADDED Requirements

### Requirement: Toolbar Intrinsic Icon Sizing Parity
The Electron opened-project icon-only toolbar controls SHALL use intrinsic plain-button sizing instead of invisible fixed button boxes.

#### Scenario: Icon-only toolbar controls size to their symbols
- **WHEN** a project toolbar is rendered
- **THEN** Electron icon-only toolbar controls do not impose a fixed minimum width
- **AND** Electron icon-only toolbar controls do not impose fixed inline or block sizes
- **AND** Electron icon-only toolbar controls do not add extra padding beyond their symbol/text content
- **AND** mode segmented controls and the publish action keep their explicit native padding
- **AND** toolbar symbol names, icon sizes, plain chrome, color states, accessible labels, click behavior, toolbar group spacing, sidebar layout behavior, and project title offset behavior are not changed for this requirement
