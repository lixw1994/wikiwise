## Why

Electron now preserves compiled WIKI preview scroll position when switching modes or refreshing the same page, but the runtime parity audit does not prove that behavior through the real renderer. The migration goal requires parity with the native macOS app, so this native WebView behavior needs repeatable Electron audit evidence.

## What Changes

- Extend the Electron runtime parity audit to exercise compiled preview scroll restoration before switching to FILE mode.
- Record DOM evidence that the preview frame scrolled, returned to WIKI mode, and restored the prior scroll fraction.
- Fail project audit scenarios when compiled preview scroll restoration evidence is missing or below parity tolerance.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-runtime-parity-audit`: add runtime audit evidence and assertions for compiled WIKI preview scroll preservation.

## Impact

- Affected code: `scripts/audit-electron-runtime.mjs`, `apps/electron/test/runtime-parity-audit.test.js`.
- Affected specs: `openspec/specs/electron-runtime-parity-audit/spec.md`.
- No API, dependency, release, or Swift surface changes are expected.
