## Why

The Electron publish dialog still exposes non-native availability hint copy. SwiftUI shows `Anyone with this link can view your wiki.` for the default, available, and checking states, while Electron currently says `Available` and `Checking...`. SwiftUI also uses the typographic range `3–48` for invalid subdomains, while Electron uses `3-48`.

## What Changes

- Align Electron publish availability hint text with native SwiftUI state copy.
- Keep `taken` and `owned` messages unchanged because they already match native copy.
- Use `Anyone with this link can view your wiki.` for `available`, `checking`, `unknown`, and fallback states.
- Use `3–48 characters, letters, numbers, and hyphens only.` for invalid subdomains.
- Add a structural parity test that compares the Electron renderer availability messages with the SwiftUI source.

## Success Criteria

- Electron publish availability hints match native copy for available, checking, unknown/default, invalid, taken, and owned states.
- Publish availability state transitions and publish enablement behavior remain unchanged.
- Targeted Electron publishing tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not add a spinner or visual availability icon parity in this slice.
- Do not change availability API responses, debouncing, sanitization, or publish eligibility.
- Do not change publish result, unpublish, or publish dialog layout behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Strengthen availability feedback to require native hint copy for each user-visible state.

## Impact

- Affected code: Electron renderer JavaScript, Electron publishing tests, OpenSpec specs.
- No Swift source changes are planned.
- No dependency changes are planned.
