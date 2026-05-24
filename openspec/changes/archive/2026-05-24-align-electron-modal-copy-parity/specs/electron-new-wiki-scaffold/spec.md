## MODIFIED Requirements

### Requirement: New Wiki Dialog

The Electron app SHALL provide a create-new-wiki flow from the welcome screen that captures a wiki name and target location.

#### Scenario: User opens create flow

- **WHEN** the user chooses Create a New Wiki from the welcome screen
- **THEN** Electron shows a dialog with a wiki name field
- **AND** it shows a target location initialized to the user's `wikis` folder
- **AND** it lets the user choose a different parent directory through the main process
- **AND** the location chooser action uses the native `Choose…` label
- **AND** the Create action is disabled while the trimmed wiki name is empty

### Requirement: Post-Creation Guide

The Electron app SHALL show a post-creation guide after opening a newly created wiki.

#### Scenario: Wiki is created successfully

- **WHEN** Electron finishes creating a new wiki
- **THEN** it opens the created project as the current wiki
- **AND** it starts project watching for that wiki
- **AND** it displays native guide copy explaining agent startup and seed options
- **AND** it uses the native `WikiWise created the folder structure, build tools, and agent skills. Now seed it with sources.` summary
- **AND** it uses the native final guidance about changing anything with the user's agent
- **AND** the user can dismiss the guide with `Got it — start reading` and start reading `wiki/home.md`
