## Why

Electron's post-creation guide visually uppercases two section headings with CSS, while the native SwiftUI app stores those headings as uppercase text literals. That leaves a source/DOM/accessibility text mismatch in a surface where the acceptance bar is native parity.

## What Changes

- Align the Electron post-creation guide headings with the native literals: `OPEN YOUR AGENT` and `SEED YOUR WIKI`.
- Keep the existing visual styling, agent commands, seed options, dismiss action, and scaffold behavior unchanged.
- Add a native-source parity test that prevents the title-case Electron strings from returning.

## Success Criteria

- Electron markup contains `OPEN YOUR AGENT` and `SEED YOUR WIKI` exactly.
- Electron markup no longer contains the title-case `Open your agent` or `Seed your wiki` guide headings.
- Targeted Electron new-wiki scaffold tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not change scaffold creation, agent command generation, seed option copy, or guide layout.
- Do not change CSS casing behavior outside the literal text alignment.
- Do not claim full new-wiki parity beyond this guide-heading slice.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-new-wiki-scaffold`: Require native post-creation guide section heading text.

## Impact

- Affected code: Electron renderer markup, Electron new-wiki scaffold tests, OpenSpec specs.
- No Swift source changes are planned.
- No dependency changes are planned.
