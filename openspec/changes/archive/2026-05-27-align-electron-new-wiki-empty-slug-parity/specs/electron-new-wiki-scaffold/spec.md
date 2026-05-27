## ADDED Requirements

### Requirement: New Wiki Empty Slug Parity
The Electron create-new-wiki flow SHALL inherit native empty-slug behavior from the shared scaffold helper.

#### Scenario: Non-empty punctuation name follows native scaffold target
- **WHEN** Electron creates a wiki with a non-empty name whose sanitized slug is empty
- **THEN** the shared helper proceeds without an Electron-only sluggable-name error
- **AND** native scaffold structure, template replacements, post-create project loading, and guide behavior remain unchanged

#### Scenario: Empty-slug behavior remains source-aligned
- **WHEN** native `ContentView.createNewWiki()` trims whitespace before validation and does not guard against an empty filtered slug
- **THEN** Electron/shared tests retain assertions that shared scaffold creation does not reject an empty slug after filtering
