## Why

Several archived Electron migration specs still contain generated `Purpose` placeholders from archive time. The final native-parity audit depends on those specs being authoritative, so their purpose sections need to describe the retained contract rather than leftover scaffolding.

## What Changes

- Replace generated `Purpose` placeholders in archived OpenSpec main specs with concrete purpose statements.
- Add a lightweight repository guard that fails when generated purpose-placeholder text is reintroduced under `openspec/specs`.
- Record this cleanup as a roadmap evidence phase so the final migration audit can cite spec hygiene explicitly.
- Stabilize the runtime audit success shutdown path if verification reaches passing scenario evidence but Electron traps during immediate process exit.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-native-parity-roadmap`: add phase completion tracking for OpenSpec purpose hygiene and retained placeholder-scan evidence.
- `electron-runtime-parity-audit`: require a successful runtime audit to exit cleanly after writing passing report and screenshot evidence.

## Impact

- Affects archived OpenSpec spec text under `openspec/specs`.
- Adds Node test coverage for OpenSpec spec hygiene.
- Affects the Electron runtime audit success shutdown path only.
- Does not change SwiftUI, Electron runtime, packaging, signing, notarization, or release artifact behavior.
