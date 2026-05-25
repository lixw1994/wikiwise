## Why

The native publish sheet preserves the full sanitized subdomain text while checking availability. Electron currently truncates the subdomain input to 48 characters in the renderer, which changes the editable value before availability feedback can mirror the native flow.

## What Changes

- Stop truncating Electron publish subdomain input in the renderer sanitizer.
- Preserve the existing lowercase and allowed-character filtering behavior.
- Keep the native availability copy and publish enablement rules unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require Electron subdomain input sanitization to preserve native length behavior instead of truncating at 48 characters.

## Impact

- Affects Electron renderer publish dialog input handling.
- Adds publishing parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
