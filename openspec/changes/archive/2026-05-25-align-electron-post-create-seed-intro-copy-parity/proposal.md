## Why

Electron's post-creation guide still skips the native seed-options intro sentence. The SwiftUI guide tells users `Once your agent is running, try:` before listing seed commands, so Electron should expose the same guidance in this first-run workflow.

## What Changes

- Add the native `Once your agent is running, try:` sentence to the Electron post-creation guide before the seed option list.
- Keep the existing seed option titles, commands, guide layout, dismiss action, and scaffold behavior unchanged.
- Add native-source parity test coverage so the sentence cannot disappear again.

## Success Criteria

- Electron shows `Once your agent is running, try:` in the post-creation guide.
- The sentence appears after `SEED YOUR WIKI` and before the seed option list.
- Targeted Electron new-wiki scaffold tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not change scaffold creation, agent command generation, seed option command copy, or guide dismissal behavior.
- Do not change terminal startup behavior or right-sidebar behavior.
- Do not claim full new-wiki parity beyond this guide-copy slice.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-new-wiki-scaffold`: Require the native seed-options intro sentence in the post-creation guide.

## Impact

- Affected code: Electron renderer markup, Electron new-wiki scaffold tests, OpenSpec specs.
- No Swift source changes are planned.
- No dependency changes are planned.
