## ADDED Requirements

### Requirement: Raw Generated Link Routing Parity
Electron preview navigation SHALL match native Swift behavior for raw generated HTML links by treating raw namespaced HTML output as generated output rather than markdown-backed file selection.

#### Scenario: Raw generated page link is selected
- **WHEN** the user selects a local compiled-preview link whose target is a raw generated page such as `raw-source.html`
- **THEN** Electron displays the generated raw HTML page
- **AND** Electron does not select the matching `raw/source.md` markdown file

#### Scenario: Direct raw markdown selection still compiles with raw namespace
- **WHEN** the user directly selects a raw markdown file such as `raw/source.md`
- **THEN** Electron keeps compiling that file with the raw generated slug namespace
- **AND** the selected raw file can still render the corresponding `raw-source.html` preview output
