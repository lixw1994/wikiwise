## Why

The packaged Electron app still needs a small set of `Info.plist` keys that the native Swift app does not declare because they describe Electron runtime behavior. Those package-only keys need an explicit parity audit so future Electron template metadata cannot silently reintroduce native-visible drift.

## What Changes

- Add a package-time audit that compares the packaged Electron `Info.plist` against the current native app `Info.plist`.
- Allow package-only plist keys only when they are listed as Electron runtime metadata.
- Fail the local package command when any unexpected package-only plist key remains after template cleanup.
- Document and retain verification evidence for the allowed Electron runtime plist delta without treating it as final signed/notarized release completion.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-macos-packaging`: Require an explicit package-only `Info.plist` key allowlist for Electron runtime metadata.
- `electron-native-parity-roadmap`: Record this package-only plist delta audit as a packaging/release parity closure phase while keeping the final release gate explicit.

## Impact

- Affects `scripts/package-electron-macos.mjs` package validation.
- Extends Electron packaging tests under `apps/electron/test/`.
- Updates Electron packaging documentation and OpenSpec packaging/roadmap specs.
