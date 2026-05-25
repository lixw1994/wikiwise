# electron-new-wiki-scaffold Specification

## Purpose
TBD - created by archiving change migrate-electron-new-wiki-scaffold. Update Purpose after archive.
## Requirements
### Requirement: New Wiki Dialog

The Electron app SHALL provide a create-new-wiki flow from the welcome screen that captures a wiki name and target location.

#### Scenario: User opens create flow

- **WHEN** the user chooses Create a New Wiki from the welcome screen
- **THEN** Electron shows a dialog with a wiki name field
- **AND** it shows a target location initialized to the user's `wikis` folder
- **AND** it lets the user choose a different parent directory through the main process
- **AND** the location chooser action uses the native `Choose…` label
- **AND** the Create action is disabled while the trimmed wiki name is empty

### Requirement: Scaffolded Wiki Creation

The Electron app SHALL create the same scaffolded wiki folder shape as the native app.

#### Scenario: User creates a wiki

- **WHEN** the user submits a valid wiki name and location
- **THEN** Electron creates a slug-named wiki directory under the chosen parent location
- **AND** it creates native scaffold directories, seed wiki pages, agent instructions, skills, settings, version marker, `.gitignore`, and build tooling
- **AND** template placeholders are replaced with the human-readable wiki name and created wiki path

### Requirement: Post-Creation Guide

The Electron app SHALL show a post-creation guide after opening a newly created wiki.

#### Scenario: Wiki is created successfully

- **WHEN** Electron finishes creating a new wiki
- **THEN** it opens the created project as the current wiki
- **AND** it starts project watching for that wiki
- **AND** it displays native guide copy explaining agent startup and seed options
- **AND** it uses the native `WikiWise created the folder structure, build tools, and agent skills. Now seed it with sources.` summary
- **AND** it uses the native `Use the built-in terminal in the right sidebar, or open your own terminal:` terminal instruction
- **AND** it uses the native final guidance about changing anything with the user's agent
- **AND** the user can dismiss the guide with `Got it — start reading` and start reading `wiki/home.md`

### Requirement: Deferred Scaffold Gaps

The scaffold/new wiki phase SHALL identify native creation gaps that remain for later OpenSpec phases.

#### Scenario: New wiki creation is available

- **WHEN** Electron can create and open scaffolded wikis
- **THEN** the phase verification records that built-in terminal, publishing setup, persistence, and full native modal polish remain deferred
