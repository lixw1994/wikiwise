# electron-codemirror-editor-parity Specification

## Purpose
Define how the Electron app handles source editing with the bundled CodeMirror editor resource, bridge behavior, save path, and scroll helpers.

## Requirements
### Requirement: Shared CodeMirror Editor Resource

The Electron app SHALL use the bundled Electron CodeMirror editor resource for source editing.

#### Scenario: Source editor renders

- **WHEN** a user selects File mode for an editable file
- **THEN** Electron loads `apps/electron/resources/editor.html`
- **AND** the editor loads `codemirror-bundle.js`
- **AND** no plain textarea is used as the active source editor surface

### Requirement: Electron Editor Bridge

The shared editor resource SHALL support Electron message passing while keeping the editor bridge reusable.

#### Scenario: Editor content changes

- **WHEN** CodeMirror content changes in Electron
- **THEN** the editor sends a debounced content-changed message to the parent renderer
- **AND** the renderer updates dirty/save state from that content
- **AND** the `window.webkit.messageHandlers.contentChanged` compatibility path remains present

### Requirement: Editor Save And Scroll Parity

Electron source editing SHALL save and restore CodeMirror content and scroll position through the shared editor helper functions.

#### Scenario: File is saved from CodeMirror

- **WHEN** the user saves or autosaves an edited file
- **THEN** Electron reads the current content from the CodeMirror iframe
- **AND** writes that content through the existing save IPC path

#### Scenario: Editor is restored

- **WHEN** the selected file or view mode changes back to source editing
- **THEN** Electron calls the editor content setter
- **AND** restores the saved scroll fraction through the shared editor helper
