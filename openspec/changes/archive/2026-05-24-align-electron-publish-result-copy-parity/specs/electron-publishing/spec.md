## MODIFIED Requirements

### Requirement: Publish Result
The Electron app SHALL surface publish success and failure to the user using native-like modal feedback and native result copy.

#### Scenario: Publish succeeds
- **WHEN** publishing completes successfully for a first publish
- **THEN** the renderer shows a modal result titled `Published!`
- **AND** the result body includes `Your wiki is live at <published URL>`
- **AND** the result body includes `A publish.json file has been saved to your project. Keep it safe — it’s your key to update this site.`
- **AND** the result does not show a duplicate standalone URL outside the native result body
- **AND** the result includes an `Open in Browser` action that opens the published URL through the preload external URL bridge
- **AND** the result includes an `OK` action that dismisses the result
- **AND** the renderer refreshes its publish config state

#### Scenario: Publish update succeeds
- **WHEN** publishing completes successfully for an already published wiki
- **THEN** the renderer shows a modal result titled `Published!`
- **AND** the result body is `Updated <published URL>`
- **AND** the result does not show a duplicate standalone URL outside the native result body
- **AND** the result includes an `Open in Browser` action that opens the published URL through the preload external URL bridge
- **AND** the result includes an `OK` action that dismisses the result
- **AND** the renderer refreshes its publish config state

#### Scenario: Publish fails
- **WHEN** publishing fails
- **THEN** the renderer shows a modal error titled `Publish Error`
- **AND** the error includes the publish failure message
- **AND** the error includes an `OK` action that dismisses the error
- **AND** publishing controls are re-enabled
