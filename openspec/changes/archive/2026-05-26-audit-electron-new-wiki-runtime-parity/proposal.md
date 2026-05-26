## Why

Electron new-wiki creation has source-level coverage and extensive style parity checks, but the runtime audit still never exercises the live flow from the welcome screen. The native macOS app treats create-new-wiki as a first-run core workflow, so final Electron parity needs retained runtime evidence that creation, project opening, guide display, and guide dismissal work through the real renderer/preload path.

## What Changes

- Extend the Electron runtime parity audit with new-wiki creation scenarios that start from the welcome screen.
- Make the audit harness create a scaffolded wiki under the runtime-audit output directory instead of throwing for `wikiwise:createNewWiki`.
- Record evidence for native new-wiki dialog chrome, enabled Create behavior, scaffold creation, opened-project state, post-create guide copy/commands, and dismiss-to-`home.md` behavior.
- Fail new-wiki runtime scenarios when dialog, creation, guide, watcher/service startup, or home-selection evidence is missing.
- Update the scaffold spec so terminal, publishing, persistence, and modal-polish work are no longer listed as deferred after their later parity phases and runtime evidence exist.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-runtime-parity-audit`: add runtime evidence and assertions for the new-wiki creation workflow.
- `electron-new-wiki-scaffold`: add runtime new-wiki creation evidence and retire stale deferred scaffold gap wording.

## Impact

- Affected code: `scripts/audit-electron-runtime.mjs`, `apps/electron/test/runtime-parity-audit.test.js`.
- Affected specs: `openspec/specs/electron-runtime-parity-audit/spec.md`, `openspec/specs/electron-new-wiki-scaffold/spec.md`.
- No production Swift, scaffold template, dependency, signing, notarization, or release workflow changes are expected.
