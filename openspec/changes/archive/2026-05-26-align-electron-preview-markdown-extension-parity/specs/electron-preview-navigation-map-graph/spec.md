## ADDED Requirements

### Requirement: Preview Markdown Extension Case Parity
Electron preview navigation SHALL match native Swift markdown-source candidate filtering when resolving local HTML links back to markdown files.

#### Scenario: Candidate source uses uppercase markdown extension
- **WHEN** a local compiled-preview link maps by slug to a source file whose extension is uppercase, such as `Target.MD`
- **THEN** Electron does not select that uppercase-extension file through preview markdown-source lookup
- **AND** Electron continues to generated-page fallback handling

#### Scenario: Direct uppercase markdown selection remains supported
- **WHEN** the user directly opens or selects an uppercase-extension markdown file such as `Target.MD`
- **THEN** Electron keeps the existing direct markdown file handling for editing and preview compilation
