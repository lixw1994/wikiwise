## ADDED Requirements

### Requirement: Native-Compatible Wiki Scaffold

The core package SHALL expose helpers that create a scaffolded wiki matching the native `WikiScaffold` output.

#### Scenario: Wiki scaffold is created

- **WHEN** JavaScript creates a wiki scaffold with a repository root, parent directory, and wiki name
- **THEN** the target directory uses the native slug behavior for the wiki name
- **AND** native scaffold directories are created
- **AND** `CLAUDE.md` receives the human-readable wiki name
- **AND** `wiki/home.md` receives the created wiki path
- **AND** seed pages, agent instructions, skills, settings, build tooling, support files, scaffold version, and `.gitignore` are written

#### Scenario: Invalid scaffold input is rejected

- **WHEN** JavaScript creates a wiki scaffold with an empty wiki name
- **THEN** the helper rejects the request before writing scaffold content
