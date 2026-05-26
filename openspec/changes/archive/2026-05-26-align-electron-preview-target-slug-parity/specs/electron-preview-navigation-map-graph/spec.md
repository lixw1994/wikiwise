## ADDED Requirements

### Requirement: Preview Target Slug Normalization Parity
Electron preview navigation SHALL derive local HTML target slugs with the same filename normalization as native Swift preview navigation.

#### Scenario: Local HTML target filename contains spaces
- **WHEN** the user selects a local compiled-preview link whose HTML target filename contains spaces, such as `My Page.html`
- **THEN** Electron normalizes the target slug to the native hyphenated form
- **AND** Electron can select the matching markdown-backed page such as `My Page.md`

#### Scenario: Generated fallback uses normalized target slug
- **WHEN** a local compiled-preview link with spaces in the HTML target filename has no matching markdown source
- **THEN** Electron checks generated output using the native-normalized slug filename
