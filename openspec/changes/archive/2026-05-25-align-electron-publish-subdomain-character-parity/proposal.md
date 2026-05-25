## Why

The native publish sheet preserves all sanitized Unicode letters and numbers when editing the subdomain, then lets availability feedback decide whether the name is valid. Electron currently filters to ASCII `a-z0-9-`, which removes characters the native sanitizer keeps before the availability check.

## What Changes

- Update Electron publish subdomain sanitization to preserve Unicode letters and numbers, matching Swift `isLetter` / `isNumber`.
- Keep lowercase conversion, hyphen preservation, invalid punctuation filtering, and no renderer length truncation.
- Preserve existing availability messaging and publish enablement behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require Electron subdomain input sanitization to match native Unicode letter and number preservation.

## Impact

- Affects Electron renderer publish dialog input handling.
- Adds publishing parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
