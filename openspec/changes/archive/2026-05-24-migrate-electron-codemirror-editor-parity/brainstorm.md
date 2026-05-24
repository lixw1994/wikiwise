## Brainstorm

The final parity scan found that Electron still uses a plain `<textarea>` for source editing while the native macOS app uses the bundled `editor.html` CodeMirror surface. This creates a real user-visible mismatch: markdown highlighting, editor keybindings, scroll fraction helpers, and the exact editor styling are not shared.

Considered approaches:

- Keep the textarea and style it closer to native. This is low risk but does not satisfy the "same as native" target.
- Add a new Electron-specific CodeMirror bundle. This duplicates the native editor surface and risks drift.
- Reuse the existing bundled `editor.html` and `codemirror-bundle.js` in Electron, adding a browser `postMessage` bridge while preserving the Swift `window.webkit.messageHandlers` bridge.

Chosen approach: reuse the native editor resource and expose it through a sandboxed Electron iframe. The renderer will load content with `setContent`, receive debounced changes through `postMessage`, use `getContent` for saves, and retain scroll fraction through the native helper functions.
