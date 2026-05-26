## Why

The native SwiftUI app does not change `detailMode` when a user opens a non-Markdown text file; it only renders the editor because that file type cannot show a compiled wiki preview. Electron currently forces non-Markdown selections into FILE mode, so the toolbar selected state can diverge from the native app even though both apps show the editor.

## What Changes

- Preserve the current Electron FILE/WIKI mode selection when a non-Markdown text file is selected.
- Continue rendering the source editor for non-Markdown files regardless of the selected mode, matching SwiftUI's detail rendering branch.
- Update existing parity tests and specs that previously treated forced FILE selection for non-Markdown files as desired behavior.
- Preserve markdown WIKI default behavior, compiled preview fallback, standalone file opening, save behavior, and generated page rendering.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-project-lifecycle`: Align standalone and selected non-Markdown file detail-mode state with native SwiftUI behavior.
- `electron-compiler-preview`: Clarify that editor fallback for non-Markdown files is a rendering decision, not a mode-selection reset.
- `electron-native-parity-roadmap`: Track this detail-mode parity correction as a final native behavior gap closure phase.

## Impact

- Affected code: `apps/electron/src/renderer/renderer.js`
- Affected tests: `apps/electron/test/project-lifecycle.test.js`, `apps/electron/test/compiler-preview.test.js`
- Affected specs: project lifecycle, compiler preview, native parity roadmap
- No Swift runtime, IPC, filesystem, packaging, release, or dependency changes.
