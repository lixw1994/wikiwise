## ADDED Requirements

### Requirement: Populated Info Runtime Evidence

The Electron runtime parity audit SHALL retain evidence that populated optional INFO sections match the native right-sidebar behavior for a markdown document with `directions:` frontmatter and wikilinks.

#### Scenario: Runtime audit records populated INFO sections

- **WHEN** the runtime audit captures an opened scaffold project
- **THEN** it creates a deterministic markdown fixture with `directions:` frontmatter and wikilinks
- **AND** it selects that fixture through the Electron file tree
- **AND** it activates the INFO tab
- **AND** it records that the Directions section is visible with the expected directions text
- **AND** it records that the Linked section is visible with the expected wikilink target
- **AND** it restores the selected `home.md` editor audit state after the populated INFO evidence is captured

#### Scenario: Runtime audit fails missing populated INFO evidence

- **WHEN** the populated INFO fixture is selected during runtime audit
- **THEN** runtime audit fails if the fixture cannot be selected
- **AND** runtime audit fails if the Directions section is hidden or contains the wrong text
- **AND** runtime audit fails if the Linked section is hidden or omits the expected wikilink target
- **AND** runtime audit fails if the audit cannot restore the selected `home.md` editor state
