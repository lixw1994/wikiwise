## Why

Electron's post-creation guide still differs from the native SwiftUI copy for the agent startup step. The native app tells users to use the built-in terminal in the right sidebar, while Electron omits that location detail.

## What Changes

- Align the Electron post-creation guide terminal instruction with native copy: `Use the built-in terminal in the right sidebar, or open your own terminal:`.
- Keep the existing agent commands, seed options, dismiss action, and scaffold behavior unchanged.
- Add a native-source parity test that prevents the shorter Electron-only copy from returning.

## Success Criteria

- Electron shows the native terminal instruction in the post-creation guide.
- Electron no longer shows the shorter `Use the built-in terminal, or open your own terminal:` sentence.
- Targeted Electron new-wiki scaffold tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not change scaffold creation, agent command generation, seed option copy, or guide layout.
- Do not change terminal startup behavior.
- Do not claim full new-wiki parity beyond this guide-copy slice.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-new-wiki-scaffold`: Require the native post-creation guide terminal instruction copy.

## Impact

- Affected code: Electron renderer markup, Electron new-wiki scaffold tests, OpenSpec specs.
- No Swift source changes are planned.
- No dependency changes are planned.
