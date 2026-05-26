## Why

The native SwiftUI app starts with `DetailMode.compiled`, so a standalone markdown file opened from the picker keeps the WIKI toolbar mode selected even though it falls back to the editor because no compiled project preview exists. Electron currently switches standalone files to FILE mode when no compiled preview is attached, leaving a visible toolbar state mismatch.

## What Changes

- Preserve native compiled/WIKI detail mode as the initial mode for standalone markdown file opens.
- Keep the existing editor fallback when WIKI mode has no compiled preview, matching SwiftUI's detail view fallback.
- Keep folder project behavior unchanged: project home pages with compiled output still open in WIKI mode, and non-markdown standalone files still show the editor.
- Add source-level tests for the native state default and Electron standalone fallback behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-project-lifecycle`: Clarify standalone markdown opens preserve native WIKI detail mode selection while using editor fallback.
- `electron-compiler-preview`: Clarify WIKI mode selection and no-preview fallback behavior for markdown files.
- `electron-native-parity-roadmap`: Record standalone detail mode parity as a native project/detail closure phase.

## Impact

- Affects Electron renderer project-result application and selected-file mode derivation.
- Affects Electron project lifecycle and compiler preview tests.
- No main-process IPC, SwiftUI source, scaffold output, dependency, packaging, or release flow changes.
