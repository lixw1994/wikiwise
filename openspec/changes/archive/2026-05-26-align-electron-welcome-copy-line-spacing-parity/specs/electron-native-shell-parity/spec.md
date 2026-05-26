## ADDED Requirements

### Requirement: Welcome Copy Line Spacing Parity
The Electron no-folder welcome screen SHALL match the native SwiftUI line-spacing rhythm for the main welcome summary and helper hint text.

#### Scenario: Welcome copy typography is inspected
- **WHEN** the Electron welcome view is rendered
- **THEN** the main welcome summary uses 15px text with a 19px line height, matching SwiftUI 15px text with `.lineSpacing(4)`
- **AND** the helper hint uses 12px text with a 15px line height, matching SwiftUI 12px text with `.lineSpacing(3)`
- **AND** welcome copy, intentional line breaks, action buttons, action symbols, toolbar brand styling, colors, and overall welcome layout are unchanged
