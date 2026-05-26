## Why

The native SwiftUI app opens existing content through an `NSOpenPanel` limited to folders and plain text files, while the Electron picker currently advertises broad code and HTML file filters plus an all-files escape hatch. Tightening the Electron picker removes a visible native-parity mismatch before final migration acceptance.

## What Changes

- Align the Electron "Open Existing" operating-system picker with the native panel's folder-or-plain-text intent.
- Keep folder selection and single-selection behavior unchanged.
- Replace the broad Electron file filters (`css`, `js`, `json`, `html`, and `All Files`) with markdown/plain-text file extensions.
- Add regression coverage comparing the Electron picker contract with the SwiftUI native panel contract.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-project-lifecycle`: Open-existing picker file filtering must match the native folder/plain-text behavior.
- `electron-native-parity-roadmap`: Track this picker-parity slice as a native project-lifecycle gap closure.

## Impact

- `apps/electron/src/main/main.js` open-existing dialog options.
- `apps/electron/test/project-lifecycle.test.js` parity coverage.
- OpenSpec delta specs and retained verification evidence for the Electron migration roadmap.
