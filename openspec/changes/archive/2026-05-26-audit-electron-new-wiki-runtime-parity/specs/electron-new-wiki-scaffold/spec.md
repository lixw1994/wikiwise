## ADDED Requirements

### Requirement: New Wiki Runtime Creation Evidence
The Electron scaffold/new-wiki phase SHALL retain runtime evidence for the complete create-new-wiki workflow.

#### Scenario: New wiki is created during runtime audit
- **WHEN** Electron creates a new wiki from the welcome screen in runtime audit
- **THEN** it creates the native scaffolded wiki under the selected parent directory
- **AND** it opens the created project
- **AND** it starts project services for the created wiki
- **AND** it displays the native post-create guide
- **AND** dismissing the guide starts reading `wiki/home.md`

## MODIFIED Requirements

### Requirement: Deferred Scaffold Gaps

The scaffold/new wiki phase SHALL identify native creation gaps that remain for later OpenSpec phases.

#### Scenario: New wiki creation is available

- **WHEN** Electron can create and open scaffolded wikis
- **THEN** the phase verification records only scaffold/new-wiki gaps that remain deferred after later parity slices are archived
- **AND** built-in terminal, publishing setup, persistence, and native modal polish are not listed as deferred once their parity evidence has been archived
