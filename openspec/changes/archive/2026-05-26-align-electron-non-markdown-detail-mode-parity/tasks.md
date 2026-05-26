## 1. Regression Coverage

- [x] 1.1 Update compiler preview parity coverage to prove non-Markdown selections preserve the current FILE/WIKI mode while rendering the editor.
- [x] 1.2 Update project lifecycle parity coverage to prove standalone non-Markdown files preserve the native initial WIKI mode and editor fallback.

## 2. Renderer Parity

- [x] 2.1 Change renderer detail-mode initialization so non-Markdown files do not force FILE mode.
- [x] 2.2 Preserve markdown WIKI defaults, editor fallback, generated page priority, and non-Markdown editor rendering.

## 3. Verification

- [x] 3.1 Run targeted Electron tests for compiler preview and project lifecycle.
- [x] 3.2 Run `npm test`, `swift build`, `openspec validate align-electron-non-markdown-detail-mode-parity --strict`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.3 Record that final migration completion still requires actual signed/notarized release execution or an explicitly accepted OpenSpec deviation.
