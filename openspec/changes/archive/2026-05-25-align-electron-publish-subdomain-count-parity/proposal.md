## Why

The native publish sheet uses Swift `String.count` when deciding whether a sanitized subdomain is too short. After Electron began preserving Unicode letters and numbers, its JavaScript `.length` check can count some visible characters differently because `.length` measures UTF-16 code units.

## What Changes

- Count Electron publish subdomain input as visible Unicode characters for local minimum-length feedback.
- Preserve existing lowercase, Unicode letter/number filtering, hyphen preservation, no length truncation, and availability messages.
- Keep server-side availability validation unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require Electron local subdomain length feedback to count sanitized input like the native publish sheet rather than JavaScript UTF-16 code units.

## Impact

- Affects Electron renderer publish dialog availability scheduling.
- Adds publishing parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
