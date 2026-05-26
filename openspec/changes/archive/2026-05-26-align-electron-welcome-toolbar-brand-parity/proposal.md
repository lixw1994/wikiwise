## Why

The SwiftUI no-folder state includes a native toolbar brand row with the italic `W` mark and `WikiWise` title. The Electron welcome state currently renders only the centered welcome content, so its first visual frame still differs from the macOS native app.

## What Changes

- Add a welcome toolbar brand row to the Electron no-folder renderer state.
- Match the native toolbar content, typography, spacing, and warm toolbar background.
- Extend runtime audit evidence so welcome scenarios fail if the toolbar brand row is missing.
- Preserve existing welcome actions, create/open flows, and opened-project toolbar behavior.

## Capabilities

### New Capabilities

### Modified Capabilities

- `electron-native-shell-parity`: Welcome content now includes native toolbar brand chrome.
- `electron-runtime-parity-audit`: Runtime audit records and asserts welcome toolbar brand evidence.
- `electron-native-parity-roadmap`: Roadmap records this final visible shell parity closure while preserving the release gate.

## Impact

- Affected files: Electron renderer HTML/CSS, native shell tests, runtime audit script/tests, and OpenSpec shell/runtime specs.
- No dependency or Swift source changes.
- No change to release signing/notarization gates.
