## ADDED Requirements

### Requirement: Native-Compatible New Wiki Empty Slug Handling
The core package SHALL create new wiki scaffolds with native `ContentView.createNewWiki()` empty-slug semantics.

#### Scenario: Non-empty name filters to an empty slug
- **WHEN** JavaScript creates a new wiki with a name that is non-empty after trimming but sanitizes to an empty slug
- **THEN** the helper does not reject the name as unsluggable
- **AND** the target path resolves to the selected parent directory, matching native empty path-component behavior
- **AND** scaffold files and template replacements are still written

#### Scenario: Whitespace-only name remains rejected
- **WHEN** JavaScript creates a new wiki with a name that is empty after trimming whitespace
- **THEN** the helper rejects before writing target content
