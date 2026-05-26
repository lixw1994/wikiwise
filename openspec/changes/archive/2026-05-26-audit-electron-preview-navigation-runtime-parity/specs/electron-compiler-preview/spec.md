## MODIFIED Requirements

### Requirement: Deferred Preview Gaps
The compiler preview phase SHALL identify native preview gaps that remain for later OpenSpec phases and SHALL avoid listing preview parity work as deferred after archived runtime evidence covers it.

#### Scenario: Preview is shown
- **WHEN** the renderer displays compiled HTML
- **THEN** the phase verification records only native preview gaps that are not covered by archived Electron runtime parity evidence
- **AND** archived evidence for live rebuild, in-preview navigation parity, or map toolbar parity removes those items from the deferred gap list
