## MODIFIED Requirements

### Requirement: Local Package Guardrail

The Electron packaging phase SHALL preserve the distinction between local unsigned app packaging and canonical signed release distribution.

#### Scenario: Local package command is documented

- **WHEN** a developer reads the Electron packaging documentation
- **THEN** it states that the local Electron app bundle is unsigned
- **AND** it states that production release distribution uses `bash scripts/build-release.sh <version>`
- **AND** it states that the production release path signs the app, creates a DMG, submits notarization, and staples the ticket
