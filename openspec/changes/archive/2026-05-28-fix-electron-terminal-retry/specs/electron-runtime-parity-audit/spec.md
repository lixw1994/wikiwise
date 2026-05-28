## MODIFIED Requirements

### Requirement: Packaged Runtime Smoke Audit
The repository SHALL provide a repeatable packaged Electron runtime smoke audit for `apps/electron/out/Wikiwise.app`.

#### Scenario: Packaged audit command runs
- **WHEN** the packaged runtime smoke audit command completes successfully after `npm run electron:package:mac`
- **THEN** it launches `apps/electron/out/Wikiwise.app`
- **AND** it writes `apps/electron/out/packaged-runtime-audit/report.json`
- **AND** the report records that the packaged app loaded its packaged renderer through its packaged preload
- **AND** the report records packaged `@wikiwise/core`, native resource, `node-pty`, and Darwin `spawn-helper` executable-permission evidence
- **AND** the report records that the packaged `node-pty` path started a real PTY and echoed a terminal smoke command

#### Scenario: Packaged audit fails
- **WHEN** the packaged app cannot launch, cannot load the packaged renderer, cannot observe the packaged preload bridge, cannot spawn a packaged PTY, cannot echo the packaged PTY smoke command, or is missing required packaged runtime files
- **THEN** the packaged runtime smoke audit exits nonzero
