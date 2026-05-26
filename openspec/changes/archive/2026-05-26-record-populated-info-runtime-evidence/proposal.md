## Why

The runtime audit currently verifies that empty optional INFO sections stay hidden, but populated right-sidebar INFO behavior is still proven mainly by static tests. Final native parity evidence should exercise the live Electron renderer with a markdown document that has `directions:` frontmatter and wikilinks, matching the SwiftUI `RightSidebar` behavior.

## What Changes

- Add a populated INFO markdown fixture to the Electron runtime audit project.
- Extend the runtime audit to select that document, activate the INFO tab, and retain DOM evidence for the Directions callout and Linked rows.
- Fail the runtime audit if populated Directions or Linked content is missing or if the audit does not restore the selected `home.md` editor state afterward.
- Record this as a runtime parity evidence closure phase without changing the signed/notarized release gate.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-runtime-parity-audit`: Require populated INFO tab runtime evidence for documents with directions and wikilinks.
- `electron-native-parity-roadmap`: Track populated INFO runtime evidence as a native runtime parity evidence phase.

## Impact

- Affects `scripts/audit-electron-runtime.mjs` runtime fixture setup, DOM capture, and assertions.
- Extends Electron runtime-audit tests under `apps/electron/test/`.
- Updates OpenSpec runtime audit and roadmap specs.
