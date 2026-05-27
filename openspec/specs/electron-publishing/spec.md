# electron-publishing Specification

## Purpose
Define Electron parity for publishing, availability feedback, publish result alerts, and unpublish behavior.
## Requirements
### Requirement: Publish Control

The Electron app SHALL expose a publishing control for opened projects with native-equivalent contextual help and visible labels.

#### Scenario: Project toolbar displays publish action

- **WHEN** a project is opened in Electron
- **THEN** the renderer displays a publish action
- **AND** the normal publish action label is `PUBLISH ↑`
- **AND** the action is disabled while publishing or unpublishing is already in progress
- **AND** the busy publish action label is `PUBLISHING…` while publishing or unpublishing is in progress
- **AND** the action exposes the native unpublished help text `Publish wiki to wiki-wise.com` when no published config exists

#### Scenario: Published project toolbar shows publish status help

- **WHEN** a project has publish config with a published URL
- **THEN** the publish action help includes the last published time or `never`
- **AND** the help includes the published URL
- **AND** the help includes the native URL-change hint

### Requirement: Publish Dialog

The Electron app SHALL let users choose or edit the wiki subdomain before publishing.

#### Scenario: First publish dialog opens

- **WHEN** the user opens the publish dialog for a project without `publish.json`
- **THEN** the dialog displays a generated subdomain candidate
- **AND** the dialog shows the final `https://<subdomain>.wiki-wise.com` URL shape
- **AND** the URL row constrains the editable subdomain field to the native maximum width
- **AND** the URL row places a flexible spacer before the trailing availability indicator
- **AND** the URL row uses the native fill-only rounded background chrome
- **AND** the dialog shows the native `publish.json` token warning, including the password/lost-token sentence
- **AND** publishing is disabled until the subdomain is available
- **AND** the confirmation action remains labeled `Publish`
- **AND** the dialog closes through the native cancel keyboard shortcut
- **AND** the dialog submits through the native default keyboard shortcut when Publish is enabled
- **AND** submitting Publish closes the dialog before the publish request begins

#### Scenario: Existing publish dialog opens

- **WHEN** the user opens the publish dialog for a project with existing publish config
- **THEN** the dialog displays the saved subdomain
- **AND** the URL row constrains the editable subdomain field to the native maximum width
- **AND** the URL row places a flexible spacer before the trailing availability indicator
- **AND** the URL row uses the native fill-only rounded background chrome
- **AND** the subdomain state is treated as owned unless an availability check says otherwise
- **AND** the dialog shows the native `Unpublish…` action
- **AND** the native `Unpublish…` action label remains unchanged while shown
- **AND** the confirmation action remains labeled `Publish`
- **AND** the dialog closes through the native cancel keyboard shortcut
- **AND** the dialog submits through the native default keyboard shortcut when Publish is enabled
- **AND** submitting Publish closes the dialog before the publish request begins

### Requirement: Availability Feedback

The Electron app SHALL show subdomain availability feedback matching the native states, inline indicator, and hint copy.

#### Scenario: Subdomain changes

- **WHEN** the user edits the subdomain field
- **THEN** invalid characters are removed
- **AND** availability is checked through preload
- **AND** the UI distinguishes available, owned, taken, invalid, checking, and unknown states
- **AND** the subdomain row includes a fixed 16x16 availability indicator
- **AND** `checking` displays an in-progress indicator in the row
- **AND** `checking` does not display visible text or punctuation in the row indicator
- **AND** `available` and `owned` display a success indicator in the row
- **AND** `taken` displays a failure indicator in the row
- **AND** `invalid` displays a warning indicator in the row
- **AND** `unknown` displays an empty row indicator
- **AND** `taken` displays `This name is already taken. Try another.`
- **AND** `invalid` displays `3–48 characters, letters, numbers, and hyphens only.`
- **AND** `owned` displays `You already own this name.`
- **AND** `available`, `checking`, `unknown`, and fallback states display `Anyone with this link can view your wiki.`

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

### Requirement: Unpublish Flow
The Electron app SHALL support unpublishing an already published wiki with native-like destructive confirmation.

#### Scenario: Published wiki asks for unpublish confirmation
- **WHEN** a project has publish config and the user selects `Unpublish…`
- **THEN** the renderer shows an app-owned confirmation titled `Unpublish wiki?`
- **AND** the confirmation explains that the wiki will be taken offline and local files are not affected
- **AND** the confirmation offers `Cancel` and destructive `Unpublish` actions
- **AND** the destructive confirmation action remains labeled `Unpublish` while visible
- **AND** the confirmation closes through the native cancel keyboard behavior
- **AND** the renderer does not use the browser `window.confirm` dialog

#### Scenario: Published wiki is unpublished
- **WHEN** the user confirms unpublish
- **THEN** the renderer closes the confirmation before asking preload to unpublish
- **AND** the renderer asks preload to unpublish
- **AND** the publish toolbar shows the native busy state while unpublish is running
- **AND** the local publish config state is cleared after success

### Requirement: Publish Alert Visual Parity
The Electron publishing modal feedback SHALL reuse the app dialog surface instead of floating inline page messages.

#### Scenario: Publish feedback is rendered
- **WHEN** publish success, publish error, or unpublish confirmation feedback is visible
- **THEN** the feedback is presented in a modal panel over the current app surface
- **AND** the inactive publish dialog controls remain hidden or disabled as appropriate
- **AND** the page does not show duplicate inline publish result or error text outside the modal

### Requirement: Publish Dialog URL Display Parity
The Electron publish dialog SHALL present the publish URL only through the native editable URL row.

#### Scenario: Publish dialog renders URL shape without duplicate detail row
- **WHEN** the publish dialog is shown
- **THEN** the dialog shows the final `https://<subdomain>.wiki-wise.com` URL shape in the editable URL row
- **AND** the dialog does not render a standalone duplicate URL paragraph below the editable URL row
- **AND** the renderer does not update a separate publish URL text node outside the editable URL row

### Requirement: Publish Dialog Panel Padding Parity
The Electron publish dialog SHALL use the native publish sheet's panel inset.

#### Scenario: Publish dialog panel uses native content padding
- **WHEN** the publish dialog is rendered
- **THEN** the dialog panel uses a 24px content inset matching the native publish sheet
- **AND** the shared modal panel padding for unrelated dialogs is not changed for this requirement

### Requirement: Publish Dialog Content Spacing Parity
The Electron publish dialog SHALL use the native publish sheet's content spacing.

#### Scenario: Publish dialog panel uses native content gap
- **WHEN** the publish dialog is rendered
- **THEN** the dialog panel spaces its direct content groups with a 16px gap matching the native publish sheet
- **AND** the shared modal panel gap for unrelated dialogs is not changed for this requirement

### Requirement: Publish Dialog Title Typography Parity
The Electron publish dialog SHALL use the native publish sheet title typography.

#### Scenario: Publish dialog title uses native serif treatment
- **WHEN** the publish dialog is rendered
- **THEN** the `Publish your wiki` title uses an 18px serif font with medium weight matching the native publish sheet
- **AND** the typography override is scoped to the publish dialog title

### Requirement: Publish Dialog Title Margin Parity
The Electron publish dialog title SHALL not add spacing beyond the native publish sheet content gap.

#### Scenario: Publish dialog title relies on panel gap
- **WHEN** the publish dialog is rendered
- **THEN** the title has no additional bottom margin beyond the dialog's native 16px content gap
- **AND** the shared modal title margin for unrelated dialogs is not changed for this requirement

### Requirement: Publish Subdomain Input Length Parity
The Electron publish dialog SHALL preserve native subdomain input length behavior after sanitizing characters.

#### Scenario: Sanitized subdomain input is not renderer-truncated
- **WHEN** the user edits the publish subdomain field
- **THEN** Electron lowercases the value and removes unsupported characters like the native publish sheet
- **AND** Electron does not truncate the sanitized value to 48 characters in the renderer
- **AND** availability feedback remains responsible for reporting invalid length

### Requirement: Publish Subdomain Input Character Parity
The Electron publish dialog SHALL preserve native subdomain sanitizer character behavior before availability validation.

#### Scenario: Sanitized subdomain input preserves native letters and numbers
- **WHEN** the user edits the publish subdomain field
- **THEN** Electron lowercases the value like the native publish sheet
- **AND** Electron preserves Unicode letters, Unicode numbers, and hyphens like the native publish sheet
- **AND** Electron removes unsupported punctuation and symbols
- **AND** availability feedback remains responsible for reporting unsupported names as invalid

### Requirement: Publish Subdomain Character Count Parity
The Electron publish dialog SHALL use native-like character counting for local subdomain minimum-length feedback.

#### Scenario: Local invalid state uses character count
- **WHEN** the user edits the publish subdomain field
- **THEN** Electron determines the local three-character minimum from sanitized Unicode characters rather than JavaScript UTF-16 code units
- **AND** Electron keeps empty input as unknown
- **AND** Electron keeps shorter non-empty input as invalid
- **AND** availability feedback remains responsible for reporting longer unsupported names as invalid

### Requirement: Publish Dialog URL Row Font Parity
The Electron publish dialog SHALL render the editable URL row with the native monospaced text size.

#### Scenario: Publish URL row uses native monospaced size
- **WHEN** the publish dialog is rendered
- **THEN** the `https://` prefix, editable subdomain, and `.wiki-wise.com` suffix use 13px monospaced text matching the native publish sheet
- **AND** the subdomain input inherits the URL row font treatment
- **AND** the availability indicator dimensions are not changed for this requirement

### Requirement: Publish Dialog URL Row Spacing Parity
The Electron publish dialog SHALL render the editable URL row without extra spacing between URL row items.

#### Scenario: Publish URL row uses native zero item spacing
- **WHEN** the publish dialog is rendered
- **THEN** the `https://` prefix, editable subdomain, `.wiki-wise.com` suffix, spacer, and availability indicator are arranged with zero item gap matching the native `HStack(spacing: 0)`
- **AND** the URL row grid columns and availability indicator dimensions are not changed for this requirement

### Requirement: Publish Subdomain Input Padding Parity
The Electron publish dialog SHALL render the editable subdomain field like the native plain text field without extra input padding.

#### Scenario: Subdomain input uses native plain padding
- **WHEN** the publish dialog is rendered
- **THEN** the editable subdomain input has no internal padding beyond the URL row padding
- **AND** the input remains borderless, transparent, and font-inherited
- **AND** the URL row padding is not changed for this requirement

### Requirement: Publish Dialog Intro Font Parity
The Electron publish dialog SHALL render the URL intro copy with the native publish sheet text size.

#### Scenario: Publish URL intro uses native text size
- **WHEN** the publish dialog is rendered
- **THEN** the `Your wiki will be available at:` intro copy uses 13px text matching the native publish sheet
- **AND** the intro copy keeps the secondary summary color treatment
- **AND** the publish token warning remains compact 12px text

### Requirement: Publish Dialog URL Row Color Parity
The Electron publish dialog SHALL render the editable URL row with the native fixed-affix and editable-field color hierarchy.

#### Scenario: Publish URL row uses secondary affixes and primary input
- **WHEN** the publish dialog is rendered
- **THEN** the `https://` prefix and `.wiki-wise.com` suffix use secondary text coloring matching the native publish sheet
- **AND** the editable subdomain input remains primary text rather than secondary text
- **AND** the URL row layout, typography, and availability indicator are not changed for this requirement

### Requirement: Publish Availability Hint Color Parity
The Electron publish dialog SHALL render availability hint text with the native state-specific foreground styling.

#### Scenario: Publish availability hint colors match native states
- **WHEN** the publish dialog renders an availability hint
- **THEN** available, checking, unknown, and fallback hints use secondary text coloring
- **AND** the owned hint uses blue text coloring
- **AND** the taken hint uses red text coloring
- **AND** the invalid hint uses orange text coloring
- **AND** availability hint copy, publish eligibility, and inline indicator styling are not changed for this requirement

### Requirement: Publish Dialog Actions Spacing Parity
The Electron publish dialog SHALL render the action row with native publish sheet spacing.

#### Scenario: Publish actions rely on native content gap
- **WHEN** the publish dialog is rendered
- **THEN** the action row has no extra top margin beyond the publish dialog content gap
- **AND** shared modal action spacing for other dialogs is not changed for this requirement
- **AND** publish action labels, ordering, keyboard behavior, and disabled state are not changed for this requirement

### Requirement: Publish Token Warning Line Spacing Parity
The Electron publish dialog SHALL render the publish-token warning paragraph with native publish sheet line spacing.

#### Scenario: Publish token warning uses native line spacing
- **WHEN** the publish dialog is rendered
- **THEN** the publish-token warning paragraph uses line spacing equivalent to the native 12pt text with `.lineSpacing(2)`
- **AND** global summary line height for other paragraphs is not changed for this requirement
- **AND** publish-token warning copy, color, font size, and dialog content gap are not changed for this requirement

### Requirement: Publish Toolbar Button Style Parity
The Electron publish toolbar action SHALL render with the native compact publish badge styling.

#### Scenario: Toolbar publish action uses native badge styling
- **WHEN** a project toolbar is rendered
- **THEN** the publish action uses native monospaced 10px text, 0.8px tracking, selected foreground color, selected background fill, sidebar-rule border, 3px corner radius, and 4px by 10px padding
- **AND** shared icon toolbar button styling is not changed for this requirement
- **AND** publish labels, disabled state, help text, and dialog behavior are not changed for this requirement

### Requirement: Publish Toolbar Busy Indicator Parity
The Electron publish toolbar action SHALL render a native-equivalent busy indicator while publishing work is in progress.

#### Scenario: Toolbar publish action shows busy indicator
- **WHEN** publishing or unpublishing is in progress
- **THEN** the publish toolbar action shows a 12px inline busy indicator before the `PUBLISHING…` label
- **AND** the busy indicator is hidden when the publish action is idle
- **AND** publish labels, disabled state, help text, badge styling, and dialog behavior are not changed for this requirement

### Requirement: Publish Dialog Runtime Evidence

The Electron publishing implementation SHALL have live runtime evidence for first-publish dialog behavior in addition to static native parity tests.

#### Scenario: Runtime evidence covers first-publish dialog surface

- **WHEN** the Electron runtime audit opens the publish dialog for an unpublished project
- **THEN** retained evidence proves the dialog shows the native title, generated subdomain, URL affixes, token warning, availability hint, and inline availability indicator
- **AND** retained evidence proves `Publish` is disabled before availability permits publishing
- **AND** retained evidence proves the first-publish dialog hides the `Unpublish...` action
- **AND** retained evidence proves canceling the dialog leaves the project editor audit state restored

#### Scenario: Runtime evidence does not claim publishing success

- **WHEN** first-publish dialog runtime evidence is retained
- **THEN** it does not claim that publishing, publish-result feedback, publish-error feedback, or unpublish runtime flows have been fully exercised
- **AND** those flows remain eligible for later runtime evidence changes

### Requirement: Publish Feedback Runtime Evidence

The Electron publishing implementation SHALL have live runtime evidence for publish success, publish error, external open, and unpublish confirmation flows in addition to static native parity tests.

#### Scenario: Runtime evidence covers publish success feedback

- **WHEN** the Electron runtime audit completes a first-publish flow with mocked publish success
- **THEN** retained evidence proves the native `Published!` modal title and first-publish result body are shown
- **AND** retained evidence proves the duplicate standalone result URL remains hidden
- **AND** retained evidence proves `Open in Browser` routes the published URL through preload and dismisses the result
- **AND** retained evidence proves published config state refreshes after success

#### Scenario: Runtime evidence covers publish error feedback

- **WHEN** the Electron runtime audit completes a publish flow with mocked publish failure
- **THEN** retained evidence proves the native `Publish Error` modal title and failure message are shown
- **AND** retained evidence proves dismissing the error re-enables publish controls

#### Scenario: Runtime evidence covers unpublish feedback

- **WHEN** the Electron runtime audit starts from a mocked published project
- **THEN** retained evidence proves the publish dialog shows `Unpublish...`
- **AND** retained evidence proves the native `Unpublish wiki?` confirmation is shown
- **AND** retained evidence proves confirming unpublish calls preload and clears published config state

### Requirement: Publish Error Copy Parity
The Electron app SHALL surface native publish failure descriptions in publish error feedback.

#### Scenario: Publish helper rejects with native copy
- **WHEN** publishing fails through the shared publish helper
- **THEN** the Electron renderer stores the thrown failure message
- **AND** the publish error modal displays that message under the native `Publish Error` title
- **AND** the modal keeps its native `OK` dismissal behavior

#### Scenario: Publish copy remains source-aligned
- **WHEN** native `Publisher.PublishError.errorDescription` defines fixed copy for corrupt config, token mismatch, subdomain taken, or rate limiting
- **THEN** Electron/shared publish tests retain assertions that those native strings are represented in the shared helper behavior

### Requirement: First Publish Generated Subdomain Prefix Parity
The Electron app SHALL display first-publish generated subdomain candidates whose shared-core prefix behavior matches native `Publisher.randomSubdomain(wikiName:)`.

#### Scenario: Unicode project name generates candidate
- **WHEN** the first-publish dialog is opened for a project whose name contains retained supplementary-plane Unicode letters or numbers
- **THEN** the generated subdomain candidate keeps the native-compatible first 20 sanitized characters before the random suffix
- **AND** the suffix remains a hyphen plus six lowercase alphanumeric characters

#### Scenario: Generated candidate remains source-aligned
- **WHEN** native `Publisher.randomSubdomain(wikiName:)` defines `.prefix(20)` truncation after filtering
- **THEN** Electron/shared publish tests retain assertions that shared candidate generation truncates by characters instead of UTF-16 code units

### Requirement: Publish Conflict Retry Subdomain Parity
The Electron app SHALL inherit native first-publish conflict retry subdomain behavior from the shared publish helper.

#### Scenario: First-publish conflict retry matches native
- **WHEN** Electron publishes a project with no saved `publish.json`
- **AND** the publish service reports a first-candidate `409` conflict that the shared helper retries automatically
- **THEN** the first generated candidate may use the project-name prefix
- **AND** the retry candidate is generated without the project-name prefix, matching native `Publisher.publish`
- **AND** publish dialog state, result feedback, error feedback, availability checks, and unpublish behavior remain unchanged

#### Scenario: Retry behavior remains source-aligned
- **WHEN** native `Publisher.publish` calls `randomSubdomain(wikiName: projectRoot.lastPathComponent)` initially and `randomSubdomain()` on `409` retry
- **THEN** Electron/shared tests retain assertions that the shared helper distinguishes the initial project-name candidate from the suffix-only retry candidate

### Requirement: Publish Config Refresh Fallback Parity
Electron publishing state refresh SHALL mirror native `ContentView.loadPublishConfig()` best-effort behavior while preserving corrupt-config errors for user-initiated publish actions.

#### Scenario: Malformed publish config is refreshed
- **WHEN** Electron refreshes publish config state for a project whose `publish.json` is malformed
- **THEN** the refresh path returns unpublished publish state with a suggested subdomain
- **AND** the project service refresh and toolbar state are not interrupted by the corrupt config

#### Scenario: Malformed publish config is used for publishing
- **WHEN** Electron publishes or unpublishes a project whose `publish.json` is malformed
- **THEN** the existing native corrupt-config publish error is still surfaced
- **AND** the refresh fallback does not hide user-action failures
