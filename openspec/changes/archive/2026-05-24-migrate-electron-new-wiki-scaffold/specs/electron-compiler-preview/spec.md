## MODIFIED Requirements

### Requirement: Open Wiki Home Preview

Opening or creating a wiki folder SHALL compile and select `wiki/home.md` when that file exists.

#### Scenario: User opens a scaffolded wiki folder

- **WHEN** the selected folder contains `wiki/home.md`
- **THEN** Electron compiles the project metadata
- **AND** compiles the `home` page
- **AND** the renderer selects `wiki/home.md` with Wiki mode available

#### Scenario: User creates a scaffolded wiki

- **WHEN** the created wiki contains `wiki/home.md`
- **THEN** Electron compiles the project metadata
- **AND** compiles the `home` page
- **AND** the renderer can switch from the post-create guide to Wiki mode for `wiki/home.md`
