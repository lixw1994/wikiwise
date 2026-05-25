## Why

The native SwiftUI file tree gives top-level folders exact help text with em dash punctuation, while Electron currently uses plain hyphens for the same folder tooltips. The visible tree is close, but macOS help/tooltip text still diverges from the native app.

## What Changes

- Align Electron `wiki`, `sources`, and `raw` folder tooltip copy with the native SwiftUI `folderTooltip(_:)` strings.
- Preserve existing file tree rendering, selection, expansion, icons, and special-folder styling.
- Add native-source parity tests that prevent the hyphenated Electron-only tooltip copy from returning.

## Success Criteria

- Electron folder tooltip copy matches native strings:
  - `Wiki pages — your editable knowledge base`
  - `Source summaries — one page per ingested source`
  - `Raw source documents — read-only originals`
- Electron renderer no longer contains the hyphenated tooltip variants for those folders.
- Targeted Electron file tree parity tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not change file tree loading, expansion, filtering, ordering, or selection behavior.
- Do not change folder icon visuals or selected row styling.
- Do not claim full migration completion beyond this tooltip-copy slice.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-file-tree-visual-parity`: Require native folder tooltip/help copy for special top-level folders.

## Impact

- Affected code: Electron renderer folder tooltip helper, Electron file-tree tests, OpenSpec specs.
- No Swift source changes are planned.
- No dependency changes are planned.
